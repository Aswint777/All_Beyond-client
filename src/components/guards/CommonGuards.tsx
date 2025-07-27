import React from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from '../../utils/paths';

const CommonGuards = () => {
  console.log('CommonGuardssssssssssssssssss');
  
    const { userDetails } = useSelector((state: RootState) => state.user);
    if (userDetails?.role === "admin") {
      return <Navigate to={`${ROUTES.ADMIN}${ROUTES.ADMIN_DASHBOARD}`} replace />;
    }
    if (userDetails) {
      console.log('home / working heree e ee');
      
      return <Navigate to="/" replace />;
    }
  
    return <Outlet />;
}

export default CommonGuards
