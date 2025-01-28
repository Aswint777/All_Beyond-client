import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const UserNavbar: React.FC = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const jwtToken = localStorage.getItem("access_token");


  const toggleDropdown = () => {
    console.log("Toggling dropdown"); // Debug log
    setDropdownOpen((prev) => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      console.log("Outside click detected"); // Debug log
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        console.log("Closing dropdown"); // Debug log
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);


  const handleLogout = async () => {
    console.log('jjj');
    
    const accessToken = localStorage.getItem("access_token");
    // if (!accessToken) {
    //   console.error("Access token not found");
    //   return;
    // }

    try {
      await axios.delete(
        `http://localhost:5000/auth/logOut`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true, 
        }
      );


      // console.log("Logout successful:", response.data);

      // Clear local storage or token
      localStorage.removeItem("jwtToken");

      // Redirect to login
      navigate("/login");
    } catch (error: any) {
      console.error("Logout error:", error);
      alert("Failed to log out. Please try again.");
    }
  }
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

        {/* Profile Section */}
        <div className="relative flex items-center space-x-3" ref={dropdownRef}>
          <img
            src="https://via.placeholder.com/40" // Replace with user profile image URL
            alt="Profile"
            className="w-8 h-8 rounded-full"
          />
          <div>
            <p className="text-sm font-semibold text-gray-800">Aswin</p>
            <p className="text-xs text-gray-500">Aswin@gmail.com</p>
          </div>

          {/* Dropdown Button */}
          <button
            onClick={toggleDropdown}
            className="w-8 h-8 rounded-full bg-purple-500 hover:bg-purple-600 transition focus:outline-none"
          >
            <span className="text-white text-sm font-bold">▼</span>
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute top-10 right-0 bg-white shadow-lg rounded-lg w-40 text-sm z-50">
              <ul className="py-2">
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => navigate("/profile")}
                >
                  Profile
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => navigate("/settings")}
                >
                  Settings
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500"
                  onClick={handleLogout}
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default UserNavbar;
