import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import DatePicker from "react-datepicker";
import moment from "moment-timezone";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import styles from "../css/reviewAppointment.module.css";
import {
  Avatar,
  Button,
  Card,
  Image,
  Modal,
  Pagination,
  Spin,
  Table,
} from "antd";
import { API } from "@/services/api";
import { useDispatch, useSelector } from "react-redux";
import { actGetSalonInformationByOwnerIdAsync } from "@/store/salonAppointments/action";
import { motion } from "framer-motion";
import { Doughnut } from "react-chartjs-2";
import "../css/Customeschedule.css";
import { Typography } from "antd";

// import styles from "../css/customerAppointment.module.css";
import "react-calendar/dist/Calendar.css";
import { AppointmentService } from "@/services/appointmentServices";
import { formatCurrency } from "@/components/formatCheckValue/formatCurrency";
import { PlusOutlined } from "@ant-design/icons";
import AddAppointmentOutsite from "@/components/AddApointmentOutside/AddAppointmentOutsite";
import { actGetEmployeesWorkSchedule } from "@/store/salonEmployees/action";
const vietnamTimeZone = "Asia/Ho_Chi_Minh";
const localizer = momentLocalizer(moment);
const { Text } = Typography;
const data = {
  labels: ["Đang đặt", "Thành công", "Tại cửa hàng"],
  datasets: [
    {
      data: [1, 1, 1], // Giá trị dummy để hiện đều
      backgroundColor: ["#3B82F6", "#22C55E", "#8B5CF6"],
      hoverOffset: 4,
    },
  ],
};

const dataColor = {
  labels: ["Đang đặt", "Thành công", "Tại cửa hàng"],
  backgroundColor: ["#3B82F6", "#22C55E", "#8B5CF6"],
};

const options = {
  plugins: {
    legend: {
      display: true,
      position: "top",
      labels: {
        usePointStyle: true,
        font: { size: 14 },
      },
    },
    tooltip: {
      enabled: false, // Không cần tooltip
    },
  },
  responsive: true,
  cutout: "90%", // Làm biểu đồ dạng vòng tròn nhỏ
};

const getEventStyle = (type) => {
  switch (type) {
    case "SUCCESSED":
      return {
        backgroundColor: "#DCFCE7",
        borderColor: "#22C55E", // darker green
        color: "#166534", // text color
      };
    case "OUT_SIDE":
      return {
        backgroundColor: "#EDE9FE", // light purple
        borderColor: "#8B5CF6", // darker purple
        color: "#4C1D95", // text color (dark purple)
      };
    case "BOOKING":
      return {
        backgroundColor: "#E0F2FE", // light blue
        borderColor: "#3B82F6", // darker blue
        color: "#1E40AF", // text color
      };
    default:
      return {
        backgroundColor: "#F3F4F6", // light gray
        borderColor: "#9CA3AF", // darker gray
        color: "#374151", // text color
      };
  }
};

const EventComponent = ({ event }) => {
  const style = getEventStyle(event.type);

  return (
    <div
      className="p-1 rounded border-l-4 text-black"
      style={{
        backgroundColor: style.backgroundColor,
        borderLeftColor: style.borderColor,
        color: style.color,
      }}
    >
      <div>
        {event.employeeName} -
        {event.type === "BOOKING"
          ? "Đang đặt"
          : event.type === "SUCCESSED"
          ? "Thành công"
          : "Tại cửa hàng"}
      </div>
      {/* {event.note && <div className="text-xs italic">{event.note}</div>} */}
    </div>
  );
};

const eventPropGetter = (event) => {
  const duration = moment(event.end).diff(moment(event.start), "minutes"); // Tính độ dài sự kiện tính bằng phút
  const eventHeight = duration > 30 ? 80 : 40; // Sự kiện dài hơn 30 phút sẽ có chiều cao lớn hơn

  return {
    style: {
      height: `${eventHeight}px`, // Điều chỉnh chiều cao sự kiện
    },
  };
};

const EmployeeScheduleCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dataMana, setDataMana] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null); // Thêm trạng thái
  const [isModalVisible, setIsModalVisible] = useState(false); // Điều khiển modal
  const [isModalAddAppointmentVisible, setIsModalAddAppointmentVisible] =
    useState(false);
  const ownerId = useSelector((state) => state.ACCOUNT.idOwner);
  const workEmployee = useSelector(
    (state) => state.SALONEMPLOYEES.workEmployee
  );
  console.log(workEmployee.list);

  const salonInformationByOwnerId = useSelector(
    (state) => state.SALONAPPOINTMENTS.salonInformationByOwnerId
  );
  const [dataAppoiment, setDataAppoinment] = useState("");

  const dispatch = useDispatch();
  const handleEventClick = (event) => {
    setSelectedEvent(event); // Lưu sự kiện được nhấn
    setLoading(true);
    AppointmentService.getAppointmentById(event?.appointmentId)
      .then((res) => {
        console.log("res", res);
        setDataAppoinment(res?.data);
      })
      .catch((err) => {
        setLoading(false);
      })
      .finally((err) => {
        setLoading(false);
      });
    setIsModalVisible(true); // Hiển thị modal
  };

  useEffect(() => {
    if (ownerId) {
      dispatch(actGetSalonInformationByOwnerIdAsync(ownerId));
    }
  }, [ownerId]);

  const parseTime = (timeString) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    return new Date(0, 0, 0, hours, minutes, 0);
  };

  // useState để quản lý giá trị
  const defaultMin = new Date(0, 0, 0, 6, 0, 0); // 6:00 AM
  const defaultMax = new Date(0, 0, 0, 22, 0, 0); // 10:00 PM

  const [minTime, setMinTime] = useState(defaultMin);
  const [maxTime, setMaxTime] = useState(defaultMax);

  const handleModalClose = () => {
    setSelectedEvent(null);
    setIsModalVisible(false);
  };
  const transformSchedulesToEvents = (employeesSchedules) => {
    return employeesSchedules.flatMap((employee) =>
      employee.workSchedules.map((schedule) => ({
        title: employee.fullName,
        start: new Date(schedule.startTime),
        end: new Date(schedule.endTime),
        employeeName: employee.fullName,
        type: schedule.type,
        note: schedule.note,
        employeeId: employee.id,
        appointmentId: schedule?.appointmentId,
      }))
    );
  };
  // Mock data based on your response structure
  const [events, setEvents] = useState([]);

  const handleOpenModalAddApp = () => {
    setIsModalAddAppointmentVisible(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (salonInformationByOwnerId?.id) {
        // Chỉ chạy khi salonInformationByOwnerId?.id tồn tại
        setIsLoading(true);
        try {
          // const response = await API.get(
          //   `/salonemployees/GetEmployeesWorkSchedule/${salonInformationByOwnerId?.id}`,
          //   {
          //     params: { dateTime: moment(selectedDate).format("YYYY-MM-DD") },
          //   }
          // );
          await dispatch(
            actGetEmployeesWorkSchedule(
              salonInformationByOwnerId?.id,
              moment(selectedDate).format("YYYY-MM-DD")
            )
          );
          // setMinTime(parseTime(workEmployee?.list?.startTimeSalon));
          // setMaxTime(parseTime(workEmployee?.list?.endTimeSalon));
          // setDataMana(workEmployee?.list?.employeesSchedules);
          // const transformedData = transformSchedulesToEvents(
          //   workEmployee?.list?.employeesSchedules
          // );
          // setEvents(transformedData);
        } catch (error) {
          console.error("Error fetching appointments:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [selectedDate, salonInformationByOwnerId]);

  useEffect(() => {
    const fetchData = async () => {
      if (workEmployee?.list) {
        // Chỉ chạy khi salonInformationByOwnerId?.id tồn tại
        setIsLoading(true);
        try {
          setMinTime(parseTime(workEmployee?.list?.startTimeSalon));
          setMaxTime(parseTime(workEmployee?.list?.endTimeSalon));
          setDataMana(workEmployee?.list?.employeesSchedules);
          const transformedData = transformSchedulesToEvents(
            workEmployee?.list?.employeesSchedules
          );
          setEvents(transformedData);
        } catch (error) {
          console.error("Error fetching appointments:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [workEmployee?.list]);

  // Transform employee schedules into calendar events

  // Custom time format
  const formats = {
    timeGutterFormat: "HH:mm",
    eventTimeRangeFormat: ({ start, end }) => {
      return `${moment(start).format("HH:mm")} - ${moment(end).format(
        "HH:mm"
      )}`;
    },
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    // Here you would typically fetch new data for the selected date
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Calculate total pages
  const totalPages = Math.ceil(dataMana.length / itemsPerPage);

  // Get paginated data
  const paginatedData = dataMana.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle page change
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
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
  const renderAppointmentDetail = () => {
    if (!dataAppoiment) return null;

    return (
      <div className={styles.appointmentDetail}>
        {dataAppoiment?.status === "BOOKING" && (
          <div className={styles.appointmentDetailA1}>
            {/* B2: Mã QR */}
            <div
              className={styles.appointmentDetailB2}
              style={{ marginTop: "1rem" }}
            >
              <div style={{ padding: "10px", border: "1px solid #ccc" }}>
                <Text strong>Mã QR xác nhận để thành công:</Text>
                <Image
                  src={dataAppoiment?.qrCodeImg}
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
                {dataAppoiment.appointmentDetails.map((service) => (
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
                      {formatCurrency(service?.priceServiceHair)}
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
                  {dataAppoiment?.id}
                </Text>
              </p>
              <p>
                <Text strong>Loại đơn: </Text>
                <Text style={{ color: "green" }} strong>
                  {statusDisplayNames[dataAppoiment?.status] ||
                    dataAppoiment?.status}
                </Text>
              </p>
              <p>
                <Text strong>Khách Hàng: </Text>
                <Text>{dataAppoiment?.customer.fullName}</Text>
              </p>
              <p>
                <Text strong>Ngày tạo: </Text>
                <Text>
                  {moment(dataAppoiment.createdDate).format(
                    "DD/MM/YYYY - HH:mm"
                  )}
                </Text>
              </p>
              <p>
                <Text strong>Ngày hẹn: </Text>
                <Text>
                  {moment(
                    dataAppoiment.appointmentDetails[0]?.startTime
                  ).format("DD/MM/YYYY - HH:mm")}
                </Text>
              </p>
              <p>
                <Text strong>Số tiền tạm tính: </Text>
                <Text>{formatCurrency(dataAppoiment.originalPrice)}</Text>
              </p>
              <p>
                <Text strong>Giảm giá: </Text>
                <Text>{formatCurrency(dataAppoiment.discountedPrice)}</Text>
              </p>
              <p>
                <Text strong>Cần thanh toán: </Text>
                <Text strong style={{ color: "red" }}>
                  {formatCurrency(dataAppoiment.totalPrice)}
                </Text>
              </p>
            </div>

            {/* D2: Tổng kết */}
            {dataAppoiment.status === "CANCEL_BY_CUSTOMER" && (
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
                  {moment(dataAppoiment.cancellationTime).format(
                    "DD/MM/YYYY - HH:mm"
                  )}
                </Text>
                <Divider />
                <Text strong>Lý do hủy: </Text>
                <Text>{dataAppoiment.reasonCancel}</Text>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const columnsEmployeeSchedule = [
    // {
    //   title: "Hình ảnh",
    //   dataIndex: "img",
    //   key: "img",
    //   align: "center",
    //   render: (text) => <Avatar shape="square" size={"large"} src={text} />,
    // },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      align: "center",
    },
    {
      title: "Số đơn đã phục vụ",
      dataIndex: "workSchedules",
      key: "workSchedules",
      render: (workSchedules) => workSchedules.length,
      align: "center",
    },
    {
      title: "Số tiền đã phục vụ",
      dataIndex: "totalPrice",
      key: "totalPrice",
      align: "center",
      render: (totalPrice) =>
        totalPrice.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }),
    },
  ];

  return (
    <div className={styles.appointmentContainer}>
      <h1 className="text-2xl font-bold text-center mb-4">
        Thống kê nhân viên làm việc
      </h1>
      <Card style={{ padding: "0px" }}>
        <div className="flex flex-nowrap justify-between mb-5">
          <motion.div
            className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
          >
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-sm font-bold text-gray-800 text-center">
                Thu nhập của nhân viên
              </h2>
            </div>
            {/* <div className="divide-y divide-gray-100"> */}
            {/* {paginatedData.map((employeeId) => {
                const formattedPrice = new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(employeeId?.totalPrice);

                return (
                  <div
                    key={employeeId}
                    className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200 flex justify-between items-center"
                  >
                    <div className="flex flex-col">
                      <span className="text-base font-medium text-gray-700">
                        Nhân viên
                      </span>
                      <span className="text-sm text-gray-500">
                        {employeeId?.fullName}
                      </span>
                    </div>
                    <span className="text-lg font-semibold text-green-600">
                      {formattedPrice}
                    </span>
                  </div>
                );
              })} */}
            <Table
              dataSource={paginatedData}
              columns={columnsEmployeeSchedule}
              pagination={false}
            />
            {/* </div> */}
            {/* Pagination Controls */}
            {/* <div className="flex justify-center items-center gap-2 py-4 bg-gray-50">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                Trước
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === i + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                Sau
              </button>
            </div> */}
            <Pagination
              className="paginationAppointment"
              current={currentPage}
              total={totalPages * itemsPerPage}
              pageSize={itemsPerPage}
              onChange={handlePageChange}
            />
          </motion.div>
          {/* <div style={{ width: "200px", margin: "0 auto" }}>
            <Doughnut data={data} options={options} />
          </div> */}
        </div>
        <div className="mb-4 flex flex-wrap" style={{ alignItems: "center" }}>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="dd/MM/yyyy"
            className="w-full p-2 border rounded-md"
          />
          <Button
            className={styles["table-fillter-item"]}
            type="primary"
            style={{ backgroundColor: "#BF9456", marginLeft: "5px" }}
            icon={<PlusOutlined />}
            onClick={() => setIsModalAddAppointmentVisible(true)}
          >
            Thêm lịch đặt ngoài cho hôm nay
          </Button>
        </div>
        {/* <div className="h-[calc(100vh-100px)]"> */}
        {/* Tự động tính toán chiều cao */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "8px",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "10px",
          }}
        >
          {dataColor?.labels.map((label, index) => (
            <div
              key={index}
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  backgroundColor: dataColor.backgroundColor[index],
                  borderRadius: "50%",
                }}
              ></div>
              <span>{label}</span>
            </div>
          ))}
        </div>
        <Spin className="custom-spin" spinning={isLoading}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            formats={formats}
            step={15}
            timeslots={4}
            defaultView="day"
            views={["day"]}
            min={minTime}
            max={maxTime}
            components={{
              event: EventComponent,
            }}
            className="customeSchedule"
            date={selectedDate}
            onNavigate={setSelectedDate}
            onSelectEvent={handleEventClick} // Thêm sự kiện click
            eventPropGetter={eventPropGetter}
            style={{ height: "100%" }}
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
        </Spin>
        {/* </div> */}
      </Card>
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
        onCancel={handleModalClose}
        footer={null}
        width={1100}
        loading={loading}
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <Spin className="custom-spin" size="medium" />
          </div>
        ) : (
          renderAppointmentDetail()
        )}
      </Modal>
      <AddAppointmentOutsite
        visible={isModalAddAppointmentVisible}
        onCancel={handleOpenModalAddApp}
      />
    </div>
  );
};

export default EmployeeScheduleCalendar;
