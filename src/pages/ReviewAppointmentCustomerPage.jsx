import React, { useEffect, useState } from "react";
import styles from "../css/customerAppointment.module.css";
import "../css/customerAppointmentTable.css";
import {
  DownOutlined,
  LoadingOutlined,
  ReloadOutlined,
  UploadOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import {
  DatePicker,
  Row,
  Col,
  Button,
  message,
  Table,
  Pagination,
  Menu,
  Spin,
  Dropdown,
} from "antd";
import dayjs from "dayjs";
import classNames from "classnames";

import { useDispatch, useSelector } from "react-redux";
const { RangePicker } = DatePicker;
function ReviewAppointmentCustomerPage(props) {
  const [sortLabelPayment, setSortLabelPayment] = useState("Ngày hôm nay");
  const [type, setType] = useState("TODAY");
  const [loading, setLoading] = useState(false);
  const paymentHistory = [];
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const handleMenuClickPaymentSort = (e) => {
    const labelMap = {
      TODAY: "Ngày hôm nay",
      "7DAY": "7 ngày",
      "1MONTH": "1 tháng",
      "1YEAR": "1 năm",
      ALL: "Toàn thời gian",
    };

    setSortLabelPayment(labelMap[e.key] || "Ngày hôm nay");
    setType(e.key === "" ? null : e.key);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  console.log("ss", type);

  const sortMenu = (
    <Menu onClick={handleMenuClickPaymentSort}>
      <Menu.Item key="TODAY">Ngày hôm nay</Menu.Item>
      <Menu.Item key="7DAY">7 Ngày</Menu.Item>
      <Menu.Item key="1MONTH">1 Tháng</Menu.Item>
      <Menu.Item key="1YEAR">1 Năm</Menu.Item>
      <Menu.Item key="ALL">Toàn thời gian</Menu.Item>
    </Menu>
  );
  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Số cuộc hẹn",
      dataIndex: "numberAppointment",
      key: "numberAppointment",
      // render: (status) => {
      //   let vietnameseStatus = "";
      //   let color = "green";

      //   switch (status) {
      //     case "PAID":
      //       vietnameseStatus = "Đã thanh toán";
      //       break;
      //     case "PENDING":
      //       vietnameseStatus = "Đang xử lý";
      //       color = "orange";
      //       break;
      //     case "CANCEL":
      //       vietnameseStatus = "Thất bại";
      //       color = "red";
      //       break;
      //     case "PROMOTION":
      //       vietnameseStatus = "Promotion";
      //       break;
      //     default:
      //       vietnameseStatus = "Không xác định";
      //   }

      //   return <Tag color={color}>{vietnameseStatus}</Tag>;
      // },
    },
    {
      title: "Số tiền khách hàng đã bỏ ra",
      dataIndex: "money",
      key: "money",
      // render: (paymentType) => {
      //   let vietnameseStatus = "";
      //   let color = "green";
      //   switch (paymentType) {
      //     case "DEPOSIT":
      //       vietnameseStatus = "Nạp";
      //       break;
      //     case "WITHDRAW":
      //       vietnameseStatus = "Rút";
      //       color = "orange";
      //       break;
      //     default:
      //       vietnameseStatus = "Không xác định";
      //       color = "red";
      //   }
      //   return <Tag color={color}>{vietnameseStatus}</Tag>;
      // },
    },
    // {
    //   title: "Mô tả",
    //   dataIndex: "description",
    //   key: "description",
    // },
    // {
    //   title: "Số tiền (VNĐ)",
    //   dataIndex: "totalAmount",
    //   key: "totalAmount",
    //   render: (amount) => formatCurrency(amount),
    // },
    // {
    //   title: "Ngày thanh toán",
    //   dataIndex: "paymentDate",
    //   key: "paymentDate",
    //   render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm:ss"),
    // },
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
        Danh sách khách hàng thường xuyên đến cửa hàng
      </h1>

      <Spin
        className="custom-spin"
        spinning={loading}
        // tip="Loading..."
      >
        <div className="flex flex-wrap justify-end space-x-2 mb-3">
          <Button
            // onClick={() => fetchData()}
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
        </div>
        <div
          className={`datePickerCustome ${styles.datePickerCustomeMobile}`}
          style={{ marginBottom: "10px" }}
        >
          <div
            className={classNames("my-custom-add", styles["table-fillter"])}
            style={{ marginBlock: "0px" }}
          >
            <Dropdown overlay={sortMenu} trigger={["click"]}>
              <Button className={styles["table-fillter-item"]}>
                {sortLabelPayment} <DownOutlined />
              </Button>
            </Dropdown>
          </div>
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
                  {appointment?.email}
                </h4>

                <h4>
                  {/* Phương thức:{" "}
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
                  })()} */}
                </h4>

                <h4>
                  {/* Trạng thái:{" "}
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
                  })()} */}
                </h4>

                <h4>Mô tả: {appointment?.description || "Không có mô tả"}</h4>

                <h4>Số tiền: {formatCurrency(appointment.totalAmount)} VNĐ</h4>

                <h4>
                  Ngày thanh toán:{" "}
                  {/* {appointment?.paymentDate
                    ? dayjs(appointment?.paymentDate).format(
                        "DD/MM/YYYY HH:mm:ss"
                      )
                    : "Chưa thanh toán"} */}
                </h4>
              </div>
            ))}
          </div>
        </div>
        <Pagination
          className="paginationAppointment"
          current={currentPage}
          pageSize={itemsPerPage}
          total={paymentHistory?.total}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </Spin>
    </div>
  );
}

export default ReviewAppointmentCustomerPage;
