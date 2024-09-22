import { message } from "antd";
import { employeeService } from "../../services/employeeService";

export const GET_RATE_APPOINTMENT = "GET_RATE_APPOINTMENT";
export const GET_NUMBER_APPOINTMENT = "GET_NUMBER_APPOINTMENT";
export const GET_REVENUE_APPOINTMENT = "GET_REVENUE_APPOINTMENT";
export const GET_SALON_EMPLOYEE = "GET_SALON_EMPLOYEE";
export const GET_SCHEDULE_EMPLOYEE = "GET_SCHEDULE_EMPLOYEE";
export const GET_SERVICE_EMPLOYEE = "GET_SERVICE_EMPLOYEE";
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
export const getServiceHairByEmployeeId = (list) => {
  return {
    type: GET_SERVICE_EMPLOYEE,
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

export function actGetServiceHairByEmployeeId(id, page, size) {
  return async (dispatch) => {
    const result = employeeService.GetServiceHairByEmployeeId(id, page, size);
    await result
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          dispatch(getServiceHairByEmployeeId(response.data));
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
