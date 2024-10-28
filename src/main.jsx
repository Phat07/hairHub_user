import { ConfigProvider, Table } from "antd";
import { App, SnackbarProvider } from "zmp-ui";
import viVn from "antd/lib/locale/vi_VN";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import {
  BrowserRouter,
  MemoryRouter,
  Route,
  RouterProvider,
  Routes,
  createBrowserRouter,
} from "react-router-dom";
import "rsuite/dist/rsuite.min.css";
import App1 from "./App.jsx";
import Footer from "./components/Footer.jsx";
import SalonForm from "./components/SalonShop/SalonForm.jsx";
import "./index.css";
import AboutPage from "./pages/About.jsx";
import AccountPage from "./pages/AccountPage.jsx";
import BarberPage from "./pages/BarberPage.jsx";
import BookingAppointmentCustomerPage from "./pages/BookingAppointmentCustomerPage.jsx";
import CustomerAppointmentVer2 from "./pages/CustomerAppointmentVer2.jsx";
import CustomerFeedback from "./pages/CustomerFeedback.jsx";
import CustomerReport from "./pages/CustomerReport.jsx";
import DashboardTransactionPage from "./pages/DashboardTransactionPage.jsx";
import ReviewEmployee from "./pages/ReviewEmployee.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import FailPayment from "./pages/FailPayment.jsx";
import FavoriteList from "./pages/FavoriteList.jsx";
import HomePage from "./pages/HomePage.jsx";
import ListBarberEmployees from "./pages/ListBarberEmployees.jsx";
import ListSalon from "./pages/ListSalon.jsx";
import ListSalonVer2 from "./pages/ListSalonVer2.jsx";
import ListServices from "./pages/ListServices.jsx";
import ListShopBarber from "./pages/ListShopBarber.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ManageVoucher from "./pages/ManageVoucher.jsx";
import PackagePage from "./pages/PackagePage.jsx";
import PackageSuccessPage from "./pages/PackageSuccessPage.jsx";
import PaymentCommissionPage from "./pages/PaymentCommissionPage.jsx";
import SalonAppointment from "./pages/SalonAppointment.jsx";
import SalonAppointmentVer2 from "./pages/SalonAppointmentVer2.jsx";
import EmployeeAppointment from "./pages/EmployeeAppointment.jsx";
import SalonDetail from "./pages/SalonDetail.jsx";
import SalonFeedback from "./pages/SalonFeedback.jsx";
import SalonOwnerAccountPage from "./pages/SalonOwnerAccountPage.jsx";
import SalonOwnerPage from "./pages/SalonOwnerPage.jsx";
import SalonPayment from "./pages/SalonPayment.jsx";
import SalonReport from "./pages/SalonReport.jsx";
import SucessPayment from "./pages/SucessPayment.jsx";
import SystemBarberPage from "./pages/SystemBarberPage.jsx";
import RequireAuth from "./PrivateRoute.js";
import store from "./store";
import Footer2 from "./components/Footer2.jsx";
import EmployeeSchedule from "./pages/EmployeeSchedule.jsx";
import EmployeeStatistics from "./pages/EmployeeStatistics.jsx";
import SalonEmployee from "./pages/SalonEmployee.jsx";
import ImageForSalon from "./pages/ImageForSalon.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import LoginGoogle from "./components/LoginGoogle/index.jsx";
import AccountDeletionGuide from "./pages/AccountDeletionGuide.jsx";
import WalletPage from "./pages/WalletPage.jsx";
import ManagementPaymentPge from "./pages/ManagementPaymentPge.jsx";
import WithdrawRequest from "./pages/WithdrawRequest.jsx";
import ManagementPaymentPage from "./pages/ManagementPaymentPage.jsx";

const version = import.meta.env.APP_ID || "default";
const basePath = `/zapps/2685475901677367467`;

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App1 />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "barber",
          element: <BarberPage />,
        },
        {
          path: "create_shop",
          element: (
            <RequireAuth requiredRoles={["SalonOwner"]} fallbackPath="/login">
              <SalonForm />
            </RequireAuth>
          ),
        },
        {
          path: "create_shop/:id",
          element: (
            <RequireAuth requiredRoles={["SalonOwner"]} fallbackPath="/login">
              <SalonForm />
            </RequireAuth>
          ),
        },
        {
          path: "list_barber_employees/:id/*",
          element: (
            <RequireAuth fallbackPath="/login">
              <Routes>
                <Route path="/" element={<ListBarberEmployees />} />
                <Route
                  path="account_details/:employeeId"
                  element={<AccountPage />}
                />
              </Routes>
            </RequireAuth>
          ),
        },
        {
          path: "list_shop/*",
          element: (
            <RequireAuth requiredRoles={["SalonOwner"]} fallbackPath="/login">
              <Routes>
                <Route path="/" element={<ListShopBarber />} />
                <Route
                  path="account_details/:employeeId"
                  element={<AccountPage />}
                />
              </Routes>
            </RequireAuth>
          ),
        },
        {
          path: "list_service/:id",
          element: <ListServices />,
          errorElement: <ErrorPage />,
        },
        {
          path: "footer",
          element: <Footer />,
        },
        {
          path: "salonOwner",
          element: (
            <RequireAuth fallbackPath="/login">
              <SalonOwnerPage />
            </RequireAuth>
          ),
        },
        {
          path: "list_voucher/:id",
          element: (
            <RequireAuth fallbackPath="/login">
              <ManageVoucher />
            </RequireAuth>
          ),
        },
        {
          path: "manage_appointment",
          element: (
            <RequireAuth requiredRoles={["SalonOwner"]} fallbackPath="/login">
              <SalonAppointment />
            </RequireAuth>
          ),
        },
        {
          path: "customer_appointment",
          element: (
            <RequireAuth requiredRoles={["Customer"]} fallbackPath="/login">
              <CustomerAppointmentVer2 />
            </RequireAuth>
          ),
        },
        {
          path: "salon_appointment",
          element: (
            <RequireAuth requiredRoles={["SalonOwner"]} fallbackPath="/login">
              <SalonAppointmentVer2 />
            </RequireAuth>
          ),
        },
        {
          path: "employee_appointment",
          element: (
            <RequireAuth
              requiredRoles={["SalonEmployee"]}
              fallbackPath="/login"
            >
              <EmployeeAppointment />
            </RequireAuth>
          ),
        },
        {
          path: "list_favorite",
          element: (
            <RequireAuth fallbackPath="/login">
              <FavoriteList />
            </RequireAuth>
          ),
        },
        {
          path: "customer_report",
          element: (
            <RequireAuth requiredRoles={["Customer"]} fallbackPath="/login">
              <CustomerReport />
            </RequireAuth>
          ),
        },
        {
          path: "salon_report",
          element: (
            <RequireAuth requiredRoles={["SalonOwner"]} fallbackPath="/login">
              <SalonReport />
            </RequireAuth>
          ),
        },
        {
          path: "salon_iamges/:id",
          element: (
            <RequireAuth requiredRoles={["SalonOwner"]} fallbackPath="/login">
              <ImageForSalon />
            </RequireAuth>
          ),
        },
        {
          path: "salon_feedback",
          element: (
            <RequireAuth fallbackPath="/login">
              <SalonFeedback />
            </RequireAuth>
          ),
        },
        {
          path: "customer_feedback",
          element: (
            <RequireAuth fallbackPath="/login">
              <CustomerFeedback />
            </RequireAuth>
          ),
        },
        {
          path: "salon_payment",
          element: (
            <RequireAuth fallbackPath="/login">
              <SalonPayment />
            </RequireAuth>
          ),
        },
        {
          path: "Account/:id",
          element: (
            <RequireAuth
              requiredRoles={["SalonOwner", "Customer", "SalonEmployee"]}
              fallbackPath="/login"
            >
              <SalonOwnerAccountPage />
            </RequireAuth>
          ),
        },
        {
          path: "booking_appointment/customer",
          element: (
            <RequireAuth fallbackPath="/login">
              <BookingAppointmentCustomerPage />
            </RequireAuth>
          ),
        },
        {
          path: "successPayment",
          element: (
            <RequireAuth
              requiredRoles={["SalonOwner", "Customer"]}
              fallbackPath="/login"
            >
              <SucessPayment />
            </RequireAuth>
          ),
        },
        {
          path: "failPayment",
          element: (
            <RequireAuth
              requiredRoles={["SalonOwner", "Customer"]}
              fallbackPath="/login"
            >
              <FailPayment />
            </RequireAuth>
          ),
        },
        {
          path: "listPackage",
          element: (
            <RequireAuth
              requiredRoles={["SalonOwner", "Customer"]}
              fallbackPath="/login"
            >
              <PackagePage />
            </RequireAuth>
          ),
        },
        {
          path: "listPayment",
          element: (
            <RequireAuth
              requiredRoles={["SalonOwner", "Customer"]}
              fallbackPath="/login"
            >
              <PackageSuccessPage />
            </RequireAuth>
          ),
        },
        {
          path: "payment",
          element: (
            <RequireAuth
              requiredRoles={["SalonOwner", "Customer"]}
              fallbackPath="/login"
            >
              <WalletPage />
            </RequireAuth>
          ),
        },
        {
          path: "managerPayment",
          element: (
            <RequireAuth
              requiredRoles={["SalonOwner", "Customer"]}
              fallbackPath="/login"
            >
              {/* <ManagementPaymentPge /> */}
              <ManagementPaymentPage />
            </RequireAuth>
          ),
        },
        {
          path: "dashboardTransaction",
          element: (
            <RequireAuth requiredRoles={["SalonOwner"]} fallbackPath="/login">
              <DashboardTransactionPage />
            </RequireAuth>
          ),
        },
        {
          path: "EmployeeSchedule",
          element: (
            <RequireAuth
              requiredRoles={["SalonEmployee"]}
              fallbackPath="/login"
            >
              <EmployeeSchedule />
            </RequireAuth>
          ),
        },
        {
          path: "EmployeeStatistics",
          element: (
            <RequireAuth
              requiredRoles={["SalonEmployee"]}
              fallbackPath="/login"
            >
              <EmployeeStatistics />
            </RequireAuth>
          ),
        },
        {
          path: "SalonEmployee",
          element: (
            <RequireAuth
              requiredRoles={["SalonEmployee"]}
              fallbackPath="/login"
            >
              <SalonEmployee />
            </RequireAuth>
          ),
        },
        {
          path: "reviewEmployee",
          element: (
            <RequireAuth requiredRoles={["SalonOwner"]} fallbackPath="/login">
              <ReviewEmployee />
            </RequireAuth>
          ),
        },
        {
          path: `payment_commission`,
          element: <PaymentCommissionPage />,
          errorElement: <ErrorPage />,
        },
        {
          path: "system_shop",
          element: <SystemBarberPage />,
        },
        {
          path: `salon_detail/:id`,
          element: <SalonDetail />,
          errorElement: <ErrorPage />,
        },
        {
          path: "list_salon",
          element: <ListSalon />,
          errorElement: <ErrorPage />,
        },
        {
          path: "list_salon_ver2",
          element: <ListSalonVer2 />,
          errorElement: <ErrorPage />,
        },
        {
          path: `about`,
          element: <AboutPage />,
          errorElement: <ErrorPage />,
        },
        {
          path: `deleteAcountGuide`,
          element: <AccountDeletionGuide />,
          errorElement: <ErrorPage />,
        },
        //WithdrawRequest
        {
          path: `WithdrawRequest`,
          element: <WithdrawRequest />,
          errorElement: <ErrorPage />,
        },
      ],
    },
    {
      path: "login",
      element: <LoginPage />,
      errorElement: <ErrorPage />,
    },
    {
      path: "404",
      element: <ErrorPage />,
      errorElement: <ErrorPage />,
    },
    {
      path: "*",
      element: <ErrorPage />,
    },
  ]
  // { basename: basePath }
);

// const customTheme = {
//   token: {
//     fontFamily: '"Lora", serif',
//   },
//   components: {
//     Typography: {
//       fontFamily: '"Lora", serif',
//       fontSize: 16, // font size of Text
//     },
//   },
// };
const customTheme = {
  token: {
    fontFamily: '"Fredoka", sans-serif', // Update font family to Fredoka
  },
  components: {
    Typography: {
      fontFamily: '"Fredoka", sans-serif', // Update Typography to use Fredoka
      fontSize: 16,
    },
  },
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      {/* <BrowserRouter> */}
      <GoogleOAuthProvider clientId="160573115812-l88je63eolr52ichb690e7i8g3f59r9t.apps.googleusercontent.com">
        <ConfigProvider locale={viVn} theme={customTheme}>
          {/* <App> */}
          <RouterProvider router={router} />
          {/* </App> */}
        </ConfigProvider>
      </GoogleOAuthProvider>
      {/* </BrowserRouter> */}
    </Provider>
  </React.StrictMode>
);
// main.jsx
