import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { UserLogOutAction } from "../../redux/actions/UserLoginAction";
import { useModal } from "../context/ModalContext"; // Import global modal hook

const UserNavbar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { openModal } = useModal(); // Use global modal

  const { userDetails } = useSelector((state: RootState) => state.user);
  console.log(userDetails?.profilePhoto, "Profile Photo URL");

  const handleLogout = async () => {
    await dispatch(UserLogOutAction()).unwrap();
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-100 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <img src="/src/assets/images/B (4).png" alt="Logo" className="h-8" />
          <span className="text-xl font-bold text-gray-800">All Beyond</span>
        </div>

        <ul className="flex space-x-6 text-gray-700">
          <li onClick={() => navigate("/")} className="hover:text-gray-900 cursor-pointer">Home</li>
          <li className="hover:text-gray-900 cursor-pointer">Courses</li>
          <li className="hover:text-gray-900 cursor-pointer">Careers</li>
          <li className="hover:text-gray-900 cursor-pointer">Blog</li>
          <li onClick={() => navigate("/InstructorApplyPage")} className="hover:text-gray-900 cursor-pointer">Teach</li>
          <li className="hover:text-gray-900 cursor-pointer">About Us</li>
        </ul>

        {/* Profile Section */}
        <div className="relative flex items-center space-x-3">
          {/* ✅ Display Cloudinary Profile Image if available, otherwise default */}
          <img
            src={userDetails?.profilePhoto || "https://via.placeholder.com/40"}
            alt="Profile"
            className="w-10 h-10 rounded-full border border-gray-300 object-cover"
          />

          <div>
            <p className="text-sm font-semibold text-gray-800">{userDetails?.username}</p>
            <p className="text-xs text-gray-500">{userDetails?.email}</p>
          </div>

          {/* Dropdown Button */}
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="w-8 h-8 rounded-full bg-purple-500 hover:bg-purple-600 transition"
          >
            <span className="text-white text-sm font-bold">▼</span>
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute top-12 right-0 bg-white shadow-lg rounded-lg w-40 text-sm z-50">
              <ul className="py-2">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => navigate("/profile")}>Profile</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => navigate("/settings")}>Settings</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500" onClick={() => openModal(handleLogout)}>Logout</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default UserNavbar;
