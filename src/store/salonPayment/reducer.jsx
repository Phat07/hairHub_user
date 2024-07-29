import { GET_ALL_PAYMENT_SALON } from "./action";

const initialState = {
  getPaymentSalon: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_PAYMENT_SALON:
      return {
        ...state,
        getPaymentSalon: action.payload,
      };

    default:
      return state;
  }
};

export default reducer;
