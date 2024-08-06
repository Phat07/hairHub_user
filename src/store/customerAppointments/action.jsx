import { message } from "antd";
import { SalonInformationServices } from "../../services/salonInformationServices";
import { AppointmentService } from "../../services/appointmentServices";

export const GET_ALL_APPOINTMENT_CUSTOMER = "GET_ALL_APPOINTMENT_CUSTOMER";
export const GET_ALL_APPOINTMENT_HISTORY_CUSTOMER =
  "GET_ALL_APPOINTMENT_HISTORY_CUSTOMER";
export const GET_ALL_APPOINTMENT_REPORT = "GET_ALL_APPOINTMENT_REPORT";
export const getAllAppointmentByCustomerId = (list, totalPages) => {
  return {
    type: GET_ALL_APPOINTMENT_CUSTOMER,
    payload: { list: list, totalPages: totalPages },
  };
};
export const getAllAppointmentHistoryByCustomerId = (list) => {
  return {
    type: GET_ALL_APPOINTMENT_HISTORY_CUSTOMER,
    payload: list,
  };
};
export const getAllAppointmentByCustomerIdIsReport = (list) => {
  return {
    type: GET_ALL_APPOINTMENT_REPORT,
    payload: list,
  };
};
export function actGetAllAppointmentByCustomerId(id, page, size) {
  return async (dispatch) => {
    const result = AppointmentService.getAllAppointmentsByCustomerId(
      id,
      page,
      size
    );
    await result
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          console.log("ressData", response);
          dispatch(
            getAllAppointmentByCustomerId(
              response.data.items,
              response.data.totalPages
            )
          );
        } else {
          message.error("No create salon information!!!!");
        }
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        // console.error("Error while fetching all config money:", error);
      });
  };
}

export function actGetAllAppointmentHistoryByCustomerId(id, page, size) {
  return async (dispatch) => {
    const result = AppointmentService.getAllAppointmentsHistoryByCustomerId(
      id,
      page,
      size
    );
    await result
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          console.log("resHistory", response);
          dispatch(getAllAppointmentHistoryByCustomerId(response.data.items));
        } else {
          message.error("No create salon information!!!!");
        }
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        // console.error("Error while fetching all config money:", error);
      });
  };
}


export function actDeleteAppointmentByCustomerId(id, customerId) {
  return async (dispatch) => {
    const result = AppointmentService.deleteAppointmentCustomer(id, customerId);
    await result
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          console.log("ressData", response);
          dispatch(actGetAllAppointmentByCustomerId(customerId, 1, 5));
          dispatch(actGetAllAppointmentHistoryByCustomerId(customerId,1,5))
          message.success("Hủy lịch hẹn thành công");
        } else {
          message.error("Hủy lịch hẹn thất bại!!!");
        }
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        // console.error("Error while fetching all config money:", error);
      });
  };
}

