import axios from "axios";
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useModal } from "../context/ModalContext";

const AdminSideBar = () => {
  const navigate = useNavigate();
  const { openModal } = useModal();
  const test = `Are you sure you want to log out? Any unsaved changes will be lost. You can log in again anytime.`;
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await axios.delete(`http://localhost:5000/auth/logOut`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (response.status === 200 || response.status === 204) {
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("access_token");
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
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-purple-600 text-white rounded-full shadow-md focus:outline-none"
      >
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
            d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
          />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`bg-purple-900 text-white min-h-screen p-6 fixed top-0 left-0 z-40 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:w-64 w-3/4 md:relative md:shadow-lg`}
      >
        {/* Title */}
        <h1 className="text-2xl font-bold mb-10 text-purple-200 tracking-tight">Admin</h1>

        {/* Navigation */}
        <nav className="space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `block p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-purple-600 text-white shadow-md"
                    : "text-purple-100 hover:bg-purple-700 hover:text-white"
                }`
              }
              onClick={() => setIsOpen(false)} // Close sidebar on mobile after clicking
            >
              {link.name}
            </NavLink>
          ))}
          <button
            className="block w-full text-left p-3 rounded-lg text-sm font-medium text-purple-100 hover:bg-purple-700 hover:text-white transition-all duration-200"
            onClick={() => openModal(handleLogout, test)}
          >
            LogOut
          </button>
        </nav>
      </aside>

      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
        />
      )}
    </>
  );
};

export default AdminSideBar;