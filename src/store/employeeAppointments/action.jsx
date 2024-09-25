import { message } from "antd";
import { AppointmentService } from "../../services/appointmentServices";

export const APPOINTMENT_SUCCESS = "APPOINTMENT_SUCCESS";

export const allEmployeeAppoinmentByStatus = (list, totalPages) => {
  return {
    type: APPOINTMENT_SUCCESS,
    payload: { list: list, totalPages: totalPages },
  };
};

export function actGetAppointmentByEmployeeId(
  employeeId,
  page,
  size,
  status,
  isAscending,
  date,
  customerName
) {
  return async (dispatch) => {
    try {
      const response = await AppointmentService.GetAppointmentEmployeeByStatus(
        employeeId,
        page,
        size,
        status,
        isAscending,
        date,
        customerName
      );
      if (response.status === 200 || response.status === 201) {
        dispatch(
          allEmployeeAppoinmentByStatus(
            response.data.items,
            response.data.totalPages
          )
        );
      } else {
        message.error("No employee appointment!!!!");
      }
    } catch (error) {
      console.error(
        "Error while fetching employee appointment by status:",
        error
      );
    }
  };
}
