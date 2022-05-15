import { createSlice } from "@reduxjs/toolkit";

//Slices
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    products: [],
    quantity: 0,
    total: 0,
  },
  reducers: {
    addProduct: (state, action) => {
      state.quantity += 1;
      state.products.push(action.payload);
      state.total += action.payload.price * action.payload.quantity;
    },
    emptyCart: (state, action) => {
      state.quantity = 0;
      state.products = [];
      state.total = 0;
    },
    updateCart: (state, action) => {
      const index = state.products.findIndex(
        (product) => product._id === action.payload._id
      );
      state.products[index].quantity = action.payload.quantity;
      let sum = 0;
      state.products.forEach((element) => {
        sum += element.quantity * element.price;
      });
      state.total = sum;
    },
  },
});

export const { addProduct, emptyCart, updateCart } = cartSlice.actions;
export default cartSlice.reducer;
