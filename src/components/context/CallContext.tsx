// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { Socket } from 'socket.io-client';
// import { useNavigate } from 'react-router-dom';

// interface IncomingCall {
//   from: string;
//   fromUsername: string;
// }

// interface CallContextType {
//   incomingCall: IncomingCall | null;
//   setIncomingCall: React.Dispatch<React.SetStateAction<IncomingCall | null>>;
//   acceptCall: () => void;
//   rejectCall: () => void;
// }

// const CallContext = createContext<CallContextType | undefined>(undefined);

// export const CallProvider: React.FC<{ socket: Socket; children: React.ReactNode }> = ({ socket, children }) => {
//   const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     socket.on('call-invitation', (data: { from: string; fromUsername: string; to: string }) => {
//       console.log('Global: Received call invitation:', data);
//       setIncomingCall({ from: data.from, fromUsername: data.fromUsername });
//     });

//     return () => {
//       socket.off('call-invitation');
//     };
//   }, [socket]);

//   const acceptCall = () => {
//     if (incomingCall) {
//       socket.emit('call-invitation-response', { to: incomingCall.from, accepted: true });
//       console.log('Global: Call accepted:', { to: incomingCall.from });
//       setTimeout(() => setIncomingCall(null), 0);
//       navigate('/video-call', { state: { incomingCall } });
//     }
//   };

//   const rejectCall = () => {
//     if (incomingCall) {
//       socket.emit('call-invitation-response', { to: incomingCall.from, accepted: false });
//       console.log('Global: Call rejected:', { to: incomingCall.from });
//       setTimeout(() => setIncomingCall(null), 0);
//     }
//   };

//   return (
//     <CallContext.Provider value={{ incomingCall, setIncomingCall, acceptCall, rejectCall }}>
//       {children}
//     </CallContext.Provider>
//   );
// };

// export const useCallContext = () => {
//   const context = useContext(CallContext);
//   if (!context) {
//     throw new Error('useCallContext must be used within a CallProvider');
//   }
//   return context;
// };

















import React, { createContext, useContext, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
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
  socket: Socket;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

export const CallProvider: React.FC<{ socket: Socket; children: React.ReactNode }> = ({ socket, children }) => {
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on('call-invitation', (data: { from: string; fromUsername: string; to: string }) => {
      console.log('Global: Received call invitation:', data);
      setIncomingCall({ from: data.from, fromUsername: data.fromUsername });
    });

    socket.on('end-call', (data: { from: string; to: string }) => {
      console.log('Global: Received end-call:', data);
      setIncomingCall(null);
    });

    socket.on('call-invitation-response', (data: { to: string; accepted: boolean }) => {
      if (!data.accepted) {
        console.log('Global: Call declined:', data);
        setIncomingCall(null);
      }
    });

    socket.on('disconnect', () => {
      console.log('Global: Socket disconnected');
      setIncomingCall(null);
    });

    return () => {
      socket.off('call-invitation');
      socket.off('end-call');
      socket.off('call-invitation-response');
      socket.off('disconnect');
    };
  }, [socket]);

  const acceptCall = () => {
    if (incomingCall && socket.connected) {
      socket.emit('call-invitation-response', { to: incomingCall.from, accepted: true });
      console.log('Global: Call accepted:', { to: incomingCall.from });
      setIncomingCall(null);
      navigate(`${ROUTES.USER}${ROUTES.VIDEO_CHAT_PAGE}`, { state: { incomingCall } });
    } else {
      console.warn('acceptCall: No incoming call or socket disconnected');
    }
  };

  const rejectCall = () => {
    if (incomingCall && socket.connected) {
      socket.emit('call-invitation-response', { to: incomingCall.from, accepted: false });
      console.log('Global: Call rejected:', { to: incomingCall.from });
      setIncomingCall(null);
    } else {
      console.warn('rejectCall: No incoming call or socket disconnected');
      setIncomingCall(null);
    }
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