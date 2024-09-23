import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HomeOutlined,
  CalendarOutlined,
  ShopOutlined,
  AreaChartOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import style from "../css/footer-mobile.module.css";

function FooterMobileAuth() {
  const idCustomer = useSelector((state) => state.ACCOUNT.idCustomer);
  const idOwner = useSelector((state) => state.ACCOUNT.idOwner);
  const idEmployee = useSelector((state) => state.ACCOUNT.idEmployee);
  const navigate = useNavigate();

  const handleEmptySalon = () => {
    return idOwner ? "/list_shop" : "/create_shop";
  };

  return (
    <footer className={style.footerMobile}>
      <nav className={style.footerNav}>
        <ul className={style.footerList}>
          {idCustomer && (
            <>
              <li className={style.footerItem}>
                <Link to="/">
                  <HomeOutlined />
                  <span>Trang chủ</span>
                </Link>
              </li>
              <li className={style.footerItem}>
                <Link to="/list_salon_ver2">
                  <ShopOutlined />
                  <span>Hệ thống</span>
                </Link>
              </li>
              <li className={style.footerItem}>
                <Link to="/customer_appointment">
                  <CalendarOutlined />
                  <span>Cuộc hẹn</span>
                </Link>
              </li>
            </>
          )}
          {idEmployee && (
            <>
              <li className={style.footerItem}>
                <Link to="/SalonEmployee">
                  <ShopOutlined />
                  <span>Thông tin cửa hàng</span>
                </Link>
              </li>
              <li className={style.footerItem}>
                <Link to="/EmployeeStatistics">
                  <AreaChartOutlined />
                  <span>Thống kê cá nhân</span>
                </Link>
              </li>
            </>
          )}
          {idOwner && (
            <>
              <li className={style.footerItem}>
                <Link to={handleEmptySalon()}>
                  <ShopOutlined />
                  <span>Quản lý Salon</span>
                </Link>
              </li>
              <li className={style.footerItem}>
                <Link to="/salon_appointment">
                  <CalendarOutlined />
                  <span>Cuộc hẹn</span>
                </Link>
              </li>
              <li className={style.footerItem}>
                <Link to="/salon_report">
                  <WarningOutlined />
                  <span>Báo cáo</span>
                </Link>
              </li>
              <li className={style.footerItem}>
                <Link to="/dashboardTransaction" className={style.navLink}>
                  <AreaChartOutlined />
                  <span>Thống kê doanh thu</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </footer>
  );
}

export default FooterMobileAuth;
