import { message } from "antd";
import { SalonTransaction } from "../../services/salonTransaction";

export const GET_ALL_SALON_TRANSACTION = "GET_ALL_SALON_TRANSACTION";
export const GET_ALL_REVIEW_REVENUE = "GET_REVIEW_REVENUE";

export const getAllSalonTransaction = (list) => {
  return {
    type: GET_ALL_SALON_TRANSACTION,
    payload: list,
  };
};

export const getAllReviewRevenue = (list) => {
  return {
    type: GET_ALL_REVIEW_REVENUE,
    payload: list,
  };
};

export function actGetAppointmentTransaction(salonId, startDate, endDate) {
  return async (dispatch) => {
    const result = SalonTransaction.GetAppointmentTransaction(
      salonId,
      startDate,
      endDate
    );
    await result
      .then((response) => {
        // console.log("salonTransaction", response);
        if (response.status === 200 || response.status === 201) {
          dispatch(getAllSalonTransaction(response.data));
        } else {
          message.error("No salon transaction!!!!");
        }
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        console.error("Error while fetching all salon transaction:", error);
      });
  };
}

export function actGetReviewRevenue(salonId, startTime, endTime) {
  return async (dispatch) => {
    const result = SalonTransaction.GetReviewRevenue(
      salonId,
      startTime,
      endTime
    );
    await result
      .then((response) => {
        // console.log("salonTransaction", response);
        if (response.status === 200 || response.status === 201) {
          dispatch(getAllReviewRevenue(response.data));
        } else {
          message.error("No review revenue!!!!");
        }
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        console.error("Error while fetching all review revenue:", error);
      });
  };
}
