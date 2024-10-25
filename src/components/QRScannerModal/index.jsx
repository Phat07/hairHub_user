import React, { useState, useRef, useEffect } from "react";
import { Modal, message } from "antd";
import QrReader from "react-qr-scanner";
import { AccountServices } from "@/services/accountServices";

const QRScannerModal = ({ isVisible, onClose, idCustomer }) => {
  const [qrData, setQrData] = useState(null);
  const [scanError, setScanError] = useState(null);
  const [isNotified, setIsNotified] = useState(false);
  const [key, setKey] = useState(0); // Để reset QR Reader component
  const qrReaderRef = useRef(null); // Ref để quản lý QR Reader

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
    if (err.name === "NotAllowedError") {
      // Nếu quyền bị từ chối, đặt lỗi và reset component để yêu cầu quyền lại
      setScanError('Bạn đã từ chối quyền truy cập camera. Vui lòng thử lại hoặc cấp quyền trong cài đặt trình duyệt.');
      setKey((prevKey) => prevKey + 1); // Reset component QR Reader
    } else {
      setScanError('Đã xảy ra lỗi với camera: ' + err.message);
    }
    stopCamera(); // Dừng camera khi có lỗi
  };

  useEffect(() => {
    if (!isVisible) {
      stopCamera();
      setScanError(null); // Reset lỗi khi modal đóng
      setIsNotified(false);
      setQrData(null);
    }
  }, [isVisible]);

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
      {isVisible && !scanError && (
        <QrReader
          key={key} // Thêm key để reset component khi cần yêu cầu lại quyền
          ref={qrReaderRef} // Gắn ref vào QrReader
          delay={300}
          style={{ width: "100%" }}
          onError={handleError}
          onScan={handleScan}
        />
      )}
      {qrData && <p>Kết quả QR: {qrData}</p>}
      {scanError && (
        <div style={{ color: "red" }}>
          {/* <p>{scanError}</p> */}
          <p>Vui lòng vào cài đặt trình duyệt và cấp quyền truy cập camera để tiếp tục quét.</p>
        </div>
      )}
    </Modal>
  );
};

export default QRScannerModal;
