import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios";
import { config } from "../../configaration/Config";

interface OTPPayload {
    email: string;
    otp: string;
  }

export const VerifyOtpAction = createAsyncThunk(
    "auth/verifyOtp",
    async ({ email, otp }: OTPPayload, { rejectWithValue }) => {
        try {
            console.log('otp in action');
            const API_URL = import.meta.env.VITE_REACT_APP_API_URL!;

            const response = await axios.post(`${API_URL}/auth/OtpVerify`, { email, otp }, config);
            return response.data;
        } catch (error : any) {
            const errorResponse = error.response?.data;
      return rejectWithValue(errorResponse?.message || "An unknown error occurred");
    
        }
    }
)