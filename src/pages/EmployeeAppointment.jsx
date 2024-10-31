import { actGetAppointmentByEmployeeId } from "@/store/employeeAppointments/action";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../css/employeeAppointment.module.css";
import stylesCard from "../css/customerAppointment.module.css";
import { debounce } from "lodash";
import {
  Button,
  Divider,
  Image,
  Input,
  message,
  Modal,
  Pagination,
  Spin,
  Table,
  Typography,
  Upload,
  Select,
  DatePicker,
} from "antd";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

function EmployeeAppointment(props) {
  const dispatch = useDispatch();
  const [status, setStatus] = useState("BOOKING");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState(null);
  const [nameFilter, setNameFilter] = useState(null);
  const [nameFilterInput, setNameFilterInput] = useState(null);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const pageSize = 4;

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
            false,
            dateFilter,
            nameFilter
          )
        );
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [employeeId, status, currentPage, dateFilter, nameFilter]);

  const statusDisplayNames = {
    BOOKING: "Đang đặt",
    CANCEL_BY_CUSTOMER: "Hủy bởi Khách",
    FAILED: "Thất bại",
    SUCCESSED: "Thành công",
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDateChange = (date, dateString) => {
    setDateFilter(dateString);
  };

  const debouncedSetNameFilter = useCallback(
    debounce((value) => {
      setNameFilter(value);
    }, 300), // 300ms debounce time
    []
  );

  const handleNameFilterChange = (e) => {
    debouncedSetNameFilter(e.target.value);
    setNameFilterInput(e.target.value);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day}/${month}/${year} - ${hours}:${minutes}`;
  };

  function formatVND(amount) {
    // Chuyển đổi số tiền sang chuỗi và ngược lại để xử lý dễ dàng hơn
    let amountStr = String(amount);

    // Tạo biến lưu trữ chuỗi kết quả
    let formattedAmount = "";

    // Lặp qua từng ký tự từ cuối chuỗi đến đầu chuỗi
    for (let i = amountStr.length - 1, count = 0; i >= 0; i--, count++) {
      // Nếu đếm đã đến 3 và không phải ký tự đầu tiên
      if (count > 0 && count % 3 === 0) {
        // Thêm dấu chấm vào chuỗi kết quả, trừ khi ký tự tiếp theo là dấu phẩy
        if (i > 0 && amountStr[i - 1] !== ".") {
          formattedAmount = "." + formattedAmount;
        }
      }
      // Thêm ký tự hiện tại vào đầu chuỗi kết quả
      formattedAmount = amountStr[i] + formattedAmount;
    }

    // Trả về chuỗi kết quả đã định dạng
    return formattedAmount;
  }

  const showModal = (appointment) => {
    setCurrentAppointment(appointment);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: "Khách hàng",
      dataIndex: "customer",
      key: "fullName",
      render: (customer) => customer?.fullName,
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (paymentMethod) => {
        switch (paymentMethod) {
          case "PAYBYWALLET":
            return "Thanh toán qua ví";
          case "PAYINSALON":
            return "Thanh toán tại salon";
          case "PAYBYBANK":
            return "Thanh toán qua ngân hàng";
          default:
            return paymentMethod;
        }
      },
    },
    {
      title: "Ngày hẹn",
      dataIndex: "startDate",
      key: "startDate",
      render: (text, record) => {
        const startTime = record.appointmentDetails[0]?.startTime;
        return moment(startTime).format("DD/MM/YYYY - HH:mm");
      },
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (text) => `${text.toLocaleString()} VND`,
    },
    {
      title: "Hành động",
      key: "actions",
      render: (text, record) => {
        return (
          <>
            <Button
              className={styles.detailBtn}
              onClick={() => showModal(record)}
            >
              Xem chi tiết
            </Button>
          </>
        );
      },
    },
  ];

  const navigate = useNavigate();
  const renderAppointmentDetail = () => {
    if (!currentAppointment) return null;

    return (
      <div className={styles.appointmentDetail}>
        <div className={styles.appointmentDetailA1}>
          {/* B1: Thông tin Salon */}
          <div
            className={styles.appointmentDetailB1}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              paddingBottom: "50px",
            }}
            onClick={() =>
              navigate(
                `/salon_detail/${currentAppointment?.salonInformation.id}`
              )
            }
          >
            <Text strong style={{ fontSize: "16px" }}>
              Thông tin Khách hàng
            </Text>
            <div>
              <img
                src={currentAppointment?.customer?.img}
                alt="Khách hàng"
                className={stylesCard.salonImageDetail}
              />
              <p>
                <Text strong>Tên khách hàng: </Text>
                <Text>{currentAppointment?.customer?.fullName}</Text>
              </p>
              <p>
                <Text strong>Email: </Text>
                <Text>{currentAppointment?.customer.email}</Text>
              </p>
              <p>
                <Text strong>Giới tính: </Text>
                <Text>
                  {currentAppointment?.customer.gender
                    ? currentAppointment.customer.gender
                    : "Thông tin chưa được cập nhật"}
                </Text>
              </p>
              <p>
                <Text strong>Ngày sinh: </Text>
                <Text>
                  {currentAppointment?.customer.dayOfBirth
                    ? currentAppointment.customer.dayOfBirth
                    : "Thông tin chưa được cập nhật"}
                </Text>
              </p>

              <p>
                <Text strong>Số điện thoại: </Text>
                <Text>{currentAppointment?.customer.phone}</Text>
              </p>
            </div>
          </div>

          {/* B2: Mã QR */}
          <div
            className={styles.appointmentDetailB2}
            style={{ marginTop: "1rem" }}
          >
            {currentAppointment?.status === "BOOKING" && (
              <div style={{ padding: "10px", border: "1px solid #ccc" }}>
                <Text strong>Mã QR xác nhận để thành công:</Text>
                <Image
                  src={currentAppointment?.qrCodeImg}
                  style={{ width: "100%", marginTop: "10px" }}
                />
              </div>
            )}
          </div>
        </div>

        <div
          className={styles.appointmentDetailA2}
          // style={{ marginLeft: "1rem" }}
        >
          {/* C1: Chi tiết dịch vụ */}
          <div
            className={styles.appointmentDetailC1}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
            }}
          >
            <Text strong style={{ fontSize: "16px" }}>
              Thông tin dịch vụ
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
                {currentAppointment.appointmentDetails.map((service) => (
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
                      {formatVND(service?.priceServiceHair)} VND
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
                  {currentAppointment?.id}
                </Text>
              </p>
              {/* <p>
                <Text strong>Khách Hàng: </Text>
                <Text>{currentAppointment?.customer.fullName}</Text>
              </p>
              <p>
                <Text strong>Email: </Text>
                <Text>{currentAppointment?.customer.email}</Text>
              </p>
              <p>
                <Text strong>Giới tính: </Text>
                <Text>
                  {currentAppointment?.customer.gender
                    ? currentAppointment.customer.gender
                    : "Thông tin chưa được cập nhật"}
                </Text>
              </p>
              <p>
                <Text strong>Ngày sinh: </Text>
                <Text>
                  {currentAppointment?.customer.dayOfBirth
                    ? currentAppointment.customer.dayOfBirth
                    : "Thông tin chưa được cập nhật"}
                </Text>
              </p>

              <p>
                <Text strong>Số điện thoại: </Text>
                <Text>{currentAppointment?.customer.phone}</Text>
              </p> */}
              <p>
                <Text strong>Ngày hẹn: </Text>
                <Text>
                  {moment(
                    currentAppointment.appointmentDetails[0]?.startTime
                  ).format("DD/MM/YYYY - HH:mm")}
                </Text>
              </p>
              <p>
                <Text strong>Số tiền tạm tính: </Text>
                <Text>{formatVND(currentAppointment.originalPrice)} VND</Text>
              </p>
              {/* <p>
                <Text strong>Mã Khuyến mãi: </Text>
                <Text>{currentAppointment?.promoCode}</Text>
              </p> */}
              <p>
                <Text strong>Giảm giá: </Text>
                <Text>{formatVND(currentAppointment.discountedPrice)} VND</Text>
              </p>
              <p>
                <Text strong>Cần thanh toán: </Text>
                <Text strong style={{ color: "red" }}>
                  {formatVND(currentAppointment.totalPrice)} VND
                </Text>
              </p>
            </div>

            {/* D2: Tổng kết */}
            {currentAppointment.status === "CANCEL_BY_CUSTOMER" && (
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
                  {moment(currentAppointment.cancellationTime).format(
                    "DD/MM/YYYY - HH:mm"
                  )}
                </Text>
                <Divider />
                <Text strong>Lý do hủy: </Text>
                <Text>{currentAppointment.reasonCancel}</Text>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.appointmentContainer}>
      <Spin
        className="custom-spin"
        spinning={loading}
        // tip="Loading..."
      >
        <div className={styles.statusfilter}>
          {Object.keys(statusDisplayNames).map((statusKey, index) => (
            <button
              key={statusKey}
              onClick={() => handleStatusChange(statusKey)}
              style={{
                flex: "1",
                marginRight:
                  index !== Object.keys(statusDisplayNames).length - 1
                    ? "1rem"
                    : "0",
                padding: "0.5rem 1rem",
                backgroundColor:
                  status === statusKey
                    ? status === "BOOKING"
                      ? "#1677ff"
                      : status === "CANCEL_BY_CUSTOMER"
                      ? "#faa500"
                      : status === "FAILED"
                      ? "#ff0000"
                      : status === "SUCCESSED"
                      ? "#389e0d"
                      : "gray"
                    : "gray",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              {statusDisplayNames[statusKey]}
            </button>
          ))}
        </div>

        <div className={styles.filterDate}>
          <div
            className="datePickerCustome"
            // className={styles["date-picker-custome"]}
          >
            <DatePicker
              style={{ marginRight: "1rem" }}
              onChange={handleDateChange}
              placeholder="Lọc theo thời gian"
            />
            <Input
              placeholder="Lọc theo tên"
              value={nameFilterInput}
              onChange={handleNameFilterChange}
              allowClear
              style={{
                width: 200,
              }}
            />
          </div>
        </div>

        <Table
          className={stylesCard.appointmentTable}
          columns={columns}
          dataSource={employeeAppointments}
          // loading={loading}
          rowKey="id"
          pagination={false}
        />

        <div className={stylesCard.container}>
          {/* {loading && (
          <div className={stylesCard.overlay}>
            <LoadingOutlined style={{ fontSize: "2rem" }} />
          </div>
        )} */}
          {employeeAppointments?.length === 0 && status && (
            <h4
              style={{
                fontWeight: "bold",
                color: "#bf9456",
                textAlign: "center",
                fontSize: "1.2rem",
              }}
            >
              Không tìm thấy lịch hẹn {statusDisplayNames[status] || status} nào
              !!!
            </h4>
          )}
          {/* {Object.entries(groupedAppointmentsbyDate).map(
          ([date, appointments]) => (
            <div key={date} className={stylesCard.dateGroup}>
              <h3 className={stylesCard.dateHeader}>{date}</h3> */}
          <div className={stylesCard.grid}>
            {employeeAppointments.map((appointment) => {
              const startTime = moment(
                appointment.appointmentDetails[0]?.startTime
              );
              const currentTime = moment();

              // Kiểm tra xem ngày hiện tại có trùng với ngày hẹn hay không
              const isSameDay = moment(appointment.startDate).isSame(
                currentTime,
                "day"
              );

              // Tính khoảng cách thời gian giữa startTime và thời gian hiện tại
              const hoursDiff = currentTime.diff(startTime, "hours");

              // Kiểm tra xem nút báo cáo có được hiển thị hay không
              const isReportButtonVisible =
                currentTime.isSameOrAfter(startTime);
              const isReportExpired = hoursDiff >= 72;

              return (
                <div key={appointment.id} className={stylesCard.card}>
                  <img
                    src={appointment.customer.img}
                    alt="Salon"
                    className={stylesCard.salonImage}
                  />
                  <h4>
                    Tên khách hàng:
                    <span
                      style={{
                        display: "block", // Đảm bảo xuống dòng
                        fontWeight: "bold",
                        color: "#bf9456",
                        textAlign: "center",
                      }}
                    >
                      {appointment.customer.fullName}
                    </span>
                  </h4>

                  <h4>
                    Phương thức thanh toán:{" "}
                    {appointment?.paymentMethod === "PAYBYWALLET"
                      ? "Thanh toán qua ví"
                      : appointment?.paymentMethod === "PAYINSALON"
                      ? "Thanh toán tại salon"
                      : appointment?.paymentMethod === "PAYBYBANK"
                      ? "Thanh toán qua ngân hàng"
                      : appointment?.paymentMethod}
                  </h4>

                  <h4>Ngày bắt đầu: {formatDate(startTime)}</h4>
                  <h4>
                    Giá tiền: {appointment.totalPrice.toLocaleString()} VND
                  </h4>

                  <Button
                    style={{
                      backgroundColor: "#bf9456",
                      marginBottom: "0.5rem",
                    }}
                    onClick={() => showModal(appointment)}
                  >
                    Xem chi tiết
                  </Button>
                  {/* 
                  {isReportButtonVisible && (
                    <>
                      {!isReportExpired ? (
                        <Button
                          danger
                          onClick={() => handleReport(appointment)}
                        >
                          {appointment.isReportBySalon
                            ? "Đã báo cáo cho admin"
                            : "Báo cáo"}
                        </Button>
                      ) : (
                        <Button disabled>Đã quá hạn báo cáo</Button>
                      )}
                    </>
                  )} */}
                </div>
              );
            })}
          </div>
          {/* </div>
          )
        )} */}
        </div>

        <Pagination
          className="paginationAppointment"
          current={currentPage}
          total={totalPages * pageSize}
          pageSize={pageSize}
          onChange={handlePageChange}
        />
      </Spin>
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
        visible={isModalVisible}
        onCancel={handleCancel}
        width={1100}
        footer={null}
      >
        {renderAppointmentDetail()}
      </Modal>
    </div>
  );
}

export default EmployeeAppointment;
