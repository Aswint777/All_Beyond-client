import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { UserLogOutAction } from "../../redux/actions/UserLoginAction";
import { useModal } from "../context/ModalContext";
import axios from "axios";
import { config } from "../../configaration/Config";
import { GetUserDetailsAction } from "../../redux/actions/GetUserDetailsAction";
import { ROUTES } from "../../utils/paths";

const UserNavbar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { openModal } = useModal();
  const [isSwitching, setIsSwitching] = useState(false);

  const { userDetails } = useSelector((state: RootState) => state.user);
  const [userRole, setUserRole] = useState(userDetails?.role || "student");

  const handleLogout = async () => {
    await dispatch(UserLogOutAction()).unwrap();
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("access_token");
    window.location.href = "/login";
    navigate("/login");
  };

  const handleRoleSwitch = async () => {
    try {
      const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
      setIsSwitching(true);

      const response = await axios.put(
        `${API_URL}/auth/switchUserRole`,
        {},
        config
      );

      if (response.status === 200) {
        const newRole =
          response.data.data.role ||
          (userRole === "instructor" ? "student" : "instructor");
        setUserRole(newRole);
        await dispatch(GetUserDetailsAction());
      } else {
      }
    } catch (error) {
    } finally {
      setIsSwitching(false);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50 top-0">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <img
            src="/src/assets/images/B (4).png"
            alt="Logo"
            className="h-10 w-auto"
          />
          <span className="text-2xl font-bold text-gray-800 tracking-tight">
            All Beyond
          </span>
        </div>

        <ul className="hidden md:flex items-center space-x-8 text-gray-700 font-medium">
          <li
            onClick={() => navigate(ROUTES.HOME)}
            className="cursor-pointer hover:text-indigo-600 transition-colors duration-200"
          >
            Home
          </li>
          <li
            onClick={() => navigate(`${ROUTES.COURSES}`)}
            className="cursor-pointer hover:text-indigo-600 transition-colors duration-200"
          >
            Courses
          </li>

          <li
            onClick={() =>
              navigate(`${ROUTES.USER}${ROUTES.INSTRUCTOR_APPLY_PAGE}`)
            }
            className="cursor-pointer hover:text-indigo-600 transition-colors duration-200"
          >
            Teach
          </li>
          <li
            className="cursor-pointer hover:text-indigo-600 transition-colors duration-200"
            onClick={() => navigate(`${ROUTES.ABOUT_US}`)}
          >
            About Us
          </li>
          {userDetails?.status === "approved" && (
            <li>
              <button
                onClick={handleRoleSwitch}
                className={`px-4 py-1 text-white rounded-md ${
                  isSwitching
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                } transition duration-200`}
                disabled={isSwitching}
              >
                {isSwitching
                  ? "Switching..."
                  : `Switch to ${
                      userRole === "instructor" ? "Student" : "Instructor"
                    }`}
              </button>
            </li>
          )}
        </ul>

        <div className="hidden md:flex items-center space-x-4 relative">
          <img
            src={userDetails?.profilePhoto || "https://via.placeholder.com/40"}
            alt="Profile"
            className="w-10 h-10 rounded-full border border-gray-300 object-cover"
          />
          <div className="flex flex-col">
            <p className="text-sm font-semibold text-gray-800">
              {userDetails?.username}
            </p>
            <p className="text-xs text-gray-500">{userDetails?.email}</p>
          </div>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition duration-200"
          >
            <span className="text-sm font-bold">▼</span>
          </button>
          {dropdownOpen && (
            <div className="absolute top-12 right-0 bg-white shadow-lg rounded-lg w-48 text-sm z-50">
              <ul className="py-2">
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => navigate(`${ROUTES.USER}${ROUTES.PROFILE}`)}
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
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600"
                  onClick={() => openModal(handleLogout)}
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>

        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMenu}
            className="text-gray-800 focus:outline-none"
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
                d={
                  isMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <ul className="flex flex-col space-y-4 px-4 py-4 text-gray-700 font-medium">
            <li
              onClick={() => {
                navigate("/");
                setIsMenuOpen(false);
              }}
              className="cursor-pointer hover:text-indigo-600 transition-colors duration-200"
            >
              Home
            </li>
            <li
              onClick={() => {
                navigate("/courses");
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
            <li
              onClick={() => {
                navigate("/InstructorApplyPage");
                setIsMenuOpen(false);
              }}
              className="cursor-pointer hover:text-indigo-600 transition-colors duration-200"
            >
              Teach
            </li>
            <li className="cursor-pointer hover:text-indigo-600 transition-colors duration-200">
              About Us
            </li>
            {userDetails?.status === "approved" && (
              <li>
                <button
                  onClick={() => {
                    handleRoleSwitch();
                    setIsMenuOpen(false);
                  }}
                  className={`w-full px-4 py-1 text-white rounded-md ${
                    isSwitching
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  } transition duration-200`}
                  disabled={isSwitching}
                >
                  {isSwitching
                    ? "Switching..."
                    : `Switch to ${
                        userRole === "instructor" ? "Student" : "Instructor"
                      }`}
                </button>
              </li>
            )}
          </ul>
          <div className="flex flex-col items-center space-y-4 px-4 pb-6">
            <div className="flex items-center space-x-3">
              <img
                src={
                  userDetails?.profilePhoto || "https://via.placeholder.com/40"
                }
                alt="Profile"
                className="w-10 h-10 rounded-full border border-gray-300 object-cover"
              />
              <div className="flex flex-col">
                <p className="text-sm font-semibold text-gray-800">
                  {userDetails?.username}
                </p>
                <p className="text-xs text-gray-500">{userDetails?.email}</p>
              </div>
            </div>
            <button
              onClick={() => navigate(`${ROUTES.USER}${ROUTES.PROFILE}`)}
              className="w-full px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition duration-200"
            >
              Profile
            </button>
            <button
              onClick={() => navigate("/settings")}
              className="w-full px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition duration-200"
            >
              Settings
            </button>
            <button
              onClick={() => openModal(handleLogout)}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default UserNavbar;
