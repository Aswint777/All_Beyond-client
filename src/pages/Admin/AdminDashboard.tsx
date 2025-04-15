import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { PieChart, Pie, Cell, Tooltip as PieTooltip } from "recharts";
import AdminSideBar from "../../components/layout/AdminSideBar";
import axios from "axios";
import { config } from "../../configaration/Config";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL!;

interface MonthlySignup {
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
  totalProfit: number;
  monthlySignups: MonthlySignup[];
  courseEnrollments: CourseEnrollment[];
}

const fetchWithAuth = async (endpoint: string, method = "GET") => {
  return axios({
    url: `${API_URL}/admin/${endpoint}`,
    method,
    ...config,
  });
};

const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const response = await fetchWithAuth("overview");
        const result: DashboardData = response.data.data;
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
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <AdminSideBar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Welcome Back, Admin!</h1>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <div className="text-red-500">
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-4 py-1 rounded"
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
                <h2 className="text-lg font-semibold">Total Profit</h2>
                <p className="text-2xl font-bold text-yellow-600">₹{data.totalProfit.toLocaleString()}</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bar Chart: Monthly Sign-ups */}
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-4">Monthly Sign-ups</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={data.monthlySignups}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="users" fill="#4CAF50" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart: Course Enrollments */}
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-4">Course Enrollments</h2>
                <ResponsiveContainer width="100%" height={250}>
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
                    <PieTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default AdminDashboard;