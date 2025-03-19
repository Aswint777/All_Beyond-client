import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { UserLogOutAction } from "../../redux/actions/UserLoginAction";
import { useModal } from "../context/ModalContext"; // Import global modal hook
import axios from "axios";
import { config } from "../../configaration/Config";
import { GetUserDetailsAction } from "../../redux/actions/GetUserDetailsAction";


const UserNavbar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { openModal } = useModal(); // Use global modal
  const [isSwitching, setIsSwitching] = useState(false);
  // const [selected, setSelected] = useState(userDetails?.role || "student");
  
  const { userDetails } = useSelector((state: RootState) => state.user);
  
  const [userRole, setUserRole] = useState(userDetails?.role || "student");
  
  console.log(userDetails, "Profile Photo URL");

  const handleLogout = async () => {
    await dispatch(UserLogOutAction()).unwrap();
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("access_token");
    window.location.href = "/login";
    navigate("/login");

  };


  // ✅ Switch between Instructor & Student

  const handleRoleSwitch = async () => {
    try {
      const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
      setIsSwitching(true);
  
      const response = await axios.put(`${API_URL}/auth/switchUserRole`, {}, config);
  
      if (response.status === 200) {
        console.log("✅ Role switched successfully:", response.data.data.role);
  
        // Extract role from API response
        const newRole = response.data.data.role || 
                        (userRole === "instructor" ? "student" : "instructor");
  
        // Update the state so UI re-renders without reloading
        setUserRole(newRole);
      // ✅ Dispatch to Redux Store
      console.log(response.data.data,"//////////////////////////////////");
      
      await dispatch(GetUserDetailsAction());

      } else {
        console.error("❌ Failed to switch roles:", response.data);
      }
    } catch (error) {
      console.error("❌ Error switching roles:", error);
    } finally {
      setIsSwitching(false);
    }
  };
  


  return (
    <nav className="bg-gray-100 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <img src="/src/assets/images/B (4).png" alt="Logo" className="h-8" />
          <span className="text-xl font-bold text-gray-800">All Beyond</span>
        </div>

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
          <li
            onClick={() => navigate("/InstructorApplyPage")}
            className="hover:text-gray-900 cursor-pointer"
          >
            Teach
          </li>
          <li className="hover:text-gray-900 cursor-pointer">About Us</li>
            {/* ✅ Show Switch Button Only for Instructors */}
            {/* {userDetails?.status === "approved" && (
  <li>
    <button
      onClick={handleRoleSwitch}
      className={`px-4 py-1 ml-3 text-white rounded ${
        isSwitching ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
      } transition`}
      disabled={isSwitching}
    >
      {isSwitching 
        ? "Switching..." 
        : `Switch to ${
            userDetails?.role === "instructor" ? "Student" : "Instructor"
          }`}
    </button>
  </li>
)} */}
             {userDetails?.status === "approved" && (

<button
  onClick={handleRoleSwitch}
  className={`px-4 py-1 ml-3 text-white rounded ${
    isSwitching ? "bg-gray-400 cursor-not-allowed" : "bg-gray-500 hover:bg-gray-700"
  } transition`}
  disabled={isSwitching}
>
  {isSwitching 
    ? "Switching..." 
    : `Switch to ${userRole === "instructor" ? "Student" : "Instructor"}`}
</button>
             )}
          
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
            <p className="text-sm font-semibold text-gray-800">
              {userDetails?.username}
            </p>
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
                  onClick={() => openModal(handleLogout)}
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
