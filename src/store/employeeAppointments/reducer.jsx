import dayjs from "dayjs";
import { APPOINTMENT_SUCCESS } from "./action";

const initialState = {
  appointment: [],
  loading: false,
  error: null,
  totalPages: 1,
};

const appointmentReducer = (state = initialState, action) => {
  switch (action.type) {
    case APPOINTMENT_SUCCESS:
      return {
        ...state,
        totalPages: action.payload.totalPages,
        loading: false,
        appointment: action.payload.list.map((item) => {
          let isBefore = false;
          if (
            item.status === "BOOKING" ||
            item.status === "CANCEL_BY_CUSTOMER" ||
            item.status === "SUCCESSED"
          ) {
            isBefore = dayjs(item.appointmentDetails[0].endTime).isBefore(
              dayjs()
            );
          }
          return {
            ...item,
            isBefore: isBefore,
          };
        }),
      };
    default:
      return state;
  }
};

export default appointmentReducer;
