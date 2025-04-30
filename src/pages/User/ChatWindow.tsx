import { io, Socket } from "socket.io-client";

import axios from "axios";
import { FormEvent, useEffect, useState } from "react";
import { ChatGroup, Message } from "../../Interface/chat";

interface ChatWindowProps {
  selectedChat: ChatGroup | null;
  userId: string;
}
 
const ChatWindow: React.FC<ChatWindowProps> = ({ selectedChat, userId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Initialize socket
    const newSocket = io("http://localhost:5000", {
      query: { userId },
    });
    setSocket(newSocket);

    newSocket.emit("register", userId);

    // Join chat group
    if (selectedChat) {
      newSocket.emit("joinChat", { userId, chatGroupId: selectedChat.id });

      // Fetch existing messages
      axios
        .get(`/api/messages/${selectedChat.id}`)
        .then((response) => {
          setMessages(response.data);
        })
        .catch((error) => {
          console.error("Error fetching messages:", error);
        });
    }

    // Listen for new messages
    newSocket.on("message", (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [selectedChat, userId]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() && !file) return;

    let fileUrl: string | undefined;
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const response = await axios.post("/api/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        fileUrl = response.data.fileUrl;
      } catch (error) {
        console.error("Error uploading file:", error);
        return;
      }
    }

    if (selectedChat) {
      try {
        await axios.post("/api/messages", {
          chatGroupId: selectedChat.id,
          senderId: userId,
          content: newMessage,
          fileUrl,
        });
        setNewMessage("");
        setFile(null);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">
          {selectedChat ? selectedChat.courseTitle : "Select a chat"}
        </h2>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${message.senderId === userId ? "text-right" : ""}`}
          >
            <div
              className={`inline-block p-3 rounded-lg ${
                message.senderId === userId
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              <p>{message.content}</p>
              {message.fileUrl && (
                <div className="mt-2">
                  {message.fileUrl.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                    <img
                      src={message.fileUrl}
                      alt="Uploaded file"
                      className="max-w-xs rounded"
                    />
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
                {new Date(message.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>
      {selectedChat && (
        <form onSubmit={handleSendMessage} className="p-4 border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="file"
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="p-2 bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300"
            >
              📎
            </label>
            <button
              type="submit"
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Send
            </button>
          </div>
          {file && (
            <p className="text-sm text-gray-600 mt-2">Selected file: {file.name}</p>
          )}
        </form>
      )}
    </div>
  );
};

export default ChatWindow;