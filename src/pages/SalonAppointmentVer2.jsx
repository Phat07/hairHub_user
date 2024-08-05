import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import {
  actGetAppointmentBySalonId,
  actGetSalonInformationByOwnerIdAsync,
} from "../store/salonAppointments/action";
import {
  Button,
  Image,
  Input,
  message,
  Modal,
  Pagination,
  Spin,
  Typography,
  Upload,
} from "antd";
import moment from "moment";
import { actCreateReportSalon } from "../store/report/action";
import { AppointmentService } from "../services/appointmentServices";
import { EmptyComponent } from "../components/EmptySection/DisplayEmpty";
import "../css/salonAppointmentV2.css";
const { Text, Title } = Typography;
function SalonAppointmentVer2(props) {
  const dispatch = useDispatch();
  const [status, setStatus] = useState("BOOKING");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [showCancelButton, setShowCancelButton] = useState(false);
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [reportImage, setReportImage] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [reportDescription, setReportDescription] = useState("");
  const [itemReport, setItemReport] = useState({});
  const [loading, setLoading] = useState(false);
  const pageSize = 4;

  const idCustomer = useSelector((state) => state.ACCOUNT.idCustomer);
  const ownerId = useSelector((state) => state.ACCOUNT.idOwner);

  const salonInformationByOwnerId = useSelector(
    (state) => state.SALONAPPOINTMENTS.salonInformationByOwnerId
  );
  const salonAppointments = useSelector(
    (state) => state.SALONAPPOINTMENTS.appointment
  );

  const totalPages = useSelector((state) => state.SALONAPPOINTMENTS.totalPages);

  useEffect(() => {
    dispatch(actGetSalonInformationByOwnerIdAsync(ownerId));
  }, [ownerId]);
  useEffect(() => {
    // Khi mở modal, đặt lại showCancelButton và thiết lập setTimeout
    if (isModalVisible) {
      setShowCancelButton(false);
      const timer = setTimeout(() => {
        setShowCancelButton(true);
      }, 2000); // 15 giây

      // Xóa timeout khi modal đóng hoặc component unmount
      return () => clearTimeout(timer);
    }
  }, [isModalVisible]);
  // useEffect(() => {
  //   if (salonInformationByOwnerId || status) {
  //     dispatch(
  //       actGetAppointmentBySalonId(
  //         currentPage,
  //         pageSize,
  //         salonInformationByOwnerId?.id,
  //         status
  //       )
  //     );
  //   }
  // }, [salonInformationByOwnerId, status, currentPage]);
  useEffect(() => {
    const fetchAppointments = async () => {
      if (salonInformationByOwnerId || status) {
        setLoading(true);
        await dispatch(
          actGetAppointmentBySalonId(
            salonInformationByOwnerId?.id,
            currentPage,
            pageSize,
            status
          )
        );
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [salonInformationByOwnerId, status, currentPage]);

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

  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
    const day = dateObj.getDate().toString().padStart(2, "0");
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
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
    console.log(appointment);
    setIsModalVisible(true);
  };
  const handleCancelAppointment = async (appointmentId, customerId) => {
    // Lấy cuộc hẹn tương ứng từ danh sách salonAppointments

    await AppointmentService.GetAppointmentSalonNotPaging(
      salonInformationByOwnerId?.id
    )
      .then((res) => {
        const dataId = res.data.find((appt) => appt.id === appointmentId);
        if (dataId?.status === "SUCCESSED") {
          setIsModalVisible(false);
          setShowCancelButton(false);
          setStatus("SUCCESSED");
        } else {
          message.warning("Chưa cập nhật trạng thái thành công cho khách hàng");
        }
        console.log("notpAging", dataId);
      })
      .catch(() => {
        console.log("err", error);
      });
  };
  const handleReport = (appointmentId) => {
    console.log("Report appointment with ID:", appointmentId);
    setIsReportModalVisible(true);
    setItemReport(appointmentId);
  };
  const handleReportCancel = () => {
    // Reset state if canceling report
    setReportImage(null);
    setIsReportModalVisible(false);
  };
  const handleReportOk = () => {
    const formData = new FormData();
    formData.append("SalonId", itemReport?.salonInformation?.id); // Replace with actual value
    formData.append("CustomerId", itemReport?.customer?.id);
    formData.append(
      "AppointmentId",
      itemReport?.appointmentDetails[0]?.appointmentId
    );
    formData.append("RoleNameReport", "SalonOwner"); // Replace with actual value
    formData.append("ReasonReport", reportDescription); // Replace with actual value
    fileList.forEach((file) => {
      formData.append("ImgeReportRequest", file.originFileObj);
    });

    dispatch(actCreateReportSalon(formData, salonInformationByOwnerId?.id))
      .then(() => {
        dispatch(
          actGetAppointmentBySalonId(
            currentPage,
            pageSize,
            salonInformationByOwnerId?.id,
            "BOOKING"
          )
        );
      })
      .catch((err) => {
        message.error("không gửi báo cáo được tới admin");
        setIsReportModalVisible(false);
      });
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
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  return (
    <div className="salon-appointment-container">
      <div className="header">
        <Title level={2}>Cuộc hẹn của salon</Title>
      </div>
      <div className="status-filter">
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
              backgroundColor: status === statusKey ? "blue" : "gray",
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
      <Spin spinning={loading}>
        {salonAppointments.length === 0 ? (
          <EmptyComponent description={"Hiện tại không có lịch hẹn nào!"} />
        ) : (
          <div className="appointment-list">
            {salonAppointments.map((appointment, key) => {
              const startTime = moment(
                appointment.appointmentDetails[0]?.startTime
              );
              const startDate = moment(appointment.startDate);
              const currentTime = moment();

              // Kiểm tra nếu ngày của startDate là ngày hôm nay
              const isSameDay = startDate.isSame(currentTime, "day");

              // Kiểm tra nếu currentTime không trễ hơn startTime (và cũng không sớm hơn)
              const isReportButtonVisible =
                isSameDay && currentTime.isSameOrAfter(startTime);
              return (
                <>
                  <div key={appointment.id} className="appointment-item">
                    <h3>{appointment.customer.fullName}</h3>
                    <p>Ngày đặt: {formatDate(appointment.startDate)}</p>
                    <p>
                      Thời gian bắt đầu:{" "}
                      {moment(
                        appointment.appointmentDetails[0]?.startTime
                      ).format("HH:mm")}
                    </p>
                    <p>
                      Tổng tiền: {appointment.totalPrice.toLocaleString()} VND
                    </p>
                    <Button
                      onClick={() => showModal(appointment)}
                      className="mr-3"
                    >
                      Cuộc hẹn
                    </Button>
                    {isReportButtonVisible && (
                      <Button onClick={() => handleReport(appointment)}>
                        {/* {appointment?.status === "SUCCESSED" ||
                      appointment?.status === "BOOKING" ? (
                        "Đánh giá"
                      ) : ( */}
                        {appointment?.isReportBySalon === true
                          ? "Đã báo cáo cho admin"
                          : "Báo cáo"}
                        {/* )} */}
                      </Button>
                    )}
                  </div>
                </>
              );
            })}
          </div>
        )}
      </Spin>
      <div className="pagination">
        <Pagination
          current={currentPage}
          total={totalPages * pageSize}
          pageSize={pageSize}
          onChange={handlePageChange}
        />
      </div>
      <Modal
        title="Thông tin cuộc hẹn"
        visible={isModalVisible}
        onCancel={handleCancel}
        // closable={false}
        // outsideClickClosable={false}
        wrapClassName="no-close-on-outside-click"
        footer={
          currentAppointment &&
          currentAppointment.status === "BOOKING" &&
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
                  Kiểm tra
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
      <Modal
        title="Báo cáo vấn đề"
        visible={isReportModalVisible}
        onOk={handleReportOk}
        onCancel={handleReportCancel}
        okText="Gửi báo cáo"
        outsideClickClosable={false}
        wrapClassName="no-close-on-outside-click"
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

export default SalonAppointmentVer2;
