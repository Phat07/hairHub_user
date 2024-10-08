import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom"; // Import useLocation
import {
  HomeOutlined,
  CalendarOutlined,
  ShopOutlined,
  AreaChartOutlined,
  WarningOutlined,
  QrcodeOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import style from "../css/footer-mobile.module.css";
import QRScannerModal from "./QRScannerModal";

function FooterMobileAuth() {
  const idCustomer = useSelector((state) => state.ACCOUNT.idCustomer);
  const idOwner = useSelector((state) => state.ACCOUNT.idOwner);
  const idEmployee = useSelector((state) => state.ACCOUNT.idEmployee);
  const [isModalVisibleQr, setIsModalVisibleQr] = useState(false);

  const location = useLocation(); // Lấy đường dẫn hiện tại

  const showModalQr = () => {
    setIsModalVisibleQr(true);
  };

  // Hàm đóng modal
  const closeModal = () => {
    setIsModalVisibleQr(false);
  };
  const handleEmptySalon = () => {
    return idOwner ? "/list_shop" : "/create_shop";
  };

  // Hàm kiểm tra đường dẫn hiện tại có khớp với link hay không
  const isActive = (path) => location.pathname === path;
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <footer className={style.footerMobile}>
      <nav className={style.footerNav}>
        <ul className={style.footerList}>
          {idCustomer && (
            <>
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
                  isActive("/list_salon_ver2") ? style.active : ""
                }`}
              >
                <Link to="/list_salon_ver2" onClick={scrollToTop}>
                  <ShopOutlined className={style.icon} />
                  <span>Hệ thống</span>
                </Link>
              </li>
              <li
                className={`${style.footerItem} ${
                  isActive("/customer_appointment") ? style.active : ""
                }`}
              >
                <Link to="/customer_appointment" onClick={scrollToTop}>
                  <CalendarOutlined className={style.icon} />
                  <span>Cuộc hẹn</span>
                </Link>
              </li>
              <li
                style={{ cursor: "pointer" }}
                className={`${style.footerItem}`}
                onClick={showModalQr}
              >
                <Link>
                  <QrcodeOutlined className={style.icon} />
                  <span>Quét Qr </span>
                </Link>
              </li>
            </>
          )}
          {idEmployee && (
            <>
              <li
                className={`${style.footerItem} ${
                  isActive("/SalonEmployee") ? style.active : ""
                }`}
              >
                <Link to="/SalonEmployee" onClick={scrollToTop}>
                  <ShopOutlined className={style.icon} />
                  <span>Thông tin cửa hàng</span>
                </Link>
              </li>
              <li
                className={`${style.footerItem} ${
                  isActive("/employee_appointment") ? style.active : ""
                }`}
              >
                <Link to="/employee_appointment" onClick={scrollToTop}>
                  <CalendarOutlined />
                  <span>Cuộc hẹn</span>
                </Link>
              </li>
              {/* <li
                className={`${style.footerItem} ${
                  isActive("/EmployeeSchedule") ? style.active : ""
                }`}
              >
                <Link to="/EmployeeSchedule" onClick={scrollToTop}>
                  <CalendarOutlined />
                  <span>Cuộc hẹn</span>
                </Link>
              </li> */}
              <li
                className={`${style.footerItem} ${
                  isActive("/EmployeeStatistics") ? style.active : ""
                }`}
              >
                <Link to="/EmployeeStatistics" onClick={scrollToTop}>
                  <AreaChartOutlined className={style.icon} />
                  <span>Thống kê cá nhân</span>
                </Link>
              </li>
            </>
          )}
          {idOwner && (
            <>
              <li
                className={`${style.footerItem} ${
                  isActive(handleEmptySalon()) ? style.active : ""
                }`}
              >
                <Link to={handleEmptySalon()} onClick={scrollToTop}>
                  <ShopOutlined className={style.icon} />
                  <span>Quản lý Salon</span>
                </Link>
              </li>
              <li
                className={`${style.footerItem} ${
                  isActive("/salon_appointment") ? style.active : ""
                }`}
              >
                <Link to="/salon_appointment" onClick={scrollToTop}>
                  <CalendarOutlined className={style.icon} />
                  <span>Cuộc hẹn</span>
                </Link>
              </li>
              <li
                className={`${style.footerItem} ${
                  isActive("/salon_report") ? style.active : ""
                }`}
              >
                <Link to="/salon_report" onClick={scrollToTop}>
                  <WarningOutlined className={style.icon} />
                  <span>Báo cáo</span>
                </Link>
              </li>
              <li
                className={`${style.footerItem} ${
                  isActive("/dashboardTransaction") ? style.active : ""
                }`}
              >
                <Link to="/dashboardTransaction" onClick={scrollToTop}>
                  <AreaChartOutlined className={style.icon} />
                  <span>Doanh thu</span>
                </Link>
              </li>
              <li
                className={`${style.footerItem} ${
                  isActive("/reviewEmployee") ? style.active : ""
                }`}
              >
                <Link to="/reviewEmployee">
                  <AreaChartOutlined className={style.icon} />
                  <span>Nhân viên</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
      <QRScannerModal
        isVisible={isModalVisibleQr}
        onClose={closeModal}
        idCustomer={idCustomer}
      />
    </footer>
  );
}

export default FooterMobileAuth;
