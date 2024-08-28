import { message } from "antd";
import { SalonInformationServices } from "../../services/salonInformationServices";
import { SalonEmployeesServices } from "../../services/salonEmployeesServices";
import { ServiceHairServices } from "../../services/servicesHairServices";

export const CREATE_SALON_INFORMATION = "CREATE_SALON_INFORMATION";
export const GET_ALL_EMPLOYEE = "GET_ALL_EMPLOYEE";
export const GET_ALL_SERVICE = "GET_ALL_SERVICE";
export const GET_ALL_SERVICE_NOT = "GET_ALL_SERVICE_NOT";
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
export const getAllServiceList = (list) => {
  return {
    type: GET_ALL_SERVICE_NOT,
    payload: list,
  };
};

export function actGetAllServicesBySalonId(
  id,
  currentPage,
  pageSize,
  search,
  filter,
  orderby
) {
  return (dispatch) => {
    ServiceHairServices.getServiceHairBySalonInformationId(
      id,
      currentPage,
      pageSize,
      search,
      filter,
      orderby
    )
      .then((res) => {
        dispatch(getAllService(res?.data?.items, res?.data?.total));
      })
      .catch((err) => console.log(err, "errors"));
  };
}
export function actGetAllServicesBySalonIdNoPaging(id) {
  return (dispatch) => {
    ServiceHairServices.getServiceHairBySalonNotPaging(id)
      .then((res) => {
        dispatch(getAllServiceList(res?.data));
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
          dispatch(actGetAllServicesBySalonId(id, 1, 4));
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
export function actGetAllEmployees(
  id,
  currentPage,
  pageSize,
  orderByName,
  isActive,
  nameEmployee
) {
  return (dispatch) => {
    SalonEmployeesServices.getSalonEmployeeBySalonInformationId(
      id,
      currentPage,
      pageSize,
      orderByName,
      isActive,
      nameEmployee
    )
      .then((res) => {
        dispatch(getAllEmployee(res?.data?.items, res?.data?.total));
      })
      .catch((err) => {
        // message.error("Nhân viên chưa được thêm!");
      });
  };
}

// export function actPostCreateSalonEmployees(data, id) {
//   return (dispatch) => {
//     SalonEmployeesServices.createSalonEmployees(data)
//       .then((response) => {
//         if (response.status === 200 || response.status === 201) {
//           message.success("Thêm nhân viên thành công!");
//           dispatch(actGetAllEmployees(id));
//         } else {
//           message.error("Nhân viên chưa được thêm!");
//         }
//       })
//       .catch((error) => {
//         // Xử lý lỗi nếu có
//         // console.error("Error while fetching all config money:", error);
//       });
//   };
// }
export function actPostCreateSalonEmployees(data, id) {
  return async (dispatch) => {
    try {
      const response = await SalonEmployeesServices.createSalonEmployees(data);

      if (response.status === 200 || response.status === 201) {
        await dispatch(actGetAllEmployees(id, 1, 4));
      }

      return response;
    } catch (error) {
      console.error("Error while creating salon employee:", error);
      throw error;
    }
  };
}
