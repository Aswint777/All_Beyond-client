import Hls from "hls.js";
import { useEffect, useRef, useState } from "react";

export const HlsVideoPlayer: React.FC<{
    videoUrl: string;
    poster: string;
    lessonTitle: string;
    lessonId: string;
    onVideoEnded: (lessonId: string) => void;
  }> = ({ videoUrl, poster, lessonTitle, lessonId, onVideoEnded }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
  
    useEffect(() => {
      if (!videoRef.current || !videoUrl) {
        setIsLoading(false);
        setError("No video URL provided");
        return;
      }
  
      const video = videoRef.current;
      console.log(`Attempting to load video: ${videoUrl} for ${lessonTitle}`);
  
      const handleEnded = () => {
        console.log(`Video ended for lesson: ${lessonTitle}`);
        onVideoEnded(lessonId);
      };
  
      video.addEventListener("ended", handleEnded);
  
      const isHls = videoUrl.includes(".m3u8");
  
      if (isHls && Hls.isSupported()) {
        const hls = new Hls({
          maxBufferLength: 30,
          maxMaxBufferLength: 60,
          lowLatencyMode: true,
        });
  
        hls.loadSource(videoUrl);
        hls.attachMedia(video);
  
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log(`HLS manifest parsed for ${lessonTitle}`);
          setIsLoading(false);
        });
  
        hls.on(Hls.Events.ERROR, (_, data) => {
          console.error(`HLS error for ${lessonTitle}:`, data);
          setIsLoading(false);
          if (data.fatal) {
            setError(`Failed to load HLS video: ${data.details} (${data.type})`);
          }
        });
  
        return () => {
          hls.destroy();
          video.removeEventListener("ended", handleEnded);
        };
      } else if (isHls && video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = videoUrl;
        video.addEventListener("loadedmetadata", () => {
          console.log(`HLS metadata loaded for ${lessonTitle}`);
          setIsLoading(false);
        });
      } else {
        video.src = videoUrl;
        video.addEventListener("loadedmetadata", () => {
          console.log(`MP4 metadata loaded for ${lessonTitle}`);
          setIsLoading(false);
        });
  
        video.addEventListener("error", () => {
          setIsLoading(false);
          const errorMessage = `Failed to load video: ${lessonTitle}. Error: ${video.error?.message || "Unknown error"} (Code: ${video.error?.code || "N/A"})`;
          console.error(errorMessage);
          fetch(videoUrl, { method: "HEAD" })
            .then((response) => {
              console.log(`Video URL response: ${videoUrl}`, {
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers.entries()),
              });
              if (!response.ok) {
                setError(`${errorMessage}. Server responded with ${response.status} ${response.statusText}`);
              }
            })
            .catch((fetchError) => {
              console.error(`Failed to fetch video URL: ${videoUrl}`, fetchError);
              setError(`${errorMessage}. Network error: ${fetchError.message}`);
            });
          setError(errorMessage);
        });
      }
  
      return () => {
        video.removeEventListener("ended", handleEnded);
        video.removeEventListener("error", () => {});
        video.removeEventListener("loadedmetadata", () => {});
        video.src = "";
      };
    }, [videoUrl, lessonTitle, lessonId, onVideoEnded]);
  
    if (error) {
      return (
        <div className="w-full h-72 bg-gray-200 rounded-lg flex items-center justify-center">
          <p className="text-red-500 font-medium">{error}</p>
        </div>
      );
    }
  
    return (
      <div className="relative w-full h-72">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 rounded-lg flex items-center justify-center">
            <div className="animate-pulse text-gray-600">Loading video...</div>
          </div>
        )}
        <video
          ref={videoRef}
          controls
          className="w-full h-72 rounded-lg shadow-md"
          poster={poster}
          onContextMenu={(e) => e.preventDefault()}
        >
          Your browser does not support the video tag.
        </video>
      </div>
    );
  };