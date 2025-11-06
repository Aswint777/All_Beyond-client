import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { RootState } from "../../redux/store";
import { Assessment, Question } from "../../Interface/assessments";
import AssessmentForm from "../../components/reusableComponents/AssessmentForm";
import { ROUTES } from "../../utils/paths";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:5000";

const EditAssessment: React.FC = () => {
  const { userDetails, loading } = useSelector((state: RootState) => state.user);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [courseId, setCourseId] = useState<string>("");
  const [courseTitle, setCourseTitle] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!userDetails?._id || userDetails?.role !== "instructor") {      
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        if (!id) {
          throw new Error("Assessment ID not provided");
        }

        const { courseId: stateCourseId, courseTitle: stateCourseTitle } =
          (location.state as { courseId: string; courseTitle: string }) || {
            courseId: "",
            courseTitle: "",
          };

        if (!stateCourseId || !stateCourseTitle) {
          throw new Error("Course data not provided");
        }

        console.log("Fetching assessment:", id);
        
        const assessmentResponse = await axios.get<{ success: boolean; data: Assessment }>(
          `${API_URL}/instructor/getAssessment/${id}`,
          { withCredentials: true }
        );

        if (!assessmentResponse.data.success || !assessmentResponse.data.data) {
          throw new Error("Assessment not found");
        }

        const fetchedAssessment = assessmentResponse.data.data;

        if (stateCourseId !== fetchedAssessment.courseId) {
          console.warn("Course ID mismatch:", {
            stateCourseId,
            assessmentCourseId: fetchedAssessment.courseId,
          });
          throw new Error("Invalid course data for this assessment");
        }

        setAssessment(fetchedAssessment);
        setCourseId(stateCourseId);
        setCourseTitle(stateCourseTitle);
        setError(null);
      } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        console.error("Fetch data error:", error);
        setError(error.response?.data?.message || "Failed to fetch assessment data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userDetails, loading, id, navigate, location.state]);

  const handleSubmit = async (data: { questions: Question[] }) => {
    try {
      const cleanedQuestions = data.questions.map(({ question, options, correctOption }) => ({
        question,
        options,
        correctOption,
      }));

      console.log("Sending cleaned questions:", cleanedQuestions);

      const response = await axios.put<
        { success: true; data: Assessment } | { success: false; message: string }
      >(
        `${API_URL}/instructor/updateAssessment/${id}`,
        { questions: cleanedQuestions },
        { withCredentials: true }
      );

      if (response.data.success) {
        navigate(`${ROUTES.INSTRUCTOR}${ROUTES.LIST_ASSESSMENT}`);
      } else {
        throw new Error(response.data.message || "Failed to update assessment");
      }
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      console.error("Update assessment error:", error);
      throw new Error(error.response?.data?.message || "Error updating assessment");
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600 animate-pulse text-lg font-medium">
          Loading...
        </p>
      </div>
    );
  }

  if (!userDetails?._id || userDetails?.role !== "instructor") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-red-600 text-lg font-medium" role="alert">
          Access denied. Instructors only.
        </p>
      </div>
    );
  }

  if (!assessment || !courseId || !courseTitle) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-red-600 text-lg font-medium" role="alert">
          {assessment ? "Course data not found" : "Assessment not found"}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center animate-fade-in">
          Edit Assessment
        </h1>
        {error && (
          <p className="text-red-600 text-center mb-4" role="alert">
            {error}
          </p>
        )}
        <AssessmentForm
          initialData={assessment}
          courseId={courseId}
          courseTitle={courseTitle}
          onSubmit={handleSubmit}
          isEditMode
        />
      </div>
    </div>
  );
};

export default EditAssessment;