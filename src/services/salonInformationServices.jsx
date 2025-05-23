import { API } from "./api";
const token = localStorage.getItem("accessToken");
export const SalonInformationServices = {
  createSalonInformation(data) {
    return API.post("/saloninformations/CreateSalonInformation/", data);
  },
  createSalonImages(id, data) {
    return API.post(`/saloninformations/AddSalonInformationImages/${id}`, data);
  },
  deleteImagesSalon(data) {
    return API.post(`/saloninformations/DeleteSalonInformationImages/`, data);
  },

  getAllSalonInformation(page, size) {
    return API.get("/saloninformations/GetAllSalonInformation", {
      params: {
        page,
        size,
      },
    });
  },
  getAllSalonSuggestionInformation() {
    return API.get("/saloninformations/GetAllSalonInformation");
  },
  getAllSalonSuggestionInformationVer2() {
    return API.get("/saloninformations/GetSalonSuggestion");
  },

  getAllSalonInformationNotPaging() {
    return API.get("/saloninformations/GetAllSalonInformationNoPaging");
  },
  getAllSalonInformationByAddressOrSalonName(
    serviceName,
    salonAddress,
    salonName,
    latitude,
    longtitude,
    distance,
    page,
    size
  ) {
    return API.get("/saloninformations/GetSalonByServiceNameAddress", {
      params: {
        serviceName,
        salonAddress,
        salonName,
        latitude,
        longtitude,
        distance,
        page,
        size,
      },
    });
  },
  getSalonInformationById(id) {
    return API.get(`/saloninformations/GetSalonInformationById/${id}`);
  },
  getSalonInformationByOwnerId(ownerId) {
    return API.get(
      `/saloninformations/GetSalonInformationByOwnerId/${ownerId}`
    );
  },
  getGetAvailableTime(data) {
    return API.post(`/appointments/GetAvailableTime`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  getBookAppointment(data) {
    return API.post(`/appointments/BookAppointment`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  putSalonById(id, data) {
    return API.put(`/saloninformations/UpdateSalonInformation/${id}`, data);
  },
  putSalonScheduleById(id, data) {
    return API.put(`/schedules/UpdateScheduleofSalon/ ${id}`, data);
  },
  getImagesForSalon(id, page, size) {
    return API.get(`/saloninformations/GetSalonInformationImages/${id}`, {
      params: {
        page: page,
        size: size,
      },
    });
  },
};
