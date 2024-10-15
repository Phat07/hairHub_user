import { GET_NOTIFICATION } from "./action";

const initialState = {
  notificationList: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_NOTIFICATION:
      return {
        ...state,
        notificationList: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
