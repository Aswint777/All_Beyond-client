import { createSlice } from "@reduxjs/toolkit";
import { VerifyOtpAction } from "../actions/VerifyOtpAction";

interface verifyOtpFormValues {
  name: string;
  email: string;
}

interface verifyOtpState {
  formValues: verifyOtpFormValues;
  error: string | null;
  loading: boolean;
  isOtpVerified: boolean;
}

const initialState: verifyOtpState = {
  formValues: {
    name: "",
    email: "",
  },
  error: null,
  loading: false,
  isOtpVerified: false,
};

const verifyOtpSlice = createSlice({
  name: "verifyOtp",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(VerifyOtpAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(VerifyOtpAction.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.isOtpVerified = true;
        state.error = null;
        console.log(payload, "OTP verification success");
      })
      .addCase(VerifyOtpAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string|| "OTP verification failed";
      });
  },
});

export default verifyOtpSlice.reducer;
