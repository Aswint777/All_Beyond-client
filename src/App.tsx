import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import SignUpPage from './pages/common/SignUpPage'
import HomePage from './pages/common/HomePage'
import OtpVerifyPage from './pages/common/OtpVerifyPage'
import LoginPage from './pages/common/LoginPage'
import AdminStudentsListPage from './pages/Admin/AdminStudentsListPage'
import Profile from './pages/common/Profile'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from './redux/store'
import { useEffect } from 'react'
import { getUserDetailsAction } from './redux/actions/getUserDetailsAction'

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { userDetails, loading } = useSelector((state: RootState) => state.user);
  console.log(userDetails,'userDetails in the app.tsx');
  

  useEffect(() => {
    // ✅ Dispatch getUserDetailsAction ONLY if userDetails is null or undefined
    if (!userDetails) {
      dispatch(getUserDetailsAction());
    }
  }, [dispatch, userDetails]); // ✅ Depend on userDetails, so it only runs when necessary

  return (
    <>
     {loading ? <p>Loading user details...</p> : <p>Welcome, {userDetails?.email}</p>}
     {/* Other Routes */}
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/' Component={HomePage}/>
        <Route path='/login' Component={LoginPage}/>
        <Route path='/SignUP' Component={SignUpPage}/>
        <Route path='/OtpVerify' Component={OtpVerifyPage}/>
        <Route path='/admin/AdminStudentsListPage' Component={AdminStudentsListPage}/>
        <Route path='/Profile' Component={Profile}/>
      </Routes>


      </BrowserRouter>
    </div>

    </>
  )
}

export default App
