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
            const API_URL = import.meta.env.VITE_REACT_APP_API_URL!;

            const response = await axios.post(`${API_URL}/auth/login`, { email, password }, config);
            console.log(response,'response is here the login');
            
            return response.data;
        } catch (error : any) {
            const errorResponse = error.response?.data;
      return rejectWithValue(errorResponse?.message || "An unknown error occurred");
    
        }
    }
)