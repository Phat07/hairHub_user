import { API } from "./api";

export const notificationService = {
  createNotification(data, id) {
    return API.post(`/notifications/CreateNotification/${id}`, data);
  },
  getNotification(id, page, size) {
    return API.get(`/notifications/GetNotification/${id}`, {
      params: {
        page,
        size,
      },
    });
  },
  updateNotification(id) {
    return API.put(`/notifications/ReadedNotification/${id}`);
  },
  getNotificationUnreadNumber(id){
    return API.get(`/notifications/CountNumberUnreadNotification/${id}`);
  }
};
