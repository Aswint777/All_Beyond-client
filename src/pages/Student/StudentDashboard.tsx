import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import UserNavbar from "../../components/layout/UserNavbar";
import { config } from "../../configaration/Config";
import { useEffect, useState } from "react";
import StudentSideBar from "../../components/layout/StudentSideBar";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { motion } from "framer-motion";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL!;

interface StudentEnrollment {
  courseName: string;
  enrollmentDate: string;
  courseId: string;
}

interface DashboardData {
  totalCoursesEnrolled: number;
  enrolledCourses: { courseName: string; count: number }[];
  recentEnrollments: StudentEnrollment[];
}

const fetchWithAuth = async (endpoint: string, method = "GET") => {
  return axios({
    url: `${API_URL}/student/${endpoint}`,
    method,
    ...config,
  });
};

const StudentDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { userDetails } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const response = await fetchWithAuth("dashboard");
        console.log("API response:", response.data);

        const result: DashboardData = response.data.data;
        console.log("Processed dashboard data:", result);

        if (!result) {
          throw new Error("No dashboard data received");
        }

        setData(result);
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message || "An error occurred while fetching dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Professional color palette (accessible)
  const COLORS = ["#2563EB", "#F59E0B", "#16A34A", "#8B5CF6", "#EF4444"];

  // Custom Tooltip for Pie Chart
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <p className="text-sm font-semibold text-gray-800">{`Course: ${payload[0].name}`}</p>
          <p className="text-sm text-gray-600">{`Enrollments: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  // Format enrollment date (locale-aware)
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat(navigator.language, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(dateString));
  };

  // Skeleton Loader Component
  const SkeletonLoader = () => (
    <div className="space-y-6">
      <div className="bg-gray-200 animate-pulse h-10 w-1/3 rounded-lg"></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="bg-gray-200 animate-pulse h-6 w-1/4 mb-4 rounded"></div>
          <div className="bg-gray-200 animate-pulse h-64 rounded-lg"></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="bg-gray-200 animate-pulse h-6 w-1/4 mb-4 rounded"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse h-8 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900 antialiased">
      <UserNavbar />
      <div className="flex">
        {/* Sidebar: Fixed width on desktop, hidden on mobile with toggle */}
        {/* <aside className="w-64 bg-white shadow-lg hidden lg:block"> */}
          <StudentSideBar />
        {/* </aside> */}
        <main className="flex-1 p-4 sm:p-8 lg:p-10 mt-16 max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Welcome Back,{" "}
              <span className="text-blue-600">{userDetails?.username || "Student"}</span>!
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Explore your learning journey with a personalized dashboard.
            </p>
          </motion.div>

          {loading ? (
            <SkeletonLoader />
          ) : error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-lg max-w-lg mx-auto"
              role="alert"
            >
              <p className="text-sm font-medium">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Retry loading dashboard"
              >
                Retry
              </button>
            </motion.div>
          ) : data ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Summary Card: Total Courses Enrolled */}
              <div className="mb-6">
                <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                  <h2 className="text-lg font-semibold text-gray-800">Total Courses Enrolled</h2>
                  <p className="text-3xl font-bold text-blue-600 mt-2">
                    {data.totalCoursesEnrolled}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid">
                {/* Pie Chart: Enrolled Courses */}
                {/* <div
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
                  role="region"
                  aria-label="Enrolled Courses Pie Chart"
                >
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Course Enrollment Distribution
                  </h2>
                  {data.enrolledCourses && data.enrolledCourses.length > 0 ? (
                    <ResponsiveContainer width="100%" height={350}>
                      <PieChart>
                        <Pie
                          data={data.enrolledCourses}
                          dataKey="count"
                          nameKey="courseName"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          innerRadius={60} // Donut chart style
                          label={({ courseName, percent }) =>
                            `${courseName} (${(percent * 100).toFixed(0)}%)`
                          }
                          labelLine={true}
                          animationDuration={800}
                        >
                          {data.enrolledCourses.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                              className="hover:brightness-110 transition"
                            />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomPieTooltip />} />
                        <Legend
                          verticalAlign="bottom"
                          iconType="circle"
                          iconSize={10}
                          formatter={(value) => (
                            <span className="text-sm text-gray-600">{value}</span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-center text-gray-500 py-8">
                      No enrolled courses available.
                    </p>
                  )}
                </div> */}

                {/* Recent Enrollments Table */}
                <div
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
                  role="region"
                  aria-label="Recent Enrollments Table"
                >
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Recent Enrollments
                  </h2>
                  {data.recentEnrollments && data.recentEnrollments.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Course Name
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Enrollment Date
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {data.recentEnrollments.slice(0, 5).map((enrollment, index) => (
                            <tr
                              key={index}
                              className="hover:bg-gray-50 transition-colors duration-150"
                              tabIndex={0}
                              onKeyDown={(e) => e.key === "Enter" && console.log("Navigate to course:", enrollment.courseId)}
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {enrollment.courseName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(enrollment.enrollmentDate)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-8">
                      No recent enrollments available.
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <p className="text-center text-gray-500 py-8">No data available.</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;

