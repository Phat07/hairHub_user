import React, { useEffect, useState } from "react";
import { Button, Row, Col, Table, Spin, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import "../css/PaymentCommissionPage.css";
import { SalonPayment } from "../services/salonPayment";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { actGetSalonInformationByOwnerIdAsync } from "../store/salonAppointments/action";
import { actGetAllConfig } from "../store/config/action";

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
  const [data, setData] = useState("");

  const idCustomer = useSelector((state) => state.ACCOUNT.idCustomer);
  const [dataSource, setDataSource] = useState("");
  const idOwner = useSelector((state) => state.ACCOUNT.idOwner);
  const [loading, setLoading] = useState(false);
  const config = useSelector((state) => state.CONFIGREDUCER.getAllPackage);
  const navigate= useNavigate()

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actGetAllConfig(1, 10));
  }, []);
  const uid = useSelector((state) => state.ACCOUNT.uid);
  function formatVND(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND";
  }
  useEffect(() => {
    // Call the initial API to get payment information
    SalonPayment.getInforPaymetOwnerId(idOwner)
      .then((response) => {
        console.log("res", response.data);
        const paymentData = {
          key: "1",
          package: response?.data?.config?.pakageName,
          description: response?.data?.description,
          price: formatVND(response?.data?.totalAmount),
          total: formatVND(response?.data?.totalAmount),
        };
        // Set the data from the API response
        setData(response.data);
        setDataSource([paymentData]);
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the payment information!",
          error
        );
      });
  }, [idOwner]);
console.log("config", config);

  const handleNextClick = () => {
    const foundPackage = config.find(config => config.pakageName === "Phí hoa hồng hairhub");
    console.log("found", foundPackage);
    
    const data = {
      configId: foundPackage?.id,
      salonOwnerID: idOwner,
      description: "Thanh toán gói dịch vụ",
    };
  
    SalonPayment.createPaymentPackageByOwnerId(data)
      .then((response) => {
        console.log("Response:", response);
        if (response.status === 200 || response.status === 201) {
          setLoading(true);
          message.info("Vui lòng đợi trong giây lát...");
          const paymentLink = response.data.checkoutUrl;
  
          if (paymentLink) {
            console.log("Redirecting to:", paymentLink);
            window.location.href = paymentLink; // Chuyển hướng đến trang thanh toán
          } else {
            message.error("Không thể thanh toán");
          }
        } else {
          message.error("Thanh toán không thành công!!!!");
        }
      })
      .catch((err) => {
        message.error("Vui lòng thử lại sau!!!!");
        console.error("Error:", err);
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
    // Call the next API when the button is clicked
  };
  
  return (
    <div className="payment-commission-container">
      <Spin spinning={loading}>
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
              <p className="invoice-id">{data?.paymentCode}</p>
              <p className="commiss-p" style={{ marginTop: "0" }}>
                {dayjs().format("DD-MM-YYYY")}
              </p>
            </Col>
            <Col span={12} style={{ textAlign: "right" }}>
              <p className="commiss-tiltle">Cần thanh toán:</p>
              <p className="payment-amount"> {dataSource[0]?.price}</p>
              {/* <p className="commiss-p" style={{ marginTop: "0" }}>
              {dataSource[0]?.price}
              </p> */}
            </Col>
          </Row>
          <Row justify="space-between" className="recipient-payer-info">
            <Col span={12}>
              <p className="commiss-tiltle">Bên nhận:</p>
              <p className="host-money">Hairhub Company</p>
            </Col>
            <Col span={12} style={{ textAlign: "right" }}>
              <p className="commiss-tiltle">Bên thanh toán:</p>
              <p className="host-money">{data?.salonOwners?.fullName}</p>
            </Col>
          </Row>
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            className="invoice-table"
          />
          <Row justify="center" className="action-buttons">
            <Button onClick={handleNextClick} type="primary">
              TIẾP THEO
            </Button>
            <Button onClick={()=>navigate(-1)} type="default" danger>
              HỦY HOÁ ĐƠN
            </Button>
          </Row>
          <Row className="invoice-summary">
            <Col span={8}>
              <p className="commiss-p">Subtotal: {dataSource[0]?.price}</p>
              <p className="commiss-p">VAT (0%): 0.00 (0 đ)</p>
              <p className="total-amount">Total: {dataSource[0]?.price}</p>
            </Col>
          </Row>
        </div>
      </Spin>
    </div>
  );
}

export default PaymentCommissionPage;
