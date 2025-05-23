import React, { useEffect, useState } from "react";
import { Edit, Ban, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSideBar from "../../components/layout/AdminSideBar";

interface Category {
  _id: string;
  name: string;
  description: string;
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
      await axios.put(
        `${API_URL}/admin/blockCategory`,
        { id, status: !status },
        { withCredentials: true }
      );
      setCategory((prevCategories) =>
        prevCategories.map((category) =>
          category._id === id ? { ...category, isBlocked: !status } : category
        )
      );
    } catch (err: any) {
      setError(err.message || "An error occurred while updating category status.");
    }
  };

  const handleEdit = (id: string, name: string, description: string) => {
    navigate("/admin/editCategory", { state: { id, name, description } });
  };

  // Pagination Logic
  const totalPages = Math.ceil(category.length / itemsPerPage);
  const currentData = category.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex">
      <AdminSideBar />
      <main className="flex-1 p-6 lg:p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Category List</h2>
          <button
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={() => navigate("/admin/AddCategoryPage")}
          >
            <Plus size={20} /> Add Category
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500 text-lg">Loading categories...</p>
        ) : error ? (
          <p className="text-center text-red-500 text-lg">{error}</p>
        ) : currentData.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">No categories found.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentData.map((category) => (
                <div
                  key={category._id}
                  className={`p-6 rounded-xl shadow-lg bg-white transform transition-all duration-200 hover:shadow-xl flex flex-col justify-between ${
                    category.isBlocked ? "border-l-4 border-green-500" : "border-l-4 border-red-500"
                  }`}
                >
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {category.description}
                    </p>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <button
                      onClick={() =>
                        handleEdit(category._id, category.name, category.description)
                      }
                      className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-all duration-200"
                    >
                      <Edit size={18} /> Edit
                    </button>
                    <button
                      onClick={() => handleBlock(category._id, category.isBlocked)}
                      className={`flex items-center gap-1 px-3 py-1 rounded-md transition-all duration-200 ${
                        category.isBlocked
                        ? "bg-red-100 text-red-700 hover:bg-red-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                    >
                      <Ban size={18} /> {category.isBlocked ? "Block" : "Unblock"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center items-center mt-8 gap-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-lg font-semibold text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
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