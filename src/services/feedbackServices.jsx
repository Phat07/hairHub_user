import { API } from "./api";

export const FeedbackService = {
  GetFeedBackBySalonId(page, size, salonId) {
    return API.get(`/feedbacks/GetFeedBackBySalonId/${salonId}`, {
      params: {
        page,
        size,
      },
    });
  },
};
