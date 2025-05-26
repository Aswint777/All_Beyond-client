import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { config } from "../../configaration/Config";
import { resetSignUp } from "../actions/resetSignUpAction";


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
      console.log(formValues, "form values in front-end");

      const API_URL = import.meta.env.VITE_REACT_APP_API_URL!;
      console.log(API_URL, "url of the backend");
      const response = await axios.post(
        `${API_URL}/auth/signup`,
        formValues,
        config
      );
      console.log(response.data, "signUp response is here ");
      return response.data;
    } catch (error: any) {

      console.error("SignUp Errors:", error.response?.data || error.message);

      const errorResponse = error.response?.data;

      if (Array.isArray(errorResponse?.errors)) {
        console.log("hello inside");
        return rejectWithValue(
          errorResponse.errors
            .map((err: { message: string }) => err.message)
            .join(", ") 
        );
      }
      console.log(errorResponse?.message, "here error response 66");

      return rejectWithValue(
        errorResponse?.message || "An unknown error occurred"
      );
    }
  }
);

const SignUpSlice = createSlice({
  name: "signUp",
  initialState,
  reducers: {
    updateField: (
      state,
      action: PayloadAction<{ field: string; value: string }>
    ) => {
      state.formValues[action.payload.field as keyof SignUpFormValues] =
        action.payload.value;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendSignUpData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendSignUpData.fulfilled, (state, { payload }) => {
        console.log(sendSignUpData, "sendSignUp Data");

        state.loading = false;
        state.error = null;
        state.requiresOTP = payload.requiresOTP || false; 

        state.formValues = { ...state.formValues, ...payload.user };

                // Reset formValues to initial state (clear all form data)
        // state.formValues = {
        //   name: "",
        //   email: "",
        //   password: "",
        //   confirmPassword: "",
        // };
      })


      .addCase(sendSignUpData.rejected, (state, action) => {
        console.log(action, "error in payload");

        state.loading = false;

        if (typeof action.payload === "string") {
          state.error = action.payload;
        } else {
          state.error = "An unexpected error occurred";
        }
      })

            .addCase(resetSignUp, () => initialState); // Reset only signUp slice

  },
});

export const { updateField } = SignUpSlice.actions;
export default SignUpSlice.reducer;
