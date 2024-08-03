// import React, { useState, useEffect } from "react";
// import Header from "../components/Header";
// import { Button, List, message, Pagination } from "antd";
// import axios from "axios";
// import { useDispatch, useSelector } from "react-redux";
// import { actGetAllConfig } from "../store/config/action";
// import { actCreatePaymentPackageByOwnerId } from "../store/salonPayment/action";
// import useAuthUser from "react-auth-kit/hooks/useAuthUser";

// function PackagePage(props) {
//   const [packages, setPackages] = useState([]);
//   const [selectedPackage, setSelectedPackage] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const auth = useAuthUser();
//   const dispatch = useDispatch();

//   const ownerId = auth?.idOwner;
//   console.log(ownerId, "ownerId");
//   const listPayment = useSelector(
//     (state) => state.CONFIGREDUCER.getAllPaymentList
//   );
//   console.log("listPayment", listPayment);
//   const pageSize = 10;
//   const listPackage = useSelector((state) => state.CONFIGREDUCER.getAllPackage);
//   const totalPackages = useSelector(
//     (state) => state.CONFIGREDUCER.totalPackages
//   );
//   console.log("listPackage", listPackage);
//   useEffect(() => {
//     dispatch(actGetAllConfig(currentPage, pageSize));
//   }, [currentPage]);

//   const handleSelectPackage = async (pkg) => {
//     setSelectedPackage(pkg);
//     setLoading(true);
//     const data = {
//       configId: pkg.id,
//       salonOWnerID: ownerId,
//       description: "thanh toán gói",
//     };
//     try {
//       // const response = await axios.post("/api/create-payment", {
//       //   packageId: pkg.id,
//       // });
//       // const paymentLink = response.data.paymentLink;

//       // if (paymentLink) {
//       //   window.location.href = paymentLink; // Chuyển hướng đến trang thanh toán
//       // } else {
//       //   message.error("Failed to get payment link");
//       // }
//       await dispatch(actCreatePaymentPackageByOwnerId(data));
//     } catch (error) {
//       console.error("Error creating payment:", error);
//       message.error("Error creating payment");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   return (
//     <div>
//       <Header />
//       <div
//         style={{
//           marginTop: "140px",
//           marginLeft: "250px",
//           marginRight: "250px",
//         }}
//       ></div>
//       <div className="mt-5 mb-3 ml-10 mr-10">
//         <h5>Danh sách gói đăng ký</h5>
//         <List
//           itemLayout="horizontal"
//           dataSource={listPackage}
//           renderItem={(pkg) => (
//             <List.Item
//               actions={[
//                 <Button
//                   type="primary"
//                   loading={loading && selectedPackage?.id === pkg.id}
//                   onClick={() => handleSelectPackage(pkg)}
//                 >
//                   Chọn
//                 </Button>,
//               ]}
//             >
//               <List.Item.Meta
//                 title={pkg.pakageName}
//                 description={pkg.description}
//               />
//             </List.Item>
//           )}
//         />
//         <Pagination
//           current={currentPage}
//           pageSize={pageSize}
//           total={totalPackages}
//           onChange={handlePageChange}
//           style={{ marginTop: "20px" }}
//         />
//       </div>
//     </div>
//   );
// }

// export default PackagePage;

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
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { actGetAllConfig } from "../store/config/action";
import { actCreatePaymentPackageByOwnerId } from "../store/salonPayment/action";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import moment from "moment";
import Loader from "../components/Loader";
import "../css/Title.css";
import { formatCurrency } from "../components/formatCheckValue/formatCurrency";

function PackagePage(props) {
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingTenLua, setLoadingTenLua] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [canShowPackages, setCanShowPackages] = useState(false);
  // const auth = useAuthUser();
  const dispatch = useDispatch();
  const { Title, Text } = Typography;

  // const ownerId = auth?.idOwner;

  const idCustomer = useSelector(
    (state) => state.ACCOUNT.idCustomer
  );
  const ownerId = useSelector(
    (state) => state.ACCOUNT.idOwner
  );

  const listPayment = useSelector(
    (state) => state.CONFIGREDUCER.getAllPaymentList
  );

  const pageSize = 10;
  const listPackage = useSelector((state) => state.CONFIGREDUCER.getAllPackage);
  const totalPackages = useSelector(
    (state) => state.CONFIGREDUCER.totalPackages
  );

  useEffect(() => {
    dispatch(actGetAllConfig(currentPage, pageSize));
  }, [currentPage]);

  useEffect(() => {
    if (listPayment && listPayment.length > 0) {
      const latestEndDate = listPayment.reduce((latest, payment) => {
        const paymentEndDate = moment(payment.endDate);
        return paymentEndDate.isAfter(latest) ? paymentEndDate : latest;
      }, moment(listPayment[0].endDate));

      const fourDaysBeforeEndDate = latestEndDate.subtract(4, "days");
      setCanShowPackages(moment().isAfter(fourDaysBeforeEndDate));
    } else {
      setCanShowPackages(true); // No payments, show packages
    }
  }, [listPayment]);

  const handleSelectPackage = async (pkg) => {
    setSelectedPackage(pkg);
    setLoadingTenLua(true);
    setLoading(true);
    const data = {
      configId: pkg.id,
      salonOWnerID: ownerId,
      description: "Thanh toán gói dịch vụ",
    };

    try {
      // const response = await axios.post("/api/create-payment", {
      //   packageId: pkg.id,
      // });
      // const paymentLink = response.data.paymentLink;

      // if (paymentLink) {
      //   window.location.href = paymentLink; // Chuyển hướng đến trang thanh toán
      // } else {
      //   message.error("Failed to get payment link");
      // }
      await dispatch(actCreatePaymentPackageByOwnerId(data));
      // .then(() => {
      //   setLoadingTenLua(false);
      // })
      // .catch((err) => {
      //   console.log(err, "errors");
      // })
      // .finally(() => {
      //   setLoadingTenLua(true);
      // });
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
        <Title level={2} className="pretty-title">
          Danh sách các gói đăng ký
        </Title>
        {canShowPackages ? (
          <>
            <Card>
              <List
                itemLayout="horizontal"
                dataSource={listPackage}
                renderItem={(pkg) => (
                  <List.Item
                    actions={[
                      <>
                        <Flex className="mb-3" justify="end">
                          <Text style={{ fontSize: "1.5rem" }} strong mark>
                            {pkg.isActive === true
                              ? formatCurrency(pkg.pakageFee)
                              : null}
                          </Text>
                        </Flex>
                        <Button
                          key={pkg?.id}
                          type="primary"
                          loading={loading && selectedPackage?.id === pkg.id}
                          onClick={() => handleSelectPackage(pkg)}
                          disabled={pkg.isActive === true ? false : true}
                        >
                          {pkg.isActive === true
                            ? "Chọn"
                            : "Gói này hiện không còn nữa!"}
                        </Button>
                      </>,
                    ]}
                  >
                    <List.Item.Meta
                      title={
                        <>
                          <Title level={3}>{pkg.pakageName}</Title>
                        </>
                      }
                      description={
                        <>
                          <Text>{pkg.description}</Text>
                        </>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalPackages}
              onChange={handlePageChange}
              style={{ marginTop: "20px" }}
            />
            {loadingTenLua && (
              <div className="overlay">
                <Loader />
              </div>
            )}
          </>
        ) : (
          <p>
            Bạn chỉ có thể chọn và thanh toán khi còn ít nhất 4 ngày trước khi
            gói hiện tại hết hạn.
          </p>
        )}
      </div>
    </div>
  );
}

export default PackagePage;
