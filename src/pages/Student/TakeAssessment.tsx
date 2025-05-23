import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { RootState } from "../../redux/store";
import { ROUTES } from "../../utils/paths";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:5000";

interface Question {
  question: string;
  options: string[];
  correctOption: number; 
}

interface Assessment {
  _id: string;
  courseId: string;
  courseTitle: string;
  instructorName: string;
  questions: Question[];
  createdAt: string;
}

interface AssessmentResponse {
  success: boolean;
  data: Assessment;
}

interface SubmitResponse {
  success: boolean;
  data: {
    marks: number;
    passed: boolean;
  };
}

interface Answer {
  questionIndex: number;
  selectedOption: number; 
}

const TakeAssessment: React.FC = () => {
  const { userDetails, loading } = useSelector((state: RootState) => state.user);
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!userDetails?._id || userDetails?.role !== "student") {
      navigate("/login");
      return;
    }

    const fetchAssessment = async () => {
      setIsLoading(true);
      try {
        if (!assessmentId) {
          throw new Error("Assessment ID not provided");
        }

        const response = await axios.get<AssessmentResponse>(
          `${API_URL}/student/getQuestions/${assessmentId}`,
          { withCredentials: true }
        );

        if (!response.data.success || !response.data.data) {
          throw new Error("Assessment not found");
        }
        
        const fetchedAssessment = response.data.data;

        // Validate questions
        const invalidQuestion = fetchedAssessment.questions.find(
          (q, i) =>
            !q.question ||
            !q.options?.length ||
            q.correctOption < 1 ||
            q.correctOption > q.options.length
        );
        if (invalidQuestion) {
          throw new Error("Invalid question data in assessment");
        }

        setAssessment(fetchedAssessment);
        setAnswers(
          fetchedAssessment.questions.map((_, index) => ({
            questionIndex: index,
            selectedOption: -1, 
          }))
        );
        setError(null);
      } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        console.error("Fetch assessment error:", error);
        setError(error.response?.data?.message || "Failed to fetch assessment");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssessment();
  }, [userDetails, loading, assessmentId, navigate]);

  const handleAnswerChange = (questionIndex: number, selectedOption: number) => {
    setAnswers((prev) =>
      prev.map((answer) =>
        answer.questionIndex === questionIndex
          ? { ...answer, selectedOption }
          : answer
      )
    );
    setSubmitError(null);
  };

  const validateAnswers = () => {
    return answers.every((answer) => answer.selectedOption !== -1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAnswers()) {
      setSubmitError("Please answer all questions before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      const submissionAnswers = answers.map((answer) => ({
        questionIndex: answer.questionIndex,
        selectedOption: answer.selectedOption + 1, 
      }));

      console.log("Submitting answers:", submissionAnswers);

      const response = await axios.post<SubmitResponse>(
        `${API_URL}/student/submit-assessment/${assessmentId}`,
        { answers: submissionAnswers },
        { withCredentials: true }
      );

      if (!response.data.success) {
        throw new Error("Failed to submit assessment");
      }

      navigate(`${ROUTES.STUDENT}${ROUTES.STUDENT_ASSESSMENTS}`, {
        state: {
          message: `Assessment submitted! Marks: ${response.data.data.marks}, Status: ${
            response.data.data.passed ? "Passed" : "Failed"
          }`,
        },
      });
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      console.error("Submit assessment error:", error);
      setSubmitError(error.response?.data?.message || "Failed to submit assessment");
    } finally {
      setIsSubmitting(false);
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

  if (!userDetails?._id || userDetails?.role !== "student") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-red-600 text-lg font-medium" role="alert">
          Access denied. Students only.
        </p>
      </div>
    );
  }

  if (!assessment || error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-red-600 text-lg font-medium" role="alert">
          {error || "Assessment not found"}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center animate-fade-in">
          Take Assessment: {assessment.courseTitle}
        </h1>

        {submitError && (
          <p className="text-red-600 text-center mb-4" role="alert">
            {submitError}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {assessment.questions.map((question, qIndex) => (
            <div
              key={qIndex}
              className="bg-white p-6 rounded-lg shadow-md"
              data-testid={`question-${qIndex}`}
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Question {qIndex + 1}: {question.question}
              </h2>
              <div className="space-y-3">
                {question.options.map((option, oIndex) => (
                  <label
                    key={oIndex}
                    className="flex items-center space-x-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={`question-${qIndex}`}
                      value={oIndex}
                      checked={answers[qIndex]?.selectedOption === oIndex}
                      onChange={() => handleAnswerChange(qIndex, oIndex)}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                      aria-label={`Option ${oIndex + 1}: ${option}`}
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 disabled:bg-blue-400 transition-all duration-200"
            >
              {isSubmitting ? "Submitting..." : "Submit Assessment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TakeAssessment;