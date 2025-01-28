import { createSlice } from "@reduxjs/toolkit";
import { getUserDetailsAction } from "../actions/getUserDetailsAction";

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
      .addCase(getUserDetailsAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserDetailsAction.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.userDetails = payload.user;
      })
      .addCase(getUserDetailsAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logoutUser } = userDetailsSlice.actions;
export default userDetailsSlice.reducer;
