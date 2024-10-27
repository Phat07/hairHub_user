// OTPModal.js
import React, { useEffect, useState } from "react";
import { Modal, Button, message } from "antd";
import OTPInput from "react-otp-input"; // Đảm bảo bạn đã cài react-otp-input

const OTPModal = ({ visible, onCancel, otp, setOtp, onConfirm, sendOTP }) => {
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const renderInput = (props) => (
    <input
      {...props}
      onKeyPress={(e) => {
        if (!/[0-9]/.test(e.key)) {
          message.warning("Vui lòng không nhập chữ");
          e.preventDefault();
        }
      }}
    />
  );

  const getInputStyle = () => {
    const isSmallScreen = window.innerWidth <= 768;
    return {
      borderRadius: "10%",
      border: "2px solid #1119",
      width: isSmallScreen ? "2rem" : "4rem",
      height: isSmallScreen ? "2rem" : "4rem",
      margin: "0 0.5rem",
      fontSize: isSmallScreen ? "1.5rem" : "2rem",
      color: "black",
      textAlign: "center",
    };
  };

  useEffect(() => {
    if (visible) {
      setTimeLeft(60);
      setCanResend(false);
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 1) clearInterval(timer);
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [visible]);

  useEffect(() => {
    if (timeLeft <= 45) setCanResend(true);
  }, [timeLeft]);

  const handleCancel = () => {
    Modal.confirm({
      title: "Bạn muốn thoát chứ?",
      content: "Dữ liệu bạn đã điền sẽ mất hết.",
      okText: "Thoát",
      cancelText: "Quay lại",
      onOk: onCancel,
    });
  };

  return (
    <Modal
      title="Nhập mã OTP"
      visible={visible}
      onCancel={handleCancel} // Sử dụng handleCancel
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Hủy
        </Button>,
        <Button key="confirm" type="primary" success onClick={onConfirm}>
          Xác nhận
        </Button>,
      ]}
    >
      <h3>Vui lòng nhập mã OTP để xác nhận tài khoản:</h3>
      <OTPInput
        value={otp}
        onChange={setOtp}
        numInputs={6}
        renderInput={renderInput}
        separator={<span>-</span>}
        isInputNum
        inputStyle={getInputStyle()}
      />
      {/* <p>Thời gian còn lại: {timeLeft}s</p> */}
      {canResend && (
        <h3 style={{ textAlign: "center" }}>
          <a href="#" onClick={sendOTP}>
            Gửi lại mã OTP
          </a>
        </h3>
      )}
    </Modal>
  );
};

export default OTPModal;
