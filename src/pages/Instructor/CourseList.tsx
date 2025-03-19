import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InstructorSidebar from "../../components/layout/InstructorSidebar";
import axios from "axios";

const CourseList = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  // useEffect(() => {
  //   const fetchCourses = async () => {
  //     try {
  //       const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
  //       const response = await axios.get(`${API_URL}/instructor/courses`);
  //       setCourses(response.data);
  //     } catch (error) {
  //       console.error("Error fetching courses:", error);
  //     }
  //   };

  //   fetchCourses();
  // }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
        <InstructorSidebar />

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Courses</h1>
          <button
            className="border-2 border-gray-500 p-3 text-white bg-black rounded-full hover:bg-gray-800 transition duration-300"
            onClick={() => navigate("/instructor/AddCourse_Details")}
          >
            Create Course
          </button>
        </div>

        {/* Course Grid */}
        {/* <div className="grid grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <img src={course.image} alt={course.title} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h2 className="text-lg font-semibold">{course.title}</h2>
                <p className="text-sm text-gray-600">{course.instructor}</p>
                <p className="text-sm font-bold mt-2">⭐ {course.rating} ({course.reviews} Reviews)</p>
                <button
                  onClick={() => navigate(`/course/${course.id}`)}
                  className="mt-3 block text-center w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
                >
                  View Course
                </button>
              </div>
            </div>
          ))}
        </div> */}

        {/* {courses.length === 0 && (
          <p className="text-center text-gray-500 mt-10">No courses found.</p>
        )} */}
      </div>
    </div>
  );
};

export default CourseList;
