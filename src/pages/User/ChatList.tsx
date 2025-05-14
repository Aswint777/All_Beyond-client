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
}

interface ChatListProps {
  onSelectChat: (chat: UserChatList) => void;
  selectedChatId?: string;
}

const ChatList: React.FC<ChatListProps> = ({ onSelectChat, selectedChatId }) => {
  const [chats, setChats] = useState<UserChatList[]>([]);
  const [filteredChats, setFilteredChats] = useState<UserChatList[]>([]);
  const [lastMessages, setLastMessages] = useState<{ [chatId: string]: Message }>({});
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(API_URL, {
      withCredentials: true,
      path: "/socket.io",
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("ChatList connected to Socket.IO server");
    });

    newSocket.on("connect_error", (err) => {
      console.error("ChatList Socket.IO connect error:", err.message);
    });

    newSocket.on("message", (message: Message) => {
      console.log("ChatList received Socket.IO message:", message);
      const chatId = message.chatGroupId;
      setLastMessages((prev) => ({
        ...prev,
        [chatId]: {
          ...message,
          createdAt: new Date(message.createdAt).toISOString(),
        },
      }));
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_URL}/student/chatList`, {
          withCredentials: true,
        });

        const data = response.data.data;
        if (!Array.isArray(data)) {
          throw new Error("Invalid response format");
        }

        const isUserChatListArray = (items: any[]): items is UserChatList[] =>
          items.every(
            (item) =>
              typeof item.id === "string" &&
              typeof item.title === "string" &&
              (item.instructorId === undefined || typeof item.instructorId === "string") &&
              (item.chatGroupId === undefined || typeof item.chatGroupId === "string") &&
              Array.isArray(item.enrolledStudents) &&
              item.enrolledStudents.every((s: any) => typeof s === "string")
          );

        if (!isUserChatListArray(data)) {
          throw new Error("Invalid chat data format");
        }

        setChats(data);
        setFilteredChats(data);

        // Join chat rooms
        if (socket) {
          data.forEach((chat) => {
            const chatId = chat.chatGroupId || chat.id;
            console.log("Joining chat room:", chatId);
            socket.emit("joinChat", { userId: "chatList", chatGroupId: chatId });
          });
        }

        // Fetch last message for each chat
        const messagesPromises = data.map(async (chat) => {
          const chatId = chat.chatGroupId || chat.id;
          try {
            const messagesResponse = await axios.get<{ success: boolean; data: Message[] }>(
              `${API_URL}/student/messages/${chatId}`,
              { withCredentials: true }
            );
            if (messagesResponse.data.success && Array.isArray(messagesResponse.data.data)) {
              const messages = messagesResponse.data.data;
              if (messages.length > 0) {
                const lastMessage = messages.sort(
                  (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                )[0];
                return { chatId, message: lastMessage };
              }
            }
            return { chatId, message: null };
          } catch (error) {
            console.error(`Error fetching messages for chat ${chatId}:`, error);
            return { chatId, message: null };
          }
        });

        const messagesResults = await Promise.all(messagesPromises);
        const newLastMessages = messagesResults.reduce((acc, { chatId, message }) => {
          if (message) {
            acc[chatId] = message;
          }
          return acc;
        }, {} as { [chatId: string]: Message });

        setLastMessages(newLastMessages);
      } catch (error: any) {
        console.error("Error fetching chats:", error);
        const status = error.response?.status;
        let message = "Failed to load chats";
        if (status === 401) {
          message = "Please log in to view chats";
        } else if (status === 500) {
          message = "Server error, please try again later";
        } else {
          message = error.response?.data?.message || message;
        }
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [socket]);

  useEffect(() => {
    setFilteredChats(
      chats.filter((chat) =>
        chat.title.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, chats]);

  if (loading) {
    return (
      <div className="w-full md:w-80 bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-gray-800">Course Chats</h2>
        <p className="text-gray-500 mt-2 animate-pulse">Loading chats...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full md:w-80 bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-gray-800">Course Chats</h2>
        <p className="text-red-500 mt-2">{error}</p>
      </div>
    );
  }

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
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700"
            aria-label="Search course chats"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <p className="p-6 text-gray-500">No chats available</p>
        ) : (
          filteredChats.map((chat) => {
            const chatId = chat.chatGroupId || chat.id;
            const lastMessage = lastMessages[chatId];
            const messagePreview = lastMessage
              ? lastMessage.content
                ? lastMessage.content
                : lastMessage.fileUrl
                ? "File sent"
                : "No message content"
              : "No messages yet";
            return (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat)}
                className={`w-full text-left px-6 py-4 flex items-center space-x-3 hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0 focus:outline-none ${
                  selectedChatId === chat.id ? "bg-blue-50" : ""
                }`}
                aria-label={`Select chat for ${chat.title}`}
              >
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-800 truncate">
                    {chat.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 truncate">
                    {messagePreview}
                  </p>
                </div>
                <span className="text-xs text-blue-500 font-medium hidden">
                  New
                </span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChatList;













// import axios from "axios";
// import { useEffect, useState } from "react";
// import { SearchIcon } from "lucide-react";
// import { io, Socket } from "socket.io-client";

// const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:5000";

// export interface UserChatList {
//   id: string;
//   title: string;
//   instructorId?: string;
//   chatGroupId?: string;
//   enrolledStudents: string[];
// }

// interface Message {
//   id: string;
//   chatGroupId: string;
//   senderId: string;
//   content: string;
//   fileUrl?: string;
//   createdAt: string;
//   senderName?: string;
//   username?: string;
// }

// interface ChatListProps {
//   onSelectChat: (chat: UserChatList) => void;
//   selectedChatId?: string;
// }

// const ChatList: React.FC<ChatListProps> = ({ onSelectChat, selectedChatId }) => {
//   const [chats, setChats] = useState<UserChatList[]>([]);
//   const [filteredChats, setFilteredChats] = useState<UserChatList[]>([]);
//   const [lastMessages, setLastMessages] = useState<{ [chatId: string]: Message }>({});
//   const [search, setSearch] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [socket, setSocket] = useState<Socket | null>(null);

//   useEffect(() => {
//     const newSocket = io(API_URL, {
//       withCredentials: true,
//       path: "/socket.io",
//     });
//     setSocket(newSocket);

//     newSocket.on("connect", () => {
//       console.log("ChatList connected to Socket.IO server");
//     });

//     newSocket.on("message", (message: Message) => {
//       console.log("ChatList received Socket.IO message:", message);
//       setLastMessages((prev) => ({
//         ...prev,
//         [message.chatGroupId]: {
//           ...message,
//           createdAt: new Date(message.createdAt).toISOString(), // Normalize date
//         },
//       }));
//     });

//     return () => {
//       newSocket.disconnect();
//     };
//   }, []);

//   useEffect(() => {
//     const fetchChats = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const response = await axios.get(`${API_URL}/student/chatList`, {
//           withCredentials: true,
//         });

//         const data = response.data.data;
//         if (!Array.isArray(data)) {
//           throw new Error("Invalid response format");
//         }

//         // Type guard for UserChatList[]
//         const isUserChatListArray = (items: any[]): items is UserChatList[] =>
//           items.every(
//             (item) =>
//               typeof item.id === "string" &&
//               typeof item.title === "string" &&
//               (item.instructorId === undefined || typeof item.instructorId === "string") &&
//               (item.chatGroupId === undefined || typeof item.chatGroupId === "string") &&
//               Array.isArray(item.enrolledStudents) &&
//               item.enrolledStudents.every((s: any) => typeof s === "string")
//           );

//         if (!isUserChatListArray(data)) {
//           throw new Error("Invalid chat data format");
//         }

//         setChats(data);
//         setFilteredChats(data);

//         // Fetch last message for each chat
//         const messagesPromises = data.map(async (chat) => {
//           try {
//             const messagesResponse = await axios.get<{ success: boolean; data: Message[] }>(
//               `${API_URL}/student/messages/${chat.id}`,
//               { withCredentials: true }
//             );
//             if (messagesResponse.data.success && Array.isArray(messagesResponse.data.data)) {
//               const messages = messagesResponse.data.data;
//               if (messages.length > 0) {
//                 // Sort by createdAt to get the latest message
//                 const lastMessage = messages.sort(
//                   (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//                 )[0];
//                 return { chatId: chat.id, message: lastMessage };
//               }
//             }
//             return { chatId: chat.id, message: null };
//           } catch (error) {
//             console.error(`Error fetching messages for chat ${chat.id}:`, error);
//             return { chatId: chat.id, message: null };
//           }
//         });

//         const messagesResults = await Promise.all(messagesPromises);
//         const newLastMessages = messagesResults.reduce((acc, { chatId, message }) => {
//           if (message) {
//             acc[chatId] = message;
//           }
//           return acc;
//         }, {} as { [chatId: string]: Message });

//         setLastMessages(newLastMessages);
//       } catch (error: any) {
//         console.error("Error fetching chats:", error);
//         const status = error.response?.status;
//         let message = "Failed to load chats";
//         if (status === 401) {
//           message = "Please log in to view chats";
//         } else if (status === 500) {
//           message = "Server error, please try again later";
//         } else {
//           message = error.response?.data?.message || message;
//         }
//         setError(message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchChats();
//   }, []);

//   useEffect(() => {
//     setFilteredChats(
//       chats.filter((chat) =>
//         chat.title.toLowerCase().includes(search.toLowerCase())
//       )
//     );
//   }, [search, chats]);

//   if (loading) {
//     return (
//       <div className="w-full md:w-80 bg-white shadow-lg rounded-2xl p-6">
//         <h2 className="text-xl font-semibold text-gray-800">Course Chats</h2>
//         <p className="text-gray-500 mt-2 animate-pulse">Loading chats...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="w-full md:w-80 bg-white shadow-lg rounded-2xl p-6">
//         <h2 className="text-xl font-semibold text-gray-800">Course Chats</h2>
//         <p className="text-red-500 mt-2">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full md:w-80 bg-white shadow-lg rounded-2xl flex flex-col h-[calc(100vh-3.5rem)]">
//       <div className="p-6 border-b border-gray-200">
//         <h2 className="text-xl font-semibold text-gray-800">Course Chats</h2>
//       </div>
//       <div className="px-6 py-4">
//         <div className="relative">
//           <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//           <input
//             type="text"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search courses..."
//             className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700"
//             aria-label="Search course chats"
//           />
//         </div>
//       </div>
//       <div className="flex-1 overflow-y-auto">
//         {filteredChats.length === 0 ? (
//           <p className="p-6 text-gray-500">No chats available</p>
//         ) : (
//           filteredChats.map((chat) => {
//             const lastMessage = lastMessages[chat.id];
//             const messagePreview = lastMessage
//               ? lastMessage.content
//                 ? lastMessage.content
//                 : lastMessage.fileUrl
//                 ? "File sent"
//                 : "No message content"
//               : "No messages yet";
//             return (
//               <button
//                 key={chat.id}
//                 onClick={() => onSelectChat(chat)}
//                 className={`w-full text-left px-6 py-4 flex items-center space-x-3 hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0 focus:outline-none ${
//                   selectedChatId === chat.id ? "bg-blue-50" : ""
//                 }`}
//                 aria-label={`Select chat for ${chat.title}`}
//               >
//                 <div className="flex-1">
//                   <h3 className="text-sm font-medium text-gray-800 truncate">
//                     {chat.title}
//                   </h3>
//                   <p className="text-xs text-gray-500 mt-1 truncate">
//                     {messagePreview}
//                   </p>
//                 </div>
//                 <span className="text-xs text-blue-500 font-medium hidden">
//                   New
//                 </span>
//               </button>
//             );
//           })
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatList;











