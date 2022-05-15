import { publicRequest, userRequest } from "../requestMethods";
import { orderFailure, orderStart, orderSuccess } from "./orderRedux";
import { loginFailure, loginStart, loginSuccess } from "./userRedux";

export const login = async (dispatch, user) => {
  dispatch(loginStart());
  try {
    const res = await publicRequest.post("auth/login", user);
    dispatch(loginSuccess(res.data));
  } catch (err) {
    dispatch(loginFailure(err.response.data));
  }
};

export const createOrder = async (dispatch, order) => {
  dispatch(orderStart());
  try {
    const res = await userRequest.post("orders", order);
    dispatch(orderSuccess(res.data));
  } catch (err) {
    dispatch(orderFailure(err.response.data));
  }
};
