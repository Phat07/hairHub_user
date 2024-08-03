// routes.js
import HomePage from "./pages/HomePage";
import BarberPage from "./pages/BarberPage";
import SalonForm from "./components/SalonShop/SalonForm";
import ListBarberEmployees from "./pages/ListBarberEmployees";
import AccountPage from "./pages/AccountPage";
import ListShopBarber from "./pages/ListShopBarber";
import ListServices from "./pages/ListServices";
import SalonOwnerPage from "./pages/SalonOwnerPage";
import ManageVoucher from "./pages/ManageVoucher";
import SalonAppointment from "./pages/SalonAppointment";
import SalonAppointmentVer2 from "./pages/SalonAppointmentVer2";
import FavoriteList from "./pages/FavoriteList";
import CustomerReport from "./pages/CustomerReport";
import SalonReport from "./pages/SalonReport";
import SalonFeedback from "./pages/SalonFeedback";
import CustomerFeedback from "./pages/CustomerFeedback";
import SalonPayment from "./pages/SalonPayment";
import SalonOwnerAccountPage from "./pages/SalonOwnerAccountPage";
import BookingAppointmentCustomerPage from "./pages/BookingAppointmentCustomerPage";
import SucessPayment from "./pages/SucessPayment";
import FailPayment from "./pages/FailPayment";
import PackagePage from "./pages/PackagePage";
import PackageSuccessPage from "./pages/PackageSuccessPage";
import DashboardTransactionPage from "./pages/DashboardTransactionPage";
import SystemBarberPage from "./pages/SystemBarberPage";
import Footer from "./components/Footer";

const routes = [
  { path: "/", element: <HomePage />, auth: false },
  { path: "barber", element: <BarberPage />, auth: false },
  { path: "create_shop", element: <SalonForm />, auth: true },
  { path: "create_shop/:id", element: <SalonForm />, auth: true },
  { path: "list_barber_employees/:id/*", element: <ListBarberEmployees />, auth: true },
  { path: "account_details/:employeeId", element: <AccountPage />, auth: true },
  { path: "list_shop", element: <ListShopBarber />, auth: true },
  { path: "list_service/:id", element: <ListServices />, auth: false },
  { path: "footer", element: <Footer />, auth: false },
  { path: "salonOwner", element: <SalonOwnerPage />, auth: true },
  { path: "list_voucher/:id", element: <ManageVoucher />, auth: true },
  { path: "manage_appointment", element: <SalonAppointment />, auth: true },
  { path: "salon_appointment", element: <SalonAppointmentVer2 />, auth: true },
  { path: "list_favorite", element: <FavoriteList />, auth: true },
  { path: "customer_report", element: <CustomerReport />, auth: true },
  { path: "salon_report", element: <SalonReport />, auth: true },
  { path: "salon_feedback/:id", element: <SalonFeedback />, auth: true },
  { path: "customer_feedback", element: <CustomerFeedback />, auth: true },
  { path: "list_payment", element: <SalonPayment />, auth: true },
  { path: "account_salonOwner", element: <SalonOwnerAccountPage />, auth: true },
  { path: "booking_appointment_customer", element: <BookingAppointmentCustomerPage />, auth: true },
  { path: "payment_success", element: <SucessPayment />, auth: true },
  { path: "payment_fail", element: <FailPayment />, auth: true },
  { path: "packages", element: <PackagePage />, auth: true },
  { path: "packages_success", element: <PackageSuccessPage />, auth: true },
  { path: "transaction_report", element: <DashboardTransactionPage />, auth: true },
  { path: "system_barber", element: <SystemBarberPage />, auth: true },
];

export default routes