import { GET_NOTIFICATION } from "./action";

const initialState = {
  notificationList: [],
  newNoti: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_NOTIFICATION:
      return {
        ...state,
        notificationList: action.payload,
        newNoti: true,
      };
    default:
      return state;
  }
};

export default reducer;
