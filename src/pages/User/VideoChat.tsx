import React, { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { useLocation, useNavigate } from "react-router-dom";
import { useCallContext } from "../../components/context/CallContext";
import { VideoCameraIcon } from "@heroicons/react/24/outline";
import { ROUTES } from "../../utils/paths";

interface VideoChatList {
  id: string;
  username: string;
  online: boolean;
}

interface CallData {
  to: string;
  from: string;
  fromUsername?: string;
  offer?: RTCSessionDescriptionInit;
  answer?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
  accepted?: boolean;
}

interface VideoChatProps {
  socket: Socket;
  username: string;
  userId: string;
}

const VideoChat: React.FC<VideoChatProps> = ({ socket, username, userId }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const pendingCandidates = useRef<RTCIceCandidateInit[]>([]);
  const navigate = useNavigate();

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
  const isInitiator = location.state?.isInitiator;
  const selectedUser = location.state?.selectedUser as VideoChatList | null;
  const incomingCallFromLocation = location.state?.incomingCall || null;

  const initializePeerConnection = () => {
    console.log("Initializing RTCPeerConnection");
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
          candidate: event.candidate.toJSON(),
        });
        console.log("Sent ICE candidate to:", callPartner.id, event.candidate);
      }
    };

    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        console.log("Received remote stream:", event.streams[0]);
        remoteVideoRef.current.srcObject = event.streams[0];
        setCallStatus("connected");
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log("ICE connection state:", pc.iceConnectionState);
      if (["failed", "disconnected"].includes(pc.iceConnectionState)) {
        setCallStatus("failed");
        setErrorMessage("WebRTC connection failed. Please try again.");
        endCall();
      }
    };

    peerConnectionRef.current = pc;
    return pc;
  };

  const setupMedia = async () => {
    try {
      console.log("Requesting media access");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        console.log("Local stream set on video element");
      }
      setCameraActive(true);
      setErrorMessage(null);
      return stream;
    } catch (error: any) {
      console.error("setupMedia error:", error.message);
      setErrorMessage(
        `Failed to access camera or microphone: ${error.message}. Please grant permissions and try again.`
      );
      setCallStatus("failed");
      setCameraActive(false);
      return null;
    }
  };

  const startCall = async () => {
    if (!selectedUser || !socket?.connected) {
      setErrorMessage(
        "Cannot start call. No user selected or server disconnected."
      );
      setCallStatus("failed");
      console.log("startCall failed: No user or socket");
      return;
    }

    if (!selectedUser.online) {
      setErrorMessage("User is offline.");
      setCallStatus("failed");
      console.log("startCall failed: User offline");
      return;
    }

    setCallPartner({ id: selectedUser.id, username: selectedUser.username });
    setCallStatus("inviting");
    console.log("Starting call to:", selectedUser);

    // ✅ Setup media here
    const stream = await setupMedia();
    if (!stream) {
      setErrorMessage("Failed to access media stream.");
      setCallStatus("failed");
      return;
    }

    try {
      socket.emit("call-invitation", {
        to: selectedUser.id,
        from: userId,
        fromUsername: username,
      });
      console.log("Emitted call-invitation to:", selectedUser.id);

      const timeoutId = setTimeout(() => {
        if (callStatus === "inviting") {
          setErrorMessage("Call timed out. No response from user.");
          setCallStatus("failed");
          endCall();
          console.log("Call timed out for:", selectedUser.id);
        }
      }, 30000);

      socket.once("call-invitation-response", () => {
        console.log("Received call-invitation-response, clearing timeout");
        clearTimeout(timeoutId);
      });
    } catch (error: any) {
      console.error("startCall error:", error.message);
      setErrorMessage("Failed to initiate call: " + error.message);
      setCallStatus("failed");
      endCall();
    }
  };

  const sendOffer = async () => {
    try {
      const stream = await setupMedia();
      if (!stream) {
        console.log("sendOffer failed: No media stream");
        throw new Error("Failed to access media");
      }

      const pc = initializePeerConnection();
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
        console.log("Added track:", track.kind);
      });

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      console.log("Created and set local offer:", offer);

      socket!.emit("offer", {
        to: callPartner!.id,
        from: userId,       
        offer,
        fromUsername: username,
      });
      console.log("Emitted offer to:", callPartner!.id, username);
    } catch (error: any) {
      console.error("sendOffer error:", error.message);
      setErrorMessage("Failed to send offer: " + error.message);
      setCallStatus("failed");
      endCall();
    }
  };

  const acceptCall = async () => {
    console.log(
      "function Accept call here ...!!!!!!!!!!!!!!"
    );

    const callData = incomingCall || incomingCallFromLocation;
    if (!callData || !socket?.connected) {
      setErrorMessage("No incoming call or server disconnected.");
      setCallStatus("failed");
      setIncomingCall(null);
      console.log("acceptCall failed: No call data or socket");
      return;
    }
  //    if (callAccepted) {
  //   console.log("Call already accepted, skipping...");
  //   return;
  // }

  // setCallAccepted(true); // prevent duplicate calls

    setCallPartner({ id: callData.from, username: callData.fromUsername });
    setCallStatus("connecting");
    console.log("Accepting call from:", callData.from);

    try {
      const pc = initializePeerConnection();
      const stream = await setupMedia();
      if (!stream) {
        console.log("acceptCall failed: No media stream");
        setErrorMessage("Failed to access media stream.");
        setCallStatus("failed");
        endCall();
        return;
      }
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
        console.log("Added track for answer:", track.kind);
      });

      socket.emit("callee-ready", {
        to: callData.from,
        from: userId,
      });
    } catch (error: any) {
      console.error("acceptCall error:", error.message);
      setErrorMessage("Failed to accept call: " + error.message);
      setCallStatus("failed");
      endCall();
    }
  };

  const endCall = () => {
    console.log("Ending call");
    try {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
        console.log("Closed RTCPeerConnection");
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          track.stop();
          console.log("Stopped track:", track.kind);
        });
        localStreamRef.current = null;
      }
      if (localVideoRef.current) localVideoRef.current.srcObject = null;
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
      if (callPartner && socket?.connected) {
        socket.emit("end-call", { to: callPartner.id, from: userId });
        console.log("Emitted end-call to:", callPartner.id);
      }
      if (socket?.connected) {
        socket.emit("user-left-call", { userId });
        // window.location.reload()
        console.log("Emitted user-left-call for:", userId);
      }
    } catch (error: any) {
      console.error("endCall error:", error.message);
    }
    setCallStatus("idle");
    setCallPartner(null);
    setIncomingCall(null);
    setErrorMessage(null);
    setCameraActive(false);
    setIsMicMuted(false);
    setIsVideoOff(false);
    navigate(`${ROUTES.USER}${ROUTES.VIDEO_CHAT_PAGE}`, {
      replace: true,
      state: {},
    });
    console.log("Call ended, state reset");
  };

  const toggleMic = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicMuted(!audioTrack.enabled);
        console.log("Mic toggled:", audioTrack.enabled ? "on" : "off");
      } else {
        console.log("No audio track available to toggle");
        `1`;
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
        console.log("Video toggled:", videoTrack.enabled ? "on" : "off");
      } else {
        console.log("No video track available to toggle");
      }
    }
  };

  useEffect(() => {
    if (!socket?.connected) {
      setErrorMessage("Server not connected. Please try again.");
      setCallStatus("failed");
      endCall();
      return;
    }

    const onResponse = (data: CallData) => {
      if (data.to !== userId || !callPartner || callPartner.id !== data.from) {
        console.log(
          "Ignoring call-invitation-response: Invalid recipient or partner",
          data
        );
        return;
      }
      console.log("Received call-invitation-response:", data);
      if (data.accepted) {
        setCallStatus("connecting");
        socket.emit("user-in-call", { userId });
        console.log("Emitted user-in-call for:", userId);
        // setTimeout(() => sendOffer(), 1000);
      } else {
        setErrorMessage("Call rejected by user.");
        socket.emit("user-left-call", { userId });
        endCall();
      }
    };

    const handleOffer = async (data: CallData) => {
      if (data.to !== userId) {
        console.log("Ignoring offer: Not for this user", data);
        return;
      }
      console.log("Received offer from:", data.from);
      setCallPartner({
        id: data.from,
        username: data.fromUsername || "Unknown",
      });
      const pc = initializePeerConnection();
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(data.offer!));
        console.log("Set remote description (offer)");
        for (const candidate of pendingCandidates.current) {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
          console.log("Added buffered ICE candidate");
        }
        pendingCandidates.current = [];
        const stream = await setupMedia();
        if (!stream) {
          console.log("handleOffer failed: No media stream");
          setErrorMessage("Failed to access media stream.");
          setCallStatus("failed");
          endCall();
          return;
        }
        stream.getTracks().forEach((track) => {
          pc.addTrack(track, stream);
          console.log("Added track for answer:", track.kind);
        });
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        console.log("Created and set local answer:", answer);
        if (socket?.connected) {
          socket.emit("answer", { to: data.from, from: userId, answer });
          console.log("Emitted answer to:", data.from);
        }
      } catch (error: any) {
        console.error("handleOffer error:", error.message);
        setErrorMessage("Failed to process offer: " + error.message);
        setCallStatus("failed");
        endCall();
      }
    };

    const handleAnswer = async (data: CallData) => {
      if (data.to !== userId || !peerConnectionRef.current) {
        console.log(
          "Ignoring answer: Invalid recipient or no peer connection",
          data
        );
        return;
      }
      try {
        await peerConnectionRef.current.setRemoteDescription(
          new RTCSessionDescription(data.answer!)
        );
        console.log("Set remote description (answer)");
        for (const candidate of pendingCandidates.current) {
          await peerConnectionRef.current.addIceCandidate(
            new RTCIceCandidate(candidate)
          );
          console.log("Added buffered ICE candidate");
        }
        pendingCandidates.current = [];
      } catch (error: any) {
        console.error("handleAnswer error:", error.message);
        setErrorMessage("Failed to process answer: " + error.message);
        setCallStatus("failed");
        endCall();
      }
    };

    const handleIce = async (data: CallData) => {
      if (data.to !== userId || !peerConnectionRef.current) {
        console.log(
          "Ignoring ICE candidate: Invalid recipient or no peer connection",
          data
        );
        return;
      }
      try {
        if (
          peerConnectionRef.current.remoteDescription &&
          peerConnectionRef.current.remoteDescription.type
        ) {
          await peerConnectionRef.current.addIceCandidate(
            new RTCIceCandidate(data.candidate!)
          );
          console.log("Added ICE candidate from:", data.from);
        } else {
          console.log("Buffering ICE candidate from:", data.from);
          pendingCandidates.current.push(data.candidate!);
        }
      } catch (error: any) {
        console.error("handleIce error:", error.message);
      }
    };

    const handleEnd = (data: CallData) => {
      if (data.to === userId) {
        console.log("Received end-call from:", data.from);
        setErrorMessage("Call ended by other user.");
        endCall();
      }
    };

    const handleBusy = (data: CallData) => {
      console.log("Received call-busy:", data);
      setErrorMessage("User is already in a call.");
      setCallStatus("failed");
      endCall();
    };
    const handleCalleeReady = (data: { to: string; from: string }) => {
      if (data.from === callPartner?.id && data.to === userId) {
        console.log("Received callee-ready from:", data.from);
        sendOffer(); 
      }
    };

    socket.on("call-invitation-response", onResponse);
    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("ice-candidate", handleIce);
    socket.on("end-call", handleEnd);
    socket.on("call-busy", handleBusy);
    socket.on("callee-ready", handleCalleeReady);

    return () => {
      socket.off("call-invitation-response", onResponse);
      socket.off("offer", handleOffer);
      socket.off("answer", handleAnswer);
      socket.off("ice-candidate", handleIce);
      socket.off("end-call", handleEnd);
      socket.off("call-busy", handleBusy);
      socket.off("callee-ready", handleCalleeReady);
    };
  }, [socket, userId, callPartner]);

  useEffect(() => {
    if (
      isInitiator &&
      callStatus === "idle" &&
      selectedUser &&
      socket?.connected &&
      !errorMessage
    ) {
      console.log("Triggering startCall for initiator!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1");
      startCall();
    }
    else if
    (
      (incomingCall || incomingCallFromLocation) &&
      callStatus === "idle" &&
      socket?.connected
    ) {
      console.log("Triggering acceptCall for callee !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!@@@@@@@@@@@@@@");
      acceptCall();
    }
  }, [
    isInitiator,
    callStatus,
    selectedUser,
    incomingCall,
    incomingCallFromLocation,
    socket,
    errorMessage,
  ]);

  // useEffect(() => {
  //   if (
  //     !isInitiator &&
  //     callStatus === "idle" &&
  //     incomingCallFromLocation &&
  //     socket?.connected
  //   ) {
  //     console.log("Triggering acceptCall from location.state in video page");
  //     acceptCall();
  //   }
  // }, [
  //   location.state, 
  //   callStatus,
  //   isInitiator,
  //   incomingCallFromLocation,
  //   socket,
  // ]);

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center bg-gray-100 min-h-[calc(100vh-3.5rem)] p-4 sm:p-6">
      {callStatus === "idle" && !callPartner ? (
        <div className="flex flex-col items-center text-center bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
          <VideoCameraIcon className="h-16 w-16 text-blue-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Video Call
          </h2>
          <p className="text-sm text-gray-600">
            Select a user from the list to start a call.
          </p>
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
              playsInline
              className="w-full h-full object-cover"
            />
            {cameraActive && (
              <div className="absolute bottom-4 right-4 w-24 sm:w-32 h-16 sm:h-20 border-2 border-white rounded overflow-hidden">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 bg-gray-800 text-white text-xs px-1 py-0.5">
                  You
                </div>
              </div>
            )}
            <div className="absolute bottom-4 left-4 bg-gray-800 text-white px-2 py-1 rounded text-sm">
              {callPartner?.username || "Remote"}
            </div>
          </div>
          {(callStatus === "connecting" || callStatus === "connected") &&
            callPartner && (
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
