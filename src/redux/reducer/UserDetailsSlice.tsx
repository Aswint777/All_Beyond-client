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
    status:string
  } | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  loading: false,
  userDetails: null,
  error: null,
  isAuthenticated: false,
};

const userDetailsSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.userDetails = null;
      state.isAuthenticated = false; 
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

      .addCase(UserLoginAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(UserLoginAction.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.error = null;
        state.isAuthenticated = true;

        state.userDetails = payload.data;
      })

      .addCase(UserLoginAction.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Login failed, try again";


        if (typeof action.payload === "string") {
          state.error = action.payload;
        } else {
          console.log(action.payload, "qqqqqqqqqq");

          state.error = "Login failed, try again";
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
        if (typeof action.payload === "string") {
          state.error = action.payload;
        } else {
          console.log(action.payload, "qqqqqqqqqq");

          state.error = "Login failed, try again";
        }
      });
  },
});

export const { logoutUser, updateProfilePhoto } = userDetailsSlice.actions;
export default userDetailsSlice.reducer;
