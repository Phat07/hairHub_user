import { CONFIG_ID, GET_ALL_CONFIG, GET_ALL_CONFIG_OWNERID } from "./action";

const initialState = {
  getAllPackage: [],
  totalPages: 0,
  getAllPaymentList: [],
  totalPagesList: 0,
  configPaymentId: '',

};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_CONFIG:
      return {
        ...state,
        getAllPackage: action.payload.list,
        totalPages: action.payload.totalPages,
      };
    case GET_ALL_CONFIG_OWNERID:
      return {
        ...state,
        getAllPaymentList: action.payload.list,
        totalPagesList: action.payload.totalPages,
      };
      case CONFIG_ID:
        return {
          ...state,
          configPaymentId: action.payload,
        };
    default:
      return state;
  }
};

export default reducer;
