import { API } from "./api";

export const AccountServices = {
  loginUser(userData) {
    return API.post("/auth/Login", userData);
  },
  LogOut(refreshToken) {
    return API.delete("/auth/LogOut", {
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        refreshToken, // Chuyển refreshToken vào body nếu cần
      },
    });
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
  },
  updateUserById(id, data) {
    return API.put(`/accounts/UpdateAccount/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  updatePasswordUserById(id, data) {
    return API.put(`/accounts/ChangePassword/${id}`, data);
  },
  forgotPassword(data) {
    return API.post("/accounts/ForgotPassword", data);
  },
  loginGoogle(data) {
    return API.post("/accounts/GoogleLogin", data);
  },
  createAccountByGoogle(data) {
    return API.post("/accounts/RegisterAccountLoginGoogle", data);
  },
  DeleteAccount(id) {
    return API.delete(`/accounts/DeleteAccount/${id}`);
  },
  ChatMessageAI(data) {
    return API.post("/accounts/ChatMessageAI", data);
  },
  GetCustomerByEmail(email) {
    return API.get(`customers/GetCustomerByEmail`, {
      params: { email: email },
    });
  },
};
