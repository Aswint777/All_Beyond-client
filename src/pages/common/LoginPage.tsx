import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../redux/store";
import { UserLoginAction } from "../../redux/actions/UserLoginAction";
import BasicNavbar from "../../components/layout/BasicNavbar";
import { LoginErrors, validateLogin } from "../../components/validation/LoginErrors";
// import { validateLogin, LoginErrors } from "../../utils/validateLogin"; // Import validation function

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { loading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.login
  );

  const { userDetails } = useSelector((state: RootState) => state.user);

  const [loginValues, setLoginValues] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<LoginErrors>({}); // Store validation errors

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginValues({ ...loginValues, [name]: value });

    // Validate in real-time
    const validationErrors = validateLogin(
      name === "email" ? value : loginValues.email,
      name === "password" ? value : loginValues.password
    );
    setErrors(validationErrors);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateLogin(loginValues.email, loginValues.password);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    dispatch(UserLoginAction(loginValues));
  };

  useEffect(() => {
    if (isAuthenticated) {
      if (userDetails?.role === "admin") {
        navigate("/admin/AdminStudentsListPage");
      } else {
        navigate("/");
      }
    }
  }, [isAuthenticated, userDetails, navigate]);

  return (
    <div>
      <BasicNavbar />
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <img
          src="/src/assets/images/Discover-the-Bright-Side-The-Surprising-Benefits-of-Online-Learning.png"
          alt="Local Image"
          className="w-1/2 h-full object-cover"
        />
        <form
          className="w-full max-w-md bg-white shadow-md rounded-lg p-6"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

          {error && (
            <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
          )}  

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={loginValues.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={loginValues.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className={`w-full py-2 rounded-lg transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
