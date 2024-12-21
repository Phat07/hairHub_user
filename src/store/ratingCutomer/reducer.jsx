import {
  GET_ALL_FEEDBACK_BY_SALONID,
  GET_FEEDBACK_BY_CUSTOMERID,
  GET_ALL_FEEDBACK_FROM_SALON_OWNER,
} from "./action";

const initialState = {
  getAllFeedbackbySalonId: [],
  getAllFeedbackFromSalonOwner: [],
  getFeedbackbyCustomerId: [],
  totalPages: 0,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_FEEDBACK_BY_SALONID:
      return {
        ...state,
        getAllFeedbackbySalonId: action.payload.list,
        totalPages: action.payload.totalPages,
      };
    case GET_ALL_FEEDBACK_FROM_SALON_OWNER:
      return {
        ...state,
        getAllFeedbackFromSalonOwner: action.payload.list,
        totalPages: action.payload.totalPages,
      };
    case GET_FEEDBACK_BY_CUSTOMERID:
      return {
        ...state,
        getFeedbackbyCustomerId: action.payload.list,
        totalPages: action.payload.totalPages,
      };
    default:
      return state;
  }
};

export default reducer;
