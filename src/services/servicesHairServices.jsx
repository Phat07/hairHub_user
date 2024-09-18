import { API } from "./api";
const token = localStorage.getItem("accessToken");

export const ServiceHairServices = {
  getAllServiceHair(page, size) {
    return API.get("/servicehairs/GetAllServiceHair", {
      params: {
        page,
        size,
      },
    });
  },
  getServiceHairBySalonInformationId(
    salonId,
    page,
    size,
    search,
    filter,
    orderby
  ) {
    return API.get(`/servicehairs/GetServiceHairBySalonIdPaging/${salonId}`, {
      params: {
        page,
        size,
        search,
        filter,
        orderby,
      },
    });
  },
  getServiceHairBySalonNotPaging(salonId) {
    return API.get(
      `/servicehairs/GetServiceHairBySalonInformationId/${salonId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
  putServiceForEmployee(id, data) {
    return API.put(`/servicehairs/UpdateServicehairofEmployee/${id}`, data);
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
