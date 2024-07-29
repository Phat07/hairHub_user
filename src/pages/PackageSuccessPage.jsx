import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import {
  Button,
  Card,
  Flex,
  List,
  message,
  Pagination,
  Typography,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { actGetAllConfig, actGetAllPaymentList } from "../store/config/action";
import { actCreatePaymentPackageByOwnerId } from "../store/salonPayment/action";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { formatCurrency } from "../components/formatCheckValue/formatCurrency";
import dayjs from "dayjs";

function PackageSuccessPage(props) {
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const auth = useAuthUser();
  const dispatch = useDispatch();
  const { Title, Text } = Typography;

  const ownerId = auth?.idOwner;
  console.log(ownerId, "ownerId");

  const pageSize = 10;
  const listPayment = useSelector(
    (state) => state.CONFIGREDUCER.getAllPaymentList
  );
  const totalPackages = useSelector(
    (state) => state.CONFIGREDUCER.totalPagesList
  );
  console.log("listPayment", listPayment);
  useEffect(() => {
    dispatch(actGetAllPaymentList(ownerId, currentPage, pageSize));
  }, [currentPage]);

  const handleSelectPackage = async (pkg) => {
    setSelectedPackage(pkg);
    setLoading(true);
    const data = {
      configId: pkg.id,
      salonOWnerID: ownerId,
      description: "thanh toán gói",
    };
    try {
      await dispatch(actCreatePaymentPackageByOwnerId(data));
    } catch (error) {
      console.error("Error creating payment:", error);
      message.error("Error creating payment");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getDayMonthYear = (date) => {
    return date.slice(0, 10);
  };

  const formatDate = "DD/MM/YYYY";
  const formatVietnameseDate = (date) => {
    const getDate = getDayMonthYear(date);
    const formattedDay = dayjs(getDate).format(formatDate);
    return formattedDay;
  };

  console.log(getDayMonthYear("2024-07-12T20:31:11.2798109"));
  return (
    <div>
      <Header />
      <div
        style={{
          marginTop: "140px",
          marginLeft: "250px",
          marginRight: "250px",
        }}
      ></div>
      <div className="mt-5 mb-3 ml-10 mr-10">
        <Title className="pretty-title">Danh sách các gói đã đăng ký</Title>
        <List
          itemLayout="horizontal"
          dataSource={listPayment}
          renderItem={(pkg) => (
            <List.Item
              actions={
                [
                  // <>
                  //   <Button
                  //     key={pkg?.id}
                  //     type="primary"
                  //     loading={loading && selectedPackage?.id === pkg.id}
                  //     onClick={() => handleSelectPackage(pkg)}
                  //   >
                  //     Chọn
                  //   </Button>
                  //   <Flex justify="end">
                  //     <Text strong mark>
                  //       {formatCurrency(pkg.pakageFee)}
                  //     </Text>
                  //   </Flex>
                  // </>,
                ]
              }
            >
              <Card
                style={{
                  width: "50%",
                  border: "2px solid gold",
                }}
              >
                <List.Item.Meta
                  title={
                    <Flex justify="space-between" align="start">
                      <Title>
                        {pkg?.config?.pakageName || pkg?.description}
                      </Title>
                      <Text
                        style={{
                          background: "#4CAF50",
                          padding: "0.5rem 1.5rem",
                          border: "1px solid green",
                          borderRadius: "5px",
                          fontSize: "1.5rem",
                          color: "#ffff",
                        }}
                      >
                        {pkg?.status}
                      </Text>
                    </Flex>
                  }
                  description={
                    <>
                      <Text>{pkg?.config?.description}</Text>
                      <Text>
                        <Text style={{ display: "inline" }} strong>
                          Gia hạn từ: &nbsp;
                        </Text>
                        {formatVietnameseDate(pkg?.startDate)}
                      </Text>
                      <Text>
                        <Text strong style={{ display: "inline" }}>
                          Hết hạn vào: &nbsp;
                        </Text>
                        {formatVietnameseDate(pkg?.endDate)}
                      </Text>
                    </>
                  }
                />
              </Card>
            </List.Item>
          )}
        />
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalPackages}
          onChange={handlePageChange}
          style={{ marginTop: "20px" }}
        />
      </div>
    </div>
  );
}

export default PackageSuccessPage;
