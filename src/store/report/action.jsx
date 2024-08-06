import { message } from "antd";
import { SalonInformationServices } from "../../services/salonInformationServices";
import { AppointmentService } from "../../services/appointmentServices";
import { ReportService } from "../../services/reportService";
import { GetAppointmentSalonByStatus } from "../salonAppointments/action";

export const GET_ALL_REPORT_CUSTOMER = "GET_ALL_REPORT_CUSTOMER";
export const GET_ALL_REPORT_SALON = "GET_ALL_REPORT_SALON";
export const getAllReportCustomer = (list) => {
  return {
    type: GET_ALL_REPORT_CUSTOMER,
    payload: list,
  };
};
export const getAllReportSalon = (list) => {
  return {
    type: GET_ALL_REPORT_SALON,
    payload: list,
  };
};
export function actGetAllReportCustomerId(id, page, size, status) {
  return async (dispatch) => {
    const result = ReportService.GetReportByCustomerId(id, page, size, status);
    await result
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          dispatch(getAllReportCustomer(response.data));
        } else {
          message.error("No report customer!!!!");
        }
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        // console.error("Error while fetching all config money:", error);
      });
  };
}
export function actGetAllReportSalonId(id, page, size, status) {
  return async (dispatch) => {
    const result = ReportService.GetReportBySalonId(id, page, size, status);
    await result
      .then((response) => {
        console.log("salonReporttt", response);
        if (response.status === 200 || response.status === 201) {
          dispatch(getAllReportSalon(response.data));
        } else {
          message.error("No report salon!!!!");
        }
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        // console.error("Error while fetching all config money:", error);
      });
  };
}

// export function actCreateReportCustomer(data) {
//   return async (dispatch) => {
//     const result = await ReportService.createReport(data)
//       .then((response) => {
//         if (response.status === 200 || response.status === 201) {
//           message.success("Xin hãy đợi báo cáo của bạn được duyệt");
//           dispatch(getAllReportCustomer(response.data));
//         } else {
//           message.error("Báo cáo không thành công");
//         }
//       })
//       .catch((error) => {
//         // Xử lý lỗi nếu có
//         console.error("Error while fetching all config money:", error);
//       });
//   };
// }
export function actCreateReportCustomer(data) {
  return async (dispatch) => {
    try {
      const response = await ReportService.createReport(data);
      
      if (response.status === 200 || response.status === 201) {
        message.success("Xin hãy đợi báo cáo của bạn được duyệt");
        dispatch(getAllReportCustomer(response.data));
      } else {
        message.error("Báo cáo không thành công");
      }
      
      return response; // Return the response or any other value you want
    } catch (error) {
      // console.error("Error while fetching all config money:", error);
      // throw error; 
    }
  };
}

export function actCreateReportSalon(data, id) {
  return async (dispatch) => {
    try {
      const response = await ReportService.createReport(data);
      if (response.status === 200 || response.status === 201) {
        message.success("Xin hãy đợi báo cáo của bạn được duyệt");
        dispatch(getAllReportSalon(response.data));
        dispatch(GetAppointmentSalonByStatus(1, 10, id));
      } else {
        message.error("Báo cáo không thành công");
      }
    } catch (error) {
      console.error("Error while creating report:", error);
      message.error("Có lỗi xảy ra, vui lòng thử lại sau.");
    }
  };
}
