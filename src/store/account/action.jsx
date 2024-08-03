import { message } from "antd";
import { ConfigService } from "../../services/configServices";
import { AccountServices } from "../../services/accountServices";

export const LOGIN_ACCOUNT = "LOGIN_ACCOUNT";
export const FETCH_USER = "FETCH_USER";
export const LOGIN = (list) => {
  return {
    type: LOGIN_ACCOUNT,
    payload: list,
  };
};
export const fetchUser = (list) => {
  return {
    type: FETCH_USER,
    payload: list,
  };
};

export function loginAccount(data, navigate) {
  return async (dispatch) => {

    const result = AccountServices.loginUser(data);
    await result
      .then((response) => {
        console.log("login", response.data);
        message.success("Đăng nhập thành công");
        // if (response.status === 200 || response.status === 201) {
        dispatch(LOGIN(response.data));
        navigate("/");
        // } else {
        //   message.error("Đăng nhập không thành công");
        // }
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        console.error("feedback:", error);
      });
  };
}

export function refreshToken(data) {
  return async (dispatch) => {
    const result = AccountServices.refreshToken(data);
    await result
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          sessionStorage.setItem("refreshToken", response.data.accessToken);
          sessionStorage.setItem("accessToken", response.data.refreshToken);
          // dispatch(getAllConfigPaymentByOwnerId(response.data));
        } else {
          message.error("No payment for ownerId!!!!");
        }
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        console.error("error:", error);
      });
  };
}

export function fetchUserByTokenApi(data) {
  return async (dispatch) => {
    const result = AccountServices.fetchUserByToken(data);
    await result
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          dispatch(fetchUser(response.data));
          // dispatch(getAllConfigPaymentByOwnerId(response.data));
        } else {
          message.error("Session hết hạn");
        }
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        console.error("error:", error);
      });
  };
}
