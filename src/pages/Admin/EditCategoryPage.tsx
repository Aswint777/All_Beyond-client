import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const EditCategoryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id, name, description, type } = location.state || {}; // Get passed data

  const [formData, setFormData] = useState({
    name: name || "",
    description: description || "",
    type: type || "Free",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
      console.log("id:",id,"formdata:",formData);
      
      await axios.put(`${API_URL}/admin/editCategory/${id}`, formData);
      navigate("/admin/categoryListPage");
    } catch (err: any) {
      console.error("Error updating category:", err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <button onClick={() => navigate("/admin/categoryListPage")} className="absolute top-4 left-4 bg-gray-400 text-white px-3 py-1 rounded-md hover:bg-gray-500 transition">
        ← Back
      </button>

      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h2 className="text-2xl font-semibold mb-6 text-center">Edit Category</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="border p-2 rounded w-full" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="border p-2 rounded w-full h-24" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select name="type" value={formData.type} onChange={handleChange} className="border p-2 rounded w-full" required>
              <option value="Free">Free</option>
              <option value="Premium">Premium</option>
            </select>
          </div>

          <button type="submit" className="bg-purple-500 text-white px-4 py-2 rounded-lg w-full hover:bg-purple-600 transition">
            Update Category
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditCategoryPage;
