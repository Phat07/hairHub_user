import React from "react";
import { Button, Row, Col, Table } from "antd";
import { Link } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import "../css/PaymentCommissionPage.css";

const dataSource = [
  {
    key: "1",
    package: "Gia hạn Premium VPS D4 x 1 tháng",
    description:
      "Gia hạn Premium VPS 157.15.86.92 từ 2024-09-03 đến 2024-10-03",
    price: "$16.00 (400.000 đ)",
    total: "$16.00 (400.000 đ)",
  },
];

const columns = [
  {
    title: "Gói",
    dataIndex: "package",
    key: "package",
  },
  {
    title: "Mô Tả",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Giá",
    dataIndex: "price",
    key: "price",
  },
  {
    title: "Tổng Cộng",
    dataIndex: "total",
    key: "total",
  },
];

function PaymentCommissionPage() {
  return (
    <div className="payment-commission-container">
      <div className="invoice-container">
        <div className="back-button">
          <Link to="/dashboardTransaction">
            <Button
              type="link"
              icon={<ArrowLeftOutlined />}
              className="back-link-button"
              style={{ padding: "0" }}
            >
              Back
            </Button>
          </Link>
        </div>
        <Row justify="space-between">
          <Col span={12}>
            <p className="commiss-tiltle">Mã hoá đơn:</p>
            <p className="invoice-id">LEV405828</p>
            <p className="commiss-p" style={{ marginTop: "0" }}>
              2024-08-06
            </p>
          </Col>
          <Col span={12} style={{ textAlign: "right" }}>
            <p className="commiss-tiltle">Cần thanh toán:</p>
            <p className="payment-amount">$16.00</p>
            <p className="commiss-p" style={{ marginTop: "0" }}>
              400.000 đ
            </p>
          </Col>
        </Row>
        <Row justify="space-between" className="recipient-payer-info">
          <Col span={12}>
            <p className="commiss-tiltle">Bên nhận:</p>
            <p className="host-money">Hairhub Company</p>
          </Col>
          <Col span={12} style={{ textAlign: "right" }}>
            <p className="commiss-tiltle">Bên thanh toán:</p>
            <p className="host-money">Trần Xuân Tiến</p>
          </Col>
        </Row>
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          className="invoice-table"
        />
        <Row justify="center" className="action-buttons">
          <Button type="primary">TIẾP THEO</Button>
          <Button type="default" danger>
            HỦY HOÁ ĐƠN
          </Button>
        </Row>
        <Row className="invoice-summary">
          <Col span={8}>
            <p className="commiss-p">Subtotal: $16.00 (400.000 đ)</p>
            <p className="commiss-p">VAT (0%): $0.00 (0 đ)</p>
            <p className="total-amount">Total: $16.00 (400.000 đ)</p>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default PaymentCommissionPage;
