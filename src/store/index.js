import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";

import salonInformationReducer from "../store/salonInformation/reducer";
import salonEmployeesReducer from "../store/salonEmployees/reducer";
import appointmentReducer from "./salonAppointments/reducer";
import employeeAppointmentReducer from "./employeeAppointments/reducer";
import salonVoucherReducer from "./manageVoucher/reducer";
import customerAppoinmentReducer from "./customerAppointments/reducer";
import reportReducer from "./report/reducer";
import ratingReducer from "./ratingCutomer/reducer";
import paymentReducer from "./salonPayment/reducer";
import configReducer from "./config/reducer";
import salonTransactionReducer from "./salonTransaction/reducer";
import accountReducer from "./account/reducer";
import employeeReducer from "./employee/reducer";
import notificationReducer from "./notification/reducer";
const rootReducer = combineReducers({
  SALONINFORMATION: salonInformationReducer,
  SALONEMPLOYEES: salonEmployeesReducer,
  SALONAPPOINTMENTS: appointmentReducer,
  EMPLOYEEAPPOINTMENTS: employeeAppointmentReducer,
  SALONVOUCHERS: salonVoucherReducer,
  CUSTOMERAPPOINTMENTS: customerAppoinmentReducer,
  REPORTREDUCER: reportReducer,
  RATING: ratingReducer,
  PAYMENTREDUCER: paymentReducer,
  CONFIGREDUCER: configReducer,
  SALONTRANSACTION: salonTransactionReducer,
  ACCOUNT: accountReducer,
  EMPLOYEE: employeeReducer,
  NOTIFICATION: notificationReducer,
});
const store = createStore(rootReducer, applyMiddleware(thunk));
export default store;
