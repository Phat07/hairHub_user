import { API } from "./api";

export const SalonTransaction = {
  GetAppointmentTransaction(salonId, startDate, endDate) {
    return API.get(`/appointments/GetAppointmentTransaction/${salonId}`, {
      params: {
        startDate,
        endDate,
      },
    });
  },
  GetReviewRevenue(salonId, startTime, endTime) {
    return API.get(`/saloninformations/ReviewRevenue/${salonId}`, {
      params: {
        startTime,
        endTime,
      },
    });
  },
};
