import { message } from "antd";
import { voucherServices } from "../../services/voucherServices";

export const GET_VOUCHER_SALONID = "GET_VOUCHER_SALONID";
export const GET_VOUCHER_SALONID_NOT_PAGING = "GET_VOUCHER_SALONID_NOT_PAGING";
export const getVoucherBySalonId = (list, totalPages) => {
  return {
    type: GET_VOUCHER_SALONID,
    payload: { list, totalPages },
  };
};
export const getVoucherBySalonIdNotPaging = (list) => {
  return {
    type: GET_VOUCHER_SALONID_NOT_PAGING,
    payload: list,
  };
};
// export function actGetVoucherBySalonId(
//   page,
//   size,
//   id,
//   search,
//   filter,
//   orderby
// ) {
//   return (dispatch) => {
//     voucherServices
//       .getVoucherBySalonId(page, size, id, search, filter, orderby)
//       .then((response) => {
//         if (response.status === 200 || response.status === 201) {
//           dispatch(
//             getVoucherBySalonId(response.data.items, response.data.total)
//           );
//           return response;
//         } else {
//           return response;
//         }
//       })
//       .catch((error) => {
//         // Xử lý lỗi nếu có
//         // console.error("Error while fetching all config money:", error);
//       });
//   };
// }
export function actGetVoucherBySalonId(
  page,
  size,
  id,
  search,
  filter,
  orderby
) {
  return (dispatch) => {
    return voucherServices
      .getVoucherBySalonId(page, size, id, search, filter, orderby)
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          dispatch(
            getVoucherBySalonId(response.data.items, response.data.total)
          );
          return response;
        } else {
          return response;
        }
      })
      .catch((error) => {
        // Handle error
        console.error("Error while fetching voucher:", error);
      });
  };
}

export function actGetVoucherBySalonIdNotPaging(id) {
  return (dispatch) => {
    voucherServices
      .getVoucherBySalonIdNotPaging(id)
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          dispatch(getVoucherBySalonIdNotPaging(response.data));
        } else {
          message.error("Do not have any voucher!!!");
        }
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        // console.error("Error while fetching all config money:", error);
      });
  };
}
