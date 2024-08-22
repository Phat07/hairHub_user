import axios from "axios";
const BASE_URL = "https://hairhub.gahonghac.net/api/v1";

export const API = axios.create({
  baseURL: BASE_URL,
});
// Add a request interceptor to include the token in every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
