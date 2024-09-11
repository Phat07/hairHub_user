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
};
