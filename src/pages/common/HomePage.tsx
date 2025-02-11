import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import UserNavbar from "../../components/layout/UserNavbar";
import BasicNavbar from "../../components/layout/BasicNavbar";
import axios from "axios";
// import { setUserDetails } from "../../redux/slices/userSlice"; // Import Redux action

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userDetails } = useSelector((state: RootState) => state.user);
  const [navbarKey, setNavbarKey] = useState(0)

  useEffect(() => {
    if (userDetails) {
      setNavbarKey(prevKey => prevKey + 1) 
    }
  }, [userDetails])
  const fetchUserDetails = async () => {
    try {
      const API_URL = import.meta.env.VITE_REACT_APP_API_URL!;
      const response = await axios.get(`${API_URL}/auth/userDetails`, {
        withCredentials: true, // Ensure cookies are sent
      });

      // if (response.status === 200) {
      //   dispatch(setUserDetails(response.data.user)); // Store user in Redux
      // }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  // Fetch user details on page load
  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <div>
      {/* Check userDetails and render appropriate Navbar */}
      {userDetails ? <UserNavbar /> : <BasicNavbar />}

      {/* Page Content */}
      <div className="relative w-full h-screen">
        <img
          src="\src\assets\images\shutterstock_1029674362-860x574.png"
          alt="Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center lg:justify-start px-4 lg:px-12 bg-black bg-opacity-30">
          <div className="text-center lg:text-left max-w-lg space-y-6 text-white">
            <h1 className="text-4xl font-bold leading-tight">
              <span className="text-green-500">Knowledge</span> at your fingertips
            </h1>
            <p className="text-gray-200">
              Unlock your potential with top-notch resources and expert guidance to elevate your learning experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
