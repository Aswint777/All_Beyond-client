import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { RootState } from "../../redux/store";
import AssessmentForm from "../../components/reusableComponents/AssessmentForm";
import { Assessment, Question } from "../../Interface/assessments";
import { ROUTES } from "../../utils/paths";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:5000";

const CreateAssessment: React.FC = () => {
  const { userDetails, loading } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const { courseId, courseTitle } = location.state || { courseId: "", courseTitle: "" };
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // No fetching, so default to false

  const handleSubmit = async (data: { questions: Question[] }) => {
    try {
      if (!courseId) {
        throw new Error("Course ID is required");
      }
      if (!courseTitle) {
        throw new Error("Course title is required");
      }

      const payload = {
        courseId,
        courseTitle,
        questions: data.questions,
      };
      console.log(data, 'kkk');

      const response = await axios.post<
        { success: true; data: Assessment } | { success: false; message: string }
      >(`${API_URL}/instructor/createAssessments`, payload, { withCredentials: true });

      if (response.data.success) {
        navigate(`${ROUTES.INSTRUCTOR}${ROUTES.LIST_ASSESSMENT}`);
      } else {
        throw new Error(response.data.message || "Failed to create assessment");
      }
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      console.error("Create assessment error:", error);
      setError(error.response?.data?.message || "Error creating assessment");
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-800 text-xl font-semibold tracking-tight">Loading...</p>
        </div>
      </div>
    );
  }

  if (!userDetails?._id || userDetails?.role !== "instructor") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-600 text-lg font-semibold bg-red-50 px-6 py-3 rounded-lg shadow-sm" role="alert">
          Access Denied: Instructors Only
        </p>
      </div>
    );
  }

  if (!courseId || !courseTitle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-600 text-lg font-semibold bg-red-50 px-6 py-3 rounded-lg shadow-sm" role="alert">
          Invalid course data. Please select a course from the assessments list.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-300 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center animate-fade-in-down tracking-tight">
          Create New Assessment
        </h1>
        <p className="text-lg font-medium text-gray-700 mb-6 text-center animate-fade-in">
          <span className="font-semibold text-indigo-600">{courseTitle}</span>
        </p>
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg shadow-sm animate-fade-in" aria-live="polite">
            <p role="alert" className="text-sm font-medium">{error}</p>
          </div>
        )}
        <AssessmentForm
          courseId={courseId}
          courseTitle={courseTitle}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default CreateAssessment;