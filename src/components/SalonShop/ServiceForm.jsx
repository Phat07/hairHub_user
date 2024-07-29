// import React, { useState } from "react";
// import { Form, Input, Button, Space, Upload, Tooltip, message } from "antd";
// import {
//   MinusCircleOutlined,
//   PlusOutlined,
//   UploadOutlined,
// } from "@ant-design/icons";
// import axios from "axios";

// //d51d4907-519c-409e-7c2a-08dc8573092a

// const AddServiceForm = ({ onAddServices, salonInformationId }) => {
//   const [form] = Form.useForm();
//   const [fileList, setFileList] = useState([]);

//   const SERVICES_URL =
//     "http://14.225.218.91:8080/api/v1/servicehairs/CreateServiceHair";

//   const onFinish = async (values) => {
//     console.log(values, "values Services");
//     const { serviceName, description, price, img, time } = values;
//     // const services = values.services?.map((service) => ({
//     //   ...service,
//     //   img: fileList.find((file) => file.name === service.name)?.url,
//     // }));
//     // const findTest = fileList.find((file) => {
//     //   console.log("Found file:", file); // Check if matching file is found
//     //   return file.name === services.name;
//     // })?.url;
//     const services = await Promise.all(
//       values.services?.map(async (service) => {
//         const matchingFile = fileList?.find((file) => {
//           // Lowercase both names for case-insensitive comparison
//           const lowerFileName = file.name.toLowerCase();
//           const lowerServiceName = service.name.toLowerCase();
//           // Check if service name is present anywhere in the file name (words)
//           return lowerFileName.includes(lowerServiceName);
//         });

//         return {
//           ...service,
//           img: matchingFile?.url,
//         };
//       })
//     );

//     const formData = new FormData();
//     const imageFile = fileList.length > 0 ? fileList[0].originFileObj : null;

//     if (
//       !imageFile ||
//       !serviceName ||
//       !salonInformationId ||
//       !price ||
//       !time ||
//       !description
//     ) {
//       console.error("Required fields are missing.");
//       message.error("Required fields are missing.");
//       return;
//     }
//     formData.append("SalonInformationId", salonInformationId);
//     formData.append("ServiceName", serviceName);
//     formData.append("Price", price);
//     formData.append("Description", description);
//     formData.append("Img", imageFile);
//     formData.append("Time", time);

//     // dispatch(actPostCreateSalonInformation(formData));
//     onAddServices(formData);
//     console.log(formData, "FormData Services");
//     form.resetFields();
//     setFileList([]);
//     console.log(services, "value form services");
//   };

//   const handleUploadChange = ({ fileList }) => {
//     // Generate URL for preview (this is for demonstration purposes only)
//     const updatedFileList = fileList.map((file) => ({
//       ...file,
//       url: URL.createObjectURL(file.originFileObj),
//     }));
//     setFileList(updatedFileList);
//     console.log(updatedFileList, "fileList");
//   };

//   return (
//     <Form form={form} onFinish={onFinish} layout="vertical">
//       <Form.List name="services">
//         {(fields, { add, remove }) => (
//           <>
//             {fields.map(({ key, name, fieldKey, ...restField }) => (
//               <Space
//                 key={key}
//                 style={{ display: "flex", marginBottom: 8 }}
//                 align="baseline"
//               >
//                 <Form.Item
//                   {...restField}
//                   name={[name, "name"]}
//                   fieldKey={[fieldKey, "name"]}
//                   rules={[
//                     { required: true, message: "Please enter service name!" },
//                   ]}
//                 >
//                   <Input placeholder="Service Name" />
//                 </Form.Item>
//                 <Form.Item
//                   {...restField}
//                   name={[name, "description"]}
//                   fieldKey={[fieldKey, "description"]}
//                   rules={[
//                     { required: true, message: "Please enter description!" },
//                   ]}
//                 >
//                   <Input placeholder="Description" />
//                 </Form.Item>
//                 <Form.Item
//                   {...restField}
//                   name={[name, "price"]}
//                   fieldKey={[fieldKey, "price"]}
//                   rules={[{ required: true, message: "Please enter price!" }]}
//                 >
//                   <Input type="number" placeholder="Price" />
//                 </Form.Item>
//                 <Tooltip title="1 = 1 hours">
//                   <Form.Item
//                     {...restField}
//                     name={[name, "time"]}
//                     fieldKey={[fieldKey, "time"]}
//                     rules={[{ required: true, message: "Please enter time!" }]}
//                   >
//                     <Input type="number" placeholder="Time" />
//                   </Form.Item>
//                 </Tooltip>
//                 <Form.Item
//                   {...restField}
//                   name={[name, "img"]}
//                   fieldKey={[fieldKey, "img"]}
//                 >
//                   <Upload
//                     multiple
//                     listType="picture"
//                     onChange={handleUploadChange}
//                     beforeUpload={() => false}
//                   >
//                     <Button icon={<UploadOutlined />}>Upload Image</Button>
//                   </Upload>
//                 </Form.Item>
//                 <MinusCircleOutlined onClick={() => remove(name)} />
//               </Space>
//             ))}
//             <Form.Item>
//               <Button
//                 type="dashed"
//                 onClick={() => add()}
//                 block
//                 icon={<PlusOutlined />}
//               >
//                 Add Service
//               </Button>
//             </Form.Item>
//           </>
//         )}
//       </Form.List>
//       <Form.Item>
//         <Button type="primary" htmlType="submit">
//           Save Services
//         </Button>
//       </Form.Item>
//     </Form>
//   );
// };

// export default AddServiceForm;
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

const AddServiceForm = ({ salonInformationId, status }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const timeFormat = "HH:mm";
  const [serviceTime, setServiceTime] = useState(dayjs("00:00", timeFormat));
  const [currencyValue, setCurrencyValue] = useState(100000); // Initial value //100.000 d

  const dispatch = useDispatch();

  const SERVICES_URL =
    "http://14.225.218.91:8080/api/v1/servicehairs/CreateServiceHair";

  const onFinish = async (values) => {
    console.log(values, "values Services");
    const { serviceName, description } = values;
    const imageFile = fileList.length > 0 ? fileList[0].originFileObj : null;
    // console.log(services, "servicesss");
    console.log(imageFile, "imageFileee");

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

    // Replace this with actual API call
    // await axios.post(SERVICES_URL, formData);
    // onAddServices(formData);
    // axios
    //   .post(SERVICES_URL, formData)
    //   .then((res) => {
    //     console.log(res, "create service response");
    //     status(); //invoke function in ListServices.jsx
    //   })
    //   .catch((err) => {
    //     console.log(err, "errors");
    //   });

    // console.log(formData, "FormData Services");
    dispatch(actPostCreateSalonService(formData, salonInformationId));
    form.resetFields();
    setFileList([]);
    status();
  };

  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList);
    console.log(fileList, "fileList");
  };

  const onTimeChange = (time) => {
    console.log(time, "timeneeeeee");
    function roundUpToNearestIncrement(number, increment) {
      const roundedValue = Math.ceil(number / increment) * increment; //Math.ceil làm tròn lên, 1 * increment
      return roundedValue === number
        ? roundedValue
        : Math.ceil(number / increment) * increment;
    }
    const { $H, $m, ...rest } = time;
    const serviceTimeString = parseFloat(`${$H}.${$m}`); //convert string to float number
    // console.log(serviceTimeString, "timeString");
    // console.log(roundUpToNearestIncrement(serviceTimeString, 0.5));
    const rounded15 = roundUpToNearestIncrement(serviceTimeString, 0.25); //0.25
    const rounded30 = roundUpToNearestIncrement(serviceTimeString, 0.5); //0.5
    const rounded45 = roundUpToNearestIncrement(serviceTimeString, 0.75); //0.75
    const rounded1 = roundUpToNearestIncrement(serviceTimeString, 1);
    // console.log(serviceTimeString + 0.1, "15minutes");
    // console.log(serviceTimeString + 0.2, "30minutes");
    // console.log(serviceTimeString + 0.3, "45minutes");
    // console.log(Number.isInteger(0.1)); //check integer
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
  console.log(serviceTime, "serviceTime");
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND", // Replace 'USD' with your desired currency code
      // minimumFractionDigits: 5, // Adjust decimal places as needed
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
