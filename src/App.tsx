import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./redux/store";
import { useEffect } from "react";
import { GetUserDetailsAction } from "./redux/actions/GetUserDetailsAction";
import { ModalProvider } from "./components/context/ModalContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CommonRoutes from "./routes/CommonRoutes";
import UserRoutes from "./routes/UserRoutes";
import InstructorRoutes from "./routes/InstructorRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import StudentRoutes from "./routes/StudentRoutes";
import NotFound from "./pages/common/404";


function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { userDetails } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (!userDetails) {
      dispatch(GetUserDetailsAction());
    }
  }, [dispatch, userDetails]);

  return (
    <ModalProvider>
      <BrowserRouter>
        <Routes>
        {/* <Route path={ROUTES.HOME} element={<HomePage />} /> */}
        <Route path="/*" element={<CommonRoutes />} /> 
        <Route path="/user/*" element={<UserRoutes />} />
          <Route path="/instructor/*" element={<InstructorRoutes />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/student/*" element={<StudentRoutes />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ModalProvider>
  );
}

export default App;








// import {
//   BrowserRouter,
//   Route,
//   Routes,
//   useViewTransitionState,
// } from "react-router-dom";
// import "./App.css";
// import SignUpPage from "./pages/common/SignUpPage";
// import HomePage from "./pages/common/HomePage";
// import OtpVerifyPage from "./pages/common/OtpVerifyPage";
// import LoginPage from "./pages/common/LoginPage";
// import AdminStudentsListPage from "./pages/Admin/AdminStudentsListPage";
// import Profile from "./pages/common/Profile";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "./redux/store";
// import { useEffect } from "react";
// import { GetUserDetailsAction } from "./redux/actions/GetUserDetailsAction";
// import InstructorApplyPage from "./pages/common/InstructorApplyPage";
// import InstructorApplicationForm from "./components/Forms/InstructorApplicationForm";
// import AddCategoryPage from "./pages/Admin/AddCategoryPage";
// import EditCategoryPage from "./pages/Admin/EditCategoryPage";
// import CategoryListPage from "./pages/Admin/categoryListPage";
// import AdminINstructorApplicationList from "./pages/Admin/AdminINstructorApplicationList";

// import { ModalProvider } from "./components/context/ModalContext";
// import AdminInstructorLIst from "./pages/Admin/AdminInstructorLIst";
// import { ROUTES } from "./utils/paths";
// import AdminDashboard from "./pages/Admin/AdminDashboard";
// import AddCourse_Details from "./pages/Instructor/AddCourse_Details";
// import AddCourse_Content from "./pages/Instructor/AddCourse_Content";
// import AddCourse_Pricing from "./pages/Instructor/AddCourse_Pricing";
// import CourseList from "./pages/Instructor/CourseList";
// import AdminUserDetails from "./pages/Admin/AdminUserDetails";
// import AllCourses from "./pages/common/AllCourses";
// import CourseDetails from "./pages/common/CourseDetails";
// // import EditCourse from "./pages/Instructor/EditCourse";
// import NotFound from "./pages/common/404";
// import EditCourse from "./pages/Instructor/EditCourse";
// import HomeGuards from "./components/guards/HomeGuards";
// import CommonGuards from "./components/guards/CommonGuards";
// import UserGuards from "./components/guards/UserGuards";
// import AdminGuards from "./components/guards/AdminGuards";
// // import { ROUTES } from "./constant";

// function App() {
//   const dispatch = useDispatch<AppDispatch>();
//   console.log("xxxxxxxxxxxxxx");
//   const { userDetails } = useSelector((state: RootState) => state.user);
//   console.log(userDetails, "userDetails in the app.tsx");

//   useEffect(() => {
//     // ✅ Dispatch getUserDetailsAction ONLY if userDetails is null or undefined
//     const fetchUserDetails = async () => {
//       if (!userDetails) {
//         await dispatch(GetUserDetailsAction());
//       }
//     };
//     console.log(userDetails, "---------------------------------------");

//     fetchUserDetails();
//   }, [dispatch, userDetails]); // ✅ Depend on userDetails, so it only runs when necessary

//   return (
//     <>
//       {/* Other Routes */}
//       <ModalProvider>
//         <div>
//           <BrowserRouter>
//             <Routes>
//               {/* Home page  */}

//               <Route element={<HomeGuards />}>
//                 <Route path={ROUTES.HOME} element={<HomePage />} />
//                 <Route path="/courses" element={<AllCourses/>} />
//                 <Route path="/courseDetails/:courseId" element={<CourseDetails/>} />
//               </Route>

//               {/* Common pages  */}
//               <Route element={<CommonGuards />}>
//                 <Route path={ROUTES.SIGNUP} element={<SignUpPage />} />
//                 <Route path={ROUTES.LOGIN} element={<LoginPage />} />
//                 <Route path={ROUTES.OTP_VERIFY} element={<OtpVerifyPage />} />
//               </Route>

//               {/* user pages  */}

//               <Route element={<UserGuards />}>
//                 <Route path={ROUTES.PROFILE} element={<Profile />} />
//                 <Route
//                   path={ROUTES.INSTRUCTOR_APPLY_PAGE}
//                   element={<InstructorApplyPage />}
//                 />
//                 <Route
//                   path={ROUTES.INSTRUCTOR_APPLICATION_FORM}
//                   element={<InstructorApplicationForm />}
//                 />






//                 {/* Instructor pages  */}

//                 {/* <Route element={<InstructorRoute/>}> */}

//                 <Route path="/instructor/courses" element={<CourseList />} />
//                 <Route
//                   path="/instructor/AddCourse_Details"
//                   element={<AddCourse_Details />}
//                 />
//                 <Route
//                   path="/instructor/AddCourse_Content"
//                   element={<AddCourse_Content />}
//                 />
//                 <Route
//                   path="/instructor/AddCourse_Pricing"
//                   element={<AddCourse_Pricing />}
//                 />
//                 {/* </Route> */}
//               </Route>
//                 <Route path="/instructor/EditCourse/:courseId" element={<EditCourse/>} />




//               {/* Protected Admin Routes */}
//               <Route element={<AdminGuards />}>
//                 <Route
//                   path="/admin/AdminDashboard"
//                   element={<AdminDashboard />}
//                 />
//                 <Route
//                   path={ROUTES.ADMIN_INSTRUCTOR_APPLICATION_LIST}
//                   element={<AdminINstructorApplicationList />}
//                 />
//                 <Route
//                   path={ROUTES.CATEGORY_LIST}
//                   element={<CategoryListPage />}
//                 />
//                 <Route
//                   path={ROUTES.ADD_CATEGORY}
//                   element={<AddCategoryPage />}
//                 />
//                 <Route
//                   path={ROUTES.EDIT_CATEGORY}
//                   element={<EditCategoryPage />}
//                 />
//                 <Route
//                   path={ROUTES.ADMIN_STUDENT_LIST}
//                   element={<AdminStudentsListPage />}
//                 />

//                 <Route
//                   path={ROUTES.ADMIN_INSTRUCTOR_LIST}
//                   element={<AdminInstructorLIst />}
//                 />
//                 <Route
//                   path="/admin/user_details/:userId"
//                   element={<AdminUserDetails />}
//                 />
//               </Route>
//               <Route path="*" element={<NotFound />} />

//             </Routes>
//           </BrowserRouter>
//         </div>
//       </ModalProvider>
//     </>
//   );
// }

// export default App;
