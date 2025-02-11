// import { createAsyncThunk } from "@reduxjs/toolkit"
// import axios from "axios";
// import { config } from "../../configaration/Config";

// interface LoginPayLoad {
//     email: string;
//     password: string;
//   }

// export const UserLoginAction = createAsyncThunk(
//     "auth/login",
//     async ({ email,password  }: LoginPayLoad, { rejectWithValue }) => {
//         try {
//             console.log(email,password,'login action');
//             const API_URL = import.meta.env.VITE_REACT_APP_API_URL!;

//             const response = await axios.post(`${API_URL}/auth/login`, { email, password }, config);
//             console.log(response,'response is here the login');
            
//             return response.data;
//         } catch (error : any) {
//             const errorResponse = error.response?.data;
//       return rejectWithValue(errorResponse?.message || "An unknown error occurred");
    
//         }
//     }
// )



import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { GetUserDetailsAction } from "./GetUserDetailsAction"; // Import it

export const UserLoginAction = createAsyncThunk(
  "user/login",
  async (loginData: { email: string; password: string }, { dispatch, rejectWithValue }) => {
    try {
      const API_URL = import.meta.env.VITE_REACT_APP_API_URL!;
      const response = await axios.post(`${API_URL}/auth/login`, loginData, {
        withCredentials: true,
      });

      console.log("User login successful:", response.data);

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
     async (_,{ rejectWithValue }) => {
      try {
        
        const API_URL = import.meta.env.VITE_REACT_APP_API_URL!;
        const response = await axios.delete(`${API_URL}/auth/logOut`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        console.log('zzzzzzzzzzzz');
  
        console.log("User LogOut successful:", response.data);  
        return response.data;
      } catch (error: any) {
        console.log("LogOut error:", error);
        return rejectWithValue(error.response?.data || "LogOut failed");
      }
    }
  );



  
