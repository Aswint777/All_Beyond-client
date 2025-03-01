// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import AdminSideBar from '../../components/layout/AdminSideBar';

// interface Student {
//   _id: string;
//   username: string;
//   email: string;
//   isBlocked: boolean;
//   userId: string;
//   contactNumber: number;
//   qualification: string;
//   age: number;
//   status: "pending" | "approved" | "rejected"; // Use the enum types
// }

// const AdminInstructorApplicationList = () => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 8;

//   const [students, setStudents] = useState<Student[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchStudents = async () => {
//       try {
//         const API_URL = import.meta.env.VITE_REACT_APP_API_URL!;
//         const response = await axios.get(`${API_URL}/admin/AdminInstructorApplicationList`);
//         setStudents(response.data.data);
//         console.log(response.data.data,'.......................................');
        
//       } catch (err: any) {
//         setError(err.message || "An error occurred while fetching students.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchStudents();
//   }, []);

//   // 🛑 Handle Status Change
//   const handleStatusChange = async (id: string, newStatus: "pending" | "approved" | "rejected") => {
//     try {
//       const API_URL = import.meta.env.VITE_REACT_APP_API_URL!;
//       const response = await axios.put(`${API_URL}/admin/updateInstructorStatus`, {
//         Id: id,
//         status: newStatus,  
//       });

//       if (response.status === 200) {
//         setStudents((prevStudents) =>
//           prevStudents.map((student) =>
//             student._id === id ? { ...student, status: newStatus } : student
//           )
//         );
//       }
      
//     } catch (error) {
//       console.error("Error updating status:", error);
//       alert("Failed to update status. Please try again.");
//     }
//   };
  
//   const handleBlockUnblock = async (
//     _id: string,
//     status: boolean,
//     userid: string
//   ) => {
//     try {
//       const API_URL = import.meta.env.VITE_REACT_APP_API_URL!;
//       const response = await axios.put(`${API_URL}/admin/block_UnBlock`, {
//         userId: userid,
//         isBlocked: status,
//       });
//       if (response.status === 200) {
//         setStudents((prevStudents) =>
//           prevStudents.map((student) =>
//             student._id === _id ? { ...student, isBlocked: status } : student
//           )
//         );
//       }
//     } catch (error) {}
//   };

//   // Pagination logic
//   const totalPages = Math.ceil(students.length / itemsPerPage);
//   const currentStudents = students.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

//   return (
//     <div className="min-h-screen bg-gray-100 flex">
//       <AdminSideBar />

//       <main className="flex-1 p-8">
//         <h2 className="text-2xl font-bold mb-6">Instructor Applications</h2>

//         <table className="w-full table-auto border-collapse border">
//           <thead>
//             <tr className="bg-gray-200">
//               <th className="px-4 py-2 border">ID</th>
//               <th className="px-4 py-2 border">Name</th>
//               <th className="px-4 py-2 border">Email</th>
//               <th className="px-4 py-2 border">Contacts</th>
//               <th className="px-4 py-2 border">Qualification</th>
//               <th className="px-4 py-2 border">Age</th>
//               <th className="px-4 py-2 border">Status</th>
//               <th className="px-4 py-2 border">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentStudents.map((student) => (
//               <tr key={student._id} className="text-center">
//                 <td className="px-4 py-2 border">{student.userId}</td>
//                 <td className="px-4 py-2 border">{student.username}</td>
//                 <td className="px-4 py-2 border">{student.email}</td>
//                 <td className="px-4 py-2 border">{student.contactNumber}</td>
//                 <td className="px-4 py-2 border">{student.qualification}</td>
//                 <td className="px-4 py-2 border">{student.age}</td>

//                 {/* ✅ Dropdown for Status */}
//                 <td className="px-4 py-2 border">
//                   <select
//                     value={student.status}
//                     onChange={(e) => handleStatusChange(student._id, e.target.value as "pending" | "approved" | "rejected")}
//                     className="border p-1 rounded-md"
//                   >
//                     <option value="pending">Pending</option>
//                     <option value="approved">Approved</option>
//                     <option value="rejected">Rejected</option>
//                   </select>
//                 </td>

//                 <td className="px-4 py-2 border">
//                 {student.isBlocked ? (
//                     <button
//                       onClick={() =>
//                         handleBlockUnblock(student._id, false, student.userId)
//                       }
//                       className="px-4 py-1 bg-orange-500 text-white rounded-md"
//                     >
//                       Unblock
//                     </button>
//                   ) : (
//                     <button
//                       onClick={() =>
//                         handleBlockUnblock(student._id, true, student.userId)
//                       }
//                       className="px-4 py-1 bg-blue-500 text-white rounded-md"
//                     >
//                       Block
//                     </button>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* Pagination */}
//         <div className="flex justify-center items-center mt-4 space-x-2">
//           <button
//             onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//             className="px-3 py-1 border rounded-md bg-gray-300"
//           >
//             «
//           </button>
//           {Array.from({ length: totalPages }, (_, i) => (
//             <button
//               key={i + 1}
//               onClick={() => setCurrentPage(i + 1)}
//               className={`px-3 py-1 border rounded-md ${currentPage === i + 1 ? "bg-purple-500 text-white" : ""}`}
//             >
//               {i + 1}
//             </button>
//           ))}
//           <button
//             onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//             className="px-3 py-1 border rounded-md bg-gray-300"
//           >
//             »
//           </button>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default AdminInstructorApplicationList;

import axios from "axios";
import React, { useEffect, useState } from "react";
import AdminSideBar from "../../components/layout/AdminSideBar";
import InstructorList from "../../components/reusableComponents/InstructorList";
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
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const API_URL = import.meta.env.VITE_REACT_APP_API_URL!;
        const response = await axios.get(`${API_URL}/admin/AdminInstructorApplicationList`);
        setStudents(response.data.data);
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching students.");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleStatusChange = async (id: string, newStatus: "pending" | "approved" | "rejected") => {
    try {
      const API_URL = import.meta.env.VITE_REACT_APP_API_URL!;
      const response = await axios.put(`${API_URL}/admin/updateInstructorStatus`, {
        Id: id,
        status: newStatus,
      });

      if (response.status === 200) {
        setStudents((prevStudents) =>
          prevStudents.map((student) => (student._id === id ? { ...student, status: newStatus } : student))
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status. Please try again.");
    }
  };

  const handleBlockUnblock = async (_id: string, status: boolean, userId: string) => {
    try {
      const API_URL = import.meta.env.VITE_REACT_APP_API_URL!;
      const response = await axios.put(`${API_URL}/admin/block_UnBlock`, {
        userId: userId,
        isBlocked: status,
      });
      if (response.status === 200) {
        setStudents((prevStudents) =>
          prevStudents.map((student) => (student._id === _id ? { ...student, isBlocked: status } : student))
        );
      }
    } catch (error) {
      console.error("Error updating block status:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSideBar />

      <main className="flex-1 p-8">


        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            {/* Pending & Rejected Instructors */}
            <InstructorList
              title="Instructor Applications"
              students={students.filter((s) => s.status !== "approved")}
              onStatusChange={handleStatusChange}
              onBlockUnblock={handleBlockUnblock}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default AdminInstructorApplicationList;
