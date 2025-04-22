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
console.log(data,'chjbdcjSDbn,m');

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

  // Define colors for pie chart slices
  const COLORS = ["#4CAF50", "#FF7043", "#8884d8", "#FFBB28", "#00C49F"];

  return (
    <div>
                  <UserNavbar />

    <div className="flex min-h-screen bg-gray-100 text-gray-800 ">

      {/* Sidebar */}
        <InstructorSidebar />

      {/* Main Content */}
      <div className="flex-1 p-6  mt-14">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            Welcome Back, <span className="text-violet-600">{userDetails?.username}</span>
          </h1>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <div className="text-center text-red-500">
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        ) : data ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold">Total Users</h2>
                <p className="text-2xl font-bold text-green-600">{data.totalUsers.toLocaleString()}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold">Total Revenue</h2>
                <p className="text-2xl font-bold text-blue-600">₹{data.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold">Total Courses</h2>
                <p className="text-2xl font-bold text-yellow-600">{data.totalCourses.toLocaleString()}</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bar Chart: Monthly Sign-ups */}
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-4">Monthly Sign-ups</h2>
                {data.monthlyEnrollments && data.monthlyEnrollments.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data.monthlyEnrollments} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="users" fill="#4CAF50" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-gray-500">No enrollment data available for the last 6 months.</p>
                )}
              </div>

              {/* Pie Chart: Course Enrollments */}
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-4">Course Enrollments</h2>
                {data.courseEnrollments && data.courseEnrollments.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={data.courseEnrollments}
                        dataKey="enrollments"
                        nameKey="courseName"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {data.courseEnrollments.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
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






