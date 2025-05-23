import AddAppointmentOutsite from "@/components/AddApointmentOutside/AddAppointmentOutsite";
import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Divider,
  Image,
  Input,
  message,
  Modal,
  Pagination,
  Select,
  Spin,
  Table,
  Typography,
  Upload,
} from "antd";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { debounce } from "lodash";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import stylesCard from "../css/customerAppointment.module.css";
import styles from "../css/salonAppointment.module.css";
import { AppointmentService } from "../services/appointmentServices";
import { actCreateReportSalon } from "../store/report/action";
import {
  actGetAppointmentBySalonId,
  actGetSalonInformationByOwnerIdAsync,
} from "../store/salonAppointments/action";

const { RangePicker } = DatePicker;
const { Text, Title } = Typography;
const { Option } = Select;

function SalonAppointmentVer2(props) {
  const dispatch = useDispatch();
  const [status, setStatus] = useState(null);
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
  const [dateFilter, setDateFilter] = useState({});
  const [nameFilter, setNameFilter] = useState(null);
  const [nameFilterEmployee, setNameFilterEmployee] = useState(null);
  const [nameFilterService, setNameFilterService] = useState(null);
  const [nameFilterInput, setNameFilterInput] = useState(null);
  const [nameFilterInputEmployee, setNameFilterInputEmployee] = useState(null);
  const [nameFilterInputService, setNameFilterInputService] = useState(null);

  const searchParams = new URLSearchParams(location.search);
  const appoinmentIdUrl = searchParams.get("appointmentId");
  const appoinmentStatus = searchParams.get("appoinmentStatus");
  const appoinmentServiceName = searchParams.get("appoinmentServiceName");
  const appoinmentEmployeeName = searchParams.get("appoinmentEmployeeName");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const appoinmentCustomerName = searchParams.get("appoinmentCustomerName");
  const [isModalAddAppointmentVisible, setIsModalAddAppointmentVisible] =
    useState(false);
  const [pageSize, setPageSize] = useState(6);
  const idCustomer = useSelector((state) => state.ACCOUNT.idCustomer);
  const ownerId = useSelector((state) => state.ACCOUNT.idOwner);

  const salonInformationByOwnerId = useSelector(
    (state) => state.SALONAPPOINTMENTS.salonInformationByOwnerId
  );
  const salonAppointments = useSelector(
    (state) => state.SALONAPPOINTMENTS.appointment
  );

  const totalPages = useSelector((state) => state.SALONAPPOINTMENTS.totalPages);
  const total = useSelector((state) => state.SALONAPPOINTMENTS.total);
  useEffect(() => {
    if (ownerId) {
      dispatch(actGetSalonInformationByOwnerIdAsync(ownerId));
    }
  }, [ownerId]);
  useEffect(() => {
    if (appoinmentIdUrl) {
      setLoading(true);
      AppointmentService.getAppointmentById(appoinmentIdUrl)
        .then((res) => {
          setIsModalVisible(true);
          setCurrentAppointment(res.data);
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
    if (startDate && endDate) {
      setDateFilter({
        startDay: startDate,
        endDay: endDate,
      });
    } else {
      setDateFilter({
        // startDay: dayjs().subtract(7, "day").format("YYYY-MM-DD"),
        // endDay: dayjs().format("YYYY-MM-DD"),
        startDay: "",
        endDay: "",
      });
    }
    if (appoinmentStatus) {
      setStatus(appoinmentStatus);
    } else {
      setStatus("ALL");
    }
    if (appoinmentCustomerName) {
      setNameFilter(appoinmentCustomerName);
      setNameFilterInput(appoinmentCustomerName);
    } else {
      setNameFilter(null);
      setNameFilterInput(null);
    }
    if (appoinmentServiceName) {
      setNameFilterService(appoinmentServiceName);
      setNameFilterInputService(appoinmentServiceName);
    } else {
      setNameFilterService(null);
      setNameFilterInputService(null);
    }
    if (appoinmentEmployeeName) {
      setNameFilterEmployee(appoinmentEmployeeName);
      setNameFilterInputEmployee(appoinmentEmployeeName);
    } else {
      setNameFilterEmployee(null);
      setNameFilterInputEmployee(null);
    }
  }, [
    startDate,
    endDate,
    appoinmentStatus,
    appoinmentEmployeeName,
    appoinmentServiceName,
  ]);
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

  useEffect(() => {
    const fetchAppointments = async () => {
      if (salonInformationByOwnerId?.id && status) {
        // Chỉ chạy khi salonInformationByOwnerId?.id tồn tại
        setLoading(true);
        try {
          const statusToSend = status === "ALL" ? null : status;
          await dispatch(
            actGetAppointmentBySalonId(
              salonInformationByOwnerId.id, // Không cần ?. vì đã kiểm tra ở trên
              currentPage,
              pageSize,
              statusToSend,
              false,
              dateFilter,
              nameFilter,
              nameFilterEmployee,
              nameFilterService
            )
          );
        } catch (error) {
          console.error("Error fetching appointments:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAppointments();
  }, [
    salonInformationByOwnerId?.id,
    status,
    currentPage,
    dateFilter,
    nameFilter,
    pageSize,
    nameFilterEmployee,
    nameFilterService,
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case "BOOKING":
        return "#1677ff"; // Màu cho trạng thái BOOKING
      case "CANCEL_BY_CUSTOMER":
        return "#faa500"; // Màu cho trạng thái CANCEL_BY_CUSTOMER
      case "FAILED":
        return "#ff0000"; // Màu cho trạng thái FAILED
      case "SUCCESSED":
        return "#389e0d"; // Màu cho trạng thái SUCCESSED
      case "OUT_SIDE":
        return "plum"; // Màu cho trạng thái OUT_SIDE
      case "ALL":
        return "#BF9456"; // Màu cho trạng thái ALL
      default:
        return "gray"; // Màu mặc định
    }
  };

  const statusDisplayNames = {
    ALL: "Tất cả",
    BOOKING: "Đang đặt",
    CANCEL_BY_CUSTOMER: "Hủy bởi Khách",
    FAILED: "Thất bại",
    SUCCESSED: "Thành công",
    OUT_SIDE: "Khách ngoài",
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // const handleDateChange = (date, dateString) => {
  //   console.log("date", dateString);

  //   setDateFilter(dateString);
  // };
  const handleDateRangeChange = (dates, dateStrings) => {
    const [startDay, endDay] = dateStrings; // Lấy giá trị ngày bắt đầu và kết thúc từ `dateStrings`

    console.log("Start Day:", startDay, "End Day:", endDay);

    setDateFilter({
      startDay,
      endDay,
    });
  };

  const debouncedSetNameFilter = useCallback(
    debounce((value) => {
      setNameFilter(value);
    }, 300), // 300ms debounce time
    []
  );
  const debouncedSetNameFilterEmployee = useCallback(
    debounce((value) => {
      setNameFilterEmployee(value);
    }, 300), // 300ms debounce time
    []
  );
  const debouncedSetNameFilterService = useCallback(
    debounce((value) => {
      setNameFilterService(value);
    }, 300), // 300ms debounce time
    []
  );

  const handleNameFilterChange = (e) => {
    debouncedSetNameFilter(e.target.value);
    setNameFilterInput(e.target.value);
  };
  const handleNameFilterChangeEmployee = (e) => {
    debouncedSetNameFilterEmployee(e.target.value);
    setNameFilterInputEmployee(e.target.value);
  };
  const handleNameFilterChangeService = (e) => {
    debouncedSetNameFilterService(e.target.value);
    setNameFilterInputService(e.target.value);
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

  const handleOpenModalAddApp = () => {
    setIsModalAddAppointmentVisible(false);
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
        // console.log("notpAging", dataId);
      })
      .catch(() => {
        console.log("err", error);
      });
  };

  const handleReport = (appointmentId) => {
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
    setCurrentAppointment(null);
    const url = new URL(window.location);
    url.searchParams.delete("appointmentId");
    navigate(`${url.pathname}${url.search}`);
  };

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
            // onClick={() =>
            //   navigate(
            //     `/salon_detail/${currentAppointment?.salonInformation.id}`
            //   )
            // }
          >
            <Text strong style={{ fontSize: "16px" }}>
              Thông tin Khách hàng
            </Text>
            <div>
              {/* <Image
                src={currentAppointment?.customer?.img}
                preview={false}
                style={{ marginBottom: "10px", marginTop: "10px" }}
                width={300}
                height={200}
              /> */}
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
              {/* <p>
                <Text strong>Địa chỉ: </Text>
                <Text>{currentAppointment?.salonInformation.address}</Text>
              </p> */}
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
              <p>
                <Text strong>Loại đơn: </Text>
                <Text style={{ color: "green" }} strong>
                  {statusDisplayNames[currentAppointment?.status] ||
                    currentAppointment?.status}
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
                <Text strong>Ngày tạo đơn: </Text>
                <Text>
                  {moment(currentAppointment.createdDate).format(
                    "DD/MM/YYYY - HH:mm"
                  )}
                </Text>
              </p>

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
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text, record) => {
        const statusColor = getStatusColor(record?.status); // Lấy màu chữ
        return (
          <span style={{ color: statusColor, fontWeight: "bold" }}>
            {statusDisplayNames[record?.status] || record?.status}
          </span>
        );
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
        const startTime = moment(record.appointmentDetails[0]?.startTime);
        const startDate = moment(record.startDate);
        const currentTime = moment();
        const isSameDay = startDate.isSame(currentTime, "day");
        const isReportButtonVisible =
          isSameDay && currentTime.isSameOrAfter(startTime);
        // Tính khoảng cách thời gian giữa startTime và thời gian hiện tại
        const hoursDiff = currentTime.diff(startTime, "hours");

        // Kiểm tra xem nút báo cáo có được hiển thị hay không
        const isReportExpired = hoursDiff >= 72;
        return (
          <>
            <Button
              className={styles.detailBtn}
              onClick={() => showModal(record)}
            >
              Xem chi tiết
            </Button>
            {isReportButtonVisible && (
              <Button onClick={() => handleReport(record)}>
                {record?.isReportBySalon === true
                  ? "Đã báo cáo cho admin"
                  : "Báo cáo"}
              </Button>
            )}
            {isReportButtonVisible && (
              <>
                {!isReportExpired ? (
                  <Button danger onClick={() => handleReport(record)}>
                    {record?.isReportBySalon
                      ? "Đã báo cáo cho admin"
                      : "Báo cáo"}
                  </Button>
                ) : (
                  <Button disabled>Quá hạn báo cáo</Button>
                )}
              </>
            )}
          </>
        );
      },
    },
  ];

  const groupedAppointmentsbyDate = salonAppointments.reduce(
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

  const handlePageSizeChange = (current, size) => {
    setPageSize(size); // Cập nhật pageSize
    setCurrentPage(1); // Trở về trang 1 sau khi thay đổi kích thước trang
  };

  return (
    <div className={styles.appointmentContainer}>
      <h1 className="text-2xl font-bold mb-3" style={{ textAlign: "center" }}>
        Lịch sử lịch hẹn
      </h1>
      <Spin
        className="custom-spin"
        spinning={loading}
        // tip="Loading..."
      >
        {/* <Button
          className={styles["table-fillter-item"]}
          type="primary"
          style={{ backgroundColor: "#BF9456" }}
          icon={<PlusOutlined />}
          onClick={() => setIsModalAddAppointmentVisible(true)}
        >
          Thêm lịch hẹn bên ngoài
        </Button> */}
        <div className={styles.statusfilter}>
          {Object.keys(statusDisplayNames).map((statusKey, index) => (
            <button
              key={statusKey}
              onClick={() => handleStatusChange(statusKey)}
              style={{
                flex: "1",
                marginRight:
                  index !== Object.keys(statusDisplayNames).length - 1
                    ? "0.5rem"
                    : "0",
                padding: "0.5rem 0.5rem",
                marginBottom: "0.5rem",
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
                      : status === "OUT_SIDE"
                      ? "plum"
                      : status === "ALL"
                      ? "#BF9456"
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
            {/* <DatePicker
              style={{ marginRight: "1rem" }}
              onChange={handleDateChange}
              placeholder="Lọc theo thời gian"
            /> */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="w-full lg:w-auto">
                <RangePicker
                  value={
                    dateFilter.startDay && dateFilter.endDay
                      ? [
                          dayjs(dateFilter.startDay).isValid()
                            ? dayjs(dateFilter.startDay)
                            : null,
                          dayjs(dateFilter.endDay).isValid()
                            ? dayjs(dateFilter.endDay)
                            : null,
                        ]
                      : null
                  }
                  onChange={handleDateRangeChange}
                  placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
                  defaultValue={[dayjs().subtract(7, "day"), dayjs()]}
                />
              </div>
              <div className="flex w-full lg:w-auto gap-4">
                <Input
                  className="flex-1"
                  placeholder="Tên Khách hàng"
                  value={nameFilterInput}
                  onChange={handleNameFilterChange}
                  allowClear
                />
              </div>
              <div className="flex w-full lg:w-auto gap-4">
                <Input
                  className="flex-1"
                  placeholder="Tên nhân viên"
                  value={nameFilterInputEmployee}
                  onChange={handleNameFilterChangeEmployee}
                  allowClear
                />
              </div>
              <div className="flex w-full lg:w-auto gap-4">
                <Input
                  className="flex-1"
                  placeholder="Tên dịch vụ"
                  value={nameFilterInputService}
                  onChange={handleNameFilterChangeService}
                  allowClear
                />
              </div>
            </div>
          </div>
        </div>
        <motion.p
          className="text-xl items-center font-semibold text-gray-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Tổng: {total} cuộc hẹn
        </motion.p>
        <Table
          className={stylesCard.appointmentTable}
          columns={columns}
          dataSource={salonAppointments}
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
          {salonAppointments?.length === 0 && status && (
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
            {salonAppointments.map((appointment) => {
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
                isSameDay && currentTime.isSameOrAfter(startTime);
              const isReportExpired = hoursDiff >= 72;
              const statusColor = getStatusColor(appointment?.status);
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
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {appointment.customer.fullName}
                    </span>
                  </h4>

                  <h4>
                    {appointment?.paymentMethod === "PAYBYWALLET"
                      ? "Thanh toán qua ví"
                      : appointment?.paymentMethod === "PAYINSALON"
                      ? "Thanh toán tại salon"
                      : appointment?.paymentMethod === "PAYBYBANK"
                      ? "Thanh toán qua ngân hàng"
                      : appointment?.paymentMethod}
                  </h4>
                  <h>Trạng thái đơn:</h>
                  <h4 style={{ color: statusColor }}>
                    {statusDisplayNames[appointment?.status] ||
                      appointment?.status}
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
                        <Button disabled>Quá hạn báo cáo</Button>
                      )}
                    </>
                  )}
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
          pageSizeOptions={["4", "8", "12", "20"]} // Các tùy chọn kích thước trang
          onShowSizeChange={handlePageSizeChange} // Hàm xử lý thay đổi kích thước
        />
        {/* {totalPages !== 1 && totalPages !== 0 && (
        <button onClick={handleLoadMore} className={stylesCard.loadmorebtn}>
          {loading && <LoadingOutlined style={{ marginRight: "5px" }} />}
          Tải thêm
        </button>
      )} */}
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
        width={1100}
      >
        {renderAppointmentDetail()}
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
      <AddAppointmentOutsite
        visible={isModalAddAppointmentVisible}
        onCancel={handleOpenModalAddApp}
      />
    </div>
  );
}

export default SalonAppointmentVer2;
