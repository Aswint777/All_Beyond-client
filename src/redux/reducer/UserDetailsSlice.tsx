import { createSlice } from "@reduxjs/toolkit";
import { GetUserDetailsAction } from "../actions/GetUserDetailsAction";
// import { getUserDetailsAction } from "../actions/getUserDetailsAction";
// import { getUserDetailsAction } from "../actions/getUserDetailsAction";

interface UserState {
  userDetails: {
    email: string;
    role: string;
    username: string;
    _id: string;
    firstName:string
    lastName:string
    isBlocked:boolean
    isVerified:boolean   
    contacts :Number 
  } | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  userDetails: null,
  loading: false,
  error: null,
};

const userDetailsSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.userDetails = null; // Clear user details on logout
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetUserDetailsAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetUserDetailsAction.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.userDetails = payload.user;
      })
      .addCase(GetUserDetailsAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logoutUser } = userDetailsSlice.actions;
export default userDetailsSlice.reducer;
