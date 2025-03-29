import axios from "axios";
import React, { useEffect, useState } from "react";
import AdminSideBar from "../../components/layout/AdminSideBar";
import { useNavigate } from "react-router-dom";

interface Student {
  _id: string;
  username: string;
  email: string;
  isBlocked: boolean;
  userId: string;
  contactNumber: number;
  qualification: string;
  age: number;
  status: "pending" | "approved" | "rejected";
}

const AdminInstructorApplicationList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const API_URL = import.meta.env.VITE_REACT_APP_API_URL!;
        const response = await axios.get(
          `${API_URL}/admin/AdminInstructorApplicationList`,
          { withCredentials: true }
        );
        setStudents(response.data.data);
        console.log(response.data.data, ".......................................");
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching students.");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleStatusChange = async (
    id: string,
    newStatus: "pending" | "approved" | "rejected"
  ) => {
    try {
      const API_URL = import.meta.env.VITE_REACT_APP_API_URL!;
      const response = await axios.put(
        `${API_URL}/admin/updateInstructorStatus`,
        { Id: id, status: newStatus },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student._id === id ? { ...student, status: newStatus } : student
          )
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status. Please try again.");
    }
  };

  const handleViewDetails = (userId: string) => {
    navigate(`/admin/user_details/${userId}`);
  };

  const handleBlockUnblock = async (_id: string, status: boolean, userid: string) => {
    try {
      const API_URL = import.meta.env.VITE_REACT_APP_API_URL!;
      const response = await axios.put(
        `${API_URL}/admin/block_UnBlock`,
        { userId: userid, isBlocked: status },
        { withCredentials: true }
      );
      console.log(response, "response");

      if (response.status === 200) {
        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student._id === _id ? { ...student, isBlocked: status } : student
          )
        );
      }
    } catch (error) {}
  };

  // Pagination logic
  const totalPages = Math.ceil(students.length / itemsPerPage);
  const currentStudents = students.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex">
      <AdminSideBar />

      <main className="flex-1 p-6 lg:p-8 overflow-x-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Instructor Applications</h2>

        {/* Table */}
        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-sm font-semibold uppercase tracking-wide">
                <th className="px-6 py-4 text-left">ID</th>
                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Actions</th>
                <th className="px-6 py-4 text-left">About</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : currentStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No instructor applications found.
                  </td>
                </tr>
              ) : (
                currentStudents.map((student) => (
                  <tr
                    key={student._id}
                    className="hover:bg-gray-50 transition-all duration-200"
                  >
                    <td className="px-6 py-4 text-gray-700">{student.userId}</td>
                    <td className="px-6 py-4 text-gray-700">{student.username}</td>
                    <td className="px-6 py-4 text-gray-700">{student.email}</td>
                    <td className="px-6 py-4">
                      <select
                        value={student.status}
                        onChange={(e) =>
                          handleStatusChange(
                            student._id,
                            e.target.value as "pending" | "approved" | "rejected"
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          handleBlockUnblock(student._id, !student.isBlocked, student.userId)
                        }
                        className={`px-4 py-2 rounded-lg shadow-md text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          student.isBlocked
                            ? "bg-orange-500 hover:bg-orange-600 focus:ring-orange-400"
                            : "bg-blue-500 hover:bg-blue-600 focus:ring-blue-400"
                        }`}
                      >
                        {student.isBlocked ? "Unblock" : "Block"}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewDetails(student.userId)}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center mt-8 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            «
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                currentPage === i + 1
                  ? "bg-purple-500 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            »
          </button>
        </div>
      </main>
    </div>
  );
};

export default AdminInstructorApplicationList;