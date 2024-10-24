import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import {
  actGetAllReportCustomerId,
  actGetAllReportSalonId,
} from "../store/report/action";
import {
  Button,
  Modal,
  Space,
  Table,
  Carousel,
  Descriptions,
  Spin,
  Pagination,
  Image,
} from "antd";
import { actGetSalonInformationByOwnerIdAsync } from "../store/salonAppointments/action";
import {
  LeftOutlined,
  LoadingOutlined,
  RightOutlined,
} from "@ant-design/icons";
import styles from "../css/salonAppointment.module.css";
import stylesCard from "../css/customerAppointment.module.css";
import moment from "moment";
import classNames from "classnames";

function SalonReport(props) {
  const dispatch = useDispatch();
  const [status, setStatus] = useState("PENDING");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(false);

  // const auth = useAuthUser();
  const idCustomer = useSelector((state) => state.ACCOUNT.idCustomer);
  const idOwner = useSelector((state) => state.ACCOUNT.idOwner);
  const salonInformationByOwnerId = useSelector(
    (state) => state.SALONAPPOINTMENTS.salonInformationByOwnerId
  );

  useEffect(() => {
    dispatch(actGetSalonInformationByOwnerIdAsync(idOwner));
  }, [dispatch, idOwner]);

  const salonReport = useSelector(
    (state) => state.REPORTREDUCER.getReportSalon
  );

  useEffect(() => {
    if (salonInformationByOwnerId?.id) {
      setLoading(true);
      dispatch(
        actGetAllReportSalonId(
          currentPage,
          pageSize,
          salonInformationByOwnerId.id,
          status
        )
      )
        .then((res) => {
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        })
        .finally((err) => {
          setLoading(false);
        });
    }
  }, [dispatch, status, salonInformationByOwnerId, currentPage, pageSize]);

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setCurrentPage(1);
  };

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const handleViewDetails = (record) => {
    setSelectedReport(record);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedReport(null);
  };

  const getStatusText = (status) => {
    switch (status) {
      case "PENDING":
        return "Đang chờ";
      case "APPROVED":
        return "Đã duyệt";
      case "REJECTED":
        return "Đã từ chối";
      default:
        return status;
    }
  };

  const columns = [
    {
      title: "Tên Salon",
      dataIndex: ["salonInformation", "name"],
      key: "salonName",
      align: "center",
    },
    {
      title: "Tên Khách Hàng",
      dataIndex: ["customer", "fullName"],
      key: "customerName",
      align: "center",
    },
    {
      title: "Tên Chủ Salon",
      dataIndex: ["salonInformation", "salonOwner", "fullName"],
      key: "salonOwnerName",
      align: "center",
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (text) => getStatusText(text),
    },
    {
      title: "Thao Tác",
      key: "action",
      render: (text, record) => (
        <Button type="link" onClick={() => handleViewDetails(record)}>
          Xem chi tiết
        </Button>
      ),
      align: "center",
    },
  ];

  const reportsArray = Array.isArray(salonReport?.items)
    ? salonReport.items
    : [];

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className={styles.appointmentContainer}>
      <Spin
        className="custom-spin"
        spinning={loading}
        // tip="Loading..."
      >
        <Space className="custom-status" style={{ marginBottom: "20px" }}>
          <Button
            // type={status === "PENDING" ? "primary" : "default"}
            className={classNames({
              "btn-primary": status === "PENDING", // Khi status là "PENDING", áp dụng lớp 'btn-primary'
              "btn-default": status !== "PENDING", // Khi status không phải là "PENDING", áp dụng lớp 'btn-default'
            })}
            onClick={() => handleStatusChange("PENDING")}
          >
            Đang chờ
          </Button>
          <Button
            // type={status === "APPROVED" ? "primary" : "default"}
            className={classNames({
              "btn-primary": status === "APPROVED", // Khi status là "PENDING", áp dụng lớp 'btn-primary'
              "btn-default": status !== "APPROVED", // Khi status không phải là "PENDING", áp dụng lớp 'btn-default'
            })}
            onClick={() => handleStatusChange("APPROVED")}
          >
            Đã duyệt
          </Button>
          <Button
            // type={status === "REJECTED" ? "primary" : "default"}
            className={classNames({
              "btn-primary": status === "REJECTED", // Khi status là "PENDING", áp dụng lớp 'btn-primary'
              "btn-default": status !== "REJECTED", // Khi status không phải là "PENDING", áp dụng lớp 'btn-default'
            })}
            onClick={() => handleStatusChange("REJECTED")}
          >
            Đã từ chối
          </Button>
        </Space>
        {/* <Table
        loading={loading}
        dataSource={reportsArray}
        columns={columns}
        rowKey="id"
        pagination={{
          className: "paginationAppointment",
          current: currentPage,
          pageSize: pageSize,
          total: salonReport?.total || 0,
          position: ["bottomCenter"],
        }}
        onChange={handleTableChange}
      /> */}

        <div className={stylesCard.container}>
          {/* {loading && (
            <div className={stylesCard.overlay}>
              <LoadingOutlined style={{ fontSize: "2rem" }} />
            </div>
          )} */}

          {reportsArray?.length === 0 && (
            <h4
              style={{
                fontWeight: "bold",
                color: "#bf9456",
                textAlign: "center",
                fontSize: "1.2rem",
              }}
            >
              Không tìm thấy báo cáo {status} nào !!!
            </h4>
          )}

          <div className={stylesCard.grid}>
            {reportsArray.map((report) => (
              <div key={report.id} className={stylesCard.card}>
                <h4>
                  Tên Salon:{" "}
                  <span
                    style={{
                      fontWeight: "bold",
                      color: "#bf9456",
                      textAlign: "center",
                    }}
                  >
                    {report.salonInformation.name}
                  </span>
                </h4>
                <h4>
                  Tên Khách Hàng:{" "}
                  <span
                    style={{
                      fontWeight: "bold",
                      color: "#bf9456",
                      textAlign: "center",
                    }}
                  >
                    {report.customer.fullName}
                  </span>
                </h4>
                <h4>
                  Tên Chủ Salon:{" "}
                  <span
                    style={{
                      fontWeight: "bold",
                      color: "#bf9456",
                      textAlign: "center",
                    }}
                  >
                    {report.salonInformation.salonOwner.fullName}
                  </span>
                </h4>
                <h4>Trạng Thái: {getStatusText(report.status)}</h4>

                <div className="report-actions">
                  <Button
                    onClick={() => handleViewDetails(report)}
                    style={{
                      backgroundColor: "#bf9456",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Xem chi tiết
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {reportsArray.length > pageSize && (
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={salonReport?.total || 0}
            onChange={onPageChange}
            className="paginationAppointment"
            style={{ marginTop: "1rem", textAlign: "center" }}
          />
        )}
      </Spin>
      <Modal
        title={
          <div style={{ textAlign: "center", fontSize: "1.5rem" }}>
            Chi Tiết Report
          </div>
        }
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            Đóng
          </Button>,
        ]}
      >
        {selectedReport && (
          <div>
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Tên Salon">
                {selectedReport.salonInformation?.name}
              </Descriptions.Item>
              <Descriptions.Item label="Tên Khách Hàng">
                {selectedReport.customer?.fullName}
              </Descriptions.Item>
              <Descriptions.Item label="Tên Chủ Salon">
                {selectedReport.salonInformation?.salonOwner?.fullName}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng Thái">
                {getStatusText(selectedReport.status)}
              </Descriptions.Item>
              <Descriptions.Item label="Lý do báo cáo">
                {selectedReport.reasonReport}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo báo cáo">
                {moment(selectedReport.createDate).format(
                  "DD/MM/YYYY - hh:mm A"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày hẹn">
                {moment(selectedReport.appointment?.startDate).format(
                  "DD/MM/YYYY - hh:mm A"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Tên Dịch vụ hớt tóc">
                {selectedReport.appointment?.appointmentDetails[0]?.serviceName}
              </Descriptions.Item>
              <Descriptions.Item label="Tên nhân viên">
                {
                  selectedReport.appointment?.appointmentDetails[0]
                    ?.salonEmployee?.fullName
                }
              </Descriptions.Item>
            </Descriptions>
            <div style={{ marginTop: "20px" }}>
              <h3 style={{ fontSize: "1.6rem" }}>Hình ảnh báo cáo:</h3>
              {selectedReport.fileReports.length > 0 ? (
                <Carousel
                  dots={false}
                  arrows
                  prevArrow={<LeftOutlined />}
                  nextArrow={<RightOutlined />}
                  slidesToShow={3}
                  slidesToScroll={1}
                  style={{ margin: "0 auto" }}
                >
                  {selectedReport.fileReports.map((file) => (
                    <div key={file.id} style={{ padding: "0 10px" }}>
                      <Image
                        src={file.img}
                        alt="Report Image"
                        style={{
                          width: "100%",
                          maxHeight: "15rem",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                    </div>
                  ))}
                </Carousel>
              ) : (
                <p style={{ textAlign: "center" }}>Không có hình ảnh</p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default SalonReport;
