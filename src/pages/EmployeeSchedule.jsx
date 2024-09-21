import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/vi"; // Import ngôn ngữ tiếng Việt từ moment
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Modal, Button, Typography, Image, Divider } from "antd"; // Import các component của Ant Design
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import timeGridPlugin from "@fullcalendar/timegrid";
// import interactionPlugin from "@fullcalendar/interaction";
import style from "../css/schedule.module.css"; // Import CSS Modules
import styles from "../css/customerAppointment.module.css";
import "../css/Customeschedule.css";
const { Text } = Typography;

const localizer = momentLocalizer(moment);

const events = [
  {
    title: "Cắt tóc nam - Khách A",
    start: new Date(2024, 8, 19, 9, 0),
    end: new Date(2024, 8, 19, 10, 0),
    salonInformation: {
      id: 1,
      img: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHNhbG9ufGVufDB8fDB8fHww",
      name: "Salon A",
      address: "123 Đường ABC",
    },
    qrCodeImg:
      "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHNhbG9ufGVufDB8fDB8fHww",
    status: "CONFIRMED",
    appointmentDetails: [
      {
        serviceHairId: 1,
        serviceName: "Cắt tóc nam",
        salonEmployee: {
          fullName: "Nhân viên A",
        },
        startTime: new Date(2024, 8, 19, 9, 0),
        endTime: new Date(2024, 8, 19, 10, 0),
        priceServiceHair: 100000,
      },
    ],
    id: "12345",
    customer: {
      fullName: "Khách A",
    },
    createdDate: new Date(2024, 8, 10),
    originalPrice: 100000,
    discountedPrice: 90000,
    totalPrice: 90000,
    cancellationTime: null,
    reasonCancel: null,
  },
  {
    title: "Cắt tóc nam - Khách A fasfasfasf",
    start: new Date(2024, 8, 19, 10, 0),
    end: new Date(2024, 8, 19, 11, 0),
    salonInformation: {
      id: 1,
      img: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHNhbG9ufGVufDB8fDB8fHww",
      name: "Salon A",
      address: "123 Đường ABC",
    },
    qrCodeImg:
      "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHNhbG9ufGVufDB8fDB8fHww",
    status: "CONFIRMED",
    appointmentDetails: [
      {
        serviceHairId: 1,
        serviceName: "Cắt tóc nam",
        salonEmployee: {
          fullName: "Nhân viên A",
        },
        startTime: new Date(2024, 8, 19, 9, 0),
        endTime: new Date(2024, 8, 19, 10, 0),
        priceServiceHair: 100000,
      },
    ],
    id: "12345",
    customer: {
      fullName: "Khách A",
    },
    createdDate: new Date(2024, 8, 10),
    originalPrice: 100000,
    discountedPrice: 90000,
    totalPrice: 90000,
    cancellationTime: null,
    reasonCancel: null,
  },
  {
    title: "Cắt tóc nam - Khách A",
    start: new Date(2024, 8, 19, 11, 30),
    end: new Date(2024, 8, 19, 13, 0),
    salonInformation: {
      id: 1,
      img: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHNhbG9ufGVufDB8fDB8fHww",
      name: "Salon A",
      address: "123 Đường ABC",
    },
    qrCodeImg:
      "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHNhbG9ufGVufDB8fDB8fHww",
    status: "CONFIRMED",
    appointmentDetails: [
      {
        serviceHairId: 1,
        serviceName: "Cắt tóc nam",
        salonEmployee: {
          fullName: "Nhân viên A",
        },
        startTime: new Date(2024, 8, 19, 9, 0),
        endTime: new Date(2024, 8, 19, 10, 0),
        priceServiceHair: 100000,
      },
    ],
    id: "12345",
    customer: {
      fullName: "Khách A",
    },
    createdDate: new Date(2024, 8, 10),
    originalPrice: 100000,
    discountedPrice: 90000,
    totalPrice: 90000,
    cancellationTime: null,
    reasonCancel: null,
  },
  // Thêm các sự kiện khác ở đây...
];

const EmployeeSchedule = () => {
  const [visible, setVisible] = useState(false); // State để quản lý việc hiển thị modal
  const [selectedAppointmentDetail, setSelectedAppointmentDetail] =
    useState(null); // State để lưu sự kiện được chọn

  const handleEventClick = (clickInfo) => {
    // setSelectedAppointmentDetail(clickInfo.event.extendedProps);
    setSelectedAppointmentDetail(clickInfo);
    setVisible(true); // Hiển thị modal
  };

  const handleModalClose = () => {
    setVisible(false); // Đóng modal
  };

  const renderAppointmentDetail = () => {
    if (!selectedAppointmentDetail) return null;

    return (
      <div className={styles.appointmentDetail}>
        <div className={styles.appointmentDetailA1}>
          {/* B1: Thông tin Salon */}
          <div
            className={styles.appointmentDetailB1}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              paddingBottom: "30px",
            }}
          >
            <Text strong style={{ fontSize: "16px" }}>
              Thông tin Salon | Barber shop
            </Text>
            <div>
              {selectedAppointmentDetail?.salonInformation?.img && (
                <Image
                  src={selectedAppointmentDetail?.salonInformation?.img}
                  preview={false}
                  style={{ marginBottom: "10px", marginTop: "10px" }}
                  width={300}
                  height={200}
                />
              )}
              <p>
                <Text strong>Tên tiệm: </Text>
                <Text>{selectedAppointmentDetail?.salonInformation?.name}</Text>
              </p>
              <p>
                <Text strong>Địa chỉ: </Text>
                <Text>
                  {selectedAppointmentDetail?.salonInformation?.address}
                </Text>
              </p>
            </div>
          </div>

          {/* B2: Mã QR */}
          <div
            className={styles.appointmentDetailB2}
            style={{ marginTop: "1rem" }}
          >
            {selectedAppointmentDetail?.status !== "CANCEL_BY_CUSTOMER" && (
              <div style={{ padding: "10px", border: "1px solid #ccc" }}>
                <Text strong>Mã QR xác nhận để thành công:</Text>
                <Image
                  src={selectedAppointmentDetail?.qrCodeImg}
                  style={{ width: "100%", marginTop: "10px" }}
                />
              </div>
            )}
          </div>
        </div>

        <div className={styles.appointmentDetailA2}>
          {/* C1: Chi tiết dịch vụ */}
          <div
            className={styles.appointmentDetailC1}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
            }}
          >
            <Text strong style={{ fontSize: "16px" }}>
              Chi tiết cuộc hẹn
            </Text>
            <table
              style={{
                width: "100%",
                marginTop: "10px",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      border: "1px solid #ccc",
                      padding: "8px",
                      textAlign: "left",
                    }}
                  >
                    Dịch vụ
                  </th>
                  <th
                    style={{
                      border: "1px solid #ccc",
                      padding: "8px",
                      textAlign: "left",
                    }}
                  >
                    Nhân Viên
                  </th>
                  <th
                    style={{
                      border: "1px solid #ccc",
                      padding: "8px",
                      textAlign: "left",
                    }}
                  >
                    Thời gian bắt đầu
                  </th>
                  <th
                    style={{
                      border: "1px solid #ccc",
                      padding: "8px",
                      textAlign: "left",
                    }}
                  >
                    Thời gian kết thúc
                  </th>
                  <th
                    style={{
                      border: "1px solid #ccc",
                      padding: "8px",
                      textAlign: "right",
                    }}
                  >
                    Tiền
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedAppointmentDetail.appointmentDetails.map((service) => (
                  <tr key={service.serviceHairId}>
                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                      {service?.serviceName}
                    </td>
                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                      {service.salonEmployee.fullName}
                    </td>
                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                      {moment(service?.startTime).format("HH:mm")}
                    </td>
                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                      {moment(service?.endTime).format("HH:mm")}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ccc",
                        padding: "8px",
                        textAlign: "right",
                      }}
                    >
                      {/* Sử dụng hàm formatVND để định dạng giá tiền */}
                      {service?.priceServiceHair} VND
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div
            className={styles.appointmentDetailC2}
            style={{ marginTop: "1rem" }}
          >
            {/* D1: Thông tin hủy */}
            <div
              className={styles.appointmentDetailD1}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
              }}
            >
              <p>
                <Text strong>Mã đơn: </Text>
                <Text style={{ color: "green" }} strong>
                  {selectedAppointmentDetail?.id}
                </Text>
              </p>
              <p>
                <Text strong>Khách Hàng: </Text>
                <Text>{selectedAppointmentDetail?.customer.fullName}</Text>
              </p>
              <p>
                <Text strong>Ngày tạo: </Text>
                <Text>
                  {moment(selectedAppointmentDetail.createdDate).format(
                    "DD/MM/YYYY - HH:mm"
                  )}
                </Text>
              </p>
              <p>
                <Text strong>Ngày hẹn: </Text>
                <Text>
                  {moment(
                    selectedAppointmentDetail.appointmentDetails[0]?.startTime
                  ).format("DD/MM/YYYY - HH:mm")}
                </Text>
              </p>
              <p>
                <Text strong>Số tiền tạm tính: </Text>
                <Text>{selectedAppointmentDetail.originalPrice} VND</Text>
              </p>
              <p>
                <Text strong>Giảm giá: </Text>
                <Text>{selectedAppointmentDetail.discountedPrice} VND</Text>
              </p>
              <p>
                <Text strong>Cần thanh toán: </Text>
                <Text strong style={{ color: "red" }}>
                  {selectedAppointmentDetail.totalPrice} VND
                </Text>
              </p>
            </div>

            {/* D2: Tổng kết */}
            {selectedAppointmentDetail.status === "CANCEL_BY_CUSTOMER" && (
              <div
                className={styles.appointmentDetailD2}
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  marginLeft: "1rem",
                }}
              >
                <Text strong>Ngày hủy: </Text>
                <Text>
                  {moment(selectedAppointmentDetail.cancellationTime).format(
                    "DD/MM/YYYY - HH:mm"
                  )}
                </Text>
                <Divider />
                <Text strong>Lý do hủy: </Text>
                <Text>{selectedAppointmentDetail.reasonCancel}</Text>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={style.schedule}>
      <h1 className={style.header}>Lịch Hẹn Cắt Tóc</h1>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        views={["day", "agenda", "week"]}
        defaultView="day"
        // style={{ height: 400 }}
        className="customeSchedule"
        onSelectEvent={handleEventClick}
      />
      {/* <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} // Sử dụng các plugin
        initialView="timeGridDay" // Chế độ xem mặc định là theo ngày
        events={events} // Truyền vào danh sách sự kiện
        headerToolbar={{
          start: "today prev,next", // will normally be on the left. if RTL, will be on the right
          center: "title",
          end: "dayGridMonth,timeGridWeek,timeGridDay", // will normally be on the right. if RTL, will be on the left
        }}
        eventClick={handleEventClick} // Sự kiện khi nhấn vào sự kiện
      /> */}

      <Modal
        wrapClassName="my-custom-modal"
        title={
          <div
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              textAlign: "center",
              backgroundColor: "#ece8de",
            }}
          >
            Chi tiết cuộc hẹn
          </div>
        }
        visible={visible}
        onCancel={handleModalClose}
        footer={null}
        width={1100}
      >
        {renderAppointmentDetail()}
      </Modal>
    </div>
  );
};

export default EmployeeSchedule;
