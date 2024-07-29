import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {
  BrowserRouter,
  Route,
  RouterProvider,
  Routes,
  createBrowserRouter,
} from "react-router-dom";
import { ConfigProvider } from "antd";
import "rsuite/dist/rsuite.min.css";
import enUS from "antd/lib/locale/en_US";
import viVn from "antd/lib/locale/vi_VN";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import BarberPage from "./pages/BarberPage.jsx";
import BarberShopPage from "./pages/BarberShopPage.jsx";
import ListBarberEmployees from "./pages/ListBarberEmployees.jsx";
import AccountPage from "./pages/AccountPage.jsx";
import SystemBarberPage from "./pages/SystemBarberPage.jsx";
import ListShopBarber from "./pages/ListShopBarber.jsx";
import SalonDetail from "./pages/SalonDetail.jsx";
import ListSalon from "./pages/ListSalon.jsx";
import Footer from "./components/Footer.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import { Provider } from "react-redux";
import store from "./store";
import createStore from "react-auth-kit/createStore";
import AuthProvider from "react-auth-kit";
import SalonOwnerPage from "./pages/SalonOwnerPage.jsx";
import RequireAuth from "@auth-kit/react-router/RequireAuth";
import VoucherPage from "./pages/VoucherPage.jsx";
import ListServices from "./pages/ListServices.jsx";
import CustomerReport from "./pages/CustomerReport.jsx";
import SalonReport from "./pages/SalonReport.jsx";
import SalonFeedback from "./pages/SalonFeedback.jsx";
import CustomerFeedback from "./pages/CustomerFeedback.jsx";
import SalonPayment from "./pages/SalonPayment.jsx";
import FavoriteList from "./pages/FavoriteList.jsx";
import SalonForm from "./components/SalonShop/SalonForm.jsx";
import ManageVoucher from "./pages/ManageVoucher.jsx";
import SalonAppointment from "./pages/SalonAppointment.jsx";
import SalonAppointmentVer2 from "./pages/SalonAppointmentVer2.jsx";
import SalonOwnerAccountPage from "./pages/SalonOwnerAccountPage.jsx";
import BookingAppointmentCustomerPage from "./pages/BookingAppointmentCustomerPage.jsx";
import CustomerSchedule from "./pages/CustomerSchedule.jsx";
import SucessPayment from "./pages/SucessPayment.jsx";
import FailPayment from "./pages/FailPayment.jsx";
import { ProConfigProvider } from "@ant-design/pro-components";
import PackagePage from "./pages/PackagePage.jsx";
import PackageSuccessPage from "./pages/PackageSuccessPage.jsx";
import DashboardTransactionPage from "./pages/DashboardTransactionPage.jsx";

const authStore = createStore({
  authName: "_auth",
  authType: "cookie",
  cookieDomain: window.location.hostname,
  cookieSecure: false,
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
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
          <RequireAuth fallbackPath="/login">
            <SalonForm />
          </RequireAuth>
        ),
      },
      {
        path: "create_shop/:id",
        element: (
          <RequireAuth fallbackPath="/login">
            <SalonForm />
          </RequireAuth>
        ),
      },
      // {
      //   path: "list_barber_employees/:id/*",
      //   element: (
      //     <RequireAuth fallbackPath="/login">
      //       <ListBarberEmployees />
      //     </RequireAuth>
      //   ),
      // },
      // {
      //   path: "account_details/:employeeId",
      //   element: (
      //     <RequireAuth fallbackPath="/login">
      //       <AccountPage />
      //     </RequireAuth>
      //   ),
      // },
      {
        path: "list_barber_employees/:id/*",
        element: (
          <RequireAuth fallbackPath="/login">
            <Routes>
              {/* Access ListBarber first */}
              <Route path="/" element={<ListBarberEmployees />} />{" "}
              {/* Access next page */}
              <Route
                path="account_details/:employeeId"
                element={<AccountPage />}
              />
            </Routes>
          </RequireAuth>
        ),
      },
      {
        path: "list_shop",
        element: (
          <RequireAuth fallbackPath="/login">
            <ListShopBarber />
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
          <RequireAuth fallbackPath="/login">
            <SalonAppointment />
          </RequireAuth>
        ),
      },
      {
        path: "salon_appointment",
        element: (
          <RequireAuth fallbackPath="/login">
            <SalonAppointmentVer2 />
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
          <RequireAuth fallbackPath="/login">
            <CustomerReport />
          </RequireAuth>
        ),
      },
      {
        path: "salon_report",
        element: (
          <RequireAuth fallbackPath="/login">
            <SalonReport />
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
          <RequireAuth fallbackPath="/login">
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
          <RequireAuth fallbackPath="/login">
            <SucessPayment />
          </RequireAuth>
        ),
      },
      {
        path: "failPayment",
        element: (
          <RequireAuth fallbackPath="/login">
            <FailPayment />
          </RequireAuth>
        ),
      },
      {
        path: "listPackage",
        element: (
          <RequireAuth fallbackPath="/login">
            <PackagePage />
          </RequireAuth>
        ),
      },
      {
        path: "listPayment",
        element: (
          <RequireAuth fallbackPath="/login">
            <PackageSuccessPage />
          </RequireAuth>
        ),
      },
      {
        path: "dashboardTransaction",
        element: (
          <RequireAuth fallbackPath="/login">
            <DashboardTransactionPage />
          </RequireAuth>
        ),
      },
      {
        path: "system_shop",
        element: <SystemBarberPage />,
      },
    ],
  },
  {
    path: "login",
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "list_salon",
    element: <ListSalon />,
    errorElement: <ErrorPage />,
  },
  {
    path: `salon_detail/:id`,
    element: <SalonDetail />,
    errorElement: <ErrorPage />,
  },
]);

const customTheme = {
  components: {
    Typography: {
      fontFamily: '"Montserrat", san-serif',
      fontSize: 16, //font size of Text
    },
  },
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      {/** Set languages from Chinese to Vietnamese entire project **/}
      <ConfigProvider locale={viVn} theme={customTheme}>
        <AuthProvider store={authStore}>
          <RouterProvider router={router}>
            {/* <App /> */}
          </RouterProvider>
        </AuthProvider>
      </ConfigProvider>
    </Provider>
  </React.StrictMode>
);
