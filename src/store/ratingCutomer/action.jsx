import { message } from "antd";
import { SalonInformationServices } from "../../services/salonInformationServices";
import { AppointmentService } from "../../services/appointmentServices";
import { ReportService } from "../../services/reportService";
import { GetAppointmentSalonByStatus } from "../salonAppointments/action";
import { RatingService } from "../../services/ratingService";
import { actGetAllAppointmentHistoryByCustomerId } from "../customerAppointments/action";

export const GET_ALL_FEEDBACK_BY_SALONID = "GET_ALL_FEEDBACK_BY_SALONID";
export const GET_FEEDBACK_BY_CUSTOMERID = "GET_FEEDBACK_BY_CUSTOMERID";

export const getAllFeedbackBySalonId = (list) => {
  return {
    type: GET_ALL_FEEDBACK_BY_SALONID,
    payload: {
      list: list.items,
      // totalPages: list.totalPages,
      totalPages: list.total,
    },
  };
};

export const getFeedbackByCustomerId = (list) => {
  return {
    type: GET_FEEDBACK_BY_CUSTOMERID,
    payload: {
      list: list.items,
      totalPages: list.totalPages,
    },
  };
};

export function actGetAllFeedbackBySalonId(id, page, size, rating) {
  return async (dispatch) => {
    try {
      const response = await RatingService.GetFeedbackBySalonId(
        id,
        page,
        size,
        rating
      );
      if (response.status === 200 || response.status === 201) {
        dispatch(getAllFeedbackBySalonId(response.data));
        return response; // Return the successful response
      } else {
        message.error("No feedback for salon!!!!");
        return response; // Optionally return the non-200/201 response as well
      }
    } catch (error) {
      return { error }; // Return the error object if an error occurs
    }
  };
}

export function actGetFeedBackByCustomerId(id, page, size) {
  return async (dispatch) => {
    const result = RatingService.GetFeedBackByCustomerId(id, page, size);
    await result
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          dispatch(getFeedbackByCustomerId(response.data));
        } else {
          message.error("No feedback for customer!!!!");
        }
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        console.error("feedback:", error);
      });
  };
}

// export function actCreateFeedbackCustomer(data, userIdCustomer) {
//   return async (dispatch) => {
//     try {
//       const response = await RatingService.creatFeedback(data);
//       if (response.status === 200 || response.status === 201) {
//         message.success("Đánh giá thành công");
//         dispatch(actGetAllAppointmentHistoryByCustomerId(userIdCustomer, 1, 5));
//       } else {
//         message.error("Báo cáo không thành công");
//       }
//     } catch (error) {
//       console.error("Error while creating report:", error);
//       message.error("Có lỗi xảy ra, vui lòng thử lại sau.");
//     }
//   };
// }
export function actCreateFeedbackCustomer(data, userIdCustomer) {
  return async (dispatch) => {
    try {
      const response = await RatingService.creatFeedback(data);

      if (response.status === 200 || response.status === 201) {
        message.success("Đánh giá thành công");
        dispatch(actGetAllAppointmentHistoryByCustomerId(userIdCustomer, 1, 5));
      } else {
        message.error("Đánh giá không thành công");
      }

      return response; // Return the response or any value you want to pass to then
    } catch (error) {
      console.error("Error while creating feedback:", error);
      message.error("Có lỗi xảy ra, vui lòng thử lại sau.");
      throw error; // Rethrow the error so the promise is rejected
    }
  };
}
