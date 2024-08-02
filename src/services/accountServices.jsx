import { API } from "./api";

export const AccountServices = {
    loginUser(userData) {
      return API.post("/auth/Login", userData);
    },
  registerUser(userData) {
    return API.post("/accounts/RegisterAccount", userData);
  },
  fetchUserByToken(token) {
    return API.get(`/acccounts/fetchUser/${token}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  GetInformationAccount(id) {
    return API.get(`/accounts/GetAccountById/${id}`);
  },
};
