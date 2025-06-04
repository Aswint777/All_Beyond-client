// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Socket } from 'socket.io-client';

// const API_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5000';

// interface VideoChatList {
//   id: string;
//   username: string;
//   online: boolean;
// }

// interface VideoChatListProps {
//   onCall: (user: VideoChatList) => void;
//   userId: string;
//   socket: Socket;
// }

// const VideoCallList: React.FC<VideoChatListProps> = ({ onCall, userId, socket }) => {
//   const [users, setUsers] = useState<VideoChatList[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchChatList = async () => {
//       try {
//         console.log('Fetching chat list for userId:', userId);
//         setLoading(true);
//         const response = await axios.get(`${API_URL}/student/videoChatList`, {
//           withCredentials: true,
//         });
//         console.log('Chat list response:', response.data);
//         const fetchedUsers = (response.data?.data || []).map((user: any) => ({
//           id: user.id,
//           username: user.username,
//           online: user.online ?? false,
//         }));
//         setUsers(fetchedUsers);
//         setError(null);
//       } catch (err: any) {
//         const errorMessage = err.response?.data?.message || 'Failed to fetch chat list.';
//         setError(errorMessage);
//         console.error('Error fetching chat:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (userId) {
//       fetchChatList();
//     } else {
//       console.warn('No userId provided');
//       setError('Please log in to view chat list.');
//       setLoading(false);
//     }
//   }, [userId]);

//   useEffect(() => {
//     socket.on('user-status', ({ userId: updatedUserId, online }: { userId: string; online: boolean }) => {
//       console.log('User status update:', { userId: updatedUserId, online });
//       setUsers((prevUsers) => {
//         const updatedUsers = prevUsers.map((user) =>
//           user.id === updatedUserId ? { ...user, online } : user
//         );
//         console.log('Updated users:', updatedUsers);
//         return updatedUsers;
//       });
//     });

//     socket.on('connect', () => {
//       console.log('Socket connected:', socket.id);
//     });

//     socket.on('disconnect', () => {
//       console.log('Socket disconnected');
//     });

//     return () => {
//       socket.off('user-status');
//       socket.off('connect');
//       socket.off('disconnect');
//     };
//   }, [socket]);

//   if (loading) {
//     return (
//       <div className="w-1/4 bg-white p-6 shadow-lg overflow-y-auto h-screen">
//         <h2 className="text-2xl font-bold mb-6 text-gray-700">Chat List</h2>
//         <p className="text-gray-500">Loading...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="w-1/4 bg-white p-6 shadow-lg overflow-y-auto h-screen">
//         <h2 className="text-2xl font-bold mb-6 text-gray-700">Chat List</h2>
//         <p className="text-red-600">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="w-1/4 bg-white p-6 shadow-lg overflow-y-auto h-screen">
//       <h2 className="text-2xl font-bold mb-6 text-gray-700">Chat List</h2>
//       {users.length === 0 ? (
//         <p className="text-gray-500">No users available.</p>
//       ) : (
//         <ul className="space-y-4">
//           {users.map((user) => (
//             <li
//               key={user.id}
//               className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow hover:bg-gray-100 transition"
//             >
//               <span className="text-lg font-medium text-gray-800">{user.username}</span>
//               <div className="flex items-center space-x-3">
//                 <span
//                   className={`w-3 h-3 rounded-full ${user.online ? 'bg-green-500' : 'bg-red-500'}`}
//                 ></span>
//                 <button
//                   onClick={() => {
//                     console.log('Calling user:', user);
//                     onCall(user);
//                   }}
//                   disabled={!user.online}
//                   className={`px-4 py-2 rounded-lg text-sm font-semibold ${
//                     user.online
//                       ? 'bg-blue-600 text-white hover:bg-blue-700'
//                       : 'bg-gray-300 text-gray-600 cursor-not-allowed'
//                   } transition`}
//                 >
//                   Call
//                 </button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default VideoCallList;











import axios from "axios";
import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

const API_URL =
  import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:5000";

interface VideoChatList {
  id: string;
  username: string;
  online: boolean;
}

interface VideoCallListProps {
  onCall: (user: VideoChatList) => void;
  userId: string;
  socket: Socket;
}

const VideoCallList: React.FC<VideoCallListProps> = ({
  onCall,
  userId,
  socket,
}) => {
  const [users, setUsers] = useState<VideoChatList[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/student/videoChatList`, {
          withCredentials: true,
        });
        console.log(response);

        const data = response.data.data;
        setUsers(
          data.map((user: any) => ({
            id: user.id || user._id,
            username: user.username,
            online: user.online ?? false, 
          }))
        );
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    socket.on("user-status", (data: { userId: string; online: boolean }) => {
      console.log("Received user-status:", data);
      setUsers((prev) =>
        prev.map((user) =>
          user.id === data.userId ? { ...user, online: data.online } : user
        )
      );
    });

    return () => {
      socket.off("user-status");
    };
  }, [socket]);

  return (
    <div className="w-1/4 p-4 bg-white shadow-lg">
      <h2 className="text-xl font-bold mb-4">Users</h2>
      <ul>
        {users
          .filter((user) => user.id !== userId)
          .map((user) => (
            <li
              key={user.id}
              className="flex items-center justify-between mb-2"
            >
              <span>
                {user.username} {user.online ? "(Online)" : "(Offline)"}
              </span>
              <button
                onClick={() => onCall(user)}
                disabled={!user.online}
                className={`px-2 py-1 rounded text-sm ${
                  user.online
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
              >
                Call
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default VideoCallList;
