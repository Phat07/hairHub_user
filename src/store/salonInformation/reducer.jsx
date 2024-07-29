import {
  CREATE_SALON_INFORMATION,
  GET_ALL_SALON,
  GET_SALON_OWNERID,
} from "./action";

const initialState = {
  salonInformation: {},
  getSalonByOwnerId: "",
  getAllSalon: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_SALON_INFORMATION:
      return {
        ...state,
        salonInformation: action.payload,
      };

    case GET_SALON_OWNERID:
      return {
        ...state,
        getSalonByOwnerId: action.payload,
      };

    case GET_ALL_SALON:
      return {
        ...state,
        getAllSalon: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
