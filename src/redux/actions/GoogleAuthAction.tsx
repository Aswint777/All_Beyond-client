import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { CredentialResponse } from "@react-oauth/google";
import { config } from "../../configaration/Config"; 
import { GetUserDetailsAction } from "./GetUserDetailsAction";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL; 

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
