import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import SignUpPage from './pages/common/SignUpPage'
import HomePage from './pages/common/HomePage'
import OtpVerifyPage from './pages/common/OtpVerifyPage'
import LoginPage from './pages/common/LoginPage'
import AdminStudentsListPage from './pages/Admin/AdminStudentsListPage'

function App() {

  return (
    <>
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/' Component={HomePage}/>
        <Route path='/login' Component={LoginPage}/>
        <Route path='/SignUP' Component={SignUpPage}/>
        <Route path='/OtpVerify' Component={OtpVerifyPage}/>
        <Route path='/admin/AdminStudentsListPage' Component={AdminStudentsListPage}/>
      </Routes>


      </BrowserRouter>
    </div>

    </>
  )
}

export default App
