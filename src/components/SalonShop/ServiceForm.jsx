import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Upload,
  message,
  TimePicker,
  InputNumber,
  Typography,
  Flex,
} from "antd";
import { DollarCircleOutlined, UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { actPostCreateSalonService } from "../../store/salonEmployees/action";

const AddServiceForm = ({ salonInformationId, status, isOpen }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const timeFormat = "HH:mm";
  const [serviceTime, setServiceTime] = useState(dayjs("00:00", timeFormat));
  const [currencyValue, setCurrencyValue] = useState(100000); // Initial value //100.000 d

  const dispatch = useDispatch();

  const onFinish = async (values) => {
    const { serviceName, description } = values;
    const imageFile = fileList.length > 0 ? fileList[0].originFileObj : null;
    // console.log(services, "servicesss");

    if (
      !imageFile ||
      !serviceName ||
      !salonInformationId ||
      !currencyValue ||
      !serviceTime ||
      !description
    ) {
      console.error("Required fields are missing!");
      message.error("Required fields are missing!");
      return;
    }
    const formData = new FormData();
    formData.append("SalonInformationId", salonInformationId);
    formData.append("ServiceName", serviceName);
    formData.append("Price", currencyValue);
    formData.append("Description", description);
    formData.append("Img", imageFile);
    formData.append("Time", serviceTime);
    formData.append("IsActive", true);
    dispatch(actPostCreateSalonService(formData, salonInformationId))
      .then((response) => {
        message.success("Thêm dịch vụ thành công!");
        form.resetFields();
        setFileList([]);
        status();
        isOpen();
      })
      .catch((error) => {
        message.error("Dịch vụ chưa được tạo!");
        // Handle the error
      });

    // dispatch(actPostCreateSalonService(formData, salonInformationId));
  };

  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const onTimeChange = (time) => {
    function roundUpToNearestIncrement(number, increment) {
      const roundedValue = Math.ceil(number / increment) * increment; //Math.ceil làm tròn lên, 1 * increment
      return roundedValue === number
        ? roundedValue
        : Math.ceil(number / increment) * increment;
    }
    const { $H, $m, ...rest } = time;
    const serviceTimeString = parseFloat(`${$H}.${$m}`); //convert string to float number
    const rounded15 = roundUpToNearestIncrement(serviceTimeString, 0.25); //0.25
    const rounded30 = roundUpToNearestIncrement(serviceTimeString, 0.5); //0.5
    const rounded45 = roundUpToNearestIncrement(serviceTimeString, 0.75); //0.75
    const rounded1 = roundUpToNearestIncrement(serviceTimeString, 1);
    for (let i = 0; i < 10; i++) {
      //chọn khoảng thời gian cho phép làm tóc 10 = 10 tiếng :))
      if (serviceTimeString + 0.1 === i + 0.25) {
        console.log(`rounded15: ${rounded15}, expected: ${i + 0.25}`);
        setServiceTime(rounded15);
        return;
      } else if (serviceTimeString + 0.2 === i + 0.5) {
        // < 0.0001
        console.log(`rounded30: ${rounded30}, expected: ${i + 0.5}`);
        setServiceTime(rounded30);
        return;
      } else if (serviceTimeString + 0.3 === i + 0.75) {
        console.log(`rounded45: ${rounded45}, expected: ${i + 0.75}`);
        setServiceTime(rounded45);
        return;
      } else if (Number.isInteger(serviceTimeString)) {
        console.log(`rounded00: ${rounded1}, expected: ${i}`);
        setServiceTime(rounded1);
        return;
      }
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND", // Replace 'USD' with your desired currency code
    }).format(value);
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item
        name="serviceName"
        label="Tên dịch vụ"
        rules={[{ required: true, message: "Vui lòng nhập tên dịch vụ!" }]}
      >
        <Input placeholder="Tên dịch vụ" />
      </Form.Item>
      <Form.Item
        name="description"
        label="Mô tả"
        rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
      >
        <Input placeholder="Mô tả" />
      </Form.Item>
      <Form.Item
        name="price"
        label="Giá (VND)"
        initialValue={currencyValue}
        // rules={[{ required: true, message: "Please enter price!" }]}
      >
        <InputNumber
          value={currencyValue}
          onChange={(value) => setCurrencyValue(value)}
          // formatter={() =>formatCurrency(currencyValue)}
          // parser={(value) => value.replace(/\D/g,'')}
          type="number"
          // defaultValue={100000}
        />
        <Flex className="mt-3" gap={"small"}>
          {<DollarCircleOutlined />}
          <Typography.Text strong>
            Giá: {formatCurrency(currencyValue)}
          </Typography.Text>
        </Flex>
      </Form.Item>
      <Form.Item
        name="time"
        label="Thời lượng (khoảng cách 15 phút)"
        // rules={[{ required: true, message: "Please enter time!" }]}
      >
        <TimePicker
          onChange={onTimeChange}
          // defaultValue={dayjs("00:00", timeFormat)}
          format={timeFormat}
          minuteStep={15}
        />
      </Form.Item>
      <Form.Item
        name="img"
        label="Ảnh"
        rules={[{ required: true, message: "Vui lòng tải lên hình ảnh!" }]}
      >
        <Upload
          listType="picture"
          fileList={fileList}
          onChange={handleUploadChange}
          beforeUpload={() => false}
        >
          <Button icon={<UploadOutlined />}>Tải ảnh</Button>
        </Upload>
      </Form.Item>
      <Form.Item>
        <Button style={{ width: "100%" }} type="primary" htmlType="submit">
          Lưu dịch vụ
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddServiceForm;
