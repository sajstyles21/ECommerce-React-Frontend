import { publicRequest, userRequest } from "../requestMethods";
import { orderFailure, orderStart, orderSuccess } from "./orderRedux";
import { loginFailure, loginStart, loginSuccess } from "./userRedux";
import {
  registerFailure,
  registerStart,
  registerSuccess,
} from "./registerRedux";

export const login = async (dispatch, user) => {
  dispatch(loginStart());
  try {
    const res = await publicRequest.post("auth/login", user);
    dispatch(loginSuccess(res.data));
    localStorage.setItem("user", JSON.stringify(res.data));
  } catch (err) {
    dispatch(loginFailure(err.response.data));
  }
};

export const register = async (dispatch, user) => {
  dispatch(registerStart());
  try {
    const res = await publicRequest.post("auth/register", user);
    dispatch(registerSuccess(res.data));
  } catch (err) {
    dispatch(registerFailure(err.response.data));
  }
};

export const createOrder = async (dispatch, order) => {
  dispatch(orderStart());
  try {
    let user = JSON.parse(localStorage.getItem("user"));
    const TOKEN = user?.accessToken;

    const config = {
      headers: { token: `Bearer ${TOKEN}` },
    };

    const res = await userRequest.post("orders", order, config);
    dispatch(orderSuccess(res.data));
  } catch (err) {
    dispatch(orderFailure(err.response.data));
  }
};
