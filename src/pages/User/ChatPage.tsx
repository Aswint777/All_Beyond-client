import { useState } from "react";
import { useSelector } from "react-redux";
import UserNavbar from "../../components/layout/UserNavbar";
import ChatList, { UserChatList } from "./ChatList";
import ChatWindow from "./ChatWindow";
import StudentSideBar from "../../components/layout/StudentSideBar";
import InstructorSidebar from "../../components/layout/InstructorSidebar";
import { RootState } from "../../redux/store";
import { Menu } from "lucide-react";

const ChatPage: React.FC = () => {
  const { userDetails, loading } = useSelector((state: RootState) => state.user);
  const [selectedChat, setSelectedChat] = useState<UserChatList | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  console.log(userDetails, "9999999999999999999999");

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600 animate-pulse text-lg font-medium">
          Loading...
        </p>
      </div>
    );
  }

  if (!userDetails?._id) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-red-600 text-lg font-medium">
          Please log in to access chats
        </p>
      </div>
    );
  }

  const userId = userDetails._id;
  const username = userDetails.username || "User";

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col font-sans">
      <UserNavbar />
      <div className="hidden md:block fixed top-14 left-0 w-[250px] h-[calc(100vh-56px)] bg-white shadow-xl z-20 transition-all duration-300">
        {userDetails.role === "student" ? (
          <StudentSideBar />
        ) : (
          <InstructorSidebar />
        )}
      </div>
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-16 left-4 z-30 p-2 bg-blue-600 text-white rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label="Toggle sidebar"
      >
        <Menu className="h-6 w-6" />
      </button>
      <div
        className={`md:hidden fixed top-14 left-0 w-[250px] h-[calc(100vh-56px)] bg-white shadow-xl z-20 transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {userDetails.role === "student" ? (
          <StudentSideBar />
        ) : (
          <InstructorSidebar />
        )}
      </div>
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
          aria-hidden="true"
        ></div>
      )}
      <div className="flex flex-1 mt-14">
        <div className="hidden md:block fixed top-14 left-[250px] w-[300px] h-[calc(100vh-56px)] bg-white shadow-xl rounded-r-2xl z-10 transition-all duration-300">
          <ChatList
            onSelectChat={setSelectedChat}
            selectedChatId={selectedChat?.id}
          />
        </div>
        <div
          className={`md:hidden fixed top-14 left-0 w-[300px] h-[calc(100vh-56px)] bg-white shadow-xl z-20 transform transition-transform duration-300 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <ChatList
            onSelectChat={(chat) => {
              setSelectedChat(chat);
              setIsSidebarOpen(false); 
            }}
            selectedChatId={selectedChat?.id}
          />
        </div>
        <div className="flex-1 ml-0 md:ml-[550px] lg:ml-[550px] overflow-auto p-4 sm:p-6">
          <div className="max-w-4xl mx-auto">
            <ChatWindow
              selectedChat={selectedChat}
              userId={userId}
              username={username}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;


