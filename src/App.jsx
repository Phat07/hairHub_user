import { useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { useDispatch, useSelector } from "react-redux";
import {
  actGetAllSalonInformation,
  actGetSalonInformationByOwnerId,
} from "./store/salonInformation/action";
import { actGetAllServicesBySalonId } from "./store/salonEmployees/action";
import { actGetAllPaymentList } from "./store/config/action";
import HeaderUnAuth from "./components/HeaderUnAuth";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode"; // Ensure jwtDecode is imported

import useAuth from "./hooks/useAuth";
import { AccountServices } from "./services/accountServices";
import { fetchUserByTokenApi } from "./store/account/action";
import { message } from "antd";
import ChatBox from "../src/components/ChatBox";

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const salonDetail = useSelector(
    (state) => state.SALONINFORMATION.getSalonByOwnerId
  );
  const token = useSelector((state) => state.ACCOUNT.token);
  const ownerId = useSelector((state) => state.ACCOUNT.ownerId);

  // const fetchUserByToken = async (token) => {
  //   // console.log("Fetching user by token:", token);
  //   try {
  //     await dispatch(fetchUserByTokenApi(token));
  //   } catch (err) {
  //     console.error("Error fetching user by token:", err);
  //     navigate("/login");
  //   }
  // };

  const isTokenExpired = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Convert milliseconds to seconds
      return decodedToken.exp < currentTime;
    } catch (error) {
      console.error("Error decoding token:", error);
      return true;
    }
  };

  const refreshToken = async () => {
    try {
      const refreshToken = sessionStorage.getItem("refreshToken");

      if (refreshToken) {
        const res = await AccountServices.refreshToken(refreshToken);
        if (res.data && res.data.accessToken) {
          sessionStorage.setItem("accessToken", res.data.accessToken);
          sessionStorage.setItem("refreshToken", res.data.refreshToken);
          return res.data.accessToken;
        } else {
          message.warning("Đăng nhập lại!!, quá phiên đăng nhập");
          navigate("/login");
          throw new Error("Invalid response data");
        }
      } else {
        return;
        throw new Error("No refresh token found");
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw new Error("Failed to refresh token");
    }
  };

  const authenticateUser = async () => {
    try {
      let accessToken = sessionStorage.getItem("accessToken");

      if (accessToken && !isTokenExpired(accessToken)) {
        await dispatch(fetchUserByTokenApi(accessToken, navigate));
        // await fetchUserByToken(accessToken);
      } else {
        // let refreshToken = sessionStorage.getItem("refreshToken");
        accessToken = await refreshToken();
        await dispatch(fetchUserByTokenApi(accessToken, navigate));
      }
    } catch (error) {
      console.error("Authentication error:", error);
      // message.error("Session expired. Please log in again.");
      // navigate("/login");
    }
  };

  useEffect(() => {
    authenticateUser();
  }, []);

  useEffect(() => {
    if (ownerId) {
      dispatch(actGetSalonInformationByOwnerId(ownerId));
    }
    dispatch(actGetAllPaymentList(ownerId, 1, 10));
  }, [dispatch, ownerId]);
  useEffect(() => {
    dispatch(actGetAllSalonInformation());
  }, []);

  useEffect(() => {
    if (salonDetail?.id) {
      dispatch(actGetAllServicesBySalonId(salonDetail.id));
    }
  }, [salonDetail, dispatch]);

  return (
    <>
      {sessionStorage.getItem("refreshToken") ? <Header /> : <HeaderUnAuth />}
      <ChatBox />
      {/* <ChatComponent/> */}
    </>
  );
}

export default App;
