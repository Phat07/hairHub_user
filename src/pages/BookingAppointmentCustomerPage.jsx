import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import "../css/customerAppointment.css";
import {
  Button,
  Pagination,
  Modal,
  Upload,
  message,
  Image,
  Input,
  Typography,
  Flex,
  Avatar,
  ConfigProvider,
  Space,
  Rate,
  Spin,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  actDeleteAppointmentByCustomerId,
  actGetAllAppointmentByCustomerId,
  actGetAllAppointmentHistoryByCustomerId,
} from "../store/customerAppointments/action";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import moment from "moment";
import dayjs from "dayjs";
import { actCreateReportCustomer } from "../store/report/action";
import { UploadOutlined } from "@ant-design/icons";
import { actCreateFeedbackCustomer } from "../store/ratingCutomer/action";
import { TinyColor } from "@ctrl/tinycolor";
import { EmptyComponent } from "../components/EmptySection/DisplayEmpty";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";

function BookingAppointmentCustomerPage() {
  const dispatch = useDispatch();
  const userName = useSelector((state) => state.ACCOUNT.userName);
  const userIdCustomer = useSelector((state) => state.ACCOUNT.idCustomer);
  const idOwner = useSelector((state) => state.ACCOUNT.idOwner);
  const uid = useSelector((state) => state.ACCOUNT.uid);
  // const userAuth = useAuthUser();
  const [selectedStatus, setSelectedStatus] = useState("BOOKING");
  // const userIdCustomer = userAuth?.idCustomer;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [reportImage, setReportImage] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null); // State để lưu URL của hình ảnh đã tải lên
  const [reportDescription, setReportDescription] = useState("");
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRatingModalVisible, setIsRatingModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reasonCancel, setReasonCancel] = useState("");
  const [feedbackImage, setFeedbackImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [feedbackFileList, setFeedbackFileList] = useState([]);
  const colors3 = ["#40e495", "#30dd8a", "#2bb673"];

  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedAppointmentDetail, setSelectedAppointmentDetail] =
    useState(null);

  const getHoverColors = (colors) =>
    colors.map((color) => new TinyColor(color).lighten(5).toString());
  const getActiveColors = (colors) =>
    colors.map((color) => new TinyColor(color).darken(5).toString());
  const { Title, Text } = Typography;

  const [listData, setListData] = useState([]);
  const listAppoinment = useSelector(
    (state) => state.CUSTOMERAPPOINTMENTS.getAppointmentsByCustomerId
  );
  const listAppoinmentHistory = useSelector(
    (state) => state.CUSTOMERAPPOINTMENTS.getAppointmentsHistoryByCustomerId
  );

  const totalPages = useSelector(
    (state) => state.CUSTOMERAPPOINTMENTS.totalPages
  );

  const statusDisplayNames = {
    BOOKING: "Đang đặt",
    SUCCESSED: "Thành công",
    CANCEL_BY_CUSTOMER: "Đã hủy",
    FAILED: "Thất bại",
  };

  useEffect(() => {
    if (userIdCustomer) {
      dispatch(
        actGetAllAppointmentByCustomerId(
          userIdCustomer,
          currentPage,
          itemsPerPage
        )
      );
      dispatch(
        actGetAllAppointmentHistoryByCustomerId(
          userIdCustomer,
          currentPage,
          itemsPerPage
        )
      );
    }
  }, [userIdCustomer, currentPage, dispatch]);

  const handleFilterChange = (status) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };
  useEffect(() => {
    const filteredAppointments = listAppoinment?.filter(
      (appointment) => appointment.status === "BOOKING"
    );
    setListData(filteredAppointments);
  }, []);

  useEffect(() => {
    if (selectedStatus === "BOOKING" && listAppoinment) {
      const filteredAppointments = listAppoinment?.filter(
        (appointment) => appointment.status === selectedStatus
      );
      setListData(filteredAppointments);
    } else if (
      selectedStatus === "CANCEL_BY_CUSTOMER" &&
      listAppoinmentHistory
    ) {
      const filteredAppointments = listAppoinmentHistory?.filter(
        (appointment) => appointment.status === selectedStatus
      );
      setListData(filteredAppointments);
    } else if (selectedStatus === "SUCCESSED" && listAppoinmentHistory) {
      const filteredAppointments = listAppoinmentHistory?.filter(
        (appointment) => appointment.status === selectedStatus
      );
      setListData(filteredAppointments);
    } else if (selectedStatus === "FAILED" && listAppoinmentHistory) {
      const filteredAppointments = listAppoinmentHistory?.filter(
        (appointment) => appointment.status === selectedStatus
      );
      setListData(filteredAppointments);
    }
  }, [selectedStatus, listAppoinment, listAppoinmentHistory]);

  function formatVND(amount) {
    return String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  const handleReport = (appointmentId, appointment) => {
    setSelectedAppointment(appointment);
    setSelectedAppointmentId(appointmentId);
    setIsReportModalVisible(true);
  };

  const handleCancel = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    if (!reasonCancel) {
      message.error("Vui lòng cung cấp lý do hủy.");
      return;
    }

    dispatch(
      actDeleteAppointmentByCustomerId(
        selectedAppointmentId,
        userIdCustomer,
        reasonCancel
      )
    );
    setSelectedStatus("CANCEL_BY_CUSTOMER");
    setIsModalVisible(false);
    setReasonCancel("");
  };

  const handleCancelModal = () => {
    setIsModalVisible(false);
  };

  const handleReportOk = () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("SalonId", selectedAppointment?.salonInformation?.id); // Replace with actual value
    formData.append("CustomerId", userIdCustomer);
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
        setSelectedStatus("SUCCESSED");
        setSelectedAppointment(null);
        dispatch(
          actGetAllAppointmentHistoryByCustomerId(
            userIdCustomer,
            currentPage,
            itemsPerPage
          )
        );
        // Handle success here

      })
      .catch((error) => {
        // Handle error here
        // console.error("Error creating report:", error);
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
  const handleRating = (appointmentId, appointment) => {
    setSelectedAppointment(appointment);
    setSelectedAppointmentId(appointmentId);
    setIsRatingModalVisible(true);
  };

  const handleRatingOk = () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("SalonId", selectedAppointment?.salonInformation?.id);
    formData.append("CustomerId", userIdCustomer);
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
    dispatch(actCreateFeedbackCustomer(formData, userIdCustomer))
      .then((response) => {
        setIsLoading(false);
        setRating(null);
        setComment(null);
        setFeedbackFileList([]);
        setSelectedAppointment(null);
        // Handle success here
      })
      .catch((error) => {
        // Handle error here
        // console.error("Error creating feedback:", error);
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
  const handleDetail = (appointment) => {
    // Thiết lập dữ liệu chi tiết của appointment và hiển thị Modal
    setSelectedAppointmentDetail(appointment);
    setIsDetailModalVisible(true);
  };

  const handleDetailModalClose = () => {
    setIsDetailModalVisible(false);
  };

  const navigate = useNavigate();
  const renderAppointmentDetail = () => {
    if (!selectedAppointmentDetail) return null;

    return (
      <div>
        {/* First Main Section */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          {/* Left Part - Salon Information */}
          <div
            style={{
              flex: 1,
              border: "1px solid #ccc",
              padding: "10px",
              marginRight: "10px",
            }}
            onClick={() =>
              navigate(
                `/salon_detail/${selectedAppointmentDetail?.salonInformation.id}`
              )
            }
          >
            <Text strong>Thông tin Salon | Barber shop: </Text>
            <div
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              <Image
                src={selectedAppointmentDetail?.salonInformation.img}
                preview={false}
                style={{ marginBottom: "10px" }}
              />
              <p>
                <Text strong>Tên tiệm: </Text>
                <Text>{selectedAppointmentDetail?.salonInformation.name}</Text>
              </p>
              <p>
                <Text strong>Mô tả: </Text>
                <Text>
                  {selectedAppointmentDetail?.salonInformation.description}
                </Text>
              </p>
              <p>
                <Text strong>Địa chỉ: </Text>
                <Text>
                  {selectedAppointmentDetail?.salonInformation.address}
                </Text>
              </p>
            </div>
          </div>

          {/* Right Part - Services */}
          <div style={{ flex: 1, border: "1px solid #ccc", padding: "10px" }}>
            <Text strong>Dịch vụ: </Text>
            {selectedAppointmentDetail.appointmentDetails.map((service) => (
              <div
                key={service.serviceHairId}
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  marginBottom: "10px",
                }}
              >
                <p>
                  <Text strong>Tên dịch vụ: </Text>
                  <Text>{service?.serviceName}</Text>
                </p>
                <p>
                  <Text strong>Giá: </Text>
                  <Text>{formatVND(service?.priceServiceHair)}vnđ</Text>
                </p>
                <p>
                  <Text strong>Thời gian bắt đầu: </Text>
                  <Text>{moment(service?.startTime).format("HH:mm")}</Text>
                </p>
                <p>
                  <Text strong>Thời gian kết thúc: </Text>
                  <Text>{moment(service?.endTime).format("HH:mm")}</Text>
                </p>
                <p>
                  <Text strong>Nhân viên: </Text>
                  <Text>{service.salonEmployee.fullName}</Text>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Second Main Section - Centered Information */}
        <div style={{ textAlign: "center" }}>
          <p>
            <Text strong>Mã Qr xác nhận để thành công: </Text>
            <Image
              style={{ width: "15rem", height: "15rem" }}
              src={selectedAppointmentDetail?.qrCodeImg}
            />
          </p>
          <p>
            <Text strong>Ngày: </Text>
            <Text style={{ display: "inline" }}>
              {moment(selectedAppointmentDetail.startDate).format("DD/MM/YYYY")}{" "}
              -{" "}
              {moment(
                selectedAppointmentDetail.appointmentDetails[0]?.startTime
              ).format("HH:mm")}
            </Text>
          </p>
          <p>
            <Text strong>Giá gốc: </Text>
            <Text>{formatVND(selectedAppointmentDetail.originalPrice)}vnđ</Text>
          </p>

          {/* Hiển thị lý do và thời gian hủy nếu trạng thái là "Đã hủy" */}
          {selectedAppointmentDetail.status === "CANCEL_BY_CUSTOMER" && (
            <div>
              <p>
                <Text strong>Lý do hủy: </Text>
                <Text>{selectedAppointmentDetail.reasonCancel}</Text>
              </p>
              <p>
                <Text strong>Thời gian hủy: </Text>
                <Text>
                  {moment(selectedAppointmentDetail.cancellationTime).format(
                    "DD/MM/YYYY - HH:mm"
                  )}
                </Text>
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="cus-appoint-container">
      <div className="status-buttons">
        {Object.entries(statusDisplayNames).map(([statusKey, displayName]) => (
          <Button
            key={statusKey}
            type={selectedStatus === statusKey ? "primary" : "default"}
            onClick={() => handleFilterChange(statusKey)}
            style={{
              flex: "1",
              marginRight:
                displayName !== Object.keys(statusDisplayNames).length - 1
                  ? "1rem"
                  : "0",
              padding: "0.5rem 1rem",
            }}
          >
            {displayName}
          </Button>
        ))}
      </div>
      <Spin className="custom-spin" spinning={loading}>
        {listData?.length > 0 ? (
          <div className="cards-container">
            {listData.map((appointment) => {
              const appointmentDate = moment(appointment.startDate);
              const appointmentTime = moment(
                appointment.appointmentDetails[0]?.startTime,
                "HH:mm"
              );
              const currentDate = moment();
              const currentTime = moment();

              const canCancel =
                appointmentDate.isAfter(currentDate, "day") ||
                (appointmentDate.isSame(currentDate, "day") &&
                  appointmentTime.isAfter(currentTime));

              return (
                <div
                  key={appointment.id}
                  className={`card ${appointment.status}`}
                >
                  <Flex
                    onClick={() => handleDetail(appointment)}
                    gap={4}
                    wrap
                    align="start"
                    justify="start"
                  >
                    <Title style={{ margin: "0" }} level={5} strong>
                      {appointment.salonInformation.name}
                    </Title>
                    <Title style={{ margin: "0" }} level={5} strong>
                      Ngày hẹn:{" "}
                      {moment(appointment.startDate).format("DD/MM/YYYY")}
                    </Title>
                    <Title style={{ margin: "0" }} level={5} strong>
                      Thời gian:{" "}
                      {moment(
                        appointment.appointmentDetails[0]?.startTime
                      ).format("HH:mm")}
                    </Title>
                    <Title style={{ margin: "0" }} level={5} strong>
                      Tổng tiền:{" "}
                      <Text style={{ display: "inline" }}>
                        {formatVND(appointment.totalPrice)}vnđ
                      </Text>
                    </Title>
                  </Flex>

                  <Space className="mt-3">
                    {appointment.status === "SUCCESSED" && (
                      <ConfigProvider
                        theme={{
                          components: {
                            Button: {
                              colorPrimary: `linear-gradient(116deg,  ${colors3.join(
                                ", "
                              )})`,
                              colorPrimaryHover: `linear-gradient(116deg, ${getHoverColors(
                                colors3
                              ).join(", ")})`,
                              colorPrimaryActive: `linear-gradient(116deg, ${getActiveColors(
                                colors3
                              ).join(", ")})`,
                              lineWidth: 0,
                            },
                          },
                        }}
                      >
                        <Button
                          type={appointment?.isFeedback ? "" : "primary"}
                          size="medium"
                          onClick={() =>
                            handleRating(appointment.id, appointment)
                          }
                          disabled={appointment?.isFeedback}
                        >
                          {appointment?.isFeedback ? "Đã đánh giá" : "Đánh giá"}
                        </Button>
                      </ConfigProvider>
                    )}
                    <Space size={5}>
                      {appointment.status === "SUCCESSED" ? (
                        <Button
                          danger
                          onClick={() =>
                            handleReport(appointment.id, appointment)
                          }
                          disabled={appointment.isReportByCustomer}
                        >
                          {appointment.isReportByCustomer
                            ? "Đã báo cáo"
                            : "Báo cáo"}
                        </Button>
                      ) : (
                        <></>
                      )}
                    </Space>
                    {canCancel && appointment.status === "BOOKING" && (
                      <Button
                        danger
                        onClick={() => handleCancel(appointment.id)}
                      >
                        Hủy cuộc hẹn
                      </Button>
                    )}
                  </Space>
                </div>
              );
            })}
            <Modal
              title="Báo cáo vấn đề"
              visible={isReportModalVisible}
              onOk={handleReportOk}
              onCancel={handleReportCancel}
              okText="Gửi báo cáo"
              cancelText="Đóng"
            >
              <p>
                Bạn có thể tải lên hình ảnh để minh chứng cho báo cáo của bạn.
              </p>
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
                  <Image
                    width={200}
                    src={uploadedImageUrl}
                    alt="Uploaded report"
                  />
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
            <Modal
              title="Chi tiết cuộc hẹn"
              visible={isDetailModalVisible}
              onCancel={handleDetailModalClose}
              footer={[
                <Button key="close" onClick={handleDetailModalClose}>
                  Đóng
                </Button>,
              ]}
              width={1000}
            >
              {renderAppointmentDetail()}
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
          </div>
        ) : (
          <div className="mt-14">
            <EmptyComponent description={"Hiện không có lịch hẹn nào!"} />
          </div>
        )}
      </Spin>

      <div className="pagination-container">
        <Pagination
          current={currentPage}
          pageSize={itemsPerPage}
          total={+totalPages}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>
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
      {isLoading && (
        <div className="overlay">
          <Loader />
        </div>
      )}
    </div>
  );
}

export default BookingAppointmentCustomerPage;
