import { API } from "./api";

export const RatingService = {
  creatFeedback(data) {
    return API.post("/feedbacks/CreateFeedback", data);
  },
  GetFeedbackBySalonId(salonId, page, size, rating) {
    return API.get(`/feedbacks/GetFeedBackBySalonId/${salonId}`, {
      params: {
        page,
        size,
        rating,
      },
    });
  },
  GetFeedBackByCustomerId(customerId, page, size) {
    return API.get(`/feedbacks/GetFeedBackByCustomerId/${customerId}`, {
      params: {
        page,
        size,
      },
    });
  },
};
