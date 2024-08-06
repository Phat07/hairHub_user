import {
  CREATE_SALON_INFORMATION,
  GET_ALL_EMPLOYEE,
  GET_ALL_SERVICE,
  GET_ALL_SERVICE_NOT,
} from "./action";

const initialState = {
  totalPages: 1,
  totalPagesServices: 1,
  salonEmployees: {},
  salonServicesList: {},
  listEmployee: [],
  listService: [],
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
        totalPages: action.payload.totalPages,
        listEmployee: action.payload.list,
      };
    case GET_ALL_SERVICE:
      return {
        ...state,
        listService: action.payload.list,
        totalPagesServices: action.payload.totalPages,
      };
    case GET_ALL_SERVICE_NOT:
      return {
        ...state,
        salonServicesList: action.payload,
      };

    default:
      return state;
  }
};

export default reducer;
