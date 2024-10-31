import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../css/customerAppointment.module.css";
import "../css/customerAppointmentTable.css";
import { Pagination, Table, Tag, Button, Spin } from "antd";
import {
  DownOutlined,
  LoadingOutlined,
  ReloadOutlined,
  UploadOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { GetPaymentHistory } from "@/store/salonPayment/action";
import dayjs from "dayjs";

const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};
function ManagementPaymentPage(props) {
  const dispatch = useDispatch();
  const [currentPagePayment, setCurrentPagePayment] = useState(1);
  const [itemsPerPagePayment, setItemsPerPagePayment] = useState(10);
  const [loading, setLoading] = useState(false);
  const [searchEmail, setSearchEmail] = useState("");
  const [paymentType, setPaymentType] = useState(null);
  const [statusPayment, setstatusPayment] = useState("PAID");
  const [paymentDate, setPaymentDate] = useState(null);
  const paymentHistory = useSelector(
    (state) => state.PAYMENTREDUCER.paymentHistory
  );
  const uid = useSelector((state) => state.ACCOUNT.uid);
  const idOwner = useSelector((state) => state.ACCOUNT.idOwner);
  const fetchData = async () => {
    setLoading(true); // Bật loading
    if (uid) {
      await dispatch(
        GetPaymentHistory(
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

    setLoading(false); // Tắt loading sau khi gọi API xong
  };
  useEffect(() => {
    fetchData();
  }, [
    dispatch,
    currentPagePayment,
    itemsPerPagePayment,
    searchEmail,
    paymentType,
    statusPayment,
    paymentDate,
    uid,
  ]);

  const statusDisplayNames = {
    PAID: "Đã trả",
    PENDING: "Đang xử lý",
    CANCEL: "Đã hủy",
    ...(idOwner && { PROMOTION: "Promotion" }),
  };

  const handleStatusChange = (newStatus) => {
    setstatusPayment(newStatus);
    setCurrentPagePayment(1);
  };

  const handlePageChange = (page) => {
    setCurrentPagePayment(page);
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
    // {
    //   title: "Hành động",
    //   key: "action",
    //   render: () => (
    //     <div>
    //       <Button
    //         className="text-black border-none hover:!bg-[#A37F4A] hover:!text-white"
    //         style={{ backgroundColor: "#BF9456" }}
    //       >
    //         Hỗ trợ
    //       </Button>
    //     </div>
    //   ),
    // },
  ];

  return (
    <div className={styles.appointmentContainer}>
      <h1 className="text-2xl font-bold mb-3" style={{ textAlign: "center" }}>
        Lịch sử giao dịch qua ví
      </h1>

      <Spin
        className="custom-spin"
        spinning={loading}
        // tip="Loading..."
      >
        <div className="flex flex-wrap justify-end space-x-2 mb-3">
          <Button
            onClick={() => fetchData()}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "gray",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              textAlign: "center",
              fontSize: "1rem",
              fontWeight: "bold",
            }}
            icon={<ReloadOutlined />}
          />
          <Button
            onClick={() => {
              navigate("/payment");
            }}
            style={{
              // flex: "1",
              // padding: "0.5rem 1rem",
              backgroundColor: "#389e0d",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              textAlign: "center",
              // fontSize: "1rem",
              fontWeight: "bold",
            }}
            icon={<WalletOutlined />}
          >
            Nạp thêm tiền
          </Button>
        </div>

        <div className={styles.statusfilter}>
          {Object.keys(statusDisplayNames).map((statusKey, index) => (
            <button
              key={statusKey}
              onClick={() => handleStatusChange(statusKey)}
              style={{
                flex: "1",
                marginRight:
                  index !== Object.keys(statusDisplayNames).length - 1
                    ? "0.5rem"
                    : "0",
                padding: "0.5rem 1rem",
                backgroundColor:
                  statusPayment === statusKey
                    ? statusPayment === "PENDING"
                      ? "#1677ff"
                      : statusPayment === "CANCEL"
                      ? "#ff0000"
                      : statusPayment === "PAID"
                      ? "#389e0d"
                      : statusPayment === "PROMOTION"
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

        <Table
          className={styles.appointmentTable}
          columns={columns}
          dataSource={paymentHistory?.items}
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

          {paymentHistory?.items?.length === 0 && statusPayment && (
            <h4
              style={{
                fontWeight: "bold",
                color: "#bf9456",
                textAlign: "center",
                fontSize: "1.2rem",
              }}
            >
              Không tìm thấy giao dịch{" "}
              {statusDisplayNames[statusPayment] || statusPayment} nào!!!
            </h4>
          )}

          <div className={styles.grid}>
            {paymentHistory?.items?.map((appointment) => (
              <div key={appointment.id} className={styles.card}>
                <h4
                  style={{
                    fontWeight: "bold",
                    color: "#bf9456",
                    textAlign: "center",
                  }}
                >
                  {appointment.email}
                </h4>

                <h4>
                  Phương thức:{" "}
                  {(() => {
                    let vietnameseStatus = "";
                    let color = "green";
                    switch (appointment?.paymentType) {
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
                  })()}
                </h4>

                <h4>
                  Trạng thái:{" "}
                  {(() => {
                    let vietnameseStatus = "";
                    let color = "green";
                    switch (appointment?.status) {
                      case "CANCEL":
                        vietnameseStatus = "Thất bại";
                        color = "red";
                        break;
                      case "PAID":
                        vietnameseStatus = "Đã thanh toán";
                        break;
                      case "PENDING":
                        vietnameseStatus = "Đang xử lý";
                        color = "orange";
                        break;
                      default:
                        vietnameseStatus = "Không xác định";
                    }
                    return <Tag color={color}>{vietnameseStatus}</Tag>;
                  })()}
                </h4>

                <h4>Mô tả: {appointment?.description || "Không có mô tả"}</h4>

                <h4>Số tiền: {formatCurrency(appointment.totalAmount)} VNĐ</h4>

                <h4>
                  Ngày thanh toán:{" "}
                  {appointment.paymentDate
                    ? dayjs(appointment.paymentDate).format(
                        "DD/MM/YYYY HH:mm:ss"
                      )
                    : "Chưa thanh toán"}
                </h4>

                {/* <div>
                  <Button
                    className="text-black border-none hover:!bg-[#A37F4A] hover:!text-white"
                    style={{ backgroundColor: "#BF9456" }}
                  >
                    Hỗ trợ
                  </Button>
                </div> */}
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
          current={currentPagePayment}
          pageSize={itemsPerPagePayment}
          total={paymentHistory?.total}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </Spin>
    </div>
  );
}

export default ManagementPaymentPage;
