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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex">
      {/* Sidebar */}
      <AdminSideBar />

      {/* Main Content */}
      <div className="flex-1 p-6 lg:p-8">
        <div className="max-w-4xl mx-auto mt-10 bg-white shadow-xl rounded-2xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 flex items-center space-x-6">
            <img
              src={student?.profilePhoto || "https://via.placeholder.com/40"}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-md"
            />
            <div className="text-white">
              <h2 className="text-3xl font-bold tracking-tight">
                {student?.username || "User"}
              </h2>
              <p className="text-purple-100">{student?.email || "Email not available"}</p>
              <p className="text-purple-100">USER ID: {student?.userId}</p>
              <div className="mt-2">
                <label className="text-sm text-purple-200">Education File</label>
                {student?.educationFile ? (
                  <a
                    href={student.educationFile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-purple-100 underline hover:text-white transition-colors duration-200"
                  >
                    View Education File
                  </a>
                ) : (
                  <p className="text-purple-200">No file uploaded</p>
                )}
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-8">
            {loading ? (
              <p className="text-center text-gray-500 text-lg">Loading...</p>
            ) : error ? (
              <p className="text-center text-red-500 text-lg">{error}</p>
            ) : student ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={student.firstName}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 shadow-sm"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={student.lastName}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 shadow-sm"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="text"
                    value={student.email}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 shadow-sm"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={student.contactNumber}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 shadow-sm"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Qualification
                  </label>
                  <input
                    type="text"
                    value={student.qualification}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 shadow-sm"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={student.city}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 shadow-sm"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={student.country}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 shadow-sm"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={student.address}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 shadow-sm"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Pin Code
                  </label>
                  <input
                    type="text"
                    value={student.pinNumber}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 shadow-sm"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Gender
                  </label>
                  <input
                    type="text"
                    value={student.gender}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 shadow-sm"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Age
                  </label>
                  <input
                    type="text"
                    value={student.age}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 shadow-sm"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Verified
                  </label>
                  <input
                    type="text"
                    value={student.isVerified ? "Yes" : "No"}
                    readOnly
                    className={`w-full px-4 py-2 border rounded-lg shadow-sm font-semibold ${
                      student.isVerified
                        ? "bg-green-100 text-green-700 border-green-300"
                        : "bg-red-100 text-red-700 border-red-300"
                    }`}
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Blocked
                  </label>
                  <input
                    type="text"
                    value={student.isBlocked ? "Yes" : "No"}
                    readOnly
                    className={`w-full px-4 py-2 border rounded-lg shadow-sm font-semibold ${
                      student.isBlocked
                        ? "bg-red-100 text-red-700 border-red-300"
                        : "bg-green-100 text-green-700 border-green-300"
                    }`}
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    LinkedIn
                  </label>
                  <input
                    type="text"
                    value={student.linkedin}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 shadow-sm"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Instagram
                  </label>
                  <input
                    type="text"
                    value={student.instagram}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 shadow-sm"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Facebook
                  </label>
                  <input
                    type="text"
                    value={student.facebook}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 shadow-sm"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Date of Sign Up
                  </label>
                  <input
                    type="text"
                    value={student.createdAt}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 shadow-sm"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Last Update
                  </label>
                  <input
                    type="text"
                    value={student.updatedAt}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 shadow-sm"
                    disabled
                  />
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-600 text-lg">
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