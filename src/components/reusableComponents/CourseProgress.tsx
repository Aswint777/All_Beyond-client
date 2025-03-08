import React from 'react'
import { useNavigate } from 'react-router-dom';

const CourseProgress = () => {
  const navigate = useNavigate()
    const getActiveStage = () => {
        if (location.pathname.includes("AddCourse_Details")) return 1;
        if (location.pathname.includes("AddCourse_Content")) return 2;
        if (location.pathname.includes("AddCourse_Pricing")) return 3;
        return 1;
      };
      const activeStage = getActiveStage();

  return (
    <div>
              {/* Progress Map */}
              <div className="mb-6">
          <div className="flex justify-between mb-4">
            <div className="flex-1 flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-white ${
                  activeStage >= 1 ? "bg-violet-600" : "bg-gray-300"
                }`}
              >
                <button onClick={()=>navigate("/instructor/AddCourse_Details")}>1</button>
                
              </div>
              <div
                className={`flex-1 h-1 ${
                  activeStage >= 2 ? "bg-violet-600" : "bg-gray-300"
                }`}
              ></div>
            </div>

            <div className="flex-1 flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-white ${
                  activeStage >= 2 ? "bg-violet-600" : "bg-gray-300"
                }`}
              >
                <button onClick={()=>navigate("/instructor/AddCourse_Content")}>2</button>
              </div>
              <div
                className={`flex-1 h-1 ${
                  activeStage >= 3 ? "bg-violet-600" : "bg-gray-300"
                }`}
              ></div>
            </div>

            <div className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-white ${
                  activeStage >= 3 ? "bg-violet-600" : "bg-gray-300"
                }`}
              >
                <button onClick={()=>navigate("/instructor/AddCourse_Pricing")}>3</button>
              </div>
            </div>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span
              className={
                activeStage === 1 ? "font-semibold text-violet-600" : ""
              }
            >
              Course Details
            </span>
            <span
              className={
                activeStage === 2 ? "font-semibold text-violet-600" : ""
              }
            >
              Course Content
            </span>
            <span
              className={
                activeStage === 3 ? "font-semibold text-violet-600" : ""
              }
            >
              Course Pricing
            </span>
          </div>
        </div>
    </div>
  )
}

export default CourseProgress
