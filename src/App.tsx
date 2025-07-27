import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./redux/store";
import { useEffect, useState } from "react";
import { GetUserDetailsAction } from "./redux/actions/GetUserDetailsAction";
import { ModalProvider } from "./components/context/ModalContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CommonRoutes from "./routes/CommonRoutes";
import UserRoutes from "./routes/UserRoutes";
import InstructorRoutes from "./routes/InstructorRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import StudentRoutes from "./routes/StudentRoutes";
import NotFound from "./pages/common/404";
import { CallProvider } from "./components/context/CallContext";
import CallInvitationPopup from "./components/Forms/CallInvitationPopup";
import { io, Socket } from "socket.io-client";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { userDetails } = useSelector((state: RootState) => state.user);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(GetUserDetailsAction());

    if (!userDetails?._id) {
      console.log("App: No userDetails, skipping socket initialization");
      setSocket(null);
      setConnectionError(null);
      return;
    }

    const initializeSocket = () => {
      console.log("App: Initializing Socket.IO for user:", userDetails._id);
      const newSocket = io("http://localhost:5000", {
        withCredentials: true,
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      newSocket.on("connect", () => {
        console.log("App: Connected to Socket.IO server:", newSocket.id);
        newSocket.emit("register", userDetails._id);
        setSocket(newSocket);
        setConnectionError(null);
      });

      newSocket.on("connect_error", (error) => {
        console.error("App: Socket connection error:", error.message);
        setConnectionError("Failed to connect to server. Please try again.");
        setSocket(null);
      });

      newSocket.on("disconnect", () => {
        console.log("App: Socket disconnected");
        setConnectionError("Server disconnected. Attempting to reconnect...");
      });

      return () => {
        console.log("App: Cleaning up socket");
        newSocket.disconnect();
        setSocket(null);
      };
    };

    const cleanup = initializeSocket();
    return cleanup;
  }, [dispatch, userDetails?._id]);

  if (connectionError) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100 flex-col">
        <p className="text-gray-600">{connectionError}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <ModalProvider>
      <BrowserRouter>
        {socket && userDetails?._id ? (
          <CallProvider socket={socket} userId={userDetails._id}>
            <CallInvitationPopup />
            <Routes>
              <Route path="/*" element={<CommonRoutes />} />
              <Route path="/user/*" element={<UserRoutes />} />
              <Route path="/instructor/*" element={<InstructorRoutes />} />
              <Route path="/admin/*" element={<AdminRoutes />} />
              <Route path="/student/*" element={<StudentRoutes />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </CallProvider>
        ) : (
          <Routes>
            <Route path="/*" element={<CommonRoutes />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        )}
      </BrowserRouter>
    </ModalProvider>
  );
}

export default App;