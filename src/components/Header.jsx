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

function Header(props) {
  const auth = useAuthUser();
  const signOut = useSignOut();
  const navigate = useNavigate();
  const [salonInformation, setSalonInformation] = useState({});
  const userName = auth?.username;
  const idOwner = auth?.idOwner;
  const uid = auth?.uid;
  const idCustomer = auth?.idCustomer;
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

  const handleSignOut = () => {
    if (auth) {
      signOut();
      message.success("Đăng xuất thành công");
      navigate("/");
    }
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

  return (
    <div>
      <header className="header fixed-header">
        <div className="header-bottom" data-header>
          <div className="container">
            <Link
              to={"/"}
              className="logo"
              style={{ display: "flex", alignItems: "center" }}
            >
              <img
                style={{
                  width: "4.5rem",
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
                  width: "12.5rem",
                }}
              >
                <h1
                  style={{
                    margin: 0,
                    padding: 0,
                    fontSize: "1.5rem",
                    lineHeight: "1.5rem",
                  }}
                >
                  HairHub
                </h1>
                <span
                  style={{
                    fontSize: "0.9rem",
                    color: "#888",
                    lineHeight: "1.5rem",
                  }}
                >
                  Salon | Barber
                </span>
              </div>
            </Link>

            <nav className="navbar container" data-navbar>
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
                  {idOwner && isEmptyObject(salonDetail) && (
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
            >
              <IoMenu />
            </button>
            {auth ? (
              <Row
                align="middle"
                justify="space-between"
                className="logOutSection"
              >
                <Col span={14}>
                  <Typography.Title
                    level={5}
                    style={{
                      margin: 0,
                      padding: "10px",
                      display: "flex",
                      alignItems: "center",
                      width: "35rem",
                    }}
                  >
                    <Link
                      to={`/Account/${uid}`}
                      style={{
                        color: "#ffff",
                        fontSize: "1.3rem",
                      }}
                    >
                      {<UserOutlined />} {userName}
                    </Link>
                  </Typography.Title>
                </Col>
                <Col span={10}>
                  <Button
                    classNames="logOutButton"
                    type="primary"
                    onClick={handleSignOut}
                    icon={<LogoutOutlined />}
                    style={{
                      marginRight: "15rem",
                      width: "100%",
                      background:
                        "linear-gradient(90deg, rgba(238, 130, 238, 0.8) 0%, rgba(0, 209, 255, 0.8) 100%)",
                    }}
                  >
                    Đăng xuất
                  </Button>
                </Col>
              </Row>
            ) : (
              <Link to={"/login"}>
                <a className="btn has-before">
                  <span className="span min-w-14 max-h-36 w-36">Đăng nhập</span>
                </a>
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
