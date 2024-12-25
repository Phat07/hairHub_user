import jwtDecode from "jwt-decode"; // Ensure jwtDecode is imported
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import HeaderUnAuth from "./components/HeaderUnAuth";
import { actGetAllPaymentList } from "./store/config/action";
import { actGetAllServicesBySalonIdNoPaging } from "./store/salonEmployees/action";
import {
  actGetAllSalonInformation,
  actGetAllSalonSuggestionInformation,
  actGetSalonInformationByOwnerId,
} from "./store/salonInformation/action";
import * as signalR from "@microsoft/signalr";
import { message } from "antd";
import useDocumentTitle from "../src/components/useDocumentTitle";
import ChatBox from "./components/ChatBox";
import Footer2 from "./components/Footer2";
import { AccountServices } from "./services/accountServices";
import {
  fetchUserByTokenApi,
  GetInformationAccount,
} from "./store/account/action";
import FooterMobile from "./components/FooterMobile";
import FooterMobileAuth from "./components/FooterMobileAuth";
import FooterMobileUnAuth from "./components/FooterMobileUnAuth";
import audioVer1 from "../public/audio/warm-tech-logo-21474.mp3";
import { actGetNotificationList } from "./store/notification/action";
const tele = window.Telegram.WebApp;

function App() {
  useDocumentTitle();
  useEffect(() => {
    tele.ready();
  }, []);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("accessToken");
  const salonDetail = useSelector(
    (state) => state.SALONINFORMATION.getSalonByOwnerId
  );
  // const token = useSelector((state) => state.ACCOUNT.token);
  const idOwner = useSelector((state) => state.ACCOUNT.idOwner);
  const uid = useSelector((state) => state.ACCOUNT.uid);
  const idCustomer = useSelector((state) => state.ACCOUNT.idCustomer);
  const idEmployee = useSelector((state) => state.ACCOUNT.idEmployee);
  useEffect(() => {
    if (uid) {
      dispatch(GetInformationAccount(uid));
    }
  }, [uid]);
  // useEffect(() => {
  //   if (idCustomer) {
  //     navigate("/");
  //   } else if (idOwner) {
  //     navigate("list_shop");
  //   } else if (idEmployee) {
  //     navigate("/SalonEmployee");
  //   } else {
  //     navigate("/");
  //   }
  // }, [idCustomer, idEmployee, idOwner]);
  useEffect(() => {
    if (uid) {
      dispatch(actGetNotificationList(uid));
    }
  }, [uid]);
  const isTokenExpired = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Convert milliseconds to seconds
      return decodedToken.exp < currentTime;
    } catch (error) {
      return true;
    }
  };
  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        const res = await AccountServices.refreshToken(refreshToken);
        if (res.data?.accessToken) {
          localStorage.setItem("accessToken", res.data.accessToken);
          localStorage.setItem("refreshToken", res.data.refreshToken);
          return res.data.accessToken;
        } else if (refreshToken == null) {
          return;
        } else {
          message.warning("Đăng nhập lại!!, quá phiên đăng nhập");
          navigate("/login");
        }
      }
    } catch (error) {
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("accessToken");
      message?.info(error?.response?.data?.message, 1);
      // navigate("/login");
      // message.error("Có lỗi xảy ra khi làm mới token");
    }
  };

  const authenticateUser = async () => {
    try {
      let accessToken = localStorage.getItem("accessToken");
      if (accessToken && !isTokenExpired(accessToken)) {
        await dispatch(fetchUserByTokenApi(accessToken, navigate));
      } else {
        accessToken = await refreshToken();
        if (accessToken) {
          await dispatch(fetchUserByTokenApi(accessToken, navigate));
        } else if (accessToken == null) {
          return;
        }
      }
    } catch (error) {
      // message.error("Lỗi xác thực người dùng");
    }
  };
  console.log("hairhub system");

  useEffect(() => {
    authenticateUser();
  }, []);
  useEffect(() => {
    let connection;
    const setupSignalR = async () => {
      try {
        // Tạo kết nối SignalR
        connection = new signalR.HubConnectionBuilder()
          .withUrl("https://hairhub.gahonghac.net/book-appointment-hub")
          .withAutomaticReconnect()
          .build();

        // Bắt đầu kết nối
        await connection.start();

        // Lắng nghe sự kiện "ReceiveMessage"
        connection.on(
          "ReceiveMessage",
          async (
            message,
            dateAppointment,
            datenow,
            salonId,
            serviceId,
            ownerId
          ) => {
            // Kiểm tra điều kiện idOwner === serviceId
            if (token && idOwner && idOwner === ownerId) {
              // Chỉ phát âm thanh khi điều kiện đúng
              const audio = new Audio(audioVer1); // Đảm bảo audioVer1 là đường dẫn hợp lệ
              audio.play().catch((error) => {
                // console.error("Lỗi phát âm thanh:", error);
              });
            } else {
              // Nếu không đúng điều kiện, in ra lỗi và không phát âm thanh
              // console.error("Không trùng khớp idOwner với ownerId");
            }
          }
        );
      } catch (error) {
        // console.error("Lỗi khi thiết lập SignalR:", error);
      }
    };

    setupSignalR();

    // Dọn dẹp kết nối khi component bị hủy
    return () => {
      connection.stop().then(() => {});
    };
  }, [idOwner]);

  useEffect(() => {
    if (idOwner) {
      dispatch(actGetSalonInformationByOwnerId(idOwner));
      // dispatch(actGetAllPaymentList(idOwner, 1, 10));
    }
  }, [dispatch, idOwner]);

  useEffect(() => {
    dispatch(actGetAllSalonInformation());
    dispatch(actGetAllSalonSuggestionInformation());
  }, [dispatch]);

  useEffect(() => {
    if (salonDetail?.id) {
      dispatch(actGetAllServicesBySalonIdNoPaging(salonDetail.id));

      // dispatch(actGetAllServicesBySalonId(salonDetail.id, localStorage.getItem("currentPage"),localStorage.getItem("pageSize")));
    }
  }, [salonDetail, dispatch]);

  useEffect(() => {
    const handleScrollToTop = () => {
      window.scrollTo(0, 0);
    };

    window.addEventListener("popstate", handleScrollToTop);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("popstate", handleScrollToTop);
    };
  }, []);

  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <div className="super-container">
        {localStorage?.getItem("refreshToken") ? <Header /> : <HeaderUnAuth />}
      </div>
      <Footer2 />
      <ChatBox />
      {localStorage?.getItem("refreshToken") ? (
        <FooterMobileAuth />
      ) : (
        <FooterMobileUnAuth />
      )}
    </>
  );
}

export default App;
