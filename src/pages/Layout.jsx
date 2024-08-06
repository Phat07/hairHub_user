import React, { useEffect } from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { useDispatch, useSelector } from "react-redux";
// import Footer from "./Footer.jsx";
import { Outlet, useNavigate } from "react-router-dom";
import { actGetAllSalonInformation, actGetSalonInformationByOwnerId } from "../store/salonInformation/action";
import { actGetAllPaymentList } from "../store/config/action";
import { actGetAllServicesBySalonId } from "../store/salonEmployees/action";
import Header from "../components/Header";
import HeaderUnAuth from "../components/HeaderUnAuth";

const Layout = () => {
    const auth = useAuthUser();
    const navigate = useNavigate()
    const dispatch = useDispatch();
  
    const ownerId = auth?.idOwner;
    const salonDetail = useSelector(
      (state) => state.SALONINFORMATION.getSalonByOwnerId
    );
    useEffect(() => {
      // Kiểm tra token hết hạn
      if (!auth || !auth.token) {
        navigate("/login"); // Điều hướng đến trang đăng nhập nếu token không hợp lệ
        return;
      }
  
      dispatch(actGetSalonInformationByOwnerId(ownerId));
      dispatch(actGetAllPaymentList(ownerId, 1, 10));
      dispatch(actGetAllSalonInformation);
    }, [auth, dispatch, navigate, ownerId]);
  
    useEffect(() => {
      dispatch(actGetAllServicesBySalonId(salonDetail?.id, localStorage.getItem("currentPage"),localStorage.getItem("pageSize")));
    }, [salonDetail]);
    return <>{auth ? <Header /> : <HeaderUnAuth />}</>;
};

export default Layout;
