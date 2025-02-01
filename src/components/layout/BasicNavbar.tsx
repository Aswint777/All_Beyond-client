import React from "react";
import { useNavigate } from "react-router-dom";

const BasicNavbar: React.FC = () => {
  const navigate = useNavigate();
  return (
    <nav className="bg-gray-100 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img
            src="\src\assets\images\B (4).png" // Replace with your logo path
            alt="Logo"
            className="h-8"
          />
          <span className="text-xl font-bold text-gray-800">All Beyond</span>
        </div>

        {/* Links */}
        <ul className="flex space-x-6 text-gray-700">
          <li
            onClick={() => navigate("/")}
            className="hover:text-gray-900 cursor-pointer"
          >
            Home
          </li>
          <li className="hover:text-gray-900 cursor-pointer">Courses</li>
          <li className="hover:text-gray-900 cursor-pointer">Careers</li>
          <li className="hover:text-gray-900 cursor-pointer">Blog</li>
          <li className="hover:text-gray-900 cursor-pointer">About Us</li>
        </ul>

        {/* Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 border rounded-full shadow-md text-gray-800 bg-white hover:bg-gray-200"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/SignUp")}
            className="px-4 py-2 border rounded-full shadow-md bg-gray-800 text-white hover:bg-gray-900"
          >
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
};

export default BasicNavbar;
