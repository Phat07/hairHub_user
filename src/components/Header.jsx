import React, { useEffect, useState } from "react";
import "../css/flaticon.min.css";
import "../css/style.css";
import "../css/header.css";
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
import hairHubLogo from "../assets/images/hairHubLogo.png";

function Header(props) {
  const auth = useAuthUser();
  const signOut = useSignOut();
  const navigate = useNavigate();
  const [salonInformation, setSalonInformation] = useState({});
  const userName = auth?.username;
  const idOwner = auth?.idOwner;
  const uid= auth?.uid
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
      // window.location.reload();
    }
  };
  const handleEmptySalon = () => {
    if (!salonDetail) {
      return "/create_shop";
    } else {
      return "/list_shop";
    }
  };

  return (
    <div>
      <header className="header fixed-header">
        <div className="header-bottom" data-header>
          <div className="container">
            <img
              style={{
                width: "8rem",
                borderRadius: "50px",
                marginLeft: "-8rem",
                backgroundImage: "cover",
                objectFit: "cover",
                marginRight: "1rem",
              }}
              src={hairHubLogo}
              // className="headerLogo"
            />

            <Typography.Title className="logo" onClick={() => navigate("/")}>
              HairHub
              <span className="span">Salon | Barber Shop</span>
            </Typography.Title>

            <nav className="navbar container" data-navbar>
              <ul className="navbar-list">
                <li className="navbar-item">
                  <Link to={"/"} className="navbar-link" data-nav-link>
                    Trang chủ
                  </Link>
                </li>
                {/* <li className="navbar-item">
                  {idCustomer && (
                    <a href="#services" className="navbar-link" data-nav-link>
                      Dịch vụ
                    </a>
                  )}
                </li> */}
                {/* <li className="navbar-item">
                  <Link
                    to={"/list_salon"}
                    className="navbar-link"
                    data-nav-link
                  >
                    Salons | Barbers
                  </Link>
                </li> */}
                <li className="navbar-item">
                  {idOwner && (
                    <Link
                      to={handleEmptySalon()}
                      className="navbar-link"
                      data-nav-link
                    >
                      Quản lý Salon
                    </Link>
                  )}
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
                    <Link className="navbar-link" to={"/listPackage"}>
                      Các gói dịch vụ của hệ thống
                    </Link>
                  )}
                </li>
                <li className="navbar-item">
                  {idOwner && (
                    <Link className="navbar-link" to={"/listPayment"}>
                      Các gói dịch vụ đã được thanh toán
                    </Link>
                  )}
                </li>
                {/* <li className="navbar-item">
                  {idCustomer && (
                    <Link className="navbar-link" to={"/customer_report"}>
                      Báo cáo 
                    </Link>
                  )}
                </li> */}
                <li className="navbar-item">
                    <Link
                      to={"/system_shop"}
                      className="navbar-link"
                      data-nav-link
                    >
                      Hệ thống cửa hàng
                    </Link>
                
                </li>
                {/* <li className="navbar-item">
                  <Link className="navbar-link" to={"/barber"}>
                    Barber
                  </Link>
                </li> */}
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
                // style={{
                //   padding: "0 5px",
                //   background:
                //     "linear-gradient(90deg, rgba(31, 17, 206, 1) 0%, rgba(229, 43, 43, 1) 100%)",
                //   borderBottom: "1px solid #d9d9d9",
                //   // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                //   borderRadius: "8px",
                // }}
              >
                <Col span={14}>
                  <Typography.Title
                    level={5}
                    style={{
                      margin: 0,
                      padding: "10px",
                      // backgroundColor: "#f5f5f5",
                      // borderRadius: "5px",
                      display: "flex",
                      alignItems: "center",
                      // boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      width: "100%",
                    }}
                  >
                    <Link
                      to={`/Account/${uid}`}
                      style={{ color: "#ffff" }}
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
                    // className="bg-gradient-to-r from-blue-500 to-pink-400 mr-[15rem] w-[100%]"
                  >
                    Đăng xuất
                  </Button>
                </Col>
              </Row>
            ) : (
              <Link to={"/login"}>
                <a className="btn has-before">
                  <span className="span min-w-14 max-h-36 w-36">Đăng nhập</span>
                  {/* <ion-icon name="arrow-forward" aria-hidden="true" /> */}
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
