import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Navigate, Outlet } from "react-router-dom";

const UserRoute = () => {  
  const { userDetails } = useSelector((state: RootState) => state.user);
   
  // Redirect unauthenticated users to the login page
  if (!userDetails) {
    return <Navigate to="/login" replace />;
  }

  // Redirect admins to the admin dashboard
  if (userDetails.role === "admin") {
    return <Navigate to="/admin/AdminStudentsListPage" replace />;
  }

  // Allow access to general user routes
  return <Outlet />;
};

export default UserRoute;
