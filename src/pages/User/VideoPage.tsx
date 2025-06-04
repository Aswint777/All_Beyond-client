// import React, { useState, useEffect } from 'react';
// import io, { Socket } from 'socket.io-client';
// import VideoChat from './VideoChat';
// import axios from 'axios';
// import { useSelector } from 'react-redux';
// // import { RootState } from '../../application/store';
// import VideoCallList from './VideoCallList';
// import { RootState } from '../../redux/store';

// interface VideoChatList {
//   id: string;
//   username: string;
//   online: boolean;
// }

// const VideoPage: React.FC = () => {
//   const { userDetails } = useSelector((state: RootState) => state.user);
//   const [selectedUser, setSelectedUser] = useState<VideoChatList | null>(null);
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const [connectionError, setConnectionError] = useState<string | null>(null);

//   const userId = userDetails?._id || '';
//   const username = userDetails?.username || 'Unknown';

//   useEffect(() => {
//     if (!userId) {
//       console.warn('No userId, skipping socket connection');
//       return;
//     }

//     const newSocket = io('http://localhost:5000', {
//       withCredentials: true,
//       transports: ['websocket', 'polling'],
//     });

//     newSocket.on('connect', () => {
//       console.log('Connected to Socket.IO server:', newSocket.id);
//       newSocket.emit('register', userId);
//       setConnectionError(null);
//       setSocket(newSocket);
//     });

//     newSocket.on('connect_error', async (error) => {
//       console.error('Connection error:', error.message);
//       setConnectionError('Failed to connect to server. Retrying...');
//       if (error.message.includes('Authentication error')) {
//         try {
//           const response = await axios.post(
//             'http://localhost:5000/auth/refresh',
//             {},
//             { withCredentials: true }
//           );
//           console.log('Token refresh response:', response.data);
//           if (response.data.success) {
//             newSocket.connect();
//           } else {
//             setConnectionError('Authentication failed. Please log in again.');
//             setSocket(null);
//           }
//         } catch (refreshError) {
//           console.error('Token refresh failed:', refreshError);
//           setConnectionError('Authentication failed. Please log in again.');
//           setSocket(null);
//         }
//       }
//     });

//     newSocket.on('error', (message) => {
//       console.error('Socket error:', message);
//       setConnectionError(message);
//     });

//     return () => {
//       newSocket.disconnect();
//       console.log('Socket disconnected');
//     };
//   }, [userId]);

//   const handleCall = (user: VideoChatList) => {
//     console.log('Selected user for call:', user);
//     setSelectedUser(user);
//   };

//   const retryConnection = () => {
//     setConnectionError(null);
//     setSocket(null);
//   };

//   if (!userId) {
//     return <div className="flex h-screen items-center justify-center bg-gray-100">Please log in to access video calls.</div>;
//   }

//   if (!socket || connectionError) {
//     return (
//       <div className="flex h-screen items-center justify-center bg-gray-100 flex-col">
//         <p className="text-gray-600">{connectionError || 'Connecting to server...'}</p>
//         {connectionError && (
//           <button
//             onClick={retryConnection}
//             className="mt-4 px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition"
//           >
//             Retry Connection
//           </button>
//         )}
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-screen bg-gray-100">
//       <VideoCallList onCall={handleCall} userId={userId} socket={socket} />
//       <VideoChat socket={socket} selectedUser={selectedUser} username={username} userId={userId} />
//     </div>
//   );
// };

// export default VideoPage;

// import React, { useState, useEffect } from 'react';
// import { Socket } from 'socket.io-client';
// import VideoChat from './VideoChat';
// import { useSelector } from 'react-redux';
// import VideoCallList from './VideoCallList';
// import { RootState } from '../../redux/store';
// import UserNavbar from '../../components/layout/UserNavbar';
// import StudentSideBar from '../../components/layout/StudentSideBar';
// import InstructorSidebar from '../../components/layout/InstructorSidebar';

// interface VideoChatList {
//   id: string;
//   username: string;
//   online: boolean;
// }

// interface VideoPageProps {
//   socket: Socket | null;
// }

// const VideoPage: React.FC<VideoPageProps> = ({ socket }) => {
//   const { userDetails } = useSelector((state: RootState) => state.user);
//   const [selectedUser, setSelectedUser] = useState<VideoChatList | null>(null);
//   const [connectionError, setConnectionError] = useState<string | null>(null);

//   const userId = userDetails?._id || '';
//   const username = userDetails?.username || 'Unknown';

//   useEffect(() => {
//     console.log(userId,socket);

//     if (!userId || !socket) {
//       console.warn('No userId or socket, skipping socket handlers');
//       setConnectionError(!userId ? 'Please log in to access video calls.' : 'Server not connected.');
//       return;
//     }

//     socket.on('connect', () => {
//       console.log('VideoPage: Connected to Socket.IO server:', socket.id);
//       socket.emit('register', userId);
//       setConnectionError(null);
//     });

//     socket.on('connect_error', (error) => {
//       console.error('VideoPage: Connection error:', error.message);
//       setConnectionError('Failed to connect to server. Please log in again.');
//     });

//     socket.on('error', (message) => {
//       console.error('VideoPage: Socket error:', message);
//       setConnectionError(message);
//     });

//     return () => {
//       socket.off('connect');
//       socket.off('connect_error');
//       socket.off('error');
//     };
//   }, [userId, socket]);

//   const handleCall = (user: VideoChatList) => {
//     console.log('Selected user for call:', user);
//     setSelectedUser(user);
//   };

//   const retryConnection = () => {
//     setConnectionError(null);
//     if (socket) socket.connect();
//   };

//   if (!userId || !socket || connectionError) {
//     return (
//       <div className="flex h-screen items-center justify-center bg-gray-100 flex-col">
//         <p className="text-gray-600">{connectionError || 'Connecting to server...'}</p>
//         {connectionError && (
//           <button
//             onClick={retryConnection}
//             className="mt-4 px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition"
//           >
//             Retry Connection
//           </button>
//         )}
//       </div>
//     );
//   }

//   return (
//         <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col font-sans">
//       <UserNavbar />
//       <div className="hidden md:block fixed top-14 left-0 w-[250px] h-[calc(100vh-56px)] bg-white shadow-xl z-20 transition-all duration-300">
//         {userDetails?.role === "student" ? (
//           <StudentSideBar />
//         ) : (
//           <InstructorSidebar />
//         )}
//       </div>
//     <div className="flex h-screen bg-gray-100">
//       <VideoCallList onCall={handleCall} userId={userId} socket={socket} />
//       <VideoChat socket={socket} selectedUser={selectedUser} username={username} userId={userId} />
//     </div>
//     </div>
//   );
// };

// export default VideoPage;

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
import { Menu } from "lucide-react";

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
        !userId
          ? "Please log in to access video calls."
          : "Server not connected."
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
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
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
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {connectionError || "Connecting to server..."}
          </h2>
          {connectionError && (
            <button
              onClick={retryConnection}
              className="px-6 py-2 rounded-full bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors duration-300"
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
      <div className="hidden md:block fixed top-14 left-0 w-[250px] h-[calc(100vh-56px)] bg-white shadow-xl z-20 transition-all duration-300">
        {userDetails?.role === "student" ? (
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
        {userDetails?.role === "student" ? (
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

      <div className="flex-1 flex flex-col md:ml-[0px] md:flex-row pt-12 md:pt-0 mt-14 pl-64">
        <VideoCallList userId={userId} socket={socket} onCall={handleCall} />

        <div className="flex-1 bg-gray-100 p-4 md:p-6">
          <VideoChat
            socket={socket}
            selectedUser={selectedUser}
            username={username}
            userId={userId}
          />
        </div>
      </div>
      {/* </div> */}
    </div>
  );
};

export default VideoPage;
