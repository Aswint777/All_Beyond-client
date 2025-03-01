import React, { useState } from "react";
import UserNavbar from "../layout/UserNavbar";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { InstructorApplicationErrors, validateInstructorApplication } from "../validation/instructorApplicationErrors";

const InstructorApplicationForm: React.FC = () => {
  const { userDetails } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

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
    email: userDetails?.email || "",
  });

  const [formErrors, setFormErrors] = useState<InstructorApplicationErrors>({});
  const [loading, setLoading] = useState(false); // ✅ Loading state
  const [showSuccess, setShowSuccess] = useState(false); // ✅ Success popup state

  const validateForm = () => {
    const errors = validateInstructorApplication(formData);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validateInstructorApplication({ ...formData, [name]: value })[name] || "",
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      setFormData((prev) => ({
        ...prev,
        [e.target.name]: file,
        ...(e.target.name === "profilePhoto" && { profilePhotoPreview: URL.createObjectURL(file) }),
      }));

      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [e.target.name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true); // ✅ Start loading

    const API_URL = import.meta.env.VITE_REACT_APP_API_URL!;
    const formDataObj = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "educationFile" || key === "profilePhoto") {
        if (value instanceof File) {
          formDataObj.append(key, value);
        }
      } else if (value !== null && key !== "profilePhotoPreview") {
        formDataObj.append(key, String(value));
      }
    });

    try {
      const _id = userDetails?._id;
      await axios.post(`${API_URL}/instructor/instructorApplication/${_id}`, formDataObj, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setLoading(false);
      setShowSuccess(true); // ✅ Show success popup
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/InstructorApplyPage");
      }, 2000);
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <UserNavbar />
      <div className="relative flex flex-col items-center space-y-10 p-10">
        
        {/* ✅ Success Popup */}
        {showSuccess && (
          <div className="fixed top-20 right-10 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
            🎉 Application submitted successfully!
          </div>
        )}

        {/* ✅ Profile Photo Preview & Upload */}
        <div className="absolute top-5 right-5 flex flex-col items-center">
          <label htmlFor="profilePhotoInput" className="cursor-pointer">
            <img
              src={formData.profilePhotoPreview || "https://via.placeholder.com/150"}
              alt="Profile Preview"
              className="w-24 h-24 rounded-full border border-gray-300 object-cover"
            />
          </label>
          <input
            type="file"
            id="profilePhotoInput"
            name="profilePhoto"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            required
          />
          {formErrors.profilePhoto && <p className="text-red-500 text-xs">{formErrors.profilePhoto}</p>}
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6 max-w-4xl w-full">
          <h2 className="text-xl font-semibold mb-4">Apply As Instructor</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* ✅ Text Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["firstName", "lastName", "age", "qualification", "address", "contactNumber", "city", "country", "pinNumber", "email"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field}</label>
                  <input
                    type={field === "age" ? "number" : "text"}
                    name={field}
                    className="border p-2 rounded w-full"
                    onChange={handleChange}
                    value={typeof formData[field as keyof typeof formData] === "string" ? (formData[field as keyof typeof formData] as string) : ""}
                    required
                  />
                  {formErrors[field] && <p className="text-red-500 text-xs">{formErrors[field]}</p>}
                </div>
              ))}
            </div>

            {/* ✅ Gender Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select name="gender" className="border p-2 rounded w-full" onChange={handleChange} required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {formErrors.gender && <p className="text-red-500 text-xs">{formErrors.gender}</p>}
            </div>

            {/* ✅ Education File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Education File</label>
              <input
                type="file"
                name="educationFile"
                className="border p-2 rounded w-full"
                onChange={handleFileChange}
                required
              />
              {formErrors.educationFile && <p className="text-red-500 text-xs">{formErrors.educationFile}</p>}
            </div>

            {/* ✅ Submit Button with Loading */}
            <button
              type="submit"
              className={`mt-4 px-4 py-2 rounded-lg w-full ${loading ? "bg-gray-400" : "bg-purple-500"} text-white`}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default InstructorApplicationForm;
