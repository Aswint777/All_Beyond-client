// import React, { useEffect, useState } from 'react'
// import InstructorList from '../../components/reusableComponents/InstructorList';
// import AdminSideBar from '../../components/layout/AdminSideBar';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// // import axios from "axios";
// // import React, { useEffect, useState } from "react";
// // import AdminSideBar from "../../components/layout/AdminSideBar";
// // import InstructorList from "../../components/reusableComponents/InstructorList";
// // import { useNavigate } from "react-router-dom";

// interface Student {
//     _id: string;
//     username: string;
//     email: string;
//     isBlocked: boolean;
//     userId: string;
//     contactNumber: number;
//     qualification: string;
//     age: number;
//     status: "pending" | "approved" | "rejected";
//   }


// const AdminInstructorLIst = () => {
//     const [students, setStudents] = useState<Student[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();



//   useEffect(() => {
//     const fetchStudents = async () => {
//       try {
//         const API_URL = import.meta.env.VITE_REACT_APP_API_URL!;
//         const response = await axios.get(`${API_URL}/admin/AdminInstructorApplicationList`);
//         setStudents(response.data.data);
//       } catch (err: any) {
//         setError(err.message || "An error occurred while fetching students.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchStudents();
//   }, []);

//   const handleBlockUnblock = async (_id: string, status: boolean, userId: string) => {
//     try {
//       const API_URL = import.meta.env.VITE_REACT_APP_API_URL!;
//       const response = await axios.put(`${API_URL}/admin/block_UnBlock`, {
//         userId: userId,
//         isBlocked: status,
//       });
//       if (response.status === 200) {
//         setStudents((prevStudents) =>
//           prevStudents.map((student) => (student._id === _id ? { ...student, isBlocked: status } : student))
//         );
//       }
//     } catch (error) {
//       console.error("Error updating block status:", error);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex">
//       <AdminSideBar />

//       <main className="flex-1 p-8">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-2xl font-bold"></h2>
//           <button
//             onClick={() => navigate("/admin/AdminInstructorApplicationList")}
//             className="px-4 py-2 bg-blue-500 text-white rounded-md"
//           >
//             View Instructor Applications
//           </button>
//         </div>

//         {loading ? (
//           <p>Loading...</p>
//         ) : error ? (
//           <p className="text-red-500">{error}</p>
//         ) : (
//           <>
//             {/* Approved Instructors */}
//             <InstructorList
//               title=" Instructors"
//               students={students.filter((s) => s.status === "approved")}
//               onStatusChange={() => {}} // No status change required
//               onBlockUnblock={handleBlockUnblock}
//             />
//           </>
//         )}
//       </main>
//     </div>
//   );
// }

// export default AdminInstructorLIst




import React, { useEffect, useState } from "react";
import AdminSideBar from "../../components/layout/AdminSideBar";
import axios from "axios";
import TableComponent, { TableColumn } from "../../components/reusableComponents/TableComponent";
import { useNavigate } from "react-router-dom";


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
  qualification: string;
  age: number;
  status: "pending" | "approved" | "rejected";
}

const AdminInstructorListPage = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const Navigate = useNavigate()

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const API_URL = import.meta.env.VITE_REACT_APP_API_URL!;
        const response = await axios.get(`${API_URL}/admin/AdminInstructorApplicationList`);
        setInstructors(response.data.data);
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching instructors.");
      } finally {
        setLoading(false);
      }
    };
    fetchInstructors();
  }, []);

  const columns: TableColumn<Instructor>[] = [
    { label: "ID", key: "_id" as keyof Instructor },
    { label: "Name", key: "username" as keyof Instructor },
    { label: "Email", key: "email" as keyof Instructor },
    { label: "Qualification", key: "qualification" as keyof Instructor },
    { label: "Age", key: "age" as keyof Instructor },
    { label: "Status", key: "status" as keyof Instructor },
  ];
  

  // const columns = [
  //   { label: "ID", key: "_id" },
  //   { label: "Name", key: "username" },
  //   { label: "Email", key: "email" },
  //   { label: "Qualification", key: "qualification" },
  //   { label: "Age", key: "age" },
  //   { label: "Status", key: "status" },
  // ];

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
      sdvmdklcm
        {loading ? <p>Loading...</p> : error ? <p className="text-red-500">{error}</p> : <TableComponent columns={columns} data={instructors} />}
      </main>
    </div>
  );
};

export default AdminInstructorListPage;

