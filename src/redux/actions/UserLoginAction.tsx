import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios";
import { config } from "../../configaration/Config";

interface LoginPayLoad {
    email: string;
    password: string;
  }

export const UserLoginAction = createAsyncThunk(
    "auth/login",
    async ({ email,password  }: LoginPayLoad, { rejectWithValue }) => {
        try {
            console.log(email,password,'login action');
            
            const API_URL = "http://localhost:5000"; // Update this URL as needed
            const response = await axios.post(`${API_URL}/auth/login`, { email, password }, config);
            return response.data;
        } catch (error : any) {
            const errorResponse = error.response?.data;
      return rejectWithValue(errorResponse?.message || "An unknown error occurred");
    
        }
    }
)