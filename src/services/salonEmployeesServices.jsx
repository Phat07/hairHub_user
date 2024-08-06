import { API } from "./api";

export const SalonEmployeesServices = {
  createSalonEmployees(data) {
    return API.post("/salonemployees/CreateSalonEmployee", data);
  },
  getSalonEmployeeBySalonInformationId(salonId, page, size) {
    return API.get(
      `/salonemployees/GetSalonEmployeeBySalonInformationId/${salonId}`, {
        params: {
          page,
          size
        },
      }
    );
  },
  getSalonEmployeeById(id) {
    return API.get(`/salonemployees/GetSalonEmployeeById/${id}`);
  },
};
