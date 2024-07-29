import { API } from "./api";

export const ReportService = {
  GetReportBySalonId(page, size, salonId, status) {
    return API.get(`/reports/GetReportBySalonId/${salonId}`, {
      params: {
        page,
        size,
        status,
      },
    });
  },
  GetReportByCustomerId(page, size, customerId, status) {
    return API.get(`/reports/GetReportByCustomerId/${customerId}`, {
      params: {
        page,
        size,
        status,
      },
    });
  },
  createReport(data) {
    return API.post("/reports/CreateReport", data);
  },
};
