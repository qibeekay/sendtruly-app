import axios from "axios";
const userData = JSON.parse(localStorage.getItem("data_user_main"));
//console.log(userData.token);
// const authorize = import.meta.env.VITE_APP_AUTHORIZATION_KEY;
export const AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${userData?.token || ""}`,
  },
});
