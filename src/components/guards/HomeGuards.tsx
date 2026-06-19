import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from '../../utils/paths';

const HomeGuards = () => {
    const { userDetails } = useSelector((state: RootState) => state.user);

    if (userDetails?.role === "admin") {
      
      return <Navigate to={`${ROUTES.ADMIN}${ROUTES.ADMIN_DASHBOARD}`} replace />;
    }
    return <Outlet />;
}

export default HomeGuards
