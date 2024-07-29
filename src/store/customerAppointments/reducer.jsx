import dayjs from "dayjs";
import {
  GET_ALL_APPOINTMENT_CUSTOMER,
  GET_ALL_APPOINTMENT_HISTORY_CUSTOMER,
  GET_ALL_APPOINTMENT_REPORT,
} from "./action";

const initialState = {
  totalPages: 1,
  getAppointmentsByCustomerId: [],
  getAppointmentsHistoryByCustomerId: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_APPOINTMENT_CUSTOMER:
      const updatedAppointments = action.payload.list.map(appointment => ({
        ...appointment,
        isReportable: dayjs(appointment.appointmentDetails[0]?.endTime).isBefore(dayjs()) || appointment.status === "SUCCESSED"
      }));
      return {
        ...state,
        totalPages: action.payload.totalPages,
        getAppointmentsByCustomerId: updatedAppointments,
      };

    case GET_ALL_APPOINTMENT_HISTORY_CUSTOMER:
      return {
        ...state,
        getAppointmentsHistoryByCustomerId: action.payload,
      };
    case GET_ALL_APPOINTMENT_REPORT:
      return {
        ...state,
        getAppointmentsByCustomerId: action.payload,
      };

    default:
      return state;
  }
};

export default reducer;
