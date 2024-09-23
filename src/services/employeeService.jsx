import { API } from "./api";

export const employeeService = {
  NumberAppointmentByStatus(id, startdate, enddate) {
    return API.get(`/appointments/NumberAppointmentByStatus/${id}`, {
      params: {
        startdate,
        enddate,
      },
    });
  },
  RateAppointmentByStatus(id, startdate, enddate) {
    return API.get(`/appointments/RateAppointmentByStatus/${id}`, {
      params: {
        startdate,
        enddate,
      },
    });
  },
  RevenueandNumberofAppointment(id, startdate, enddate) {
    return API.get(`/appointments/RevenueandNumberofAppointment/${id}`, {
      params: {
        startdate,
        enddate,
      },
    });
  },
  GetSalonByEmployeeId(id) {
    return API.get(`/saloninformations/GetSalonByEmployeeId/${id}`);
  },
  GetScheduleByEmployeeId(id) {
    return API.get(`/schedules/GetScheduleByEmployeeId/${id}`);
  },
  GetServiceHairByEmployeeId(id, page, size, search, filter, orderby) {
    return API.get(`/servicehairs/GetServiceHairByEmployeeId/${id}`, {
      params: {
        page,
        size,
        search,
        filter,
        orderby,
      },
    });
  },
};
