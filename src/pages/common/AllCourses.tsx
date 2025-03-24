import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InstructorSidebar from "../../components/layout/InstructorSidebar";
import axios from "axios";
import { config } from "../../configaration/Config";
import UserNavbar from "../../components/layout/UserNavbar";
import BasicNavbar from "../../components/layout/BasicNavbar";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

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

const AllCourses = () => {
  const navigate = useNavigate();
  const { userDetails } = useSelector((state: RootState) => state.user);
    const [navbarKey, setNavbarKey] = useState(0)
  const [courses, setCourses] = useState<ICourse[]>([]);
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
    useEffect(() => {
      if (userDetails) {
        setNavbarKey(prevKey => prevKey + 1) 
      }
    }, [userDetails])

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        console.log("Fetching courses...");
        const response = await axios.get(
          `${API_URL}/auth/courses`,
          config
        );
        console.log("Courses fetched:", response.data.data);
        setCourses(response.data.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  const handleViewDetails=(courseId:string)=>{
    navigate(`/courseDetails/${courseId}`)
  }

  return (
    <div className="bg-violet-100">
      {userDetails ? <UserNavbar /> : <BasicNavbar />}

    <div className="flex min-h-screen">
      {/* Sidebar */}
      {/* <InstructorSidebar /> */}

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">All Courses</h1>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-3 gap-6 ">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white shadow-md rounded-lg overflow-hidden bg-slate-300"
            >
              <img
                src={course.thumbnailUrl || "/default-course.jpg"}
                alt={course.courseTitle}
                className="w-full h-40 object-cover"
              />{" "}
              {/* ✅ Uses thumbnailUrl */}
              <div className="p-4">
                <h2 className="text-lg font-semibold">{course.courseTitle}</h2>
                <p className="text-sm text-gray-600">
                  Instructor: {course.user?.name || "Unknown"}
                </p>
                <p className="text-sm font-bold mt-2">
                  ⭐ {course.rating || 0} ({course.reviews || 0} Reviews)
                </p>
                <button
                  onClick={() =>handleViewDetails(course._id) }
                  className="mt-3 block text-center w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
                >
                  View Course
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Courses Found */}
        {courses.length === 0 && (
          <p className="text-center text-gray-500 mt-10">No courses found.</p>
        )}
      </div>
    </div>
    </div>
  );
};

export default AllCourses;
