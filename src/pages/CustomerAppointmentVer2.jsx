import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  actDeleteAppointmentByCustomerId,
  actGetAppointmentByCustomerId,
} from "../store/customerAppointments/action";
import styles from "../css/customerAppointment.module.css";
import "../css/customerAppointmentTable.css";
import {
  Pagination,
  Table,
  Tag,
  Button,
  Modal,
  Typography,
  Image,
  Rate,
  Input,
  Upload,
  message,
  Divider,
  Select,
  DatePicker,
  Avatar,
  Spin,
} from "antd";
import moment from "moment";
import {
  DownOutlined,
  LoadingOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { actCreateFeedbackCustomer } from "../store/ratingCutomer/action";
import { actCreateReportCustomer } from "../store/report/action";
import { useNavigate } from "react-router-dom";
import { AppointmentService } from "@/services/appointmentServices";

const { Text } = Typography;
const { Option } = Select;
const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};
function CustomerAppointmentVer2(props) {
  const dispatch = useDispatch();
  const searchParams = new URLSearchParams(location.search);
  const appoinmentIdUrl = searchParams.get("appointmentId");

  const [status, setStatus] = useState("BOOKING");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedAppointmentDetail, setSelectedAppointmentDetail] =
    useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [reasonCancel, setReasonCancel] = useState("");
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isRatingModalVisible, setIsRatingModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [feedbackFileList, setFeedbackFileList] = useState([]);
  const [feedbackImage, setFeedbackImage] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [reportDescription, setReportDescription] = useState("");
  const [fileList, setFileList] = useState([]);
  const [reportImage, setReportImage] = useState(null);
  const [dateFilter, setDateFilter] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pageSize, setPageSize] = useState(4);
  const [ratings, setRatings] = useState({});
  const [expanded, setExpanded] = useState({});

  const handleRatingChange = (employeeId, value) => {
    setRatings({
      ...ratings,
      [employeeId]: value, // Cập nhật rating của nhân viên theo employeeId
    });
  };

  const idCustomer = useSelector((state) => state.ACCOUNT.idCustomer);
  const customerAppointments = useSelector(
    (state) => state.CUSTOMERAPPOINTMENTS.appointment
  );

  const totalPages = useSelector(
    (state) => state.CUSTOMERAPPOINTMENTS.totalPages
  );
  useEffect(() => {
    if (appoinmentIdUrl) {
      setLoading(true);
      AppointmentService.getAppointmentById(appoinmentIdUrl)
        .then((res) => {
          console.log("res", res);

          setSelectedAppointmentDetail(res.data);
        })
        .catch((err) => {
          setLoading(false);
        })
        .finally((err) => {
          setLoading(false);
        });
    }
  }, [appoinmentIdUrl]);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (status) {
        setLoading(true);
        await dispatch(
          actGetAppointmentByCustomerId(
            idCustomer,
            currentPage,
            pageSize,
            status,
            false,
            dateFilter
          )
        );
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [idCustomer, status, currentPage, dateFilter, pageSize]);

  const statusDisplayNames = {
    BOOKING: "Đang đặt",
    CANCEL_BY_CUSTOMER: "Đã hủy",
    FAILED: "Thất bại",
    SUCCESSED: "Thành công",
  };

  const statusColors = {
    BOOKING: "blue",
    CANCEL_BY_CUSTOMER: "orange",
    FAILED: "red",
    SUCCESSED: "green",
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day}/${month}/${year} - ${hours}:${minutes}`;
    // return `${day}/${month}/${year}`;
  };

  function formatVND(amount) {
    return String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  const showAppointmentDetail = (appointment) => {
    setSelectedAppointmentDetail(appointment);
  };

  const handleModalClose = () => {
    setSelectedAppointmentDetail(null);
    const url = new URL(window.location);
    url.searchParams.delete("appointmentId");
    navigate(`${url.pathname}${url.search}`);
  };

  // const handleOk = async () => {
  //   if (!reasonCancel) {
  //     message.error("Vui lòng cung cấp lý do hủy.");
  //     return;
  //   }

  //   await dispatch(
  //     actDeleteAppointmentByCustomerId(
  //       selectedAppointmentId,
  //       idCustomer,
  //       reasonCancel
  //     )
  //   );
  //   setStatus("CANCEL_BY_CUSTOMER");
  //   setIsModalVisible(false);
  //   setReasonCancel("");
  // };

  const handleOk = async () => {
    if (!reasonCancel) {
      message.error("Vui lòng cung cấp lý do hủy.");
      return;
    }

    setLoading(true); // Bắt đầu loading
    setIsModalVisible(false);
    try {
      await dispatch(
        actDeleteAppointmentByCustomerId(
          selectedAppointmentId,
          idCustomer,
          reasonCancel
        )
      );
      setStatus("CANCEL_BY_CUSTOMER");
      setReasonCancel("");
    } catch (error) {
      message.error("Đã xảy ra lỗi trong quá trình hủy lịch.");
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  const handleCancelModal = () => {
    setIsModalVisible(false);
  };

  const handleCancel = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setIsModalVisible(true);
  };

  const handleRatingOk = async () => {
    try {
      setIsLoading(true);
      setLoading(true);

      const formData = new FormData();
      formData.append("SalonId", selectedAppointment?.salonInformation?.id);
      formData.append("CustomerId", idCustomer);
      formData.append(
        "AppointmentId",
        selectedAppointment?.appointmentDetails[0]?.appointmentId
      );
      formData.append("Rating", rating);
      formData.append("Comment", comment);
      selectedAppointment?.appointmentDetails.forEach((appointment, index) => {
        const employeeId = appointment?.salonEmployee?.id;
        const employeeRating = ratings[employeeId] || 0; // Get the rating for the employee

        // Debugging output for each appointment
        console.log(
          `Appointment ID: ${appointment?.appointmentId}, Employee ID: ${employeeId}, Rating: ${employeeRating}`
        );

        // Create a feedback detail object for each appointment
        formData.append(
          `FeedbackDetailRequests[${index}].AppointmentDetailId`,
          appointment?.id // Each appointment's ID
        );
        formData.append(
          `FeedbackDetailRequests[${index}].Rating`,
          employeeRating // Ensure we are sending the correct rating
        );
      });
      feedbackFileList.forEach((file) => {
        formData.append("ImgFeedbacks", file.originFileObj);
      });

      await dispatch(actCreateFeedbackCustomer(formData, idCustomer))
        .then((res) => {
          setRating(null);
          setComment(null);
          setFeedbackFileList([]);
          setSelectedAppointment(null);
          setIsRatingModalVisible(false);
        })
        .catch((err) => {})
        .finally((err) => {
          setLoading(false);
          setIsLoading(false);
        });

      await dispatch(
        actGetAppointmentByCustomerId(idCustomer, currentPage, pageSize, status)
      );

      // Reset state sau khi thành công
    } catch (error) {
      // Xử lý lỗi
      console.error("Error creating feedback:", error);
    } finally {
      // Đảm bảo rằng trạng thái loading luôn được reset
      setIsLoading(false);
      setLoading(false);
    }
  };

  const handleRatingCancel = () => {
    setRating(0);
    setRatings({});
    setComment("");
    setFeedbackImage(null);
    setIsRatingModalVisible(false);
  };

  const handleFeedbackUploadChange = (info) => {
    const { status, fileList } = info;

    if (status === "done") {
      message.success(`${info.file.name} đã được tải lên thành công.`);
      setFeedbackImage(info.file);
      setUploadedImageUrl(info.file.response.url);
    } else if (status === "error") {
      message.error(`${info.file.name} tải lên thất bại.`);
    }

    setFeedbackFileList(fileList);
  };

  const handleRating = (appointmentId, appointment) => {
    setSelectedAppointment(appointment);
    setSelectedAppointmentId(appointmentId);
    setIsRatingModalVisible(true);
  };

  const handleReport = (appointmentId, appointment) => {
    setSelectedAppointment(appointment);
    setSelectedAppointmentId(appointmentId);
    setIsReportModalVisible(true);
  };

  const handleReportOk = async () => {
    setIsLoading(true);
    setLoading(true);
    const formData = new FormData();
    formData.append("SalonId", selectedAppointment?.salonInformation?.id); // Replace with actual value
    formData.append("CustomerId", idCustomer);
    formData.append(
      "AppointmentId",
      selectedAppointment?.appointmentDetails[0]?.appointmentId
    );
    formData.append("RoleNameReport", "Customer"); // Replace with actual value
    formData.append("ReasonReport", reportDescription); // Replace with actual value
    fileList.forEach((file) => {
      formData.append("ImgeReportRequest", file.originFileObj);
    });
    setIsReportModalVisible(false);
    await dispatch(actCreateReportCustomer(formData))
      .then((response) => {
        setLoading(false);
        setIsLoading(false);
        setStatus("SUCCESSED");
        setSelectedAppointment(null);
      })
      .catch((error) => {
        // Handle error here
        console.error("Error creating report:", error);
      })
      .finally((e) => {
        setLoading(false);
        setIsLoading(false);
      });
    await dispatch(
      actGetAppointmentByCustomerId(idCustomer, currentPage, pageSize, status)
    );
    // Handle success here

    // Example fetch usage
  };

  const handleReportCancel = () => {
    // Reset state if canceling report
    setReportImage(null);
    setIsReportModalVisible(false);
  };

  const handleUploadChange = (info) => {
    const { status, fileList } = info; // Get fileList from info

    if (status === "done") {
      message.success(`${info.file.name} đã được tải lên thành công.`);
      setReportImage(info.file);
      setUploadedImageUrl(info.file.response.url);
    } else if (status === "error") {
      message.error(`${info.file.name} tải lên thất bại.`);
    }

    // Update fileList state
    setFileList(fileList);
  };

  const navigate = useNavigate();
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
            onClick={() =>
              navigate(
                `/salon_detail/${selectedAppointmentDetail?.salonInformation.id}`
              )
            }
          >
            <Text strong style={{ fontSize: "16px" }}>
              Thông tin Salon | Barber shop
            </Text>
            <div>
              <Image
                src={selectedAppointmentDetail?.salonInformation.img}
                preview={false}
                style={{ marginBottom: "10px", marginTop: "10px" }}
                width={300}
                height={200}
              />
              <p>
                <Text strong>Tên tiệm: </Text>
                <Text>{selectedAppointmentDetail?.salonInformation.name}</Text>
              </p>
              <p>
                <Text strong>Địa chỉ: </Text>
                <Text>
                  {selectedAppointmentDetail?.salonInformation.address}
                </Text>
              </p>
            </div>
          </div>

          {/* B2: Mã QR */}
          <div
            className={styles.appointmentDetailB2}
            style={{ marginTop: "1rem" }}
          >
            {selectedAppointmentDetail?.status === "" && <div></div>}
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
                <Text>
                  {formatVND(selectedAppointmentDetail.originalPrice)} VND
                </Text>
              </p>
              {/* <p>
                <Text strong>Mã Khuyến mãi: </Text>
                <Text>{selectedAppointmentDetail?.promoCode}</Text>
              </p> */}
              <p>
                <Text strong>Giảm giá: </Text>
                <Text>
                  {formatVND(selectedAppointmentDetail.discountedPrice)} VND
                </Text>
              </p>
              <p>
                <Text strong>Cần thanh toán: </Text>
                <Text strong style={{ color: "red" }}>
                  {formatVND(selectedAppointmentDetail.totalPrice)} VND
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

  const columns = [
    {
      title: "Tên salon",
      dataIndex: "salonInformation",
      key: "salonName",
      render: (salonInformation) => salonInformation?.name,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (createdDate) => formatDate(createdDate),
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
      title: "Tổng giá",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (totalPrice) => `${formatVND(totalPrice)} VND`,
    },
    // {
    //   title: "Trạng thái",
    //   dataIndex: "status",
    //   key: "status",
    //   render: (status) => (
    //     <Tag color={statusColors[status]}>{statusDisplayNames[status]}</Tag>
    //   ),
    // },
    {
      title: "Chi tiết",
      key: "detail",
      render: (text, record) => (
        <Button
          className={styles.detailBtn}
          onClick={() => showAppointmentDetail(record)}
        >
          Xem chi tiết
        </Button>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (text, record) => {
        const { status, isFeedback, isReportByCustomer, id } = record;

        if (status === "BOOKING") {
          return (
            <Button danger onClick={() => handleCancel(id)}>
              Hủy cuộc hẹn
            </Button>
          );
        } else if (status === "SUCCESSED") {
          return (
            <>
              <Button
                style={{ marginRight: "1rem" }}
                type={isFeedback ? "" : "primary"}
                size="medium"
                onClick={() => handleRating(id, record)}
                disabled={isFeedback}
              >
                {isFeedback ? "Đã đánh giá" : "Đánh giá"}
              </Button>
              <Button
                danger
                onClick={() => handleReport(id, record)}
                disabled={isReportByCustomer}
              >
                {isReportByCustomer ? "Đã báo cáo" : "Báo cáo"}
              </Button>
            </>
          );
        } else {
          return <Text italic>Không có hành động</Text>; // Hoặc có thể thay bằng biểu tượng
        }
      },
    },
  ];
  // const groupedServices = selectedAppointment?.appointmentDetails.reduce(
  //   (acc, curr) => {
  //     const { salonEmployee } = curr;
  //     if (!acc[salonEmployee.id]) {
  //       acc[salonEmployee.id] = {
  //         employee: salonEmployee,
  //         services: [],
  //       };
  //     }
  //     acc[salonEmployee.id].services.push(curr);
  //     return acc;
  //   },
  //   {}
  // );
  const groupedAppointments =
    selectedAppointment?.appointmentDetails &&
    Array.isArray(selectedAppointment?.appointmentDetails)
      ? selectedAppointment?.appointmentDetails.reduce((acc, curr) => {
          // Kiểm tra salonEmployee có tồn tại không
          const employeeId = curr?.salonEmployee?.id;
          if (employeeId) {
            if (!acc[employeeId]) {
              acc[employeeId] = {
                employee: curr.salonEmployee,
                services: [],
              };
            }
            acc[employeeId].services.push(curr.serviceName);
          }
          return acc;
        }, {})
      : {};

  const handleExpandToggle = (employeeId) => {
    setExpanded({
      ...expanded,
      [employeeId]: !expanded[employeeId], // Đảo ngược trạng thái mở rộng
    });
  };

  const groupedAppointmentsbyDate = customerAppointments.reduce(
    (acc, appointment) => {
      const date = moment(appointment.startDate).format("DD/MM/YYYY");
      acc[date] = acc[date] || [];
      acc[date].push(appointment);
      return acc;
    },
    {}
  );

  const handleLoadMore = () => {
    setPageSize((prevSize) => prevSize + 4); // Tăng thêm 5 mỗi khi nhấn Load More
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
                fontSize: "1rem",
                fontWeight: "bold",
              }}
            >
              {statusDisplayNames[statusKey]}
            </button>
          ))}
        </div>

        <div className={styles.filterDate}>
          <Text strong>Lọc theo ngày: </Text>
          <DatePicker onChange={handleDateChange} />
        </div>

        <Table
          className={styles.appointmentTable}
          columns={columns}
          dataSource={customerAppointments}
          // loading={loading}
          rowKey="id"
          pagination={false}
        />
        <div className={styles.container}>
          {/* {loading && (
            <div className={styles.overlay}>
              <LoadingOutlined style={{ fontSize: "2rem" }} />
            </div>
          )} */}

          {customerAppointments?.length === 0 && status && (
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
            <div key={date} className={styles.dateGroup}>
              <h3 className={styles.dateHeader}>{date}</h3> */}
          <div className={styles.grid}>
            {customerAppointments.map((appointment) => (
              <div key={appointment.id} className={styles.card}>
                <img
                  src={appointment.salonInformation.img}
                  alt="Salon"
                  className={styles.salonImage}
                />
                <h4
                  style={{
                    fontWeight: "bold",
                    color: "#bf9456",
                    textAlign: "center",
                  }}
                >
                  {appointment.salonInformation.name}
                </h4>
                <h4>
                  {" "}
                  Ngày tạo lịch hẹn: {formatDate(appointment?.createdDate)}
                </h4>
                <h4>
                  Ngày bắt đầu:{" "}
                  {formatDate(appointment?.appointmentDetails[0]?.startTime)}
                </h4>
                <h4>Tổng giá tiền: {formatCurrency(appointment.totalPrice)}</h4>
                <Button
                  style={{
                    backgroundColor: "#bf9456",
                    marginBottom: "0.5rem",
                  }}
                  onClick={() => showAppointmentDetail(appointment)}
                >
                  Xem chi tiết
                </Button>
                {appointment.status === "BOOKING" && (
                  <Button danger onClick={() => handleCancel(appointment.id)}>
                    Hủy cuộc hẹn
                  </Button>
                )}
                {appointment.status === "SUCCESSED" &&
                  !appointment.isFeedback && (
                    <Button
                      onClick={() => handleRating(appointment.id, appointment)}
                    >
                      {"Đánh giá"}
                    </Button>
                  )}
                {appointment.status === "SUCCESSED" &&
                  appointment.isFeedback && (
                    <Button disabled>{"Đã đánh giá"}</Button>
                  )}
              </div>
            ))}
          </div>
          {/* </div>
          )
        )} */}
        </div>

        {/* {totalPages !== 1 && totalPages !== 0 && (
        <button onClick={handleLoadMore} className={styles.loadmorebtn}>
          {loading && <LoadingOutlined style={{ marginRight: "5px" }} />}
          Tải thêm
        </button>
      )} */}

        <Pagination
          className="paginationAppointment"
          current={currentPage}
          pageSize={pageSize}
          total={totalPages * pageSize}
          onChange={handlePageChange}
          showSizeChanger={false}
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
        visible={selectedAppointmentDetail}
        onCancel={handleModalClose}
        footer={null}
        width={1100}
      >
        {renderAppointmentDetail()}
      </Modal>

      <Modal
        title="Xác nhận hủy"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancelModal}
        okText="Hủy cuộc hẹn"
        cancelText="Đóng"
      >
        <Input.TextArea
          value={reasonCancel}
          onChange={(e) => setReasonCancel(e.target.value)}
          placeholder="Nhập lý do hủy cuộc hẹn"
        />
      </Modal>

      {/* <Modal
        title="Đánh giá"
        visible={isRatingModalVisible}
        onOk={handleRatingOk}
        onCancel={handleRatingCancel}
        okText="Gửi"
        cancelText="Hủy"
        style={{textAlign:"center"}}
      >
        <h1 >Đánh giá nhân viên</h1>
        <div>
          <Rate
            value={rating}
            onChange={(value) => setRating(value)}
            style={{ fontSize: 24 }}
          />
        </div>
        <Input.TextArea
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Bình luận tại đây ..."
        />
        <Upload
          multiple
          fileList={feedbackFileList}
          onChange={handleFeedbackUploadChange}
          listType="picture-card"
          beforeUpload={() => false}
          className="mt-3"
        >
          <Button icon={<UploadOutlined />}></Button>
        </Upload>
      </Modal> */}
      <Modal
        title={
          <div style={{ textAlign: "center", width: "100%", fontSize: "2rem" }}>
            Đánh giá
          </div>
        }
        visible={isRatingModalVisible}
        onOk={handleRatingOk}
        onCancel={handleRatingCancel}
        footer={null} // Custom footer with your own buttons
        // style={{
        //   textAlign: "center",
        //   borderRadius: "10px",
        //   overflow: "hidden",
        // }}
      >
        <h2 className="text-lg font-medium mb-4">Đánh giá nhân viên</h2>

        {Object.keys(groupedAppointments).map((employeeId) => {
          const employee = groupedAppointments[employeeId]?.employee;
          const services = Array.isArray(
            groupedAppointments[employeeId]?.services
          )
            ? groupedAppointments[employeeId].services
            : [];
          const isExpanded = expanded[employeeId];

          const displayedServices = isExpanded
            ? services
            : services.slice(0, 3);

          return (
            <div
              className="bg-[#E9E6D9] p-4 rounded-lg shadow-md mb-4"
              key={employeeId}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-normal">
                  <Avatar
                    size={40}
                    src={employee?.img}
                    alt={employee?.fullName}
                  />
                  <h3 className="text-md font-medium ml-2">
                    {employee?.fullName}
                  </h3>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-500">
                    Dịch vụ:{" "}
                    {Array.isArray(displayedServices)
                      ? displayedServices.join(", ")
                      : ""}
                  </p>
                  {services.length > 3 && (
                    <Button
                      type="link"
                      onClick={() => handleExpandToggle(employeeId)}
                    >
                      {isExpanded ? "Thu gọn" : "Xem thêm"}
                    </Button>
                  )}
                </div>
              </div>
              <Rate
                value={ratings[employeeId] || 0}
                onChange={(value) => handleRatingChange(employeeId, value)}
                style={{ fontSize: 20, marginTop: "10px", marginLeft: "30%" }}
              />
            </div>
          );
        })}
        <Input.TextArea
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Bình luận tại đây ..."
          className="rounded-lg border border-gray-300 p-3 mt-4"
        />

        <div className="flex items-center mt-4">
          <Upload
            multiple
            fileList={feedbackFileList}
            onChange={handleFeedbackUploadChange}
            listType="picture-card"
            beforeUpload={() => false}
          >
            <Button loading={loading} icon={<UploadOutlined />}>
              Tải ảnh lên
            </Button>
          </Upload>
        </div>

        <div className="flex justify-end">
          <Button
            loading={loading}
            onClick={handleRatingOk}
            className="bg-[#8C6239] text-white mt-4 py-2 px-8 rounded-lg hover:!border-white hover:!bg-[#b08d5f] hover:!text-black"
          >
            Gửi đánh giá
          </Button>
        </div>
      </Modal>

      <Modal
        title="Báo cáo vấn đề"
        visible={isReportModalVisible}
        onOk={handleReportOk}
        onCancel={handleReportCancel}
        okText="Gửi báo cáo"
        cancelText="Đóng"
      >
        <p>Bạn có thể tải lên hình ảnh để minh chứng cho báo cáo của bạn.</p>
        <Upload
          listType="picture"
          onChange={handleUploadChange}
          maxCount={1}
          fileList={fileList}
          beforeUpload={() => false}
        >
          <Button>Tải lên</Button>
        </Upload>
        {reportImage && (
          <div style={{ marginTop: "10px" }}>
            <Image width={200} src={uploadedImageUrl} alt="Uploaded report" />
          </div>
        )}
        <Input.TextArea
          placeholder="Nhập lý do báo cáo..."
          value={reportDescription}
          onChange={(e) => setReportDescription(e.target.value)}
          rows={4}
          style={{ marginTop: "10px" }}
        />
      </Modal>
    </div>
  );
}

export default CustomerAppointmentVer2;
