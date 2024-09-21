import { API } from "./api";

export const SalonEmployeesServices = {
  createSalonEmployees(data) {
    return API.post("/salonemployees/CreateSalonEmployee", data);
  },
  getSalonEmployeeBySalonInformationId(
    salonId,
    page,
    size,
    orderByName,
    isActive,
    nameEmployee
  ) {
    return API.get(
      `/salonemployees/GetSalonEmployeeBySalonInformationId/${salonId}`,
      {
        params: {
          page,
          size,
          orderByName,
          isActive,
          nameEmployee,
        },
      }
    );
  },
  getSalonEmployeeById(id) {
    return API.get(`/salonemployees/GetSalonEmployeeById/${id}`);
  },
  updateEmployeeById(id, data) {
    return API.put(`/salonemployees/UpdateSalonEmployee/${id}`, data);
  },
  deleteSalonEmployeeById(id) {
    return API.put(`/salonemployees/DeleteSalonEmployee/${id}`);
  },
  activateEmployee(data) {
    return API.post("/salonemployees/CreateAccountEmployee", data);
  },
};
