import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { RootState } from "../../redux/store";
import Pagination from "../../components/reusableComponents/Pagination";
import { ROUTES } from "../../utils/paths";
import { Search } from "lucide-react";
import UserNavbar from "../../components/layout/UserNavbar";
import StudentSideBar from "../../components/layout/StudentSideBar";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:5000";

interface Question {
  question: string;
  options: string[];
  correctOption: number;
}

interface AssessmentResult {
  marks: number;
  attempts: number;
  passed: boolean;
  status: boolean;
}

interface Assessment {
  _id: string;
  courseId: string;
  courseTitle: string;
  questions: Question[];
  results?: AssessmentResult[];
  createdAt: string;
}

interface AssessmentResponse {
  success: boolean;
  data: {
    assessments: Assessment[];
    totalPages: number;
    currentPage: number;
    totalAssessments: number;
  };
}

const StudentAssessments: React.FC = () => {
  const { userDetails, loading } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const limit = 6;

  useEffect(() => {
    if (loading) return;
    if (!userDetails?._id || userDetails?.role !== "student") {
      navigate("/login");
      return;
    }

    const fetchAssessments = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get<AssessmentResponse>(
          `${API_URL}/student/studentAssessments`,
          {
            params: { page: currentPage, limit, search },
            withCredentials: true,
          }
        );

        if (!response.data.success) {
          throw new Error("Failed to fetch assessments");
        }

        setAssessments(response.data.data.assessments);
        setTotalPages(response.data.data.totalPages);
        setError(null);
      } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        setError(error.response?.data?.message || "Failed to fetch assessments");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssessments();
  }, [userDetails, loading, navigate, currentPage, search]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatus = (assessment: Assessment) => {
    const result = assessment.results?.[0];
    if (!result || result.attempts === 0) return "Not Attended";
    return result.status ? "Passed" : "Failed";
  };

  const getCTA = (status: string) => {
    switch (status) {
      case "Not Attended":
        return { text: "Attend Now", color: "bg-blue-600 hover:bg-blue-700" };
      case "Failed":
        return { text: "Try Again", color: "bg-orange-500 hover:bg-orange-600" };
      case "Passed":
        return { text: "View Certificate", color: "bg-green-600 hover:bg-green-700" };
      default:
        return { text: "", color: "" };
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!userDetails?._id || userDetails?.role !== "student") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-600 text-lg font-semibold" role="alert">
          Access denied. Students only.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 antialiased">
      <UserNavbar />
      <div className="flex">
        <StudentSideBar />
        <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center sm:text-left">
              My Assessments
            </h1>

            <div className="mb-6 flex justify-center sm:justify-start">
              <div className="relative w-full max-w-xs sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={handleSearch}
                  placeholder="Search by course name..."
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm placeholder-gray-400 transition-all duration-200"
                  aria-label="Search assessments"
                />
              </div>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-600 p-4 rounded-md text-sm font-medium text-center" role="alert">
                {error}
              </div>
            )}

            {assessments.length === 0 && !error && (
              <div className="bg-white p-6 rounded-md border border-gray-200 text-gray-500 text-center text-sm font-medium">
                No assessments found. Try adjusting your search.
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {assessments.map((assessment) => {
                const status = getStatus(assessment);
                const { text, color } = getCTA(status);
                return (
                  <div
                    key={assessment._id}
                    className="relative flex flex-col bg-white rounded-md border border-gray-200 p-5 hover:shadow-lg transition-all duration-300 min-h-[180px]"
                    role="region"
                    aria-labelledby={`assessment-${assessment._id}`}
                  >
                    <div
                      className={`absolute top-0 right-0 px-2 py-1 text-xs font-medium text-white rounded-bl-md rounded-tr-md ${
                        status === "Passed"
                          ? "bg-green-600"
                          : status === "Failed"
                          ? "bg-red-600"
                          : "bg-gray-500"
                      }`}
                      role="status"
                      aria-label={`Assessment status: ${status}`}
                    >
                      {status}
                    </div>

                    <h2
                      id={`assessment-${assessment._id}`}
                      className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2"
                    >
                      {assessment.courseTitle}
                    </h2>

                    <p className="text-sm text-gray-500 mb-4">
                      Created: {new Date(assessment.createdAt).toLocaleDateString()}
                    </p>

                    <div className="flex-grow"></div>

                    <button
                      onClick={() =>
                        navigate(
                          status === "Passed"
                            ? `${ROUTES.STUDENT}${ROUTES.CERTIFICATE}/${assessment._id}`
                            : `${ROUTES.STUDENT}${ROUTES.TAKE_ASSESSMENT}/${assessment._id}`
                        )
                      }
                      className={`w-full ${color} text-white py-2 rounded-md text-sm font-medium transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50`}
                      aria-label={`${text} for ${assessment.courseTitle}`}
                    >
                      {text}
                    </button>
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentAssessments;

