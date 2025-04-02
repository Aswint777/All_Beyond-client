import React from 'react'
import { Route, Routes } from 'react-router-dom';
import InstructorGuards from '../components/guards/InstructorGuards';
import CourseList from '../pages/Instructor/CourseList';
import AddCourse_Details from '../pages/Instructor/AddCourse_Details';
import AddCourse_Content from '../pages/Instructor/AddCourse_Content';
import AddCourse_Pricing from '../pages/Instructor/AddCourse_Pricing';
import EditCourse from '../pages/Instructor/EditCourse';
import { ROUTES } from '../utils/paths';

const InstructorRoutes = () => {
    return (
        <Routes>
        <Route element={<InstructorGuards />}>
          <Route path={`${ROUTES.INSTRUCTOR_COURSE}`} element={<CourseList />} />
          <Route path={`${ROUTES.ADD_COURSE_DETAILS}`} element={<AddCourse_Details />} />
          <Route path={`${ROUTES.ADD_COURSE_CONTENT}`} element={<AddCourse_Content />} />
          <Route path={`${ROUTES.ADD_COURSE_PRICING}`} element={<AddCourse_Pricing />} />
          <Route path={`${ROUTES.EDIT_COURSE}/:courseId`} element={<EditCourse />} />
        </Route>
        </Routes>
      );
}

export default InstructorRoutes
