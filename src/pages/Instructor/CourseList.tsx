import React from "react";
import { useNavigate } from "react-router-dom";
import InstructorSidebar from "../../components/layout/InstructorSidebar";

const CourseList = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-3/4 border-r border-gray-300">
        <InstructorSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex justify-center items-center">
        <button
          className="border-2 border-gray-500 p-3 text-white bg-black rounded-full hover:bg-gray-800 transition duration-300"
          onClick={() => navigate("/instructor/AddCourse_Details")}
        >
          Create Course
        </button>
      </div>
    </div>
  );
};

export default CourseList;
