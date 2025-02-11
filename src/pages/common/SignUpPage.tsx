import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { sendSignUpData, updateField } from "../../redux/reducer/UserSlice";
import { useNavigate } from "react-router-dom";
import BasicNavbar from "../../components/layout/BasicNavbar";
import { SignUpErrors, validateSignUp } from "../../components/validation/SignUpErrors";
// import { validateSignUp, SignUpErrors } from "../../utils/validateSignUp"; // Import validation

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { formValues, loading, error, requiresOTP } = useSelector(
    (state: RootState) => state.signUp
  );

  const [errors, setErrors] = useState<SignUpErrors>({});

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    await dispatch(updateField({ field: name, value }));

    // Validate field in real-time
    const validationErrors = validateSignUp(
      name === "name" ? value : formValues.name,
      name === "email" ? value : formValues.email,
      name === "password" ? value : formValues.password,
      name === "confirmPassword" ? value : formValues.confirmPassword
    );
    setErrors(validationErrors);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateSignUp(
      formValues.name,
      formValues.email,
      formValues.password,
      formValues.confirmPassword
    );

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    await dispatch(sendSignUpData(formValues));
  };

  React.useEffect(() => {
    if (requiresOTP) {
      navigate("/OtpVerify");
    }
  }, [requiresOTP, navigate]);

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
          <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
          {error && (
            <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formValues.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formValues.email}
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
              value={formValues.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formValues.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
