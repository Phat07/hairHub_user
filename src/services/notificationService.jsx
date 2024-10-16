import { API } from "./api";

export const notificationService = {
  createNotification(data) {
    return API.post("/notifications/CreateNotification", data);
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
};
