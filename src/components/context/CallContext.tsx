import React, { createContext, useContext, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../utils/paths';

interface IncomingCall {
  from: string;
  fromUsername: string;
}

interface CallContextType {
  incomingCall: IncomingCall | null;
  setIncomingCall: React.Dispatch<React.SetStateAction<IncomingCall | null>>;
  acceptCall: () => void;
  rejectCall: () => void;
  socket: Socket | null;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

interface CallProviderProps {
  socket: Socket | null;
  userId: string;
  children: React.ReactNode;
}

export const CallProvider: React.FC<CallProviderProps> = ({ socket, userId, children }) => {
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!socket) return;

    socket.on('call-invitation', (data: { from: string; fromUsername: string; to: string }) => {
      if (data.to === userId) {
        console.log("Received call-invitation from:", data.from, data.fromUsername);
        // if (location.pathname === `${ROUTES.USER}${ROUTES.VIDEO_CHAT_PAGE}`) {
        //   // User is on VideoPage, auto-accept the call
        //   socket.emit('call-invitation-response', {
        //     to: data.from, 
        //     from: userId,
        //     accepted: true,
        //   });
        //   console.log("Auto-accepted call from:", data.from);
        //   navigate(`${ROUTES.USER}${ROUTES.VIDEO_CHAT_PAGE}`, {
        //     state: { incomingCall: { from: data.from, fromUsername: data.fromUsername }, isInitiator: false },
        //     replace: true,
        //   });
        //   setIncomingCall(null);
        // } else {
          // Show popup for other pages
          setIncomingCall({ from: data.from, fromUsername: data.fromUsername });
        // }
      }
    });

    socket.on('call-invitation-response', (data: { to: string; from: string; accepted: boolean }) => {
      if (data.to === userId && !data.accepted) {
        console.log("Call rejected by:", data.from);
        setIncomingCall(null);
      }
    });

    socket.on('end-call', (data: { to: string }) => {
      if (data.to === userId) {
        // console.log("Call ended by:", data.from);
        setIncomingCall(null);
      }
    });

    return () => {
      socket.off('call-invitation');
      socket.off('call-invitation-response');
      socket.off('end-call');
    };
  }, [socket, userId, location.pathname, navigate]);

  const acceptCall = () => {
    if (!incomingCall || !socket?.connected) {
      console.log("acceptCall failed: No incoming call or socket disconnected");
      setIncomingCall(null);
      return;
    }
    socket.emit('call-invitation-response', {
      to: incomingCall.from,
      from: userId,
      accepted: true,
    });
    console.log("Emitted call-invitation-response (accept) to:", incomingCall.from);
    socket.emit("callee-ready", { to: incomingCall.from, from: userId });

    navigate(`${ROUTES.USER}${ROUTES.VIDEO_CHAT_PAGE}`, {
      state: { incomingCall, isInitiator: false },
    });
    setIncomingCall(null);
  };

  const rejectCall = () => {
    if (!incomingCall || !socket?.connected) {
      console.log("rejectCall failed: No incoming call or socket disconnected");
      setIncomingCall(null);
      return;
    }
    socket.emit('call-invitation-response', { to: incomingCall.from, from: userId, accepted: false });
    console.log("Emitted call-invitation-response (reject) to:", incomingCall.from);
    setIncomingCall(null);
  };

  return (
    <CallContext.Provider value={{ incomingCall, setIncomingCall, acceptCall, rejectCall, socket }}>
      {children}
    </CallContext.Provider>
  );
};

export const useCallContext = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error('useCallContext must be used within a CallProvider');
  }
  return context;
};