import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import DatePicker from "react-datepicker";
import moment from "moment-timezone";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import styles from "../css/reviewAppointment.module.css";
import { Card, Modal, Spin } from "antd";
import { API } from "@/services/api";
import { useDispatch, useSelector } from "react-redux";
import { actGetSalonInformationByOwnerIdAsync } from "@/store/salonAppointments/action";
import { motion } from "framer-motion";
import { Doughnut } from "react-chartjs-2";
const vietnamTimeZone = "Asia/Ho_Chi_Minh";
const localizer = momentLocalizer(moment);

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
      <div className="font-semibold text-sm">{event.employeeName}</div>
      <div className="text-xs">{event.type}</div>
      {event.note && <div className="text-xs italic">{event.note}</div>}
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
  const [dataMana, setDataMana] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null); // Thêm trạng thái
  const [isModalVisible, setIsModalVisible] = useState(false); // Điều khiển modal
  const ownerId = useSelector((state) => state.ACCOUNT.idOwner);
  const salonInformationByOwnerId = useSelector(
    (state) => state.SALONAPPOINTMENTS.salonInformationByOwnerId
  );

  const dispatch = useDispatch();
  const handleEventClick = (event) => {
    setSelectedEvent(event); // Lưu sự kiện được nhấn
    setIsModalVisible(true); // Hiển thị modal
  };

  useEffect(() => {
    if (ownerId) {
      dispatch(actGetSalonInformationByOwnerIdAsync(ownerId));
    }
  }, [ownerId]);

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
      }))
    );
  };
  // Mock data based on your response structure
  const [events, setEvents] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      if (salonInformationByOwnerId?.id) {
        // Chỉ chạy khi salonInformationByOwnerId?.id tồn tại
        setLoading(true);
        try {
          const response = await API.get(
            `/salonemployees/GetEmployeesWorkSchedule/${salonInformationByOwnerId?.id}`,
            {
              params: { dateTime: moment(selectedDate).format("YYYY-MM-DD") },
            }
          );
          console.log("res", response);
          setDataMana(response?.data?.employeesSchedules);
          const transformedData = transformSchedulesToEvents(
            response.data.employeesSchedules
          );
          setEvents(transformedData); // Update state
        } catch (error) {
          console.error("Error fetching appointments:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [selectedDate, salonInformationByOwnerId]);

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

  return (
    <div className={styles.appointmentContainer}>
      <h1 className="text-2xl font-bold text-center mb-4">
        Thống kê nhân viên làm việc
      </h1>
      <Card className="p-4">
        <div style={{ width: "200px", margin: "0 auto" }}>
          <Doughnut data={data} options={options} />
        </div>
        <div className="mb-4">
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="dd/MM/yyyy"
            className="w-full p-2 border rounded-md"
          />
        </div>
        {/* <div className="h-[calc(100vh-100px)]"> */}
        {/* Tự động tính toán chiều cao */}
        <Spin className="custom-spin" spinning={loading}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            formats={formats}
            step={15}
            timeslots={4}
            defaultView="day"
            views={["day", "week"]}
            min={new Date(0, 0, 0, 6, 0, 0)}
            max={new Date(0, 0, 0, 22, 0, 0)}
            components={{
              event: EventComponent,
            }}
            date={selectedDate}
            onNavigate={setSelectedDate}
            onSelectEvent={handleEventClick} // Thêm sự kiện click
            eventPropGetter={eventPropGetter}
            style={{ height: "100vh" }}
          />
        </Spin>
        {/* </div> */}
      </Card>
      <motion.div
        className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden mt-5"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
      >
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 text-center">
            Thu nhập của nhân viên
          </h2>
        </div>

        <div className="divide-y divide-gray-100">
          {dataMana.map((employeeId) => {
            // Format currency
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
          })}
        </div>
      </motion.div>

      {/* Hiển thị modal khi click hoặc hover */}
      {selectedEvent && (
        <motion.div
          className={`fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50`}
          initial={{ opacity: 0 }}
          animate={{ opacity: isModalVisible ? 1 : 0 }}
          exit={{ opacity: 0 }}
        >
          {isModalVisible && (
            <motion.div
              className="relative bg-white rounded-lg shadow-lg w-11/12 sm:w-3/5 md:w-2/5 p-6"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              style={{
                backgroundImage: "url('/path-to-3d-hair-image.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundBlendMode: "overlay",
                backgroundColor: "rgba(255, 255, 255, 0.8)",
              }}
            >
              <button
                onClick={handleModalClose}
                className="absolute top-2 right-2 text-white bg-gray-800 hover:bg-red-500 p-2 rounded-full shadow-lg transition transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                ✕
              </button>
              <h2 className="text-xl font-semibold text-gray-800">
                Thông tin chi tiết - {selectedEvent.employeeName}
              </h2>
              <div className="mt-4">
                <p className="mb-2">
                  <b>Loại lịch:</b>{" "}
                  {selectedEvent.type === "BOOKING"
                    ? "Đang đặt"
                    : selectedEvent.type === "SUCCESSED"
                    ? "Thành công"
                    : "Tại cửa hàng"}
                </p>
                <p className="mb-2">
                  <b>Ghi chú:</b> {selectedEvent.note}
                </p>
                <p className="mb-2">
                  <b>Thời gian:</b>{" "}
                  {`${moment(selectedEvent.start).format("HH:mm")} - ${moment(
                    selectedEvent.end
                  ).format("HH:mm")}`}
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default EmployeeScheduleCalendar;
