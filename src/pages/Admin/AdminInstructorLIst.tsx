import React, { useEffect, useState } from "react";
import AdminSideBar from "../../components/layout/AdminSideBar";
import axios from "axios";
import TableComponent, {
  TableColumn,
} from "../../components/reusableComponents/TableComponent";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../components/context/ModalContext";

// interface TableColumn<T> {
// label: string;
// key?: keyof T;
// render?: (item: T) => React.ReactNode; // Custom rendering support
// }

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
}

const AdminInstructorListPage = () => {
  const { openModal } = useModal();
  const blockContent = "Are you sure you want to block this Instructor?";
  const unblockContent = "Are you sure you want to unblock this Instructor?";

  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // const [students, setStudents] = useState<Instructor[]>([]);

  const Navigate = useNavigate();

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const API_URL = import.meta.env.VITE_REACT_APP_API_URL!;
        const response = await axios.get(
          `${API_URL}/admin/AdminInstructorApplicationList`,
          {
            withCredentials: true,
          }
        );
        setInstructors(response.data.data);
      } catch (err: any) {
        setError(
          err.message || "An error occurred while fetching instructors."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchInstructors();
  }, []);

  const handleBlockUnblock = async (
    id: string,
    status: boolean,
    userid: string
  ) => {
    try {
      const API_URL = import.meta.env.VITE_REACT_APP_API_URL!;
      const response = await axios.put(
        `${API_URL}/admin/block_UnBlock`,
        {
          userId: userid,
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

  const columns: TableColumn<Instructor>[] = [
    { label: "ID", key: "userId" },
    { label: "Name", key: "username" },
    { label: "Email", key: "email" },
    { label: "Qualification", key: "qualification" },
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
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSideBar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold"></h2>
          <button
            onClick={() => Navigate("/admin/AdminInstructorApplicationList")}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            View Instructor Applications
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-6">Instructor List</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <TableComponent
            columns={columns}
            data={instructors.filter(
              (instructor) => instructor.status === "approved"
            )}
          />
        )}
      </main>
    </div>
  );
};

export default AdminInstructorListPage;
