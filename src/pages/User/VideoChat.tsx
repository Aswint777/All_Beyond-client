

import React, { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { useLocation } from "react-router-dom";
import { useCallContext } from "../../components/context/CallContext";
import { VideoCameraIcon } from "@heroicons/react/24/outline";

interface VideoChatList {
  id: string;
  username: string;
  online: boolean;
}

interface VideoChatProps {
  socket: Socket 
  selectedUser: VideoChatList | null;
  username: string;
  userId: string;
}

const VideoChat: React.FC<VideoChatProps> = ({
  socket,
  selectedUser,
  username,
  userId,
}) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const [callStatus, setCallStatus] = useState<
    "idle" | "inviting" | "connecting" | "connected" | "failed"
  >("idle");
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [callPartner, setCallPartner] = useState<{
    id: string;
    username: string;
  } | null>(null);
  const { incomingCall, setIncomingCall } = useCallContext();
  const location = useLocation();
  const incomingCallFromLocation = location.state?.incomingCall || null;

  const initializePeerConnection = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate && callPartner && socket?.connected) {
        socket.emit("ice-candidate", {
          to: callPartner.id,
          from: userId,
          candidate: event.candidate,
        });
        console.log("Sent ICE candidate to:", callPartner.id);
      }
    };

    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
        setCallStatus("connected");
        console.log("Remote stream received");
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log("ICE connection state:", pc.iceConnectionState);
      if (["failed", "disconnected"].includes(pc.iceConnectionState)) {
        setCallStatus("failed");
        setErrorMessage("Connection failed. Please try again.");
        endCall();
      }
    };

    peerConnectionRef.current = pc;
    return pc;
  };

  const setupMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      setCameraActive(true);
      setErrorMessage(null);
      return stream;
    } catch (error: any) {
      console.error("setupMedia error:", error.message);
      setErrorMessage(`Failed to access media: ${error.message}. Please grant permissions.`);
      setCallStatus("failed");
      setCameraActive(false);
      return null;
    }
  };

  const startCall = async () => {
    if (!selectedUser || !socket?.connected) {
      setErrorMessage("Cannot start call. No user selected or server disconnected.");
      setCallStatus("failed");
      return;
    }

    if (!selectedUser.online) {
      setErrorMessage("User is offline.");
      setCallStatus("failed");
      return;
    }

    setCallPartner({ id: selectedUser.id, username: selectedUser.username });
    setCallStatus("inviting");

    try {
      socket.emit("call-invitation", {
        to: selectedUser.id,
        from: userId,
        fromUsername: username,
      });
      console.log("Sent call-invitation to:", selectedUser.id);
    } catch (error: any) {
      console.error("startCall error:", error.message);
      setErrorMessage("Failed to start call.");
      setCallStatus("failed");
      endCall();
    }
  };

  const sendOffer = async () => {
    try {
      const stream = await setupMedia();
      if (!stream) throw new Error("Failed to access media");

      const pc = initializePeerConnection();
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket!.emit("offer", {
        to: callPartner!.id,
        from: userId,
        offer,
        fromUsername: username,
      });
      console.log("Sent offer to:", callPartner!.id);

      const timeoutId = setTimeout(() => {
        if (callStatus === "connecting") {
          setErrorMessage("Call timed out.");
          setCallStatus("failed");
          endCall();
        }
      }, 15000);

      socket!.once("answer", () => clearTimeout(timeoutId));
    } catch (error: any) {
      console.error("sendOffer error:", error.message);
      setErrorMessage("Failed to send offer.");
      setCallStatus("failed");
      endCall();
    }
  };

  const acceptCall = async () => {
    const callData = incomingCall || incomingCallFromLocation;
    if (!callData || !socket?.connected) {
      setErrorMessage("No incoming call or server disconnected.");
      setCallStatus("failed");
      return;
    }

    setCallPartner({ id: callData.from, username: callData.fromUsername });
    setCallStatus("connecting");

    try {
      socket.emit("call-invitation-response", {
        to: callData.from,
        from: userId,
        accepted: true,
      });
      console.log("Sent call-invitation-response to:", callData.from);
      setIncomingCall(null);
    } catch (error: any) {
      console.error("acceptCall error:", error.message);
      setErrorMessage("Failed to accept call.");
      setCallStatus("failed");
      endCall();
    }
  };

  const endCall = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    if (callPartner && socket?.connected) {
      socket.emit("end-call", { to: callPartner.id, from: userId });
    }
    setCallStatus("idle");
    setCallPartner(null);
    setIncomingCall(null);
    setErrorMessage(null);
    setCameraActive(false);
    setIsMicMuted(false);
    setIsVideoOff(false);
    console.log("Call ended, state reset");
  };

  const toggleMic = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };


useEffect(() => {
  socket.emit("register", userId);
  const onDisconnect = () => {
    setCallStatus("failed");
    endCall();
  };
  socket.on("disconnect", onDisconnect);

  // ✅ Correct cleanup
  return () => {
    socket.off("disconnect", onDisconnect);
  };
}, [socket, userId]);



  useEffect(() => {
    if (selectedUser && callStatus === "idle") startCall();
  }, [selectedUser, callStatus]);

  useEffect(() => {
    const onResponse = (data: { from: string; to: string; accepted: boolean }) => {
      if (data.to !== userId || !callPartner || callPartner.id !== data.from) return;
      if (data.accepted) {
        setCallStatus("connecting");
        socket.emit("user-in-call", { userId });

        sendOffer();
      } else {
        setErrorMessage("Call rejected");
        socket.emit("user-left-call", { userId });

        endCall();
      }
    };
    socket.on("call-invitation-response", onResponse);
return () => {
  socket.off("call-invitation-response", onResponse);
};
  }, [socket, callPartner]);

  useEffect(() => {
    const handleOffer = async (data: any) => {
      if (data.to !== userId) return;
      setCallPartner({ id: data.from, username: data.fromUsername });
      const pc = initializePeerConnection();
      await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
      const stream = await setupMedia();
      if (!stream) return;
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
if (socket?.connected) {
  socket.emit("answer", { to: data.from, from: userId, answer });
}    };

    const handleAnswer = async (data: any) => {
      if (data.to !== userId || !peerConnectionRef.current) return;
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
    };

    const handleIce = async (data: any) => {
      if (data.to !== userId || !peerConnectionRef.current) return;
      await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
    };

    const handleEnd = (data: any) => {
      if (data.to === userId) endCall();
    };

    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("ice-candidate", handleIce);
    socket.on("end-call", handleEnd);
    return () => {
      socket.off("offer", handleOffer);
      socket.off("answer", handleAnswer);
      socket.off("ice-candidate", handleIce);
      socket.off("end-call", handleEnd);
    };
  }, [socket, userId]);

  useEffect(() => {
    const activeCall = incomingCall ?? incomingCallFromLocation;

if (activeCall && callStatus === "idle") {
      acceptCall();
    }
  }, [incomingCall, incomingCallFromLocation, callStatus]);

  useEffect(() => {
  socket.on("call-busy", (data) => {
    setErrorMessage("User is currently in another call.");
    setCallStatus("failed");
    endCall();
  });

  return () => {
    socket.off("call-busy");
  };
}, [socket]);



  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center bg-gray-100 min-h-[calc(100vh-3.5rem)] p-4 sm:p-6">
      {callStatus === "idle" && !callPartner ? (
        <div className="flex flex-col items-center text-center bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
          <VideoCameraIcon className="h-16 w-16 text-blue-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Video Call</h2>
          <p className="text-sm text-gray-600">Select a user to start a call.</p>
        </div>
      ) : (
        <>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 text-center">
            {callStatus === "inviting"
              ? `Calling ${callPartner?.username}...`
              : callStatus === "connecting"
              ? `Connecting to ${callPartner?.username}...`
              : callStatus === "connected"
              ? `In Call with ${callPartner?.username}`
              : `Call Failed`}
          </h2>
          <div className="relative w-full h-64 sm:h-80 md:h-96 max-w-3xl bg-black rounded-lg shadow-lg overflow-hidden">
            {(callStatus === "inviting" || callStatus === "connecting") && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="border-4 border-t-blue-600 rounded-full w-12 h-12 animate-spin"></div>
              </div>
            )}
            <video
              ref={remoteVideoRef}
              autoPlay
              className="w-full h-full object-cover"
            />
            {cameraActive && (
              <div className="absolute bottom-4 right-4 w-24 sm:w-32 h-16 sm:h-20 border-2 border-white rounded overflow-hidden">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 bg-gray-800 text-white text-xs px-1 py-0.5">You</div>
              </div>
            )}
            <div className="absolute bottom-4 left-4 bg-gray-800 text-white px-2 py-1 rounded text-sm">
              {callPartner?.username || "Remote"}
            </div>
          </div>
          {(callStatus === "connecting" || callStatus === "connected") && callPartner && (
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              <button
                onClick={toggleMic}
                className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                  isMicMuted ? "bg-red-600" : "bg-blue-600"
                } text-white hover:bg-opacity-90 transition`}
              >
                {isMicMuted ? "Unmute Mic" : "Mute Mic"}
              </button>
              <button
                onClick={toggleVideo}
                className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                  isVideoOff ? "bg-red-600" : "bg-blue-600"
                } text-white hover:bg-opacity-90 transition`}
              >
                {isVideoOff ? "Video On" : "Video Off"}
              </button>
              <button
                onClick={endCall}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition"
              >
                End Call
              </button>
            </div>
          )}
          {errorMessage && (
            <div className="mt-4 text-red-600 text-sm text-center">
              {errorMessage}
              {errorMessage.includes("media") && (
                <button
                  onClick={setupMedia}
                  className="ml-2 px-3 py-1 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700"
                >
                  Retry
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VideoChat;













