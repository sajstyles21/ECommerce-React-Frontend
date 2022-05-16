import { createSlice } from "@reduxjs/toolkit";

//Slices
const registerSlice = createSlice({
  name: "userRegister",
  initialState: {
    isFetching: false,
    error: false,
    errorMessage: null,
    success: false,
  },
  reducers: {
    registerStart: (state) => {
      state.isFetching = true;
      state.success = false;
    },
    registerSuccess: (state, action) => {
      state.isFetching = false;
      state.error = false;
      state.errorMessage = null;
      state.success = true;
    },
    registerFailure: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.success = false;
      state.errorMessage = action.payload;
    },
  },
});

export const { registerStart, registerSuccess, registerFailure } =
  registerSlice.actions;
export default registerSlice.reducer;
