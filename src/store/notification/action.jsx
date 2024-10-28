import { message } from "antd";
import { notificationService } from "../../services/notificationService";

export const GET_NOTIFICATION = "GET_NOTIFICATION";
export const GET_NOTIFICATION_UNREAD = "GET_NOTIFICATION_UNREAD";
export const UPDATE_NOTIFICATION = "UPDATE_NOTIFICATION";
export const POST_NOTIFICATION = "POST_NOTIFICATION";

export const getNotificationList = (list) => {
  return {
    type: GET_NOTIFICATION,
    payload: list,
  };
};
export const getNotificationUnreadList = (list) => {
  return {
    type: GET_NOTIFICATION_UNREAD,
    payload: list,
  };
};

export function actGetNotificationList(id, page, size) {
  return async (dispatch) => {
    const result = notificationService.getNotification(id, page, size);
    await result
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          dispatch(getNotificationList(response.data));
        } else {
          message.error("Lỗi lấy dữ liệu!!!!");
        }
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        console.error("Error while actGetNotificationList:", error);
      });
  };
}
export function actGetNotificationListUnread(id) {
  return async (dispatch) => {
    const result = notificationService.getNotificationUnreadNumber(id);
    await result
      .then((response) => {        
        if (response.status === 200 || response.status === 201) {
          dispatch(getNotificationUnreadList(response.data));
        } else {
          message.error("Lỗi lấy dữ liệu!!!!");
        }
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        console.error("Error while actGetNotificationList:", error);
      });
  };
}

export function actCreateNotificationList(data, id) {
  return async (dispatch) => {
    const result = notificationService.createNotification(data, id);
    await result
      .then((response) => {
        console.log('22',response);
        
        if (response.status === 200 || response.status === 201) {
          // dispatch(actGetNotificationList(id));
        } else {
          message.error("Lỗi lấy dữ liệu!!!!");
        }
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        console.error("Error while actCreateNotificationList:", error);
      });
  };
}

export function actUpdateNotificationList(idNoti, id, page, size) {
  return async (dispatch) => {
    const result = notificationService.updateNotification(idNoti);
    await result
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          dispatch(actGetNotificationList(id, page, size));
          dispatch(actGetNotificationListUnread(id))
        } else {
          message.error("Lỗi lấy dữ liệu!!!!");
        }
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        console.error("Error while actUpdateNotificationList:", error);
      });
  };
}
