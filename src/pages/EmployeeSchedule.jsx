import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/dist/locale/vi";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Modal,
  Button,
  Typography,
  Image,
  Divider,
  Row,
  Col,
  DatePicker,
} from "antd"; // Import các component của Ant Design
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import timeGridPlugin from "@fullcalendar/timegrid";
// import interactionPlugin from "@fullcalendar/interaction";
import style from "../css/schedule.module.css"; // Import CSS Modules
import styles from "../css/customerAppointment.module.css";
import "../css/Customeschedule.css";
import "react-calendar/dist/Calendar.css";
import ReactCalendar from "react-calendar";
import { useDispatch, useSelector } from "react-redux";
import { actGetAppointmentByEmployeeId } from "@/store/employeeAppointments/action";

const { Text } = Typography;

const EmployeeSchedule = () => {
  const dispatch = useDispatch();
  moment.locale("vi");
  const localizer = momentLocalizer(moment);
  const [visible, setVisible] = useState(false); // State để quản lý việc hiển thị modal
  const [selectedAppointmentDetail, setSelectedAppointmentDetail] =
    useState(null); // State để lưu sự kiện được chọn
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("BOOKING");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 100;

  const employeeId = useSelector((state) => state.ACCOUNT.idEmployee);

  const employeeAppointments = useSelector(
    (state) => state.EMPLOYEEAPPOINTMENTS.appointment
  );

  const totalPages = useSelector(
    (state) => state.EMPLOYEEAPPOINTMENTS.totalPages
  );

  useEffect(() => {
    const fetchAppointments = async () => {
      if (status) {
        setLoading(true);
        await dispatch(
          actGetAppointmentByEmployeeId(
            employeeId,
            currentPage,
            pageSize,
            status,
            true
          )
        );
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [employeeId, status, currentPage]);

  const events = employeeAppointments.map((appointment) => {
    const appointmentDetails = appointment.appointmentDetails;
    const startTime = new Date(appointmentDetails[0].startTime); // Chuyển đổi startTime thành đối tượng Date
    const endTime = new Date(
      appointmentDetails[appointmentDetails.length - 1].endTime
    ); // Chuyển đổi endTime thành đối tượng Date
    const serviceNames = appointmentDetails
      .map((detail) => detail.serviceName)
      .join(" - ");
    const customerName = appointment.customer.fullName;
    const title = `${customerName} - [${serviceNames}]`;
    return {
      id: appointment.id,
      start: startTime, // Đối tượng Date cho thời gian bắt đầu
      end: endTime, // Đối tượng Date cho thời gian kết thúc
      title: title, // Ví dụ: Tên salon
    };
  });

  // console.log(events[0].start);

  // const minTime = events.reduce(
  //   (min, event) => (event.start < min ? event.start : min),
  //   new Date()
  // );
  // const maxTime = events.reduce(
  //   (max, event) => (event.end > max ? event.end : max),
  //   new Date()
  // );
  // Cập nhật sự kiện khi người dùng chọn một ngày mới
  const handleDateChange = (date) => {
    console.log("date", date);

    setSelectedDate(date); // Chuyển đổi từ moment về Date
  };

  const handleEventClick = (clickInfo) => {
    const selectedAppointment = employeeAppointments.find(
      (appointment) => appointment.id === clickInfo.id
    );

    if (selectedAppointment) {
      setSelectedAppointmentDetail(selectedAppointment);
      setVisible(true); // Hiển thị modal
    }
  };

  const handleModalClose = () => {
    setVisible(false); // Đóng modal
  };

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const today = new Date(); // Ngày hôm nay
  const maxDate = new Date(today); // Tạo một bản sao của ngày hôm nay
  maxDate.setDate(today.getDate() + 7); // Cộng thêm 7 ngày
  const goToToday = () => {
    setSelectedDate(new Date());
  };
  const renderAppointmentDetail = () => {
    if (!selectedAppointmentDetail) return null;

    return (
      <div className={styles.appointmentDetail}>
        {selectedAppointmentDetail?.status === "BOOKING" && (
          <div className={styles.appointmentDetailA1}>
            {/* B1: Thông tin Salon */}
            {/* <div
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
          </div> */}

            {/* B2: Mã QR */}
            <div
              className={styles.appointmentDetailB2}
              style={{ marginTop: "1rem" }}
            >
              <div style={{ padding: "10px", border: "1px solid #ccc" }}>
                <Text strong>Mã QR xác nhận để thành công:</Text>
                <Image
                  src={selectedAppointmentDetail?.qrCodeImg}
                  style={{ width: "100%", marginTop: "10px" }}
                />
              </div>
            </div>
          </div>
        )}
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
      <Row gutter={[16, 16]}>
        <Col
          xs={24} // Trên màn hình nhỏ (mobile) thì chiếm 100% (24 cột)
          sm={24} // Trên màn hình nhỏ hơn (tablet) thì cũng chiếm 100%
          md={24} // Trên màn hình trung bình (laptop) thì chiếm 2/3 (16/24 cột)
          lg={24} // Trên màn hình lớn (desktop) thì cũng chiếm 2/3 (16/24 cột)
        >
          <Calendar
            localizer={localizer}
            // min={new Date(minTime.setHours(8, 0))}
            // max={new Date(maxTime.setHours(21, 0))}
            events={events}
            startAccessor="start"
            endAccessor="end"
            views={["day", "week", "month", "agenda"]}
            defaultView="day"
            // date={selectedDate}
            className="customeSchedule"
            onSelectEvent={handleEventClick}
            style={{ height: 600 }}
            culture="vi"
            // min={today}
            // max={maxDate}
            messages={{
              next: "Tiếp theo",
              previous: "Trước đó",
              today: "Xem hôm nay",
              month: "Tháng",
              week: "Tuần",
              day: "Ngày",
              agenda: "Lịch",
              date: "Ngày",
              time: "Thời gian",
              event: "Lịch hẹn",
            }}
          />
        </Col>
        {/* <Col
          xs={24} // Trên màn hình nhỏ (mobile) thì chiếm 100% (24 cột)
          sm={24} // Trên màn hình nhỏ hơn (tablet) thì cũng chiếm 100%
          md={8} // Trên màn hình trung bình (laptop) thì chiếm 1/3 (8/24 cột)
          lg={8} // Trên màn hình lớn (desktop) thì cũng chiếm 1/3 (8/24 cột)
        >
          <ReactCalendar
            onChange={handleDateChange}
            value={selectedDate} // Chọn ngày
            minDate={yesterday} // Ngày nhỏ nhất là ngày hôm qua
            view="month" // Bắt đầu ở chế độ xem tháng
            maxDetail="month" // Giới hạn chi tiết tối đa là tháng (không cho chỉnh thập kỷ, năm)
            next2Label={null} // Ẩn nút chuyển thế kỷ
            prev2Label={null} // Ẩn nút chuyển thế kỷ
            style={{ width: "100%" }} // Đảm bảo lịch chiếm toàn bộ chiều rộng
          />
          <Button onClick={goToToday} style={{ marginTop: "10px" }}>
            Quay lại ngày hôm nay
          </Button>
        </Col> */}
      </Row>
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
