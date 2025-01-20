import React, { useEffect, useState } from "react";
import AdminSideBar from "../../components/layout/AdminSideBar";
import axios from "axios";

interface Student{
  _id : number
  username:string
  email:string
  isBlocked :boolean
}

const AdminStudentsListPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Sample data for students
  // const students = [
  //   { id: 1, name: "John Doe", email: "john@example.com", phone: "1234567890", isBlocked: false },
  //   { id: 2, name: "Jane Doe", email: "jane@example.com", phone: "9876543210", isBlocked: true },
  //   // Add more students here
  // ];

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        console.log('http://localhost:5000/admin/AdminStudentsListPage,hai');
        
        const response = await axios.get("http://localhost:5000/admin/AdminStudentsListPage"); 
        console.log(response,'5000 here');
        console.log(response.data.data);
        
        setStudents(response.data.data); // Assuming response.data is an array of students
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching students.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);


  console.log(students,"students");
  
  const handleBlockUnblock = (id: number, status: boolean) => {
    setStudents((prevStudents) => {
      return prevStudents.map((student) =>
        student._id === id ? { ...student, isBlocked: status } : student
      );
    });
  };
  

  // Pagination logic
  const totalPages = Math.ceil(students.length / itemsPerPage);
  const currentStudents = students.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <AdminSideBar />

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-6">Student Details</h2>
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search content..."
            className="w-full p-2 border rounded-md shadow-sm"
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            🔍
          </button>
        </div>

        <table className="w-full table-auto border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentStudents.map((student) => (
              <tr key={student._id} className="text-center">
                <td className="px-4 py-2 border">{student._id}</td>
                <td className="px-4 py-2 border">{student.username}</td>
                <td className="px-4 py-2 border">{student.email}</td>
                <td className="px-4 py-2 border">
                  {student.isBlocked ? (
                    <button
                      onClick={() => handleBlockUnblock(student._id, false)}
                      className="px-4 py-1 bg-orange-500 text-white rounded-md"
                    >
                      Unblock
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBlockUnblock(student._id, true)}
                      className="px-4 py-1 bg-blue-500 text-white rounded-md"
                    >
                      Block
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-center items-center mt-4 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1 border rounded-md bg-gray-300"
          >
            «
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded-md ${
                currentPage === i + 1 ? "bg-purple-500 text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="px-3 py-1 border rounded-md bg-gray-300"
          >
            »
          </button>
        </div>
      </main>
    </div>
  );
};

export default AdminStudentsListPage;
