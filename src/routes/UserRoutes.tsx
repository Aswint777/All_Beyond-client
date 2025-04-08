import React from 'react'
import { Route, Routes } from 'react-router-dom';
import UserGuards from '../components/guards/UserGuards';
import Profile from '../pages/common/Profile';
import InstructorApplyPage from '../pages/common/InstructorApplyPage';
import InstructorApplicationForm from '../components/Forms/InstructorApplicationForm';
import { ROUTES } from '../utils/paths';
import NotFound from '../pages/common/404';

const UserRoutes = () => {
    return (
        <Routes>
        <Route element={<UserGuards />}>
          <Route path={ROUTES.PROFILE} element={<Profile />} />
          <Route path={ROUTES.INSTRUCTOR_APPLY_PAGE} element={<InstructorApplyPage />} />
          <Route path={ROUTES.INSTRUCTOR_APPLICATION_FORM} element={<InstructorApplicationForm />} />
        </Route>
        <Route path="*" element={<NotFound />} />

        </Routes>
      );
}

export default UserRoutes
