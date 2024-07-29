import { GET_ALL_SALON_TRANSACTION } from "./action";

const initialState = {
  getSalonTransaction: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_SALON_TRANSACTION:
      return {
        ...state,
        getSalonTransaction: action.payload,
      };

    default:
      return state;
  }
};

export default reducer;
