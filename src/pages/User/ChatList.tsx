import axios from "axios";
import { useEffect, useState } from "react";
import { ChatGroup } from "../../Interface/chat";

interface ChatListProps {
  onSelectChat: (chat: ChatGroup) => void;
  userId: string;
}

const ChatList: React.FC<ChatListProps> = ({ onSelectChat, userId }) => {
  const [chats, setChats] = useState<ChatGroup[]>([]);

  useEffect(() => {
    // Fetch user's chat groups
    axios
      .get(`/api/users/${userId}/chats`)
      .then((response) => {
        setChats(response.data);
      })
      .catch((error) => {
        console.error("Error fetching chats:", error);
      });
  }, [userId]);

  return (
    <div className="w-64 bg-white shadow-lg rounded-xl">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">Course Chats</h2>
      </div>
      <div className="overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat)}
            className="p-4 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
          >
            <h3 className="text-sm font-medium text-gray-800">{chat.courseTitle}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;