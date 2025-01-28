import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { config } from "../../configaration/Config";
// import dotenv from "dotenv";
// dotenv.config()

interface SignUpFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignUpState {
  formValues: SignUpFormValues;
  error: string | null;
  loading: boolean;
  requiresOTP: boolean;
}

const initialState: SignUpState = {
  formValues: {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  },
  error: null,
  loading: false,
  requiresOTP: false,
};

export const sendSignUpData = createAsyncThunk(
  "signUp/sendData",
  async (formValues: SignUpFormValues, { rejectWithValue }) => {
    try {
        console.log(formValues,"form values in front-end");
        
        const API_URL = import.meta.env.VITE_REACT_APP_API_URL!;
        // const API_URL = "http://localhost:5000"; 
        console.log(API_URL,"url of the backend")
        const response = await axios.post(`${API_URL}/auth/signup`, formValues, config);
        console.log(response.data,'signUp response is here ');
          return response.data;
        
    
    } catch (error: any) {
      // console.error("SignUp Error:", error.response?.data || error.message);
      // return rejectWithValue(error.response?.data || "An error occurred");
      console.error("SignUp Errors:", error.response?.data || error.message);


      // If the backend sends a structured error, check if it's an array or object.
      const errorResponse = error.response?.data;

      // If it is an array of errors, return the first message or concatenate them
      if (Array.isArray(errorResponse?.errors)) {
        console.log("hello inside")
        return rejectWithValue(
          errorResponse.errors.map((err: { message: string }) => err.message).join(", ")
        );
      }
       console.log(errorResponse?.message,"here error response 66");


      // If it's not an array, return the error message or generic error
      return rejectWithValue(errorResponse?.message || "An unknown error occurred");
    
    }
  }
);

const SignUpSlice = createSlice({
  name: "signUp",
  initialState,
  reducers: {
    updateField: (state, action: PayloadAction<{ field: string; value: string }>) => {
      state.formValues[action.payload.field as keyof SignUpFormValues] = action.payload.value;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendSignUpData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendSignUpData.fulfilled, (state,{payload}) => {
        console.log(sendSignUpData,"sendSignUp Data");
        
        state.loading = false;
        state.error = null;
        state.requiresOTP = payload.requiresOTP || false; // Update requiresOTP here

        state.formValues = { ...state.formValues, ...payload.user };
        // state.user = payload
      })
      // .addCase(sendSignUpData.rejected, (state, action) => {
      //   console.log(action.payload,"error in payload");
        
      //   state.loading = false;
      //   state.error = action.payload as string;
      // });

      .addCase(sendSignUpData.rejected, (state, action) => {
        console.log(action, "error in payload");

        state.loading = false;

        // If action.payload is an array of error messages, display them
        if (typeof action.payload === "string") {
          // Single error message
          state.error = action.payload;
        } else {
          // Handle unexpected cases
          state.error = "An unexpected error occurred hahahha";
          // state.error= e
        }
      });
  },
});

export const { updateField } = SignUpSlice.actions;
export default SignUpSlice.reducer;     
