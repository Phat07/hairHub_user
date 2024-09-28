import { message } from "antd";
import { SalonInformationServices } from "../../services/salonInformationServices";
import { SalonEmployeesServices } from "../../services/salonEmployeesServices";
import { ServiceHairServices } from "../../services/servicesHairServices";
import { SchedulesService } from "@/services/schedulesServices";

export const CREATE_SALON_INFORMATION = "CREATE_SALON_INFORMATION";
export const GET_ALL_EMPLOYEE = "GET_ALL_EMPLOYEE";
export const GET_ALL_SERVICE = "GET_ALL_SERVICE";
export const GET_ALL_SERVICE_NOT = "GET_ALL_SERVICE_NOT";
export const GET_EMPLOYEE_ID = "GET_EMPLOYEE_ID";
export const GET_SALON_SERVICE_ID = "GET_SALON_SERVICE_ID";

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
export const getSalonEmployeeByid = (list) => {
  return {
    type: GET_EMPLOYEE_ID,
    payload: list,
  };
};
export const getSalonEmployeeServiceByid = (list) => {
  return {
    type: GET_SALON_SERVICE_ID,
    payload: list,
  };
};
export function actGetSalonEmployeeById(id) {
  return (dispatch) => {
    SalonEmployeesServices.getSalonEmployeeById(id)
      .then((res) => {
        dispatch(getSalonEmployeeByid(res?.data));
      })
      .catch((err) => console.log(err, "errors"));
  };
}
export function actGetSalonEmployeeServiceById(id) {
  return (dispatch) => {
    ServiceHairServices.getServiceHairBySalonNotPaging(id)
      .then((res) => {
        dispatch(getSalonEmployeeServiceByid(res?.data));
      })
      .catch((err) => console.log(err, "errors"));
  };
}
export function actPutSalonEmployeeServiceById(id, data) {
  return async (dispatch) => {
    try {
      const res = await ServiceHairServices.putServiceForEmployee(id, data);
      dispatch(actGetSalonEmployeeById(id));
      return res; // Trả về kết quả sau khi cập nhật dịch vụ
    } catch (error) {
      console.error("Error updating service for employee:", error);
      throw error; // Re-throw the error for further handling if needed
    }
  };
}

export function actPutSalonEmployeeById(id, data) {
  return async (dispatch) => {
    try {
      const res = await SchedulesService.putSchedulesEmployee(id, data);
      dispatch(actGetSalonEmployeeById(id));
      return res;
    } catch (err) {
      console.log(err, "errors");
      throw err; // Ném lỗi để xử lý ở bên ngoài nếu cần
    }
  };
}

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
    return ServiceHairServices.createServiceHair(data)
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          // message.success("Thêm dịch vụ thành công!");
          dispatch(actGetAllServicesBySalonId(id, 1, 4));
        } else {
          // message.error("Dịch vụ chưa được tạo!");
        }
        return response; // Return the response for chaining
      })
      .catch((error) => {
        // message.error("Có lỗi xảy ra khi tạo dịch vụ!");
        throw error; // Throw the error so it can be caught later
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
    return SalonEmployeesServices.getSalonEmployeeBySalonInformationId(
      id,
      currentPage,
      pageSize,
      orderByName,
      isActive,
      nameEmployee
    )
      .then((res) => {
        if (res && res.data) {
          dispatch(getAllEmployee(res.data.items, res.data.total));
        } else {
          console.error("No data received:", res);
        }
        return res; // Trả về phản hồi để có thể sử dụng .then()
      })
      .catch((err) => {
        console.error("Error fetching employees:", err);
        // Có thể hiển thị thông báo lỗi nếu cần
        // message.error("Nhân viên chưa được thêm!");
        throw err; // Ném lỗi để có thể xử lý bên ngoài nếu cần
      });
  };
}


export const actDeleteEmployee = (employeeId, salonId) => {
  return (dispatch) => {
    SalonEmployeesServices.deleteSalonEmployeeById(employeeId)
      .then(() => {
        message.success("Employee was deleted!");
        dispatch(actGetAllEmployees(salonId, 1, 4));
      })
      .catch((error) => {});
  };
};

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

export function actPutUpdateSalonEmployees(id, data) {
  return async (dispatch) => {
    try {
      const response = await SalonEmployeesServices.updateEmployeeById(
        id,
        data
      );

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
