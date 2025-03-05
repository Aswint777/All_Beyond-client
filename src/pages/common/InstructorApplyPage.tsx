import React from "react";
import UserNavbar from "../../components/layout/UserNavbar";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const InstructorApplyPage: React.FC = () => {
  const navigate = useNavigate();
  const { userDetails } = useSelector((state: RootState) => state.user);
  console.log(userDetails, 'hjfjfj');

  // Check if the user has already applied
  const isAppliedInstructor = userDetails?.isAppliedInstructor;

  return (
    <>
      <UserNavbar />
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
              <li>An undergraduate degree</li>
              <li>Prior experience in organized teaching</li>
              <li>Basic teaching materials</li>
              <li>Proper production studio</li>
            </ul>
            <button
              className={`mt-4 px-4 py-2 rounded-lg ${
                isAppliedInstructor
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-purple-500 text-white"
              }`}
              disabled={isAppliedInstructor}
              onClick={() => navigate('/InstructorApplicationForm')}
            >
              {isAppliedInstructor ? "Already Applied" : "Apply Now"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default InstructorApplyPage;
