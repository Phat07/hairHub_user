import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { actGetAllReportCustomerId } from "../store/report/action";
import { Button, Space, Table, Modal, Descriptions, Carousel } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import moment from "moment";

function CustomerReport(props) {
  const dispatch = useDispatch();
  const [status, setStatus] = useState("PENDING");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const auth = useAuthUser();

  const customerReport = useSelector(
    (state) => state.REPORTREDUCER.getReportCustomer
  );

  useEffect(() => {
    dispatch(
      actGetAllReportCustomerId(currentPage, pageSize, auth.idCustomer, status)
    );
  }, [dispatch, status, currentPage, pageSize]);

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setCurrentPage(1);
  };

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const handleViewDetails = (report) => {
    setSelectedReport(report);
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

  const reportsArray = Array.isArray(customerReport?.items)
    ? customerReport.items
    : [];

  return (
    <div style={{ padding: "20px", marginTop: "25rem" }}>
      <Space style={{ marginBottom: "20px" }}>
        <Button
          type={status === "PENDING" ? "primary" : "default"}
          onClick={() => handleStatusChange("PENDING")}
        >
          Đang chờ
        </Button>
        <Button
          type={status === "APPROVED" ? "primary" : "default"}
          onClick={() => handleStatusChange("APPROVED")}
        >
          Đã duyệt
        </Button>
        <Button
          type={status === "REJECTED" ? "primary" : "default"}
          onClick={() => handleStatusChange("REJECTED")}
        >
          Đã từ chối
        </Button>
      </Space>
      <Table
        dataSource={reportsArray}
        columns={columns}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: customerReport?.total || 0,
          position: ["bottomCenter"],
        }}
        onChange={handleTableChange}
      />
      {selectedReport && (
        <Modal
          title={
            <div style={{ textAlign: "center", fontSize: "2.5rem" }}>
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
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Tên Salon">
              {selectedReport.salonInformation.name}
            </Descriptions.Item>
            <Descriptions.Item label="Tên Khách Hàng">
              {selectedReport.customer.fullName}
            </Descriptions.Item>
            <Descriptions.Item label="Tên Chủ Salon">
              {selectedReport.salonInformation.salonOwner.fullName}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng Thái">
              {getStatusText(selectedReport.status)}
            </Descriptions.Item>
            <Descriptions.Item label="Lý do báo cáo">
              {selectedReport.reasonReport}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo báo cáo">
              {moment(selectedReport.createDate).format("DD/MM/YYYY - hh:mm A")}
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
                selectedReport.appointment?.appointmentDetails[0]?.salonEmployee
                  ?.fullName
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
                    <img
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
        </Modal>
      )}
    </div>
  );
}

export default CustomerReport;
