import React, { useEffect, useState } from "react";
import AdminSideBar from "../../components/layout/AdminSideBar";
import axios from "axios";
import TableComponent, {
  TableColumn,
} from "../../components/reusableComponents/TableComponent";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../components/context/ModalContext";
// import Pagination from "../../components/Pagination";
import { ROUTES } from "../../utils/paths";
import Pagination from "../../components/reusableComponents/Pagination";

interface Instructor {
  _id: string;
  username: string;
  email: string;
  contactNumber: number;
  isBlocked: boolean;
  qualification: string;
  userId: string;
  age: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

interface PaginatedResponse {
  success: boolean;
  data: {
    data: Instructor[];
    total: number;
    currentPage: number;
    totalPages: number;
  };
  message: string;
}

const API_URL = import.meta.env.VITE_REACT_APP_API_URL!;

const AdminInstructorListPage: React.FC = () => {
  const { openModal } = useModal();
  const blockContent = "Are you sure you want to block this Instructor?";
  const unblockContent = "Are you sure you want to unblock this Instructor?";

  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 3;
  const navigate = useNavigate();

  const fetchInstructors = async (page: number) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/admin/AdminInstructorList`,
        {
          params: { page, limit, status: "approved" }, 
          withCredentials: true,
        }
      );
      console.log(response.data,'lll');

      const result = response.data as PaginatedResponse;
      if (!result.success) {
        setError(result.message || "Failed to fetch instructors");
        return;
      }
       const instructorsOnly = result.data.data.filter(
      (instructor) => instructor.status === "approved"
    );
      setInstructors(instructorsOnly|| []);
      setCurrentPage(result.data.currentPage);
      setTotalPages(result.data.totalPages);
    } catch (err: any) {
      setError(
        err.message || "An error occurred while fetching instructors."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructors(currentPage);
  }, [currentPage]);

  const handleViewDetails = (instructor: Instructor) => {
    navigate(`${ROUTES.ADMIN}${ROUTES.ADMIN_USER_DETAILS}${instructor.userId}`);
    console.log(
      `${ROUTES.ADMIN}${ROUTES.ADMIN_USER_DETAILS}${instructor.userId}`
    );
  };

  const handleBlockUnblock = async (
    id: string,
    status: boolean,
    userId: string
  ) => {
    try {
      const response = await axios.put(
        `${API_URL}/admin/block_UnBlock`,
        {
          userId,
          isBlocked: status,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200 || response.status === 204) {
        setInstructors((prev) =>
          prev.map((instructor) =>
            instructor._id === id
              ? { ...instructor, isBlocked: status }
              : instructor
          )
        );
      }
    } catch (error) {
      console.error("Error blocking/unblocking instructor:", error);
      setError("Failed to update instructor status. Please try again.");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns: TableColumn<Instructor>[] = [
    { label: "Name", key: "username" },
    { label: "Email", key: "email" },
    { label: "Contacts", key: "contactNumber" },
    {
      label: "Created At",
      render: (instructor: Instructor) =>
        new Date(instructor.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    },
    { label: "Age", key: "age" },
    {
      label: "Actions",
      render: (instructor: Instructor) =>
        instructor.isBlocked ? (
          <button
            onClick={() =>
              openModal(
                () =>
                  handleBlockUnblock(instructor._id, false, instructor.userId),
                unblockContent
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
                () =>
                  handleBlockUnblock(instructor._id, true, instructor.userId),
                blockContent
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
      render: (instructor: Instructor) => (
        <button
          onClick={() => handleViewDetails(instructor)}
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold"></h2>
          <button
            onClick={() => navigate("/admin/AdminInstructorApplicationList")}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            View Instructor Applications
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-6">Instructor List</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <div className="text-red-500">
            <p>{error}</p>
            <button
              onClick={() => fetchInstructors(currentPage)}
              className="bg-blue-500 text-white px-4 py-1 rounded"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <TableComponent
              columns={columns}
              data={instructors} // Removed frontend filter
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

export default AdminInstructorListPage;