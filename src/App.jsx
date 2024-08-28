import jwtDecode from "jwt-decode"; // Ensure jwtDecode is imported
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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

import { message } from "antd";
import useDocumentTitle from "../src/components/useDocumentTitle";
import ChatBox from "./components/ChatBox";
import Footer2 from "./components/Footer2";
import { AccountServices } from "./services/accountServices";
import { fetchUserByTokenApi } from "./store/account/action";
function App() {
  useDocumentTitle();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const salonDetail = useSelector(
    (state) => state.SALONINFORMATION.getSalonByOwnerId
  );
  const token = useSelector((state) => state.ACCOUNT.token);
  const ownerId = useSelector((state) => state.ACCOUNT.ownerId);

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
        } else {
          message.warning("Đăng nhập lại!!, quá phiên đăng nhập");
          navigate("/login");
        }
      }
    } catch (error) {
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
        }
      }
    } catch (error) {
      message.error("Lỗi xác thực người dùng");
    }
  };

  useEffect(() => {
    authenticateUser();
  }, []);

  useEffect(() => {
    if (ownerId) {
      dispatch(actGetSalonInformationByOwnerId(ownerId));
      dispatch(actGetAllPaymentList(ownerId, 1, 10));
    }
  }, [dispatch, ownerId]);

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

  return (
    <>
      <div className="super-container">
        {localStorage.getItem("refreshToken") ? <Header /> : <HeaderUnAuth />}
        {/* {localStorage.getItem("refreshToken") ? <HeaderUnAuth /> :<></>} */}
        {/* <ChatBox /> */}
        {/* <ChatComponent /> */}
        {/* <Footer /> */}
      </div>
      <Footer2 />
    </>
  );
}

export default App;
