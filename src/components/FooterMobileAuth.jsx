import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom"; // Import useLocation
import {
  HomeOutlined,
  CalendarOutlined,
  ShopOutlined,
  AreaChartOutlined,
  WarningOutlined,
  QrcodeOutlined,
  RadarChartOutlined,
  UserOutlined,
  FormOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import style from "../css/footer-mobile.module.css";
import QRScannerModal from "./QRScannerModal";

function FooterMobileAuth() {
  const idCustomer = useSelector((state) => state.ACCOUNT.idCustomer);
  const idOwner = useSelector((state) => state.ACCOUNT.idOwner);
  const idEmployee = useSelector((state) => state.ACCOUNT.idEmployee);
  const [isModalVisibleQr, setIsModalVisibleQr] = useState(false);
  const uid = useSelector((state) => state.ACCOUNT.uid);
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
                  {isActive("/") && <span>Trang chủ</span>}
                </Link>
              </li>
              <li
                className={`${style.footerItem} ${
                  isActive("/list_salon_ver2") ? style.active : ""
                }`}
              >
                <Link to="/list_salon_ver2" onClick={scrollToTop}>
                  <ShopOutlined className={style.icon} />
                  {isActive("/list_salon_ver2") && <span>Hệ thống</span>}
                </Link>
              </li>
              <li
                style={{ cursor: "pointer" }}
                className={`${style.footerItemQR}`}
                onClick={showModalQr}
              >
                <Link>
                  <QrcodeOutlined
                    className={style.icon}
                    style={{ fontSize: "28px" }}
                  />
                  {/* <span>Quét Qr </span> */}
                </Link>
              </li>
              <li
                className={`${style.footerItem} ${
                  isActive("/customer_appointment") ? style.active : ""
                }`}
              >
                <Link to="/customer_appointment" onClick={scrollToTop}>
                  <CalendarOutlined className={style.icon} />
                  {isActive("/customer_appointment") && <span>Cuộc hẹn</span>}
                </Link>
              </li>
              <li
                className={`${style.footerItem} ${
                  isActive(`/Account/${uid}`) ? style.active : ""
                }`}
              >
                <Link to={`/Account/${uid}`} onClick={scrollToTop}>
                  <UserOutlined className={style.icon} />
                  {isActive(`/Account/${uid}`) && <span>Người dùng</span>}
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
                  {isActive("/SalonEmployee") && (
                    <span>Thông tin cửa hàng</span>
                  )}
                </Link>
              </li>
              <li
                className={`${style.footerItem} ${
                  isActive("/employee_appointment") ? style.active : ""
                }`}
              >
                <Link to="/employee_appointment" onClick={scrollToTop}>
                  <CalendarOutlined />
                  {isActive("/employee_appointment") && <span>Cuộc hẹn</span>}
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
                  {isActive("/EmployeeStatistics") && (
                    <span>Thống kê cá nhân</span>
                  )}
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
                  {isActive(handleEmptySalon()) && <span>Salon</span>}
                </Link>
              </li>
              <li
                className={`${style.footerItem} ${
                  isActive("/salon_appointment") ? style.active : ""
                }`}
              >
                <Link to="/salon_appointment" onClick={scrollToTop}>
                  <CalendarOutlined className={style.icon} />
                  {isActive("/salon_appointment") && <span>Cuộc hẹn</span>}
                </Link>
              </li>
              {/* <li
                className={`${style.footerItem} ${
                  isActive("/salon_report") ? style.active : ""
                }`}
              >
                <Link to="/salon_report" onClick={scrollToTop}>
                  <WarningOutlined className={style.icon} />
                  {isActive("/salon_report") && <span>Báo cáo</span>}
                </Link>
              </li> */}
               <li
                className={`${style.footerItem} ${
                  isActive("/manageEmployeeScheduler") ? style.active : ""
                }`}
              >
                <Link to="/manageEmployeeScheduler" onClick={scrollToTop}>
                  <FormOutlined  className={style.icon} />
                  {isActive("/manageEmployeeScheduler") && <span>Lịch làm việc</span>}
                </Link>
              </li>
              <li
                className={`${style.footerItem} ${
                  isActive("/dashboardTransaction") ? style.active : ""
                }`}
              >
                <Link to="/dashboardTransaction" onClick={scrollToTop}>
                  <AreaChartOutlined className={style.icon} />
                  {isActive("/dashboardTransaction") && <span>Doanh thu</span>}
                </Link>
              </li>
              <li
                className={`${style.footerItem} ${
                  isActive("/reviewEmployee") ? style.active : ""
                }`}
              >
                <Link to="/reviewEmployee">
                  <RadarChartOutlined className={style.icon} />
                  {isActive("/reviewEmployee") && <span>Nhân viên</span>}
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
