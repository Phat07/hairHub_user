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
            />
            <Link to={"/"} className="logo">
              HairHub
              <span className="span">Salon | Barber Shop</span>
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
              <a className="btn has-before">
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
