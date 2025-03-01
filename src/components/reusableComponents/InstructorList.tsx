import React from "react";

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

interface InstructorListProps {
  title: string;
  students: Student[];
  onStatusChange: (id: string, newStatus: "pending" | "approved" | "rejected") => void;
  onBlockUnblock: (_id: string, status: boolean, userId: string) => void;
}

const InstructorList: React.FC<InstructorListProps> = ({ title, students, onStatusChange, onBlockUnblock }) => {
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <table className="w-full table-auto border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Contacts</th>
            <th className="px-4 py-2 border">Qualification</th>
            <th className="px-4 py-2 border">Age</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id} className="text-center">
              <td className="px-4 py-2 border">{student.userId}</td>
              <td className="px-4 py-2 border">{student.username}</td>
              <td className="px-4 py-2 border">{student.email}</td>
              <td className="px-4 py-2 border">{student.contactNumber}</td>
              <td className="px-4 py-2 border">{student.qualification}</td>
              <td className="px-4 py-2 border">{student.age}</td>

              {/* Status Dropdown */}
              <td className="px-4 py-2 border">
                <select
                  value={student.status}
                  onChange={(e) => onStatusChange(student._id, e.target.value as "pending" | "approved" | "rejected")}
                  className="border p-1 rounded-md"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </td>

              {/* Block / Unblock Button */}
              <td className="px-4 py-2 border">
                {student.isBlocked ? (
                  <button
                    onClick={() => onBlockUnblock(student._id, false, student.userId)}
                    className="px-4 py-1 bg-orange-500 text-white rounded-md"
                  >
                    Unblock
                  </button>
                ) : (
                  <button
                    onClick={() => onBlockUnblock(student._id, true, student.userId)}
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
    </div>
  );
};

export default InstructorList;
