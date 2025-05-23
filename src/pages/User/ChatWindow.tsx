import { io, Socket } from "socket.io-client";
import axios, { isAxiosError } from "axios";
import { FormEvent, useEffect, useState, useRef } from "react";
import { Paperclip, Send } from "lucide-react";
import { UserChatList } from "./ChatList";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:5000";

interface Message {
  id: string;
  chatGroupId: string;
  senderId: string;
  content: string;
  fileUrl?: string;
  createdAt: string;
  senderName?: string;
  username?: string;
}

interface ChatWindowProps {
  selectedChat: UserChatList | null;
  userId: string;
  username: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ selectedChat, userId, username }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [socketError, setSocketError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<{ id: string; username: string }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  console.log(username, "455555");

  useEffect(() => {
    const newSocket = io(API_URL, {
      withCredentials: true,
      path: "/socket.io",
    });
    setSocket(newSocket);

    newSocket.emit("register", userId);

    newSocket.on("connect", () => {
      console.log("Connected to Socket.IO server");
      setSocketError(null);
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket.IO connect error:", err.message);
      setSocketError(`Failed to connect to chat server: ${err.message}`);
      if (err.message.includes("Invalid token")) {
        axios
          .post(`${API_URL}/auth/refresh`, {}, { withCredentials: true })
          .then((response) => {
            if (response.data.success) {
              console.log("Access token refreshed");
              setSocket(
                io(API_URL, {
                  withCredentials: true,
                  path: "/socket.io",
                })
              );
            } else {
              setSocketError("Session expired. Please log in again.");
            }
          })
          .catch(() => {
            setSocketError("Session expired. Please log in again.");
          });
      }
    });

    newSocket.on("error", (message: string) => {
      console.error("Socket.IO error:", message);
      setSocketError(message);
    });

    if (selectedChat && userId) {
      console.log("Joining chat:", selectedChat.id);
      const chatId = selectedChat.id;
      newSocket.emit("joinChat", { userId, chatGroupId: chatId });

      setLoading(true);
      axios
        .get<{ success: boolean; data: Message[] }>(
          `${API_URL}/student/messages/${chatId}`,
          { withCredentials: true }
        )
        .then((response) => {
          if (!response.data.success || !Array.isArray(response.data.data)) {
            throw new Error("Invalid message data");
          }
          console.log(response.data.data, "datttttttttttttttttttttt");
          setMessages(response.data.data);
          setError(null);
        })
        .catch((error: unknown) => {
          let message = "Failed to load messages";
          if (isAxiosError(error) && error.response) {
            if (error.response.status === 401) message = "Please log in to view messages";
            else if (error.response.status === 403) message = "Unauthorized to view this chat";
            else if (error.response.status === 500) message = "Server error, try again later";
          } else if (error instanceof Error) {
            message = `Network error: ${error.message}`;
          }
          setError(message);
        })
        .finally(() => setLoading(false));
    }

    newSocket.on("message", (message: Message) => {
      console.log("Received Socket.IO message:", message);
      setMessages((prevMessages) =>
        prevMessages.some((msg) => msg.id === message.id)
          ? prevMessages
          : [...prevMessages, message]
      );
    });

    newSocket.on("typing", ({ userId: typerId, username }: { userId: string; username: string }) => {
      if (typerId !== userId) {
        console.log("Typing:", { typerId, username });
        setIsTyping((prev) => {
          if (prev.some((item) => item.id === typerId)) return prev;
          return [...prev, { id: typerId, username }];
        });
      }
    });

    newSocket.on("stopTyping", ({ userId: typerId }: { userId: string }) => {
      console.log("Stop typing:", typerId);
      setIsTyping((prev) => prev.filter((item) => item.id !== typerId));
    });

    return () => {
      newSocket.disconnect();
    };
  }, [selectedChat, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleTyping = () => {
    console.log("User typing...");
    if (!socket || !selectedChat || !userId) return;

    socket.emit("typing", {
      userId,
      chatGroupId: selectedChat.id,
      username,
    });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket?.emit("stopTyping", { userId, chatGroupId: selectedChat.id });
    }, 2000);
  };

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() && !file) return;
    if (!selectedChat || !userId) return setError("No chat selected or user not logged in");

    let fileUrl: string | undefined;

    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const response = await axios.post<{ success: boolean; fileUrl: string }>(
          `${API_URL}/api/upload`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        );
        if (!response.data.success) throw new Error("Upload failed");
        fileUrl = response.data.fileUrl;
      } catch (error: unknown) {
        let message = "File upload failed";
        if (isAxiosError(error) && error.response) {
          if (error.response.status === 401) message = "Login to upload files";
          else if (error.response.status === 500) message = "Server error during upload";
        } else if (error instanceof Error) {
          message = `Network error: ${error.message}`;
        }
        return setError(message);
      }
    }

    try {
      const response = await axios.post<{ success: boolean; data: Message }>(
        `${API_URL}/student/messages/${selectedChat.id}`,
        { senderId: userId, content: newMessage, username, fileUrl },
        { withCredentials: true }
      );
      if (!response.data.success) throw new Error("Failed to send");

      setMessages((prevMessages) =>
        prevMessages.some((msg) => msg.id === response.data.data.id)
          ? prevMessages
          : [...prevMessages, response.data.data]
      );
      setNewMessage("");
      setFile(null);
      setError(null);
    } catch (error: unknown) {
      let message = "Failed to send message";
      if (isAxiosError(error) && error.response) {
        if (error.response.status === 401) message = "Login to send messages";
        else if (error.response.status === 403) message = "Unauthorized to send messages";
        else if (error.response.status === 500) message = "Server error, try again later";
      } else if (error instanceof Error) {
        message = `Network error: ${error.message}`;
      }
      setError(message);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-lg m-4">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">
          {selectedChat ? selectedChat.title : "Select a chat"}
        </h2>
      </div>
      <div className="flex-1 p-6 overflow-y-auto">
        {socketError && <p className="text-red-500 mb-4">{socketError}</p>}
        {loading && (
          <p className="text-gray-500 text-center animate-pulse">Loading messages...</p>
        )}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {isTyping.length > 0 && (
          <p className="text-gray-500 text-sm mb-2">
            {isTyping.map((item, index) => (
              <span key={item.id}>
                {item.username}
                {index < isTyping.length - 1 ? ", " : ""}
              </span>
            ))}{" "}
            {isTyping.length > 1 ? "are" : "is"} typing...
          </p>
        )}
        {!loading && !error && !socketError && messages.length === 0 ? (
          <p className="text-gray-500 text-center">No messages yet</p>
        ) : (
          messages.map((message) => {
            console.log("Rendering message:", message);
            const createdAtDate = new Date(message.createdAt);
            const isValidDate = !isNaN(createdAtDate.getTime());
            return (
              <div
                key={message.id}
                className={`mb-4 flex ${message.senderId === userId ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg shadow-sm ${
                    message.senderId === userId ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <p
                    className={`text-sm font-semibold ${
                      message.senderId === userId ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {message.username || message.senderName || (message.senderId === userId ? username : "Unknown User")}
                  </p>
                  <p className="text-sm">{message.content}</p>
                  {message.fileUrl && (
                    <div className="mt-2">
                      {message.fileUrl.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                        <img src={message.fileUrl} alt="Uploaded file" className="max-w-full rounded" />
                      ) : (
                        <a
                          href={message.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View File
                        </a>
                      )}
                    </div>
                  )}
                  <p className="text-xs mt-1 opacity-75">
                    {isValidDate ? createdAtDate.toLocaleTimeString() : "Invalid date"}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
      {selectedChat && (
        <form onSubmit={handleSendMessage} className="p-6 border-t border-gray-200">
          <div className="flex space-x-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                handleTyping();
              }}
              placeholder="Type a message..."
              className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              aria-label="Type a message"
            />
            <input
              type="file"
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              className="hidden"
              id="file-upload"
            />

            <button
              type="submit"
              className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
              aria-label="Send message"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        
          {file && <p className="text-sm text-gray-600 mt-2">Selected file: {file.name}</p>}
        </form>
      )}
    </div>
  );
};

export default ChatWindow;
