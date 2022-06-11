import { publicRequest, userRequest } from "./requestMethods";
import jwt_decode from "jwt-decode";
import { logout } from "./redux/userRedux";

const setUpInterceptors = (store) => {
  const { dispatch } = store;

  //Request Intercept
  userRequest.interceptors.request.use(
    async (config) => {
      let userDetail = JSON.parse(localStorage.getItem("user"));
      const accessToken = userDetail?.accessToken;
      let currentDate = new Date();
      const decodedToken = jwt_decode(accessToken);
      if (decodedToken.exp * 1000 < currentDate.getTime()) {
        const refToken = userDetail?.refreshToken;
        try {
          const res = await publicRequest.post("auth/refresh", {
            token: refToken,
          });
          const { accessToken, refreshToken } = res.data;
          const newUser = {
            ...userDetail,
            accessToken,
            refreshToken,
          };
          localStorage.setItem("user", JSON.stringify(newUser));
          config.headers["token"] = "Bearer " + accessToken;
        } catch (err) {
          console.log(err);
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  //Response Intercept
  userRequest.interceptors.response.use(
    (res) => {
      return res;
    },
    (err) => {
      if (err.response) {
        if (err.response.status === 403) {
          dispatch(logout({}));
          localStorage.clear();
        }
      }
      return Promise.reject(err);
    }
  );
};

export default setUpInterceptors;
