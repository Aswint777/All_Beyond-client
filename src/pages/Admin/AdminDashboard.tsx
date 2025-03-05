import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { PieChart, Pie, Cell } from "recharts";
import { Users, BarChart2, Settings, LogOut, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate()
  const data = [
    { name: "Jan", users: 40 },
    { name: "Feb", users: 30 },
    { name: "Mar", users: 20 },
    { name: "Apr", users: 27 },
    { name: "May", users: 50 },
  ];

  const pieData = [
    { name: "Active", value: 60 },
    { name: "Inactive", value: 40 },
  ];

  const COLORS = ["#4CAF50", "#FF7043"];

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-700">Admin Dashboard</h2>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li className="flex items-center p-2 hover:bg-gray-200 rounded-md cursor-pointer">
              <Home className="w-5 h-5 mr-2" /> Home
            </li>
            <li className="flex items-center p-2 hover:bg-gray-200 rounded-md cursor-pointer">
              <Users className="w-5 h-5 mr-2" /> Users
            </li>
            <li className="flex items-center p-2 hover:bg-gray-200 rounded-md cursor-pointer">
              <BarChart2 className="w-5 h-5 mr-2" /> Reports
            </li>
            <li className="flex items-center p-2 hover:bg-gray-200 rounded-md cursor-pointer">
              <Settings className="w-5 h-5 mr-2" /> Settings
            </li>
            <li className="flex items-center p-2 hover:bg-gray-200 rounded-md cursor-pointer text-red-600"
            onClick={()=>navigate("/admin/AdminStudentsListPage")}>
              <LogOut className="w-5 h-5 mr-2" /> Logout
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Welcome Back, Admin!</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Total Users</h2>
            <p className="text-2xl font-bold text-green-600">1,234</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Active Users</h2>
            <p className="text-2xl font-bold text-blue-600">567</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">New Sign-ups</h2>
            <p className="text-2xl font-bold text-yellow-600">78</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Monthly Sign-ups</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#4CAF50" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">User Status</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} dataKey="value" outerRadius={100} fill="#8884d8">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
