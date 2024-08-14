import React, { useEffect, useState } from "react";
import "../css/flaticon.min.css";
import { DownOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Dropdown, Menu, message } from "antd";
import { IoMenu } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useNavigate } from "react-router-dom";
import hairHubLogo from "../assets/images/hairHubLogo.png";
import style from "../css/header.module.css";
import { actGetSalonInformationByOwnerIdByCheck } from "../store/salonInformation/action";

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
  console.log("salonDetail", salonDetail);
  const salonServicesList = useSelector(
    (state) => state.SALONEMPLOYEES.salonServicesList
  );

  const account = useSelector((state) => state.ACCOUNT.username);

  useEffect(() => {
    if (idOwner) {
      try {
        dispatch(actGetSalonInformationByOwnerIdByCheck(idOwner, navigate));
      } catch (err) {
        console.log(err, "errors");
      }
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

  console.log("idCustomer", idCustomer);
  console.log("idOwner", idOwner);

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
                <Link to={"/"} className={style.navLink}>
                  Giới thiệu
                </Link>
              </li>
              <li className={style.navItem}>
                <Link to={"/system_shop"} className={style.navLink}>
                  Hệ thống cửa hàng
                </Link>
              </li>
              <li className={style.navItem}>
                {(idCustomer || idOwner) && (
                  <Link
                    to={
                      idOwner ? "/salon_appointment" : "/customer_appointment"
                    }
                    className={style.navLink}
                  >
                    Cuộc hẹn
                  </Link>
                )}
              </li>
              <li className={style.navItemRepo}>
                {idOwner && <Link to={handleEmptySalon()}>Quản lý Salon</Link>}
              </li>
              {/* <li className={style.navItem}>
                <Link to={"/listPackage"}>Dịch vụ hệ thống</Link>
              </li>
              <li className={style.navItem}>
                <Link to={"/listPayment"}>Dịch vụ đã thanh toán</Link>
              </li> */}
              {menuActive && (
                <li className={style.navItemRepo}>
                  <Link to={"/"} className={style.navLink}>
                    Trang chủ
                  </Link>
                </li>
              )}

              {menuActive && (
                <li className={style.navItemRepo}>
                  <Link to={"/"} className={style.navLink}>
                    Giới thiệu
                  </Link>
                </li>
              )}
              {menuActive && (
                <li className={style.navItemRepo}>
                  <Link to={"/system_shop"} className={style.navLink}>
                    Hệ thống cửa hàng
                  </Link>
                </li>
              )}
              {menuActive && (
                <li className={style.navItemRepo}>
                  {(idCustomer || idOwner) && (
                    <Link
                      to={
                        idOwner ? "/salon_appointment" : "/customer_appointment"
                      }
                      className={style.navLink}
                    >
                      Cuộc hẹn
                    </Link>
                  )}
                </li>
              )}
              {menuActive && (
                <li className={style.navItemRepo}>
                  {idOwner && (
                    <Link to={handleEmptySalon()}>Quản lý Salon</Link>
                  )}
                </li>
              )}
            </ul>
          </nav>

          <button
            aria-label="toggle menu"
            className={style.menuToggle}
            onClick={toggleMenu}
          >
            <IoMenu />
          </button>

          {account ? (
            <Dropdown overlay={accountMenu} trigger={["click"]}>
              <a onClick={(e) => e.preventDefault()}>
                <Avatar className={style.avatarLink} icon={<UserOutlined />} />
              </a>
            </Dropdown>
          ) : (
            <Link to={"/login"}>
              <Button type="primary">Đăng nhập</Button>
            </Link>
          )}
        </div>
      </header>
      <Outlet />
    </div>
  );
}

export default Header;
