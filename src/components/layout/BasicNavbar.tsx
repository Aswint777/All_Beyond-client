import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../utils/paths";

const BasicNavbar: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50 top-0">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img
            src="\src\assets\images\B (4).png" // Replace with your logo path
            alt="Logo"
            className="h-10 w-auto"
          />
          <span className="text-2xl font-bold text-gray-800 tracking-tight">All Beyond</span>
        </div>

        {/* Desktop Links */}
        <ul className="hidden md:flex space-x-8 text-gray-700 font-medium">
          <li
            onClick={() => navigate(ROUTES.HOME)}
            className="cursor-pointer hover:text-indigo-600 transition-colors duration-200"
          >
            Home
          </li>
          <li
            onClick={() => navigate(ROUTES.COURSES)}
            className="cursor-pointer hover:text-indigo-600 transition-colors duration-200"
          >
            Courses
          </li>
          <li className="cursor-pointer hover:text-indigo-600 transition-colors duration-200">
            Careers
          </li>
          <li className="cursor-pointer hover:text-indigo-600 transition-colors duration-200">
            Blog
          </li>
          <li className="cursor-pointer hover:text-indigo-600 transition-colors duration-200">
            About Us
          </li>
        </ul>

        {/* Desktop Buttons */}
        <div className="hidden md:flex space-x-4">
          <button
            onClick={() => navigate(ROUTES.LOGIN)}
            className="px-5 py-2 border border-gray-300 rounded-full text-gray-800 bg-white hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 shadow-sm"
          >
            Login
          </button>
          <button
            onClick={() => navigate(ROUTES.SIGNUP)}
            className="px-5 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all duration-200 shadow-md"
          >
            Sign Up
          </button>
        </div>

        {/* Hamburger Menu (Mobile) */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} className="text-gray-800 focus:outline-none">
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
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <ul className="flex flex-col space-y-4 px-4 py-4 text-gray-700 font-medium">
            <li
              onClick={() => {
                navigate(ROUTES.HOME);
                setIsMenuOpen(false);
              }}
              className="cursor-pointer hover:text-indigo-600 transition-colors duration-200"
            >
              Home
            </li>
            <li
              onClick={() => {
                navigate(ROUTES.COURSES);
                setIsMenuOpen(false);
              }}
              className="cursor-pointer hover:text-indigo-600 transition-colors duration-200"
            >
              Courses
            </li>
            <li className="cursor-pointer hover:text-indigo-600 transition-colors duration-200">
              Careers
            </li>
            <li className="cursor-pointer hover:text-indigo-600 transition-colors duration-200">
              Blog
            </li>
            <li className="cursor-pointer hover:text-indigo-600 transition-colors duration-200">
              About Us
            </li>
          </ul>
          <div className="flex flex-col space-y-4 px-4 pb-6">
            <button
              onClick={() => {
                navigate(ROUTES.LOGIN);
                setIsMenuOpen(false);
              }}
              className="px-5 py-2 border border-gray-300 rounded-full text-gray-800 bg-white hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 shadow-sm"
            >
              Login
            </button>
            <button
              onClick={() => {
                navigate(ROUTES.SIGNUP);
                setIsMenuOpen(false);
              }}
              className="px-5 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all duration-200 shadow-md"
            >
              Sign Up
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default BasicNavbar;