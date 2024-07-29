import { GET_VOUCHER_SALONID, GET_VOUCHER_SALONID_NOT_PAGING } from "./action";

const initialState = {
  getVoucherBySalonId: [],
  totalPages: 0,
  getVoucherBySalonIdNotPaging: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_VOUCHER_SALONID:
      return {
        ...state,
        getVoucherBySalonId: action.payload.list,
        totalPages: action.payload.totalPages,
      };
    case GET_VOUCHER_SALONID_NOT_PAGING:
      return {
        ...state,
        getVoucherBySalonIdNotPaging: action.payload,
      };

    default:
      return state;
  }
};

export default reducer;
