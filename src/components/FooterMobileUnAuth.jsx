import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeOutlined,
  SnippetsOutlined,
  ShopOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import style from "../css/footer-mobile.module.css";

function FooterMobileUnAuth() {
  const location = useLocation(); // Lấy thông tin đường dẫn hiện tại

  const isActive = (path) => location.pathname === path; // Kiểm tra đường dẫn hiện tại
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <footer className={style.footerMobile}>
      <nav className={style.footerNav}>
        <ul className={style.footerList}>
          <li
            className={`${style.footerItem} ${
              isActive("/") ? style.active : ""
            }`}
          >
            <Link to="/" onClick={scrollToTop}>
              <HomeOutlined className={style.icon} />
              <span>Trang chủ</span>
            </Link>
          </li>
          <li
            className={`${style.footerItem} ${
              isActive("/about") ? style.active : ""
            }`}
          >
            <Link to="/about" onClick={scrollToTop}>
              <SnippetsOutlined className={style.icon} />
              <span>Giới thiệu</span>
            </Link>
          </li>
          <li
            className={`${style.footerItem} ${
              isActive("/list_salon_ver2") ? style.active : ""
            }`}
          >
            <Link to="/list_salon_ver2" onClick={scrollToTop}>
              <ShopOutlined className={style.icon} />
              <span>Hệ thống</span>
            </Link>
          </li>
          {/* <li
            className={`${style.footerItem} ${
              isActive("/login") ? style.active : ""
            }`}
          >
            <Link to="/login" onClick={scrollToTop}>
              <LoginOutlined className={style.icon} />
              <span>Đăng nhập</span>
            </Link>
          </li> */}
        </ul>
      </nav>
    </footer>
  );
}

export default FooterMobileUnAuth;
