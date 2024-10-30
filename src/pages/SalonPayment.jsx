import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { actGetAllPaymentByOwnerId } from "../store/salonPayment/action";
import { Table } from "antd";

function SalonPayment(props) {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // const auth = useAuthUser();
  // console.log("auth", auth);
  const idCustomer = useSelector((state) => state.ACCOUNT.idCustomer);
  const idOwner = useSelector((state) => state.ACCOUNT.idOwner);

  const salonPayment = useSelector(
    (state) => state.PAYMENTREDUCER.getPaymentSalon
  );

  useEffect(() => {
    dispatch(actGetAllPaymentByOwnerId(currentPage, pageSize, idOwner));
  }, [dispatch, currentPage, pageSize]);


  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const columns = [
    {
      title: "Thứ tự",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Ngày thanh toán",
      dataIndex: "paymentDate",
      key: "paymentDate",
      render: (text) => {
        const date = new Date(text);
        const formattedDate = `${String(date.getDate()).padStart(
          2,
          "0"
        )}/${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}/${date.getFullYear()} - ${String(date.getHours()).padStart(
          2,
          "0"
        )}:${String(date.getMinutes()).padStart(2, "0")}`;
        return formattedDate;
      },
    },
    {
      title: "Tổng số tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (text) =>
        text.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "methodBanking",
      key: "methodBanking",
      render: (text) =>
        text === "None" ? "Không có phương thức thanh toán cụ thể" : text,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
  ];

  const paymentArrays = Array.isArray(salonPayment?.items)
    ? salonPayment.items.sort(
        (a, b) => new Date(b.paymentDate) - new Date(a.paymentDate)
      )
    : [];

  return (
    <div style={{ padding: "20px", marginTop: "25rem" }}>
      <Table
        dataSource={paymentArrays}
        columns={columns}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: salonPayment?.total || 0,
          position: ["bottomCenter"],
        }}
        onChange={handleTableChange}
      />
    </div>
  );
}

export default SalonPayment;
