import { message } from "antd";
import { AppointmentService } from "../../services/appointmentServices";

export const APPOINTMENT_REQUEST = "APPOINTMENT_REQUEST";
export const APPOINTMENT_SUCCESS = "APPOINTMENT_SUCCESS";
export const APPOINTMENT_FAILURE = "APPOINTMENT_SUCCESS";
export const UPDATE_APPOINTMENT_SUCCESS = "UPDATE_APPOINTMENT_SUCCESS";
export const UPDATE_APPOINTMENT_FAILURE = "UPDATE_APPOINTMENT_FAILURE";

export const ALL_SALON_OWNER = "ALL_SALON_OWNER";

export const allSalonByOwnerId = (list) => {
  return {
    type: ALL_SALON_OWNER,
    payload: list,
  };
};

export const allSalonAppoinmentByStatus = (list, totalPages) => {
  return {
    type: APPOINTMENT_SUCCESS,
    payload: { list: list, totalPages: totalPages },
  };
};

export const GetAppointmentSalonByStatus =
  (page, size, salonId, status) => async (dispatch) => {
    dispatch({ type: APPOINTMENT_REQUEST });
    try {
      const response = await AppointmentService.GetAppointmentSalonByStatus(
        page,
        size,
        salonId,
        status
      );
      dispatch({ type: APPOINTMENT_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({ type: APPOINTMENT_FAILURE, payload: error.message });
      console.log("error GetAppointmentSalonByStatus", error);
    }
  };

// export function actGetAppointmentBySalonId(salonId, page, size, status) {
//   return async (dispatch) => {
//     const result = await AppointmentService.GetAppointmentSalonByStatus(
//       salonId,
//       page,
//       size,
//       status
//     );
//     await result
//       .then((response) => {
//         if (response.status === 200 || response.status === 201) {
//           dispatch(
//             allSalonAppoinmentByStatus(
//               response.data.items,
//               response.data.totalPages
//             )
//           );
//         } else {
//           message.error("No salon appointment!!!!");
//         }
//       })
//       .catch((error) => {
//         // Xử lý lỗi nếu có
//         console.error(
//           "Error while fetching salon appointment by status:",
//           error
//         );
//       });
//   };
// }
export function actGetAppointmentBySalonId(salonId, page, size, status) {
  return async (dispatch) => {
    try {
      const response = await AppointmentService.GetAppointmentSalonByStatus(
        salonId,
        page,
        size,
        status
      );
      if (response.status === 200 || response.status === 201) {
        dispatch(
          allSalonAppoinmentByStatus(
            response.data.items,
            response.data.totalPages
          )
        );
      } else {
        message.error("No salon appointment!!!!");
      }
    } catch (error) {
      console.error("Error while fetching salon appointment by status:", error);
    }
  };
}

export const UpdateAppointment = (id, data) => async (dispatch) => {
  try {
    const response = await AppointmentService.UpdateAppointment(id, data);
    dispatch({ type: UPDATE_APPOINTMENT_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: UPDATE_APPOINTMENT_FAILURE, payload: error.message });
    console.error("Update appointment error:", error);
  }
};

export function actGetSalonInformationByOwnerIdAsync(ownerId) {
  return (dispatch) => {
    AppointmentService.GetSalonInformationByOwnerId(ownerId)
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          dispatch(allSalonByOwnerId(response.data));
        } else {
          // toast.error("get all syllabus to fail");
          console.log("fail");
        }
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        console.error("Error while fetching all products:", error);
        // Nếu bạn muốn dispatch một action để xử lý lỗi, bạn có thể thực hiện ở đây
      });
  };
}
