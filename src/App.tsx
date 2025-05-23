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



