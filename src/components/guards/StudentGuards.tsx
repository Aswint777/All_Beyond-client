import React from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { Navigate, Outlet } from 'react-router-dom';

const StudentGuards = () => {
   
        const { userDetails } = useSelector((state: RootState) => state.user);
    
        // Redirect unauthenticated users to the login page
        if (!userDetails) {
          return <Navigate to="/login" replace />;
        }
      
        // Redirect non-admin users to the home page
        if (userDetails.role === "admin") {
          return <Navigate to="/admin/AdminStudentsListPage" replace />;
        }
        if (userDetails.role === "instructor") {
          return <Navigate to="/" replace />;
        }
      
        // Allow access to admin routes
        return <Outlet />;
    }
    
    


export default StudentGuards
