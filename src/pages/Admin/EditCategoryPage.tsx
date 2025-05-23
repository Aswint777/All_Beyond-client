import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { categoryErrors, validateCategory } from "../../components/validation/CategoryErrors";

const EditCategoryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id, name, description } = location.state || {};

  const [formData, setFormData] = useState({
    name: name || "",
    description: description || "",
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<categoryErrors>({});

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (Object.keys(validationErrors).length > 0) {
      const timer = setTimeout(() => setValidationErrors({}), 2000);
      return () => clearTimeout(timer);
    }
  }, [validationErrors]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage(null);
    setValidationErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateCategory(formData.name, formData.description);
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) return;

    try {
      const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
      const response = await axios.put(
        `${API_URL}/admin/editCategory/${id}`,
        formData,
        { withCredentials: true }
      );
      navigate("/admin/categoryListPage");
    } catch (err: any) {
      console.error("Error updating category:", err);
      setErrorMessage(err.response?.data?.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Back Button */}
      <button
        onClick={() => navigate("/admin/categoryListPage")}
        className="absolute top-4 left-4 flex items-center space-x-2 bg-gray-700 text-white px-4 py-2 rounded-full shadow-md hover:bg-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span>Back</span>
      </button>

      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg transform transition-all duration-300 hover:shadow-2xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Edit Category</h2>

        {errorMessage && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 animate-fade-in">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              required
            />
            {validationErrors.name && (
              <p className="text-red-500 text-xs mt-2 animate-fade-in">
                {validationErrors.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none h-32"
              required
            />
            {validationErrors.description && (
              <p className="text-red-500 text-xs mt-2 animate-fade-in">
                {validationErrors.description}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-lg shadow-md hover:from-purple-600 hover:to-purple-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Update Category
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditCategoryPage;