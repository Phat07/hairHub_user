import React, { useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import { DatePicker, Row, Col, Button } from "antd";
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
  const [dates, setDates] = useState([]);

  // Dữ liệu giả lập cho các chart
  const moneyData = {
    labels: [
      "01/09",
      "02/09",
      "03/09",
      "04/09",
      "05/09",
      "06/09",
      "07/09",
      "08/09",
      "09/09",
      "10/09",
      "11/09",
      "12/09",
      "13/09",
      "14/09",
      "15/09",
      "16/09",
      "17/09",
      "18/09",
      "19/09",
      "20/09",
      "21/09",
      "22/09",
      "23/09",
      "24/09",
      "25/09",
      "26/09",
      "27/09",
      "28/09",
      "29/09",
      "30/09",
    ],
    datasets: [
      {
        label: "Số tiền kiếm được",
        data: [
          500, 600, 1700, 800, 900, 1000, 1100, 100, 1300, 400, 1100, 1600,
          1200, 1300, 900, 2800, 2200, 200, 2300, 2100, 200, 2600, 2900, 2900,
          900, 3500, 3100, 2200, 3300, 1400, 2500,
        ],
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
    },
  };

  const appointmentData = {
    labels: ["01/09", "02/09", "03/09", "04/09"], // Các ngày
    datasets: [
      {
        label: "Lịch hẹn thành công",
        data: [10, 20, 15, 30],
        borderColor: "rgba(54, 162, 235, 1)",
        fill: false,
      },
      {
        label: "Lịch hẹn thất bại",
        data: [5, 10, 7, 12],
        borderColor: "rgba(255, 99, 132, 1)",
        fill: false,
      },
      {
        label: "Lịch hẹn hủy bởi khách hàng",
        data: [2, 3, 5, 4],
        borderColor: "rgba(255, 205, 86, 1)",
        fill: false,
      },
    ],
  };

  const appointmentPieData = {
    labels: ["Thành công", "Thất bại", "Hủy bởi khách hàng"],
    datasets: [
      {
        data: [70, 20, 10], // Tỉ lệ lịch hẹn
        backgroundColor: ["#36A2EB", "#FF6384", "#FFCD56"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384", "#FFCD56"],
      },
    ],
  };

  // Hàm xử lý thay đổi khoảng ngày
  const handleDateChange = (dates) => {
    setDates(dates);
    console.log("Khoảng ngày:", dates);
    // Fetch dữ liệu mới từ API dựa vào khoảng thời gian được chọn
  };

  return (
    <div className={styles.dashboardContainer}>
      <h1>Thống kê cá nhân</h1>

      {/* RangePicker của antd */}
      <div
        className="datePickerCustome"
        // className={styles["date-picker-custome"]}
      >
        <RangePicker onChange={handleDateChange} />
        <Button type="primary" onClick={() => handleDateChange(dates)}>
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
            <h2>Số tiền nhận được thông qua hệ thống</h2>
            <Line data={moneyData} options={options} />;
          </div>
        </Col>

        <Col xs={24} lg={7}>
          <div className={styles.chartContainer}>
            <h2>Số tiền kiếm được từ ngày đến ngày</h2>
            <div>
              <span style={{ fontSize: "1.5rem", color: "#bf9456" }}>
                200,000
              </span>{" "}
              <span style={{ fontSize: "1rem", color: "black" }}>/15 đơn</span>
            </div>
          </div>
        </Col>
      </Row>
      {/* Chart 2 và Chart 3 nằm ngang trên desktop, dọc trên mobile/tablet */}
      <Row gutter={16} className={styles.responsiveCharts}>
        <Col xs={24} lg={17}>
          <div className={styles.chartContainer}>
            <h2>Số lượng lịch hẹn</h2>
            <Line data={appointmentData} />
          </div>
        </Col>

        <Col xs={24} lg={7}>
          <div className={styles.chartContainer}>
            <h2>Tỉ lệ lịch hẹn</h2>
            <Pie data={appointmentPieData} />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default EmployeeStatistics;
