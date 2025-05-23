import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import UserNavbar from "../../components/layout/UserNavbar";
import BasicNavbar from "../../components/layout/BasicNavbar";
import Pagination from "../../components/reusableComponents/Pagination";
import { fetchCourses, fetchCategories } from "../../services/courseService"; // Adjust path

interface ICourse {
  _id: string;
  courseTitle: string;
  courseDescription?: string;
  categoryName?: string;
  instructor?: string;
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
}

interface ICategory {
  _id: string;
  name: string;
  description: string;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const AllCourses: React.FC = () => {
  const navigate = useNavigate();
  const { userDetails } = useSelector((state: RootState) => state.user);
  const [navbarKey, setNavbarKey] = useState(0);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const limit = 6;

  useEffect(() => {
    if (userDetails) {
      setNavbarKey((prevKey) => prevKey + 1);
    }
  }, [userDetails]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoryData = await fetchCategories();
        setCategories(categoryData);
      } catch (error) {
        setError("Failed to load categories.");
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      try {
        const { courses, totalPages } = await fetchCourses(
          currentPage,
          limit,
          searchQuery,
          selectedCategory
        );
        console.log(courses,'!!!!!!!!');
        
        setCourses(courses);
        setTotalPages(totalPages);
        setError(null);
      } catch (error) {
        setCourses([]);
        setTotalPages(1);
        setError("Failed to load courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, [currentPage, searchQuery, selectedCategory]);

  const handleViewDetails = (courseId: string) => {
    navigate(`/courseDetails/${courseId}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {userDetails ? <UserNavbar key={navbarKey} /> : <BasicNavbar />}

      <div className="container mx-auto px-4 py-12 mt-11">
        <div className="mb-12 animate-fade-in-down">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-6">
            Explore Our Courses
          </h1>

          <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl shadow-lg">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full p-3 pl-10 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="w-full sm:w-64 p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-700 transition-all duration-300"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="text-center text-red-500 mb-8 animate-fade-in">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse"
                >
                  <div className="h-56 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course, index) => (
                <div
                  key={course._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative">
                    <img
                      src={course.thumbnailUrl || "/default-course.jpg"}
                      alt={course.courseTitle}
                      className="w-full h-56 object-cover transition-transform duration-300 hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/default-course.jpg";
                      }}
                    />
                    <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      {course.pricingOption || "N/A"}
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
                      {course.courseTitle}
                    </h2>
                    <p className="text-sm text-gray-600 mb-2">
                      Instructor: {course.instructor || course.user?.name || "Jane Smith"}
                    </p>

                    <div className="flex items-center mb-4">

                    </div>
                    <button
                      onClick={() => handleViewDetails(course._id)}
                      className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-2 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105"
                    >
                      Explore Course
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {courses.length === 0 && (
              <div className="text-center mt-12 animate-fade-in">
                <p className="text-xl text-gray-600 font-medium">
                  No courses found matching your criteria
                </p>
                <p className="text-gray-500 mt-2">
                  Try adjusting your search or category filter
                </p>
              </div>
            )}

            <div className="mt-12">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AllCourses;





