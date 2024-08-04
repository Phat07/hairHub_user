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
          message.success("Đăng nhập thành công");
          navigate("/");
        } else {
          message.error("Đăng nhập không thành công");
        }
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        console.error("feedback:", error);
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
    const result = AccountServices.fetchUserByToken(data);
    await result
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          dispatch(fetchUser(response.data));
          // dispatch(getAllConfigPaymentByOwnerId(response.data));
        } else {
          message.error("Session hết hạn");
          // navigate("/login");
        }
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        console.error("error:", error);
      });
  };
}

// const refreshToken = async (navigate) => {
//   try {
//     const refreshToken = sessionStorage.getItem("refreshToken");
//     if (refreshToken) {
//       const res = await AccountServices.refreshToken(refreshToken);
//       if (res.data && res.data.accessToken) {
//         sessionStorage.setItem("accessToken", res.data.accessToken);
//         sessionStorage.setItem("refreshToken", res.data.refreshToken);
//         return res.data.accessToken;
//       } else {
//         throw new Error("Invalid response data");
//       }
//     } else {
//       // navigate("/login");
//       throw new Error("No refresh token found");
//     }
//   } catch (error) {
//     console.error("Error refreshing token:", error);
//     return null;
//   }
// };
// export function fetchUserByTokenApi(data, navigate) {
//   return async (dispatch) => {
//     try {
//       const response = await AccountServices.fetchUserByToken(data);
//       if (response.status === 200 || response.status === 201) {
//         dispatch(fetchUser(response.data));
//       } else {
//         throw new Error("Session expired");
//       }
//     } catch (error) {
//       console.error("Error fetching user by token:", error);
//       try {
//         const newAccessToken = await refreshToken(navigate);
//         if (newAccessToken) {
//           const retryResponse = await AccountServices.fetchUserByToken(
//             newAccessToken
//           );
//           if (retryResponse.status === 200 || retryResponse.status === 201) {
//             dispatch(fetchUser(retryResponse.data));
//           } else {
//             return;
//             throw new Error("Session expired after refresh");
//           }
//         } else {
//           return;
//           throw new Error("Failed to refresh token");
//         }
//       } catch (retryError) {
//         console.error("Retry error:", retryError);
//         message.error("Session hết hạn. Vui lòng đăng nhập lại.");
//         navigate("/login");
//       }
//     }
//   };
// }
