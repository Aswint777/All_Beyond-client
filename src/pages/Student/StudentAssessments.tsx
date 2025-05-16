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
  passed?: boolean;
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

  const limit = 6; // Assessments per page

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
        console.error("Fetch assessments error:", error);
        setError(error.response?.data?.message || "Failed to fetch assessments");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssessments();
  }, [userDetails, loading, navigate, currentPage, search]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatus = (assessment: Assessment) => {
    const result = assessment.results?.[0];
    if (!result || result.attempts === 0) return "Not Attended";
    if (result.passed) return "Passed";
    return "Failed";
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
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
     <div className="min-h-screen bg-gray-100 font-sans text-gray-900 antialiased">
      <UserNavbar />
      <div className="flex">

          <StudentSideBar />
    <div className="min-h-screen bg-gray-300 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center tracking-tight">
          My Assessments
        </h1>

        {/* Search Bar */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search by course name..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-200"
              aria-label="Search assessments"
            />
          </div>
        </div>

        {error && (
          <p className="text-red-600 text-center mb-6 font-medium" role="alert">
            {error}
          </p>
        )}

        {assessments.length === 0 && !error && (
          <p className="text-gray-500 text-center text-lg font-medium bg-white py-6 rounded-xl shadow-sm">
            No assessments found. Try adjusting your search.
          </p>
        )}

        {/* Assessments Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {assessments.map((assessment) => {
            const status = getStatus(assessment);
            const { text, color } = getCTA(status);
            return (
              <div
                key={assessment._id}
                className="relative bg-white rounded-xl shadow-sm p-6 transform hover:scale-105 transition-all duration-300 border border-gray-100"
                role="region"
                aria-labelledby={`assessment-${assessment._id}`}
              >
                {/* Status Badge */}
                <div
                  className={`absolute top-0 right-0 px-3 py-1 text-xs font-semibold text-white rounded-bl-lg rounded-tr-lg ${
                    status === "Passed"
                      ? "bg-green-600"
                      : status === "Failed"
                      ? "bg-red-600"
                      : "bg-gray-500"
                  }`}
                >
                  {status}
                </div>

                <h2
                  id={`assessment-${assessment._id}`}
                  className="text-xl font-semibold text-gray-900 mb-4 line-clamp-2"
                >
                  {assessment.courseTitle}
                </h2>

                {/* CTA Button */}
                <button
                  onClick={() =>
                    navigate(
                      `${ROUTES.STUDENT}${
                        status === "Passed"
                          ? `${ROUTES.CERTIFICATE}/${assessment._id}`
                          : `${ROUTES.TAKE_ASSESSMENT}/${assessment._id}`
                      }`
                    )
                  }
                  className={`w-full ${color} text-white py-2.5 rounded-lg font-medium text-sm shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50`}
                  aria-label={`${text} for ${assessment.courseTitle}`}
                >
                  {text}
                </button>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  </div>
  </div>
  );
};

export default StudentAssessments;