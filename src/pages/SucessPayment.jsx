import React from "react";
import Header from "../components/Header";
import { Card, Typography, Button } from "antd";
import {
  CheckCircleFilled,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { useDispatch, useSelector } from "react-redux";
import { actGetStatusPayment } from "../store/salonPayment/action";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

function SucessPayment(props) {
  // Lấy URL hiện tại
  const url = new URL(window.location.href);
  // const auth = useAuthUser();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ownerId = useSelector((state) => state.ACCOUNT.idOwner);

  // Lấy giá trị của tham số orderCode
  const code = url.searchParams.get("code");
  const amount = url.searchParams.get("amount");
  const id = url.searchParams.get("id");

  // Hiển thị orderCode

  function formatVND(number) {
    // Chuyển đổi số thành chuỗi
    let numberString = number?.toString();
    // Sử dụng regex để thêm dấu chấm mỗi 3 chữ số từ phải sang trái
    let formattedString = numberString?.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return formattedString + " VND";
  }

  return (
    <div>
      <Header />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f0f2f5",
        }}
      >
        <Card
          style={{
            width: "30%",
            textAlign: "center",
            padding: "20px",
            // border: "none",
            borderRadius: "20px",
          }}
        >
          {code == "00" ? (
            <>
              <CheckCircleFilled
                style={{
                  fontSize: "40px",
                  color: "#23A26D",
                  backgroundColor: "rgba(179, 230, 194, 0.5)",
                  padding: "2rem",
                  borderRadius: "50px",
                }}
              />
              <Title level={3} style={{ marginTop: "16px" }}>
                THANH TOÁN THÀNH CÔNG!
              </Title>
            </>
          ) : (
            <>
              <CloseCircleOutlined
                style={{ fontSize: "64px", color: "#ff4d4f" }}
              />
              <Title level={2} style={{ color: "#ff4d4f", marginTop: "16px" }}>
                GIAO DỊCH THẤT BẠI
              </Title>
            </>
          )}

          {/* <CheckCircleOutlined style={{ fontSize: "64px", color: "#52c41a" }} /> */}

          <Text style={{ fontSize: "30px" }} strong>
            {amount ? formatVND(amount) : "1.000.000 VND"}
          </Text>
          <div style={{ marginTop: "16px" }}>
            <Text>
              Mã đơn:{" "}
              <Text strong style={{ display: "inline" }}>
                #{id}
              </Text>{" "}
            </Text>
          </div>
          <Text style={{ display: "block", marginTop: "8px" }}>
            Kiểu thanh toán: Online
          </Text>
          {/* <Button
            type="primary"
            style={{ marginTop: "24px" }}
            onClick={handleClick}
          >
            Vui lòng nhấn vào đây để xác nhận thành công
          </Button> */}
        </Card>
      </div>
    </div>
  );
}

export default SucessPayment;
