import { API } from "./api";

export const SalonEmployeesServices = {
  createSalonEmployees(data) {
    return API.post("/salonemployees/CreateSalonEmployee", data);
  },
  getSalonEmployeeBySalonInformationId(salonId) {
    return API.get(
      `/salonemployees/GetSalonEmployeeBySalonInformationId/${salonId}`
    );
  },
  getSalonEmployeeById(id) {
    return API.get(`/salonemployees/GetSalonEmployeeById/${id}`);
  },
};
