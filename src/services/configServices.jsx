import { API } from "./api";

export const ConfigService = {
  GetAllConfig(page, size) {
    return API.get(`/configs/GetAllConfig/`, {
      params: {
        page,
        size,
      },
    });
  },
  GetAllPaymentByOwnerId(id,page, size) {
    return API.get(`/payment/GetPaymentByOwnerId/${id}`, {
      params: {
        page,
        size,
      },
    });
  },
};
