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
  RevenueofAppointmentDaybyDay(id, startdate, enddate) {
    return API.get(`/appointments/RevenueofAppointmentDaybyDay/${id}`, {
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
  GetScheduleTodayByEmployeeId(id) {
    return API.get(`/schedules/GetScheduleTodayByEmployeeId/${id}`);
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
  PostBusySchedule(data, id) {
    return API.post(`/busy_schedule_employee/BusySchedule/${id}`, data, {
      params: {
        id: id,
      },
    });
  },
  GetBusyScheduleEmployee(employeeId, date) {
    return API.get(
      `/busy_schedule_employee/GetBusyScheduleEmployee/${employeeId}`,
      {
        params: {
          dateTime: date,
        },
      }
    );
  },
  DeleteBusySchedule(id) {
    return API.delete(`/busy_schedule_employee/DeleteBusySchedule/${id}`);
  },
  UpdateBusySchedule(id, data) {
    return API.put(`/busy_schedule_employee/UpdateBusySchedule/${id}`, data);
  },
};
