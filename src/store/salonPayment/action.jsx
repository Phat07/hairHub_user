import { message } from "antd";
import { SalonPayment } from "../../services/salonPayment";
import { actGetAllPaymentList } from "../config/action";

export const GET_ALL_PAYMENT_SALON = "GET_ALL_PAYMENT_SALON";

export const getAllPaymentSalon = (list) => {
  return {
    type: GET_ALL_PAYMENT_SALON,
    payload: list,
  };
};

export function actGetAllPaymentByOwnerId(id, page, size) {
  return async (dispatch) => {
    const result = SalonPayment.GetPaymentByOwnerId(id, page, size);
    await result
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          dispatch(getAllPaymentSalon(response.data));
        } else {
          message.error("No payment ownerId!!!!");
        }
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        console.error("Error while fetching all config money:", error);
      });
  };
}

export function actGetStatusPayment(data, ordercode, id) {
  return async (dispatch) => {
    try {
      const result = await SalonPayment.GetStatusPayment(data, ordercode);
      if (result.status === 200 || result.status === 201) {
        dispatch(actGetAllPaymentList(id, 1, 10));
      } else {
        message.error("No payment ownerId!!!!");
      }
      return result;
    } catch (error) {
      // Xử lý lỗi nếu có
      console.error("Error while fetching all config money:", error);
      throw error;
    }
  };
}

export function actCreatePaymentPackageByOwnerId(data) {
  return async (dispatch) => {
    const result = SalonPayment.createPaymentPackageByOwnerId(data);
    await result
      .then((response) => {
        console.log("resPayment", response);
        if (response.status === 200 || response.status === 201) {
          message.info("Vui lòng đợi trong giây lát...");
          const paymentLink = response.data.checkoutUrl;

          if (paymentLink) {
            window.location.href = paymentLink; // Chuyển hướng đến trang thanh toán
          } else {
            message.error("Không thể thanh toán");
          }
        } else {
          message.error("Chọn gói đăng ký không thành công!!!!");
        }
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        console.error("Error while fetching all config money:", error);
      });
  };
}
