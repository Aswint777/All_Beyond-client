import React from "react";
import { Route, Routes } from "react-router-dom";
import HomeGuards from "../components/guards/HomeGuards";
import HomePage from "../pages/common/HomePage";
import AllCourses from "../pages/common/AllCourses";
import CourseDetails from "../pages/common/CourseDetails";
import CommonGuards from "../components/guards/CommonGuards";
import SignUpPage from "../pages/common/SignUpPage";
import LoginPage from "../pages/common/LoginPage";
import OtpVerifyPage from "../pages/common/OtpVerifyPage";
import { ROUTES } from "../utils/paths";
import NotFound from "../pages/common/404";

const CommonRoutes = () => {
  return (
    <>
      <Routes>
        {/* Home routes */}
        <Route element={<HomeGuards />}>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.COURSES} element={<AllCourses />} />
          <Route path={ROUTES.COURSE_DETAILS} element={<CourseDetails />} />
        </Route>

        {/* Authentication routes */}
        <Route element={<CommonGuards />}>
          <Route path={ROUTES.SIGNUP} element={<SignUpPage />} />
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.OTP_VERIFY} element={<OtpVerifyPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default CommonRoutes;
