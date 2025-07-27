import axios from "axios";
import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:5000";

interface VideoChatList {
  id: string;
  username: string;
  online: boolean;
  inCall: boolean; 
}

interface VideoCallListProps {
  onCall: (user: VideoChatList) => void;
  userId: string;
  socket: Socket | null;
}

const VideoCallList: React.FC<VideoCallListProps> = ({ onCall, userId, socket }) => {
  const [users, setUsers] = useState<VideoChatList[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/student/videoChatList`, {
          withCredentials: true,
        });
        console.log("Fetched users:", response.data);
        const data = response.data.data;
        setUsers(
          data.map((user: any) => ({
            id: user.id || user._id,
            username: user.username,
            online: user.online ?? false,
            inCall: false, 
          }))
        );
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("user-status", (data: { userId: string; online: boolean }) => {
      console.log("Received user-status:", data);
      setUsers((prev) =>
        prev.map((user) =>
          user.id === data.userId ? { ...user, online: data.online } : user
        )
      );
    });

    socket.on("user-in-call", (data: { userId: string }) => {
      console.log("Received user-in-call:", data);
      setUsers((prev) =>
        prev.map((user) =>
          user.id === data.userId ? { ...user, inCall: true } : user
        )
      );
    });

    socket.on("user-left-call", (data: { userId: string }) => {
      console.log("Received user-left-call:", data);
      setUsers((prev) =>
        prev.map((user) =>
          user.id === data.userId ? { ...user, inCall: false } : user
        )
      );
    });

    return () => {
      socket.off("user-status");
      socket.off("user-in-call");
      socket.off("user-left-call");
    };
  }, [socket]);

  return (
    <div className="w-full p-3 sm:p-4 bg-white shadow-md h-full">
      <h2 className="text-lg sm:text-xl font-semibold text-center mb-3 sm:mb-4 text-gray-800">
        Users
      </h2>
      <ul className="space-y-2">
        {users
          .filter((user) => user.id !== userId)
          .map((user) => (
            <li
              key={user.id}
              className="flex items-center justify-between py-2 px-2 sm:px-4 bg-gray-50 rounded-lg"
            >
              <span className="text-sm sm:text-base truncate">
                {user.username}{" "}
                {user.online ? user.inCall ? "(In Call)" : "(Online)" : "(Offline)"}
              </span>
              <button
                onClick={() => onCall(user)}
                disabled={!user.online || user.inCall}
                className={`px-2 py-1 rounded text-sm font-semibold ${
                  user.online && !user.inCall
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                } transition-colors duration-200`}
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