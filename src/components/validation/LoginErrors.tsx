export interface LoginErrors {
    email?: string;
    password?: string;
  }
  
  export const validateLogin = (email: string, password: string): LoginErrors => {
    const errors: LoginErrors = {};
  
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
  
    return errors;
  };
  