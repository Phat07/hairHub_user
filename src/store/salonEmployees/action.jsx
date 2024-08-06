import { message } from "antd";
import { SalonInformationServices } from "../../services/salonInformationServices";
import { SalonEmployeesServices } from "../../services/salonEmployeesServices";
import { ServiceHairServices } from "../../services/servicesHairServices";

export const CREATE_SALON_INFORMATION = "CREATE_SALON_INFORMATION";
export const GET_ALL_EMPLOYEE = "GET_ALL_EMPLOYEE";
export const GET_ALL_SERVICE = "GET_ALL_SERVICE";
export const postCreateSalonEmployees = (list) => {
  return {
    type: CREATE_SALON_INFORMATION,
    payload: list,
  };
};
export const getAllEmployee = (list, totalPages) => {
  return {
    type: GET_ALL_EMPLOYEE,
    payload: { list: list, totalPages: totalPages },
  };
};
export const getAllService = (list, totalPages) => {
  return {
    type: GET_ALL_SERVICE,
    payload: { list: list, totalPages: totalPages },
  };
};

export function actGetAllServicesBySalonId(id, currentPage, pageSize) {
  return (dispatch) => {
    ServiceHairServices.getServiceHairBySalonInformationId(id, currentPage, pageSize)
      .then((res) => {
        console.log("res",res);
        
        dispatch(getAllService(res?.data?.items, res?.data?.totalPages));
      })
      .catch((err) => console.log(err, "errors"));
  };
}
export function actPostCreateSalonService(data, id) {
  return (dispatch) => {
    ServiceHairServices.createServiceHair(data)
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          message.success("Thêm dịch vụ thành công!");
          dispatch(actGetAllServicesBySalonId(id));
        } else {
          message.error("Dịch vụ chưa được tạo!");
        }
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        // console.error("Error while fetching all config money:", error);
      });
  };
}
export function actGetAllEmployees(id, currentPage, pageSize) {
  return (dispatch) => {
    SalonEmployeesServices.getSalonEmployeeBySalonInformationId(
      id,
      currentPage,
      pageSize
    )
      .then((res) => {
        dispatch(getAllEmployee(res?.data?.items, res?.data?.totalPages));
      })
      .catch((err) => console.log(err, "errors"));
  };
}

export function actPostCreateSalonEmployees(data, id) {
  return (dispatch) => {
    SalonEmployeesServices.createSalonEmployees(data)
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          message.success("Thêm nhân viên thành công!");
          dispatch(actGetAllEmployees(id));
        } else {
          message.error("Nhân viên chưa được thêm!");
        }
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        // console.error("Error while fetching all config money:", error);
      });
  };
}
