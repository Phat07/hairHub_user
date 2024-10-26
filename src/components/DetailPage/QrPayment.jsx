// import React, { useEffect, useState, useCallback } from "react";
// import {
//   Modal,
//   Typography,
//   Spin,
//   message,
//   Card,
//   Space,
//   Divider,
//   Button,
// } from "antd";
// import { motion, AnimatePresence } from "framer-motion";
// import { QrcodeOutlined, BankOutlined, InfoCircleOutlined } from "@ant-design/icons";
// import { SalonPayment } from "@/services/salonPayment";
// import { useSelector } from "react-redux";

// const { Text, Title } = Typography;

// const fadeIn = {
//   hidden: { opacity: 0, y: 20 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     transition: { duration: 0.5 },
//   },
//   exit: {
//     opacity: 0,
//     y: -20,
//     transition: { duration: 0.3 },
//   },
// };

// const QrPayment = ({
//   isOpen,
//   onClose,
//   price,
//   configId,
//   appointmentId,
//   description,
// }) => {
//   const [paymentDetail, setPaymentDetail] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isCheckingStatus, setIsCheckingStatus] = useState(false);
//   const uid = useSelector((state) => state.ACCOUNT.uid);

//   const fetchPaymentLink = async () => {
//     try {
//       const data = {
//         configId: configId || null,
//         appointmentId: appointmentId || null,
//         price: price || null,
//         description: "string",
//       };
//       setIsLoading(true);
//       const response = await SalonPayment.createPaymentLink(uid, data);
//       log
//       if (response.data) {
//         setPaymentDetail(response.data);
//       } else {
//         throw new Error("Failed to create payment link");
//       }
//     } catch (error) {
//       message.error("Không thể tạo link thanh toán. Vui lòng thử lại.");
//       onClose();
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const checkPaymentStatus = async () => {
//     try {
//       const response = await SalonPayment.checkPaymentStatus();
//       if (response.data === true) {
//         message.success("Thanh toán thành công!");
//         onClose(); // Close modal upon success
//       } else if (response.data === false) {
//         message.error("Thanh toán thất bại. Vui lòng thử lại.");
//         onClose(); // Close modal upon failure
//       }
//     } catch (error) {
//       console.error("Error checking payment status:", error);
//     }
//   };

//   useEffect(() => {
//     let statusCheckInterval;
//     if (isOpen) {
//       fetchPaymentLink();

//       // Start polling for payment status
//       statusCheckInterval = setInterval(() => {
//         checkPaymentStatus();
//       }, 5000); // Check every 5 seconds
//     }

//     return () => {
//       clearInterval(statusCheckInterval); // Clear interval on close
//       setPaymentDetail(null);
//       setIsLoading(false);
//     };
//   }, [isOpen]);

//   if (!isOpen) return null;

//   return (
//     <Modal
//       title={
//         <motion.div
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           <Title level={4}>Thanh toán đơn hàng</Title>
//         </motion.div>
//       }
//       open={isOpen}
//       onCancel={onClose}
//       footer={null}
//       destroyOnClose
//       width={480}
//     >
//       <div>
//         <AnimatePresence mode="wait">
//           {isLoading ? (
//             <motion.div
//               key="loading"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 padding: 32,
//                 gap: 16,
//               }}
//             >
//               <Spin size="large" className="custom-spin" />
//               <Text>Đang tạo link thanh toán...</Text>
//             </motion.div>
//           ) : paymentDetail ? (
//             <motion.div
//               key="payment-content"
//               initial="hidden"
//               animate="visible"
//               exit="exit"
//               variants={fadeIn}
//             >
//               <Card>
//                 <Space direction="vertical" size="large" style={{ width: "100%" }}>
//                   <motion.div
//                     className="text-center"
//                     whileHover={{ scale: 1.02 }}
//                     transition={{ type: "spring", stiffness: 300 }}
//                     style={{ textAlign: "center" }}
//                   >
//                     <QrcodeOutlined style={{ fontSize: 24, marginBottom: 16 }} />
//                     {paymentDetail.qrCode && (
//                       <div
//                         style={{
//                           background: "#fff",
//                           padding: 16,
//                           borderRadius: 8,
//                           boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//                           display: "inline-block",
//                         }}
//                       >
//                         <img
//                           src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
//                             paymentDetail.qrCode
//                           )}`}
//                           alt="QR Code"
//                           style={{ width: 200, height: 200 }}
//                         />
//                       </div>
//                     )}
//                   </motion.div>

//                   <Divider />

//                   <motion.div
//                     style={{ textAlign: "center" }}
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ delay: 0.2 }}
//                   >
//                     <Space direction="vertical" size="small">
//                       <Text strong style={{ fontSize: 16 }}>
//                         <InfoCircleOutlined style={{ marginRight: 8 }} />
//                         Số tiền:{" "}
//                         {new Intl.NumberFormat("vi-VN", {
//                           style: "currency",
//                           currency: "VND",
//                         }).format(paymentDetail.amount)}
//                       </Text>
//                       <Text>Mã đơn hàng: {paymentDetail.orderCode}</Text>
//                       {paymentDetail?.description && (
//                         <Text type="secondary">{paymentDetail?.description}</Text>
//                       )}
//                     </Space>
//                   </motion.div>

//                   <Divider />

//                   {paymentDetail.accountNumber && (
//                     <motion.div
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       transition={{ delay: 0.4 }}
//                     >
//                       <Card
//                         size="small"
//                         title={
//                           <Space>
//                             <BankOutlined />
//                             <Text strong>Thông tin tài khoản</Text>
//                           </Space>
//                         }
//                       >
//                         <Space direction="vertical" size="small">
//                           <Text>Số TK: {paymentDetail.accountNumber}</Text>
//                           {paymentDetail.bin && (
//                             <Text>Mã ngân hàng: {paymentDetail.bin}</Text>
//                           )}
//                         </Space>
//                       </Card>
//                     </motion.div>
//                   )}
//                 </Space>
//               </Card>
//             </motion.div>
//           ) : (
//             <motion.div
//               key="error"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 padding: 32,
//                 gap: 16,
//               }}
//             >
//               <Text type="danger">Không thể tải thông tin thanh toán</Text>
//               <Button onClick={() => fetchPaymentLink()}>Thử lại</Button>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </Modal>
//   );
// };

// export default QrPayment;

import React, { useEffect, useState } from "react";
import { Modal, Typography, Spin, message, Card, Space, Button } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { SalonPayment } from "@/services/salonPayment";
import { useSelector } from "react-redux";
const { Text, Title } = Typography;

const QrPayment = ({
  isOpen,
  onClose,
  price,
  configId,
  appointmentId,
  description,
}) => {
  const [paymentDetail, setPaymentDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const uid = useSelector((state) => state.ACCOUNT.uid);

  const openPayOSCheckout = (checkoutUrl) => {
    // Xác định kích thước popup dựa trên kích thước màn hình
    let width, height;

    if (window.innerWidth <= 768) {
      // Thiết lập kích thước nhỏ hơn cho mobile
      width = window.innerWidth * 0.9;  // 90% chiều rộng màn hình
      height = window.innerHeight * 0.9; // 90% chiều cao màn hình
    } else {
      // Kích thước cho các màn hình lớn hơn (desktop)
      width = 450;
      height = 600;
    }

    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;

    const popup = window.open(
      checkoutUrl,
      "PayOS Checkout",
      `width=${width},height=${height},left=${left},top=${top}`
    );

    // Lắng nghe sự kiện message từ popup
    const messageHandler = (event) => {
      if (event.origin === "https://checkout.payos.vn") {
        const { status } = event.data;
        if (status === "PAID") {
          message.success("Thanh toán thành công!");
          setPaymentStatus("SUCCESS");
          onClose();
          popup.close();
        } else if (status === "CANCELLED") {
          message.error("Thanh toán đã bị hủy");
          setPaymentStatus("CANCELLED");
          popup.close();
        }
      }
    };

    window.addEventListener("message", messageHandler);

    // Cleanup function
    return () => {
      window.removeEventListener("message", messageHandler);
      if (popup) popup.close();
    };
  };

  const fetchPaymentLink = async () => {
    try {
      if (!price) {
        message.info("Vui lòng nhập số tiền");
        onClose();
        return;
      }
      const data = {
        configId: configId || null,
        appointmentId: appointmentId || null,
        price: price || null,
        description: description || "Thanh toán dịch vụ",
      };
      setIsLoading(true);
      const response = await SalonPayment.createPaymentLink(uid, data);

      if (response.data && response.data.checkoutUrl) {
        setPaymentDetail(response.data);
        openPayOSCheckout(response.data.checkoutUrl);
      } else {
        throw new Error("Failed to create payment link");
      }
    } catch (error) {
      message.error("Không thể tạo link thanh toán. Vui lòng thử lại.");
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    if (!paymentDetail?.orderCode) return;

    try {
      const response = await SalonPayment.checkPaymentStatus(
        paymentDetail.orderCode
      );

      if (response.data === true) {
        setPaymentStatus("SUCCESS");
        message.success("Thanh toán thành công!");
        onClose();
      } else if (response.data === false && paymentStatus !== "CANCELLED") {
        setPaymentStatus("PENDING");
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
    }
  };

  useEffect(() => {
    let statusCheckInterval;

    if (isOpen) {
      fetchPaymentLink();

      // Start polling for payment status every 5 seconds
      statusCheckInterval = setInterval(() => {
        checkPaymentStatus();
      }, 5000);
    }

    return () => {
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
      }
      setPaymentDetail(null);
      setPaymentStatus(null);
      setIsLoading(false);
    };
  }, [isOpen]);

  const handlePayment = () => {
    if (paymentDetail?.checkoutUrl) {
      openPayOSCheckout(paymentDetail.checkoutUrl);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      title={<Title level={4}>Thanh toán đơn hàng</Title>}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      width={400}
    >
      {isLoading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Spin size="large" />
          <Text style={{ display: "block", marginTop: "10px" }}>
            Đang tạo link thanh toán...
          </Text>
        </div>
      ) : paymentDetail ? (
        <Card>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <div style={{ textAlign: "center" }}>
              <Space direction="vertical" size="small">
                <Text strong style={{ fontSize: 16 }}>
                  <InfoCircleOutlined style={{ marginRight: 8 }} />
                  Số tiền:{" "}
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(paymentDetail.amount)}
                </Text>
                <Text>Mã đơn hàng: {paymentDetail.orderCode}</Text>
                {paymentDetail?.description && (
                  <Text type="secondary">{paymentDetail?.description}</Text>
                )}
              </Space>
            </div>

            <Button
              type="primary"
              block
              onClick={handlePayment}
              disabled={paymentStatus === "SUCCESS"}
            >
              {paymentStatus === "SUCCESS"
                ? "Đã thanh toán"
                : "Thanh toán ngay"}
            </Button>
          </Space>
        </Card>
      ) : (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Text type="danger">Không thể tải thông tin thanh toán</Text>
          <Button
            onClick={() => fetchPaymentLink()}
            style={{ marginTop: "10px" }}
          >
            Thử lại
          </Button>
        </div>
      )}
    </Modal>
  );
};

export default QrPayment;
