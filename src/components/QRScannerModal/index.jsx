import React, { useState } from "react";
import { Modal, message } from "antd"; // Ant Design components
import QrReader from "react-qr-scanner";
import { AccountServices } from "@/services/accountServices";

const QRScannerModal = ({ isVisible, onClose, idCustomer }) => {
  const [qrData, setQrData] = useState(null); // Dữ liệu từ QR code
  const [scanError, setScanError] = useState(null); // Để bắt lỗi khi quét
  const [isNotified, setIsNotified] = useState(false); // Trạng thái thông báo

  // Hàm xử lý kết quả quét
  const handleScan = (data) => {
    if (data && !isNotified) {
      const mappingData = {
        customerId: idCustomer,
        dataString: data.text,
      };

      // Đặt trạng thái thông báo ngay sau khi bắt đầu quá trình xử lý
      setIsNotified(true);

      AccountServices.checkInByCustomer(mappingData)
        .then((res) => {
          message.success("Quét QR check-in thành công");
          setQrData(data.text); // Lưu QR đã quét thành công
          onClose(); // Đóng modal khi thành công
        })
        .catch((err) => {
          message.error("Quét QR check-in thất bại!");
          console.error("Lỗi khi quét QR: ", err);
        })
        .finally(() => {
          setQrData(null); // Reset dữ liệu QR sau khi xử lý xong
        });
    }
  };

  // Hàm xử lý lỗi khi quét
  const handleError = (err) => {
    setScanError(err.message);
    console.error("Lỗi khi đọc QR: ", err);
  };

  return (
    <Modal
      title="Quét QR Code"
      visible={isVisible}
      onCancel={onClose}
      footer={null} // Không cần footer
    >
      {/* Component QR Reader */}
      <QrReader
        delay={300}
        style={{ width: "100%" }}
        onError={handleError}
        onScan={handleScan}
      />

      {/* Hiển thị dữ liệu quét được */}
      {qrData && <p>Kết quả QR: {qrData}</p>}
      {scanError && <p style={{ color: "red" }}>Lỗi: {scanError}</p>}
    </Modal>
  );
};

export default QRScannerModal;
