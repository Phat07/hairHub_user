// ConfirmDeleteModal.js
import React from "react";
import { Modal, Button } from "antd";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const ConfirmDeleteModal = ({ visible, onCancel, onConfirm }) => (
  <Modal
    title="Xác nhận xóa tài khoản"
    visible={visible}
    onCancel={onCancel}
    footer={[
      <Button key="cancel" onClick={onCancel}>
        Hủy
      </Button>,
      <Button key="confirm" type="primary" danger onClick={onConfirm}>
        Đồng ý Xóa
      </Button>,
    ]}
  >
    <h3>Bạn có chắc chắn muốn xóa tài khoản này không?</h3>

    {/* Tiêu đề và liên kết bổ sung */}
    <h3>
      {/* Cách thực hiện và các điều khoản khi xóa tài khoản:{" "} */}
      Xem chi tiết tại:{" "}
      <Link to="/deleteAcountGuide" style={{ color: "red" }}>
        Điều khoản và cách thức khi xóa tài khoản
      </Link>
    </h3>
  </Modal>
);

export default ConfirmDeleteModal;
