import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import SignUpPage from "./pages/common/SignUpPage";
import HomePage from "./pages/common/HomePage";
import OtpVerifyPage from "./pages/common/OtpVerifyPage";
import LoginPage from "./pages/common/LoginPage";
import AdminStudentsListPage from "./pages/Admin/AdminStudentsListPage";
import Profile from "./pages/common/Profile";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./redux/store";
import { useEffect } from "react";
import { GetUserDetailsAction } from "./redux/actions/GetUserDetailsAction";
import InstructorApplyPage from "./pages/common/InstructorApplyPage";
import InstructorApplicationForm from "./components/Forms/InstructorApplicationForm";
import AddCategoryPage from "./pages/Admin/AddCategoryPage";
import EditCategoryPage from "./pages/Admin/EditCategoryPage";
import AdminRoute from "./components/route/AdminRoute";
import CategoryListPage from "./pages/Admin/categoryListPage";
import AdminINstructorApplicationList from "./pages/Admin/AdminINstructorApplicationList";
import UserRoute from "./components/route/UserRoute";
import CommonRout from "./components/route/CommonRout";
import HomeRout from "./components/route/HomeRout";
import { ModalProvider } from "./components/context/ModalContext";
import AdminInstructorLIst from "./pages/Admin/AdminInstructorLIst";
import { ROUTES } from "./utils/paths";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AddCourse_Details from "./pages/Instructor/AddCourse_Details";
import AddCourse_Content from "./pages/Instructor/AddCourse_Content";
import AddCourse_Pricing from "./pages/Instructor/AddCourse_Pricing";
// import { ROUTES } from "./constant";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  console.log("xxxxxxxxxxxxxx");
  const { userDetails } = useSelector(
    (state: RootState) => state.user
  );
  console.log(userDetails, "userDetails in the app.tsx");

  useEffect(() => {
    // ✅ Dispatch getUserDetailsAction ONLY if userDetails is null or undefined
    const fetchUserDetails = async () => {
      if (!userDetails) {
        await dispatch(GetUserDetailsAction());
      }
    };
  
    fetchUserDetails();
  }, [dispatch, userDetails]); // ✅ Depend on userDetails, so it only runs when necessary

  return (
    <>
      {/* {loading ? <p>Loading user details...</p> : <p>Welcome, {userDetails?.email}</p>} */}
      {/* Other Routes */}
      <ModalProvider>
        <div>
          <BrowserRouter>
            <Routes>
              
              <Route path="/instructor/AddCourse_Details" element={<AddCourse_Details/>} />
              <Route path="/instructor/AddCourse_Content" element={<AddCourse_Content/>} />
              <Route path="/instructor/AddCourse_Pricing" element={<AddCourse_Pricing/>} />

              
              
              <Route element={<HomeRout />}>
                <Route path={ROUTES.HOME} element={<HomePage />} />
              </Route>
              <Route element={<CommonRout />}>
                <Route path={ROUTES.SIGNUP} element={<SignUpPage />} />
                <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                <Route path={ROUTES.OTP_VERIFY} element={<OtpVerifyPage />} />
              </Route>
              <Route element={<UserRoute />}>
                <Route path={ROUTES.PROFILE} element={<Profile />} />
                <Route
                  path={ROUTES.INSTRUCTOR_APPLY_PAGE}
                  element={<InstructorApplyPage />}
                />
                <Route
                  path={ROUTES.INSTRUCTOR_APPLICATION_FORM}
                  element={<InstructorApplicationForm />}
                />
              </Route>
              {/* Protected Admin Routes */}
              <Route element={<AdminRoute />}>
              <Route
                  path="/admin/AdminDashboard"
                  element={<AdminDashboard />}
                />
                <Route
                  path={ROUTES.ADMIN_INSTRUCTOR_APPLICATION_LIST}
                  element={<AdminINstructorApplicationList />}
                />
                <Route
                  path={ROUTES.CATEGORY_LIST}
                  element={<CategoryListPage />}
                />
                <Route
                  path={ROUTES.ADD_CATEGORY}
                  element={<AddCategoryPage />}
                />
                <Route
                  path={ROUTES.EDIT_CATEGORY}
                  element={<EditCategoryPage />}
                />
                <Route
                  path={ROUTES.ADMIN_STUDENT_LIST}
                  element={<AdminStudentsListPage />}
                />

                 <Route
                  path={ROUTES.ADMIN_INSTRUCTOR_LIST}
                  element={<AdminInstructorLIst />}
                />
              </Route>
            </Routes>
          </BrowserRouter>
        </div>
      </ModalProvider>
    </>
  );
}

export default App;
