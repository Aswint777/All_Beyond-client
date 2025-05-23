import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ChevronDown, ChevronUp, PlayCircle, Lock, User, DollarSign, CheckCircle } from "lucide-react";
import Hls from "hls.js";
import { config } from "../../configaration/Config";
import StudentSideBar from "../../components/layout/StudentSideBar";
import UserNavbar from "../../components/layout/UserNavbar";
import { HlsVideoPlayer } from "./Hls";
import CourseReview from "./CourseReview";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:5000";

interface Lesson {
  _id: string;
  lessonTitle: string;
  lessonDescription?: string;
  videoUrl?: string;
  video?: string;
  thumbnailUrl?: string;
  isLocked: boolean;
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

interface Progress { 
  percentage: number;
  completedLessons: string[];
  unlockedLessons: string[];
}

const fetchWithAuth = async (endpoint: string, method = "GET", data?: any) => {
  return axios({
    url: `${API_URL}/${endpoint}`,
    method,
    data,
    ...config,
  });
};

const WatchCourses: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [progressLoading, setProgressLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set());

  const fetchCourseAndProgress = async () => {
    setLoading(true);
    try {
      if (!courseId) throw new Error("Course ID is missing");

      console.log("Fetching course for ID:", courseId);
      const courseResponse = await fetchWithAuth(`student/WatchCourses/${courseId}`);
      const courseData: Course = courseResponse.data.data;
      console.log("Course API Response:", courseData);

      console.log("Fetching progress for course ID:", courseId);
      const progressResponse = await fetchWithAuth(`student/progress/${courseId}`);
      const progressData: Progress = progressResponse.data.data;
      console.log("Progress API Response:", progressData);

      const updatedCourse = {
        ...courseData,
        content: courseData.content.map((module) => ({
          ...module,
          lessons: module.lessons.map((lesson) => ({
            ...lesson,
            isLocked: !progressData.unlockedLessons.includes(lesson._id.toString()),
            videoUrl: lesson.video || lesson.videoUrl, 
          })),
        })),
      };

      setCourse(updatedCourse);
      console.log(updatedCourse, "javed");
      setProgress(progressData);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(
        err.response?.data?.message || "An error occurred while fetching course or progress details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchCourseAndProgress();
    }
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

  const handleVideoEnded = async (lessonId: string) => {
    if (!courseId) {
      console.error("Course ID is missing");
      return;
    }
    setProgressLoading(true);
    try {
      console.log(`Calling updateProgress API for lesson: ${lessonId}`);
      const response = await fetchWithAuth(`student/updateProgress/${courseId}`, "POST", {
        lessonId,
      });
      const updatedProgress: Progress = response.data.data;
      console.log("Update Progress API Response:", updatedProgress);
      fetchCourseAndProgress();

      const normalizedUnlockedLessons = updatedProgress.unlockedLessons.map((id: any) =>
        id.toString()
      );
      console.log("Normalized Unlocked Lessons:", normalizedUnlockedLessons);

      setProgress({
        percentage: updatedProgress.percentage,
        completedLessons: updatedProgress.completedLessons.map((id: any) => id.toString()),
        unlockedLessons: normalizedUnlockedLessons,
      });

      console.log(course, "javed before");

      setCourse((prev) => {
        if (!prev) {
          console.warn("Course state is null");
          return prev;
        }

        const newCourse = JSON.parse(JSON.stringify(prev));

        const completedLessonId = lessonId.toString();

        let nextModuleIndex = -1;
        let nextLessonIndex = -1;
        let found = false;

        for (let moduleIndex = 0; moduleIndex < newCourse.content.length; moduleIndex++) {
          const module = newCourse.content[moduleIndex];

          for (let lessonIndex = 0; lessonIndex < module.lessons.length; lessonIndex++) {
            const lesson = module.lessons[lessonIndex];

            if (found) {
              nextModuleIndex = moduleIndex;
              nextLessonIndex = lessonIndex;
              break;
            }

            if (lesson._id.toString() === completedLessonId) {
              if (lessonIndex === module.lessons.length - 1) {
                if (moduleIndex < newCourse.content.length - 1) {
                  nextModuleIndex = moduleIndex + 1;
                  nextLessonIndex = 0;
                }
              } else {
                nextModuleIndex = moduleIndex;
                nextLessonIndex = lessonIndex + 1;
              }
              found = true;
              break;
            }
          }

          if (found) break;
        }

        if (nextModuleIndex !== -1 && nextLessonIndex !== -1) {
          const nextLesson = newCourse.content[nextModuleIndex].lessons[nextLessonIndex];
          console.log(
            `Unlocking next lesson: ${nextLesson.lessonTitle} in module ${nextModuleIndex}`
          );

          nextLesson.isLocked = false;
        }

        return newCourse;
      });

      console.log(course, "javed after");
    } catch (err: any) {
      console.error("Error updating progress:", err);
      setError(err.response?.data?.message || "Failed to update progress. Please try again.");
    } finally {
      setProgressLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-pulse text-lg font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error || !course || !progress) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 font-medium">{error || "Course or progress not found"}</p>
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
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-800">Progress</h3>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${progress.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {progressLoading ? "Updating..." : `${progress.percentage}% Complete`}
                  </p>
                </div>
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
                        <span className="text-xl font-semibold text-gray-800">
                          {module.moduleTitle}
                        </span>
                        {expandedModules.has(moduleIndex) ? (
                          <ChevronUp className="w-6 h-6 text-blue-500" />
                        ) : (
                          <ChevronDown className="w-6 h-6 text-blue-500" />
                        )}
                      </button>
                      {expandedModules.has(moduleIndex) && (
                        <div className="pl-6 pt-4 pb-6">
                          {module.lessons.map((lesson) => {
                            const videoSource = lesson.videoUrl || lesson.video;
                            console.log(
                              `Rendering Lesson ${lesson._id} (${lesson.lessonTitle}): ` +
                                `isLocked=${lesson.isLocked}, ` +
                                `isEnrolled=${course.isEnrolled}, ` +
                                `hasVideo=${!!videoSource}, ` +
                                `videoUrl=${lesson.videoUrl}, ` +
                                `video=${lesson.video}`
                            );
                            return (
                              <div
                                key={lesson._id}
                                className="py-4 flex flex-col gap-4 border-l-4 border-blue-100 pl-4"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <PlayCircle className="w-5 h-5 text-blue-500" />
                                    <div>
                                      <p className="font-medium text-gray-800 text-lg">
                                        {lesson.lessonTitle}
                                      </p>
                                      {lesson.lessonDescription && (
                                        <p className="text-sm text-gray-500">
                                          {lesson.lessonDescription}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  {lesson.isLocked ? (
                                    <span title="Locked">
                                      <Lock className="w-5 h-5 text-gray-400" />
                                    </span>
                                  ) : progress.completedLessons.includes(lesson._id) ? (
                                    <span title="Completed">
                                      <CheckCircle className="w-5 h-5 text-green-500" />
                                    </span>
                                  ) : null}
                                </div>
                                {course.isEnrolled && videoSource && !lesson.isLocked ? (
                                  <div className="flex flex-col gap-2">
                                    <HlsVideoPlayer
                                      videoUrl={videoSource}
                                      poster={
                                        lesson.thumbnailUrl ||
                                        course.thumbnailUrl ||
                                        "/placeholder.png"
                                      }
                                      lessonTitle={lesson.lessonTitle}
                                      lessonId={lesson._id}
                                      onVideoEnded={handleVideoEnded}
                                    />
                                  </div>
                                ) : lesson.isLocked ? (
                                  <p className="text-gray-500 italic">
                                    Complete the previous lesson to unlock.
                                  </p>
                                ) : (
                                  <p className="text-gray-500 italic">
                                    No video available for this lesson.
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))
                )}
                {courseId && <CourseReview courseId={courseId} />}
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
                        {course.pricingOption === "Free"
                          ? "Free"
                          : `₹${course.price?.toLocaleString() || "N/A"}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-blue-500 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-800">Enrollment Status</h3>
                      <p
                        className={
                          course.isEnrolled
                            ? "text-green-600 font-medium"
                            : "text-red-600 font-medium"
                        }
                      >
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

export default WatchCourses;
