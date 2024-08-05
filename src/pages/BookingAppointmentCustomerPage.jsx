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
  const itemsPerPage = 5;
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
    dispatch(
      actDeleteAppointmentByCustomerId(selectedAppointmentId, userIdCustomer)
    );
    setSelectedStatus("CANCEL_BY_CUSTOMER");
    setIsModalVisible(false);
    // Implement the cancel logic here
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
  const handleDetail = (appointment) => {
    // Thiết lập dữ liệu chi tiết của appointment và hiển thị Modal
    setSelectedAppointmentDetail(appointment);
    setIsDetailModalVisible(true);
  };

  const handleDetailModalClose = () => {
    setIsDetailModalVisible(false);
  };
  const renderAppointmentDetail = () => {
    if (!selectedAppointmentDetail) return null;

    return (
      <div className="p-5 bg-gray-100 rounded-lg shadow-md my-5">
        <div className="flex items-center mb-4">
          <Avatar
            src={selectedAppointmentDetail.customer.img}
            size={64}
            alt="Customer Image"
            className="mr-4"
          />
          <Text strong>
            Name: {selectedAppointmentDetail.customer.fullName}
          </Text>
        </div>
        <Text className="block mb-2">
          Tiệm salon: {selectedAppointmentDetail.salonInformation.name}
        </Text>
        <Text className="block mb-2">
          Địa chỉ: {selectedAppointmentDetail.salonInformation.address}
        </Text>
        <Text className="block">
          <div className="space-y-2 mt-2">
            {selectedAppointmentDetail?.appointmentDetails?.map(
              (e, index, array) => (
                <div key={index} className="flex items-center">
                  <Avatar
                    src={e?.salonEmployee?.img}
                    size={48}
                    alt="Employee Image"
                    className="mr-2"
                  />
                  <Text>
                    {e?.salonEmployee?.fullName} - {e?.serviceName} {"("}
                    {dayjs(e.startTime).format("HH:mm")} -{" "}
                    {dayjs(e.endTime).format("HH:mm")}
                    {")"}
                  </Text>
                </div>
              )
            )}
          </div>
        </Text>
      </div>
    );
  };
  return (
    <div>
      <Header />
      <div className="status-buttons">
        {Object.entries(statusDisplayNames).map(([statusKey, displayName]) => (
          <Button
            key={statusKey}
            type={selectedStatus === statusKey ? "primary" : "default"}
            onClick={() => handleFilterChange(statusKey)}
            style={{ marginRight: "10px", marginBottom: "10px" }}
          >
            {displayName}
          </Button>
        ))}
      </div>
      <Spin spinning={loading}>
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
                    <Avatar src={appointment.customer.img} />
                    <Title level={3}>{appointment.customer.fullName}</Title>
                  </Flex>
                  <Typography
                    className="whitespace-nowrap overflow-hidden text-ellipsis"
                    style={{ maxWidth: "100%" }}
                  >
                    <Title level={4} strong>
                      {appointment.salonInformation.name}
                    </Title>
                  </Typography>
                  <Text strong>
                    Ngày:
                    <Text style={{ display: "inline" }}>
                      {moment(appointment.startDate).format("DD/MM/YYYY")}
                    </Text>
                  </Text>
                  <Text strong>
                    Giờ: &nbsp;
                    <Text style={{ display: "inline" }}>
                      {moment(
                        appointment.appointmentDetails[0]?.startTime
                      ).format("HH:mm")}
                    </Text>
                  </Text>
                  <Text strong>
                    Tổng: &nbsp;
                    <Text style={{ display: "inline" }}>
                      {formatVND(appointment.totalPrice)}vnđ
                    </Text>
                  </Text>
                  <Space>
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
                    <Space className="mt-3" size={5}>
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
        <p>Bạn có chắc chắn muốn hủy dịch vụ này không?</p>
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
