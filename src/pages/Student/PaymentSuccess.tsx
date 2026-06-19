import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, BookOpen } from "lucide-react";
import UserNavbar from "../../components/layout/UserNavbar";
import StudentSideBar from "../../components/layout/StudentSideBar";
import { ROUTES } from "../../utils/paths";

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();

  const handleViewCourse = () => {
        navigate(`${ROUTES.STUDENT}${ROUTES.STUDENT_COURSES}`); 
   
  };

  return (
    <div>
      <UserNavbar />
      <div className="flex min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <StudentSideBar />
        <div className="flex-1 mt-16 p-4 sm:p-8">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 sm:p-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4 animate-bounce" />
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Congratulations! You’re now enrolled in your course.
            </p>
            <button
              onClick={handleViewCourse}
              className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 mx-auto"
            >
              <BookOpen className="w-5 h-5" />
              Go to Course
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;


