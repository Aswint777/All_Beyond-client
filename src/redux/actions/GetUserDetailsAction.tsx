import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios';
import React from 'react'

export const getUserDetailsAction = createAsyncThunk(
    "user/getUserDetails",
    async (_, { rejectWithValue }) => {
      try {
        const API_URL = import.meta.env.VITE_REACT_APP_API_URL!;

    const response = await axios.get(`${API_URL}/auth/userDetails`, {
      withCredentials: true, // Ensure cookies are sent if using JWT in cookies
    });
    console.log(response,"user data is here at GetUserDetailsAction");
    
    return response.data;

      } catch (error: any) {
        return rejectWithValue(error.response?.data || "Failed to fetch user details");
      }
    }   
)


