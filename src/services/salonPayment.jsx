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
  CreateWithdrawPayment(data) {
    return API.post("/payment/CreateWithdrawPayment", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  SendOTPWithdrawPayment(data) {
    return API.post("/otps/SendOTPTRequestWithdraw", {
      accountId: data,
    });
  },
  GetPaymentHistory(
    accountId,
    page,
    size,
    paymentType,
    status,
    payDate,
    email
  ) {
    return API.get("payment/GetPaymentHistory", {
      params: {
        page,
        size,
        payDate,
        email,
        paymentType,
        status,
        accountId,
      },
    });
  },
  GetPaymentReport(accountId, page, size, createDate, status) {
    return API.get("payment/GetPaymentReport", {
      params: {
        page,
        size,
        createDate,

        status,
        accountId,
      },
    });
  },
  GetPaymentReportById(id) {
    return API.get(`payment/GetPaymentReportById/${id}`);
  },
};
