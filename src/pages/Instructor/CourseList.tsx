import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InstructorSidebar from "../../components/layout/InstructorSidebar";
import axios from "axios";
import { config } from "../../configaration/Config";

// Define Course Interface
interface ICourse {
  _id: string;
  courseTitle: string;
  courseDescription?: string;
  categoryName?: string;
  aboutInstructor?: string;
  content?: {
    moduleTitle: string;
    lessons: {
      lessonTitle: string;
      lessonDescription?: string;
      video?: string;
    }[];
  }[];
  pricingOption?: "Premium" | "Free" | "Blocked"; // Added "Blocked" as a valid option
  price?: number;
  accountNumber?: number;
  additionalEmail?: string;
  additionalContactNumber?: string;
  user?: {
    _id: string;
    name: string;
  };
  thumbnailUrl?: string;
  rating?: number;
  reviews?: number;
}

const CourseList = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courseToBlock, setCourseToBlock] = useState<string | null>(null);
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        console.log("Fetching courses...");
        const response = await axios.get<{ data: ICourse[] }>(`${API_URL}/instructor/courses`, config);
        console.log("Courses fetched:", response.data.data);
        setCourses(response.data.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  const handleBlockCourse = async (courseId: string) => {
    try {
      const response = await axios.put(`${API_URL}/instructor/blockCourse/${courseId}`, {}, config);
      console.log("Course blocked:", response.data);
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course._id === courseId ? { ...course, pricingOption: "Blocked" } : course
        )
      );
      setIsModalOpen(false);
      setCourseToBlock(null);
    } catch (error) {
      console.error("Error blocking course:", error);
      alert("Failed to block course. Please try again.");
    }
  };

  const openBlockModal = (courseId: string) => {
    setCourseToBlock(courseId);
    setIsModalOpen(true);
  };

  const closeBlockModal = () => {
    setIsModalOpen(false);
    setCourseToBlock(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <InstructorSidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 lg:p-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">My Courses</h1>
            <button
              onClick={() => navigate("/instructor/AddCourse_Details")}
              className="px-6 py-2 bg-indigo-600 text-white rounded-full shadow-md hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              + Create Course
            </button>
          </div>

          {/* Courses Grid */}
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
                >
                  <img
                    src={course.thumbnailUrl || "/default-course.jpg"}
                    alt={course.courseTitle}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-5">
                    <h2 className="text-xl font-semibold text-gray-800 truncate">{course.courseTitle}</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Instructor: {course.user?.name || "Unknown"}
                    </p>
                    <div className="flex items-center mt-2">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm font-medium text-gray-700 ml-1">
                        {course.rating || 0} ({course.reviews || 0} Reviews)
                      </span>
                    </div>
                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => navigate(`/instructor/EditCourse/${course._id}`)}
                        className="flex-1 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1"
                        disabled={course.pricingOption === "Blocked"} // Disable if blocked
                      >
                        View/Edit
                      </button>
                      <button
                        onClick={() => openBlockModal(course._id)}
                        className={`flex-1 py-2 text-white rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                          course.pricingOption === "Blocked"
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-red-500 hover:bg-red-600 focus:ring-red-400"
                        }`}
                        disabled={course.pricingOption === "Blocked"} // Disable if already blocked
                      >
                        {course.pricingOption === "Blocked" ? "Blocked" : "Block"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <svg
                className="mx-auto h-16 w-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="mt-4 text-lg text-gray-500">No courses found. Start by creating one!</p>
            </div>
          )}
        </div>
      </div>

      {/* Block Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Block</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to block this course? This action cannot be undone without
              contacting support.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => handleBlockCourse(courseToBlock!)}
                className="flex-1 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
              >
                Yes, Block
              </button>
              <button
                onClick={closeBlockModal}
                className="flex-1 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseList;