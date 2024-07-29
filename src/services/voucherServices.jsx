import { API } from "./api";

export const voucherServices = {
  getAllVouchers(page, size) {
    return API.get("/vouchers/GetAllVoucher", {
      params: {
        page,
        size,
      },
    });
  },
  getVoucherById(id) {
    return API.get(`/vouchers/GetVoucherById/${id}`);
  },
  getVoucherBySalonId(page, size, salonId) {
    return API.get(`/vouchers/GetVoucherBySalonId/${salonId}`, {
      params: {
        page,
        size,
      },
    });
  },
  getVoucherBySalonIdNotPaging(id) {
    return API.get(`/vouchers/GetVoucherBySalonIdNoPaging/${id}`);
  },
  createNewVoucher(formData) {
    return API.post("/vouchers/CreateVoucher", formData);
  },
  updateVoucherById(voucherId, formData) {
    return API.put(`/vouchers/UpdateVoucher/${voucherId}`, formData);
  },
  deleteVoucherById(id) {
    return API.delete(`/vouchers/DeleteVoucher/${id}`);
  },
};
