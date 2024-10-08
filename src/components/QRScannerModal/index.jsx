import React, { useState, useRef, useEffect } from "react";
import { Modal, message } from "antd";
import QrReader from "react-qr-scanner";
import { AccountServices } from "@/services/accountServices";

const QRScannerModal = ({ isVisible, onClose, idCustomer }) => {
  const [qrData, setQrData] = useState(null);
  const [scanError, setScanError] = useState(null);
  const [isNotified, setIsNotified] = useState(false);
  const qrReaderRef = useRef(null); // Ref để quản lý QR Reader

  // Dừng camera stream từ QrReader
  const stopCamera = () => {
    if (qrReaderRef.current && qrReaderRef.current.videoElement) {
      const videoElement = qrReaderRef.current.videoElement;
      if (videoElement && videoElement.srcObject) {
        const stream = videoElement.srcObject;
        stream.getTracks().forEach((track) => track.stop()); // Dừng các track
        videoElement.srcObject = null;
      }
    }
  };

  useEffect(() => {
    if (!isVisible) {
      stopCamera(); // Dừng camera khi modal không hiển thị
    }
  }, [isVisible]);

  const handleScan = (data) => {
    if (data && !isNotified) {
      const mappingData = {
        customerId: idCustomer,
        dataString: data.text,
      };

      setIsNotified(true);

      AccountServices.checkInByCustomer(mappingData)
        .then(() => {
          message.success("Quét QR check-in thành công");
          setQrData(data.text); // Lưu QR đã quét thành công
          onClose(); // Đóng modal khi thành công
        })
        .catch(() => {
          message.error("Quét QR check-in thất bại!");
        })
        .finally(() => {
          setQrData(null);
        });
    }
  };

  const handleError = (err) => {
    setScanError(err.message);
  };

  return (
    <Modal
      title="Quét QR Code"
      visible={isVisible}
      onCancel={() => {
        stopCamera(); // Dừng camera khi đóng modal
        onClose(); // Đóng modal
      }}
      footer={null} // Không cần footer
      destroyOnClose={true} // Hủy component khi modal đóng để giải phóng bộ nhớ
    >
      {isVisible && (
        <QrReader
          ref={qrReaderRef} // Gắn ref vào QrReader
          delay={300}
          style={{ width: "100%" }}
          onError={handleError}
          onScan={handleScan}
        />
      )}
      {qrData && <p>Kết quả QR: {qrData}</p>}
      {scanError && <p style={{ color: "red" }}>Lỗi: {scanError}</p>}
    </Modal>
  );
};

export default QRScannerModal;
