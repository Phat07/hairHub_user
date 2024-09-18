import React from "react";
import { Link } from "react-router-dom";
import {
  HomeOutlined,
  SnippetsOutlined,
  ShopOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import style from "../css/footer-mobile.module.css";

function FooterMobileUnAuth() {
  return (
    <footer className={style.footerMobile}>
      <nav className={style.footerNav}>
        <ul className={style.footerList}>
          <li className={style.footerItem}>
            <Link to="/">
              <HomeOutlined />
              <span>Trang chủ</span>
            </Link>
          </li>
          <li className={style.footerItem}>
            <Link to="/about">
              <SnippetsOutlined />
              <span>Giới thiệu</span>
            </Link>
          </li>
          <li className={style.footerItem}>
            <Link to="/list_salon_ver2">
              <ShopOutlined />
              <span>Hệ thống</span>
            </Link>
          </li>
          <li className={style.footerItem}>
            <Link to={"/login"}>
              <LoginOutlined />
              <span>Đăng nhập</span>
            </Link>
          </li>
        </ul>
      </nav>
    </footer>
  );
}

export default FooterMobileUnAuth;
