import React from "react";
import Header from "../components/Header";
import { Card, Typography, Button } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

function FailPayment(props) {
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
        <Card style={{ width: "50%", textAlign: "center", padding: "20px" }}>
          <CloseCircleOutlined style={{ fontSize: "64px", color: "#ff4d4f" }} />
          <Title level={2} style={{ color: "#ff4d4f", marginTop: "16px" }}>
            GIAO DỊCH THẤT BẠI
          </Title>
          <Text style={{ display: "block", marginTop: "16px" }}>
            Xin vui lòng kiểm tra lại thông tin và thử lại.
          </Text>
          <Button type="primary" style={{ marginTop: "24px" }}>
            Quay về dashboard
          </Button>
        </Card>
      </div>
    </div>
  );
}

export default FailPayment;
