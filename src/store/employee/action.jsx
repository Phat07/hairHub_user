import { message } from "antd";
import { employeeService } from "../../services/employeeService";

export const GET_RATE_APPOINTMENT = "GET_RATE_APPOINTMENT";
export const GET_NUMBER_APPOINTMENT = "GET_NUMBER_APPOINTMENT";
export const GET_REVENUE_APPOINTMENT = "GET_REVENUE_APPOINTMENT";
export const GET_REVENUE_APPOINTMENT_DAY = "GET_REVENUE_APPOINTMENT_DAY";
export const GET_SALON_EMPLOYEE = "GET_SALON_EMPLOYEE";
export const GET_SCHEDULE_EMPLOYEE = "GET_SCHEDULE_EMPLOYEE";
export const GET_SCHEDULE_EMPLOYEE_TODAY = "GET_SCHEDULE_EMPLOYEE_TODAY";
export const GET_SERVICE_EMPLOYEE = "GET_SERVICE_EMPLOYEE";
export const GET_SCHEDULE_BUSY_EMPLOYEE = "GET_SCHEDULE_BUSY_EMPLOYEE";
export const getNumberAppointmentByStatus = (list) => {
  return {
    type: GET_NUMBER_APPOINTMENT,
    payload: list,
  };
};
export const getRateAppointmentByStatus = (list) => {
  return {
    type: GET_RATE_APPOINTMENT,
    payload: list,
  };
};
export const getRevenueandNumberofAppointment = (list) => {
  return {
    type: GET_REVENUE_APPOINTMENT,
    payload: list,
  };
};
export const getRevenueofAppointmentDaybyDay = (list) => {
  return {
    type: GET_REVENUE_APPOINTMENT_DAY,
    payload: list,
  };
};
export const getSalonByEmployeeId = (list) => {
  return {
    type: GET_SALON_EMPLOYEE,
    payload: list,
  };
};
export const getScheduleByEmployeeId = (list) => {
  return {
    type: GET_SCHEDULE_EMPLOYEE,
    payload: list,
  };
};
export const getScheduleTodayByEmployeeId = (list) => {
  return {
    type: GET_SCHEDULE_EMPLOYEE_TODAY,
    payload: list,
  };
};
export const getServiceHairByEmployeeId = (list) => {
  return {
    type: GET_SERVICE_EMPLOYEE,
    payload: list,
  };
};
export const getScheduleBusyByEmployeeId = (list) => {
  return {
    type: GET_SCHEDULE_BUSY_EMPLOYEE,
    payload: list,
  };
};

export function actGetNumberAppointmentByStatus(id, startdate, enddate) {
  return async (dispatch) => {
    const result = employeeService.NumberAppointmentByStatus(
      id,
      startdate,
      enddate
    );
    await result
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          dispatch(getNumberAppointmentByStatus(response.data));
        } else {
          message.error("Lỗi lấy dữ liệu!!!!");
        }
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        // console.error("Error while fetching all config money:", error);
      });
  };
}

export function actGetRateAppointmentByStatus(id, startdate, enddate) {
  return async (dispatch) => {
    const result = employeeService.RateAppointmentByStatus(
      id,
      startdate,
      enddate
    );
    await result
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          dispatch(getRateAppointmentByStatus(response.data));
        } else {
          message.error("Lỗi lấy dữ liệu!!!!");
        }
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        // console.error("Error while fetching all config money:", error);
      });
  };
}

export function actGetRevenueandNumberofAppointment(id, startdate, enddate) {
  return async (dispatch) => {
    const result = employeeService.RevenueandNumberofAppointment(
      id,
      startdate,
      enddate
    );
    await result
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          dispatch(getRevenueandNumberofAppointment(response.data));
        } else {
          message.error("Lỗi lấy dữ liệu!!!!");
        }
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        // console.error("Error while fetching all config money:", error);
      });
  };
}

export function actGetRevenueofAppointmentDaybyDay(id, startdate, enddate) {
  return async (dispatch) => {
    const result = employeeService.RevenueofAppointmentDaybyDay(
      id,
      startdate,
      enddate
    );
    await result
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          dispatch(getRevenueofAppointmentDaybyDay(response.data));
        } else {
          message.error("Lỗi lấy dữ liệu!!!!");
        }
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        // console.error("Error while fetching all config money:", error);
      });
  };
}

export function actPostSchedule(data, id) {
  return async (dispatch) => {
    const result = employeeService.PostBusySchedule(data, id);
    await result
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          return response;
          // dispatch(getRevenueofAppointmentDaybyDay(response.data));
        } else {
          message.error("Lỗi lấy dữ liệu!!!!");
        }
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        // console.error("Error while fetching all config money:", error);
      });
  };
}

export function actDeleteBusySchedule(id) {
  return async (dispatch) => {
    const result = employeeService.DeleteBusySchedule(id);
    await result
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          return response;
          // dispatch(getRevenueofAppointmentDaybyDay(response.data));
        } else {
          message.error("Lỗi lấy dữ liệu!!!!");
        }
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        // console.error("Error while fetching all config money:", error);
      });
  };
}

export function actUpdateBusySchedule(id, data) {
  return async (dispatch) => {
    const result = employeeService.UpdateBusySchedule(id, data);
    await result
      .then((response) => {
        console.log("response", response);

        if (response.status === 200 || response.status === 201) {
          return response;
          // dispatch(getRevenueofAppointmentDaybyDay(response.data));
        } else {
          message.error("Lỗi lấy dữ liệu!!!!");
        }
      })
      .catch((error) => {
        return error;
      });
  };
}

export function actGetSalonByEmployeeId(id) {
  return async (dispatch) => {
    const result = employeeService.GetSalonByEmployeeId(id);
    await result
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          dispatch(getSalonByEmployeeId(response.data));
        } else {
          message.error("Lỗi lấy dữ liệu!!!!");
        }
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        // console.error("Error while fetching all config money:", error);
      });
  };
}

export function actGetScheduleByEmployeeId(id) {
  return async (dispatch) => {
    const result = employeeService.GetScheduleByEmployeeId(id);
    await result
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          dispatch(getScheduleByEmployeeId(response.data));
        } else {
          message.error("Lỗi lấy dữ liệu!!!!");
        }
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        // console.error("Error while fetching all config money:", error);
      });
  };
}


export function actGetScheduleTodayByEmployeeId(id, message) {
  return async (dispatch) => {
    try {
      const response = await employeeService.GetScheduleTodayByEmployeeId(id);

      if (response.status === 200 || response.status === 201) {
        dispatch(getScheduleTodayByEmployeeId(response.data));
      } else {
        message.error("Lỗi lấy dữ liệu!!!!");
      }
    } catch (error) {;
      message.error("Đã xảy ra lỗi. Vui lòng thử lại sau!");
    }
  };
}

export function actGetServiceHairByEmployeeId(
  id,
  page,
  size,
  search,
  filter,
  orderby
) {
  return async (dispatch) => {
    const result = employeeService.GetServiceHairByEmployeeId(
      id,
      page,
      size,
      search,
      filter,
      orderby
    );
    await result
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          dispatch(getServiceHairByEmployeeId(response.data));
          return response;
        } else {
          message.error("Lỗi lấy dữ liệu!!!!");
        }
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        // console.error("Error while fetching all config money:", error);
      });
  };
}

export function actGetBusyScheduleEmployee(id, date) {
  return async (dispatch) => {
    const result = employeeService.GetBusyScheduleEmployee(id, date);
    await result
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          dispatch(getScheduleBusyByEmployeeId(response.data));
        } else {
          message.error("Lỗi lấy dữ liệu!!!!");
        }
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        // console.error("Error while fetching all config money:", error);
      });
  };
}

// export function actPutSalonEmployeeById(id, data) {
//   return async (dispatch) => {
//     try {
//       const res = await SchedulesService.putSchedulesEmployee(id, data);
//       dispatch(actGetSalonEmployeeById(id));
//       return res;
//     } catch (err) {
//       console.log(err, "errors");
//       throw err; // Ném lỗi để xử lý ở bên ngoài nếu cần
//     }
//   };
// }
