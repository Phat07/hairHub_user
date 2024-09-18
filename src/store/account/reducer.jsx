import { FETCH_USER, LOGIN_ACCOUNT } from "./action";

const initialState = {
  idCustomer: "",
  idOwner: "",
  token: "",
  username: "",
  avatar: "",
  uid: "",
  idOwner: "",
  idCustomer: "",
  refreshToken: "",
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_ACCOUNT:
      localStorage.setItem("refreshToken", action.payload.refreshToken);
      localStorage.setItem("accessToken", action.payload.accessToken);

      return {
        ...state,
        token: action.payload.accessToken,
        username:
          action.payload?.salonOwnerResponse?.fullName ||
          action.payload?.customerResponse?.fullName,
        uid: action.payload.accountId,
        idOwner: action.payload?.salonOwnerResponse?.id,
        idCustomer: action.payload?.customerResponse?.id,
        refreshToken: action.payload.refreshToken,
      };

    case FETCH_USER:
      return {
        ...state,
        // token: action.payload.accessToken,
        username:
          action.payload?.salonOwnerResponse?.fullName ||
          action.payload?.customerResponse?.fullName,
        avatar:
          action.payload?.salonOwnerResponse?.img ||
          action.payload?.customerResponse?.img,
        uid: action.payload.accountId,
        idOwner: action.payload?.salonOwnerResponse?.id,
        idCustomer: action.payload?.customerResponse?.id,
        // refreshToken: action.payload.refreshToken,
      };

    default:
      return state;
  }
};

export default reducer;
