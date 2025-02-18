import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { config } from "../../configaration/Config";
import { categoryErrors, validateCategory } from "../../components/validation/CategoryErrors";

const AddCategoryPage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "Free",
  });

  const [errors, setErrors] = useState<categoryErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null); // ✅ Added API error state

  useEffect(() => {
    if (apiError) {
      const timer = setTimeout(() => {
        setApiError(null);
      }, 3000); // 30s delay

      return () => clearTimeout(timer); // Cleanup timeout
    }
  }, [apiError]);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  
    // Validate only the changed field
    const newErrors = validateCategory(
      name === "name" ? value : formData.name,
      name === "description" ? value : formData.description,
      name === "type" ? value : formData.type
    );
  
    setErrors((prevErrors) => {
      if (!newErrors[name as keyof categoryErrors]) {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors[name as keyof categoryErrors];
        return updatedErrors;
      }
      return { ...prevErrors, ...newErrors };
    });

    setApiError(null); // ✅ Clear API errors when user starts typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateCategory(formData.name, formData.description, formData.type);
    setErrors(validationErrors);

    if (Object.values(validationErrors).some((error) => error)) {
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_REACT_APP_API_URL!;
      console.log(API_URL, "Backend URL");

      const response = await axios.post(
        `${API_URL}/admin/addCategory`,
        formData,
        config
      );

      if (response.status === 201) {
        setSuccessMessage("Category added successfully! 🎉");
        setApiError(null); // ✅ Clear API errors if successful

        setTimeout(() => navigate("/admin/categoryListPage"), 2000);
      }
    } catch (error: any) {
      console.error("Error adding category:", error);
      
      // ✅ Set API error message
      setApiError(error.response?.data?.error || "An unexpected error occurred.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <button
        type="button"
        onClick={() => navigate("/admin/categoryListPage")}
        className="absolute top-4 left-4 bg-gray-400 text-white px-3 py-1 rounded-md hover:bg-gray-500 transition"
      >
        ← Back
      </button>

      <div className="relative bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h2 className="text-2xl font-semibold mb-6 text-center">Add Category</h2>

        {/* ✅ Success Message */}
        {successMessage && (
          <p className="text-green-600 text-center mb-4">{successMessage}</p>
        )}

        {/* ✅ API Error Message */}
        {apiError && (
          <p className="text-red-500 text-center mb-4">{apiError}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              placeholder="Enter category name"
              required
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="border p-2 rounded w-full h-24"
              placeholder="Enter category description"
              required
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          {/* Type (Free/Premium) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            >
              <option value="Free">Free</option>
              <option value="Premium">Premium</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-purple-500 text-white px-4 py-2 rounded-lg w-full hover:bg-purple-600 transition"
          >
            Add Category
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryPage;
