import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { GetUserDetailsAction } from "./GetUserDetailsAction"; // Import it
import { logoutUser } from "../reducer/UserDetailsSlice";

export const UserLoginAction = createAsyncThunk(
  "user/login",
  async (loginData: { email: string; password: string }, { dispatch, rejectWithValue }) => {
    try {
      const API_URL = import.meta.env.VITE_REACT_APP_API_URL!;
      const response = await axios.post(`${API_URL}/auth/login`, loginData, {
        withCredentials: true,
      });

      console.log("User login successful :", response.data);

      // ✅ Fetch user details immediately after login
      dispatch(GetUserDetailsAction());

      return response.data;
    } catch (error: any) {
      console.log("Login error:", error);
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);


export const UserLogOutAction = createAsyncThunk(
    "user/logOut",
     async (_,{ dispatch,rejectWithValue }) => {
      try {
        
        const API_URL = import.meta.env.VITE_REACT_APP_API_URL!;
        const response = await axios.delete(`${API_URL}/auth/logOut`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        console.log('zzzzzzzzzzzz');
  
        console.log("User LogOut successful:", response.data);  
        // await dispatch(GetUserDetailsAction())
        dispatch(logoutUser())
        return response.data;
      } catch (error: any) {
        console.log("LogOut error:", error);
        return rejectWithValue(error.response?.data || "LogOut failed");
      }
    }
  );



  
