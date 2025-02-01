import React from "react";
import UserNavbar from "../../components/layout/UserNavbar";
import { useNavigate } from "react-router-dom";

const InstructorApplyPage: React.FC = () => {
  const navigate = useNavigate()
  return (
    <>
    <UserNavbar/>
      <div className="flex flex-col items-center space-y-10 p-10">
        {/* Apply As Instructor Section */}
        <div className="flex flex-col md:flex-row items-center bg-white shadow-lg rounded-2xl p-6 max-w-4xl">
          <img
            src="\src\assets\images\6-ways-to-improve-online-teaching.webp"
            alt="Instructor"
            className="w-96 h-96 object-cover rounded-xl shadow-md"
          />
          <div className="ml-6">
            <h2 className="text-xl font-semibold">Apply As Instructor</h2>
            <p className="text-gray-600 text-sm mt-2">
              Teaching is a skill and a noble career. As a teacher, it comes
              with a bit of responsibility. The following points provide a
              general breakdown of the requirements for teachers.
            </p>
            <div className="text-blue-500 mt-2">
              <a href="#" className="underline mr-4">
                Instructor Requirements
              </a>
              {/* <a href="#" className="underline">
                Instructor Rates
              </a> */}
            </div>
            <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
              <li>A undergraduate degree</li>
              <li>Prior experience in organized teaching</li>
              <li>Basic teaching materials</li>
              <li>Proper production studio</li>
            </ul>
            <button className="mt-4 bg-purple-500 text-white px-4 py-2 rounded-lg"
             onClick={()=>navigate('/InstructorApplicationForm')}>
              Apply Now
            </button>
          </div>
        </div>

        {/* Video Section */}
        {/* <div className="max-w-4xl">
          <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-lg">
            <img
              src="/video-thumbnail.jpg"
              alt="How to Apply"
              className="w-full h-64 object-cover opacity-75"
            />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
              <h2 className="text-lg font-semibold">
                How to apply to join as instructor
              </h2>
              <p className="text-sm">3 minutes • Step by step</p>
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
};

export default InstructorApplyPage;
