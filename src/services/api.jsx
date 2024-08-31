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
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Thay đổi endpoint và logic để làm mới token của bạn
        const response = await axios.post(
          `https://hairhub.gahonghac.net/api/v1/auth/refresh`,
          {
            refreshToken: localStorage.getItem("refreshToken"),
          }
        );
        const { accessToken } = response.data;
        localStorage.setItem("accessToken", accessToken);
        API.defaults.headers.Authorization = `Bearer ${accessToken}`;
        return API(originalRequest);
      } catch (refreshError) {
        // Xử lý lỗi làm mới token
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
