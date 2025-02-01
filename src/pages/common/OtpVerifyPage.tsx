import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { VerifyOtpAction } from "../../redux/actions/VerifyOtpAction";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { config } from "../../configaration/Config";

const OtpVerifyPage: React.FC = () => {
  const OTP_LENGTH = 6;
  const TIMER_DURATION = 30;

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState<string>("");
  const [timer, setTimer] = useState<number>(TIMER_DURATION);
  const [resendEnabled, setResendEnabled] = useState<boolean>(false);

  const inputRefs = useRef<HTMLInputElement[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { formValues } = useSelector((state: RootState) => state.signUp);
  const {
    loading,
    error: reduxError,
    isOtpVerified,
  } = useSelector((state: RootState) => state.verifyOtp);

  const handleChange = (value: string, index: number) => {
    if (/^\d$/.test(value)) {
      const updatedOtp = [...otp];
      updatedOtp[index] = value;
      setOtp(updatedOtp);
      if (index < OTP_LENGTH - 1 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === "Backspace" && index > 0 && !otp[index]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    const otpString = otp.join("");
    console.log(otpString);

    if (otpString.length !== OTP_LENGTH) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    dispatch(VerifyOtpAction({ email: formValues.email, otp: otpString }));
  };

  // Timer logic
  useEffect(() => {
    let interval: number;
    if (timer > 0) {
      interval = window.setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setResendEnabled(true); // Enable the resend button when timer hits 0
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleResendOtp = async () => {
    try {
      console.log(formValues.email, "email");

      // Clear the OTP inputs, reset the timer, and hide the resend button
      setOtp(Array(OTP_LENGTH).fill(""));
      setTimer(TIMER_DURATION);
      setResendEnabled(false);

      const API_URL = import.meta.env.VITE_REACT_APP_API_URL!;
      const response = await axios.post(
        `${API_URL}/auth/resent`,
        { email: formValues.email },
        config
      );

      console.log("Resend OTP response:", response.data);
    } catch (error) {
      console.error("Failed to resend OTP:", error);
    }
  };

  useEffect(() => {
    if (isOtpVerified) {
      navigate("/login");
    }
  }, [isOtpVerified, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <img
        src="\src\assets\images\Discover-the-Bright-Side-The-Surprising-Benefits-of-Online-Learning.png"
        alt="Local Image"
        className="w-1/2 h-full object-cover"
      />
      <div className="bg-gray-300 p-6 rounded-lg shadow-md max-w-sm w-full">
        <h2 className="text-2xl font-semibold text-center mb-4">
          OTP Verification
        </h2>
        <p className="text-gray-600 text-center mb-4">
          Please verify your email: <strong>{formValues?.email}</strong>
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el!)}
                type="text"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                maxLength={1}
                className="w-12 h-12 text-center text-lg border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              />
            ))}
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {reduxError && <p className="text-red-500 text-sm">{reduxError}</p>}
          {loading ? (
            <p>Loading...</p>
          ) : (
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
            >
              Verify OTP
            </button>
          )}
          {isOtpVerified && (
            <p className="text-green-500 text-sm">OTP Verified Successfully!</p>
          )}
        </form>
        {/* Timer and Resend OTP Button */}
        <div className="mt-4 text-center">
          {resendEnabled ? (
            <button
              onClick={handleResendOtp}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
            >
              Resend OTP
            </button>
          ) : (
            <p className="text-gray-600">
              Resend OTP in <strong>{timer}</strong> seconds
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OtpVerifyPage;
