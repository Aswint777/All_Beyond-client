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

function App() {
  const dispatch = useDispatch<AppDispatch>();
  console.log("xxxxxxxxxxxxxx");
  const { userDetails, loading } = useSelector(
    (state: RootState) => state.user
  );
  console.log(userDetails, "userDetails in the app.tsx");

  useEffect(() => {
    // ✅ Dispatch getUserDetailsAction ONLY if userDetails is null or undefined
    if (!userDetails) {
      dispatch(GetUserDetailsAction());
    }
  }, [dispatch, userDetails]); // ✅ Depend on userDetails, so it only runs when necessary

  return (
    <>
      {/* {loading ? <p>Loading user details...</p> : <p>Welcome, {userDetails?.email}</p>} */}
      {/* Other Routes */}
      <ModalProvider>
        <div>
          <BrowserRouter>
            <Routes>
              \
              <Route element={<HomeRout />}>
                <Route path="/" element={<HomePage />} />
              </Route>
              <Route element={<CommonRout />}>
                <Route path="/SignUP" element={<SignUpPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/OtpVerify" element={<OtpVerifyPage />} />
              </Route>
              <Route element={<UserRoute />}>
                <Route path="/Profile" element={<Profile />} />
                <Route
                  path="/InstructorApplyPage"
                  element={<InstructorApplyPage />}
                />
                <Route
                  path="/InstructorApplicationForm"
                  element={<InstructorApplicationForm />}
                />
              </Route>
              {/* Protected Admin Routes */}
              <Route element={<AdminRoute />}>
                <Route
                  path="/admin/AdminInstructorApplicationList"
                  element={<AdminINstructorApplicationList />}
                />
                <Route
                  path="/admin/categoryListPage"
                  element={<CategoryListPage />}
                />
                <Route
                  path="/admin/AddCategoryPage"
                  element={<AddCategoryPage />}
                />
                <Route
                  path="/admin/EditCategory"
                  element={<EditCategoryPage />}
                />
                <Route
                  path="/admin/AdminStudentsListPage"
                  element={<AdminStudentsListPage />}
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
