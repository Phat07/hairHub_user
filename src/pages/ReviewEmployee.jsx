import React, { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { actGetSalonInformationByOwnerIdAsync } from "@/store/salonAppointments/action";
import { actGetReviewRevenue } from "@/store/salonTransaction/action";
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
  const dispatch = useDispatch();
  const idOwner = useSelector((state) => state.ACCOUNT.idOwner);

  const defaultStartDate = moment().subtract(1, "days");
  const defaultEndDate = moment();
  const [selectedDates, setSelectedDates] = useState([
    defaultStartDate,
    defaultEndDate,
  ]);
  const [formattedStartDate, setFormattedStartDate] = useState(
    defaultStartDate.format("DD/MM/YYYY")
  );
  const [formattedEndDate, setFormattedEndDate] = useState(
    defaultEndDate.format("DD/MM/YYYY")
  );
  const [startDate, setStartDate] = useState(
    defaultStartDate.format("YYYY/MM/DD")
  );
  const [endDate, setEndDate] = useState(defaultEndDate.format("YYYY/MM/DD"));
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const salonInformationByOwnerId = useSelector(
    (state) => state.SALONAPPOINTMENTS.salonInformationByOwnerId
  );

  useEffect(() => {
    if (idOwner) {
      dispatch(actGetSalonInformationByOwnerIdAsync(idOwner));
    }
  }, [idOwner]);

  const reviewRevenue = useSelector(
    (state) => state.SALONTRANSACTION.getReviewRevenue
  );

  useEffect(() => {
    if (salonInformationByOwnerId) {
      try {
        dispatch(
          actGetReviewRevenue(salonInformationByOwnerId.id, startDate, endDate)
        );
      } catch (err) {
        message.error("Không thể lấy dữ liệu!");
      }
    }
  }, [salonInformationByOwnerId, startDate, endDate]);

  if (!reviewRevenue) return null;

  const totalSuccess =
    reviewRevenue?.employees?.reduce(
      (total, employee) => total + employee.totalSuccessedAppointment,
      0
    ) || 0;

  const totalFailed =
    reviewRevenue?.employees?.reduce(
      (total, employee) => total + employee.totalFailedAppointment,
      0
    ) || 0;

  const totalCanceled =
    reviewRevenue?.employees?.reduce(
      (total, employee) => total + employee.totalCanceledAppointment,
      0
    ) || 0;

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
      render: (value) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(value),
    },
  ];

  const onDateChange = (dates, dateStrings) => {
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
        setStartDate(startDate.format("YYYY/MM/DD"));
        setEndDate(endDate.format("YYYY/MM/DD"));
        setSelectedDates(dates);
      }
    } else {
      setSelectedDates(null);
      setFormattedStartDate("");
      setFormattedEndDate("");
      setStartDate("startDate");
      setEndDate("endDate");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const currentEmployees =
    reviewRevenue?.employees?.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    ) || [];
    function formatVND(number) {
      // Chuyển đổi số thành chuỗi
      let numberString = number?.toString();
      // Sử dụng regex để thêm dấu chấm mỗi 3 chữ số từ phải sang trái
      let formattedString = numberString?.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      return formattedString + " VND";
    }

  return (
    <div className={styles["review-employee-container"]}>
      <div className={styles["choose-date-time"]}>
        <RangePicker onChange={onDateChange} value={selectedDates} />
      </div>

      <p className={styles["main-title-first"]}>
        Doanh thu salon từ ngày {formattedStartDate} đến ngày {formattedEndDate}
      </p>

      {selectedDates && (
        <div className={styles["css-mobile"]}>
          <div className={styles["total-review-container"]}>
            <div className={styles["chart-section"]}>
              <Pie data={pieData} />
            </div>
            <div className={styles["table-section"]}>
              <p className={styles["main-title-second"]}>Tổng doanh thu</p>
              <p className={styles["main-title-third"]}>
                {formatVND(reviewRevenue.totalRevenue)}
              </p>
              <Table
                dataSource={reviewRevenue.employees}
                columns={columns}
                pagination={{
                  pageSize: 5,
                  className: "paginationAppointment",
                  position: ["bottomCenter"],
                }}
                rowKey="id"
              />
            </div>
          </div>
          <p className={styles["main-title-first"]}>Thành tích nhân viên</p>
          {currentEmployees.map((employee) => (
            <div className={styles["each-review-container"]} key={employee.id}>
              <div className={styles["employee-info"]}>
                <img
                  src={employee.img}
                  alt={`${employee.fullName}'s avatar`}
                  className={styles["employee-image"]}
                />
                <p className={styles["employee-fields"]}>
                  <strong>Tên:</strong> {employee.fullName}
                </p>
                <p className={styles["employee-fields"]}>
                  <strong>Điện thoại:</strong> {employee.phone}
                </p>
                <p className={styles["employee-fields"]}>
                  <strong>Email:</strong> {employee.email || "Chưa cập nhật"}
                </p>
                <p className={styles["employee-fields"]}>
                  <strong>Thành công:</strong>{" "}
                  {employee.totalSuccessedAppointment}
                </p>
                <p className={styles["employee-fields"]}>
                  <strong>Thất bại:</strong> {employee.totalFailedAppointment}
                </p>
                <p className={styles["employee-fields"]}>
                  <strong>Hủy bởi khách:</strong>{" "}
                  {employee.totalCanceledAppointment}
                </p>
                <p className={styles["employee-fields"]}>
                  <strong>Doanh thu:</strong> {formatVND(employee.totalRevuenueEmployee)}
                </p>
              </div>
              <div className={styles["employee-chart"]}>
                <Bar data={barData(employee)} />
              </div>
            </div>
          ))}
          <Pagination
            current={currentPage}
            onChange={handlePageChange}
            total={reviewRevenue?.employees?.length || 0}
            pageSize={pageSize}
            className="paginationAppointment"
          />
        </div>
      )}
    </div>
  );
}

export default ReviewEmployee;
