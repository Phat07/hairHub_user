import React, { useEffect, useState } from "react";
import { Button, Row, Col, Table, Spin, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import "../css/PaymentCommissionPage.css";
import { SalonPayment } from "../services/salonPayment";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { actGetSalonInformationByOwnerIdAsync } from "../store/salonAppointments/action";
import { actGetAllConfig, getConfigId } from "../store/config/action";
import { useBreakpoint } from "@ant-design/pro-components";

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
  const configPaymentId = useSelector(
    (state) => state.CONFIGREDUCER.configPaymentId
  );
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actGetAllConfig(1, 10));
    dispatch(getConfigId({ data: "1" }));
  }, []);
  const uid = useSelector((state) => state.ACCOUNT.uid);
  function formatVND(number) {
    return number?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND";
  }
  useEffect(() => {
    // Call the initial API to get payment information
    SalonPayment.getInforPaymetOwnerId(idOwner)
      .then((response) => {
        const paymentData = {
          key: "1",
          package: response?.data?.config?.pakageName,
          description: response?.data?.description,
          price: formatVND(response?.data?.totalAmount),
          total: formatVND(response?.data?.totalAmount),
        };
        // Set the data from the API response
        setData(response.data);
        setDataSource(paymentData);
      })
      .catch((error) => {
        // console.error(
        //   "There was an error fetching the payment information!",
        //   error
        // );
      });
  }, [idOwner]);

  const handleNextClick = () => {
    const foundPackage = config.find(
      (config) => config.pakageName === "Phí hoa hồng hairhub"
    );

    const data = {
      // configId: foundPackage?.id,
      configId: configPaymentId,
      salonOwnerID: idOwner,
      description: "Thanh toán gói dịch vụ",
    };

    SalonPayment.createPaymentPackageByOwnerId(data)
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          setLoading(true);
          message.info("Vui lòng đợi trong giây lát...");
          const paymentLink = response.data.checkoutUrl;

          if (paymentLink) {
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
    <div className="payment-commission-container px-4 py-6 md:px-8">
      <Spin className="custom-spin" spinning={loading}>
        <div className="invoice-container bg-white rounded-lg shadow-lg p-6">
          <div className="back-button mb-4">
            <Link to="/dashboardTransaction" style={{ textDecoration: "none" }}>
              <Button
                // type="link"
                icon={<ArrowLeftOutlined />}
                className="back-link-button text-blue-600 hover:text-blue-800"
                style={{ padding: "0" }}
              >
                Trở về
              </Button>
            </Link>
          </div>

          <Row justify="space-between">
            <Col span={12}>
              <p className="text-gray-700 font-semibold">Mã hoá đơn:</p>
              <p className="text-lg font-bold">{data?.paymentCode}</p>
              <p className="text-gray-500 mt-0">
                {dayjs().format("DD-MM-YYYY")}
              </p>
            </Col>
            <Col span={12} className="text-right">
              <p className="text-gray-700 font-semibold">Cần thanh toán:</p>
              <p className="text-lg font-bold text-red-600">
                {dataSource?.price}
              </p>
            </Col>
          </Row>

          <Row justify="space-between" className="recipient-payer-info mt-4">
            <Col span={12}>
              <p className="text-gray-700 font-semibold">Bên nhận:</p>
              <p className="text-gray-900">Hairhub Company</p>
            </Col>
            <Col span={12} className="text-right">
              <p className="text-gray-700 font-semibold">Bên thanh toán:</p>
              <p className="text-gray-900">{data?.salonOwners?.fullName}</p>
            </Col>
          </Row>

          {/* Display dataSource details as a card */}
          <div className="invoice-card mt-6 bg-gray-100 p-4 rounded-lg shadow-md">
            <p className="font-semibold text-gray-800">
              Gói: {dataSource?.package}
            </p>
            <p className="text-gray-600">Mô Tả: {dataSource?.description}</p>
            <p className="font-semibold text-gray-800">
              {dataSource?.price && <>Giá: {formatVND(dataSource?.price)}</>}
            </p>
            <p className="font-semibold text-gray-800">
              Tổng Cộng: {dataSource?.total}
            </p>
          </div>

          <Row justify="center" className="action-buttons">
            <Button
              onClick={handleNextClick}
              className="bg-[#BF9456] mt-5 mr-5 hover:!bg-[#BF9456] hover:!text-black text-white px-6 py-2 rounded-md border-transparent hover:!border-white border sm:mb-20 md:mb-20 lg:mb-10"
            >
              TIẾP THEO
            </Button>
            <Button
              onClick={() => navigate(-1)}
              type="default"
              danger
              className="text-red-500 border border-red-500 px-6 py-2 rounded-md mt-5"
            >
              HỦY HOÁ ĐƠN
            </Button>
          </Row>

          <Row className="invoice-summary mt-8">
            <Col span={8} className="space-y-1">
              <p className="text-gray-700">Subtotal: {dataSource?.price}</p>
              <p className="text-gray-700">VAT (0%): 0.00 (0 đ)</p>
              <p className="text-lg font-bold">Total: {dataSource?.price}</p>
            </Col>
          </Row>
        </div>
      </Spin>
    </div>
  );
}

export default PaymentCommissionPage;
