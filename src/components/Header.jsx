import {
  BellOutlined,
  ContainerOutlined,
  CreditCardOutlined,
  LogoutOutlined,
  QrcodeOutlined,
  SnippetsOutlined,
  UserOutlined,
  WalletOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Avatar, Badge, Dropdown, Menu, message } from "antd";
import { useEffect, useRef, useState } from "react";
import { IoMenu } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import hairHubLogo from "../assets/images/hairhubFinalLogo.png";
import "../css/flaticon.min.css";
import style from "../css/header.module.css";
import { actGetSalonInformationByOwnerIdByCheck } from "../store/salonInformation/action";
import NotificationComponent from "./Notification";
import QRScannerModal from "./QRScannerModal";
import { AccountServices } from "@/services/accountServices";
import { clearUserInfo } from "@/store/account/action";

function Header(props) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // Lấy đường dẫn hiện tại
  const dispatch = useDispatch();
  const [newAppointments, setNewAppointments] = useState(0);
  // const userName = useSelector((state) => state.ACCOUNT.userName);
  const idCustomer = useSelector((state) => state.ACCOUNT.idCustomer);
  const idOwner = useSelector((state) => state.ACCOUNT.idOwner);
  const idEmployee = useSelector((state) => state.ACCOUNT.idEmployee);
  const uid = useSelector((state) => state.ACCOUNT.uid);
  const salonDetail = useSelector(
    (state) => state.SALONINFORMATION.getSalonByOwnerId
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleQr, setIsModalVisibleQr] = useState(false);

  // Hàm mở modal
  const showModalQr = () => {
    setIsModalVisibleQr(true);
  };
  const notificationList = useSelector(
    (state) => state.NOTIFICATION.notificationList
  );
  const notificationListUnread = useSelector(
    (state) => state.NOTIFICATION.notificationListUnread
  );
  // Hàm đóng modal
  const closeModal = () => {
    setIsModalVisibleQr(false);
  };

  const salonServicesList = useSelector(
    (state) => state.SALONEMPLOYEES.salonServicesList
  );

  const account = useSelector((state) => state.ACCOUNT.username);
  const email = useSelector((state) => state.ACCOUNT.email);
  const userInfo = useSelector((state) => state.ACCOUNT.userInfo);

  const avatar = useSelector((state) => state.ACCOUNT.avatar);

  useEffect(() => {
    if (idOwner) {
      try {
        dispatch(actGetSalonInformationByOwnerIdByCheck(idOwner, navigate));
      } catch (err) {
        // console.log(err, "errors");
      }
    }
  }, [idOwner]);

  const handleSignOut = () => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (refreshToken) {
      AccountServices.LogOut(refreshToken)
        .then(async () => {
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("role");
          await dispatch(clearUserInfo());
          message.success("Đăng xuất thành công");
          navigate("/");
        })
        .catch((error) => {
          message.error(error?.response?.data?.message);
        });
    }
  };

  const handleEmptySalon = () => {
    if (!salonDetail) {
      return "/create_shop";
    } else {
      return "/list_shop";
    }
  };

  // const accountMenu = (
  //   <Menu>
  //     <Menu.Item key="username" disabled>
  //       {account}
  //     </Menu.Item>
  //     <Menu.Item key="profile">
  //       <Link to={`/Account/${uid}`}>
  //         <UserOutlined /> Thông tin cá nhân
  //       </Link>
  //     </Menu.Item>
  //     <Menu.Item key="logout" onClick={handleSignOut}>
  //       <LogoutOutlined /> Đăng xuất
  //     </Menu.Item>
  //   </Menu>
  // );

  const accountMenu = (
    <Menu className="w-[240px]">
      <Menu.Item key="profile-header" disabled className="profile-header">
        <div className="flex flex-col items-center">
          {/* <div className="w-10 h-10 rounded-full bg-[#BF9456] flex items-center justify-center text-white font-bold">
            <UserOutlined />
          </div> */}
          <Avatar
            className={style.avatarLinkModal}
            src={userInfo?.img || <UserOutlined />}
          />
          <div className="mt-2 font-bold" style={{ textAlign: "center" }}>
            {userInfo?.fullName}
          </div>
          <div className="text-sm">{userInfo?.email}</div>
        </div>
      </Menu.Item>
      {!idEmployee && (
        <Menu.Item key="wallet">
          <div className="flex justify-center">
            <span>
              Số tiền trong ví :{" "}
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(userInfo?.balance)}
            </span>
          </div>
          <div className="flex justify-center mt-2">
            <Link to="/payment">
              <button className="px-6 py-2 text-white bg-[#BF9456] hover:bg-[#d0ac79] rounded-md transition-all">
                Nạp tiền vào ví
              </button>
            </Link>
          </div>
        </Menu.Item>
      )}

      <Menu.Divider />

      <Menu.Item key="profile">
        <Link to={`/Account/${uid}`}>
          <UserOutlined /> Trang cá nhân
        </Link>
      </Menu.Item>
      {/* <Menu.Item key="report">
        <Link to="/salon_appointment">
          <UserOutlined /> Lịch sử lịch hẹn
        </Link>
      </Menu.Item> */}
      {!idEmployee && (
        <Menu.Item key="appointment-history">
          <Link to="/WithdrawRequest">
            <CreditCardOutlined /> Đơn rút tiền
          </Link>
        </Menu.Item>
      )}
      {!idEmployee && (
        <Menu.Item key="transaction-history">
          <Link to={"/managerPayment"}>
            <WalletOutlined /> Lịch sử giao dịch
          </Link>
        </Menu.Item>
      )}
      {idOwner && (
        <Menu.Item key="salon_appointment">
          <Link to="/salon_appointment">
            <SnippetsOutlined /> Lịch sử lịch hẹn
          </Link>
        </Menu.Item>
      )}
      {/* {idOwner && (
        <Menu.Item key="ReviewAppointmentCustomer">
          <Link to="/ReviewAppointmentCustomer">
            <WarningOutlined /> Khảo sát khách hàng
          </Link>
        </Menu.Item>
      )} */}
      {idOwner && (
        <Menu.Item key="salon_report">
          <Link to="/salon_report">
            <WarningOutlined /> Lịch sử báo cáo
          </Link>
        </Menu.Item>
      )}
      {idOwner && (
        <Menu.Item key="dashboardTransaction">
          <Link to="/dashboardTransaction">
            <ContainerOutlined /> Phí hoa hồng hằng tháng
          </Link>
        </Menu.Item>
      )}
      <Menu.Divider />

      <Menu.Item key="logout" onClick={handleSignOut}>
        <LogoutOutlined /> Đăng xuất
      </Menu.Item>
    </Menu>
  );

  const [menuActive, setMenuActive] = useState(false);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  const isActive = (path) => location.pathname === path;
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const [isNotificationVisible, setNotificationVisible] = useState(false);
  const notificationRef = useRef(null); // Tạo ref để tham chiếu đến thông báo

  const toggleNotification = (e) => {
    // e.stopPropagation();
    setNotificationVisible(!isNotificationVisible); // Đóng/mở modal
  };

  // Lắng nghe nhấn chuột bên ngoài modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Nếu nhấn vào Badge thì không đóng modal
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target) &&
        !event.target.closest(".ant-badge")
      ) {
        setNotificationVisible(false); // Đóng modal
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // console.log("noti", notificationList);

  return (
    <div>
      <header className={style.headerContainer}>
        <div className={style.header}>
          <div className={style.logoContainer}>
            <Link
              to={
                idOwner
                  ? handleEmptySalon()
                  : idEmployee
                  ? "/SalonEmployee"
                  : "/"
              }
              onClick={scrollToTop}
            >
              <img
                className={style.logo}
                src={hairHubLogo}
                alt="HairHub Logo"
              />
            </Link>
          </div>

          {/* Customer Navigation */}
          {idCustomer && (
            <nav className={style.navbar}>
              <ul className={style.navList}>
                <li className={style.navItem}>
                  <Link
                    to={"/"}
                    className={`${style.navLink} ${
                      isActive("/") ? style.active : ""
                    }`}
                    onClick={scrollToTop}
                  >
                    Trang chủ
                  </Link>
                </li>
                <li className={style.navItem}>
                  <Link
                    to={"/list_salon_ver2"}
                    className={`${style.navLink} ${
                      isActive("/list_salon_ver2") ? style.active : ""
                    }`}
                    onClick={scrollToTop}
                  >
                    Hệ thống cửa hàng
                  </Link>
                </li>
                <li className={style.navItem}>
                  <Link
                    to={"/customer_appointment"}
                    className={`${style.navLink} ${
                      isActive("/customer_appointment") ? style.active : ""
                    }`}
                    onClick={scrollToTop}
                  >
                    Cuộc hẹn
                  </Link>
                </li>
                <li
                  style={{ cursor: "pointer" }}
                  className={style.navItem}
                  onClick={showModalQr}
                >
                  <QrcodeOutlined className={style.qr} />
                </li>
                {menuActive && (
                  <>
                    <li className={style.navItemRepo}>
                      <Link to={"/"} className={style.navLink}>
                        Trang chủ
                      </Link>
                    </li>
                    <li className={style.navItemRepo}>
                      <Link to={"/list_salon_ver2"} className={style.navLink}>
                        Hệ thống cửa hàng
                      </Link>
                    </li>
                    <li className={style.navItemRepo}>
                      <Link
                        to={"/customer_appointment"}
                        className={style.navLink}
                      >
                        Cuộc hẹn
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          )}

          {idEmployee && (
            <nav className={style.navbar}>
              <ul className={style.navList}>
                <li className={style.navItem}>
                  <Link
                    to={"/SalonEmployee"}
                    className={`${style.navLink} ${
                      isActive("/SalonEmployee") ? style.active : ""
                    }`}
                    onClick={scrollToTop}
                  >
                    Thông tin cửa hàng
                  </Link>
                </li>
                <li className={style.navItem}>
                  <Link
                    to={"/employee_appointment"}
                    className={`${style.navLink} ${
                      isActive("/employee_appointment") ? style.active : ""
                    }`}
                    onClick={scrollToTop}
                  >
                    Cuộc hẹn
                  </Link>
                </li>
                {/* <li className={style.navItem}>
                  <Link
                    to={"/EmployeeSchedule"}
                    className={`${style.navLink} ${
                      isActive("/EmployeeSchedule") ? style.active : ""
                    }`}
                    onClick={scrollToTop}
                  >
                    Cuộc hẹn
                  </Link>
                </li> */}
                <li className={style.navItem}>
                  <Link
                    to={"/EmployeeStatistics"}
                    className={`${style.navLink} ${
                      isActive("/EmployeeStatistics") ? style.active : ""
                    }`}
                    onClick={scrollToTop}
                  >
                    Thống kê cá nhân
                  </Link>
                </li>
                {menuActive && (
                  <>
                    <li className={style.navItemRepo}>
                      <Link to={"/SalonEmployee"} className={style.navLink}>
                        Thông tin cửa hàng
                      </Link>
                    </li>
                    <li className={style.navItemRepo}>
                      <Link
                        to={"/employee_appointment"}
                        className={style.navLink}
                      >
                        Cuộc hẹn
                      </Link>
                    </li>
                    <li className={style.navItemRepo}>
                      <Link
                        to={"/EmployeeStatistics"}
                        className={style.navLink}
                      >
                        Thống kê cá nhân
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          )}

          {/* Salon Navigation */}
          {idOwner && (
            <nav className={style.navbar}>
              <ul className={style.navList}>
                <li className={style.navItem}>
                  <Link
                    className={`${style.navLink} ${
                      isActive("/create_shop") || isActive("/list_shop")
                        ? style.active
                        : ""
                    }`}
                    to={handleEmptySalon()}
                    onClick={scrollToTop}
                  >
                    Quản lý Salon
                  </Link>
                </li>
                {/* <li className={style.navItem}>
                  <Link
                    to={"/salon_appointment"}
                    className={`${style.navLink} ${
                      isActive("/salon_appointment") ? style.active : ""
                    }`}
                    onClick={scrollToTop}
                  >
                    Cuộc hẹn
                  </Link>
                </li> */}
                <li className={style.navItem}>
                  <Link
                    to="/manageEmployeeScheduler"
                    className={`${style.navLink} ${
                      isActive("/manageEmployeeScheduler") ? style.active : ""
                    }`}
                    onClick={scrollToTop}
                  >
                    Lịch làm việc
                  </Link>
                </li>
                <li className={style.navItem}>
                  <Link
                    to="/revenueSalon"
                    className={`${style.navLink} ${
                      isActive("/revenueSalon") ? style.active : ""
                    }`}
                    onClick={scrollToTop}
                  >
                    Báo cáo
                  </Link>
                </li>
                <li className={style.navItem}>
                  <Link
                    to="/overviewSalon"
                    className={`${style.navLink} ${
                      isActive("/overviewSalon") ? style.active : ""
                    }`}
                  >
                    Tổng quan
                  </Link>
                </li>
                {menuActive && (
                  <>
                    <li className={style.navItemRepo}>
                      <Link to={"/"} className={style.navLink}>
                        Trang chủ
                      </Link>
                    </li>
                    <li className={style.navItemRepo}>
                      {/* <Link to="/salon_report" className={style.navLink}>
                        Danh sách báo cáo
                      </Link> */}
                      <Link
                        to="/manageEmployeeScheduler"
                        className={`${style.navLink} ${
                          isActive("/manageEmployeeScheduler")
                            ? style.active
                            : ""
                        }`}
                        onClick={scrollToTop}
                      >
                        Quản lý dịch vụ
                      </Link>
                    </li>
                    <li className={style.navItemRepo}>
                      <Link to="/revenueSalon" className={style.navLink}>
                        Thống kê doanh thu
                      </Link>
                    </li>
                    <li className={style.navItemRepo}>
                      <Link to={"/salon_appointment"} className={style.navLink}>
                        Cuộc hẹn
                      </Link>
                    </li>
                    <li className={style.navItemRepo}>
                      <Link className={style.navLink} to={handleEmptySalon()}>
                        Quản lý Salon
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          )}

          <button
            aria-label="toggle menu"
            className={style.menuToggle}
            onClick={toggleMenu}
          >
            <IoMenu />
          </button>
          {/* {avatar && (
            <Dropdown
              overlay={accountMenu}
              trigger={["click"]}
              // onClick={scrollToTop}
            >
              <a onClick={(e) => e.preventDefault()}>
                <Avatar
                  className={style.avatarLink}
                  src={avatar || <UserOutlined />}
                />
              </a>
            </Dropdown>
          )} */}
          {account && (
            <div style={{ cursor: "pointer" }} className={style.avatarContaint}>
              {isNotificationVisible ? (
                <Badge
                  count={notificationListUnread}
                  overflowCount={99}
                  onClick={toggleNotification}
                >
                  <BellOutlined className={style.iconHeaderActive} />
                </Badge>
              ) : (
                // </Badge>
                <Badge
                  count={notificationListUnread}
                  overflowCount={99}
                  onClick={toggleNotification}
                >
                  <BellOutlined className={style.iconHeader} />
                </Badge>
              )}
              <Dropdown overlay={accountMenu} trigger={["click"]}>
                <a onClick={(e) => e.preventDefault()}>
                  <Avatar
                    className={style.avatarLink}
                    src={avatar || <UserOutlined />}
                  />
                </a>
              </Dropdown>

              {/* <a onClick={showModal} style={{ marginLeft: "20px" }}>
                <Avatar
                  className={style.avatarLink}
                  src={avatar || <UserOutlined />}
                />
              </a> */}
            </div>
          )}
        </div>

        {/* <Modal
          title="Tài khoản của bạn"
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <div className={style.modalAvatar}>
            <Avatar
              className={style.avatarLink}
              src={avatar || <UserOutlined />}
            />
            <p style={{ marginBottom: "0", marginLeft: "10px" }}>{account}</p>
          </div>
          <div className={style.modalLinkContaint}>
            <p style={{ marginBottom: "0" }}>
              <Link to={`/Account/${uid}`} className={style.modalLink}>
                <UserOutlined /> Thông tin cá nhân
              </Link>
            </p>
            {idCustomer && (
              <>
                <li>
                  <Link to={"/"} className={style.modalLink}>
                    <HomeOutlined className={style.icon} /> Trang chủ
                  </Link>
                </li>
                <li>
                  <Link to={"/list_salon_ver2"} className={style.modalLink}>
                    <ShopOutlined className={style.icon} /> Hệ thống cửa hàng
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/customer_appointment"}
                    className={style.modalLink}
                  >
                    <CalendarOutlined className={style.icon} /> Cuộc hẹn
                  </Link>
                </li>
              </>
            )}

            {idEmployee && (
              <>
                <li>
                  <Link to={"/SalonEmployee"} className={style.modalLink}>
                    <ShopOutlined className={style.icon} /> Thông tin cửa hàng
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/employee_appointment"}
                    className={style.modalLink}
                  >
                    <CalendarOutlined className={style.icon} /> Cuộc hẹn
                  </Link>
                </li>
                <li>
                  <Link to={"/EmployeeStatistics"} className={style.modalLink}>
                    <AreaChartOutlined className={style.icon} /> Thống kê cá
                    nhân
                  </Link>
                </li>
              </>
            )}
            {idOwner && (
              <>
                <li>
                  <Link className={style.modalLink} to={handleEmptySalon()}>
                    <ShopOutlined className={style.icon} /> Quản lý Salon
                  </Link>
                </li>
                <li>
                  <Link to="/salon_report" className={style.modalLink}>
                    <WarningOutlined className={style.icon} /> Danh sách báo cáo
                  </Link>
                </li>
                <li>
                  <Link to="/dashboardTransaction" className={style.modalLink}>
                    <AreaChartOutlined className={style.icon} /> Thống kê doanh
                    thu
                  </Link>
                </li>
                <li>
                  <Link to={"/salon_appointment"} className={style.modalLink}>
                    <CalendarOutlined className={style.icon} /> Cuộc hẹn
                  </Link>
                </li>
                <li>
                  <Link to="/reviewEmployee" className={style.modalLink}>
                    <AuditOutlined className={style.icon} />
                    <span>Nhân viên</span>
                  </Link>
                </li>
              </>
            )}
          </div>
          <Button onClick={handleSignOut} icon={<LogoutOutlined />}>
            Đăng xuất
          </Button>
        </Modal> */}
        {/* <div
          ref={notificationRef} // Gán ref vào div thông báo
          className={`${style.customNotification} ${
            isNotificationVisible ? style.show : ""
          }`}
        >
          <div className={style.notificationContent}>
            <p>Danh sách thông báo của bạn...</p>
            <button onClick={toggleNotification}>Đóng</button>
          </div>
        </div> */}
        <NotificationComponent
          isVisible={isNotificationVisible}
          toggleNotification={toggleNotification}
          notificationRef={notificationRef}
        />
      </header>
      <QRScannerModal
        isVisible={isModalVisibleQr}
        onClose={closeModal}
        idCustomer={idCustomer}
      />
      <Outlet />
    </div>
  );
}

export default Header;
