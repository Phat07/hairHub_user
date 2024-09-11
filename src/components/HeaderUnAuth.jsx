import React, { useEffect, useState } from "react";
import "../css/flaticon.min.css";
import { Link, Outlet, redirect, useNavigate } from "react-router-dom";
import { IoMenu } from "react-icons/io5";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import { Avatar, Button, Col, Flex, Row, Typography, message } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { SalonInformationServices } from "../services/salonInformationServices";
import { isEmptyObject } from "./formatCheckValue/checkEmptyObject";
import { useDispatch, useSelector } from "react-redux";
import { actGetSalonInformationByOwnerId } from "../store/salonInformation/action";
import hairHubLogo from "../assets/images/hairhubFinalLogo.png";

import style from "../css/header.module.css";

function HeaderUnAuth(props) {
  const navigate = useNavigate();
  const [salonInformation, setSalonInformation] = useState({});
  const userName = useSelector((state) => state.ACCOUNT.userName);
  const idCustomer = useSelector((state) => state.ACCOUNT.idCustomer);
  const idOwner = useSelector((state) => state.ACCOUNT.idOwner);
  const uid = useSelector((state) => state.ACCOUNT.uid);
  const dispatch = useDispatch();

  const salonDetail = useSelector(
    (state) => state.SALONINFORMATION.getSalonByOwnerId
  );

  useEffect(() => {
    try {
      dispatch(actGetSalonInformationByOwnerId(idOwner));
    } catch (err) {
      console.log(err, "errors");
    }
  }, [idOwner]);

  const [menuActive, setMenuActive] = useState(false);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  return (
    <div>
      <header className={style.headerContainer}>
        <div className={style.header}>
          <div className={style.logoContainer}>
            <Link to={"/"}>
              <img
                className={style.logo}
                src={hairHubLogo}
                alt="HairHub Logo"
              />
            </Link>
          </div>

          <nav className={style.navbar}>
            <ul className={style.navList}>
              <li className={style.navItem}>
                <Link to={"/"} className={style.navLink}>
                  Trang chủ
                </Link>
              </li>
              <li className={style.navItem}>
                <Link to={"/about"} className={style.navLink}>
                  Giới thiệu
                </Link>
              </li>
              <li className={style.navItem}>
                <Link to={"/list_salon_ver2"} className={style.navLink}>
                  Hệ thống cửa hàng
                </Link>
              </li>
              {menuActive && (
                <li className={style.navItemRepo}>
                  <Link to={"/"} className={style.navLink}>
                    Trang chủ
                  </Link>
                </li>
              )}
              {menuActive && (
                <li className={style.navItemRepo}>
                  <Link to={"/list_salon_ver2"} className={style.navLink}>
                    Hệ thống cửa hàng
                  </Link>
                </li>
              )}
              {menuActive && (
                <li className={style.navItemRepo}>
                  <Link to={"/login"} className={style.navLink}>
                    Đăng nhập
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          <button
            className={style.menuToggle}
            aria-label="toggle menu"
            onClick={toggleMenu}
          >
            <IoMenu />
          </button>

          <Link to={"/login"} className={style.loginLink}>
            <span>Đăng nhập</span>
          </Link>
        </div>
      </header>
      <Outlet />
    </div>
  );
}

export default HeaderUnAuth;
