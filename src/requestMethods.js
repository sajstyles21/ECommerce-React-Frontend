import axios from "axios";

const BASE_URL = "https://react-shop-backend.herokuapp.com/api/";
//const BASE_URL = "http://localhost:5001/api/";

let user = JSON.parse(localStorage.getItem("user"));
const TOKEN = user?.accessToken;

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});
export const userRequest = axios.create({
  baseURL: BASE_URL,
  headers: { token: `Bearer ${TOKEN}` },
});

export const baseUrl = BASE_URL;
