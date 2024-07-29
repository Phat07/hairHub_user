import { API } from "./api";

export const SalonInformationServices = {
  createSalonInformation(data) {
    return API.post("/saloninformations/CreateSalonInformation/", data);
  },
  getAllSalonInformation(page, size) {
    return API.get("/saloninformations/GetAllSalonInformation", {
      params: {
        page,
        size,
      },
    });
  },
  getAllSalonInformationNotPaging() {
    return API.get("/saloninformations/GetAllSalonInformationNoPaging")
  },
  getAllSalonInformationByAddressOrSalonName(serviceName, salonAddress, salonName, page, size) {
    return API.get("/saloninformations/GetSalonByServiceNameAddress", {
      params: {
        serviceName,
        salonAddress,
        salonName,
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
};
