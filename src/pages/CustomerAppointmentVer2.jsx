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
} from "antd";
import moment from "moment";
import { DownOutlined, UploadOutlined } from "@ant-design/icons";
import { actCreateFeedbackCustomer } from "../store/ratingCutomer/action";
import { actCreateReportCustomer } from "../store/report/action";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;
const { Option } = Select;

function CustomerAppointmentVer2(props) {
  const dispatch = useDispatch();
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
  const [isLoading, setIsLoading] = useState(false);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const pageSize = 5;

  const idCustomer = useSelector((state) => state.ACCOUNT.idCustomer);
  const customerAppointments = useSelector(
    (state) => state.CUSTOMERAPPOINTMENTS.appointment
  );
 
  const totalPages = useSelector(
    (state) => state.CUSTOMERAPPOINTMENTS.totalPages
  );

  useEffect(() => {
    const fetchAppointments = async () => {
      if (status) {
        setLoading(true);
        await dispatch(
          actGetAppointmentByCustomerId(
            idCustomer,
            currentPage,
            pageSize,
            status
          )
        );
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [idCustomer, status, currentPage]);

  useEffect(() => {
    setFilteredAppointments(customerAppointments);
  }, [customerAppointments]);

  const handleFilterChange = (value) => {
    let sortedAppointments;
    if (value === "newest") {
      sortedAppointments = [...customerAppointments].sort(
        (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
      );
    } else if (value === "oldest") {
      sortedAppointments = [...customerAppointments].sort(
        (a, b) => new Date(a.createdDate) - new Date(b.createdDate)
      );
    }
    setFilteredAppointments(sortedAppointments);
  };

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
    return String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  const showAppointmentDetail = (appointment) => {
    setSelectedAppointmentDetail(appointment);
  };

  const handleModalClose = () => {
    setSelectedAppointmentDetail(null);
  };

  const handleOk = async () => {
    if (!reasonCancel) {
      message.error("Vui lòng cung cấp lý do hủy.");
      return;
    }

    await dispatch(
      actDeleteAppointmentByCustomerId(
        selectedAppointmentId,
        idCustomer,
        reasonCancel
      )
    );
    setStatus("CANCEL_BY_CUSTOMER");
    setIsModalVisible(false);
    setReasonCancel("");
  };

  const handleCancelModal = () => {
    setIsModalVisible(false);
  };

  const handleCancel = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setIsModalVisible(true);
  };

  const handleRatingOk = () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("SalonId", selectedAppointment?.salonInformation?.id);
    formData.append("CustomerId", idCustomer);
    formData.append(
      "AppointmentId",
      selectedAppointment?.appointmentDetails[0]?.appointmentId
    );
    formData.append("Rating", rating);
    formData.append("Comment", comment);
    feedbackFileList.forEach((file) => {
      formData.append("ImgFeedbacks", file.originFileObj);
    });
    setIsRatingModalVisible(false);
    dispatch(actCreateFeedbackCustomer(formData, idCustomer))
      .then((response) => {
        setIsLoading(false);
        setRating(null);
        setComment(null);
        setFeedbackFileList([]);
        setSelectedAppointment(null);
        // Handle success here
        console.log("Feedback created successfully:", response);
      })
      .catch((error) => {
        // Handle error here
        console.error("Error creating feedback:", error);
      })
      .finally((e) => {
        setIsLoading(false);
      });
  };

  const handleRatingCancel = () => {
    setRating(0);
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

  const handleReportOk = () => {
    setIsLoading(true);
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
    dispatch(actCreateReportCustomer(formData))
      .then((response) => {
        setIsLoading(false);
        setStatus("SUCCESSED");
        setSelectedAppointment(null);
        dispatch(
          actGetAppointmentByCustomerId(
            idCustomer,
            currentPage,
            pageSize,
            status
          )
        );
        // Handle success here
        console.log("Report created successfully:", response);
      })
      .catch((error) => {
        // Handle error here
        console.error("Error creating report:", error);
      })
      .finally((e) => {
        setIsLoading(false);
      });

    // Example fetch usage
  };

  const handleReportCancel = () => {
    // Reset state if canceling report
    setReportImage(null);
    setIsReportModalVisible(false);
  };

  const handleUploadChange = (info) => {
    const { status, fileList } = info; // Get fileList from info
    console.log("info", info);

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
            {selectedAppointmentDetail?.status !== "CANCEL_BY_CUSTOMER" && (
              <div style={{ padding: "10px", border: "1px solid #ccc" }}>
                {/* <Text strong>Mã QR xác nhận để thành công:</Text> */}
                {/* <Image
                  src={selectedAppointmentDetail?.qrCodeImg}
                  style={{ width: "100%", marginTop: "10px" }}
                /> */}
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
                <Text strong>Ngày hẹn: </Text>
                <Text>
                  {moment(selectedAppointmentDetail.startDate).format(
                    "DD/MM/YYYY"
                  )}
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
      title: "Tổng giá",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (totalPrice) => `${formatVND(totalPrice)} VND`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={statusColors[status]}>{statusDisplayNames[status]}</Tag>
      ),
    },
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

  return (
    <div className={styles.appointmentContainer}>
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

      <Select
        defaultValue="newest"
        className={styles.select}
        onChange={handleFilterChange}
        suffixIcon={
          <DownOutlined style={{ color: "#bf9456", pointerEvents: "none" }} />
        }
      >
        <Option value="newest">Mới nhất</Option>
        <Option value="oldest">Cũ nhất</Option>
      </Select>

      <Table
        className={styles.appointmentTable}
        columns={columns}
        dataSource={filteredAppointments}
        loading={loading}
        rowKey="id"
        pagination={false}
      />

      <Pagination
        className="paginationAppointment"
        current={currentPage}
        pageSize={pageSize}
        total={totalPages * pageSize}
        onChange={handlePageChange}
        showSizeChanger={false}
      />

      <Modal
        title="Chi tiết cuộc hẹn"
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

      <Modal
        title="Đánh giá dịch vụ"
        visible={isRatingModalVisible}
        onOk={handleRatingOk}
        onCancel={handleRatingCancel}
        okText="Gửi"
        cancelText="Hủy"
      >
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
          placeholder="Nhập bình luận"
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
