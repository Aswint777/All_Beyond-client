import React, { useRef, useState } from 'react'

const OtpVerifyPage:React.FC = () => {
    const OTP_LENGTH = 6;
    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const [error, setError] = useState<string>("");
    const inputRefs = useRef<HTMLInputElement[]>([]);
  
    const handleChange = (value: string, index: number) => {
      if (/^\d$/.test(value)) {
        const updatedOtp = [...otp];
        updatedOtp[index] = value;
        setOtp(updatedOtp);
  
        // Move to the next input
        if (index < OTP_LENGTH - 1 && inputRefs.current[index + 1]) {
          inputRefs.current[index + 1].focus();
        }
      }
    };
  
    const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
      if (event.key === "Backspace" && index > 0 && !otp[index]) {
        // Move to the previous input
        inputRefs.current[index - 1].focus();
      }
    };
  
    const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault();
      setError("");
  
      const otpString = otp.join("");
      if (otpString.length !== OTP_LENGTH) {
        setError("Please enter a valid 6-digit OTP.");
        return;
      }
  
      alert(`OTP Submitted: ${otpString}`);
      setOtp(Array(OTP_LENGTH).fill("")); // Clear OTP fields after submission
    };
  
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">

            <img src="\src\assets\images\Discover-the-Bright-Side-The-Surprising-Benefits-of-Online-Learning.png" alt="Local Image" className="w-1/2 h-full object-cover"/>

        <div className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full">
          <h2 className="text-2xl font-semibold text-center mb-4">OTP Verification</h2>
          <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
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
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
            >
              Verify OTP
            </button>
          </form>
        </div>
      </div>
    );
}

export default OtpVerifyPage
