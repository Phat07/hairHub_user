import {
  GET_NUMBER_APPOINTMENT,
  GET_RATE_APPOINTMENT,
  GET_REVENUE_APPOINTMENT,
  GET_SALON_EMPLOYEE,
  GET_SCHEDULE_EMPLOYEE,
  GET_SCHEDULE_EMPLOYEE_TODAY,
  GET_SERVICE_EMPLOYEE,
  GET_REVENUE_APPOINTMENT_DAY,
  GET_SCHEDULE_BUSY_EMPLOYEE,
} from "./action";

const initialState = {
  getNumberAppointmentByStatus: [],
  getRateAppointmentByStatus: [],
  getRevenueandNumberofAppointment: [],
  getRevenueofAppointmentDaybyDay: [],
  getSalonByEmployeeId: [],
  getScheduleByEmployeeId: [],
  getScheduleTodayByEmployeeId: [],
  getServiceHairByEmployeeId: [],
  getBusyScheduleEmployee: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_NUMBER_APPOINTMENT:
      return {
        ...state,
        getNumberAppointmentByStatus: action.payload,
      };

    case GET_RATE_APPOINTMENT:
      return {
        ...state,
        getRateAppointmentByStatus: action.payload,
      };
    case GET_REVENUE_APPOINTMENT:
      return {
        ...state,
        getRevenueandNumberofAppointment: action.payload,
      };
    case GET_REVENUE_APPOINTMENT_DAY:
      return {
        ...state,
        getRevenueofAppointmentDaybyDay: action.payload,
      };
    case GET_SALON_EMPLOYEE:
      return {
        ...state,
        getSalonByEmployeeId: action.payload,
      };
    case GET_SCHEDULE_EMPLOYEE:
      return {
        ...state,
        getScheduleByEmployeeId: action.payload,
      };
    case GET_SCHEDULE_EMPLOYEE_TODAY:
      return {
        ...state,
        getScheduleTodayByEmployeeId: action.payload,
      };
    case GET_SERVICE_EMPLOYEE:
      return {
        ...state,
        getServiceHairByEmployeeId: action.payload,
      };
    case GET_SCHEDULE_BUSY_EMPLOYEE:
      return {
        ...state,
        getBusyScheduleEmployee: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
