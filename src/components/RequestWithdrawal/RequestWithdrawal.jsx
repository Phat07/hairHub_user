/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Input,
  Select,
  Form,
  Image,
  Upload,
  message,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import axios from "axios";
import { SalonPayment } from "@/services/salonPayment";
import { useSelector } from "react-redux";
import OTPModal from "../DeleteAccount/OTPModal";

function RequestWithdrawal({ visible, onCancel, onConfirm, email }) {
  const userInfo = useSelector((state) => state.ACCOUNT.userInfo);
  const uid = useSelector((state) => state.ACCOUNT.uid);
  const [banks, setBanks] = useState([]);
  const [form] = Form.useForm();
  const [searchValue, setSearchValue] = useState("");
  const [filteredBanks, setFilteredBanks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOTPModalVisible, setIsOTPModalVisible] = useState(false);

  // Lưu thông tin form vào state
  const [images, setImages] = useState([]);

  useEffect(() => {
    async function fetchBanks() {
      try {
        const response = await axios.get("https://api.vietqr.io/v2/banks");
        setBanks(response.data.data);
      } catch (error) {
        console.error("Failed to fetch banks", error);
      }
    }
    fetchBanks();
  }, []);

  useEffect(() => {
    if (searchValue) {
      setFilteredBanks(
        banks.filter((bank) =>
          bank.shortName.toLowerCase().includes(searchValue.toLowerCase())
        )
      );
    } else {
      setFilteredBanks(banks); // Reset to all banks if no search value
    }
  }, [searchValue, banks]);

  const handleUploadChange = ({ fileList }) => {
    // Giới hạn tối đa 2 ảnh
    if (fileList.length > 2) {
      message.warning("Chỉ được upload tối đa 2 ảnh");
      return;
    }
    setImages(fileList);
  };

  const handleRemoveImage = (file) => {
    setImages(images.filter((img) => img.uid !== file.uid));
  };

  const handleSendOTPConfirm = async () => {
    const values = await form.validateFields();

    // Kiểm tra từng giá trị để đảm bảo không có trường nào trống
    if (
      !values.accountHolderName ||
      !values.accountNumber ||
      !values.bankName ||
      !values.balance
    ) {
      message.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (images.length !== 2) {
      message.error("Vui lòng tải lên 2 ảnh xác thực danh tính!");
      return;
    }
    try {
      setLoading(true);
      const response = await SalonPayment.SendOTPWithdrawPayment(uid);
      if (response.status === 200) {
        message.success("Gửi OTP thành công");
        setIsOTPModalVisible(true);
      }
    } catch (error) {
      console.error("Tạo đơn thất bại", error);
      message.error("Tạo đơn thất bại, vui lòng thử lại sau!!!");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = () => {
    setLoading(true);
    if (email) {
      axios
        .post("https://hairhub.gahonghac.net/api/v1/otps/checkOtp", {
          otpRequest: otp,
          email: email,
        })
        .then(() => {
          setIsOTPModalVisible(false);
          message.success("Otp xác thực thành công!");
          handleFormSubmit();
        })
        .catch((error) => {
          message.error(error?.response?.data?.message);
        })
        .finally(() => {
          setLoading(false);
          setOtp("");
        });
    }
  };

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();
      // Thêm dữ liệu vào FormData
      formData.append("AccountId", uid);
      formData.append("FullName", values.accountHolderName);
      formData.append("NumberAccount", values.accountNumber);
      formData.append("BankName", values.bankName);
      formData.append("Balance", values.balance);
      formData.append("Description", "Rút tiền từ ví Hairhub Pay");

      // Thêm ảnh vào FormData
      images.forEach((img) => {
        formData.append("IdentityCard", img.originFileObj);
      });

      setLoading(true);
      // const response = await SalonPayment.CreateWithdrawPayment(formData);
      // if (response.status === 200) {
      //   message.success("Tạo đơn thành công");
      //   onConfirm();
      // }
      await onConfirm(formData);
      onCancel();
      form.resetFields();
    } catch (error) {
      console.error("Tạo đơn thất bại", error);
      // const errorMessage = error.response?.data?.message || error.message;
      // message.warning(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOTP = () => {
    setOtp("");
    setIsOTPModalVisible(false);
  };

  const handleOTPConfirm = () => {
    if (!/^\d{6}$/.test(otp)) {
      message.error("OTP phải là số và có đúng 6 chữ số!");
      return;
    }
    verifyOtp();
    // Thêm logic xử lý OTP và xóa tài khoản ở đây
  };

  const handleCancel = () => {
    Modal.confirm({
      title: "Bạn muốn thoát chứ?",
      content: "Dữ liệu bạn đã điền sẽ mất hết.",
      okText: "Thoát",
      cancelText: "Quay lại",
      onOk: () => {
        form.resetFields(); // Xóa dữ liệu form
        setImages([]);
        onCancel(); // Hủy modal
      },
    });
  };

  return (
    <Modal
      title="Xác nhận rút tiền"
      visible={visible}
      onCancel={() => !loading && handleCancel()}
      footer={[
        <Button
          key="cancel"
          onClick={() => !loading && handleCancel()}
          disabled={loading}
        >
          Hủy
        </Button>,
        <Button
          key="confirm"
          type="primary"
          danger
          onClick={handleSendOTPConfirm}
          loading={loading}
        >
          Gửi
        </Button>,
      ]}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên thụ hưởng"
            name="accountHolderName"
            rules={[{ required: true, message: "Vui lòng nhập tên thụ hưởng" }]}
          >
            <Input placeholder="Tên thụ hưởng" />
          </Form.Item>
          <Form.Item
            label="Tên ngân hàng"
            name="bankName"
            rules={[{ required: true, message: "Vui lòng chọn ngân hàng" }]}
          >
            <Select
              placeholder="Chọn ngân hàng"
              showSearch
              onSearch={setSearchValue}
              filterOption={false}
              className="w-full"
              optionLabelProp="label"
            >
              {filteredBanks.map((bank) => (
                <Select.Option
                  key={bank.code}
                  value={bank.code}
                  label={bank.shortName}
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={bank.logo}
                      alt={bank.name}
                      width={32}
                      height={32}
                      preview={false}
                      className="object-contain"
                    />
                    <div className="flex flex-col">
                      <span className="text-base font-medium">
                        {bank.shortName}
                      </span>
                      <span className="text-sm text-gray-500">{bank.name}</span>
                    </div>
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Số tài khoản"
            name="accountNumber"
            rules={[{ required: true, message: "Vui lòng nhập số tài khoản" }]}
          >
            <Input type="number" placeholder="Số tài khoản" />
          </Form.Item>
          {/* <Form.Item
            label="Số tiền muốn rút"
            name="balance"
            rules={[{ required: true, message: "Vui lòng nhập số tiền" }]}
          >
            <Input
              type="number"
              placeholder="Nhập số tiền"
              // value={balance}
              // onChange={(e) => setBalance(e.target.value)}
            />
          </Form.Item> */}
          <Form.Item
            label="Số tiền muốn rút"
            name="balance"
            rules={[
              { required: true, message: "Vui lòng nhập số tiền" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const userBalance = userInfo?.balance || 0;

                  if (!value) {
                    return Promise.resolve(); // Bỏ qua nếu trống (vì đã có required check)
                  }

                  if (value < 50000) {
                    return Promise.reject(
                      new Error("Số tiền phải lớn hơn 50,000")
                    );
                  }

                  if (value > userBalance) {
                    return Promise.reject(
                      new Error(
                        `Số tiền không được vượt quá số dư: ${userBalance}`
                      )
                    );
                  }

                  return Promise.resolve(); // Hợp lệ
                },
              }),
            ]}
          >
            <Input type="number" placeholder="Nhập số tiền" min={0} />
          </Form.Item>

          {/* <Form.Item
            label="Lý do yêu cầu rút tiền"
            name="withdrawalReason"
            rules={[{ required: true, message: "Vui lòng nhập lý do" }]}
          >
            <Input.TextArea placeholder="Lý do yêu cầu rút tiền" />
          </Form.Item> */}
          <Form.Item label="Tải lên ảnh (tối đa 2 ảnh)">
            <Upload
              listType="picture-card"
              fileList={images}
              onChange={handleUploadChange}
              onRemove={handleRemoveImage}
              beforeUpload={() => false} // Không upload ngay, lưu ảnh vào state
            >
              {images.length < 2 && (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        </Form>
      </motion.div>
      <OTPModal
        visible={isOTPModalVisible}
        onCancel={handleCancelOTP}
        otp={otp}
        setOtp={setOtp}
        onConfirm={handleOTPConfirm}
        sendOTP={handleSendOTPConfirm}
      />
    </Modal>
  );
}

export default RequestWithdrawal;
