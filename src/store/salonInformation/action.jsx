import { message } from "antd";
import { SalonInformationServices } from "../../services/salonInformationServices";

export const CREATE_SALON_INFORMATION = "CREATE_SALON_INFORMATION";
export const GET_SALON_OWNERID = "GET_SALON_OWNERID";
export const GET_ALL_SALON = "GET_ALL_SALON";
export const GET_ALL_SALON_SUGGESTION = "GET_ALL_SALON_SUGGESTION";

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
export const getAllSalonSuggestionInformation = (list) => {
  return {
    type: GET_ALL_SALON_SUGGESTION,
    payload: list,
  };
};

export function actGetSalonInformationByOwnerId(id) {
  return async (dispatch) => {
    const result = SalonInformationServices.getSalonInformationByOwnerId(id);
    await result
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          dispatch(getSalonInformationByOwnerId(response.data));
        } else {
          message.error("Can't get salon by Owner id!!!");
        }
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        console.error("error", error);
      });
  };
}

export function actGetSalonInformationByOwnerIdByCheck(id, navigate) {
  return async (dispatch) => {
    const result = SalonInformationServices.getSalonInformationByOwnerId(id);
    await result
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          dispatch(getSalonInformationByOwnerId(response.data));
        } else {
          message.error("Không tìm thấy salon của bạn!!!");
        }
      })
      .catch((error) => {
        navigate('/create_shop')
        // Xử lý lỗi nếu có
        console.error("error", error);
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
        // console.error("Error while fetching all config money:", error);
      });
  };
}

export function actPostCreateSalonInformation(data) {
  return async (dispatch) => {
    try {
      const response = await SalonInformationServices.createSalonInformation(data);
      if (response.status === 200 || response.status === 201) {
        dispatch(postCreateSalonInformation(response.data));
      } else {
        // message.error("No create salon information!!!!");
      }
    } catch (error) {
      // message.error("An error occurred while creating salon information");
      // console.error("Error while creating salon information:", error);
    }
  };
}

export function actGetAllSalonSuggestionInformation() {
  return async (dispatch) => {
    const result = SalonInformationServices.getAllSalonSuggestionInformation();
    await result
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          dispatch(getAllSalonSuggestionInformation(response.data.items));
        } else {
          message.error("Không tìm thấy salon");
        }
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        // console.error("Error", error);
      });
  };
}
