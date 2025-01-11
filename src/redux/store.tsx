import { configureStore } from "@reduxjs/toolkit";
import signUpReducer from "./reducer/UserSlice"

const Store = configureStore({
    reducer: {
        signUp: signUpReducer ,
      },
})

export type RootState = ReturnType<typeof Store.getState>
export type AppDispatch = typeof Store.dispatch

export default Store