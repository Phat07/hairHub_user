import RetroGrid from "@/components/ui/retro-grid";
import { Input, Spin } from "antd";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SalonPayment } from "@/services/salonPayment";
import { useSelector } from "react-redux";
import { usePayOS } from "payos-checkout";

const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

function WalletPage(props) {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [payOSConfig, setPayOSConfig] = useState(null);
  const uid = useSelector((state) => state.ACCOUNT.uid);

  const handleAmountChange = (e) => {
    let value = parseFloat(e.target.value);
    if (isNaN(value) || value <= 0) {
      value = 0;
    }
    setAmount(value);
  };

  const handleSubmit = async () => {
    if (!amount || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const paymentData = {
      configId: null,
      appointmentId: null,
      price: amount,
      description: "Thanh toán dịch vụ",
    };

    try {
      setIsLoading(true);

      const response = await SalonPayment.createPaymentLink(uid, paymentData);
      console.log("s",response.data);
      
      if (!response?.data?.checkoutUrl) {
        throw new Error('Invalid checkout URL received from server');
      }

      const newPayOSConfig = {
        RETURN_URL: window.location.origin,
        ELEMENT_ID: "payos-checkout",
        CHECKOUT_URL: response.data.checkoutUrl,
        embedded: true,
        onSuccess: (event) => {
          console.log("Payment Successful:", event);
          alert("Payment completed successfully!");
        },
        onCancel: (event) => {
          console.log("Payment Cancelled:", event);
          alert("Payment was cancelled.");
        },
        onExit: (event) => {
          console.log("Payment Popup Closed:", event);
          alert("Payment popup was closed.");
        },
      };

      console.log('PayOS Configuration:', newPayOSConfig);
      setPayOSConfig(newPayOSConfig); // Store configuration in state
    } catch (error) {
      console.error('Payment creation failed:', error);
      alert('Unable to initiate payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize PayOS only when payOSConfig is set
  const payOS = payOSConfig ? usePayOS(payOSConfig) : null;

  useEffect(() => {
    if (payOS) {
      payOS.open();
    }
  }, [payOS]); // Run when payOSConfig changes

  return (
    <motion.div
      className="relative flex h-[700px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <span className="pointer-events-none z-10 whitespace-pre-wrap bg-gradient-to-b from-[#e8ee46] via-[#7a7603] to-[#93a10e] bg-clip-text text-center text-5xl font-bold leading-none tracking-tighter text-transparent">
        Nơi nhận nạp tiền
      </span>
      <br />
      <span>Quét mã QR để nạp tiền ngay</span>

      <motion.div
        className="flex flex-col items-center justify-center h-1/2 w-1/2 bg-gray-400 rounded-lg border bg-background md:shadow-xl p-4 mt-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-2">Nhập số tiền bạn muốn nạp vào ví</div>
        <Input
          className="mb-4"
          type="number"
          placeholder={"Vui lòng nhập số tiền cần nạp"}
          value={amount}
          onChange={handleAmountChange}
          min={0}
        />

        <div className="mb-4">
          Số tiền đã nhập: {formatCurrency(amount || 0)}
        </div>

        <button
          onClick={handleSubmit}
          className="px-6 py-2 text-white rounded-md bg-[#ad7424] hover:bg-[#967546] hover:text-black transition-all duration-300"
          disabled={isLoading || !amount || amount <= 0}
        >
          {isLoading ? <Spin className="custom-spin" /> : "Nạp tiền ngay"}
        </button>
      </motion.div>
      <div
        id="payos-checkout"
        className="w-80 h-80 mx-auto mt-1 flex items-center justify-center"
      ></div>

      <RetroGrid />
    </motion.div>
  );
}

export default WalletPage;
