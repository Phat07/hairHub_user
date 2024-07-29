import { API } from "./api";

export const ServiceHairServices = {
  getAllServiceHair(page, size) {
    return API.get("/servicehairs/GetAllServiceHair", {
      params: {
        page,
        size,
      },
    });
  },
  getServiceHairBySalonInformationId(salonId) {
    return API.get(
      `/servicehairs/GetServiceHairBySalonInformationId/${salonId}`
    );
  },
  getServiceHairById(id) {
    return API.get(`/servicehairs/GetServiceHair/${id}`);
  },
  createServiceHair(data) {
    return API.post("/servicehairs/CreateServiceHair", data);
  },
  deleteServiceHairById(id) {
    return API.put(`/servicehairs/DeleteServiceHairById/${id}`);
  },
  updateServiceHairById(id, formData) {
    return API.put(`/servicehairs/UpdateServiceHair/${id}`, formData);
  },
};
