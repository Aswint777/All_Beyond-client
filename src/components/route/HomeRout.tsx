import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Navigate, Outlet } from "react-router-dom";

const HomeRout = () => {
  const { userDetails } = useSelector((state: RootState) => state.user);

  if (userDetails?.role === "admin") {
    
    return <Navigate to="/admin/AdminStudentsListPage" replace />;
  }
  return <Outlet />;
};

export default HomeRout;
