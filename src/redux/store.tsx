import { configureStore } from "@reduxjs/toolkit";
import signUpReducer from "./reducer/UserSlice"
import verifyOtpReducer from "./reducer/verifyOtpUserSlice"
import loginReducer from "./reducer/UserLoginSlice"

const Store = configureStore({
    reducer: {
        signUp: signUpReducer ,
        verifyOtp:verifyOtpReducer,
        login : loginReducer
      },
})

export type RootState = ReturnType<typeof Store.getState>
export type AppDispatch = typeof Store.dispatch

export default Store