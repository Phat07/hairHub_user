import { message } from "antd";
import { SalonInformationServices } from "../../services/salonInformationServices";

export const CREATE_SALON_INFORMATION = "CREATE_SALON_INFORMATION";
export const GET_SALON_OWNERID = "GET_SALON_OWNERID";
export const GET_ALL_SALON = "GET_ALL_SALON";
export const postCreateSalonInformation = (list) => {
  return {
    type: CREATE_SALON_INFORMATION,
    payload: list,
  };
};
export const getSalonInformationByOwnerId = (list) => {
  return {
    type: GET_SALON_OWNERID,
    payload: list,
  };
};
export const getAllSalonInformation = (list) => {
  return {
    type: GET_ALL_SALON,
    payload: list,
  };
};

export function actGetSalonInformationByOwnerId(id) {
  return async (dispatch) => {
    const result = SalonInformationServices.getSalonInformationByOwnerId(id);
    await result
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          console.log("ressData", response);
          dispatch(getSalonInformationByOwnerId(response.data));
        } else {
          message.error("Can't get salon by Owner id!!!");
        }
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        console.error("Error while fetching all config money:", error);
      });
  };
}

export function actGetAllSalonInformation() {
  return async (dispatch) => {
    const result = SalonInformationServices.getAllSalonInformation();
    await result
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          dispatch(getAllSalonInformation(response.data.items));
        } else {
          message.error("Can't get salon!!!");
        }
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        console.error("Error while fetching all config money:", error);
      });
  };
}

export function actPostCreateSalonInformation(data) {
  return (dispatch) => {
    SalonInformationServices.createSalonInformation(data)
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          console.log();
          message.success("Create salon information successfully");
          dispatch(postCreateSalonInformation(response.data));
        } else {
          message.error("No create salon information!!!!");
        }
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        console.error("Error while fetching all config money:", error);
      });
  };
}
