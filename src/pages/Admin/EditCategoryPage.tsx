import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { config } from '../../configaration/Config';

const EditCategoryPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
      name: "",
      description: "",
      type: "Free",
    });
  
    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = async(e: React.FormEvent) => {
      e.preventDefault();
      console.log(formData);
      const API_URL = import.meta.env.VITE_REACT_APP_API_URL!;
      // const API_URL = "http://localhost:5000";
      console.log(API_URL, "url of the backend");
      const response = await axios.put(
          `${API_URL}/admin/addCategory`,
          formData,
          config
      );
      if(response){
          alert('success')
          navigate("/categories"); // Redirect to category list page
      }
    };
  
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
  
        {/* Back Button (Top-Left) */}
          <button
            type="button"
            onClick={() => navigate("/admin/categoryListPage")}
            className="absolute top-4 left-4 bg-gray-400 text-white px-3 py-1 rounded-md hover:bg-gray-500 transition"
          >
                  {/* <ArrowLeft className="w-5 h-5 mr-2" /> Back */}
            ← Back
          </button>
        <div className="relative bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
  
          <h2 className="text-2xl font-semibold mb-6 text-center">Add Category</h2>
          
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
}

export default EditCategoryPage
