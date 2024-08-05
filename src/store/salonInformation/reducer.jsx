import {
  CREATE_SALON_INFORMATION,
  GET_ALL_SALON,
  GET_ALL_SALON_SUGGESTION,
  GET_SALON_OWNERID,
} from "./action";

const initialState = {
  getSalonSuggestion: [],
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
    case GET_ALL_SALON_SUGGESTION:
      return {
        ...state,
        getSalonSuggestion: action.payload,
      };

    default:
      return state;
  }
};

export default reducer;
