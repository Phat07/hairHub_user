// EmployeeModal.js
import React from "react";
import {
  Modal,
  List,
  Descriptions,
  Avatar,
  Divider,
  Row,
  Col,
  Image,
  Typography,
  Button,
} from "antd";
const { Title, Text } = Typography;

const EmployeeModal = ({ isOpen, onClose, employee, booking }) => {
  if (!employee) return null;
  const daysOfWeek = {
    Monday: "Thứ hai",
    Tuesday: "Thứ ba",
    Wednesday: "Thứ tư",
    Thursday: "Thứ năm",
    Friday: "Thứ sáu",
    Saturday: "Thứ bảy",
    Sunday: "Chủ nhật",
  };
  const weekOrder = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const formatTime = (decimalHours) => {
    const hours = Math.floor(decimalHours);

    // Get the decimal part and convert to minutes
    const decimalPart = decimalHours - hours;
    let minutes = 0;

    if (decimalPart >= 0.75) {
      minutes = 45;
    } else if (decimalPart >= 0.5) {
      minutes = 30;
    } else if (decimalPart >= 0.25) {
      minutes = 15;
    }

    let timeString = "";
    if (hours > 0) {
      timeString += `${hours} giờ `;
    }
    if (minutes > 0 || hours === 0) {
      timeString += `${minutes} phút`;
    }

    return timeString.trim() || "0 phút";
  };
  const handleBooking = (service) => {
    onClose();
    booking(service);
  };
  return (
    <Modal
      title={`Thông tin nhân viên`}
      open={isOpen}
      onCancel={onClose}
      footer={null}
    >
      <Row gutter={[16, 16]} align="middle">
        {/* Ảnh và Thông tin */}
        <Col xs={24} md={12} style={{ textAlign: "center" }}>
          {/* <Image
            src={employee?.img}
            alt={employee?.fullName}
            width="100%"
            style={{
              maxWidth: "200px",
              borderRadius: "8px",
            }}
          /> */}
          <Avatar
            size={200}
            shape="square"
            src={employee?.img}
            alt={employee?.fullName}
          />
        </Col>

        <Col xs={24} md={12}>
          {/* <Descriptions bordered column={1}>
            <Descriptions.Item label="Tên">
              {employee.fullName}
            </Descriptions.Item>
            <Descriptions.Item label="Giới tính">
              {employee.gender}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày sinh">
              {employee.dateOfBirth || "trống"}
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
              {employee.phone || "trống"}
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">
              {employee.address || "trống"}
            </Descriptions.Item>
          </Descriptions> */}
          <Row style={{ width: "100%" }} align="middle">
            {/* Title */}
            <Col xs={24} md={24}>
              <div style={{ fontWeight: "bold" }}>
                Tên đầy đủ: {employee.fullName}
              </div>
            </Col>

            {/* Description */}
            <Col xs={24} md={24}>
              <div>Giới tính: {employee.gender}</div>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row gutter={[16, 16]} align="middle">
        {/* Ảnh và Thông tin */}
        <Col xs={24} md={24}>
          <Divider>Lịch làm việc</Divider>
          {/* <List
            dataSource={employee.schedules}
            renderItem={(schedule) => (
              <List.Item>
                <List.Item.Meta
                  title={`Thứ ${schedule.dayOfWeek}`}
                  description={`${schedule.startTime} - ${schedule.endTime}`}
                />
              </List.Item>
            )}
          /> */}

          {employee?.schedules
            ?.sort(
              (a, b) =>
                weekOrder.indexOf(a.dayOfWeek) - weekOrder.indexOf(b.dayOfWeek)
            ) // Sắp xếp lịch
            .map((e) => {
              return (
                <Row
                  justify="space-between"
                  key={e?.dayOfWeek}
                  style={{ width: "100%" }}
                >
                  <Text strong style={{ marginRight: 8 }}>
                    {daysOfWeek[e?.dayOfWeek]}:&nbsp;
                  </Text>
                  <Text style={{ textAlign: "right" }}>
                    {e?.startTime?.slice(0, 5) === "00:00" &&
                    e?.endTime?.slice(0, 5) === "00:00"
                      ? "Không hoạt động"
                      : `${e?.startTime?.slice(0, 5)} AM - ${e?.endTime?.slice(
                          0,
                          5
                        )} PM`}
                  </Text>
                </Row>
              );
            })}
        </Col>
        <Col xs={24} md={24}>
          <Divider>Dịch vụ cung cấp</Divider>
          <List
            itemLayout="horizontal"
            dataSource={employee?.serviceHairs}
            renderItem={(service) => (
              <List.Item
                actions={[
                  <Button
                    type="primary"
                    key="book"
                    onClick={() => handleBooking(service)}
                    style={{ backgroundColor: "#bf9456" }}
                  >
                    Đặt lịch
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={service.img} shape="square" size={50} />}
                  title={service?.serviceName}
                  description={`Giá: ${service?.price?.toLocaleString()} VND • ${formatTime(
                    service?.time
                  )}`}
                />
              </List.Item>
            )}
            pagination={{
              pageSize: 5,
              // showSizeChanger: true,
              pageSizeOptions: ["5", "10", "20"],
              className: "paginationAppointment",
            }}
          />
        </Col>
      </Row>
    </Modal>
  );
};

export default EmployeeModal;
