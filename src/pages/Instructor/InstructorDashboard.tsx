import axios from "axios";
import React, { useEffect, useState } from "react";
import { config } from "../../configaration/Config";
import InstructorSidebar from "../../components/layout/InstructorSidebar";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import UserNavbar from "../../components/layout/UserNavbar";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL!;

interface MonthlyEnrollments {
  month: string;
  users: number;
}

interface CourseEnrollment {
  courseName: string;
  enrollments: number;
}

interface DashboardData {
  totalUsers: number;
  totalRevenue: number;
  totalCourses: number;
  monthlyEnrollments: MonthlyEnrollments[];
  courseEnrollments: CourseEnrollment[];
}

const fetchWithAuth = async (endpoint: string, method = "GET") => {
  return axios({
    url: `${API_URL}/instructor/${endpoint}`,
    method,
    ...config,
  });
};

const InstructorDashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { userDetails } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const response = await fetchWithAuth("overview");
        const result: DashboardData = response.data.data;
        console.log("Dashboard data:", result); // Debug data
        setData(result);
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Professional color palette (enterprise-friendly)
  const COLORS = ["#2F80ED", "#F2994A", "#27AE60", "#9B51E0", "#EB5757"];

  // Custom Tooltip for Bar Chart
  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <p className="text-sm font-semibold text-gray-800">{`Month: ${label}`}</p>
          <p className="text-sm text-gray-600">{`Enrollments: ${payload[0].value.toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip for Pie Chart
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <p className="text-sm font-semibold text-gray-800">{`Course: ${payload[0].name}`}</p>
          <p className="text-sm text-gray-600">{`Enrollments: ${payload[0].value.toLocaleString()}`}</p>
          <p className="text-sm text-gray-600">{`Percentage: ${(payload[0].payload.percent * 100).toFixed(1)}%`}</p>
        </div>
      );
    }
    return null;
  };

  // Format large numbers for YAxis (e.g., 1000 -> 1K)
  const formatYAxis = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toString();
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <UserNavbar />

      <div className="flex">
        <div className="flex w-64 bg-white shadow-lg">
          <InstructorSidebar />
        </div>

        <div className="flex-1 p-8 mt-14">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome Back, <span className="text-indigo-600">{userDetails?.username}</span>!
            </h1>
            <p className="text-sm text-gray-500 mt-1">Here's an overview of your instructor dashboard.</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Retry
              </button>
            </div>
          ) : data ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 animate-fade-in">
                  <h2 className="text-sm font-medium text-gray-600">Total Users</h2>
                  <p className="text-3xl font-bold text-blue-600 mt-2">{data.totalUsers.toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 animate-fade-in">
                  <h2 className="text-sm font-medium text-gray-600">Total Revenue</h2>
                  <p className="text-3xl font-bold text-green-600 mt-2">₹{data.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 animate-fade-in">
                  <h2 className="text-sm font-medium text-gray-600">Total Courses</h2>
                  <p className="text-3xl font-bold text-orange-600 mt-2">{data.totalCourses.toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 animate-fade-in"
                  role="region"
                  aria-label="Monthly Enrollments Bar Chart"
                >
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Monthly Enrollments</h2>
                  {data.monthlyEnrollments && data.monthlyEnrollments.length > 0 ? (
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart
                        data={data.monthlyEnrollments}
                        margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                        aria-label="Bar chart showing monthly enrollments"
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis
                          dataKey="month"
                          tick={{ fill: "#4B5563", fontSize: 14 }}
                          tickMargin={10}
                          axisLine={{ stroke: "#D1D5DB" }}
                          tickLine={{ stroke: "#D1D5DB" }}
                        />
                        <YAxis
                          allowDecimals={false}
                          tickFormatter={formatYAxis}
                          tick={{ fill: "#4B5563", fontSize: 14 }}
                          tickMargin={10}
                          axisLine={{ stroke: "#D1D5DB" }}
                          tickLine={{ stroke: "#D1D5DB" }}
                        />
                        <Tooltip content={<CustomBarTooltip />} cursor={{ fill: "rgba(0,0,0,0.05)" }} />
                        <Legend
                          verticalAlign="top"
                          height={36}
                          formatter={() => "Enrollments"}
                          iconType="square"
                          iconSize={12}
                          wrapperStyle={{ fontSize: "14px", color: "#4B5563" }}
                        />
                        <Bar dataKey="users" radius={[4, 4, 0, 0]}>
                          {data.monthlyEnrollments.map((_, index) => (
                            <Cell
                              key={`bar-${index}`}
                              fill="#2F80ED"
                              className="hover:brightness-110 transition"
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-center text-gray-500">No enrollment data available for the last 6 months.</p>
                  )}
                </div>

                <div
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 animate-fade-in"
                  role="region"
                  aria-label="Course Enrollments Pie Chart"
                >
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Course Enrollments</h2>
                  {data.courseEnrollments && data.courseEnrollments.length > 0 ? (
                    <ResponsiveContainer width="100%" height={400}>
                      <PieChart aria-label="Pie chart showing course enrollments">
                        <Pie
                          data={data.courseEnrollments.map((entry) => ({
                            ...entry,
                            percent: entry.enrollments / data.courseEnrollments.reduce((sum, e) => sum + e.enrollments, 0),
                          }))}
                          dataKey="enrollments"
                          nameKey="courseName"
                          cx="50%"
                          cy="50%"
                          outerRadius={130}
                          innerRadius={80}
                          label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                          labelLine={{ stroke: "#6B7280", strokeWidth: 1 }}
                          animationDuration={1000}
                          animationBegin={0}
                        >
                          {data.courseEnrollments.map((_, index) => (
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
                          formatter={(value) => <span className="text-sm text-gray-600">{value}</span>}
                          wrapperStyle={{ fontSize: "14px", color: "#4B5563" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-center text-gray-500">No course enrollment data available.</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500">No data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
