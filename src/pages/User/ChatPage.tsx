import { useState } from "react";
import { useSelector } from "react-redux";
import UserNavbar from "../../components/layout/UserNavbar";
import ChatList, { UserChatList } from "./ChatList";
import ChatWindow from "./ChatWindow";
import { RootState } from "../../redux/store";

const ChatPage: React.FC = () => {
  const { userDetails, loading } = useSelector((state: RootState) => state.user);
  const [selectedChat, setSelectedChat] = useState<UserChatList | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 animate-pulse">Loading...</p>
      </div>
    );
  }

  if (!userDetails?._id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-500">Please log in to access chats</p>
      </div>
    );
  }

  const userId = userDetails._id;
  const username = userDetails.username || "User"; // Ensure username is passed

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      <UserNavbar />
      <div className="flex flex-1 mt-14">
        
        {/* Fixed ChatList */}
        <div className="fixed top-14 left-0 w-[300px] h-[calc(100vh-56px)] bg-white shadow-lg md:block hidden">
          <ChatList onSelectChat={setSelectedChat} selectedChatId={selectedChat?.id} />
        </div>
        {/* ChatWindow with offset */}
        <div className="flex-1 ml-0 md:ml-[300px] overflow-auto">
          <ChatWindow selectedChat={selectedChat} userId={userId} username={username} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;






