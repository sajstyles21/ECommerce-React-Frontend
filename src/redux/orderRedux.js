import { createSlice } from "@reduxjs/toolkit";

//Slices
const orderSlice = createSlice({
  name: "order",
  initialState: {
    currentOrder: null,
    isFetching: false,
    error: false,
    errorMessage: null,
  },
  reducers: {
    orderStart: (state) => {
      state.isFetching = true;
    },
    orderSuccess: (state, action) => {
      state.isFetching = false;
      state.currentOrder = action.payload;
      state.errorMessage = null;
      state.error = false;
    },
    orderFailure: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.errorMessage = action.payload;
    },
  },
});

export const { orderStart, orderSuccess, orderFailure } = orderSlice.actions;
export default orderSlice.reducer;
