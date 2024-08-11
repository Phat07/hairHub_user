import { API } from "./api";

export const AppointmentService = {
  GetAppointmentSalonByStatus(salonId, page, size, status) {
    return API.get(`/appointments/GetAppointmentSalonByStatus/${salonId}`, {
      params: {
        page,
        size,
        status,
      },
    });
  },
  GetAppointmentCustomerByStatus(customerId, page, size, status) {
    return API.get(
      `/appointments/GetAppointmentCustomerByStatus/${customerId}`,
      {
        params: {
          page,
          size,
          status,
        },
      }
    );
  },
  GetAppointmentSalonNotPaging(salonId) {
    return API.get(`/appointments/GetAppointmentBySalonIdNoPaging/${salonId}`);
  },
  UpdateAppointment(id, data) {
    return API.put(`/appointments/UpdateAppointment/${id}`, data);
  },

  GetSalonInformationByOwnerId(ownerId) {
    return API.get(
      `/saloninformations/GetSalonInformationByOwnerId/${ownerId}`
    );
  },
  calculatePrice(formData) {
    return API.post("/appointments/CalculatePrice/", formData);
  },
  createAppointment(formData) {
    return API.post("/appointments/CreateAppointment", formData);
  },
  getAllAppointmentsByCustomerId(id, page, size) {
    return API.get(`/appointments/GetBookingAppointmentCustomer/${id}`, {
      params: {
        page,
        size,
      },
    });
  },
  getAllAppointmentsHistoryByCustomerId(id, page, size) {
    return API.get(`/appointments/GetHistoryAppointmentByCustomterId/${id}`, {
      params: {
        page,
        size,
      },
    });
  },
  deleteAppointmentCustomer(id, customerId, reasonCancel) {
    return API.put(`/appointments/CancelAppointByCustomer/${id}`, {
      customerId: customerId,
      reasonCancel: reasonCancel,
    });
  },
};
