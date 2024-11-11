import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { IoMenu } from "react-icons/io5";
import hairHubLogo from "../assets/images/hairhubFinalLogo.png";
import style from "../css/header.module.css";

function HeaderUnAuth(props) {
  const location = useLocation(); // Lấy đường dẫn hiện tại
  const [menuActive, setMenuActive] = useState(false);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  const isActive = (path) => location.pathname === path; // Kiểm tra xem đường dẫn hiện tại có khớp với link

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
                <Link
                  to="/"
                  className={`${style.navLink} ${
                    isActive("/") ? style.active : ""
                  }`}
                >
                  Trang chủ
                </Link>
              </li>
              <li className={style.navItem}>
                <Link
                  to="Hairhub/aboutUs"
                  className={`${style.navLink} ${
                    isActive("Hairhub/aboutUs") ? style.active : ""
                  }`}
                >
                  Giới thiệu
                </Link>
              </li>
              <li className={style.navItem}>
                <Link
                  to="/list_salon_ver2"
                  className={`${style.navLink} ${
                    isActive("/list_salon_ver2") ? style.active : ""
                  }`}
                >
                  Hệ thống cửa hàng
                </Link>
              </li>
              {menuActive && (
                <>
                  <li className={style.navItemRepo}>
                    <Link to="/" className={style.navLink}>
                      Trang chủ
                    </Link>
                  </li>
                  <li className={style.navItemRepo}>
                    <Link to="/list_salon_ver2" className={style.navLink}>
                      Hệ thống cửa hàng
                    </Link>
                  </li>
                  <li className={style.navItemRepo}>
                    <Link to="/login" className={style.navLink}>
                      Đăng nhập
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>

          <button className={style.menuToggle} onClick={toggleMenu}>
            <IoMenu />
          </button>

          <Link to="/login" className={style.loginLink}>
            <span>Đăng nhập</span>
          </Link>
        </div>
      </header>
      <Outlet />
    </div>
  );
}

export default HeaderUnAuth;
