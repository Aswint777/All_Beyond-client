import { createSlice } from "@reduxjs/toolkit";
import { UserLoginAction, UserLogOutAction } from "../actions/UserLoginAction";

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

       //login
      .addCase(UserLoginAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(UserLoginAction.fulfilled, (state, { payload }) => {
        console.log(payload.data, "payload");
        state.loading = false;
        state.error = null;
        state.isAuthenticated = true;
        state.userDetails = payload.data;
        console.log(state.userDetails, "???????");
      })
      .addCase(UserLoginAction.rejected, (state, action) => {
        state.loading = false;
        // state.error = (action.payload as string) || "Login failed";
        if (typeof action.payload === "string") {
          // Single error message
          state.error = action.payload;
        } else {
          // Handle unexpected cases
          console.log(action.payload,'qqqqqqqqqq');
          
          state.error = "Login failed, try again";
          // state.error= e
        }
      })

      //logOut
      .addCase(UserLogOutAction.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.userDetails = null;

      })
      .addCase(UserLogOutAction.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false; 
      })
      .addCase(UserLogOutAction.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Login failed";
      });
  },
});
export default loginSlice.reducer;



// .addCase(logoutAction.pending, (state: userState) => {
//   state.loading = true;
// })
// .addCase(logoutAction.rejected, (state: userState, action) => {
//   state.loading = false;
//   state.data = null;
//   state.error = action.error.message || "Logout failed";
// })
// .addCase(logoutAction.fulfilled, (state: userState) => {
//   state.loading = false;
//   state.data = null;
//   state.error = null;
// })