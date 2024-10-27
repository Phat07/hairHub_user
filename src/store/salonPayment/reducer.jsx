import {
  GET_ALL_PAYMENT_SALON,
  ACT_ALL_PAYMENTP_HISTORY,
  ACT_ALL_PAYMENTP_REPORT,
  ACT_ALL_PAYMENTP_REPORT_ID,
} from "./action";

const initialState = {
  getPaymentSalon: [],
  paymentHistory: [],
  paymentReport: [],
  paymentReportById: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_PAYMENT_SALON:
      return {
        ...state,
        getPaymentSalon: action.payload,
      };
    case ACT_ALL_PAYMENTP_HISTORY:
      return {
        ...state,
        paymentHistory: action.payload,
      };
    case ACT_ALL_PAYMENTP_REPORT:
      return {
        ...state,
        paymentReport: action.payload,
      };
    case ACT_ALL_PAYMENTP_REPORT_ID:
      return {
        ...state,
        paymentReportById: action.payload,
      };

    default:
      return state;
  }
};

export default reducer;
