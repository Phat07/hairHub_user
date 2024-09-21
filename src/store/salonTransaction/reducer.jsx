import { GET_ALL_REVIEW_REVENUE, GET_ALL_SALON_TRANSACTION } from "./action";

const initialState = {
  getSalonTransaction: [],
  getReviewRevenue: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_SALON_TRANSACTION:
      return {
        ...state,
        getSalonTransaction: action.payload,
      };
    case GET_ALL_REVIEW_REVENUE:
      return {
        ...state,
        getReviewRevenue: action.payload,
      };

    default:
      return state;
  }
};

export default reducer;
