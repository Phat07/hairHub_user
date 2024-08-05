import { Button, message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";

function ResendCode({ isOtpModalOpen, form }) {
  const [timer, setTimer] = useState(120);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  useEffect(() => {
    let interval = null;
    if (isOtpModalOpen && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isOtpModalOpen, timer]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const handleResendCode = () => {
    const email = form.getFieldValue("email");
    let fullName = "demo";
    axios
      .post("https://api.gahonghac.net/api/v1/otps/SendOTPToEmail", {
        email,
        fullName,
      })
      .then((res) => {
        setLoading(true);
        message.success("Otp đã được gửi lại");
        setOtp("");
        setTimer(120);
      })
      .catch((err) => {
        message.error("Gửi otp thất bại");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Button type="link" onClick={handleResendCode} disabled={timer > 0}>
      Gửi lại OTP {timer > 0 && `(${formatTime(timer)})`}
    </Button>
  );
}

export default ResendCode;
