import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { Input, Spin, Modal } from "antd";
import RetroGrid from "@/components/ui/retro-grid";
import { SalonPayment } from "@/services/salonPayment";
import { GetInformationAccount } from "@/store/account/action";

const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

export default function WalletPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [paymentLink, setPaymentLink] = useState(null);
  const uid = useSelector((state) => state.ACCOUNT.uid);
  const [amount, setAmount] = useState("");
  const dispatch = useDispatch();
  const [iframeError, setIframeError] = useState(false);
  const handleAmountChange = (e) => {
    let value = parseFloat(e.target.value);
    setAmount(isNaN(value) || value <= 0 ? 0 : value);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const data = {
        configId: null,
        appointmentId: null,
        price: amount,
        description: "Thanh toán dịch vụ",
      };

      const response = await SalonPayment.createPaymentLink(uid, data);
      if (response && response.data && response.data.checkoutUrl) {
        setPaymentLink(response.data.checkoutUrl);
        setIsOpen(true); // Open modal with payment link
      } else {
        throw new Error("Không tìm thấy URL thanh toán hợp lệ trong response");
      }
    } catch (error) {
      console.error(error);
      setMessage("Không thể tạo link thanh toán");
    } finally {
      setIsLoading(false);
    }
  };
  const handleReloadMoney = () => {
    setIsOpen(false);
    dispatch(GetInformationAccount(uid));
    setAmount("0");
  };
  useEffect(() => {
    if (iframeError && isOpen) {
      setIsOpen(false);
      setMessage("Liên kết thanh toán đã hết hạn hoặc không còn tồn tại");
    }
  }, [iframeError, isOpen]);
  const handleIframeError = () => {
    setIframeError(true);
  };

  return (
    <>
      {message ? (
        <Message message={message} />
      ) : (
        <motion.div
          className="relative flex mt-32 h-[700px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl"
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
            className="flex flex-col items-center justify-center h-1/2 w-1/2 bg-gray-200 rounded-lg border bg-background md:shadow-xl p-4 mt-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-2">Nhập số tiền bạn muốn nạp vào ví</div>
            <Input
              className="mb-4"
              type="number"
              placeholder="Vui lòng nhập số tiền cần nạp"
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

          <RetroGrid />
        </motion.div>
      )}

      {/* Payment Modal */}
      <Modal
        visible={isOpen}
        onCancel={handleReloadMoney}
        afterClose={() => {
          dispatch(GetInformationAccount(uid));
          setAmount("0");
        }}
        footer={null}
        width={window.innerWidth < 768 ? "90%" : "60%"} // Adjust modal width for mobile
        bodyStyle={{
          height: window.innerWidth < 768 ? "60vh" : "500px", // Adjust height for mobile
          padding: 0,
        }}
      >
        <iframe
          onError={handleIframeError}
          src={paymentLink}
          title="PayOS Payment"
          className="w-full h-full rounded-lg"
          style={{
            height: window.innerWidth < 768 ? "100%" : "500px",
          }}
        ></iframe>
      </Modal>
    </>
  );
}

const Message = ({ message }) => (
  <div className="main-box">
    <div className="checkout">
      <div
        className="product"
        style={{ textAlign: "center", fontWeight: "500" }}
      >
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
