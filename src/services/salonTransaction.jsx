import { API } from "./api";

export const SalonTransaction = {
  GetAppointmentTransaction(salonId, numberOfDay) {
    return API.get(`/appointments/GetAppointmentTransaction/${salonId}`, {
      params: {
        numberOfDay,
      },
    });
  },
};
