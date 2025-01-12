import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../redux/store';
import { RootState } from '@reduxjs/toolkit/query';

const LoginPage :React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
  
    // const { loginValues, loading, error, isLoggedIn } = useSelector(
    //   (state: RootState) => state.signUp // Replace with your actual reducer name if different
    // );
  
    // const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    //   const { name, value } = e.target;
    //   await dispatch(updateLoginField({ field: name, value }));
    // // };
  
    // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //   e.preventDefault();
    //   await dispatch(loginUser(loginValues));
    // };
  
    // React.useEffect(() => {
    //   if (isLoggedIn) {
    //     navigate("/dashboard"); // Replace "/dashboard" with your target route
    //   }
    // }, [isLoggedIn, navigate]);
  
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <img
          src="\src\assets\images\Discover-the-Bright-Side-The-Surprising-Benefits-of-Online-Learning.png"
          alt="Local Image"
          className="w-1/2 h-full object-cover"
        />
        <form
          className="w-full max-w-md bg-white shadow-md rounded-lg p-6"
        //   onSubmit={handleSubmit}
        >
          <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
          {/* {error && ( */}
            {/* // <div className="text-red-500 text-sm mb-4 text-center">{error}</div> */}
        {/* //   )} */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
            //   value={loginValues.email}
            //   onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
            //   value={loginValues.password}
            //   onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
            // disabled={loading}
          >
            Login
            {/* {loading ? "Logging in..." : "Login"} */}
          </button>
        </form>
      </div>
    );
}

export default LoginPage
