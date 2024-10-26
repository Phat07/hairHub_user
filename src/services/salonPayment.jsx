import { API } from "./api";

export const SalonPayment = {
  GetPaymentByOwnerId(page, size, ownerId) {
    return API.get(`/payment/GetPaymentByOwnerId/${ownerId}`, {
      params: {
        page,
        size,
      },
    });
  },
  createPaymentPackageByOwnerId(data) {
    return API.post(`/payment/SendPaymentLink/`, data);
  },
  GetStatusPayment(data, ordercode) {
    return API.post(`/payment/GetStatusPayment/`, data, {
      params: {
        ordercode: ordercode,
      },
    });
  },
  getInforPaymetOwnerId(id) {
    return API.get(`/payment/GetInformationPaymentOfSalonOwner/${id}`);
  },
  createPaymentLink(id, data) {
    return API.post(`/payment/SendPaymentLink/${id}`, data, {
      params: {
        accountid: id,
      },
    });
  },
  checkPaymentStatus() {
    return API.get("/payment/PaymentConfirm");
  },
};
