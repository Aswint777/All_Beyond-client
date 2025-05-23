import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { config } from "../../configaration/Config";
import {
  categoryErrors,
  validateCategory,
} from "../../components/validation/CategoryErrors";
import { addCategory } from "../../services/categoryService";

const AddCategoryPage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [errors, setErrors] = useState<categoryErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (apiError) {
      const timer = setTimeout(() => {
        setApiError(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [apiError]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const newErrors = validateCategory(
      name === "name" ? value : formData.name,
      name === "description" ? value : formData.description
    );

    setErrors((prevErrors) => {
      if (!newErrors[name as keyof categoryErrors]) {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors[name as keyof categoryErrors];
        return updatedErrors;
      }
      return { ...prevErrors, ...newErrors };
    });

    setApiError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateCategory(
      formData.name,
      formData.description
    );
    setErrors(validationErrors);

    if (Object.values(validationErrors).some((error) => error)) {
      return;
    }

    try {
      await addCategory(formData);
      setSuccessMessage("Category added successfully! 🎉");
      setApiError(null);

      setTimeout(() => navigate("/admin/categoryListPage"), 2000);
    } catch (error: any) {
      console.error("Error adding category:", error);
      setApiError(
        error.response?.data?.error || "An unexpected error occurred."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <button
        type="button"
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
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Add Category
        </h2>

        {successMessage && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-6 animate-fade-in">
            {successMessage}
          </div>
        )}

        {apiError && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 animate-fade-in">
            {apiError}
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
              placeholder="Enter category name"
              required
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-2 animate-fade-in">
                {errors.name}
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
              placeholder="Enter category description"
              required
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-2 animate-fade-in">
                {errors.description}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-lg shadow-md hover:from-purple-600 hover:to-purple-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Add Category
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryPage;
