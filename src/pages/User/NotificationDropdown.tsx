import React, { useState, useEffect } from "react";
import axios from "axios";
import { config } from "../../configaration/Config";
import io, { Socket } from "socket.io-client";
import { format } from "date-fns";
import { ROUTES } from "../../utils/paths";

interface Notification {
  _id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onUnreadCountUpdate?: (count: number) => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,

  userId,
  onUnreadCountUpdate,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [, setUnreadCount] = useState(0);
  const [, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!isOpen || !userId) return;

    // Fetch initial notifications
    const fetchNotifications = async () => {
      try {
        const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
        const response = await axios.get(
          `${API_URL}${ROUTES.STUDENT}${ROUTES.NOTIFICATIONS}`,
          config
        );
        console.log(response.data.data);
        
        const fetchedNotifications = response.data.data as Notification[];
        setNotifications(fetchedNotifications);
        const count = fetchedNotifications.filter((n) => !n.read).length;
        setUnreadCount(count);
        onUnreadCountUpdate?.(count);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };
    fetchNotifications();

    // Initialize WebSocket
    const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
    const newSocket = io(`${API_URL}/notifications`, {
      auth: { token: localStorage.getItem("jwtToken") },
    });
    setSocket(newSocket);

    // Listen for new notifications
    newSocket.on("newNotification", (notification: Notification) => {
      if (notification.userId === userId) {
        setNotifications((prev) => [notification, ...prev]);
        if (!notification.read) {
          setUnreadCount((prev) => {
            const newCount = prev + 1;
            onUnreadCountUpdate?.(newCount);
            return newCount;
          });
        }
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [isOpen, userId, onUnreadCountUpdate]);



  if (!isOpen) return null;

  return (
    <div className="absolute top-12 right-0 bg-white shadow-lg rounded-lg w-80 text-sm z-50 max-h-96 overflow-y-auto">
      <div className="flex justify-between items-center px-4 py-3 bg-gray-100 sticky top-0 z-10">
        <h3 className="font-semibold text-gray-800">Messages</h3>
        {/* {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-indigo-600 hover:text-indigo-800 text-xs"
          >
            Mark All as Read
          </button>
        )} */}
      </div>
      {notifications.length === 0 ? (
        <p className="px-4 py-4 text-gray-500 text-center">No messages</p>
      ) : (
        <div className="px-4 py-2 space-y-3">


          {notifications.slice(0, 10).map((notification) => (
            <div
              key={notification._id}
              className={`flex flex-col max-w-[70%] rounded-lg p-3 ${
                notification.read
                  ? "bg-gray-100 text-gray-600"
                  : "bg-indigo-50 text-gray-800"
              }`}
            >
              <p className="text-sm">{notification.message}</p>
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-400">
                  {format(new Date(notification.createdAt), "p, MMM d")}
                </p>
                {/* Double tick icon */}
                {notification.read && (
                  <svg
                    className="w-4 h-4 text-indigo-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
