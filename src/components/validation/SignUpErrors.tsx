export interface SignUpErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export const validateSignUp = (
  name: string,
  email: string,
  password: string,
  confirmPassword: string
): SignUpErrors => {
  const errors: SignUpErrors = {};

  if (!name.trim()) {
    errors.name = "Name is required.";
  }
  if (!email) {
    errors.email = "Email is required.";
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = "Invalid email format.";
  }
  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }
  if (!confirmPassword) {
    errors.confirmPassword = "Confirm Password is required.";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
};
