import { createSlice } from "@reduxjs/toolkit";
import { UserLoginAction } from "../actions/UserLoginAction";

interface loginFormValues {
    email: string;
    passWord: string;
  }
  
  interface loginState {
    formValues: loginFormValues;
    error: string | null;
    loading: boolean;
    isAuthenticated: boolean;
    userDetails: { email: string; role: string } | null;
  }
  
  const initialState: loginState = {
    formValues: {
      email: "",
      passWord: "",
    },
    error: null,
    loading: false,
    isAuthenticated: false,
    userDetails: null,
  };
  

const loginSlice = createSlice({
    name: "login",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(UserLoginAction.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(UserLoginAction.fulfilled, (state, { payload }) => {
          console.log(payload.data,'payload');
          
          state.loading = false;
          state.error = null;
          state.isAuthenticated = true;
          state.userDetails = payload.data;
          console.log(state.userDetails,'???????');
          
        })
        .addCase(UserLoginAction.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string || "Login failed";
        });
    },
  });
export default loginSlice.reducer;
