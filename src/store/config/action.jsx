import { message } from "antd";
import { SalonInformationServices } from "../../services/salonInformationServices";
import { AppointmentService } from "../../services/appointmentServices";
import { ReportService } from "../../services/reportService";
import { GetAppointmentSalonByStatus } from "../salonAppointments/action";
import { RatingService } from "../../services/ratingService";
import { actGetAllAppointmentHistoryByCustomerId } from "../customerAppointments/action";
import { ConfigService } from "../../services/configServices";

export const GET_ALL_CONFIG = "GET_ALL_CONFIG";
export const GET_ALL_CONFIG_OWNERID = "GET_ALL_CONFIG_OWNERID";
export const getAllConfigPayment = (list) => {
  return {
    type: GET_ALL_CONFIG,
    payload: { list: list.items, totalPages: list.totalPages },
  };
};
export const getAllConfigPaymentByOwnerId = (list) => {
  return {
    type: GET_ALL_CONFIG_OWNERID,
    payload: { list: list.items, totalPages: list.totalPages },
  };
};

export function actGetAllConfig(page, size) {
  return async (dispatch) => {
    const result = ConfigService.GetAllConfig(page, size);
    await result
      .then((response) => {
        console.log("responeFeedback", response.data);
        if (response.status === 200 || response.status === 201) {
          dispatch(getAllConfigPayment(response.data));
        } else {
          // message.error("No feedback for salon!!!!");
        }
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        // console.error("feedback:", error);
      });
  };
}

export function actGetAllPaymentList(id, page, size) {
  return async (dispatch) => {
    const result = ConfigService.GetAllPaymentByOwnerId(id, page, size);
    await result
      .then((response) => {
        console.log("responePaymentOwnerId", response.data);
        if (response.status === 200 || response.status === 201) {
          dispatch(getAllConfigPaymentByOwnerId(response.data));
        } else {
          // message.error("");
        }
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        // console.error("error:", error);
      });
  };
}
