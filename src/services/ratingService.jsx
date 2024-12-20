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
  GetFeedbackFromSalonOwner(
    salonId,
    page,
    size,
    rating,
    serviceName,
    dateFeedback
  ) {
    return API.get(`/feedbacks/GetFeedbackFromSalonOwner/${salonId}`, {
      params: {
        page,
        size,
        rating,
        serviceName,
        dateFeedback,
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
