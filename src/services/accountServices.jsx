import { API } from "./api";

export const AccountServices = {
  loginUser(userData) {
    return API.post("/auth/Login", userData);
  },
  registerUser(userData) {
    return API.post("/accounts/RegisterAccount", userData);
  },
  refreshToken: (refreshToken) => {
    return API.post("/auth/RefreshToken", { refreshToken });
  },
  fetchUserByToken(token) {
    return API.get(`/auth/FetchUser/${token}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  GetInformationAccount(id) {
    return API.get(`/accounts/GetAccountById/${id}`);
  },
  checkInByCustomer(data) {
    return API.put(`/customers/CheckInByCustomer`, data);
  }
};
