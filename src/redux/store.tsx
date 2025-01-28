import { configureStore } from "@reduxjs/toolkit";
import signUpReducer from "./reducer/UserSlice"
import verifyOtpReducer from "./reducer/verifyOtpUserSlice"
import loginReducer from "./reducer/UserLoginSlice"
import userDetailsReducer from "./reducer/UserDetailsSlice"

const Store = configureStore({
    reducer: {
        signUp: signUpReducer ,
        verifyOtp:verifyOtpReducer,
        login : loginReducer,
        user: userDetailsReducer, // Add it to store

      },
})

export type RootState = ReturnType<typeof Store.getState>
export type AppDispatch = typeof Store.dispatch

export default Store