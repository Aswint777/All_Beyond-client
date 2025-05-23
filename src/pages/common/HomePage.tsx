import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import UserNavbar from "../../components/layout/UserNavbar";
import BasicNavbar from "../../components/layout/BasicNavbar";
import axios from "axios";

interface Course {
  _id: string;
  courseTitle: string;
  thumbnailUrl?: string;
  instructor: string 
  rating?: number;
  reviews?: number;
  createdAt: string;
}

interface CourseResponse {
  success: boolean;
  data: Course[];
}

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userDetails } = useSelector((state: RootState) => state.user);
  const [navbarKey, setNavbarKey] = useState(0);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (userDetails) {
      setNavbarKey(prevKey => prevKey + 1);
    }
  }, [userDetails]);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/userDetails`, {
        withCredentials: true, 
      });


    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const fetchLatestCourses = async () => {
    setLoading(true);
    try {
      const response = await axios.get<CourseResponse>(`${API_URL}/auth/latestCourses`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setCourses(response.data.data);
        setError(null);
      } else {
        throw new Error("Failed to fetch courses");
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Error fetching latest courses:", error);
      setError("Failed to load the latest courses. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
    fetchLatestCourses();
  }, []);

  return (
    <div>
      {userDetails ? <UserNavbar /> : <BasicNavbar />}

      <div className="relative w-full h-screen">
        <img
          src="\src\assets\images\shutterstock_1029674362-860x574.png"
          alt="Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center lg:justify-start px-4 lg:px-12 bg-black bg-opacity-30">
          <div className="text-center lg:text-left max-w-lg space-y-6 text-white">
            <h1 className="text-4xl font-bold leading-tight">
              <span className="text-green-500">Knowledge</span> at your fingertips
            </h1>
            <p className="text-gray-200">
              Unlock your potential with top-notch resources and expert guidance to elevate your learning experience.
            </p>
          </div>
        </div>
      </div>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Latest Courses
          </h2>
          {loading ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-500"></div>
            </div>
          ) : error ? (
            <p className="text-red-600 text-center text-lg">{error}</p>
          ) : courses.length === 0 ? (
            <p className="text-gray-600 text-center text-lg">No courses available at the moment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="shadow-md rounded-lg overflow-hidden bg-slate-200"
                >
                  <img
                    src={course.thumbnailUrl || "/default-course.jpg"}
                    alt={course.courseTitle}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {course.courseTitle}
                    </h2>
                    <p className="text-sm text-gray-600">
                      Instructor: {course.instructor || "Jane Smith"}
                    </p>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Why Choose All Beyond?
          </h2>
          <div className="flex flex-col sm:flex-row justify-around items-center space-y-8 sm:space-y-0">
            <div className="text-center">
              <p className="text-4xl font-bold text-green-500">10,000+</p>
              <p className="text-gray-600 mt-2">Students Enrolled</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-green-500">500+</p>
              <p className="text-gray-600 mt-2">Courses Available</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-green-500">200+</p>
              <p className="text-gray-600 mt-2">Expert Instructors</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Start Your Learning Journey Today!
          </h2>
          <p className="text-gray-600 mb-8">
            Explore a wide range of courses and take the first step towards achieving your goals.
          </p>
          <button className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition-colors duration-200 text-lg font-semibold">
            Explore Courses
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;