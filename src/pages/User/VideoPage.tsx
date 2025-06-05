import React, { useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import { useSelector } from "react-redux";
import VideoChat from "./VideoChat";
import VideoCallList from "./VideoCallList";
import { RootState } from "../../redux/store";
import UserNavbar from "../../components/layout/UserNavbar";
import StudentSideBar from "../../components/layout/StudentSideBar";
import InstructorSidebar from "../../components/layout/InstructorSidebar";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

interface VideoChatList {
  id: string;
  username: string;
  online: boolean;
}

interface VideoPageProps {
  socket: Socket | null;
}

const VideoPage: React.FC<VideoPageProps> = ({ socket }) => {
  const { userDetails } = useSelector((state: RootState) => state.user);
  const [selectedUser, setSelectedUser] = useState<VideoChatList | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const userId = userDetails?._id || "";
  const username = userDetails?.username || "Unknown";

  useEffect(() => {
    console.log("VideoPage: userId, socket:", { userId, socket });

    if (!userId || !socket) {
      console.warn("No userId or socket, skipping socket handlers");
      setConnectionError(
        !userId ? "Please log in to access video calls." : "Server not connected."
      );
      return;
    }

    socket.on("connect", () => {
      console.log("VideoPage: Connected to Socket.IO server:", socket.id);
      socket.emit("register", userId);
      setConnectionError(null);
    });

    socket.on("connect_error", (error) => {
      console.error("VideoPage: Connection error:", error.message);
      setConnectionError("Failed to connect to server. Please try again.");
    });

    socket.on("error", (message) => {
      console.error("VideoPage: Socket error:", message);
      setConnectionError(message);
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("error");
    };
  }, [userId, socket]);

  const handleCall = (user: VideoChatList) => {
    console.log("Selected user for call:", user);
    setSelectedUser(user);
    setIsSidebarOpen(false);
  };

  const retryConnection = () => {
    setConnectionError(null);
    if (socket) socket.connect();
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!userId || !socket || connectionError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center flex-col p-4">
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full text-center">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {connectionError || "Connecting to server..."}
          </h2>
          {connectionError && (
            <button
              onClick={retryConnection}
              className="px-4 py-2 rounded-full bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors duration-300"
            >
              Retry Connection
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col font-sans">
      <UserNavbar />
      <div className="hidden md:block fixed top-14 left-0 w-48 h-[calc(100vh-3.5rem)] bg-white shadow-lg z-20">
        {userDetails?.role === "student" ? <StudentSideBar /> : <InstructorSidebar />}
      </div>
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-16 left-4 z-30 p-2 bg-blue-600 text-white rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label="Toggle sidebar"
      >
        <Bars3Icon className="h-5 w-5" />
      </button>
      <div
        className={`md:hidden fixed top-14 left-0 w-48 h-[calc(100vh-3.5rem)] bg-white shadow-lg z-20 transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {userDetails?.role === "student" ? <StudentSideBar /> : <InstructorSidebar />}
        <button
          onClick={toggleSidebar}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 md:hidden"
          aria-label="Close sidebar"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
          aria-hidden="true"
        ></div>
      )}
      <div className="flex-1 flex flex-col md:flex-row md:ml-64 pt-10 md:pt-14">
        <div className="w-full md:w-64 bg-white shadow-md md:shadow-lg md:h-[calc(100vh-3.5rem)] overflow-y-auto">
          <VideoCallList userId={userId} socket={socket} onCall={handleCall} />
        </div>
        <div className="flex-1 p-2 sm:p-4 md:p-6 bg-gray-100">
          <VideoChat
            socket={socket}
            selectedUser={selectedUser}
            username={username}
            userId={userId}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoPage;