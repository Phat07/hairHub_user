/* eslint-disable react/prop-types */
import React, { useRef, useEffect } from "react";
import style from "../css/header.module.css";

const NotificationComponent = ({
  isVisible,
  toggleNotification,
  notificationRef,
}) => {
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
