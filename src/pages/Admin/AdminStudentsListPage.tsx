










import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSideBar from "../../components/layout/AdminSideBar";
import axios from "axios";
import { useModal } from "../../components/context/ModalContext";
import TableComponent, {
  TableColumn,
} from "../../components/reusableComponents/TableComponent";
// import Pagination from "../../components/Pagination";
import { ROUTES } from "../../utils/paths";
import Pagination from "../../components/reusableComponents/Pagination";

interface Student {
  _id: string;
  username: string;
  email: string;
  isBlocked: boolean;
  userId: string;
  contactNumber: number;
  isVerified: boolean;
  role: string;
  createdAt: string;
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

const API_URL = import.meta.env.VITE_REACT_APP_API_URL!;

const fetchWithAuth = async (
  endpoint: string,
  method = "GET",
  data?: any,
  params?: { page?: number; limit?: number }
) => {
  return axios({
    url: `${API_URL}/admin/${endpoint}`,
    method,
    data,
    params,
    withCredentials: true,
  });
};

const AdminStudentsListPage: React.FC = () => {
  const { openModal } = useModal();
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 8;

  const fetchStudents = async (page: number) => {
    try {
      setLoading(true);
      const response = await fetchWithAuth("AdminStudentsListPage", "GET", undefined, {
        page,
        limit,
      });
      console.log(response.data);

      const result = response.data as PaginatedResponse;
      if (!result.success) {
        setError(result.message || "Failed to fetch students");
        return;
      }
      setStudents(result.data.data || []);
      setCurrentPage(result.data.currentPage);
      setTotalPages(result.data.totalPages);
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching students.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(currentPage);
  }, [currentPage]);

  const handleViewDetails = (student: Student) => {
    navigate(`${ROUTES.ADMIN}${ROUTES.ADMIN_USER_DETAILS}${student.userId}`);
  };

  const handleBlockUnblock = async (
    id: string,
    status: boolean,
    userId: string
  ) => {
    const prevStudents = [...students];

    setStudents((prev) =>
      prev.map((s) => (s._id === id ? { ...s, isBlocked: status } : s))
    );

    try {
      await fetchWithAuth("block_UnBlock", "PUT", {
        userId,
        isBlocked: status,
      });
    } catch (error) {
      console.error("Error blocking/unblocking student:", error);
      setStudents(prevStudents);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns: TableColumn<Student>[] = [
    { label: "Name", key: "username" },
    { label: "Email", key: "email" },
    {
      label: "Created At",
      render: (student: Student) =>
        new Date(student.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    },
    {
      label: "Actions",
      render: (student: Student) =>
        student.isBlocked ? (
          <button
            onClick={() =>
              openModal(
                () => handleBlockUnblock(student._id, false, student.userId),
                "Unblock this student?"
              )
            }
            className="px-4 py-1 bg-orange-500 text-white rounded-md"
          >
            Unblock
          </button>
        ) : (
          <button
            onClick={() =>
              openModal(
                () => handleBlockUnblock(student._id, true, student.userId),
                "Block this student?"
              )
            }
            className="px-4 py-1 bg-blue-500 text-white rounded-md"
          >
            Block
          </button>
        ),
    },
    {
      label: "About",
      render: (student: Student) => (
        <button
          onClick={() => handleViewDetails(student)}
          className="px-4 py-1 bg-green-500 text-white rounded-md"
        >
          View
        </button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSideBar />
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-6">Student Details</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <div className="text-red-500">
            <p>{error}</p>
            <button
              onClick={() => fetchStudents(currentPage)}
              className="bg-blue-500 text-white px-4 py-1 rounded"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <TableComponent
              columns={columns}
              data={students} // Removed redundant filter
            />
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

export default AdminStudentsListPage;