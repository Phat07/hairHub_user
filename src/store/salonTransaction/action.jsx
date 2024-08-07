import { message } from "antd";
import { SalonTransaction } from "../../services/salonTransaction";

export const GET_ALL_SALON_TRANSACTION = "GET_ALL_SALON_TRANSACTION";

export const getAllSalonTransaction = (list) => {
  return {
    type: GET_ALL_SALON_TRANSACTION,
    payload: list,
  };
};

export function actGetAppointmentTransaction(salonId, numberOfDay) {
  return async (dispatch) => {
    const result = SalonTransaction.GetAppointmentTransaction(
      salonId,
      numberOfDay
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
