import { Button, DatePicker, message, Table } from "antd";
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
} from "chart.js";
import React, { useEffect, useMemo, useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "../css/dashboardTransaction.css";
import { actGetSalonInformationByOwnerIdAsync } from "../store/salonAppointments/action";
import { actGetAppointmentTransaction } from "../store/salonTransaction/action";
import moment from "moment";
import { actGetAllPaymentList } from "@/store/config/action";
import dayjs from "dayjs";
const { RangePicker } = DatePicker;

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

function DashboardTransactionPage(props) {
  const dispatch = useDispatch();
  // const auth = useAuthUser();
  const userName = useSelector((state) => state.ACCOUNT.username);
  const userIdCustomer = useSelector((state) => state.ACCOUNT.idCustomer);
  const idOwner = useSelector((state) => state.ACCOUNT.idOwner);
  const uid = useSelector((state) => state.ACCOUNT.uid);
  const salonInformationByOwnerId = useSelector(
    (state) => state.SALONAPPOINTMENTS.salonInformationByOwnerId
  );

  useEffect(() => {
    if (idOwner) {
      dispatch(actGetSalonInformationByOwnerIdAsync(idOwner));
    }
  }, [idOwner]);

  const salonTransaction = useSelector(
    (state) => state.SALONTRANSACTION.getSalonTransaction
  );

  const [startDate, setStartDate] = useState(dayjs().startOf("month"));
  const [endDate, setEndDate] = useState(dayjs());
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPage2, setCurrentPage2] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    if (salonInformationByOwnerId || idOwner) {
      try {
        dispatch(
          actGetAppointmentTransaction(
            salonInformationByOwnerId.id,
            startDate,
            endDate
          )
        );
      } catch (err) {
        message.error("Không thể lấy dữ liệu!");
      }
    }
  }, [salonInformationByOwnerId, startDate, endDate]);

  const listPayment = useSelector(
    (state) => state.CONFIGREDUCER.getAllPaymentList
  );

  useEffect(() => {
    if (idOwner) {
      dispatch(actGetAllPaymentList(idOwner, currentPage2, pageSize));
    }
  }, [idOwner, currentPage2]);

  const columnsPayment = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) =>
        index + 1 + (currentPage2 - 1) * pageSize,
    },
    {
      title: "Ngày",
      dataIndex: "paymentDate",
      key: "paymentDate",
      render: (text) => moment(text).format("DD/MM/YYYY"), // Định dạng ngày
    },
    {
      title: "Tiền thanh toán (vnd)",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (text) => text?.toLocaleString() || 0,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
  ];

  const totalItemsPayment = listPayment?.length || 0;
  const dataSourcePayment = listPayment?.map((payment, index) => ({
    key: payment.id,
    index: (currentPage2 - 1) * pageSize + index + 1,
    paymentDate: payment.paymentDate,
    totalAmount: payment.totalAmount,
    description: payment.description,
  }));

  const handleTableChangePayment = (pagination) => {
    setCurrentPage2(pagination.current);
  };

  const filteredTransactions = useMemo(() => {
    if (!salonTransaction || !salonTransaction.appointmentTransactions) {
      return [];
    }
    return salonTransaction.appointmentTransactions;
  }, [salonTransaction]);

  const totalRevenue = filteredTransactions.reduce(
    (total, transaction) => total + transaction.totalPrice,
    0
  );

  const unpaidCommission =
    salonTransaction && salonTransaction.currentComssion
      ? salonTransaction.currentComssion
      : 0;

  const totalCommission =
    salonTransaction && salonTransaction.totalComssion
      ? salonTransaction.totalComssion
      : 0;

  const chartData = {
    labels: filteredTransactions.map((transaction) =>
      new Date(transaction.startDate).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Doanh thu",
        data: filteredTransactions.map((transaction) => transaction.totalPrice),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: false,
      },
      {
        label: "Hoa hồng",
        data: filteredTransactions.map(
          (transaction) =>
            (transaction.totalPrice * transaction.commissionRate) / 100
        ),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: false,
      },
    ],
  };

  const pieChartData = {
    labels: ["Thành công", "Thất bại", "Hủy bởi khách"],
    datasets: [
      {
        label: "Số lượng cuộc hẹn",
        data: [
          salonTransaction.successedAppointmentCount || 0,
          salonTransaction.failedAppointmentCount || 0,
          salonTransaction.canceledAppointmentCount || 0,
        ],
        backgroundColor: ["#4CAF50", "#FF6384", "#FFCE56"],
        hoverBackgroundColor: ["#66BB6A", "#FF6384", "#FFCE56"],
      },
    ],
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setCurrentPage(pagination.current);
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => index + 1 + (currentPage - 1) * pageSize,
    },
    {
      title: "Ngày",
      dataIndex: "startDate",
      key: "startDate",
      render: (text) => new Date(text).toLocaleDateString("en-GB"),
    },
    {
      title: "Doanh thu (vnd)",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (text) => text?.toLocaleString() || 0,
    },
    {
      title: "Hoa hồng (vnd)",
      dataIndex: "commission",
      key: "commission",
      render: (text, record) =>
        ((record.totalPrice * record.commissionRate) / 100).toLocaleString(),
    },
  ];

  const totalItems = filteredTransactions.length;
  const dataSource = filteredTransactions
    .slice((currentPage - 1) * pageSize, currentPage * pageSize)
    .map((transaction, index) => ({
      key: transaction.id,
      index: (currentPage - 1) * pageSize + index + 1,
      startDate: transaction.startDate,
      totalPrice: transaction.totalPrice,
      commissionRate: transaction.commissionRate,
    }));

  const handleDateRangeChange = (dates, dateStrings) => {
    const [startDay, endDay] = dateStrings;
    if (dates) {
      setStartDate(startDay);
      setEndDate(endDay);
    } else {
      setStartDate(dayjs().startOf("month"));
      setEndDate(dayjs());
    }
  };

  const hasPieData = pieChartData.datasets[0].data.some((value) => value > 0);

  return (
    <div className="dashboard-container">
      <div
        className="datePickerCustome"
        style={{
          marginBottom: "2rem",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <RangePicker
          onChange={handleDateRangeChange}
          placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
          value={
            startDate && endDate
              ? [
                  dayjs(startDate).isValid() ? dayjs(startDate) : null,
                  dayjs(endDate).isValid() ? dayjs(endDate) : null,
                ]
              : null
          }
          dropdownClassName="custom-dropdown-range-picker"
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div style={{ flex: 1 }}>
          <p className="dashboard-money dashboard-money-1">
            Tổng doanh thu:{" "}
            <span style={{ fontWeight: "normal", display: "inline" }}>
              {totalRevenue?.toLocaleString() || 0}vnd
            </span>
          </p>
          <p className="dashboard-money dashboard-money-1">
            Tổng hoa hồng:{" "}
            <span style={{ fontWeight: "normal", display: "inline" }}>
              {totalCommission?.toLocaleString() || 0}vnd
            </span>
          </p>
        </div>
        <div style={{ flex: 1, textAlign: "right" }}>
          <p className="dashboard-money dashboard-money-2">
            Hoa hồng chưa đóng:{" "}
            <span style={{ fontWeight: "normal", display: "inline" }}>
              {unpaidCommission?.toLocaleString() || 0}vnd
            </span>
          </p>
          <Link to="/payment_commission">
            <Button
              disabled={+unpaidCommission?.toLocaleString() === 0}
              type="primary"
            >
              Thanh toán
            </Button>
          </Link>
        </div>
      </div>
      <div className="transaction-chart-container">
        {/* Biểu đồ LineChart cho trang Transaction */}
        <div className="transaction-line-chart">
          <Line data={chartData} />
        </div>

        {/* Biểu đồ PieChart hoặc thông báo nếu không có dữ liệu cho trang Transaction */}
        <div className="transaction-pie-chart">
          {hasPieData ? (
            <Pie data={pieChartData} />
          ) : (
            <div className="transaction-no-pie-data">
              <p>Không có dữ liệu để tạo biểu đồ tròn</p>
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "3rem",
          marginBottom: "1rem",
        }}
      >
        <div style={{ flex: 1 }}>
          <p
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: "#333",
              textAlign: "left",
              margin: 0,
            }}
          >
            Lịch sử cuộc hẹn
          </p>
        </div>
      </div>
      <div>
        <Table
          dataSource={dataSource}
          columns={columns}
          rowKey="key"
          pagination={{
            className: "paginationAppointment",
            current: currentPage,
            pageSize: pageSize,
            total: totalItems,
            position: ["bottomCenter"],
          }}
          onChange={handleTableChange}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "3rem",
          marginBottom: "1rem",
        }}
      >
        <div style={{ flex: 1 }}>
          <p
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: "#333",
              textAlign: "left",
              margin: 0,
            }}
          >
            Lịch sử thanh toán
          </p>
          <div>
            <Table
              dataSource={dataSourcePayment}
              columns={columnsPayment}
              rowKey="key"
              pagination={{
                className: "paginationAppointment",
                current: currentPage2,
                pageSize: pageSize,
                total: totalItemsPayment,
                position: ["bottomCenter"],
              }}
              onChange={handleTableChangePayment}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardTransactionPage;
