import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios';


export const GetUserDetailsAction = createAsyncThunk(
    "user/GetUserDetails",
    async (_, { rejectWithValue }) => {
      try {
        const API_URL = import.meta.env.VITE_REACT_APP_API_URL!;  

    const response = await axios.get(`${API_URL}/auth/userDetails`, {
      withCredentials: true, 
    });
    console.log(response,"user data is here at GetUserDetailsAction");
    
    return response.data;
    
      } catch (error: any) {
        console.log('0000000000');
        
        return rejectWithValue(error.response?.data || "Failed to fetch user details");
      }
    }   
)


