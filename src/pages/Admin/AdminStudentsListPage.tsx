import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSideBar from "../../components/layout/AdminSideBar";
import axios from "axios";
import { useModal } from "../../components/context/ModalContext";
import TableComponent, { TableColumn } from "../../components/reusableComponents/TableComponent";

interface Student {
  _id: string;
  username: string;
  email: string;
  isBlocked: boolean;
  userId: string;
  contactNumber: number;
  isVerified: boolean;
  role: string;
}

const API_URL = import.meta.env.VITE_REACT_APP_API_URL!;

const fetchWithAuth = async (endpoint: string, method = "GET", data?: any) => {
  return axios({
    url: `${API_URL}/admin/${endpoint}`,
    method,
    data,
    withCredentials: true,
  });
};

const AdminStudentsListPage: React.FC = () => {
  const { openModal } = useModal();
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetchWithAuth("AdminStudentsListPage");
        setStudents(response.data.data);
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching students.");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleViewDetails = (student: Student) => {
    navigate(`/admin/user_details/${student.userId}`);
  };

  const handleBlockUnblock = async (id: string, status: boolean, userId: string) => {
    const prevStudents = [...students]; // Store previous state

    setStudents((prev) =>
      prev.map((s) => (s._id === id ? { ...s, isBlocked: status } : s))
    );

    try {
      await fetchWithAuth("block_UnBlock", "PUT", { userId, isBlocked: status });
    } catch (error) {
      console.error("Error blocking/unblocking student:", error);
      setStudents(prevStudents); // Revert state on failure
    }
  };

  const columns: TableColumn<Student>[] = [
    { label: "ID", key: "userId" },
    { label: "Name", key: "username" },
    { label: "Email", key: "email" },
    { label: "Contacts", key: "contactNumber" },
    {
      label: "Actions",
      render: (student: Student) =>
        student.isBlocked ? (
          <button
            onClick={() => openModal(() => handleBlockUnblock(student._id, false, student.userId), "Unblock this student?")}
            className="px-4 py-1 bg-orange-500 text-white rounded-md"
          >
            Unblock
          </button>
        ) : (
          <button
            onClick={() => openModal(() => handleBlockUnblock(student._id, true, student.userId), "Block this student?")}
            className="px-4 py-1 bg-blue-500 text-white rounded-md"
          >
            Block
          </button>
        ),
    },
    {
      label: "About",
      render: (student: Student) => (
        <button onClick={() => handleViewDetails(student)} className="px-4 py-1 bg-green-500 text-white rounded-md">
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
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-4 py-1 rounded"
            >
              Retry
            </button>
          </div>
        ) : (
          <TableComponent columns={columns} data={students.filter((s) => s.role === "student")} />
        )}
      </main>
    </div>
  );
};

export default AdminStudentsListPage;
