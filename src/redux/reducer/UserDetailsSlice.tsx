import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GetUserDetailsAction } from "../actions/GetUserDetailsAction";
import { UserLoginAction, UserLogOutAction } from "../actions/UserLoginAction";
import { googleAuthAction } from "../actions/GoogleAuthAction";

interface UserState {
  userDetails: {
    userId: string;
    email: string;
    role: string;
    username: string;
    _id: string;
    firstName: string;
    lastName: string;
    isBlocked: boolean;
    isVerified: boolean;
    contactNumber: string;
    instagram: string;
    facebook: string;
    linkedin: string;
    profilePhoto: string;
    isAppliedInstructor: boolean; 
  } | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}
////////////////////////////////////////////////////////////////////////
// interface loginFormValues {
//   email: string;
//   passWord: string;
// }
// interface loginState {
//   formValues: loginFormValues;
//   error: string | null;
//   loading: boolean;
//   isAuthenticated: boolean;
//   userDetails: { email: string; role: string } | null;
// }
///////////////////////////////////////////////////////////////////
const initialState: UserState = {
  loading: false,
  userDetails: null,
  error: null,
  isAuthenticated: false,
  // isAuthenticated: localStorage.getItem("isAuthenticated") === "true",
};

const userDetailsSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.userDetails = null; // Clear user details on
      state.isAuthenticated = false; // <-- Add this line
    },
    updateProfilePhoto: (state, action: PayloadAction<string>) => {
      if (state.userDetails) {
        state.userDetails.profilePhoto = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetUserDetailsAction.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(GetUserDetailsAction.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.userDetails = payload.user;
      })
      .addCase(GetUserDetailsAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      //login
      .addCase(UserLoginAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // .addCase(UserLoginAction.fulfilled, (state, { payload }) => {
      //   console.log(payload, "payload");
      //   state.loading = false;
      //   state.error = null;
      //   state.isAuthenticated = true;
      //   state.userDetails =payload.user?? payload.data;
      //   console.log(state.userDetails, "???????");
      // })
      .addCase(UserLoginAction.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.error = null;
        state.isAuthenticated = true;
        console.log(
          payload.data,
          "payload . user hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
        );

        state.userDetails = payload.data;
      })

      .addCase(UserLoginAction.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Login failed, try again";

        // state.error = (action.payload as string) || "Login failed";

        if (typeof action.payload === "string") {
          // Single error message
          state.error = action.payload;
        } else {
          // Handle unexpected cases
          console.log(action.payload, "qqqqqqqqqq");

          state.error = "Login failed, try again";
          // state.error= e
        }
      })

      .addCase(UserLogOutAction.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.userDetails = null;
      })
      .addCase(UserLogOutAction.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.userDetails = null;
      })
      .addCase(UserLogOutAction.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Login failed";
      })

      .addCase(googleAuthAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(googleAuthAction.fulfilled, (state, { payload }) => {
        console.log(payload.data, "payload");
        state.loading = false;
        state.error = null;
        state.isAuthenticated = true;
        state.userDetails = payload.user;
        console.log(state.userDetails, "???????");
      })
      .addCase(googleAuthAction.rejected, (state, action) => {
        state.loading = false;
        // state.error = (action.payload as string) || "Login failed";
        if (typeof action.payload === "string") {
          // Single error message
          state.error = action.payload;
        } else {
          // Handle unexpected cases
          console.log(action.payload, "qqqqqqqqqq");

          state.error = "Login failed, try again";
          // state.error= e
        }
      });
  },
});

export const { logoutUser, updateProfilePhoto } = userDetailsSlice.actions;
export default userDetailsSlice.reducer;
