import { API } from "./api";

export const AppointmentService = {
  GetAppointmentSalonByStatus(
    salonId,
    page,
    size,
    status,
    isAscending,
    date,
    customerName,
    employeeName
  ) {
    return API.get(`/appointments/GetAppointmentSalonByStatus/${salonId}`, {
      params: {
        page,
        size,
        status,
        isAscending,
        StartDate: date?.startDay,
        EndDate: date?.endDay,
        customerName,
        employeeName
      },
    });
  },
  GetAppointmentEmployeeByStatus(
    employeeId,
    page,
    size,
    status,
    isAscending,
    date,
    customerName
  ) {
    return API.get(
      `/appointments/GetAppointmentEmployeeByStatus/${employeeId}`,
      {
        params: {
          page,
          size,
          status,
          isAscending,
          date,
          customerName,
        },
      }
    );
  },
  GetAppointmentCustomerByStatus(
    customerId,
    page,
    size,
    status,
    isAscending,
    date
  ) {
    return API.get(
      `/appointments/GetAppointmentCustomerByStatus/${customerId}`,
      {
        params: {
          page,
          size,
          status,
          isAscending,
          date,
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
  getAppointmentById(id){
    return API.get(`/appointments/GetAppointmentById/${id}`)
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
  broadcastMessage(data) {
    return API.post("/signalRs/BroadcastMessage/broadcast", data);
  },
};
