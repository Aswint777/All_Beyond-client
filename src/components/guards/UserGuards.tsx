import React from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from '../../utils/paths';

const UserGuards = () => {
    const { userDetails } = useSelector((state: RootState) => state.user);
  
    // Redirect unauthenticated users to the login page
    if (!userDetails) {
      return <Navigate to="/login" replace />;
    }
  
    // Redirect admins to the admin dashboard
    if (userDetails.role === "admin") {
      return <Navigate to={`${ROUTES.ADMIN}${ROUTES.ADMIN_DASHBOARD}`} replace />;
    }
  
    // Allow access to general user routes
    return <Outlet />;
}

export default UserGuards
