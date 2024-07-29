import { CREATE_SALON_INFORMATION, GET_ALL_EMPLOYEE, GET_ALL_SERVICE } from "./action";

const initialState = {
  salonEmployees: {},
  listEmployee:[],
  listService:[]
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_SALON_INFORMATION:
      return {
        ...state,
        salonEmployees: action.payload,
      };

    case GET_ALL_EMPLOYEE:
      return {
        ...state,
        listEmployee: action.payload,
      };
      case GET_ALL_SERVICE:
      return {
        ...state,
        listService: action.payload,
      };

    default:
      return state;
  }
};

export default reducer;
