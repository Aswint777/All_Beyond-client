import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BasicNavbar from "../../components/layout/BasicNavbar";
import { ROUTES } from "../../utils/paths";
import { toast } from "react-toastify";
import { config } from "../../configaration/Config";
import { ForgotPasswordErrors, validateForgotPassword } from "../../components/validation/ForgotPasswordValidation";

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<ForgotPasswordErrors>({});
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [mainLoading, setMainLoading] = useState(false);
const [resetLoading, setResetLoading] = useState(false);


  useEffect(() => {
    if (error) {
      toast.error(error);
      setError(null);
    }
    if (successMessage) {
      toast.success(successMessage);
      setSuccessMessage(null);
    }
    if (token) {
      setShowModal(true);
    }
    return () => {
      setError(null);
      setSuccessMessage(null);
    //   setOtpSent(false);
    //   setToken(null);
    //   setShowModal(false);
    };
  }, [error, successMessage, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });

    const stage = name === "email" ? "email" : name === "otp" ? "otp" : "password";
    const validationErrors = validateForgotPassword(
      name === "email" ? value : formValues.email,
      name === "otp" ? value : formValues.otp,
      name === "newPassword" ? value : formValues.newPassword,
      name === "confirmPassword" ? value : formValues.confirmPassword,
      stage
    );
    setErrors(validationErrors);
  };

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateForgotPassword(formValues.email, "", "", "", "email");
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
      console.log('mmmmmmm');
      
      const response = await axios.post(
        `${API_URL}/auth/forgot-password`,
        { email: formValues.email },
        config
      );
      console.log(response);
      
      if (response.data.success) {
        console.log('ll');
        
        setOtpSent(true);
        setSuccessMessage(response.data.message);
      } else {
        setError(response.data.message || "Failed to send OTP");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateForgotPassword(
      formValues.email,
      formValues.otp,
      "",
      "",
      "otp"
    );
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
      console.log('sssssssssssssssssss');
      
      const response = await axios.post(
        `${API_URL}/auth/forgot-verify-otp`,
        { email: formValues.email, otp: formValues.otp },
        config
      );
      console.log(response);
      
      if (response.data.success) {
        setShowModal(true);
        setSuccessMessage(response.data.message);
      } else {
        setError(response.data.message || "Failed to verify OTP");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateForgotPassword(
      formValues.email,
      formValues.otp,
      formValues.newPassword,
      formValues.confirmPassword,
      "password"
    );
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

  setResetLoading(true);

try {
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
    console.log('kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk');

  const response = await axios.post(
    `${API_URL}/auth/reset-password`,
    { email: formValues.email, newPassword: formValues.newPassword },
    config
  );
  console.log(response);
  
  if (response.data.success) {
    setSuccessMessage(response.data.message);
    setShowModal(false);
    navigate(ROUTES.LOGIN);
  } else {
    setError(response.data.message || "Failed to reset password");
  }
} catch (err: any) {
  setError(err.response?.data?.message || "Failed to reset password");
} finally {
  setResetLoading(false);
}
  };

  return (
    <div>
      <BasicNavbar />
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <form
          className="w-full max-w-md bg-white shadow-md rounded-lg p-6"
          onSubmit={otpSent ? handleOTPSubmit : handleEmailSubmit}
        >
          <h2 className="text-2xl font-bold text-center mb-4">
            Forgot Password
          </h2>

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
              disabled={otpSent}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {otpSent && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                OTP
              </label>
              <input
                type="text"
                name="otp"
                value={formValues.otp}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              {errors.otp && (
                <p className="text-red-500 text-xs mt-1">{errors.otp}</p>
              )}
            </div>
          )}

          <button
            type="submit"
            className={`w-full py-2 rounded-lg transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : otpSent
              ? "Verify OTP"
              : "Send OTP"}
          </button>
        </form>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <form
              className="bg-white rounded-lg p-6 w-full max-w-md"
              onSubmit={handlePasswordReset}
            >
              <h2 className="text-xl font-bold text-center mb-4">
                Reset Password
              </h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formValues.newPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                {errors.newPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.newPassword}
                  </p>
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
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setToken(null);
                    setOtpSent(false);
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-lg transition ${
                    resetLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  }`}
                  disabled={resetLoading}
                >
                  {resetLoading  ? "Resetting..." : "Reset Password"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;