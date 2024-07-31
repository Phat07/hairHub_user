import React, { useEffect, useState } from "react";
import "../css/flaticon.min.css";
import "../css/style.css";
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

function HeaderUnAuth(props) {
  const auth = useAuthUser();
  const signOut = useSignOut();
  const navigate = useNavigate();
  const [salonInformation, setSalonInformation] = useState({});
  const userName = auth?.username;
  const idOwner = auth?.idOwner;
  const idCustomer = auth?.idCustomer;
  const dispatch = useDispatch();
  console.log(userName, "userName");
  console.log(idOwner, "idOwner");
  console.log(idCustomer, "idCustomer");
  console.log("auth", auth);

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
  console.log("salon", salonDetail);
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
        <div className="header-bottom" style={{ height: "10rem" }} data-header>
          <div className="container" style={{ marginTop: "1rem" }}>
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
            <Link to={"/login"}>
              <a className="btn has-before" style={{ textAlign: "center" }}>
                <span className="span min-w-14 max-h-36 w-36">Đăng nhập</span>
              </a>
            </Link>
          </div>
        </div>
      </header>
      <Outlet />
    </div>
  );
}

export default HeaderUnAuth;
