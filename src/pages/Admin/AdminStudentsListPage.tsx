import React, { useEffect, useState } from "react";
import AdminSideBar from "../../components/layout/AdminSideBar";
import axios from "axios";
import { useModal } from "../../components/context/ModalContext";
// import TableComponent from "../../components/reusableComponents/TableComponent";
import TableComponent, {
  TableColumn,
} from "../../components/reusableComponents/TableComponent";

interface Student {
  _id: string;
  username: string;
  email: string;
  isBlocked: boolean;
  userId: string;
  contacts: number;
  isVerified:boolean
  role:string
}

const AdminStudentsListPage: React.FC = () => {
  const { openModal } = useModal();
  const blockContent = "Are you sure you want to block this student?";
  const unblockContent = "Are you sure you want to unblock this student?";

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const API_URL = import.meta.env.VITE_REACT_APP_API_URL!;
        const response = await axios.get(
          `${API_URL}/admin/AdminStudentsListPage`,
          {
            withCredentials: true,
          }
        );
        setStudents(response.data.data);
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching students.");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleBlockUnblock = async (
    id: string,
    status: boolean,
    userId: string
  ) => {
    try {
      const API_URL = import.meta.env.VITE_REACT_APP_API_URL!;
      const response = await axios.put(
        `${API_URL}/admin/block_UnBlock`,
        {
          userId: userId,
          isBlocked: status,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setStudents((prev) =>
          prev.map((student) =>
            student._id === id ? { ...student, isBlocked: status } : student
          )
        );
      }
    } catch (error) {
      console.error("Error blocking/unblocking student:", error);
    }
  };
  const columns: TableColumn<Student>[] = [
    { label: "ID", key: "userId" },
    { label: "Name", key: "username" },
    { label: "Email", key: "email" },
    { label: "Contacts", key: "contacts" },
    {
      label: "Actions",
      render: (student: Student) =>
        student.isBlocked ? (
          <button
            onClick={() =>
              openModal(
                () => handleBlockUnblock(student._id, false, student.userId),
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
                () => handleBlockUnblock(student._id, true, student.userId),
                blockContent
              )
            }
            className="px-4 py-1 bg-blue-500 text-white rounded-md"
          >
            Block
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
          <p className="text-red-500">{error}</p>
        ) : (
          <TableComponent columns={columns} 
          data={students.filter(
            (students) => students.role === "student"
          )}
          // data={students}
           />
        )}
      </main>
    </div>
  );
};

export default AdminStudentsListPage;
