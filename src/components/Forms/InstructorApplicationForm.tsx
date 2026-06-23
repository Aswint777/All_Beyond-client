import React, { useState } from "react";
import UserNavbar from "../layout/UserNavbar";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import {
  InstructorApplicationErrors,
  validateInstructorApplication,
} from "../validation/instructorApplicationErrors";
import { submitInstructorApplication } from "../../services/userService";
import dummyImage from "../../assets/images/blank-profile-picture-973460_640.webp"
import { ROUTES } from "../../utils/paths";


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
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = () => {
    const errors = validateInstructorApplication(formData);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]:
        validateInstructorApplication({ ...formData, [name]: value })[name] ||
        "",
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: file,
        ...(e.target.name === "profilePhoto" && {
          profilePhotoPreview: URL.createObjectURL(file),
        }),
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

    setLoading(true);

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
      if (!_id) {
      throw new Error("User ID is not available");
    }
      await submitInstructorApplication(_id, formDataObj);

      setLoading(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate(`${ROUTES.USER}${ROUTES.INSTRUCTOR_APPLY_PAGE}`); 
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex flex-col items-center p-6 lg:p-10">
        {showSuccess && (
          <div className="fixed top-20 right-4 z-50 flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-in">
          
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor" 
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="font-semibold">
              Application submitted successfully!
            </span>
          </div>
        )}

        <div className="mb-8 flex flex-col items-center mt-11">
          <label htmlFor="profilePhotoInput" className="cursor-pointer">
            <img
              src={
                formData.profilePhotoPreview ||dummyImage
              }
              alt="Profile Preview"
              className="w-32 h-32 rounded-full border-4 border-purple-200 object-cover shadow-md hover:opacity-80 transition-all duration-200"
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
          {formErrors.profilePhoto && (
            <p className="text-red-500 text-xs mt-2">
              {formErrors.profilePhoto}
            </p>
          )}
        </div>

        <div className="bg-white shadow-xl rounded-2xl p-8 max-w-4xl w-full transform transition-all duration-300 hover:shadow-2xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Apply As Instructor
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                "firstName",
                "lastName",
                "age",
                "qualification",
                "address",
                "contactNumber",
                "city",
                "country",
                "pinNumber",
                "email",
              ].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 capitalize">
                    {field.replace(/([A-Z])/g, " $1").trim()}
                  </label>
                  <input
                    type={field === "age" ? "number" : "text"}
                    name={field}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    onChange={handleChange}
                    value={
                      typeof formData[field as keyof typeof formData] ===
                      "string"
                        ? (formData[field as keyof typeof formData] as string)
                        : ""
                    }
                    disabled={field === "email"}
                  />
                  {formErrors[field as keyof InstructorApplicationErrors] && (
                    <p className="text-red-500 text-xs mt-2">
                      {formErrors[field as keyof InstructorApplicationErrors]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Gender
              </label>
              <select
                name="gender"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                onChange={handleChange}
                value={formData.gender}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {formErrors.gender && (
                <p className="text-red-500 text-xs mt-2">{formErrors.gender}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Education File (PDF)
              </label>
              <input
                type="file"
                name="educationFile"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                accept="application/pdf"
                onChange={handleFileChange}
              />
              {formErrors.educationFile && (
                <p className="text-red-500 text-xs mt-2">
                  {formErrors.educationFile}
                </p>
              )}
            </div>

            <button
              type="submit"
              className={`w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow-md hover:from-purple-600 hover:to-purple-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed`}
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
