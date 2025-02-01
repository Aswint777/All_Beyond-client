import React, { useState } from "react";
import UserNavbar from "../layout/UserNavbar";
import axios from "axios";
import { config } from "../../configaration/Config";

const InstructorApplicationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    qualification: "",
    // profilePhoto: null as File | null,
    address: "",
    contactNumber: "",
    educationFile: null as File | null,
    gender: "",
    city: "",
    country: "",
    pinNumber: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      console.log("Selected file:", file);
      setFormData((prev) => {
        const newFormData = { ...prev, [e.target.name]: file };
        console.log("Updated formData:", newFormData);
        return newFormData;
      });
    }
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const API_URL = import.meta.env.VITE_REACT_APP_API_URL!;
    const formDataObj = new FormData();
    
    Object.entries(formData).forEach(([key, value]) => {
      if (value instanceof File) {
        formDataObj.append(key, value);
        console.log(`Appending file: ${key} ->`, value);
      } else if (value !== null && value !== undefined) {
        formDataObj.append(key, String(value));
        console.log(`Appending text: ${key} ->`, value);
      }
    });
    
    
    try {
      console.log(formDataObj,'haaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaai');
      const response = await axios.post(`${API_URL}/instructor/instructorApplication`, formDataObj, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    
      console.log("Success:", response.data);
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Error:", error.response.data);
        alert(`Error: ${error.response.data.message || "Something went wrong!"}`);
      } else {
        console.error("Unknown error:", error);
        alert("An unexpected error occurred.");
      }
    }
    
  };
  

  return (
    <>
      <UserNavbar />
      <div className="flex flex-col items-center space-y-10 p-10">
        <div className="bg-white shadow-lg rounded-2xl p-6 max-w-4xl w-full">
          <h2 className="text-xl font-semibold mb-4">Apply As Instructor</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  className="border p-2 rounded w-full"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  className="border p-2 rounded w-full"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  placeholder="Age"
                  className="border p-2 rounded w-full"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Qualification
                </label>
                <input
                  type="text"
                  name="qualification"
                  placeholder="Qualification"
                  className="border p-2 rounded w-full"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  className="border p-2 rounded w-full"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number
                </label>
                <input
                  type="text"
                  name="contactNumber"
                  placeholder="Contact Number"
                  className="border p-2 rounded w-full"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  className="border p-2 rounded w-full"
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
              Profile Photo
              </label>
              <input
              type="file"
              name="profilePhoto"
              className="border p-2 rounded w-full"
              onChange={handleFileChange}
              required
              />
              </div> */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  placeholder="country"
                  className="border p-2 rounded w-full"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  placeholder="city"
                  className="border p-2 rounded w-full"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PIN Number
                </label>
                <input
                  type="text"
                  name="pinNumber"
                  placeholder="pinNumber"
                  className="border p-2 rounded w-full"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Education File
                </label>
                <input
                  type="file"
                  name="educationFile"
                  className="border p-2 rounded w-full"
                  onChange={handleFileChange}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 bg-purple-500 text-white px-4 py-2 rounded-lg w-full"
            >
              Submit Application
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default InstructorApplicationForm;
