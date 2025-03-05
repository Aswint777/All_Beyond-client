import React, { useEffect, useState } from "react";
import { Edit, Ban, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSideBar from "../../components/layout/AdminSideBar";

interface Category {
  _id: string;
  name: string;
  description: string;
  type: "Free" | "Premium";
  isBlocked: boolean;
}

const CategoryListPage: React.FC = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
        if (!API_URL) throw new Error("API URL is not defined in environment variables.");
        const response = await axios.get(`${API_URL}/admin/categoryList`, {
          withCredentials: true,
        });
        setCategory(response.data.data);
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching categories.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleBlock = async (id: string, status: boolean) => {
    try {
      const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
      await axios.put(`${API_URL}/admin/blockCategory`, { id, status: !status }, {
        withCredentials: true,
      });
      setCategory(prevCategories =>
        prevCategories.map(category =>
          category._id === id ? { ...category, isBlocked: !status } : category
        )
      );
    } catch (err: any) {
      setError(err.message || "An error occurred while updating category status.");
    }
  };

  const handleEdit = (id: string, name: string, description: string, type: string) => {
    navigate("/admin/editCategory", { state: { id, name, description, type } });
  };

  // Pagination Logic
  const totalPages = Math.ceil(category.length / itemsPerPage);
  const currentData = category.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSideBar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Category List</h2>
          <button
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            onClick={() => navigate("/admin/AddCategoryPage")}
          >
            <Plus size={20} /> Add Category
          </button>
        </div>

        {loading ? (
          <p>Loading categories...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentData.map((category) => (
                <div
                  key={category._id}
                  className={`p-6 rounded-lg shadow-lg flex flex-col justify-between ${
                    category.type === "Premium" ? "bg-purple-500 text-white" : "bg-white text-gray-900"
                  }`}
                >
                  <div>
                    <h3 className="text-xl font-semibold">{category.name}</h3>
                    <span className={`inline-block mt-4 px-3 py-1 text-sm font-medium rounded ${
                        category.type === "Premium"
                          ? "bg-white text-purple-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {category.type}
                    </span>
                    <p className="mt-2">{category.description}</p>
                  </div>

                  <div className="mt-4 flex justify-between">
                    <button
                      onClick={() => handleEdit(category._id, category.name, category.description, category.type)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={18} /> Edit
                    </button>

                    <button
                      onClick={() => handleBlock(category._id, category.isBlocked)}
                      className={`flex items-center gap-1 ${
                        category.isBlocked ? "text-green-600 hover:text-green-800" : "text-red-600 hover:text-red-800"
                      }`}
                    >
                      <Ban size={18} /> {category.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center mt-6 gap-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                <ChevronLeft size={20} />
              </button>

              <span className="text-lg font-semibold">Page {currentPage} of {totalPages}</span>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default CategoryListPage;
