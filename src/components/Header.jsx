import React, { useEffect, useState } from "react";
import "../css/flaticon.min.css";
import "../css/style.css";
import "../css/header.css";
import { Link, Outlet, redirect, useNavigate } from "react-router-dom";
import { IoMenu } from "react-icons/io5";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import {
  Avatar,
  Button,
  Col,
  Dropdown,
  Flex,
  Menu,
  Row,
  Typography,
  message,
} from "antd";
import { DownOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { SalonInformationServices } from "../services/salonInformationServices";
import { isEmptyObject } from "./formatCheckValue/checkEmptyObject";
import { useDispatch, useSelector } from "react-redux";
import { actGetSalonInformationByOwnerId } from "../store/salonInformation/action";
import hairHubLogo from "../assets/images/hairHubLogo.png";
import { AccountServices } from "../services/accountServices";
import { fetchUserByTokenApi } from "../store/account/action";

function Header(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userName = useSelector((state) => state.ACCOUNT.userName);
  const idCustomer = useSelector((state) => state.ACCOUNT.idCustomer);
  const idOwner = useSelector((state) => state.ACCOUNT.idOwner);
  const uid = useSelector((state) => state.ACCOUNT.uid);
  const salonDetail = useSelector(
    (state) => state.SALONINFORMATION.getSalonByOwnerId
  );
  const account = useSelector((state) => state.ACCOUNT.username);

  useEffect(() => {
    try {
      dispatch(actGetSalonInformationByOwnerId(idOwner));
    } catch (err) {
      console.log(err, "errors");
    }
  }, [idOwner]);

  const handleSignOut = () => {
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");
    message.success("Đăng xuất thành công");
    navigate("/");
  };

  const handleEmptySalon = () => {
    if (!salonDetail) {
      return "/create_shop";
    } else {
      return "/list_shop";
    }
  };

  const serviceMenu = (
    <Menu>
      {idOwner && (
        <Menu.Item>
          <Link to={handleEmptySalon()}>Quản lý Salon</Link>
        </Menu.Item>
      )}
      <Menu.Item>
        <Link to={"/listPackage"}>Dịch vụ hệ thống</Link>
      </Menu.Item>
      <Menu.Item>
        <Link to={"/listPayment"}>Dịch vụ đã thanh toán</Link>
      </Menu.Item>
    </Menu>
  );

  const accountMenu = (
    <Menu>
      <Menu.Item key="username" disabled>
        {account}
      </Menu.Item>
      <Menu.Item key="profile">
        <Link to={`/Account/${uid}`}>
          <UserOutlined /> Thông tin cá nhân
        </Link>
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleSignOut}>
        <LogoutOutlined /> Đăng xuất
      </Menu.Item>
    </Menu>
  );

  const [menuActive, setMenuActive] = useState(false);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  return (
    <div>
      <header className="header fixed-header">
        <div className="header-bottom" style={{ height: "10rem" }} data-header>
          <div className="container">
            <Link
              to={"/"}
              className="logo"
              style={{ display: "flex", alignItems: "center" }}
            >
              <img
                style={{
                  width: "6.5rem",
                  borderRadius: "50%",
                  marginRight: "1rem",
                }}
                src={hairHubLogo}
                alt="HairHub Logo"
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  width: "15rem",
                }}
              >
                <h1
                  style={{
                    margin: 0,
                    padding: 0,
                    fontSize: "2.8rem",
                    lineHeight: "1.5rem",
                  }}
                >
                  HairHub
                </h1>
                <span
                  style={{
                    fontSize: "1.15rem",
                    color: "#888",
                    lineHeight: "1.5rem",
                  }}
                >
                  Salon | Barber Shop
                </span>
              </div>
            </Link>

            <nav
              className={`navbar ${menuActive ? "active" : ""}`}
              data-navbar
              style={{ marginLeft: "auto", marginRight: "1rem" }}
            >
              <ul className="navbar-list">
                <li className="navbar-item">
                  <Link to={"/"} className="navbar-link" data-nav-link>
                    Trang chủ
                  </Link>
                </li>
                <li className="navbar-item">
                  <Link
                    to={"/system_shop"}
                    className="navbar-link"
                    data-nav-link
                  >
                    Hệ thống cửa hàng
                  </Link>
                </li>
                <li className="navbar-item">
                  {(idCustomer || idOwner) && (
                    <Link
                      to={
                        idOwner
                          ? "/salon_appointment"
                          : "/booking_appointment/customer"
                      }
                      className="navbar-link"
                      data-nav-link
                    >
                      Cuộc hẹn
                    </Link>
                  )}
                </li>
                <li className="navbar-item">
                  {idOwner && !salonDetail && (
                    <Link className="navbar-link" to={"/create_shop"}>
                      Tạo Salon
                    </Link>
                  )}
                </li>
                <li className="navbar-item">
                  {idOwner && (
                    <Dropdown overlay={serviceMenu} trigger={["hover"]}>
                      <a className="navbar-link" href="#!" data-nav-link>
                        Tiện ích <DownOutlined />
                      </a>
                    </Dropdown>
                  )}
                </li>
              </ul>
            </nav>
            <button
              className="nav-toggle-btn"
              aria-label="toggle menu"
              data-nav-toggler
              onClick={toggleMenu}
            >
              <IoMenu />
            </button>
            {account ? (
              <Dropdown overlay={accountMenu} trigger={["click"]}>
                <a
                  className="ant-dropdown-link"
                  onClick={(e) => e.preventDefault()}
                >
                  <Avatar className="header-avatar" icon={<UserOutlined />} />
                </a>
              </Dropdown>
            ) : (
              <Link to={"/login"}>
                <Button type="primary">Đăng nhập</Button>
              </Link>
            )}
          </div>
        </div>
      </header>
      <Outlet />
    </div>
  );
}

export default Header;
