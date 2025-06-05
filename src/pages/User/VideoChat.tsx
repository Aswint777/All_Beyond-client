import React, { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { useLocation } from "react-router-dom";
import { useCallContext } from "../../components/context/CallContext";

interface VideoChatList {
  id: string;
  username: string;
  online: boolean;
}

interface VideoChatProps {
  socket: Socket | null;
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
  const [isMounted, setIsMounted] = useState(false);
  const [needsMediaSetup, setNeedsMediaSetup] = useState(false);
  const [callPartner, setCallPartner] = useState<{
    id: string;
    username: string;
  } | null>(null);
  const { incomingCall, setIncomingCall } = useCallContext();
  const location = useLocation();
  const incomingCallFromLocation = location.state?.incomingCall || null;

  const initializePeerConnection = (): RTCPeerConnection => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate && callPartner && socket) {
        socket.emit("ice-candidate", {
          to: callPartner.id,
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
      if (
        pc.iceConnectionState === "failed" ||
        pc.iceConnectionState === "disconnected"
      ) {
        setCallStatus("failed");
        setErrorMessage("Connection failed. Please try again.");
      }
    };

    peerConnectionRef.current = pc;
    return pc;
  };

  const setupMedia = async () => {
    if (!isMounted || !socket?.connected) {
      console.warn("setupMedia: Not mounted or socket disconnected");
      return;
    }

    let attempts = 0;
    const maxAttempts = 10;
    while (!localVideoRef.current && attempts < maxAttempts) {
      console.warn(
        `localVideoRef.current is null, attempt ${attempts + 1}/${maxAttempts}`
      );
      await new Promise((resolve) => setTimeout(resolve, 100));
      attempts++;
    }

    if (!localVideoRef.current) {
      console.error("localVideoRef.current is still null after retries");
      setErrorMessage("Video element not found. Please refresh the page.");
      setCallStatus("failed");
      return;
    }

    try {
      console.log("setupMedia: Requesting media devices");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = stream;
      localVideoRef.current.srcObject = stream;
      console.log("setupMedia: Local video stream assigned");
      setCameraActive(true);
      setErrorMessage(null);
      return stream;
    } catch (error: any) {
      console.error(
        "setupMedia: Error accessing media devices:",
        error.name,
        error.message
      );
      setErrorMessage(
        `Failed to access camera or microphone: ${error.message}. Please grant permissions and try again.`
      );
      setCallStatus("failed");
      setCameraActive(false);
      throw error;
    }
  };

  const startCall = async () => {
    if (!selectedUser || !socket?.connected) {
      setErrorMessage(
        "Cannot start call. Server disconnected or no user selected."
      );
      setCallStatus("failed");
      console.warn("startCall failed:", {
        selectedUser,
        socketConnected: socket?.connected,
      });
      return;
    }

    if (!selectedUser.online) {
      setErrorMessage("User is offline. Cannot initiate call.");
      setCallStatus("failed");
      console.warn("startCall failed: User offline", {
        userId: selectedUser.id,
      });
      return;
    }

    setCallPartner({ id: selectedUser.id, username: selectedUser.username });
    setCallStatus("inviting");
    socket.emit("call-invitation", {
      to: selectedUser.id,
      fromUsername: username,
      from: userId,
    });
    console.log("Call invitation emitted:", {
      to: selectedUser.id,
      from: userId,
    });
  };

  const proceedWithCall = async () => {
    if (!callPartner || !peerConnectionRef.current || !socket) {
      console.warn("proceedWithCall failed:", {
        callPartner,
        peerConnection: !!peerConnectionRef.current,
        socket: !!socket,
      });
      setErrorMessage("Call setup failed. Please try again.");
      setCallStatus("failed");
      return;
    }

    setCallStatus("connecting");
    try {
      const stream = localStreamRef.current || (await setupMedia());
      if (!stream) return;
      stream.getTracks().forEach((track) => {
        if (
          peerConnectionRef.current &&
          !peerConnectionRef.current
            .getSenders()
            .some((sender) => sender.track === track)
        ) {
          peerConnectionRef.current.addTrack(track, stream);
        }
      });

      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      socket.emit("offer", { to: callPartner.id, offer });
      console.log("Offer sent:", { to: callPartner.id });
    } catch (error) {
      console.error("Error starting call:", error);
      setCallStatus("failed");
      setErrorMessage("Failed to initiate call.");
    }
  };

  const acceptCall = async () => {
    if (!incomingCall && !incomingCallFromLocation) {
      console.warn("acceptCall failed: No incoming call");
      setErrorMessage("No incoming call to accept.");
      setCallStatus("failed");
      return;
    }

    const callData = incomingCall || incomingCallFromLocation;
    if (!peerConnectionRef.current) {
      console.log("Initializing peer connection for call acceptance");
      initializePeerConnection();
    }

    setCallPartner({ id: callData.from, username: callData.fromUsername });
    setCallStatus("connecting");
    try {
      if (socket) {
        socket.emit("call-invitation-response", {
          to: callData.from,
          accepted: true,
        });
        console.log("Call accepted:", { to: callData.from });
      }
      setTimeout(() => setIncomingCall(null), 0);
      setNeedsMediaSetup(true);
    } catch (error) {
      console.error("Error accepting call:", error);
      setCallStatus("failed");
      setErrorMessage("Failed to accept call.");
      setTimeout(() => setIncomingCall(null), 0);
      setCallPartner(null);
    }
  };

  const rejectCall = () => {
    const callData = incomingCall || incomingCallFromLocation;
    if (callData && socket) {
      socket.emit("call-invitation-response", {
        to: callData.from,
        accepted: false,
      });
      console.log("Call rejected:", { to: callData.from });
      setTimeout(() => setIncomingCall(null), 0);
      setCallPartner(null);
      setCallStatus("idle");
    }
  };

  const endCall = () => {
    console.log("endCall: Ending call, cleaning up resources");
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
      console.log("endCall: Peer connection closed");
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        track.stop();
        console.log(`endCall: Stopped track: ${track.kind}`);
      });
      localStreamRef.current = null;
      console.log("endCall: Local stream cleared");
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
      console.log("endCall: Local video srcObject cleared");
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
      console.log("endCall: Remote video srcObject cleared");
    }
    if (callPartner && socket) {
      socket.emit("end-call", { to: callPartner.id });
      console.log("endCall: Call ended:", { to: callPartner.id });
      window.location.reload()
    }
    setCallStatus("idle");
    setIncomingCall(null);
    setErrorMessage(null);
    setCameraActive(false);
    setNeedsMediaSetup(false);
    setCallPartner(null);
    console.log("endCall: States reset:", {
      callStatus: "idle",
      cameraActive: false,
      needsMediaSetup: false,
    });
  };

  const toggleMic = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicMuted(!audioTrack.enabled);
        console.log("toggleMic: Mic toggled:", !audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
        console.log("toggleVideo: Video toggled:", !videoTrack.enabled);
      }
    }
  };

  const retryCamera = async () => {
    try {
      await setupMedia();
      console.log("retryCamera: Retry camera attempted");
    } catch (error) {
      console.error("retryCamera: Retry camera failed:", error);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    console.log("Component mounted");
    return () => {
      setIsMounted(false);
      endCall();
      console.log("Component unmounted");
    };
  }, []);

  useEffect(() => {
    if (!socket) {
      console.warn("Socket is not initialized, skipping event listeners");
      setErrorMessage("Server not connected. Please try again.");
      setCallStatus("failed");
      return;
    }

    console.log("useEffect: Socket handlers triggered:", {
      selectedUser,
      incomingCall,
      incomingCallFromLocation,
      userId,
      isMounted,
      callPartner,
    });

    socket.on("connect", () => {
      socket.emit("register", userId);
      console.log("Socket: Registered user:", userId);
      setErrorMessage(null);
    });

    socket.on("disconnect", () => {
      setErrorMessage("Server disconnected. Reconnecting...");
      setCallStatus("failed");
      console.log("Socket: Socket disconnected");
    });

    socket.on(
      "call-invitation-response",
      async (data: { to: string; accepted: boolean }) => {
        console.log("Socket: Call invitation response:", data);
        if (data.to === userId && callPartner) {
          if (data.accepted) {
            if (!peerConnectionRef.current) {
              initializePeerConnection();
            }
            await proceedWithCall();
          } else {
            setCallStatus("failed");
            setErrorMessage("Call invitation rejected.");
            endCall();
          }
        }
      }
    );

    socket.on(
      "offer",
      async (data: {
        from: string;
        to: string;
        offer: RTCSessionDescriptionInit;
      }) => {
        console.log("Socket: Received offer:", data);
        if (data.to === userId) {
          if (!peerConnectionRef.current) {
            initializePeerConnection();
          }
          try {
            if (peerConnectionRef.current) {
              await peerConnectionRef.current.setRemoteDescription(
                new RTCSessionDescription(data.offer)
              );
              const stream = localStreamRef.current || (await setupMedia());
              if (stream && peerConnectionRef.current) {
                stream.getTracks().forEach((track) => {
                  if (
                    !peerConnectionRef
                      .current!.getSenders()
                      .some((sender) => sender.track === track)
                  ) {
                    peerConnectionRef.current!.addTrack(track, stream);
                  }
                });
              }
              const answer = await peerConnectionRef.current.createAnswer();
              await peerConnectionRef.current.setLocalDescription(answer);
              socket.emit("answer", { to: data.from, answer });
              console.log("Socket: Sent answer:", { to: data.from });
            }
          } catch (error) {
            console.error("Socket: Error handling offer:", error);
            setCallStatus("failed");
            setErrorMessage("Failed to process call offer.");
          }
        }
      }
    );

    socket.on(
      "answer",
      async (data: {
        from: string;
        to: string;
        answer: RTCSessionDescriptionInit;
      }) => {
        console.log("Socket: Received answer:", data);
        if (data.to === userId && peerConnectionRef.current) {
          try {
            await peerConnectionRef.current.setRemoteDescription(
              new RTCSessionDescription(data.answer)
            );
            console.log("Socket: Set remote description for answer");
          } catch (error) {
            console.error("Socket: Error handling answer:", error);
            setCallStatus("failed");
            setErrorMessage("Failed to process call answer.");
          }
        }
      }
    );

    socket.on(
      "ice-candidate",
      async (data: {
        from: string;
        to: string;
        candidate: RTCIceCandidateInit;
      }) => {
        console.log("Socket: Received ICE candidate:", data);
        if (data.to === userId && peerConnectionRef.current) {
          try {
            await peerConnectionRef.current.addIceCandidate(
              new RTCIceCandidate(data.candidate)
            );
            console.log("Socket: Added ICE candidate");
          } catch (error) {
            console.error("Socket: Error handling ICE candidate:", error);
          }
        }
      }
    );

    socket.on("end-call", (data: { from: string; to: string }) => {
      console.log("Socket: Received end-call:", data);
      if (data.to === userId) {
        endCall();
      }
    });

    if (isMounted && !cameraActive && needsMediaSetup) {
      setupMedia().catch((error) => {
        console.error("useEffect: setupMedia failed:", error);
      });
    }

    if (
      isMounted &&
      selectedUser &&
      !incomingCall &&
      !incomingCallFromLocation &&
      callStatus === "idle"
    ) {
      startCall();
    }

    if (
      isMounted &&
      (incomingCall || incomingCallFromLocation) &&
      callStatus === "idle"
    ) {
      acceptCall();
    }

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("call-invitation-response");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("end-call");
    };
  }, [
    selectedUser,
    socket,
    incomingCall,
    incomingCallFromLocation,
    cameraActive,
    username,
    userId,
    isMounted,
    needsMediaSetup,
    callPartner,
    callStatus,
  ]);

  useEffect(() => {
    if (callStatus === "connecting" || callStatus === "connected") {
      console.log(
        "useEffect: Clearing incomingCall due to callStatus:",
        callStatus
      );
      setTimeout(() => setIncomingCall(null), 0);
    }
  }, [callStatus, setIncomingCall]);

  useEffect(() => {
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        console.log("Devices:", devices);
      })
      .catch((error) => {
        console.error("Error enumerating devices:", error);
      });
  }, []);

  console.log("Render:", {
    callStatus,
    incomingCall,
    incomingCallFromLocation,
    callPartner,
    cameraActive,
    isMicMuted,
  });

  return (
    <div className="w-full p-2 sm:p-4 md:p-6 flex flex-col items-center bg-gray-100 min-h-[calc(100vh-3.5rem)]">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 text-gray-800 text-center">
        {callStatus === "idle" && !callPartner
          ? "Select a User to Call"
          : callStatus === "inviting"
          ? `Waiting for ${callPartner?.username} to respond...`
          : callStatus === "connecting"
          ? `Connecting to ${callPartner?.username}...`
          : callStatus === "connected"
          ? `In Call with ${callPartner?.username}`
          : callStatus === "failed"
          ? "Call Failed"
          : `Calling ${callPartner?.username}`}
      </h2>
      <div className="relative w-full h-64 sm:h-80 md:h-96 max-w-2xl bg-black rounded-lg shadow-lg overflow-hidden">
        <video
          ref={remoteVideoRef}
          autoPlay
          className="w-full h-full object-cover rounded-none"
        />
        <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-gray-800 text-white px-1 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm">
          {callPartner?.username || "Remote"}
        </div>
        <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 w-24 sm:w-32 h-16 sm:h-20 border-2 border-white rounded overflow-hidden shadow-md">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 bg-gray-800 text-white text-xs px-1 py-0.5 rounded-t">
            You
          </div>
        </div>
      </div>
      {(callStatus === "connecting" || callStatus === "connected") &&
        callPartner && (
          <div className="mt-4 sm:mt-6 flex flex-wrap gap-2 sm:gap-4 justify-center">
            <button
              onClick={toggleMic}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold ${
                isMicMuted ? "bg-red-500" : "bg-blue-600"
              } text-white hover:bg-opacity-90 transition-colors`}
            >
              {isMicMuted ? "Unmute Mic" : "Mute Mic"}
            </button>
            <button
              onClick={toggleVideo}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold ${
                isVideoOff ? "bg-red-600" : "bg-blue-600"
              } text-white hover:bg-opacity-90 transition-colors`}
            >
              {isVideoOff ? "Turn Video On" : "Turn Video Off"}
            </button>
            <button
              onClick={endCall}
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              End Call
            </button>
          </div>
        )}
      {errorMessage && (
        <div className="mt-3 sm:mt-4 text-red-500 text-xs sm:text-sm flex flex-col sm:flex-row items-center gap-2 text-center">
          <span>{errorMessage}</span>
          {errorMessage.includes("camera") && (
            <button
              onClick={retryCamera}
              className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Retry Camera
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoChat;
