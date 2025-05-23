import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
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

  const COLORS = ["#2F80ED", "#F2994A", "#27AE60", "#9B51E0", "#EB5757"];

  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <p className="text-sm font-semibold text-gray-800">{`Month: ${label}`}</p>
          <p className="text-sm text-gray-600">{`Sign-ups: ${payload[0].value.toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
  };

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

  const formatYAxis = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toString();
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <div className="flex w-64 bg-white shadow-lg">
        <AdminSideBar />
      </div>

      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back! Here's an overview of your platform.</p>
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
                <h2 className="text-sm font-medium text-gray-600">Total Profit</h2>
                <p className="text-3xl font-bold text-orange-600 mt-2">₹{data.totalProfit.toLocaleString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 animate-fade-in"
                role="region"
                aria-label="Monthly Sign-ups Bar Chart"
              >
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Monthly Sign-ups</h2>
                {data.monthlySignups && data.monthlySignups.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                      data={data.monthlySignups}
                      margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                      aria-label="Bar chart showing monthly sign-ups"
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
                        formatter={() => "Sign-ups"}
                        iconType="square"
                        iconSize={12}
                        wrapperStyle={{ fontSize: "14px", color: "#4B5563" }}
                      />
                      <Bar dataKey="users" radius={[4, 4, 0, 0]}>
                        {data.monthlySignups.map((entry, index) => (
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
                  <p className="text-center text-gray-500">No sign-up data available for the last 6 months.</p>
                )}
              </div>

              {/* Pie Chart: Course Enrollments */}
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
                          percent:
                          entry.enrollments /
                          data.courseEnrollments.reduce((sum, e) => sum + e.enrollments, 0),
                        }))}
                        dataKey="enrollments"
                        nameKey="courseName"
                        cx="50%"
                        cy="50%"
                        outerRadius={130}
                        innerRadius={80}
                        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                        labelLine={{ stroke: "#6B7280", strokeWidth: 1 }}
                        animationDuration={1000}
                        animationBegin={0}
                        >
                        
                        {data.courseEnrollments.map((entry, index) => (
                          
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
                        formatter={(value) => <span className="mt-14 text-sm text-gray-600">{value}</span>}
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
  );
};

export default AdminDashboard;
