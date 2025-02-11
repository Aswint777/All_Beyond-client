import React, { useState } from "react";
import UserNavbar from "../layout/UserNavbar";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";

const InstructorApplicationForm: React.FC = () => {
  const { userDetails } = useSelector((state: RootState) => state.user);
console.log(userDetails,'<>>>>>');
const navigate = useNavigate()

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    qualification: "",
    address: "",
    contactNumber: "",
    educationFile: null as File | null,
    profilePhoto: null as File | null,
    profilePhotoPreview: "",
    gender: "",
    city: "",
    country: "",
    pinNumber: "",
    email: "",
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file uploads (profile & education file)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const fileUrl = URL.createObjectURL(file); // Preview URL

      setFormData((prev) => ({
        ...prev,
        [e.target.name]: file,
        ...(e.target.name === "profilePhoto" && { profilePhotoPreview: fileUrl }),
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const API_URL = import.meta.env.VITE_REACT_APP_API_URL!;
    const formDataObj = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value instanceof File) {
        formDataObj.append(key, value);
      } else if (value !== null && key !== "profilePhotoPreview") {
        formDataObj.append(key, String(value));
      }
    });

    try {
      const _id = userDetails?._id
      console.log(_id,"iddddddddddddddd");
      
      console.log("Submitting FormData:", [...formDataObj.entries()]);
      const response = await axios.post(`${API_URL}/instructor/instructorApplication/${_id}`, formDataObj, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Success:", response.data);
      navigate("/InstructorApplyPage")
      alert("Application submitted successfully!");
    } catch (error: any) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <UserNavbar />
      <div className="flex flex-col items-center space-y-10 p-10">
        <div className="bg-white shadow-lg rounded-2xl p-6 max-w-4xl w-full">
          <h2 className="text-xl font-semibold mb-4">Apply As Instructor</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col items-center">
              <label htmlFor="profilePhotoInput" className="cursor-pointer">
                <img
                  src={formData.profilePhotoPreview || "https://via.placeholder.com/150"}
                  alt="Profile Preview"
                  className="rounded-full border border-gray-300 w-32 h-32 object-cover"
                />
              </label>
              <input
                type="file"
                id="profilePhotoInput"
                name="profilePhoto"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <p className="text-sm text-gray-600 mt-2">Click to upload profile photo</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["firstName", "lastName", "age", "qualification", "address", "contactNumber", "city", "country", "pinNumber", "email"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field}</label>
                  <input
                    type={field === "age" ? "number" : "text"}
                    name={field}
                    placeholder={field}
                    className="border p-2 rounded w-full"
                    onChange={handleChange}
                    required
                  />
                </div>
              ))}

              {/* Gender Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select name="gender" className="border p-2 rounded w-full" onChange={handleChange} required>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Education File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Education File</label>
                <input type="file" name="educationFile" className="border p-2 rounded w-full" onChange={handleFileChange} required />
              </div>
            </div>

            <button type="submit" className="mt-4 bg-purple-500 text-white px-4 py-2 rounded-lg w-full">
              Submit Application
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default InstructorApplicationForm;
