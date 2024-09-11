import { API } from "./api";

export const SchedulesService = {
  putSchedulesEmployee(id, data) {
    return API.put(`/schedules/UpdateScheduleofEmployee/${id}`, data);
  },
};
