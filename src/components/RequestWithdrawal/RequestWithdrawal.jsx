import React, { useState, useEffect } from "react";
import { Modal, Button, Input, Select, Form, Image } from "antd";
import { motion } from "framer-motion";
import axios from "axios";

function RequestWithdrawal({ visible, onCancel, onConfirm }) {
  const [banks, setBanks] = useState([]);
  const [form] = Form.useForm();
  const [searchValue, setSearchValue] = useState("");
  const [filteredBanks, setFilteredBanks] = useState([]);

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

  return (
    <Modal
      title="Xác nhận rút tiền"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button
          key="confirm"
          type="primary"
          danger
          onClick={() => form.validateFields().then(onConfirm)}
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
              optionLabelProp="label" // Use this to display the label correctly in the input field
            >
              {filteredBanks.map((bank) => (
                <Select.Option
                  key={bank.code}
                  value={bank.code}
                  label={bank.shortName} // Use shortName as label for selected bank
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={bank.logo}
                      alt={bank.name}
                      width={32} // Set smaller width for the logo in the select box
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
            <Input placeholder="Số tài khoản" />
          </Form.Item>
          <Form.Item
            label="Lý do yêu cầu rút tiền"
            name="withdrawalReason"
            rules={[{ required: true, message: "Vui lòng nhập lý do" }]}
          >
            <Input.TextArea placeholder="Lý do yêu cầu rút tiền" />
          </Form.Item>
        </Form>
      </motion.div>
    </Modal>
  );
}

export default RequestWithdrawal;
