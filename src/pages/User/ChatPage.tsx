import { useState } from "react";
import UserNavbar from "../../components/layout/UserNavbar";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import { ChatGroup } from "../../Interface/chat";

const ChatPage: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<ChatGroup | null>(null);
  const userId = "user123"; // Replace with actual user ID from auth context

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <UserNavbar />
      <div className="flex mt-14">
        <ChatList onSelectChat={setSelectedChat} userId={userId} />
        <ChatWindow selectedChat={selectedChat} userId={userId} />
      </div>
    </div>
  );
};

export default ChatPage;