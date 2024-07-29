import { GET_ALL_REPORT_CUSTOMER, GET_ALL_REPORT_SALON } from "./action";

const initialState = {
  getReportCustomer: [],
  getReportSalon: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_REPORT_CUSTOMER:
      return {
        ...state,
        getReportCustomer: action.payload,
      };

    case GET_ALL_REPORT_SALON:
      return {
        ...state,
        getReportSalon: action.payload,
      };

    default:
      return state;
  }
};

export default reducer;
