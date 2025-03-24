import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { config } from "../../configaration/Config";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import UserNavbar from "../../components/layout/UserNavbar";
import BasicNavbar from "../../components/layout/BasicNavbar";

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
  Price?: number;
  user?: {
    _id: string;
    name: string;
  };
  thumbnailUrl?: string;
  rating?: number;
  reviews?: number;
}

const CourseDetails: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<ICourse | null>(null);
  const [similarCourses, setSimilarCourses] = useState<ICourse[]>([]);

  const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
  const navigate = useNavigate();
  const { userDetails } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/auth/courseDetails/${courseId}`,
          config
        );
        console.log(response.data.data);
        
        setCourse(response.data.data);
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };
    const fetchSimilarCourses = async()=>{
      try {
        const response = await axios.get(
          `${API_URL}/auth/similarCourses/${courseId}`,
          config
        );
        console.log(response.data.data);
        setSimilarCourses(response.data.data)
      } catch (error) {
        console.error("Error fetching similar courses:", error);
      }
    }

    if (courseId) {
      fetchCourseDetails();
      fetchSimilarCourses()
    }
  }, [courseId]);

  if (!course) {
    return (
      <p className="text-center text-gray-500 mt-10">
        {userDetails ? <UserNavbar /> : <BasicNavbar />} Loading course details...
      </p>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {userDetails ? <UserNavbar /> : <BasicNavbar />}
      <div className="max-w-6xl mx-auto p-6">
        {/* Course Overview Section */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col lg:flex-row">
          <img
            src={course.thumbnailUrl || "/default-course.jpg"}
            alt={course.courseTitle}
            className="w-full lg:w-2/3 h-80 object-cover rounded-lg"
          />
          <div className="lg:ml-6 mt-4 lg:mt-0 flex flex-col justify-between">
            <h1 className="text-3xl font-bold text-gray-900">{course.courseTitle}</h1>
            <p className="text-gray-700 mt-2">Instructor: {course.user?.name || "Unknown"}</p>
            {/* <p className="text-lg text-gray-600 mt-4">{course.courseDescription}</p> */}
            <p className="text-sm font-bold mt-2">
                  ⭐ {course.rating || 0} ({course.reviews || 0} Reviews)
                </p>
            <p className="mt-4 font-semibold">Price: {course.pricingOption === "Premium" ? `₹${course.Price}` : "Free"}</p>
            <button className="mt-4 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700">
              Purchase Course
            </button>
          </div>
        </div>

        {/* Course Content */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold border-b pb-2">Course Content</h2>
          <p className="text-lg text-gray-600 mt-4">{course.courseDescription}</p>

          {course.content && course.content.length > 0 ? (
            <ul className="mt-3">
              {course.content.map((module, index) => (
                <li key={index} className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900">{module.moduleTitle}</h3>
                  <ul className="ml-4 list-disc text-gray-700">
                    {module.lessons.map((lesson, lessonIndex) => (
                      <li key={lessonIndex}>{lesson.lessonTitle}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No course content available.</p>
          )}
        </div>

        {/* Similar Courses */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold border-b pb-2">Similar Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {/* Placeholder for similar courses */}
            {similarCourses.map((course) => (
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

              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;




