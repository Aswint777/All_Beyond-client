import { configureStore } from "@reduxjs/toolkit";
import signUpReducer from "./reducer/UserSlice";
import verifyOtpReducer from "./reducer/verifyOtpUserSlice";
import userDetailsReducer from "./reducer/UserDetailsSlice";

const Store = configureStore({
  reducer: {
    signUp: signUpReducer,
    verifyOtp: verifyOtpReducer,
    user: userDetailsReducer, 
  },
});

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;

export default Store;
