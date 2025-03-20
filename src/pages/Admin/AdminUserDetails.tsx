import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AdminSideBar from "../../components/layout/AdminSideBar";

interface user {
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  contacts: number;
  isVerified: boolean;
  isBlocked: boolean;
  address: string;
  city: string;
  contactNumber: string;
  country: string;
  facebook: string;
  gender: string;
  instagram: string;
  linkedin: string;
  age: number;
  pinNumber: string;
  createdAt: string;
  updatedAt: string;
  qualification: string;
  isAppliedInstructor: boolean;
  educationFile: string;
  profilePhoto: string;
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

const AdminUserDetails: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [student, setStudent] = useState<user | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const response = await fetchWithAuth(`user-details/${userId}`);
        console.log("user:", response.data.data);

        setStudent(response.data.data);
      } catch (err: any) {
        console.error("Error fetching student details:", err);
        setError("Failed to load student details.");
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchStudentDetails();
  }, [userId]);

  return (
    <div className="flex">
      {/* Sidebar */}
      <AdminSideBar />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-200 min-h-screen">
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-gray-100 shadow-lg rounded-lg">
          <div className="flex items-center space-x-6">
          <img
            src={student?.profilePhoto || "https://via.placeholder.com/40"}
            alt="Profile"
            className="w-28 h-28 rounded-full border border-gray-300 object-cover"
          />
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                {student?.username || "User"}
              </h2>
              <p className="text-gray-500">
                {student?.email || "Email not available"}
              </p>
              <p className="text-gray-500">USER ID : {student?.userId}</p>
              <div>
  <label className="text-sm text-gray-600">Education File</label>
  {student?.educationFile ? (
    <a
      href={student.educationFile}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-500 underline"
    >
      View Education File
    </a>
  ) : (
    <p className="text-gray-500">No file uploaded</p>
  )}
</div>
            </div>
          </div>

          <div className="border-t border-gray-300 mt-6 pt-6  p-4">
            {loading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : student ? (
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-600">First Name</label>
                  <input
                    type="text"
                    value={student?.firstName}
                    readOnly
                    className="w-full p-2 border rounded bg-gray-100"
                    disabled
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Last Name</label>
                  <input
                    type="text"
                    value={student?.lastName}
                    readOnly
                    className="w-full p-2 border rounded bg-gray-100"
                    disabled
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Email</label>
                  <input
                    type="text"
                    value={student?.email}
                    readOnly
                    className="w-full p-2 border rounded bg-gray-100"
                    disabled
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Phone Number</label>
                  <input
                    type="text"
                    value={student?.contactNumber}
                    readOnly
                    className="w-full p-2 border rounded bg-gray-100"
                    disabled
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Qualification</label>
                  <input
                    type="text"
                    value={student?.qualification}
                    readOnly
                    className="w-full p-2 border rounded bg-gray-100"
                    disabled
                  />
                </div>
                <div></div>
                <div>
                  <label className="text-sm text-gray-600">City</label>
                  <input
                    type="text"
                    value={student?.city}
                    readOnly
                    className="w-full p-2 border rounded bg-gray-100"
                    disabled
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Country</label>
                  <input
                    type="text"
                    value={student.country}
                    readOnly
                    className="w-full p-2 border rounded bg-gray-100"
                    disabled
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Address</label>
                  <input
                    type="text"
                    value={student.address}
                    readOnly
                    className="w-full p-2 border rounded bg-gray-100"
                    disabled
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Pin Code </label>
                  <input
                    type="text"
                    value={student?.pinNumber}
                    readOnly
                    className="w-full p-2 border rounded bg-gray-100"
                    disabled
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">gender</label>
                  <input
                    type="text"
                    value={student.gender}
                    readOnly
                    className="w-full p-2 border rounded bg-gray-100"
                    disabled
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">age</label>
                  <input
                    type="text"
                    value={student.age}
                    readOnly
                    className="w-full p-2 border rounded bg-gray-100"
                    disabled
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Verified</label>
                  <input
                    type="text"
                    value={student.isVerified ? "Yes" : "No"}
                    readOnly
                    className={`w-full p-2 border rounded font-semibold ${
                      student.isVerified
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Blocked</label>
                  <input
                    type="text"
                    value={student.isBlocked ? "Yes" : "No"}
                    readOnly
                    className={`w-full p-2 border rounded font-semibold ${
                      student.isBlocked
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Linkedin</label>
                  <input
                    type="text"
                    value={student.linkedin}
                    readOnly
                    className="w-full p-2 border rounded bg-gray-100"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Instagram</label>
                  <input
                    type="text"
                    value={student.instagram}
                    readOnly
                    className="w-full p-2 border rounded bg-gray-100"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Facebook</label>
                  <input
                    type="text"
                    value={student.facebook}
                    readOnly
                    className="w-full p-2 border rounded bg-gray-100"
                  />
                </div>
                <div></div>
                <div>
                  <label className="text-sm text-gray-600">
                    Date of Sign Up
                  </label>
                  <input
                    type="text"
                    value={student.createdAt}
                    readOnly
                    className="w-full p-2 border rounded bg-gray-100"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Last Update</label>
                  <input
                    type="text"
                    value={student.updatedAt}
                    readOnly
                    className="w-full p-2 border rounded bg-gray-100"
                  />
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-600">
                No student data found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetails;
