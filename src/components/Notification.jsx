/* eslint-disable react/prop-types */
import React, { useRef, useEffect, useState } from "react";
import style from "../css/header.module.css";
import {
  actUpdateNotificationList,
  actGetNotificationList,
} from "@/store/notification/action";
import { useDispatch, useSelector } from "react-redux";

const NotificationComponent = ({
  isVisible,
  toggleNotification,
  notificationRef,
}) => {
  const dispatch = useDispatch();
  const notificationList = useSelector(
    (state) => state.NOTIFICATION.notificationList
  );
  const idCustomer = useSelector((state) => state.ACCOUNT.idCustomer);
  const idOwner = useSelector((state) => state.ACCOUNT.idOwner);
  const idEmployee = useSelector((state) => state.ACCOUNT.idEmployee);
  const uid = useSelector((state) => state.ACCOUNT.uid);

  useEffect(() => {
    if (idCustomer || idOwner || idEmployee || uid) {
      dispatch(actGetNotificationList(uid));
    }
    // dispatch(actGetSalonEmployeeServiceById(employeeId))
  }, [idCustomer, idOwner, idEmployee, uid]);

  const notifications = [
    {
      title: "Cập nhật hệ thống",
      subTitle: "Hệ thống sẽ bảo trì vào 10h tối nay.",
    },
    { title: "Khuyến mãi", subTitle: "Giảm giá 50% cho đơn hàng tiếp theo." },
    {
      title: "Thông báo bảo mật",
      subTitle: "Vui lòng cập nhật mật khẩu của bạn.",
    },
    {
      title: "Cập nhật hệ thống",
      subTitle: "Hệ thống sẽ bảo trì vào 10h tối nay.",
    },
    { title: "Khuyến mãi", subTitle: "Giảm giá 50% cho đơn hàng tiếp theo." },
    {
      title: "Thông báo bảo mật",
      subTitle: "Vui lòng cập nhật mật khẩu của bạn.",
    },
    {
      title: "Cập nhật hệ thống",
      subTitle: "Hệ thống sẽ bảo trì vào 10h tối nay.",
    },
    { title: "Khuyến mãi", subTitle: "Giảm giá 50% cho đơn hàng tiếp theo." },
    {
      title: "Thông báo bảo mật",
      subTitle: "Vui lòng cập nhật mật khẩu của bạn.",
    },
  ];
  const [filter, setFilter] = useState("Tất cả");
  return (
    <div
      ref={notificationRef} // Gán ref vào div thông báo
      className={`${style.customNotification} ${isVisible ? style.show : ""}`}
    >
      <div className={style.notificationHeader}>
        <p>Thông báo</p>
        <div className={style.notificationButtonClose}>
          <button onClick={toggleNotification}>Đóng</button>
        </div>
      </div>
      <div className={style.notificationFilter}>
        <div
          className={filter === "All" ? style.activeButton : ""}
          onClick={() => setFilter("All")}
        >
          Tất cả
        </div>
        <div
          className={filter === "Unread" ? style.activeButton : ""}
          onClick={() => setFilter("Unread")}
        >
          Chưa đọc
        </div>
      </div>
      <div className={style.notificationContent}>
        {notifications.map((notification, index) => (
          <div key={index} className={style.notificationItem}>
            <h4 className={style.notificationTitle}>{notification.title}</h4>
            <p className={style.notificationSubTitle}>
              {notification.subTitle}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationComponent;
