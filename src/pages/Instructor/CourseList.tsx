import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import InstructorSidebar from "../../components/layout/InstructorSidebar";
import UserNavbar from "../../components/layout/UserNavbar";
import Pagination from "../../components/reusableComponents/Pagination";
import debounce from "lodash/debounce";
import { ROUTES } from "../../utils/paths";
import { fetchInstructorCourses, toggleCourseStatus } from "../../services/courseService";

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
  pricingOption?: "Premium" | "Free";
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
  isBlocked?: boolean;
}

const CourseList = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courseToToggle, setCourseToToggle] = useState<{
    id: string;
    action: "block" | "unblock";
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const limit = 6;

  const fetchCourses = useCallback(async (query: string, page: number) => {
    try {
      setError(null);
      console.log("Fetching courses...");
      const { courses, totalPages } = await fetchInstructorCourses(query, page, limit);
      console.log("Courses fetched:", courses);
      setCourses(courses);
      setTotalPages(totalPages);
    } catch (error: any) {
      console.error("Error fetching courses:", error);
      setError(
        error.response?.data?.message ||
          "Failed to load courses. Please try again."
      );
    }
  }, []);

  useEffect(() => {
    fetchCourses(searchQuery, currentPage);
  }, [searchQuery, currentPage, fetchCourses]);

  const handleToggleCourse = async (courseId: string, action: "block" | "unblock") => {
    try {
      await toggleCourseStatus(courseId);
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course._id === courseId
            ? { ...course, isBlocked: action === "block" }
            : course
        )
      );
      setIsModalOpen(false);
      setCourseToToggle(null);
    } catch (error: any) {
      console.error(`Error ${action}ing course:`, error);
      alert(
        error.response?.data?.message ||
          `Failed to ${action} course. Please try again.`
      );
    }
  };

  const openToggleModal = (courseId: string, action: "block" | "unblock") => {
    setCourseToToggle({ id: courseId, action });
    setIsModalOpen(true);
  };

  const closeToggleModal = () => {
    setIsModalOpen(false);
    setCourseToToggle(null);
  };

  const handleToggleAction = () => {
    if (!courseToToggle) return;
    handleToggleCourse(courseToToggle.id, courseToToggle.action);
  };

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchQuery(value);
      setCurrentPage(1);
    }, 500),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <UserNavbar />
      <div className="flex min-h-screen bg-gray-100">
        <InstructorSidebar />
        <div className="flex-1 p-6 lg:p-10 mt-14">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
              <h1 className="text-3xl font-bold text-gray-800">My Courses</h1>
              <div className="flex gap-4 w-full sm:w-auto">
                <input
                  type="text"
                  onChange={handleSearchChange}
                  placeholder="Search courses..."
                  className="px-4 py-2 border rounded-md w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={() => navigate("/instructor/AddCourse_Details")}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-full shadow-md hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  + Create Course
                </button>
              </div>
            </div>

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            {courses.length > 0 ? (
              <>
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
                        <h2 className="text-xl font-semibold text-gray-800 truncate">
                          {course.courseTitle}
                        </h2>
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
                            onClick={() =>
                              navigate(
                                `${ROUTES.INSTRUCTOR}${ROUTES.EDIT_COURSE}/${course._id}`
                              )
                            }
                            className="flex-1 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1"
                            disabled={course.isBlocked}
                          >
                            View/Edit
                          </button>
                          <button
                            onClick={() =>
                              openToggleModal(
                                course._id,
                                course.isBlocked ? "unblock" : "block"
                              )
                            }
                            className={`flex-1 py-2 text-white rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                              course.isBlocked
                                ? "bg-green-500 hover:bg-green-600 focus:ring-green-400"
                                : "bg-red-500 hover:bg-red-600 focus:ring-red-400"
                            }`}
                          >
                            {course.isBlocked ? "Unblock" : "Block"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
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
                <p className="mt-4 text-lg text-gray-500">
                  No courses found. Start by creating one!
                </p>
              </div>
            )}
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Confirm{" "}
                {courseToToggle?.action === "block" ? "Block" : "Unblock"}
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to{" "}
                {courseToToggle?.action === "block" ? "block" : "unblock"} this
                course?
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleToggleAction}
                  className={`flex-1 py-2 text-white rounded-md hover:${
                    courseToToggle?.action === "block"
                      ? "bg-red-700"
                      : "bg-green-700"
                  } transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                    courseToToggle?.action === "block"
                      ? "bg-red-600 focus:ring-red-500"
                      : "bg-green-600 focus:ring-green-500"
                  }`}
                >
                  Yes,{" "}
                  {courseToToggle?.action === "block" ? "Block" : "Unblock"}
                </button>
                <button
                  onClick={closeToggleModal}
                  className="flex-1 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseList;


