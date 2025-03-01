import axios from "axios";
import React from "react";
import { data, NavLink, useNavigate } from "react-router-dom";
import { useModal } from "../context/ModalContext";

const AdminSideBar = () => {
  const navigate = useNavigate();
    const { openModal } = useModal(); // Use global modal
    const test = `Are you sure you want to log out? Any unsaved changes will be lost. You can log in again anytime.`


  

  const handleLogout = async () => {
    // const confirmLogout = window.confirm("Are you sure you want to log out?");
    // if (!confirmLogout) return;

    try {
      const response = await axios.delete(`http://localhost:5000/auth/logOut`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (response.status === 200 || response.status === 204) {
        // ✅ Clear tokens
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("access_token"); // If stored

        // ✅ Force reload & redirect to login
        window.location.href = "/login";
      } else {
        alert("Logout failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Logout error:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  const links = [
    { name: "Overview", path: "/admin/overview" },
    { name: "Courses", path: "/admin/courses" },
    { name: "Students", path: "/admin/AdminStudentsListPage" },
    { name: "Instructors", path: "/admin/AdminInstructorListPage" },
    { name: "Assessments", path: "/admin/assessments" },
    { name: "Categories", path: "/admin/categoryListPage" },
    { name: "Transactions", path: "/admin/transactions" },
    { name: "Banners", path: "/admin/banners" },
    { name: "Complaints", path: "/admin/complaints" },
    { name: "Settings", path: "/admin/settings" },
  ];
  
  return (
    <aside className="w-1/5 bg-purple-100 p-5 min-h-screen">
      <h1 className="text-xl font-bold mb-8 text-purple-700">Admin</h1>
      <nav className="space-y-4">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `block p-3 rounded-lg ${
                isActive
                  ? "bg-purple-500 text-white"
                  : "hover:bg-purple-300 text-purple-700"
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
        <button
          className="block w-full text-left p-3 rounded-lg text-purple-700 hover:bg-purple-300"
          // onClick={handleLogout}
          onClick={() => openModal(handleLogout,test)}

        >
          LogOut
        </button>
      </nav>
    </aside>
  );
};

export default AdminSideBar;
