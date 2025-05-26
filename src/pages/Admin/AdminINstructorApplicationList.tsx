import React, { useEffect, useState } from "react";
import AdminSideBar from "../../components/layout/AdminSideBar";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../utils/paths";
import {
  blockUnblockUser,
  fetchInstructorApplications,
  updateInstructorStatus,
} from "../../services/userService";
import TableComponent, {
  TableColumn,
} from "../../components/reusableComponents/TableComponent";
import Pagination from "../../components/reusableComponents/Pagination";

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

interface PaginatedResponse {
  success: boolean;
  data: {
    data: Student[];
    total: number;
    currentPage: number;
    totalPages: number;
  };
  message: string;
}

const AdminInstructorApplicationList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 2;

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const navigate = useNavigate();

  const fetchStudents = async (page: number) => {
    try {
      setLoading(true);
      const response = await fetchInstructorApplications({
        page,
        limit,
        status: "pending",
      });
      const result = response as PaginatedResponse;
      console.log("Backend Response:", result);

      if (!result.success || !result.data) {
        setError(result.message || "Failed to fetch instructor applications");
        return;
      }

      const { data, currentPage: fetchedPage, totalPages: fetchedTotalPages } = result.data;
      // Filter to include only students with status "pending"
      const pendingStudents = data.filter((student) => student.status.toLowerCase() === "pending");
      setStudents(pendingStudents || []);
      setCurrentPage(fetchedPage || page);
      setTotalPages(fetchedTotalPages || 1);
    } catch (err: any) {
      setError(
        err.message ||
          "An error occurred while fetching instructor applications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(currentPage);
  }, [currentPage]);

  const handleStatusChange = async (
    id: string,
    newStatus: "pending" | "approved" | "rejected"
  ) => {
    try {
      await updateInstructorStatus(id, newStatus);
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student._id === id ? { ...student, status: newStatus } : student
        )
      );
      // If status changes to approved or rejected, refetch to remove from pending list
      if (newStatus !== "pending") {
        fetchStudents(currentPage);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setError("Failed to update status. Please try again.");
    }
  };

  const handleViewDetails = (userId: string) => {
    navigate(`${ROUTES.ADMIN}${ROUTES.ADMIN_USER_DETAILS}${userId}`);
  };

  const handleBlockUnblock = async (
    _id: string,
    status: boolean,
    userid: string
  ) => {
    try {
      await blockUnblockUser(userid, status);
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student._id === _id ? { ...student, isBlocked: status } : student
        )
      );
    } catch (error) {
      console.error("Error blocking/unblocking instructor:", error);
      setError("Failed to block/unblock instructor. Please try again.");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns: TableColumn<Student>[] = [
    { label: "ID", key: "userId" },
    { label: "Name", key: "username" },
    { label: "Email", key: "email" },
    {
      label: "Status",
      render: (student) => (
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
      ),
    },
    {
      label: "Actions",
      render: (student) => (
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
      ),
    },
    {
      label: "About",
      render: (student) => (
        <button
          onClick={() => handleViewDetails(student.userId)}
          className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
        >
          View
        </button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex">
      <AdminSideBar />
      <main className="flex-1 p-6 lg:p-8 overflow-x-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Instructor Applications
        </h2>

        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">
            {error}
            <button
              onClick={() => fetchStudents(currentPage)}
              className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <TableComponent columns={columns} data={students} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default AdminInstructorApplicationList;