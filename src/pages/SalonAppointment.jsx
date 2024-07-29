import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import "../css/salonAppointment.css";
import "../css/salonAppointment1.css";
import "../css/style.css";
import {
  Button,
  Card,
  Col,
  Empty,
  Image,
  Input,
  message,
  Modal,
  Pagination,
  Row,
  Typography,
  Upload,
} from "antd";
import moment from "moment";
import {
  GetAppointmentSalonByStatus,
  UpdateAppointment,
  actGetSalonInformationByOwnerIdAsync,
} from "../store/salonAppointments/action";
import { useDispatch, useSelector } from "react-redux";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { actCreateReportSalon } from "../store/report/action";
import Loader from "../components/Loader";
import { EmptyComponent } from "../components/EmptySection/DisplayEmpty";

function SalonAppointment(props) {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("BOOKING");
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [reportImage, setReportImage] = useState(null);
  const [reportDescription, setReportDescription] = useState("");
  const [showCancelButton, setShowCancelButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { Text, Title } = Typography;

  const auth = useAuthUser();
  console.log("auth", auth);

  const ownerId = auth?.idOwner;

  const salonInformationByOwnerId = useSelector(
    (state) => state.SALONAPPOINTMENTS.salonInformationByOwnerId
  );

  const salonAppointments = useSelector(
    (state) => state.SALONAPPOINTMENTS.appointment
  );

  console.log("Detail: ", salonInformationByOwnerId);
  console.log("Appointments: ", salonAppointments);
  useEffect(() => {
    if (salonInformationByOwnerId) {
      try {
        dispatch(
          GetAppointmentSalonByStatus(1, 10, salonInformationByOwnerId?.id)
        );
      } catch (err) {
        message.error("Không thể lấy dữ liệu!");
      }
    } else {
      message.error("Không thể lấy dữ liệu!");
    }
  }, [salonInformationByOwnerId]);

  useEffect(() => {
    dispatch(actGetSalonInformationByOwnerIdAsync(ownerId));
  }, []);

  useEffect(() => {
    try {
      const filtered = salonAppointments?.filter(
        (appointment) => appointment.status === selectedStatus
      );
      console.log("salonAppointments new", salonAppointments);
      setFilteredAppointments(filtered);
    } catch (err) {
      message.error("Không thể lấy dữ liệu");
    }
  }, [salonAppointments, selectedStatus]);

  useEffect(() => {
    // Khi mở modal, đặt lại showCancelButton và thiết lập setTimeout
    if (isModalVisible) {
      setShowCancelButton(false);
      const timer = setTimeout(() => {
        setShowCancelButton(true);
      }, 15000); // 15 giây

      // Xóa timeout khi modal đóng hoặc component unmount
      return () => clearTimeout(timer);
    }
  }, [isModalVisible]);

  const showModal = (appointment) => {
    setCurrentAppointment(appointment);
    console.log(appointment);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedStatus("SUCCESSED");
    dispatch(GetAppointmentSalonByStatus(1, 10, salonInformationByOwnerId?.id));
    const filtered = salonAppointments?.filter(
      (appointment) => appointment.status === "SUCCESSED"
    );
    setFilteredAppointments(filtered);
  };

  const handleCancelAppointment = async (appointmentId, customerId) => {
    // Lấy cuộc hẹn tương ứng từ danh sách salonAppointments
    const appointment = salonAppointments.find(
      (appt) => appt.id === appointmentId
    );

    if (appointment?.status === "SUCCESSED") {
      // Nếu trạng thái là "SUCCESSED", cập nhật trạng thái filter và gọi lại API
      setIsModalVisible(false);
      setShowCancelButton(false);
      setSelectedStatus("SUCCESSED");
      dispatch(
        GetAppointmentSalonByStatus(1, 10, salonInformationByOwnerId?.id)
      );
      const filtered = salonAppointments?.filter(
        (appointment) => appointment.status === "SUCCESSED"
      );
      setFilteredAppointments(filtered);
    } else {
      // Nếu không, hiển thị thông báo lỗi
      message.error("Trạng thái của cuộc hẹn chưa được cập nhật thành công");
    }
  };

  const handleFilterChange = (status) => {
    setSelectedStatus(status);
    console.log("status", status);
    dispatch(GetAppointmentSalonByStatus(1, 10, salonInformationByOwnerId?.id));
    const filtered = salonAppointments.filter(
      (appointment) => appointment.status === status
    );
    console.log("list update", filtered);
    //  gọi api khi nhấn button
    setFilteredAppointments(filtered);
    setCurrentPage(1); // Reset lại trang hiện tại
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAppointments = filteredAppointments?.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  console.log(currentAppointment);
  console.log(
    paginatedAppointments.map((appointment) => appointment.customer.fullName)
  );
  const statusDisplayNames = {
    BOOKING: "Đang đặt",
    // CANCEL_BY_SALON: "Hủy bởi Salon",
    CANCEL_BY_CUSTOMER: "Hủy bởi Khách",
    FAILED: "Thất bại",
    SUCCESSED: "Thành công",
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

  const handleReport = (appointmentId) => {
    console.log("Report appointment with ID:", appointmentId);
    setSelectedAppointmentId(appointmentId);
    setIsReportModalVisible(true);
  };
  const handleReportOk = (item) => {
    const formData = new FormData();
    console.log("data", item);
    formData.append("SalonId", item?.salonInformation?.id); // Replace with actual value
    formData.append("CustomerId", item?.customer?.id);
    formData.append(
      "AppointmentId",
      item?.appointmentDetails[0]?.appointmentId
    );
    formData.append("RoleNameReport", "SalonOwner"); // Replace with actual value
    formData.append("ReasonReport", reportDescription); // Replace with actual value
    fileList.forEach((file) => {
      formData.append("ImgeReportRequest", file.originFileObj);
    });

    dispatch(
      actCreateReportSalon(formData, salonInformationByOwnerId?.id)
    ).then(() => {
      setIsReportModalVisible(false);
    });
    // dispatch(GetAppointmentSalonByStatus(1, 10, salonInformationByOwnerId?.id));
    setIsReportModalVisible(false);

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

  return (
    <>
      <div>
        <Header />
        <div
          className="status-buttons"
          style={{
            marginTop: "140px",
            marginBottom: "2rem",
            textAlign: "center",
          }}
        >
          {Object.entries(statusDisplayNames).map(
            ([statusKey, displayName]) => (
              <Button
                key={statusKey}
                type={selectedStatus === statusKey ? "primary" : "default"}
                onClick={() => handleFilterChange(statusKey)}
                style={{ margin: "0 10px" }}
              >
                {displayName}
              </Button>
            )
          )}
        </div>

        {paginatedAppointments?.length > 0 ? (
          <div
            className="cards-container"
            // style={{
            //   margin: "0 100px",
            //   marginBottom: "2rem",
            // }}
          >
            <Row gutter={200}>
              {paginatedAppointments.map((appointment) => (
                <Col key={appointment.id} span={8}>
                  <Card
                    title={
                      <span
                        onClick={() => showModal(appointment)}
                        style={{ cursor: "pointer" }}
                      >
                        {appointment.customer.fullName}
                      </span>
                    }
                    extra={moment(appointment.startDate).format("DD/MM/YYYY")}
                    className={`card ${appointment.status}`}
                  >
                    <p>
                      Giờ:{" "}
                      {moment(
                        appointment.appointmentDetails[0]?.startTime
                      ).format("HH:mm")}
                    </p>
                    <p>Giá gốc: {formatVND(appointment.originalPrice)}vnđ</p>
                    <p>Giảm: {formatVND(appointment.discountedPrice)}vnđ</p>
                    <p>Tổng: {formatVND(appointment.totalPrice)}vnđ</p>
                    {(appointment.isBefore === true ||
                      appointment.status === "CANCEL_BY_CUSTOMER" ||
                      appointment.status === "SUCCESSED") && (
                      <Button
                        disabled={appointment?.isReportBySalon}
                        danger
                        onClick={() => handleReport(appointment)}
                      >
                        {appointment?.isReportBySalon === true
                          ? "Đã báo cáo cho admin"
                          : "Báo cáo"}
                      </Button>
                    )}
                    <Modal
                      title="Báo cáo vấn đề"
                      visible={isReportModalVisible}
                      onOk={() => handleReportOk(appointment)}
                      onCancel={handleReportCancel}
                      okText="Gửi báo cáo"
                      outsideClickClosable={false}
                      wrapClassName="no-close-on-outside-click"
                      cancelText="Đóng"
                    >
                      <p>
                        Bạn có thể tải lên hình ảnh để minh chứng cho báo cáo
                        của bạn.
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
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        ) : (
          <div className="mt-14">
            <EmptyComponent description="Hiện tại không có cuộc hẹn nào!" />
          </div>
        )}

        {salonAppointments.length > 0 && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Pagination
              current={currentPage}
              pageSize={itemsPerPage}
              total={filteredAppointments?.length}
              onChange={(page) => setCurrentPage(page)}
            />
          </div>
        )}

        <Modal
          title="Thông tin cuộc hẹn"
          visible={isModalVisible}
          onCancel={handleCancel}
          closable={false}
          outsideClickClosable={false}
          wrapClassName="no-close-on-outside-click"
          footer={
            currentAppointment &&
            currentAppointment?.status === "BOOKING" &&
            showCancelButton
              ? [
                  <Button
                    key="cancel"
                    onClick={() =>
                      handleCancelAppointment(
                        currentAppointment.id,
                        currentAppointment.customerId
                      )
                    }
                  >
                    Cancel
                  </Button>,
                ]
              : null
          }
        >
          {currentAppointment && (
            <>
              <p>
                <Text strong>Khách hàng: </Text>
                <Text>{currentAppointment?.customer.fullName}</Text>
              </p>
              <p>
                <Text strong>Ngày: </Text>
                <Text>
                  {moment(currentAppointment.startDate).format("DD/MM/YYYY")}
                </Text>
              </p>
              <p>
                <Text strong>Giờ: </Text>
                <Text>
                  {moment(
                    currentAppointment.appointmentDetails[0]?.startTime
                  ).format("HH:mm")}
                </Text>
              </p>
              <p>
                <Text strong>Mã Qr xác nhận để thành công: </Text>
                <Image src={currentAppointment?.qrCodeImg} />
              </p>
              <p>
                <Text strong>Dịch vụ: </Text>
              </p>
              {currentAppointment.appointmentDetails.map((service) => (
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
                    <Text>{formatVND(service?.priceServiceHair)}</Text>
                    vnđ
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
              <p>
                <Text strong>Giá gốc: </Text>
                <Text>{formatVND(currentAppointment.originalPrice)}vnđ</Text>
              </p>
              <p>
                <Text strong>Giảm: </Text>
                <Text>{formatVND(currentAppointment.discountedPrice)}vnđ</Text>
              </p>
              <p>
                <Text strong>Tổng: </Text>
                <Text>{formatVND(currentAppointment.totalPrice)}vnđ</Text>
              </p>
            </>
          )}
        </Modal>
      </div>
      {isLoading && (
        <div className="overlay">
          <Loader />
        </div>
      )}
    </>
  );
}

export default SalonAppointment;
