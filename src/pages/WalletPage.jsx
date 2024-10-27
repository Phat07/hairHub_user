import React, { useState, useEffect } from "react";
import { usePayOS } from "@payos/payos-checkout";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { Input, Spin } from "antd";
import RetroGrid from "@/components/ui/retro-grid";
import { SalonPayment } from "@/services/salonPayment";
const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};
export default function WalletPage({}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isCreatingLink, setIsCreatingLink] = useState(false);
  const uid = useSelector((state) => state.ACCOUNT.uid);
  const [amount, setAmount] = useState("");
  // Khởi tạo cấu hình payOS
  const [payOSConfig, setPayOSConfig] = useState({
    RETURN_URL: window.location.origin, // required
    ELEMENT_ID: "payos-checkout", // required
    CHECKOUT_URL: null, // required
    embedded: true, // Nếu dùng giao diện nhúng
    onSuccess: (event) => {
      //TODO: Hành động sau khi người dùng thanh toán đơn hàng thành công
      setIsOpen(false);
      setMessage("Thanh toán thành công");
    },
  });

  // Lấy hàm `open` và `exit` từ usePayOS
  const { open, exit } = usePayOS(payOSConfig);
  const handleAmountChange = (e) => {
    let value = parseFloat(e.target.value);
    if (isNaN(value) || value <= 0) {
      value = 0;
    }
    setAmount(value);
  };

  // Hàm tạo link thanh toán
  const handleSubmit = async () => {
    setIsCreatingLink(true);
    exit(); // Đóng iframe hiện tại (nếu có)

    try {
      const data = {
        configId: null,
        appointmentId: null,
        price: amount,
        description: "Thanh toán dịch vụ",
      };

      setIsLoading(true);

      // Gọi API tạo link thanh toán
      const response = await SalonPayment.createPaymentLink(uid, data);

      // Kiểm tra nếu response và response.data hợp lệ
      if (response && response.data && response.data.checkoutUrl) {
        const result = response.data;

        // Cập nhật config cho PayOS
        setPayOSConfig((oldConfig) => ({
          ...oldConfig,
          CHECKOUT_URL: result.checkoutUrl,
        }));

        setIsOpen(true); // Mở giao diện thanh toán
      } else {
        throw new Error("Không tìm thấy URL thanh toán hợp lệ trong response");
      }
    } catch (error) {
      console.error(error);
      setMessage("Không thể tạo link thanh toán");
    } finally {
      setIsLoading(false);
      setIsCreatingLink(false); // Ngừng trạng thái tạo link
    }
  };

  // Mở thanh toán khi CHECKOUT_URL được cập nhật
  useEffect(() => {
    if (payOSConfig.CHECKOUT_URL != null) {
      open();
    }
  }, [payOSConfig]);

  return message ? (
    <Message message={message} />
  ) : (
    <motion.div
      className="relative flex mt-32 h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl"
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

const Message = ({ message }) => (
  <div className="main-box">
    <div className="checkout">
      <div class="product" style={{ textAlign: "center", fontWeight: "500" }}>
        <p>{message}</p>
      </div>
      <form action="/">
        <button type="submit" id="create-payment-link-btn">
          Quay lại trang thanh toán
        </button>
      </form>
    </div>
  </div>
);
