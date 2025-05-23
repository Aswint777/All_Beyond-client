import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import UserNavbar from "../../components/layout/UserNavbar";
import StudentSideBar from "../../components/layout/StudentSideBar";
import Pagination from "../../components/reusableComponents/Pagination";
import { fetchStudentCourses } from "../../services/courseService";
import { ROUTES } from "../../utils/paths";

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

const StudentCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const limit = 6;

  const fetchCourses = useCallback(async (query: string, page: number) => {
    try {
      setError(null);
      console.log("Fetching enrolled courses...", { query, page });
      const { courses, totalPages } = await fetchStudentCourses(query, page, limit);
      console.log("Courses fetched:", courses);
      setCourses(courses);
      setTotalPages(totalPages);
    } catch (error: any) {
      console.error("Error fetching courses:", error);
      setError(
        error.response?.data?.message || "Failed to load enrolled courses. Please try again."
      );
    }
  }, []);

  useEffect(() => {
    fetchCourses(searchQuery, currentPage);
  }, [searchQuery, currentPage, fetchCourses]);

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

  const handleCourseClick = (courseId: string) => {
    navigate(`/student/WatchCourses/${courseId}`); 
  };

  return (
    <div>
      <UserNavbar />
      <div className="flex min-h-screen bg-gray-100">
        <StudentSideBar />
        <div className="flex-1 p-6 lg:p-10 mt-14">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
              <h1 className="text-3xl font-bold text-gray-800">My Enrolled Courses</h1>
              <div className="flex gap-4 w-full sm:w-auto">
                <input
                  type="text"
                  onChange={handleSearchChange}
                  placeholder="Search courses..."
                  className="px-4 py-2 border rounded-md w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            {courses.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course) => (
                    <div
                      key={course._id}
                      className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 cursor-pointer"
                      onClick={() => handleCourseClick(course._id)}
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
                        <p className="text-sm text-gray-600 mt-2">
                          {course.pricingOption === "Premium"
                            ? `₹${course.price}`
                            : "Free"}
                        </p>
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
                  No enrolled courses found. Enroll in a course to get started!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCourses;