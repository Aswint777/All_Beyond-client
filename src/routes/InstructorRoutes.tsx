import React from 'react'
import { Route, Routes } from 'react-router-dom';
import InstructorGuards from '../components/guards/InstructorGuards';
import CourseList from '../pages/Instructor/CourseList';
import AddCourse_Details from '../pages/Instructor/AddCourse_Details';
import AddCourse_Content from '../pages/Instructor/AddCourse_Content';
import AddCourse_Pricing from '../pages/Instructor/AddCourse_Pricing';
import EditCourse from '../pages/Instructor/EditCourse';
import { ROUTES } from '../utils/paths';
import NotFound from '../pages/common/404';
import InstructorDashboard from '../pages/Instructor/InstructorDashboard';
import ListAssessments from '../pages/Instructor/ListAssessments';
import CreateAssessment from '../pages/Instructor/CreateAssessment';
import EditAssessment from '../pages/Instructor/EditAssessment';

const InstructorRoutes = () => {
    return (
        <Routes>
        <Route element={<InstructorGuards />}>
          <Route path={`${ROUTES.INSTRUCTOR_COURSE}`} element={<CourseList />} />
          <Route path={`${ROUTES.ADD_COURSE_DETAILS}`} element={<AddCourse_Details />} />
          <Route path={`${ROUTES.ADD_COURSE_CONTENT}`} element={<AddCourse_Content />} />
          <Route path={`${ROUTES.ADD_COURSE_PRICING}`} element={<AddCourse_Pricing />} />
          <Route path={`${ROUTES.EDIT_COURSE}/:courseId`} element={<EditCourse />} />
          <Route path={`${ROUTES.INSTRUCTOR_DASHBOARD}`} element={<InstructorDashboard/>} />
          <Route path={`${ROUTES.LIST_ASSESSMENT}`} element={<ListAssessments/>} />
          <Route path={`${ROUTES.CREATE_ASSESSMENT}`} element={<CreateAssessment/>} />
          <Route path={`${ROUTES.EDIT_ASSESSMENT}/:id`} element={<EditAssessment/>} />


        </Route>
        {/* <Route path="*" element={<NotFound />} /> */}

        </Routes>
      );
}

export default InstructorRoutes
