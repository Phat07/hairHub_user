/* eslint-disable react/prop-types */
import React, { useRef, useEffect, useState } from "react";
import style from "../css/header.module.css";
import {
  actUpdateNotificationList,
  actGetNotificationList,
  actGetNotificationListUnread,
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



  const idCustomer = useSelector((state) => state.ACCOUNT.idCustomer);
  const idOwner = useSelector((state) => state.ACCOUNT.idOwner);
  const idEmployee = useSelector((state) => state.ACCOUNT.idEmployee);
  const uid = useSelector((state) => state.ACCOUNT.uid);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const containerRef = useRef(null); // Ref để theo dõi container
  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

    // Kiểm tra nếu đã cuộn tới cuối danh sách
    if (scrollTop + clientHeight >= scrollHeight) {
      if (notificationList?.total > notificationList?.size) {
        setSize((prevSize) => prevSize + 5); // Tăng kích thước mỗi lần thêm
      }
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    container.addEventListener("scroll", handleScroll);

    // Cleanup để tránh leak event listeners
    return () => container.removeEventListener("scroll", handleScroll);
  }, [notificationList?.size, notificationList?.total]);

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
          async (
            Title,
            Message,
            AccountIds,
            appointmentId,
            customerName,
            date
          ) => {
            if (AccountIds?.includes(uid) && uid) {
              // Dispatch chỉ nên được gọi nếu `uid` có giá trị và khác với lần trước đó
              dispatch(actGetNotificationList(uid, page, size));
              dispatch(actGetNotificationListUnread(uid));
            } else {
              // console.error("lỗi rồi");
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
  }, [uid]); // Kiểm tra xem chỉ khi uid thay đổi, useEffect mới chạy lại

  useEffect(() => {
    if (uid) {
      dispatch(actGetNotificationList(uid, page, size));
      dispatch(actGetNotificationListUnread(uid));
    }
    // dispatch(actGetSalonEmployeeServiceById(employeeId))
  }, [uid, page, size]);

  const [filter, setFilter] = useState("All");
  const handleReaded = async (id, idAppointment, Isread) => {
    if (!Isread && id) {
      // Nếu chưa đọc và có ID, thực hiện cập nhật thông báo
      await dispatch(actUpdateNotificationList(id, uid, page, size));
    }
    toggleNotification();
    // Điều hướng dựa trên role
    if (idCustomer) {
      navigate(`/customer_appointment?appointmentId=${idAppointment}`);
    } else if (idEmployee) {
      navigate(`/employee_appointment?appointmentId=${idAppointment}`);
    } else if (idOwner) {
      navigate(`/salon_appointment?appointmentId=${idAppointment}`);
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
      <div ref={containerRef} className={style.notificationContent}>
        {notificationList?.items?.length > 0 ? (
          notificationList?.items?.map((notificationObj, index) => {
            const { notification, appointment } = notificationObj;
            // Nếu `idCustomer` tồn tại, thay đổi thông điệp
            const message =
              notification.type === "newAppointment" && idCustomer
                ? `Bạn đã đặt lịch ở ${notification.message.split("ở ")[1]}`
                : notification.message;

            return (
              <div
                style={{ cursor: "pointer" }}
                key={index}
                className={`${style.notificationItem} ${
                  notification.isRead ? style.read : style.unread
                }`}
                onClick={() =>
                  handleReaded(
                    notificationObj.id,
                    appointment.id,
                    notification.isRead
                  )
                }
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
        )}
      </div>
    </div>
  );
};

export default NotificationComponent;
