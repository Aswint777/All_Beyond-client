import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { config } from "../../configaration/Config";


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
        
        const API_URL = "http://localhost:5000"; 
        console.log(API_URL,"url of the backend")
        const response = await axios.post(`${API_URL}/auth/signup`, formValues, config);
        console.log(response.data,'signUp response is here ');
          return response.data;
        console.log(response.data.user,'data is here');
        
    
    } catch (error: any) {
      console.error("SignUp Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || "An error occurred");
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
        state.loading = false;
        state.error = null;
        state.requiresOTP = payload.requiresOTP || false; // Update requiresOTP here

        state.formValues = { ...state.formValues, ...payload.user };
        // state.user = payload
      })
      .addCase(sendSignUpData.rejected, (state, action) => {
        console.log(action.payload,"error in payload");
        
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { updateField } = SignUpSlice.actions;
export default SignUpSlice.reducer;
