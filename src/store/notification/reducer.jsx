import { GET_NOTIFICATION, GET_NOTIFICATION_UNREAD } from "./action";

const initialState = {
  notificationList: [],
  notificationListUnread: 0,
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
    case GET_NOTIFICATION_UNREAD:
      return {
        ...state,
        notificationListUnread: action.payload,
        newNoti: true,
      };

    default:
      return state;
  }
};

export default reducer;
