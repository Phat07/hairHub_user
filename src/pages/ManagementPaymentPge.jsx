import { Table, Button, Tag, Pagination } from "antd";
import { motion } from "framer-motion";
import { useState } from "react";
import "../css/customerAppointmentTable.css";
const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};
const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

// Animation variants for the description
const descriptionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const transactionData = [
  {
    key: "1",
    type: "Nạp tiền",
    date: "25/10/2024",
    amount: 5000,
    status: "Thất bại",
    method: "PayOS",
  },
  {
    key: "2",
    type: "Yêu cầu rút tiền",
    date: "24/10/2024",
    amount: 3000,
    status: "Thành công",
    method: "Bank Transfer",
  },
  {
    key: "3",
    type: "Tiền rút",
    date: "23/10/2024",
    amount: 1000,
    status: "Đang duyệt",
    method: "PayPal",
  },
];

const columns = [
  {
    title: "Hình thức",
    dataIndex: "type",
    key: "type",
  },
  {
    title: "Ngày",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Số tiền (VNĐ)",
    dataIndex: "amount",
    key: "amount",
    render: (amount) => formatCurrency(amount),
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    render: (status) => {
      let color = "green";
      if (status === "Thất bại") {
        color = "red";
      } else if (status === "Đang duyệt") {
        color = "orange";
      }
      return <Tag color={color}>{status}</Tag>;
    },
  },
  {
    title: "Phương thức thanh toán",
    dataIndex: "method",
    key: "method",
  },
  {
    title: "Hành động",
    key: "action",
    render: () => (
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button
          className="text-black border-none hover:!bg-[#A37F4A] hover:!text-white   "
          style={{ backgroundColor: "#BF9456" }}
        >
          Hỗ trợ
        </Button>
      </motion.div>
    ),
  },
];

const ManagementPaymentPge = () => {
  return (
    <motion.div
      className="relative flex h-[700px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border md:shadow-xl"
      style={{ backgroundColor: "#F4F2EB" }} // Set the background color
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-2xl font-bold"
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.6 }}
      >
        Lịch sử nạp tiền
      </motion.h1>

      {/* Animated Description */}
      <motion.p
        className="text-gray-500"
        variants={descriptionVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        Xem chi tiết lịch sử nạp tiền của bạn và kiểm tra lại các giao dịch bạn
        nhé
      </motion.p>
      <div className="flex justify-end mt-4 space-x-2 mb-4">
        <motion.div whileHover={{ scale: 1.05 }}>
          <Button type="default">Reset</Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Button type="primary">Nạp thêm tiền</Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Button
            type="primary"
            style={{ background: "#52c41a", borderColor: "#52c41a" }}
          >
            Thanh toán thành công
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Button
            type="primary"
            style={{ background: "#faad14", borderColor: "#faad14" }}
          >
            Đang chờ xử lý
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Button type="primary" danger>
            Thanh toán thất bại
          </Button>
        </motion.div>
      </div>
      {/* Transaction Table */}
      <Table
        columns={columns}
        dataSource={transactionData}
        pagination={false}
        bordered
      />
      <Pagination
        className="paginationAppointment"
        //   current={currentPage}
        //   pageSize={pageSize}
        //   total={totalPages * pageSize}
        //   onChange={handlePageChange}
        //   showSizeChanger={false}
      />

      {/* Transaction Status Filters */}
    </motion.div>
  );
};

export default ManagementPaymentPge;
