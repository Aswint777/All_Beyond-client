import axios from "axios";
import { useEffect, useState } from "react";
import { SearchIcon } from "lucide-react";
import { io, Socket } from "socket.io-client";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:5000";

export interface UserChatList {
  id: string;
  title: string;
  instructorId?: string;
  chatGroupId?: string;
  enrolledStudents: string[];
}

interface Message {
  id: string;
  chatGroupId: string;
  senderId: string;
  content: string;
  fileUrl?: string;
  createdAt: string;
  senderName?: string;
  username?: string;
  readBy?: string[];
}

interface ChatListProps {
  onSelectChat: (chat: UserChatList) => void;
  selectedChatId?: string;
  userId: string;
}

const ChatList: React.FC<ChatListProps> = ({ onSelectChat, selectedChatId, userId }) => {
  const [chats, setChats] = useState<UserChatList[]>([]);
  const [filteredChats, setFilteredChats] = useState<UserChatList[]>([]);
  const [lastMessages, setLastMessages] = useState<{ [chatId: string]: { message: Message; unreadCount: number } }>({});
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  // Set up Socket.IO
  useEffect(() => {    
    const newSocket: Socket = io(API_URL, {
      withCredentials: true,
      path: "/socket.io",
    });

    setSocket(newSocket);

    newSocket.on("connect", () => console.log("ChatList connected"));
    newSocket.on("connect_error", (err) => console.error("ChatList connect error:", err.message));

    // Handle new messages
    newSocket.on("message", (message: Message) => {
      console.log("Received new message:", message);
      const chatId = message.chatGroupId;
      setLastMessages((prev) => ({
        ...prev,
        [chatId]: {
          message: {
            ...message,
            createdAt: new Date(message.createdAt).toISOString(),
          },
          unreadCount: prev[chatId]?.unreadCount || 0,
        },
      }));
    });

    // Handle unread count updates
    newSocket.on("unreadCountUpdate", ({ userId: targetUserId, chatGroupId, unreadCount }) => {
      if (targetUserId !== userId) return; // Only update for this user
      console.log("Received unreadCountUpdate:", { userId: targetUserId, chatGroupId, unreadCount });
      setLastMessages((prev) => ({
        ...prev,
        [chatGroupId]: {
          ...prev[chatGroupId],
          unreadCount: unreadCount || 0,
        },
      }));
    });

    return () => {
      newSocket.disconnect();
    };
  }, [userId]);

  // Fetch chats and join rooms
  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('!!!!!!!!!!!!!!!!!');
        
        const response = await axios.get(`${API_URL}/student/chatList`, { withCredentials: true });
        const data = response.data.data;

        if (!Array.isArray(data)) throw new Error("Invalid response format");

        const isValid = (items: any[]): items is UserChatList[] =>
          items.every(
            (item) =>
              typeof item.id === "string" &&
              typeof item.title === "string" &&
              (item.instructorId === undefined || typeof item.instructorId === "string") &&
              (item.chatGroupId === undefined || typeof item.chatGroupId === "string") &&
              Array.isArray(item.enrolledStudents) &&
              item.enrolledStudents.every((s: any) => typeof s === "string")
          );

        if (!isValid(data)) throw new Error("Invalid chat data format");

        setChats(data);
        setFilteredChats(data);

        // Join chat rooms using the provided userId
        if (socket && userId) {
          data.forEach((chat) => {
            const chatId = chat.chatGroupId || chat.id;
            socket.emit("joinChat", { userId, chatGroupId: chatId });
          });
        }

        const results = await Promise.all(
          data.map(async (chat) => {
            const chatId = chat.chatGroupId || chat.id;
            try {
              const { data: msgData } = await axios.get(`${API_URL}/student/lastMessage/${chatId}`, {
                withCredentials: true,
              });
              if (msgData.success && msgData.data.lastMessage?.length > 0) {
                const last = msgData.data.lastMessage.sort(
                  (a: Message, b: Message) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                )[0];
                return { chatId, message: last, unreadCount: msgData.data.unreadCount };
              }
              return { chatId, message: null, unreadCount: msgData.data.unreadCount || 0 };
            } catch {
              return { chatId, message: null, unreadCount: 0 };
            }
          })
        );

        const messagesMap = results.reduce((acc, { chatId, message, unreadCount }) => {
          if (message) acc[chatId] = { message, unreadCount };
          return acc;
        }, {} as typeof lastMessages);

        setLastMessages(messagesMap);
      } catch (err: any) {
        let message = "Failed to load chats";
        if (err.response?.status === 401) message = "Please log in to view chats";
        else if (err.response?.status === 500) message = "Server error, please try again later";
        else message = err.response?.data?.message || message;
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [socket, userId]);

  useEffect(() => {
    setFilteredChats(
      chats.filter((chat) => chat.title.toLowerCase().includes(search.toLowerCase()))
    );
  }, [search, chats]);

  if (loading) return <div className="p-6">Loading chats...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="w-full md:w-80 bg-white shadow-lg rounded-2xl flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Course Chats</h2>
      </div>
      <div className="px-6 py-4">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <p className="p-6 text-gray-500">No chats available</p>
        ) : (
          filteredChats.map((chat) => {
            const chatId = chat.chatGroupId || chat.id;
            const preview =
              lastMessages[chatId]?.message?.content ||
              (lastMessages[chatId]?.message?.fileUrl ? "File sent" : "No messages yet");
            const unreadCount = lastMessages[chatId]?.unreadCount || 0;

            return (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat)}
                className={`w-full text-left px-6 py-4 flex items-center space-x-3 hover:bg-gray-100 border-b focus:outline-none ${
                  selectedChatId === chat.id ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-800 truncate">{chat.title}</h3>
                  <p className="text-xs text-gray-500 truncate">{preview}</p>
                </div>
                {unreadCount > 0 && (
                  <span className="text-xs text-blue-500 font-medium">{unreadCount} New</span>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChatList;