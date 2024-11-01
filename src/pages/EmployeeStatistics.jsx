import React, { useEffect, useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import { DatePicker, Row, Col, Button, message } from "antd";
import "antd/dist/reset.css";
import styles from "../css/EmployeeStatistics.module.css"; // Import CSS tùy chỉnh
import "../css/datePickerCustome.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import {
  actGetNumberAppointmentByStatus,
  actGetRevenueandNumberofAppointment,
  actGetRateAppointmentByStatus,
  actGetRevenueofAppointmentDaybyDay,
} from "../store/employee/action";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";

// Đăng ký chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const { RangePicker } = DatePicker;

const EmployeeStatistics = () => {
  const dispatch = useDispatch();
  const [tempDates, setTempDates] = useState([
    dayjs().subtract(7, "day"), // Ngày bắt đầu
    dayjs(), // Ngày kết thúc
  ]);
  const [selectedStartDates, setSelectedStartDates] = useState(
    dayjs().subtract(7, "day").format("YYYY-MM-DD")
  ); // 7 ngày trước
  const [selectedEndDates, setSelectedEndDates] = useState(
    dayjs().format("YYYY-MM-DD")
  ); // Hôm nay
  const idEmployee = useSelector((state) => state.ACCOUNT.idEmployee);
  const numberAppointment = useSelector(
    (state) => state.EMPLOYEE.getNumberAppointmentByStatus
  );
  const rateAppointment = useSelector(
    (state) => state.EMPLOYEE.getRateAppointmentByStatus
  );
  const revenueandNumber = useSelector(
    (state) => state.EMPLOYEE.getRevenueandNumberofAppointment
  );
  const revenueandNumberDay = useSelector(
    (state) => state.EMPLOYEE.getRevenueofAppointmentDaybyDay
  );

  useEffect(() => {
    if ((idEmployee, selectedStartDates, selectedEndDates)) {
      dispatch(
        actGetNumberAppointmentByStatus(
          idEmployee,
          selectedStartDates,
          selectedEndDates
        )
      );
      dispatch(
        actGetRevenueandNumberofAppointment(
          idEmployee,
          selectedStartDates,
          selectedEndDates
        )
      );
      dispatch(
        actGetRateAppointmentByStatus(
          idEmployee,
          selectedStartDates,
          selectedEndDates
        )
      );
      dispatch(
        actGetRevenueofAppointmentDaybyDay(
          idEmployee,
          selectedStartDates,
          selectedEndDates
        )
      );
    }
  }, [idEmployee, selectedStartDates, selectedEndDates]);

  const moneyData = {
    labels: revenueandNumberDay.map((item) => dayjs(item.date).format("DD/MM")), // Chuyển đổi date thành định dạng "DD/MM"
    datasets: [
      {
        label: "Số tiền kiếm được",
        data: revenueandNumberDay.map((item) => item.revenue), // Lấy giá trị revenue
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        ticks: {
          autoSkip: true,
          maxTicksLimit: 7, // Giới hạn số nhãn tối đa
        },
      },
      y: {
        min: 0, // Đặt giá trị tối thiểu cho trục Y
      },
    },
  };

  // Chuyển đổi dữ liệu thành định dạng phù hợp cho biểu đồ Line
  const appointmentLabels = numberAppointment.map((item) =>
    dayjs(item.date).format("DD/MM")
  ); // Chuyển đổi ngày thành định dạng "DD/MM"

  const successedData = numberAppointment.map((item) => item.successed);
  const failedData = numberAppointment.map((item) => item.failed);
  const cancelByCustomerData = numberAppointment.map(
    (item) => item.cancelByCustomer
  );

  const appointmentData = {
    labels: appointmentLabels, // Gán nhãn cho biểu đồ
    datasets: [
      {
        label: "Lịch hẹn thành công",
        data: successedData, // Dữ liệu lịch hẹn thành công
        borderColor: "rgba(54, 162, 235, 1)",
        fill: false,
      },
      {
        label: "Lịch hẹn thất bại",
        data: failedData, // Dữ liệu lịch hẹn thất bại
        borderColor: "rgba(255, 99, 132, 1)",
        fill: false,
      },
      {
        label: "Lịch hẹn hủy bởi khách hàng",
        data: cancelByCustomerData, // Dữ liệu lịch hẹn hủy bởi khách hàng
        borderColor: "rgba(255, 205, 86, 1)",
        fill: false,
      },
    ],
  };

  const appointmentPieData = {
    labels: ["Thành công", "Thất bại", "Hủy bởi khách hàng"], // Nhãn cho các phần trong Pie
    datasets: [
      {
        data: [
          rateAppointment.successedRate,
          rateAppointment.failedRate,
          rateAppointment.cancelByCustomerRate,
        ], // Dữ liệu tỉ lệ
        backgroundColor: ["#36A2EB", "#FF6384", "#FFCD56"], // Màu sắc các phần
        hoverBackgroundColor: ["#36A2EB", "#FF6384", "#FFCD56"], // Màu khi hover
      },
    ],
  };

  const handleDateChange = (dates) => {
    setTempDates(dates); // Lưu ngày tạm thời
  };

  const handleFilter = () => {
    if (tempDates && tempDates.length === 2) {
      const [startDate, endDate] = tempDates; // Lấy ngày bắt đầu và kết thúc

      // Kiểm tra khoảng cách giữa ngày bắt đầu và ngày kết thúc
      const diffDays = endDate.diff(startDate, "day"); // Tính số ngày chênh lệch
      if (diffDays > 30) {
        message.error("Khoảng thời gian tối đa là 30 ngày.");
        return; // Dừng hàm nếu khoảng cách vượt quá 30 ngày
      }

      setSelectedStartDates(startDate.format("YYYY-MM-DD")); // Lưu ngày bắt đầu
      setSelectedEndDates(endDate.format("YYYY-MM-DD")); // Lưu ngày kết thúc
    } else {
      message.error("Vui lòng chọn khoảng thời gian.");
    }
  };

  const isEmptyData =
    rateAppointment.successedRate === 0 &&
    rateAppointment.failedRate === 0 &&
    rateAppointment.cancelByCustomerRate === 0;

  return (
    <div className={styles.dashboardContainer}>
      <h1>Thống kê cá nhân</h1>

      {/* RangePicker của antd */}
      <div
        className="datePickerCustome"
        // className={styles["date-picker-custome"]}
        style={{
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <RangePicker
          onChange={handleDateChange}
          defaultValue={tempDates}
          dropdownClassName="custom-dropdown-range-picker"
        />
        <Button type="primary" onClick={handleFilter}>
          Lọc
        </Button>
      </div>

      {/* Chart 1: Số tiền kiếm được */}
      {/* <div className="chart-container">
        <h2>Số tiền nhận được thông qua hệ thống</h2>
        <Line data={moneyData} />
      </div> */}
      <Row gutter={16} className={styles.responsiveCharts}>
        <Col xs={24} lg={17}>
          <div className={styles.chartContainer}>
            <h2>
              Số tiền nhận được thông qua hệ thống từ {selectedStartDates} đến{" "}
              {selectedEndDates}
            </h2>
            <Line data={moneyData} options={options} />;
          </div>
        </Col>

        <Col xs={24} lg={7}>
          <div className={styles.chartContainer}>
            <h2>
              Số tiền kiếm được từ {selectedStartDates} đến {selectedEndDates}
            </h2>
            <div>
              <span style={{ fontSize: "1.5rem", color: "#bf9456" }}>
                {revenueandNumber.totalRevenue} Vnd
              </span>{" "}
              <span style={{ fontSize: "1rem", color: "black" }}>
                / {revenueandNumber.totalAppointmentSuccessed} đơn
              </span>
            </div>
          </div>
        </Col>
      </Row>
      {/* Chart 2 và Chart 3 nằm ngang trên desktop, dọc trên mobile/tablet */}
      <Row gutter={16} className={styles.responsiveCharts}>
        <Col xs={24} lg={17}>
          <div className={styles.chartContainer}>
            <h2>
              Số lượng lịch hẹn từ {selectedStartDates} đến {selectedEndDates}
            </h2>
            <Line data={appointmentData} options={options} />
          </div>
        </Col>

        <Col xs={24} lg={7}>
          <div className={styles.chartContainer}>
            <h2>
              Tỉ lệ lịch hẹn từ {selectedStartDates} đến {selectedEndDates}
            </h2>
            {isEmptyData ? (
              <p>Không có dữ liệu để hiển thị.</p> // Hiển thị text nếu không có dữ liệu
            ) : (
              <Pie data={appointmentPieData} /> // Hiển thị Pie chart nếu có dữ liệu
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default EmployeeStatistics;
