import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../css/customerAppointment.module.css";
import "../css/customerAppointmentTable.css";
import {
  Pagination,
  Table,
  Tag,
  Button,
  Modal,
  Typography,
  Image,
  Rate,
  Input,
  Upload,
  message,
  Divider,
  Select,
  DatePicker,
  Avatar,
  Spin,
} from "antd";
import moment from "moment";
import {
  DownOutlined,
  LoadingOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  GetPaymentReport,
  GetPaymentReportById,
} from "@/store/salonPayment/action";

const { Text } = Typography;
const { Option } = Select;
const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};
function WithdrawRequest(props) {
  const dispatch = useDispatch();
  const customerAppointments = useSelector(
    (state) => state.CUSTOMERAPPOINTMENTS.appointment
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState("PENDING");
  const [date, setDate] = useState(null);
  const [email, setEmail] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [modal, setModal] = useState(false);
  const paymentReport = useSelector(
    (state) => state.PAYMENTREDUCER.paymentReport
  );
  const paymentReportById = useSelector(
    (state) => state.PAYMENTREDUCER.paymentReportById
  );
  const uid = useSelector((state) => state.ACCOUNT.uid);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await dispatch(
          GetPaymentReport(uid, currentPage, itemsPerPage, date, activeTab)
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, itemsPerPage, email, date, activeTab, dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingModal(true);
      try {
        await dispatch(GetPaymentReportById(id));
      } finally {
        setLoadingModal(false);
      }
    };

    fetchData();
  }, [id, dispatch]);

  const statusDisplayNames = {
    PENDING: "Chờ xét duyệt",
    PAID: "Đã duyệt",
    CANCEL: "Từ chối",
  };

  const handleStatusChange = (newStatus) => {
    setActiveTab(newStatus);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString) => {
    if (!dateString) return ""; // Kiểm tra xem dateString có hợp lệ không

    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0"); // Lấy ngày và thêm số 0 nếu cần
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Lấy tháng (0-11 nên cần cộng thêm 1) và thêm số 0 nếu cần
    const year = date.getFullYear(); // Lấy năm
    const hours = String(date.getHours()).padStart(2, "0"); // Lấy giờ và thêm số 0 nếu cần
    const minutes = String(date.getMinutes()).padStart(2, "0"); // Lấy phút và thêm số 0 nếu cần

    return `${day}/${month}/${year} ${hours}:${minutes}`; // Trả về định dạng mong muốn
  };

  function formatVND(amount) {
    return String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  const navigate = useNavigate();
  const renderRequestDetail = () => {
    return (
      <div className={styles.appointmentDetail}>
        <div className={styles.appointmentDetailA1}>
          {/* B1: Thông tin Salon */}
          <div
            className={styles.appointmentDetailB1}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              paddingBottom: "30px",
            }}
          >
            <Text strong style={{ fontSize: "16px", color: "#bf9456" }}>
              Thông tin người gửi
            </Text>
            <div>
              <Image
                src={paymentReportById?.accountInformation?.urlImage}
                preview={false}
                style={{ marginTop: "10px" }}
                width={300}
                height={200}
              />
              <p style={{ marginTop: "10px" }}>
                <Text strong>Tên đầy đủ: </Text>
                <Text>{paymentReportById?.accountInformation?.fullName}</Text>
              </p>
              <p>
                <Text strong>Email: </Text>
                <Text>{paymentReportById?.accountInformation?.email}</Text>
              </p>
            </div>
          </div>
        </div>

        <div
          className={styles.appointmentDetailA2}
          // style={{ marginLeft: "1rem" }}
        >
          {/* C1: Chi tiết dịch vụ */}
          <div
            className={styles.appointmentDetailB1}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              paddingBottom: "30px",
            }}
          >
            <Text strong style={{ fontSize: "16px", color: "#bf9456" }}>
              Thông tin đơn
            </Text>
            <div>
              {paymentReportById?.urlPaymentImage?.length > 0 ? (
                paymentReportById.urlPaymentImage.map((url, index) => (
                  <Image
                    key={index} // Thêm key cho từng phần tử trong mảng để tránh lỗi React
                    src={url}
                    style={{
                      paddingRight: "10px",
                      marginTop: "10px",
                      objectFit: "cover",
                    }}
                    width={200}
                    height={200}
                    alt={`Hình ảnh thanh toán ${index + 1}`} // Thêm thuộc tính alt cho SEO và khả năng truy cập
                  />
                ))
              ) : (
                <h4 style={{ textAlign: "center", color: "#bf9456" }}>
                  Không có hình ảnh thanh toán nào
                </h4>
              )}

              <p style={{ marginTop: "10px" }}>
                <Text strong>Trạng thái: </Text>
                {(() => {
                  let displayStatus = "";
                  let color = "green";

                  switch (paymentReportById?.status) {
                    case "CANCEL":
                      displayStatus = "Từ chối";
                      color = "red";
                      break;
                    case "PAID":
                      displayStatus = "Đã duyệt";
                      break;
                    case "PENDING":
                      displayStatus = "Chờ xét duyệt";
                      break;
                    default:
                      displayStatus = "Không xác định"; // Giữ nguyên trạng thái nếu không thuộc các trường hợp trên
                  }

                  return (
                    <Tag color={color} style={{ fontSize: "15px" }}>
                      {displayStatus}
                    </Tag>
                  );
                })()}
              </p>

              <p>
                <Text strong>Tên người thụ hưởng: </Text>
                <Text>{paymentReportById?.beneficiary}</Text>
              </p>
              <p>
                <Text strong>Số tài khoản thụ hưởng: </Text>
                <Text>{paymentReportById?.numberAccount}</Text>
              </p>
              <p>
                <Text strong>Ngân hàng thụ hưởng: </Text>
                <Text>{paymentReportById?.bankName}</Text>
              </p>
              <p>
                <Text strong>Số tiền rút: </Text>
                <Text>{formatCurrency(paymentReportById.balance)}</Text>
              </p>
              <p>
                <Text strong>Email: </Text>
                <Text>{paymentReportById?.accountInformation?.email}</Text>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số dư (VNĐ)",
      dataIndex: "balance",
      key: "balance",
      render: (balance) => formatCurrency(balance), // Hàm formatCurrency để định dạng số dư
    },
    {
      title: "Ngày tạo",
      dataIndex: "createDate",
      key: "createDate",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"), // Định dạng ngày theo kiểu Việt Nam
    },
    {
      title: "Ngày xác nhận",
      dataIndex: "confirmDate",
      key: "confirmDate",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"), // Định dạng ngày theo kiểu Việt Nam
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let displayStatus = "";
        let color = "green";

        switch (status) {
          case "CANCEL":
            displayStatus = "Từ chối";
            color = "red";
            break;
          case "PAID":
            displayStatus = "Đã duyệt";
            break;
          case "PENDING":
            displayStatus = "Chờ xét duyệt";
            break;
          default:
            displayStatus = status; // Giữ nguyên trạng thái nếu không thuộc các trường hợp trên
        }

        return <Tag color={color}>{displayStatus}</Tag>;
      },
    },

    {
      title: "Hành động",
      key: "action",
      render: (text, record) => (
        <Button onClick={() => handleDetailId(record.id)}>Xem chi tiết</Button>
      ),
    },
  ];

  const handleDateChange = (date, dateString) => {
    setDate(dateString);
    setCurrentPage(1);
  };

  const handleDetailId = (id) => {
    setId(id);
    setModal(true);
  };

  const handleModalClose = () => {
    setModal(false);
  };

  return (
    <div className={styles.appointmentContainer}>
      <h1 className="text-2xl font-bold mb-3" style={{ textAlign: "center" }}>
        Đơn rút tiền
      </h1>
      <Spin
        className="custom-spin"
        spinning={loading}
        // tip="Loading..."
      >
        <div className={styles.statusfilter}>
          {Object.keys(statusDisplayNames).map((statusKey, index) => (
            <button
              key={statusKey}
              onClick={() => handleStatusChange(statusKey)}
              style={{
                flex: "1",
                marginRight:
                  index !== Object.keys(statusDisplayNames).length - 1
                    ? "1rem"
                    : "0",
                padding: "0.5rem 1rem",
                backgroundColor:
                  activeTab === statusKey
                    ? activeTab === "PENDING"
                      ? "#1677ff"
                      : activeTab === "CANCEL"
                      ? "#ff0000"
                      : activeTab === "PAID"
                      ? "#389e0d"
                      : "gray"
                    : "gray",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                textAlign: "center",
                fontSize: "1rem",
                fontWeight: "bold",
              }}
            >
              {statusDisplayNames[statusKey]}
            </button>
          ))}
        </div>

        <div className={styles.filterDate}>
          <Text strong>Lọc theo ngày tạo: </Text>
          <DatePicker onChange={handleDateChange} />
        </div>

        <Table
          className={styles.appointmentTable}
          columns={columns}
          dataSource={paymentReport?.items}
          // loading={loading}
          rowKey="id"
          pagination={false}
        />
        <div className={styles.container}>
          {/* {loading && (
    <div className={styles.overlay}>
      <LoadingOutlined style={{ fontSize: "2rem" }} />
    </div>
  )} */}

          {paymentReport?.items?.length === 0 && status && (
            <h4
              style={{
                fontWeight: "bold",
                color: "#bf9456",
                textAlign: "center",
                fontSize: "1.2rem",
              }}
            >
              Không tìm thấy lịch hẹn {statusDisplayNames[status] || status}{" "}
              nào!!!
            </h4>
          )}

          <div className={styles.grid}>
            {paymentReport?.items?.map((appointment) => (
              <div key={appointment.id} className={styles.card}>
                {/* <img
                  src={appointment.salonInformation.img}
                  alt="Salon"
                  className={styles.salonImage}
                /> */}
                <h4
                  style={{
                    fontWeight: "bold",
                    color: "#bf9456",
                    textAlign: "center",
                  }}
                >
                  {appointment.email}
                </h4>
                <h4>Ngày tạo: {formatDate(appointment?.createDate)}</h4>
                <h4>Ngày duyệt: {formatDate(appointment?.confirmDate)}</h4>
                <h4>
                  Trạng thái:
                  {(() => {
                    let displayStatus = "";
                    let color = "green";

                    switch (appointment?.status) {
                      case "CANCEL":
                        displayStatus = "Từ chối";
                        color = "red";
                        break;
                      case "PAID":
                        displayStatus = "Đã duyệt";
                        break;
                      case "PENDING":
                        displayStatus = "Chờ xét duyệt";
                        break;
                      default:
                        displayStatus = "Không xác định"; // Giữ nguyên trạng thái nếu không thuộc các trường hợp trên
                    }

                    return <Tag color={color}>{displayStatus}</Tag>;
                  })()}
                </h4>

                <h4>Số tiền: {formatCurrency(appointment.balance)} VNĐ</h4>
                <Button
                  style={{
                    backgroundColor: "#bf9456",
                    marginBottom: "0.5rem",
                  }}
                  onClick={() => handleDetailId(appointment?.id)}
                >
                  Xem chi tiết
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* {totalPages !== 1 && totalPages !== 0 && (
        <button onClick={handleLoadMore} className={styles.loadmorebtn}>
          {loading && <LoadingOutlined style={{ marginRight: "5px" }} />}
          Tải thêm
        </button>
      )} */}

        <Pagination
          className="paginationAppointment"
          current={currentPage}
          pageSize={itemsPerPage}
          total={paymentReport.total}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </Spin>
      <Modal
        wrapClassName="my-custom-modal"
        title={
          <div
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              textAlign: "center",
              backgroundColor: "#ece8de",
            }}
          >
            Chi tiết cuộc hẹn
          </div>
        }
        visible={modal}
        onCancel={handleModalClose}
        footer={null}
        width={1100}
      >
        {/* {renderAppointmentDetail()} */}
        <Spin
          className="custom-spin"
          spinning={loadingModal}
          // tip="Loading..."
        >
          {renderRequestDetail()}
        </Spin>
      </Modal>
    </div>
  );
}

export default WithdrawRequest;
