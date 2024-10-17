/* eslint-disable react/prop-types */
import React, { useRef, useEffect, useState } from "react";
import style from "../css/header.module.css";
import {
  actUpdateNotificationList,
  actGetNotificationList,
} from "@/store/notification/action";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as signalR from "@microsoft/signalr";

const NotificationComponent = ({
  isVisible,
  toggleNotification,
  notificationRef,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notificationList = useSelector(
    (state) => state.NOTIFICATION.notificationList
  );

  console.log("notificationList", notificationList);

  const idCustomer = useSelector((state) => state.ACCOUNT.idCustomer);
  const idOwner = useSelector((state) => state.ACCOUNT.idOwner);
  const idEmployee = useSelector((state) => state.ACCOUNT.idEmployee);
  const uid = useSelector((state) => state.ACCOUNT.uid);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

  // useEffect(() => {
  //   let connection;
  //   const setupSignalR = async () => {
  //     try {
  //       // Tạo kết nối SignalR
  //       connection = new signalR.HubConnectionBuilder()
  //         .withUrl("https://hairhub.gahonghac.net/book-appointment-hub")
  //         .withAutomaticReconnect()
  //         .build();

  //       // Bắt đầu kết nối
  //       await connection.start();
  //       // Lắng nghe sự kiện "ReceiveMessage"
  //       connection.on(
  //         "ReceiveNotification",
  //         async (
  //           Title,
  //           Message,
  //           AccountIds,
  //           appointmentId,
  //           customerName,
  //           date
  //         ) => {
  //           console.log("title", Title);
  //           console.log("AccountIds", AccountIds);

  //           if (AccountIds?.includes(uid) && uid) {
  //             console.log("UID exists in AccountIds:", uid);
  //             dispatch(actGetNotificationList(uid, page, size));
  //           } else {
  //             console.error("lỗi rồi");
  //           }
  //         }
  //       );
  //     } catch (error) {
  //       console.error("Lỗi khi thiết lập SignalR:", error);
  //     }
  //   };

  //   setupSignalR();

  //   // Dọn dẹp kết nối khi component bị hủy
  //   return () => {
  //     if (connection) {
  //       connection.stop().then(() => {
  //         console.log("Kết nối SignalR đã được dừng.");
  //       });
  //     }
  //   };
  // }, [uid]);
  useEffect(() => {
    let connection;
    const setupSignalR = async () => {
      try {
        connection = new signalR.HubConnectionBuilder()
          .withUrl("https://hairhub.gahonghac.net/book-appointment-hub")
          .withAutomaticReconnect()
          .build();
  
        await connection.start();
  
        connection.on(
          "ReceiveNotification",
          async (Title, Message, AccountIds, appointmentId, customerName, date) => {
            console.log("title", Title);
            console.log("AccountIds", AccountIds);
  
            if (AccountIds?.includes(uid) && uid) {
              console.log("UID exists in AccountIds:", uid);
  
              // Dispatch chỉ nên được gọi nếu `uid` có giá trị và khác với lần trước đó
              dispatch(actGetNotificationList(uid, page, size));
            } else {
              console.error("lỗi rồi");
            }
          }
        );
      } catch (error) {
        console.error("Lỗi khi thiết lập SignalR:", error);
      }
    };
  
    if (uid) {
      setupSignalR();
    }
  
    return () => {
      if (connection) {
        connection.stop().then(() => {
          console.log("Kết nối SignalR đã được dừng.");
        });
      }
    };
  }, [uid]);  // Kiểm tra xem chỉ khi uid thay đổi, useEffect mới chạy lại
  

  useEffect(() => {
    if (uid) {
      dispatch(actGetNotificationList(uid, page, size));
    }
  }, [page, size]);

  const [filter, setFilter] = useState("All");
  const handleReaded = async (id, idAppointment) => {
    if (id) {
      await dispatch(actUpdateNotificationList(id, uid, page, size));

      // Điều hướng dựa trên sự tồn tại của các ID
      if (idCustomer) {
        navigate("/customer_appointment");
      } else if (idEmployee) {
        navigate("/employee_appointment");
      } else if (idOwner) {
        navigate("/salon_appointment");
      }
    }
  };

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
      {/* <div className={style.notificationFilter}>
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
      </div> */}
      <div className={style.notificationContent}>
        {/* {notifications.map((notification, index) => (
          <div
            key={index}
            className={style.notificationItem}
            onClick={() => handleReaded(notification?.id)}
          >
            <h4 className={style.notificationTitle}>{notification.title}</h4>
            <p className={style.notificationSubTitle}>
              {notification.subTitle}
            </p>
          </div>
        ))} */}
        {/* {notificationList?.items?.length > 0 ? (
          notificationList?.items?.map((notificationObj, index) => {
            const { notification, appointment } = notificationObj;

            // Nếu `idCustomer` tồn tại, thay đổi thông điệp
            const message =
              notification.type === "newAppointment" && idCustomer
                ? `Bạn đã đặt lịch ở cửa tiệm của bạn vào lúc ${
                    notification.message.split("lúc ")[1]
                  }`
                : notification.message;

            return (
              <div
                key={index}
                className={style.notificationItem}
                onClick={() => handleReaded(notification.id, appointment.id)}
              >
                <h4 className={style.notificationTitle}>
                  {notification.title}
                </h4>
                <p className={style.notificationSubTitle}>{message}</p>
              </div>
            );
          })
        ) : (
          <h4 className={style.notificationTitle}>
            Bạn chưa nhận thông báo nào
          </h4>
        )} */}
        {notificationList?.items?.length > 0 ? (
          <>
            {notificationList.items.map((notificationObj, index) => {
              const { notification, appointment } = notificationObj;

              // If `idCustomer` exists, change the message
              const message =
                notification.type === "newAppointment" && idCustomer
                  ? `Bạn đã đặt lịch ở cửa tiệm của bạn vào lúc ${
                      notification.message.split("lúc ")[1]
                    }`
                  : notification.message;

              return (
                <div
                  key={index}
                  className={style.notificationItem}
                  onClick={() => handleReaded(notification.id, appointment.id)}
                >
                  <h4 className={style.notificationTitle}>
                    {notification.title}
                  </h4>
                  <p className={style.notificationSubTitle}>{message}</p>
                </div>
              );
            })}
            {page > 1 && (
              <button
                className={style.backButton}
                onClick={() => setPage((prevPage) => prevPage - 1)}
              >
                Trở về
              </button>
            )}
            {/* Calculate the total loaded items based on the current page */}
            {notificationList.total >
              (page - 1) * size + notificationList.items.length && (
              <button
                className={style.loadMoreButton}
                onClick={() => setPage((prevPage) => prevPage + 1)}
              >
                Xem thêm
              </button>
            )}
          </>
        ) : (
          <h4 className={style.notificationTitle}>
            Bạn chưa nhận thông báo nào
          </h4>
        )}
      </div>
    </div>
  );
};

export default NotificationComponent;
