export interface ForgotPasswordErrors {
  email?: string;
  otp?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export const validateForgotPassword = (
  email: string,
  otp: string = "",
  newPassword: string = "",
  confirmPassword: string = "",
  stage: "email" | "otp" | "password" = "email"
): ForgotPasswordErrors => {
  const errors: ForgotPasswordErrors = {};

  if (stage === "email" || stage === "otp" || stage === "password") {
    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Invalid email format";
    }
  }

  if (stage === "otp" || stage === "password") {
    if (!otp.trim()) {
      errors.otp = "OTP is required";
    } else if (!/^\d{6}$/.test(otp)) {
      errors.otp = "OTP must be a 6-digit number";
    }
  }

  if (stage === "password") {
    if (!newPassword.trim()) {
      errors.newPassword = "New password is required";
    } else if (newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters";
    }

    if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
  }

  return errors;
};
