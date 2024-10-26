import RetroGrid from "@/components/ui/retro-grid";
import { Input, Spin } from "antd"; // Import Spin for loading indicator
import React, { useState } from "react";
import { motion } from "framer-motion";
import { SalonPayment } from "@/services/salonPayment";
import { useSelector } from "react-redux";

// Helper function to format currency as VND
const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

function WalletPage(props) {
  const [amount, setAmount] = useState(""); // State for storing input value
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [paymentMethodDetail, setPaymentMethodDetail] = useState(null); // Store payment details
  const uid = useSelector((state) => state.ACCOUNT.uid);

  // Handle input change
  const handleAmountChange = (e) => {
    let value = parseFloat(e.target.value);

    // Ensure value is greater than 0 and not a negative number
    if (isNaN(value) || value <= 0) {
      value = 0; // Reset to 0 if invalid
    }

    setAmount(value);
  };

  const handleSubmit = async () => {
    const data = {
      configId: null,
      appointmentId: null,
      price: amount,
      description: "Thanh toán dịch vụ",
    };

    try {
      setIsLoading(true); // Start loading state
      const response = await SalonPayment.createPaymentLink(uid, data);
      // Assuming the payment URL is in the response, navigate to it
      const paymentUrl = response.data.checkoutUrl; // Adjust this based on your actual response structure

      if (paymentUrl) {
        window.location.href = paymentUrl; // Redirect to the payment page
      }
    } catch (err) {
      console.log(err); // Log the error
      // Optionally show a message or alert to the user on error
    } finally {
      setIsLoading(false); // Stop loading state
    }
  };

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

        {/* Button for "Nạp tiền ngay" */}
        <button
          onClick={handleSubmit}
          className="px-6 py-2 text-white rounded-md bg-[#ad7424] hover:bg-[#967546] hover:text-black transition-all duration-300"
          disabled={isLoading} // Disable button during loading
        >
          {isLoading ? <Spin className="custom-spin" /> : "Nạp tiền ngay"}{" "}
          {/* Show spinner during loading */}
        </button>
      </motion.div>

      <RetroGrid />
    </motion.div>
  );
}

export default WalletPage;
