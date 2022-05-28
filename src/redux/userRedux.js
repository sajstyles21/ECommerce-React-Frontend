import { createSlice } from "@reduxjs/toolkit";

//Slices
const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    isFetching: false,
    error: false,
    errorMessage: null,
  },
  reducers: {
    loginStart: (state) => {
      state.isFetching = true;
    },
    loginSuccess: (state, action) => {
      state.isFetching = false;
      state.currentUser = action.payload;
      state.errorMessage = null;
      state.error = false;
    },
    loginFailure: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.errorMessage = action.payload;
    },
    logout: (state) => {
      state.currentUser = null;
    },
    clear: (state) => {
      state.currentUser = null;
      state.isFetching = false;
      state.error = false;
      state.errorMessage = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, clear } =
  userSlice.actions;
export default userSlice.reducer;
