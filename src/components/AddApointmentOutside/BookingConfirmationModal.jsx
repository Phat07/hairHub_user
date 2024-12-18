/* eslint-disable react/prop-types */
import React from "react";
import {
  Modal,
  Row,
  Col,
  Avatar,
  Spin,
  Radio,
  Space,
  Card,
  Divider,
  Typography,
} from "antd";
import dayjs from "dayjs";
import style from "../../css/salonDetail.module.css";
import RandomIcon from "@rsuite/icons/Random";
const { Title, Text } = Typography;

const BookingConfirmationModal = ({
  isVisible,
  onClose,
  onConfirm,
  loadingCheck,
  additionalServices,
  originalPrice,
  discountedPrice,
  totalPrice,
  appointmentData,
}) => {
  function formatMoneyVND(amount) {
    return amount.toLocaleString("vi-VN");
  }
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND", // Replace 'USD' with your desired currency code
    }).format(value);
  };
  return (
    <Modal
      wrapClassName="my-custom-modal"
      title={
        <Title
          level={3}
          style={{
            textAlign: "center",
            backgroundColor: "#ece8de",
          }}
        >
          Xác nhận cuộc hẹn
        </Title>
      }
      visible={isVisible}
      onOk={onConfirm}
      onCancel={onClose}
      okText="Xác nhận"
      cancelText="Hủy"
      okButtonProps={{
        style: { backgroundColor: "#bf9456", borderColor: "#bf9456" },
        loading: loadingCheck,
        disabled: loadingCheck,
      }}
      cancelButtonProps={{
        style: { color: "#878787" },
        disabled: loadingCheck,
      }}
      width={800}
      style={{ backgroundColor: "#f4f2eb" }}
    >
      <Spin className="custom-spin" spinning={loadingCheck}>
        <Row gutter={16} justify="space-between" style={{ marginTop: "20px" }}>
          <Col span={8}>
            <Text strong style={{ fontSize: "1rem" }}>
              Tên khách hàng
            </Text>
          </Col>
          <Col span={16} style={{ textAlign: "right" }}>
            <Text style={{ fontSize: "1rem" }}>
              {appointmentData?.fullName}
            </Text>
          </Col>
        </Row>
        <Row gutter={16} justify="space-between" style={{ marginTop: "10px" }}>
          <Col span={8}>
            <Text strong style={{ fontSize: "1rem" }}>
              Email
            </Text>
          </Col>
          <Col span={16} style={{ textAlign: "right" }}>
            <Text style={{ fontSize: "1rem" }}>{appointmentData?.email}</Text>
          </Col>
        </Row>
        <Row gutter={16} justify="space-between" style={{ marginTop: "10px" }}>
          <Col span={8}>
            <Text strong style={{ fontSize: "1rem" }}>
              Số điện thoại
            </Text>
          </Col>
          <Col span={16} style={{ textAlign: "right" }}>
            <Text style={{ fontSize: "1rem" }}>
              {appointmentData?.phone ?? "khách hàng chưa cập nhật"}
            </Text>
          </Col>
        </Row>
        <Divider />
        {/* Services Section */}
        {additionalServices?.map((service) => {
          const startTime =
            service?.bookingDetailResponses?.serviceHair?.startTime;
          const endTime = service?.bookingDetailResponses?.serviceHair?.endTime;
          const formattedStartTime = dayjs(startTime).format("HH:mm");
          const formattedEndTime = dayjs(endTime).format("HH:mm");
          const totalTime = dayjs
            .duration(dayjs(endTime).diff(dayjs(startTime)))
            .asMinutes();
          const employee = service?.bookingDetailResponses?.employees.find(
            (emp) => emp.id === service?.bookingDetail?.salonEmployeeId
          );

          return (
            <div key={service.id} className={style["serviceBoking"]}>
              <div className={style["serviceBookngContainer"]}>
                <span
                  className={style["serviceBookngItem"]}
                  style={{ fontWeight: "bold" }}
                >
                  Tên dịch vụ: {service.serviceName}
                </span>
                <span className={style["serviceBookngItem"]}>
                  Số tiền: {formatMoneyVND(service.price)} vnđ
                </span>
              </div>
              <div className={style["serviceBookngContainer"]}>
                <span className={style["serviceBookngItem"]}>
                  Thời gian dịch vụ: {formattedStartTime} - {formattedEndTime}
                </span>
              </div>
              <div className={style["serviceBookngContainer"]}>
                <span className={style["serviceBookngItem"]}>
                  Tổng thời gian: {totalTime} phút
                </span>
              </div>
              <div className={style["serviceBookngContainer"]}>
                <span className={style["serviceBookngItem"]}>
                  {employee ? (
                    <>
                      <Avatar
                        src={employee.img}
                        size="default"
                        style={{ marginRight: 10 }}
                        shape="square"
                      />
                      <Text>Nhân viên: {employee.fullName}</Text>
                    </>
                  ) : (
                    <>
                      <Avatar
                        icon={<RandomIcon />}
                        size="default"
                        style={{ marginRight: 10 }}
                        shape="square"
                      />
                      <span>Nhân viên: Ngẫu nhiên</span>
                    </>
                  )}
                </span>
              </div>
            </div>
          );
        })}

        {/* Price Section */}
        <Divider />
        <Row gutter={16} justify="space-between" style={{ marginTop: "20px" }}>
          <Col span={8}>
            <Text strong style={{ fontSize: "1rem" }}>
              Giá gốc:
            </Text>
          </Col>
          <Col span={16} style={{ textAlign: "right" }}>
            <Text style={{ fontSize: "1rem" }}>
              {formatCurrency(originalPrice)}
            </Text>
          </Col>
        </Row>
        <Row gutter={16} justify="space-between" style={{ marginTop: "10px" }}>
          <Col span={8}>
            <Text strong style={{ fontSize: "1rem" }}>
              Giá đã giảm:
            </Text>
          </Col>
          <Col span={16} style={{ textAlign: "right" }}>
            <Text style={{ fontSize: "1rem" }}>
              {formatCurrency(discountedPrice)}
            </Text>
          </Col>
        </Row>
        <Row gutter={16} justify="space-between" style={{ marginTop: "10px" }}>
          <Col span={8}>
            <Text strong style={{ fontSize: "1rem" }}>
              Giá tiền thu cho khách:
            </Text>
          </Col>
          <Col span={16} style={{ textAlign: "right" }}>
            <Text strong style={{ fontSize: "1rem" }}>
              {formatCurrency(totalPrice)}
            </Text>
          </Col>
        </Row>
      </Spin>
    </Modal>
  );
};

export default BookingConfirmationModal;
