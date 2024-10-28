import { Table, Button, Tag, Pagination, message, Modal } from "antd";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import "../css/customerAppointmentTable.css";
import { useDispatch, useSelector } from "react-redux";
import { GetPaymentHistoryTest } from "@/store/salonPayment/action";
import dayjs from "dayjs";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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

const ManagementPaymentPge = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const paymentHistoryItems = useSelector(
    (state) => state.PAYMENTREDUCER.paymentHistoryItems
  );
  const paymentHistoryTotal = useSelector(
    (state) => state.PAYMENTREDUCER.paymentHistoryTotal
  );
  const uid = useSelector((state) => state.ACCOUNT.uid);
  const [currentPagePayment, setCurrentPagePayment] = useState(1);
  const [itemsPerPagePayment, setItemsPerPagePayment] = useState(3);
  const [loading, setLoading] = useState(false);
  const [searchEmail, setSearchEmail] = useState("");
  const [paymentType, setPaymentType] = useState(null);
  const [statusPayment, setstatusPayment] = useState("PAID");
  const [paymentDate, setPaymentDate] = useState(null);
  const [messageDisplayed, setMessageDisplayed] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    type: "",
  });

  const location = useLocation();
  console.log("io", uid);
  console.log("ss2", paymentHistoryItems);
  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Vai trò",
      dataIndex: "roleName",
      key: "roleName",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let vietnameseStatus = "";
        let color = "green";

        switch (status) {
          case "PAID":
            vietnameseStatus = "Đã thanh toán";
            break;
          case "PENDING":
            vietnameseStatus = "Đang xử lý";
            color = "orange";
            break;
          case "CANCEL":
            vietnameseStatus = "Thất bại";
            color = "red";
            break;
          case "PROMOTION":
            vietnameseStatus = "Promotion";
            break;
          default:
            vietnameseStatus = "Không xác định";
        }

        return <Tag color={color}>{vietnameseStatus}</Tag>;
      },
    },
    {
      title: "Phương thức",
      dataIndex: "paymentType",
      key: "paymentType",
      render: (paymentType) => {
        let vietnameseStatus = "";
        let color = "green";
        switch (paymentType) {
          case "DEPOSIT":
            vietnameseStatus = "Nạp";
            break;
          case "WITHDRAW":
            vietnameseStatus = "Rút";
            color = "orange";
            break;
          default:
            vietnameseStatus = "Không xác định";
            color = "red";
        }
        return <Tag color={color}>{vietnameseStatus}</Tag>;
      },
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Số tiền (VNĐ)",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) => formatCurrency(amount),
    },
    {
      title: "Ngày thanh toán",
      dataIndex: "paymentDate",
      key: "paymentDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm:ss"),
    },
    {
      title: "Hành động",
      key: "action",
      render: () => (
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            className="text-black border-none hover:!bg-[#A37F4A] hover:!text-white"
            style={{ backgroundColor: "#BF9456" }}
          >
            Hỗ trợ
          </Button>
        </motion.div>
      ),
    },
  ];

  useEffect(() => {
    if (uid) {
      dispatch(
        GetPaymentHistoryTest(
          currentPagePayment,
          itemsPerPagePayment,
          searchEmail,
          paymentType,
          statusPayment, // Will be "PAID" by default
          paymentDate,
          uid
        )
      );
    }
  }, [uid]); // Only depends on uid

  // Handle changes in pagination or status
  useEffect(() => {
    if (uid && (statusPayment !== null || currentPagePayment > 1)) {
      dispatch(
        GetPaymentHistoryTest(
          currentPagePayment,
          itemsPerPagePayment,
          searchEmail,
          paymentType,
          statusPayment,
          paymentDate,
          uid
        )
      );
    }
  }, [currentPagePayment, statusPayment]);
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get("code");

    // Check if message has already been shown in this session

    if (code === "00") {
      // Display success message and call API
      setModalContent({
        title: "Thanh toán thành công",
        message: "Nạp tiền thành công!",
        type: "success",
      });
      setIsModalVisible(true);
      setstatusPayment("PAID");
    } else {
      // Display failure message
      // message.error("Nạp tiền thất bại");
      // setstatusPayment("CANCEL");
    }
  }, [location.search, navigate]);

  const handleSearchDate = (e) => {
    e.preventDefault();
    setPaymentDate(paymentDate);
    setCurrentPagePayment(1);
  };

  const handlePayment = (type) => {
    if (type === "Tất cả") {
      setPaymentType(null);
    } else if (type === "Nạp") {
      setPaymentType("DEPOSIT");
    } else if (type === "Rút") {
      setPaymentType("WITHDRAW");
    } else {
      setPaymentType(null);
    }
    setCurrentPagePayment(1);
  };

  const handleStatus = (type) => {
    if (type === "Tất cả") {
      setstatusPayment(null);
    } else if (type === "Đã trả") {
      setstatusPayment("PAID");
    } else if (type === "Đang xử lý") {
      setstatusPayment("PENDING");
    } else if (type === "Đã hủy") {
      setstatusPayment("CANCEL");
    } else if (type === "Promotion") {
      setstatusPayment("PROMOTION");
    } else {
      setstatusPayment(null);
    }
    setCurrentPagePayment(1);
  };
  const handleCancelModal = () => {
    setIsModalVisible(false);
  };

  const handlePageChange = (page) => {
    setCurrentPagePayment(page);
  };

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
        Lịch sử giao dịch qua ví
      </motion.h1>

      {/* Animated Description */}
      <motion.p
        className="text-gray-500"
        variants={descriptionVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        Xem chi tiết lịch sử nạp tiền của bạn và kiểm tra lại các giao dịch qua
        ví bạn nhé
      </motion.p>
      <div className="space-y-4 mt-4 mb-4">
        {/* Phần trên cùng chứa nút Reset và Nạp thêm tiền */}
        <div className="flex flex-wrap justify-end space-x-2">
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button type="default" onClick={() => fetchData()}>
              Reset
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button
              type="primary"
              onClick={() => {
                navigate("/payment");
              }}
            >
              Nạp thêm tiền
            </Button>
          </motion.div>
        </div>

        {/* Phần dưới chứa các nút trạng thái thanh toán */}
        <div className="flex flex-wrap justify-end gap-2">
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button
              type="text"
              style={
                statusPayment === "PAID" && {
                  background: "#52c41a",
                  borderColor: "#52c41a",
                }
              }
              onClick={() => handleStatus("Đã trả")}
            >
              Thanh toán thành công
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }}>
            <Button
              type="text"
              style={
                statusPayment === "PENDING" && {
                  background: "#faad14",
                  borderColor: "#faad14",
                }
              }
              onClick={() => handleStatus("Đang xử lý")}
            >
              Đang chờ xử lý
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }}>
            <Button
              type="text"
              style={
                statusPayment === "CANCEL" && {
                  background: "#EE0000",
                  borderColor: "#faad14",
                }
              }
              onClick={() => handleStatus("Đã hủy")}
            >
              Thanh toán thất bại
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }}>
            <Button
              type="text"
              style={
                statusPayment === "PROMOTION" && {
                  background: "#FF66CC",
                  borderColor: "#faad14",
                }
              }
              onClick={() => handleStatus("Promotion")}
            >
              Thanh toán hoa hồng
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Transaction Table */}
      <Table
        loading={loading}
        columns={columns}
        dataSource={paymentHistoryItems}
        pagination={false}
        bordered
      />
      <Pagination
        className="paginationAppointment"
        current={currentPagePayment}
        pageSize={itemsPerPagePayment}
        total={paymentHistoryTotal}
        onChange={handlePageChange}
        showSizeChanger={false}
      />
      <Modal
        title={modalContent.title}
        visible={isModalVisible}
        onCancel={handleCancelModal}
        footer={[
          <Button key="ok" type="primary" onClick={handleCancelModal}>
            OK
          </Button>,
        ]}
      >
        <p>{modalContent.message}</p>
      </Modal>
      {/* Transaction Status Filters */}
    </motion.div>
  );
};

export default ManagementPaymentPge;
