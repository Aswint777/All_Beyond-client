import React from 'react'
import AdminGuards from '../components/guards/AdminGuards';
import { Route, Routes } from 'react-router-dom';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import AdminInstructorApplicationList from '../pages/Admin/AdminINstructorApplicationList';
import CategoryListPage from '../pages/Admin/categoryListPage';
import AddCategoryPage from '../pages/Admin/AddCategoryPage';
import EditCategoryPage from '../pages/Admin/EditCategoryPage';
import AdminStudentsListPage from '../pages/Admin/AdminStudentsListPage';
import AdminInstructorListPage from '../pages/Admin/AdminInstructorLIst';
import AdminUserDetails from '../pages/Admin/AdminUserDetails';
import { ROUTES } from '../utils/paths';
import NotFound from '../pages/common/404';
import TransactionHistory from '../pages/Admin/TransactionHistory';

const AdminRoutes = () => {
    return (
        <Routes>
        <Route element={<AdminGuards />}>
          <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />
          <Route path={ROUTES.ADMIN_INSTRUCTOR_APPLICATION_LIST} element={<AdminInstructorApplicationList />} />
          <Route  path={ROUTES.CATEGORY_LIST} element={<CategoryListPage />} />
          <Route path={ROUTES.ADD_CATEGORY} element={<AddCategoryPage />} />
          <Route path={ROUTES.EDIT_CATEGORY} element={<EditCategoryPage />} />
          <Route path={ROUTES.ADMIN_STUDENT_LIST} element={<AdminStudentsListPage />} />
          <Route path={ROUTES.ADMIN_INSTRUCTOR_LIST} element={<AdminInstructorListPage />} />
          <Route path={`${ROUTES.ADMIN_USER_DETAILS}:userId`} element={<AdminUserDetails />} />
          <Route path={ROUTES.TRANSACTION} element={<TransactionHistory/>} />
        </Route>
        <Route path="*" element={<NotFound />} />

        </Routes>
      );
}

export default AdminRoutes
