import dayjs from "dayjs";
import {
  ALL_SALON_OWNER,
  APPOINTMENT_FAILURE,
  APPOINTMENT_REQUEST,
  APPOINTMENT_SUCCESS,
  UPDATE_APPOINTMENT_SUCCESS,
} from "./action";

const initialState = {
  appointment: [],
  loading: false,
  error: null,
  salonInformationByOwnerId: {},
  totalPages: 1,
  total:0,
};

const appointmentReducer = (state = initialState, action) => {
  switch (action.type) {
    case APPOINTMENT_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case APPOINTMENT_SUCCESS:
      // tui muốn nếu action.payload.items[0].status ==='BOOKING' thì sẽ copy mãng cũ và thêm cho mỗi object 1 isBefore là true
      // return {
      //   ...state,
      //   loading: false,
      //   appointment: action.payload.items,
      // };
      return {
        ...state,
        totalPages: action.payload.totalPages,
        total: action.payload.total,
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
    case APPOINTMENT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case UPDATE_APPOINTMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        appointment: action.payload,
      };
    case ALL_SALON_OWNER:
      return {
        ...state,
        loading: false,
        salonInformationByOwnerId: action.payload,
      };
    default:
      return state;
  }
};

export default appointmentReducer;
