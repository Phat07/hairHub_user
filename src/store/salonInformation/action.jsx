import { message } from "antd";
import { SalonInformationServices } from "../../services/salonInformationServices";

export const CREATE_SALON_INFORMATION = "CREATE_SALON_INFORMATION";
export const GET_SALON_OWNERID = "GET_SALON_OWNERID";
export const GET_SALON_OWNERID_IMAGES = "GET_SALON_OWNERID_IMAGES";
export const GET_ALL_SALON = "GET_ALL_SALON";
export const GET_ALL_SALON_SUGGESTION = "GET_ALL_SALON_SUGGESTION";

export const postCreateSalonInformation = (list) => {
  return {
    type: CREATE_SALON_INFORMATION,
    payload: list,
  };
};
export const getSalonInformationByOwnerIdForImages = (list) => {
  return {
    type: GET_SALON_OWNERID_IMAGES,
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
          message.error("không thể lấy thông tin salon!!!");
        }
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        console.error("error", error);
      });
  };
}
export function actGetSalonInformationByOwnerIdForImages(id) {
  return async (dispatch) => {
    const result = SalonInformationServices.getImagesForSalon(id);
    await result
      .then((response) => {
        console.log("ré",response);
        
        if (response.status === 200 || response.status === 201) {
          dispatch(getSalonInformationByOwnerIdForImages(response.data.salonImages));
        } else {
          message.error("không thể lấy thông tin salon!!!");
        }
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        console.error("error", error);
      });
  };
}
export function actPostCreateImages(id, data) {
  return async (dispatch) => {
    try {
      const response = await SalonInformationServices.createSalonImages(
        id,
        data
      );
      if (response.status === 200 || response.status === 201) {
        dispatch(actGetSalonInformationByOwnerIdForImages(id));
        return response; // Return the response here
      } else {
        // Optionally handle non-success responses here
        return response; // Return the response even if status is not 200 or 201
      }
    } catch (error) {
      console.error("Error while creating salon information:", error);
      return { error }; // Return the error object
    }
  };
}
export function actPutSalonInformationByOwnerId(id, data, ownerId) {
  return async (dispatch) => {
    try {
      const response = await SalonInformationServices.putSalonById(id, data);

      if (response.status === 200 || response.status === 201) {
        dispatch(actGetSalonInformationByOwnerId(ownerId));
        return response; // Trả về kết quả nếu thành công
      } else {
        message.error("Không thể cập nhật salon!!!");
        return null; // Trả về null nếu không thành công
      }
    } catch (error) {
      console.error("Error updating salon information:", error);
      message.error("Đã xảy ra lỗi khi cập nhật thông tin salon");
      return null; // Trả về null khi có lỗi
    }
  };
}
export function actPutSalonScheduleByOwnerId(id, data, ownerId) {
  return async (dispatch) => {
    const response = await SalonInformationServices.putSalonScheduleById(
      id,
      data
    );

    if (response.status === 200 || response.status === 201) {
      dispatch(actGetSalonInformationByOwnerId(ownerId));
      return response; // Trả về kết quả nếu thành công
    } else {
      return null; // Trả về null nếu không thành công
    }
  };
}

export function actGetSalonInformationByOwnerIdByCheck(id, navigate) {
  return async (dispatch) => {
    const result = SalonInformationServices.getSalonInformationByOwnerId(id);
    await result
      .then((response) => {
        // if (response.status === 200 || response.status === 201) {
        dispatch(getSalonInformationByOwnerId(response.data));
        // } else {
        //   message.error("Không tìm thấy salon của bạn!!!");
        // }
      })
      .catch((error) => {
        navigate("/create_shop");
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

export function actPostCreateSalonInformation(id, data) {
  return async (dispatch) => {
    try {
      const response = await SalonInformationServices.createSalonInformation(
        data
      );
      if (response.status === 200 || response.status === 201) {
        dispatch(postCreateSalonInformation(response.data));
        dispatch(actGetSalonInformationByOwnerId(id));
        return response; // Return the response here
      } else {
        // Optionally handle non-success responses here
        return response; // Return the response even if status is not 200 or 201
      }
    } catch (error) {
      console.error("Error while creating salon information:", error);
      return { error }; // Return the error object
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
