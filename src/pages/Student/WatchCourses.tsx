import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ChevronDown, ChevronUp, PlayCircle, Lock, User, DollarSign, CheckCircle } from "lucide-react";
import Hls from "hls.js";
import { config } from "../../configaration/Config";
import StudentSideBar from "../../components/layout/StudentSideBar";
import UserNavbar from "../../components/layout/UserNavbar";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:5000";

interface Lesson {
  lessonTitle: string;
  lessonDescription?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
}

interface Module {
  moduleTitle: string;
  lessons: Lesson[];
}

interface Course {
  _id: string;
  courseTitle: string;
  courseDescription?: string;
  instructorName: string;
  aboutInstructor?: string;
  thumbnailUrl?: string;
  pricingOption?: "Premium" | "Free";
  price?: number;
  content: Module[];
  isEnrolled: boolean;
}

const fetchWithAuth = async (endpoint: string, method = "GET") => {
  return axios({
    url: `${API_URL}/${endpoint}`,
    method,
    ...config,
  });
};

const WatchCourses: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        console.log("Fetching course for ID:", courseId);
        const response = await fetchWithAuth(`student/WatchCourses/${courseId}`);
        const result: Course = response.data.data;
        console.log("API Response:", result);
        setCourse(result);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.response?.data?.message || "An error occurred while fetching course details.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  const toggleModule = (index: number) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedModules(newExpanded);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-pulse text-lg font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 font-medium">{error || "Course not found"}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <UserNavbar />
      <div className="flex min-h-screen bg-gray-100">
        <StudentSideBar />
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 mt-16">
          <header className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center gap-6">
              {course.thumbnailUrl && (
                <img
                  src={course.thumbnailUrl}
                  alt={course.courseTitle}
                  className="w-32 h-32 object-cover rounded-xl shadow-md"
                />
              )}
              <div>
                <h1 className="text-4xl font-extrabold text-gray-900">{course.courseTitle}</h1>
                <p className="mt-2 text-gray-600 text-lg">{course.courseDescription}</p>
              </div>
            </div>
          </header>

          <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Course Content</h2>
                {course.content.length === 0 ? (
                  <p className="text-gray-500 italic">No content available</p>
                ) : (
                  course.content.map((module, moduleIndex) => (
                    <div key={moduleIndex} className="mb-4 last:mb-0">
                      <button
                        className="w-full flex justify-between items-center py-4 px-6 text-left bg-gradient-to-r from-blue-50 to-white rounded-xl hover:bg-blue-100 transition-all duration-200"
                        onClick={() => toggleModule(moduleIndex)}
                      >
                        <span className="text-xl font-semibold text-gray-800">{module.moduleTitle}</span>
                        {expandedModules.has(moduleIndex) ? (
                          <ChevronUp className="w-6 h-6 text-blue-500" />
                        ) : (
                          <ChevronDown className="w-6 h-6 text-blue-500" />
                        )}
                      </button>
                      {expandedModules.has(moduleIndex) && (
                        <div className="pl-6 pt-4 pb-6">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <div
                              key={lessonIndex}
                              className="py-4 flex flex-col gap-4 border-l-4 border-blue-100 pl-4"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <PlayCircle className="w-5 h-5 text-blue-500" />
                                  <div>
                                    <p className="font-medium text-gray-800 text-lg">{lesson.lessonTitle}</p>
                                    {lesson.lessonDescription && (
                                      <p className="text-sm text-gray-500">{lesson.lessonDescription}</p>
                                    )}
                                  </div>
                                </div>
                                {!course.isEnrolled && (
                                  <span title="Locked">
                                    <Lock className="w-5 h-5 text-gray-400" />
                                  </span>
                                )}
                              </div>
                              {course.isEnrolled && lesson.videoUrl && (
                                <div className="flex flex-col gap-2">
                                  <HlsVideoPlayer
                                    videoUrl={lesson.videoUrl}
                                    poster={lesson.thumbnailUrl || course.thumbnailUrl || "/placeholder.png"}
                                    lessonTitle={lesson.lessonTitle}
                                  />
                                </div>
                              )}
                              {course.isEnrolled && !lesson.videoUrl && (
                                <p className="text-gray-500 italic">No video available for this lesson.</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            <aside className="w-full lg:w-96 lg:sticky lg:top-4">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Details</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-3">
                    <User className="w-6 h-6 text-blue-500 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-800">Instructor</h3>
                      <p className="text-gray-600">{course.instructorName}</p>
                      {course.aboutInstructor && (
                        <p className="text-sm text-gray-500 mt-1">{course.aboutInstructor}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <DollarSign className="w-6 h-6 text-blue-500 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-800">Pricing</h3>
                      <p className="text-gray-600">
                        {course.pricingOption === "Free" ? "Free" : `₹${course.price?.toLocaleString() || "N/A"}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-blue-500 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-800">Enrollment Status</h3>
                      <p className={course.isEnrolled ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                        {course.isEnrolled ? "Enrolled" : "Not Enrolled"}
                      </p>
                    </div>
                  </div>
                  {!course.isEnrolled && course.pricingOption === "Premium" && (
                    <button
                      className="w-full bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-200"
                      onClick={() => alert("Redirect to enrollment/payment page")}
                    >
                      Enroll Now
                    </button>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

const HlsVideoPlayer: React.FC<{ videoUrl: string; poster: string; lessonTitle: string }> = ({
  videoUrl,
  poster,
  lessonTitle,
}) => {
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

    // Check if the video is an HLS playlist (.m3u8)
    const isHls = videoUrl.includes(".m3u8");

    if (isHls && Hls.isSupported()) {
      // HLS streaming
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

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error(`HLS error for ${lessonTitle}:`, data);
        setIsLoading(false);
        if (data.fatal) {
          setError(`Failed to load HLS video: ${data.details} (${data.type})`);
        }
      });

      return () => {
        hls.destroy();
      };
    } else if (isHls && video.canPlayType("application/vnd.apple.mpegurl")) {
      // Native HLS support (e.g., Safari)
      video.src = videoUrl;
      video.addEventListener("loadedmetadata", () => {
        console.log(`HLS metadata loaded for ${lessonTitle}`);
        setIsLoading(false);
      });
    } else {
      // MP4 or other non-HLS format (signed URL)
      video.src = videoUrl;
      video.addEventListener("loadedmetadata", () => {
        console.log(`MP4 metadata loaded for ${lessonTitle}`);
        setIsLoading(false);
      });

      // Log network errors
      video.addEventListener("error", (e) => {
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

    // Clean up event listeners
    return () => {
      video.removeEventListener("error", () => {});
      video.removeEventListener("loadedmetadata", () => {});
      video.src = "";
    };
  }, [videoUrl, lessonTitle]);

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

export default WatchCourses;
