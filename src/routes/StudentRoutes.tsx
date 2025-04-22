import React from 'react'
import { Route, Routes } from 'react-router-dom';
import NotFound from '../pages/common/404';
import StudentGuards from '../components/guards/StudentGuards';
import StudentCourses from '../pages/Student/StudentCourses';
import { ROUTES } from '../utils/paths';
import WatchCourses from '../pages/Student/WatchCourses';
import PaymentSuccess from '../pages/Student/PaymentSuccess';

const StudentRoutes = () => {
  return (
    <Routes>
    <Route element={<StudentGuards/>}>
      <Route path= {ROUTES.STUDENT_COURSES} element={<StudentCourses />} />
      <Route path={`${ROUTES.WATCH_COURSES}/:courseId`} element={<WatchCourses/>} />
      <Route path= {ROUTES.PAYMENT_SUCCESS} element={<PaymentSuccess />} />

    </Route>
    <Route path="*" element={<NotFound />} />

    </Routes>
  );
}


export default StudentRoutes
