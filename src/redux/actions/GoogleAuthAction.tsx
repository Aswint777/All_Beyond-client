import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { CredentialResponse } from "@react-oauth/google";
import { config } from "../../configaration/Config"; // ✅ Ensure correct path
import { GetUserDetailsAction } from "./GetUserDetailsAction";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL; // ✅ Use API URL

// export const googleAuthAction = createAsyncThunk(
//   "user/google-auth",
//   async (
//     { credentials, userType }: { credentials: CredentialResponse; userType: string },
//     { rejectWithValue }
//   ) => {
//     try {
//       console.log("console in the google action ...............................................");
      
//       const payload = { ...credentials, userType };
//       console.log("Credentials received:", credentials);

//       const response = await axios.post(`${API_URL}/auth/google-auth`, payload, config);

//       if (response.data.success) {
//         return response.data;
//       } else {
//         return rejectWithValue(response.data);
//       }
//     } catch (error: unknown) {
//       const e: AxiosError = error as AxiosError;
//       return rejectWithValue(e.response?.data || e.message);
//     }
//   }
// );

export const googleAuthAction = createAsyncThunk(
  "google-auth",
  async (
    { credentials, userType }: { credentials: CredentialResponse; userType: string },
    { dispatch,rejectWithValue }
  ) => {
    try {
      const payload = { ...credentials, userType };
     
      const response = await axios.post(`${API_URL}/auth/google-auth`, payload, config);
      console.log(response,'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
      
      if (response.data.success) {
        // localStorage.setItem("token", response.data); // ✅ Store JWT for authentication
            dispatch(GetUserDetailsAction());
        
        return response.data;
      } else {
        return rejectWithValue(response.data);
      }
    } catch (error: unknown) {
      const e: AxiosError = error as AxiosError;
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);
