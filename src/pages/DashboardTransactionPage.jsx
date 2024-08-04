import React, { useState, useEffect, useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { message, Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { actGetSalonInformationByOwnerIdAsync } from "../store/salonAppointments/action";
import { actGetAppointmentTransaction } from "../store/salonTransaction/action";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
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
    dispatch(actGetSalonInformationByOwnerIdAsync(idOwner));
  }, []);

  const salonTransaction = useSelector(
    (state) => state.SALONTRANSACTION.getSalonTransaction
  );

  const [filterDays, setFilterDays] = useState(7);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    if (salonInformationByOwnerId) {
      try {
        dispatch(
          actGetAppointmentTransaction(salonInformationByOwnerId.id, filterDays)
        );
      } catch (err) {
        message.error("Không thể lấy dữ liệu!");
      }
    }
  }, [salonInformationByOwnerId, filterDays]);

  const handleFilterChange = (event) => {
    const value = event.target.value;
    setFilterDays(parseInt(value));
    setCurrentPage(1); // Reset current page when changing filters
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

  return (
    <div style={{ marginTop: "20rem", marginLeft: "10rem", marginRight: "10rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "20px 10rem", marginTop: "20rem" }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "1.7rem", fontWeight: "bold", color: "#3FADF3" }}>
            Tổng doanh thu:{" "}
            <span style={{ fontWeight: "normal", display: "inline" }}>
              {totalRevenue?.toLocaleString() || 0}vnd
            </span>
          </p>
          <p style={{ fontSize: "1.7rem", fontWeight: "bold", color: "#3FADF3" }}>
            Tổng hoa hồng:{" "}
            <span style={{ fontWeight: "normal", display: "inline" }}>
              {totalCommission?.toLocaleString() || 0}vnd
            </span>
          </p>
        </div>
        <div style={{ flex: 1, textAlign: "right" }}>
          <p style={{ fontSize: "1.7rem", fontWeight: "bold", color: "lightcoral" }}>
            Hoa hồng chưa đóng:{" "}
            <span style={{ fontWeight: "normal", display: "inline" }}>
              {unpaidCommission?.toLocaleString() || 0}vnd
            </span>
          </p>
        </div>
      </div>
      <div style={{ marginTop: "2rem", marginLeft: "20rem", marginRight: "20rem" }}>
        <Line data={chartData} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 10rem", marginTop: "3rem", marginBottom: "1rem" }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#333", textAlign: "left", margin: 0 }}>
            Lịch sử cuộc hẹn
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <select onChange={handleFilterChange} defaultValue="7" style={{ width: "200px" }}>
            <option value="7">7 ngày gần đây</option>
            <option value="30">30 ngày gần đây</option>
          </select>
        </div>
      </div>
      <div>
        <Table
          dataSource={dataSource}
          columns={columns}
          rowKey="key"
          style={{ marginLeft: "10rem", marginRight: "10rem" }}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalItems,
            position: ["bottomCenter"],
          }}
          onChange={handleTableChange}
        />
      </div>
    </div>
  );
}

export default DashboardTransactionPage;
