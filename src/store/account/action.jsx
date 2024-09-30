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
        if (response.status === 200 || response.status === 201) {
          dispatch(LOGIN(response.data));
          let owner = response?.data?.salonOwnerResponse;
          let employee = response?.data?.salonEmployeeResponse;
          // if(response.data)
          if (owner) {
            navigate("/list_shop");
          } else if (employee) {
            navigate("/SalonEmployee");
          } else {
            navigate("/");
          }
          message.success("Đăng nhập thành công");
        } else if (response.status === 401) {
          // console.log('err',response);
          // message.error("Đăng nhập không thành công");
        }
      })
      .catch((error) => {
        message.error(error.response.data.message);
        // Xử lý lỗi nếu có
      });
  };
}

// export function refreshToken(data) {
//   return async (dispatch) => {
//     const result = AccountServices.refreshToken(data);
//     await result
//       .then((response) => {
//         if (response.status === 200 || response.status === 201) {
//           sessionStorage.setItem("refreshToken", response.data.accessToken);
//           sessionStorage.setItem("accessToken", response.data.refreshToken);
//           // dispatch(getAllConfigPaymentByOwnerId(response.data));
//         } else {
//           message.error("No payment for ownerId!!!!");
//         }
//       })
//       .catch((error) => {
//         // Xử lý lỗi nếu có
//         console.error("error:", error);
//       });
//   };
// }

export function fetchUserByTokenApi(data, navigate) {
  return async (dispatch) => {
    try {
      const response = await AccountServices.fetchUserByToken(data);
      if (response.status === 200 || response.status === 201) {
        dispatch(fetchUser(response.data));
      } else {
        message.error("Session hết hạn");
        navigate("/login");
      }
    } catch (error) {
      // message.error("Lỗi khi fetch user bằng token");
    }
  };
}
