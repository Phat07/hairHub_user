import React, { useState } from "react";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  ArcElement,
  BarElement,
} from "chart.js";
import { DatePicker, message, Pagination, Table } from "antd";
import styles from "../css/reviewEmployee.module.css";
import { Bar, Pie } from "react-chartjs-2";
import moment from "moment";
const { RangePicker } = DatePicker;

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

function ReviewEmployee(props) {
  const [selectedDates, setSelectedDates] = useState(null);
  const [formattedStartDate, setFormattedStartDate] = useState("");
  const [formattedEndDate, setFormattedEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const reviewData = {
    totalRevenue: "250000000",
    employees: [
      {
        fullName: "Trần Xuân Tiến",
        phone: "0706600157",
        gender: "nam",
        Email: "tientranxuan263!tgmail.com",
        DateOfBirth: "2002-03-26",
        totalSuccessedAppointment: "50",
        totalFailedAppointment: "5",
        totalCanceledAppointment: "10",
        totalRevuenueEmployee: "10000000",
      },
      {
        fullName: "Trần Xuân Tiến",
        phone: "0706600157",
        gender: "nam",
        Email: "tientranxuan263!tgmail.com",
        DateOfBirth: "2002-03-26",
        totalSuccessedAppointment: "50",
        totalFailedAppointment: "5",
        totalCanceledAppointment: "10",
        totalRevuenueEmployee: "10000000",
      },
      {
        fullName: "Trần Xuân Tiến",
        phone: "0706600157",
        gender: "nam",
        Email: "tientranxuan263!tgmail.com",
        DateOfBirth: "2002-03-26",
        totalSuccessedAppointment: "50",
        totalFailedAppointment: "5",
        totalCanceledAppointment: "10",
        totalRevuenueEmployee: "10000000",
      },
      {
        fullName: "Trần Xuân Tiến",
        phone: "0706600157",
        gender: "nam",
        Email: "tientranxuan263!tgmail.com",
        DateOfBirth: "2002-03-26",
        totalSuccessedAppointment: "50",
        totalFailedAppointment: "5",
        totalCanceledAppointment: "10",
        totalRevuenueEmployee: "10000000",
      },
    ],
  };

  const totalSuccess = reviewData.employees.reduce(
    (total, employee) => total + employee.totalSuccessedAppointment,
    0
  );
  const totalFailed = reviewData.employees.reduce(
    (total, employee) => total + employee.totalFailedAppointment,
    0
  );
  const totalCanceled = reviewData.employees.reduce(
    (total, employee) => total + employee.totalCanceledAppointment,
    0
  );

  const pieData = {
    labels: ["Thành công", "Thất bại", "Hủy bởi khách"],
    datasets: [
      {
        data: [totalSuccess, totalFailed, totalCanceled],
        backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
      },
    ],
  };

  const barData = (employee) => {
    return {
      labels: ["Thành công", "Thất bại", "Hủy bởi khách"],
      datasets: [
        {
          label: employee.fullName,
          data: [
            employee.totalSuccessedAppointment,
            employee.totalFailedAppointment,
            employee.totalCanceledAppointment,
          ],
          backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
          borderColor: ["#36A2EB", "#FF6384", "#FFCE56"],
          borderWidth: 1,
        },
      ],
    };
  };

  const columns = [
    {
      title: "Nhân viên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Thành công",
      dataIndex: "totalSuccessedAppointment",
      key: "totalSuccessedAppointment",
    },
    {
      title: "Thất bại",
      dataIndex: "totalFailedAppointment",
      key: "totalFailedAppointment",
    },
    {
      title: "Hủy bởi khách",
      dataIndex: "totalCanceledAppointment",
      key: "totalCanceledAppointment",
    },
    {
      title: "Doanh thu",
      dataIndex: "totalRevuenueEmployee",
      key: "totalRevuenueEmployee",
    },
  ];

  const onDateChange = (dates, dateStrings) => {
    console.log("Selected dates:", dates);

    if (dates && dates.length === 2) {
      const [startDate, endDate] = dates;

      if (endDate.isAfter(moment(), "day")) {
        message.error(
          "Vui lòng không chọn ngày kết thúc lớn hơn ngày hiện tại"
        );
        setSelectedDates(null);
        setFormattedStartDate("");
        setFormattedEndDate("");
      } else {
        setFormattedStartDate(startDate.format("DD/MM/YYYY"));
        setFormattedEndDate(endDate.format("DD/MM/YYYY"));
        setSelectedDates(dates);
      }
    } else {
      setSelectedDates(null);
      setFormattedStartDate("");
      setFormattedEndDate("");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const currentEmployees = reviewData.employees.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className={styles["review-employee-container"]}>
      <div className={styles["choose-date-time"]}>
        <RangePicker onChange={onDateChange} />
      </div>

      {!selectedDates ? (
        <p className={styles["main-title-zero"]}>
          Vui lòng chọn khoảng thời gian muốn xem
        </p>
      ) : (
        <p className={styles["main-title-first"]}>
          Doanh thu salon từ ngày {formattedStartDate} đến ngày{" "}
          {formattedEndDate}
        </p>
      )}

      {selectedDates && (
        <div className={styles["css-mobile"]}>
          <div className={styles["total-review-container"]}>
            <div className={styles["chart-section"]}>
              <Pie data={pieData} />
            </div>
            <div className={styles["table-section"]}>
              <p className={styles["main-title-second"]}>Tổng doanh thu</p>
              <p className={styles["main-title-third"]}>
                {reviewData.totalRevenue}
              </p>
              <Table
                dataSource={reviewData.employees}
                columns={columns}
                pagination={{
                  pageSize: 5,
                  className: "paginationAppointment",
                  position: ["bottomCenter"],
                }}
                rowKey="phone"
              />
            </div>
          </div>
          <p className={styles["main-title-first"]}>Thành tích nhân viên</p>
          {currentEmployees.map((employee) => (
            <div
              className={styles["each-review-container"]}
              key={employee.phone}
            >
              <div className={styles["employee-info"]}>
                <p>
                  <strong>Tên:</strong> {employee.fullName}
                </p>
                <p>
                  <strong>Điện thoại:</strong> {employee.phone}
                </p>
                <p>
                  <strong>Email:</strong> {employee.Email}
                </p>
                <p>
                  <strong>Ngày sinh:</strong> {employee.DateOfBirth}
                </p>
                <p>
                  <strong>Thành công:</strong>{" "}
                  {employee.totalSuccessedAppointment}
                </p>
                <p>
                  <strong>Thất bại:</strong> {employee.totalFailedAppointment}
                </p>
                <p>
                  <strong>Hủy bởi khách:</strong>{" "}
                  {employee.totalCanceledAppointment}
                </p>
                <p>
                  <strong>Doanh thu:</strong> {employee.totalRevuenueEmployee}
                </p>
              </div>
              <div className={styles["employee-chart"]}>
                <Bar
                  data={barData(employee)}
                  options={{
                    responsive: true,
                    plugins: { legend: { display: false } },
                  }}
                />
              </div>
            </div>
          ))}
          <Pagination
            className="paginationAppointment"
            current={currentPage}
            pageSize={pageSize}
            total={reviewData.employees.length}
            onChange={handlePageChange}
            style={{ textAlign: "center", marginTop: "1rem" }}
          />
        </div>
      )}
    </div>
  );
}

export default ReviewEmployee;
