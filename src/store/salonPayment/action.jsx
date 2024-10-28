import { message } from "antd";
import { SalonPayment } from "../../services/salonPayment";
import { actGetAllPaymentList } from "../config/action";

export const GET_ALL_PAYMENT_SALON = "GET_ALL_PAYMENT_SALON";
export const ACT_ALL_PAYMENTP_HISTORY = "ACT_ALL_PAYMENTP_HISTORY";
export const ACT_ALL_PAYMENTP_REPORT = "ACT_ALL_PAYMENTP_REPORT";
export const ACT_ALL_PAYMENTP_REPORT_ID = "ACT_ALL_PAYMENTP_REPORT_ID";

export const getAllPaymentSalon = (list) => {
  return {
    type: GET_ALL_PAYMENT_SALON,
    payload: list,
  };
};
export function actGetAllPaymentsHistory(list) {
  return {
    type: ACT_ALL_PAYMENTP_HISTORY,
    payload: list,
  };
}
export function actGetAllPaymentsReport(list) {
  return {
    type: ACT_ALL_PAYMENTP_REPORT,
    payload: list,
  };
}
export function actGetAllPaymentsReportById(list) {
  return {
    type: ACT_ALL_PAYMENTP_REPORT_ID,
    payload: list,
  };
}

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
        // console.error("Error while fetching all config money:", error);
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
      // console.error("Error while fetching all config money:", error);
      // throw error;
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
        // console.error("Error while fetching all config money:", error);
      });
  };
}
export function GetPaymentHistoryTest(
  page,
  size,
  email,
  paymentType,
  status,
  payDate,
  accountId
) {
  return async (dispatch) => {
    try {
      const response = await SalonPayment.GetPaymentHistory(
        accountId,
        page,
        size,
        paymentType,
        status,
        payDate,
        email
      );
      console.log("ss",response?.data);
      
      dispatch(actGetAllPaymentsHistory(response.data));
      // return response
    } catch (error) {
      console.error("Failed to GetPaymentHistory:", error);
    }
  };
}
export function GetPaymentReport(accountId, page, size, createDate, status) {
  return async (dispatch) => {
    try {
      const response = await SalonPayment.GetPaymentReport(
        accountId,
        page,
        size,
        createDate,
        status
      );
      dispatch(actGetAllPaymentsReport(response.data));
    } catch (error) {
      console.error("Failed to GetPaymentReport:", error);
    }
  };
}
export function GetPaymentReportById(id) {
  return async (dispatch) => {
    try {
      const response = await SalonPayment.GetPaymentReportById(id);
      dispatch(actGetAllPaymentsReportById(response.data));
    } catch (error) {
      console.error("Failed to actGetAllPaymentsReportById:", error);
    }
  };
}
