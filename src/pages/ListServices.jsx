import React, { useEffect, useState } from "react";
import {
  List,
  Avatar,
  Image,
  Button,
  Flex,
  Modal,
  message,
  Popconfirm,
  Typography,
  Space,
  Form,
  Input,
  InputNumber,
  TimePicker,
  Upload,
} from "antd";
import axios from "axios";
import {
  BackwardOutlined,
  DeleteOutlined,
  DollarCircleOutlined,
  EditOutlined,
  PlusCircleOutlined,
  UploadOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BsPeople } from "react-icons/bs";
import AddServiceForm from "../components/SalonShop/ServiceForm";
import { ServiceHairServices } from "../services/servicesHairServices";
import { useDispatch, useSelector } from "react-redux";
import { actGetAllServicesBySalonId } from "../store/salonEmployees/action";
import "../css/manageVoucher.css";
import { formatCurrency } from "../components/formatCheckValue/formatCurrency";
import dayjs from "dayjs";
import { isEmptyObject } from "../components/formatCheckValue/checkEmptyObject";

function ListServices() {
  const [form] = Form.useForm();
  const { id } = useParams(); //salonInformationId
  const [open, setOpen] = useState(false);
  const [reset, setReset] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");
  const [servicesList, setServicesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState(null);
  const SERVICES_URL =
    "http://14.225.218.91:8080/api/v1/servicehairs/GetServiceHairBySalonInformationId/";
  // const salonId = "a90133a4-01b5-4202-4df7-08dc858e1932" //Khoa123
  const navigate = useNavigate();

  //update service
  const [updateService, setServiceUpdate] = useState({});
  const [isUpdateModalService, setisUpdateModalService] = useState(false);
  const [currencyValueUpdate, setCurrencyValueUpdate] = useState(null);
  const timeFormat = "HH:mm";
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [serviceTime, setServiceTime] = useState(dayjs("00:00", timeFormat));
  // const [fileList, setFileList] = useState([]);
  const [imageFile, setImageFile] = useState({});

  const [page, setPage] = useState(1);
  const limit = 5;
  const [concatList, setConcatList] = useState([]);
  const [status, setStatus] = useState(false);
  const dispatch = useDispatch();
  // const messageAddSuccess = message.success("Service has been added!!!");

  // useEffect(() => {
  //   axios.get(SERVICES_URL + id).then((res) => {
  //     setServicesList(res.data);
  //     setIsLoading(false);
  //     console.log(res.data, "ServiceList");
  //   });
  // }, [status]);
  const listService = useSelector((state) => state.SALONEMPLOYEES.listService);
  console.log("listData", listService);
  useEffect(() => {
    if (id) {
      dispatch(actGetAllServicesBySalonId(id));
      setIsLoading(false);
    }
  }, [id]);

  const handleUploadChange = ({ imageFile }) => setImageFile(imageFile);

  const onLoadMore = () => {
    const nextPage = page + 1;
    setTimeout(() => {
      axios
        .get(SERVICES_URL + `?page=${nextPage}&limit=${limit}`)
        .then((res) => {
          // const nextData = servicesList.concat(res.data);
          console.log(res, nextPage, limit, "resssss");
          const concatData = [...servicesList, ...res.data.items];
          setServicesList(concatData);
          console.log(concatData);
          setPage(nextPage);
          window.dispatchEvent(new Event("resize"));
        })
        .catch((err) => console.log(err, "error"));
    }, 1000);
  };

  //delete Service
  const handleDelete = (service) => {
    const serviceDeleted = servicesList.find(({ id }) => {
      // { id } constructuring id from serviceList
      console.log(id, "id");
      if (id === service.id) {
        return id;
      }
    });
    ServiceHairServices.deleteServiceHairById(serviceDeleted.id)
      .then((res) => {
        const updatedServiceList = servicesList.filter(
          (emp) => emp.id !== serviceDeleted.id
        );
        setServicesList(updatedServiceList);
        message.success("Service was deleted!");
        console.log(res.status);
      })
      .catch((err) => console.log(err, "errors"));
  };

  //format currency to be
  function roundUpToNearestIncrement(number, increment) {
    const roundedValue = Math.ceil(number / increment) * increment; //Math.ceil làm tròn lên, 1 * increment
    return roundedValue === number
      ? roundedValue
      : Math.ceil(number / increment) * increment;
  }
  const onTimeChange = (time) => {
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
        return rounded15;
      } else if (serviceTimeString + 0.2 === i + 0.5) {
        // < 0.0001
        console.log(`rounded30: ${rounded30}, expected: ${i + 0.5}`);
        setServiceTime(rounded30);
        return rounded30;
      } else if (serviceTimeString + 0.3 === i + 0.75) {
        console.log(`rounded45: ${rounded45}, expected: ${i + 0.75}`);
        setServiceTime(rounded45);
        return rounded45;
      } else if (Number.isInteger(serviceTimeString)) {
        console.log(`rounded00: ${rounded1}, expected: ${i}`);
        setServiceTime(rounded1);
        return rounded1;
      }
    }
  };

  //Config service time to be
  function mapInput(input) {
    if (input === 1) {
      return 1;
    } else {
      return input * 0.6;
    }
  }

  //Convert service time from BE to dayjs
  function convertServiceTimeFromBe(serviceTime) {
    // Extract hours and minutes
    let hours = Math.floor(serviceTime);
    let minutes = Math.round((serviceTime - hours) * 60);

    // Use dayjs to format the time
    let formattedTime = dayjs().hour(hours).minute(minutes);

    return formattedTime;
  }
  //update service
  const handleUpdate = (service) => {
    setServiceUpdate(service);
    setisUpdateModalService(true);
    console.log(service.time, "service time update");
    console.log(
      convertServiceTimeFromBe(service.time),
      "Converted Service Time"
    );
    form.setFieldsValue({
      serviceName: service.serviceName,
      description: service.description,
      price: service.price,
      time: convertServiceTimeFromBe(service.time),
    });

    setCurrencyValueUpdate(service.price);
    setServiceTime(convertServiceTimeFromBe(service.time));
    setImageUrl(service.img); // Set the initial image URL
  };

  //Confirm update service
  const handleUpdateOk = async () => {
    // form
    //   .validateFields()
    //   .then((values) => {
    //     const {
    //       description,
    //       id,
    //       img,
    //       isActive,
    //       price,
    //       salonInformationId,
    //       serviceName,
    //       time,
    //     } = values;
    //     const configDiscountPercentageUpdate = discountPercentageUpdate / 100;
    //     const updatedVoucher = {
    //       ...voucherUpdate,
    //       description: descriptionUpdate,
    //       minimumOrderAmount: minimumOrderAmountUpdate,
    //       discountPercentage: configDiscountPercentageUpdate,
    //       expiryDate: expiryDateUpdate,
    //     };
    //     voucherServices
    //       .updateVoucherById(voucherUpdate?.id, updatedVoucher)
    //       .then((res) => {
    //         console.log(res, "res");
    //         message.success(
    //           `Update voucher ${voucherUpdate.description} sucessfully!`
    //         );
    //       })
    //       .catch((err) => console.log(err, "errors"));
    //     // Call API or perform update operation
    //     console.log("Updated Voucher Data:", updatedVoucher);
    //     setIsUpdateModalVisible(false); // Close modal after update
    //     form.resetFields(); // Reset form fields
    //   })
    //   .catch((error) => {
    //     console.error("Validation Failed:", error);
    //   });

    const serviceName = await form.getFieldValue("serviceName");
    const description = await form.getFieldValue("description");
    const price = await form.getFieldValue("price");
    const time = await form.getFieldValue("time");
    const img = await form.getFieldValue("img");

    const convertedTime = await dayjs(time).format(timeFormat); //HH:mm
    const formServiceUpdate = {
      ...updateService,
      serviceName: serviceName,
      description: description,
      price: price,
      time: time,
    };

    // const imageFile = imageFile.length > 0 ? imageFile[0].originFileObj : null;
    const formDataUpdate = new FormData();
    console.log(form.name);
    console.log("Time", time);
    // const { $H, $m, ...rest } = time;
    // console.log("hour", $H);
    // console.log("minute", $m);
    // const serviceTimeString = parseFloat(`${$H}.${$m}`); //convert string to float number
    // console.log(
    //   "timeString",
    //   roundUpToNearestIncrement(serviceTimeString, 0.5)
    // );

    const formattedTime = await onTimeChange(time);
    console.log(img);
    if (isEmptyObject(imageFile)) {
      await formDataUpdate.append("ServiceName", serviceName);
      await formDataUpdate.append("Description", description);
      await formDataUpdate.append("Price", price);
      await formDataUpdate.append("Time", formattedTime);
      await formDataUpdate.append("IsActive", true);

      await ServiceHairServices.updateServiceHairById(
        updateService.id,
        formDataUpdate
      )
        .then(() => {
          console.log("Thanh cong roi ne hihi");
          message.success(`Bạn đã cập nhật dịch vụ ${serviceName} thành công!`);
          form.resetFields();
          setisUpdateModalService(false);
          dispatch(actGetAllServicesBySalonId(id));
        })
        .catch((err) => {
          console.log(err, "errors");
        });
    } else {
      await formDataUpdate.append("ServiceName", serviceName);
      await formDataUpdate.append("Description", description);
      await formDataUpdate.append("Price", price);
      await formDataUpdate.append("Img", imageFile);
      await formDataUpdate.append("Time", formattedTime);
      await formDataUpdate.append("IsActive", true);

      await ServiceHairServices.updateServiceHairById(
        updateService.id,
        formDataUpdate
      )
        .then(() => {
          console.log("Thanh cong roi ne hihi");
          message.success(`Bạn đã cập nhật dịch vụ ${serviceName} thành công!`);
          form.resetFields();
          setisUpdateModalService(false);
          dispatch(actGetAllServicesBySalonId(id));
        })
        .catch((err) => {
          console.log(err, "errors");
        });
    }
  };

  // useEffect(() => {
  //   const {
  //     description,
  //     id,
  //     img,
  //     isActive,
  //     price,
  //     salonInformationId,
  //     serviceName,
  //     time,
  //   } = serviceUpdate;

  //   if (isUpdateModalService && updateService) {
  //     form.setFieldsValue({
  //       descriptionUpdate: description,
  //       minimumOrderAmountUpdate: minimumOrderAmount,
  //       discountPercentageUpdate: configDiscountPercentage,
  //       expiryDateUpdate: dayjs(expiryDate), // Use moment to format date
  //     });
  //   }
  // }, [isUpdateModalVisible, voucherUpdate]);

  const showAddServiceModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    setModalText("Your service is adding...");
    // message;
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
    console.log(servicesList, "Service List");
  };
  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };
  const handleChange = () => {
    setStatus(true);
  };
  const confirm = (e) => {
    console.log(e);
    message.success("Click on Yes");
  };
  const cancel = (e) => {
    console.log(e);
    message.error("Click on No");
  };
  console.log(servicesList, "Concat");
  const formatTime = (decimalHours) => {
    const hours = Math.floor(decimalHours);

    // Get the decimal part and convert to minutes
    const decimalPart = decimalHours - hours;
    let minutes = 0;

    if (decimalPart >= 0.75) {
      minutes = 45;
    } else if (decimalPart >= 0.5) {
      minutes = 30;
    } else if (decimalPart >= 0.25) {
      minutes = 15;
    }

    let timeString = "";
    if (hours > 0) {
      timeString += `${hours} giờ `;
    }
    if (minutes > 0) {
      timeString += `${minutes} phút`;
    }

    return timeString.trim();
  };
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // const getBase64 = (file, callback) => {
  //   const reader = new FileReader();
  //   reader.addEventListener("load", () => callback(reader.result));
  //   reader.readAsDataURL(file);
  // };

  const getBase64 = (file, callback) => {
    const reader = new FileReader();
    reader.readAsDataURL(file); //mấu chốt ở đây!
    reader.onload = () => callback(reader.result);
    reader.onerror = (error) => console.log("Error: ", error);
  };

  const handleImageChange = (info) => {
    console.log("infor", info);
    setImageFile(info.file);

    getBase64(info.file, (imageUrl) => {
      setImageUrl(imageUrl);
      console.log(imageUrl);
    });
  };

  return (
    <>
      <div
        style={{
          marginTop: "140px",
          marginLeft: "250px",
          marginRight: "250px",
        }}
      >
        <Flex
          className="p-6 bg-green-100 border rounded-xl"
          justify="space-around"
          align="center"
        >
          <Button
            icon={<BackwardOutlined />}
            // type=""
            danger
            onClick={() => navigate(-1)}
          >
            Quay về
          </Button>
          <Typography.Title className="pr-[15rem] pl-[15rem]">
            Danh sách các dịch vụ
          </Typography.Title>
          <Button
            className="addButtonStyle"
            icon={<UserAddOutlined />}
            onClick={showAddServiceModal}
          >
            Thêm dịch vụ
          </Button>
          <Modal
            width={500}
            title="Tạo dịch vụ mới"
            open={open}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
              <Button key="back" onClick={handleCancel}>
                Quay lại
              </Button>,
              <Button type="primary" key="submit" onClick={handleCancel}>
                Hoàn thành
              </Button>,
            ]}
          >
            <AddServiceForm
              status={handleChange}
              isReset={(e) => {
                setReset(e);
              }}
              isOpen={(e) => {
                setOpen(e); //e is False from serviceForm component pass value to ListBarberServices
              }}
              // onAddServices={(service) => {
              //   // const newServiceList = servicesList.concat(service);
              //   const concatNewData = [...servicesList, ...service];
              //   setServicesList(concatNewData);
              //   setConcatList(concatNewData);
              //   console.log("concatList", concatList);
              //   setOpen(false);
              // }}
              salonInformationId={id}
            />
          </Modal>
        </Flex>
        <List
          // loadMore={onLoadMore}
          loading={isLoading}
          itemLayout="horizontal"
          dataSource={listService}
          renderItem={(item) => (
            <>
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Flex
                      gap={item.id < 10 ? "middle" : "small"}
                      justify="cetner"
                      align="center"
                    >
                      {/* <Typography.Text strong>{item?.id}</Typography.Text> */}
                      <Avatar
                        size={{
                          xs: 24,
                          sm: 32,
                          md: 40,
                          lg: 64,
                          xl: 80,
                          xxl: 100,
                        }}
                        src={item?.img}
                      />
                    </Flex>
                  }
                  title={
                    <Typography.Title level={3}>
                      {item?.serviceName}
                    </Typography.Title>
                  }
                  description={
                    <Space size={"large"}>
                      <Typography.Text>{item?.description}</Typography.Text>
                      <Typography.Text>
                        {formatPrice(item?.price)}
                      </Typography.Text>
                      <Typography.Text>
                        {formatTime(item?.time)}
                      </Typography.Text>
                    </Space>
                  }
                />
                {/* <Link to={`/account_details/${item?.id}`}>
                  <Button icon={<EditOutlined />} type="text">
                    Edit
                  </Button>
                </Link> */}
                <Space size={"small"}>
                  <Button
                    onClick={() => handleUpdate(item)}
                    className="editButtonStyle"
                    icon={<EditOutlined />}
                  >
                    Chỉnh sửa
                  </Button>
                  <Popconfirm
                    title="Xóa dịch vụ"
                    description="Bạn có chắc chắn muốn xóa dịch vụ này?"
                    onConfirm={() => handleDelete(item)}
                    onCancel={cancel}
                    okText="Đồng ý"
                    cancelText="Hủy"
                  >
                    <Button
                      className="deleteButtonStyle"
                      icon={<DeleteOutlined />}
                      danger
                    >
                      Xóa
                    </Button>
                  </Popconfirm>
                </Space>
              </List.Item>
              <Modal
                title="Update Service"
                visible={isUpdateModalService}
                onOk={handleUpdateOk}
                onCancel={() => {
                  setisUpdateModalService(!isUpdateModalService);
                  form.resetFields(); // Reset form when closing the Modal
                  setImageUrl(null); // Reset image URL
                }}
              >
                <Form form={form} layout="vertical">
                  <Form.Item name="serviceName" label="Dịch vụ">
                    <Input />
                  </Form.Item>
                  <Form.Item name="description" label="Mô tả">
                    <Input />
                  </Form.Item>
                  <Form.Item label="Giá (VND)" name="price">
                    <InputNumber
                      onChange={(value) => setCurrencyValueUpdate(value)}
                      min={1}
                      type="number"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                  <Flex className="mt-3" gap={"small"}>
                    <DollarCircleOutlined />
                    <Typography.Text strong>
                      Currency: {formatCurrency(currencyValueUpdate)}
                    </Typography.Text>
                  </Flex>
                  <Form.Item
                    initialValue={dayjs("00:15", timeFormat)}
                    name="time"
                    label="Thời lượng (khoảng cách 15 phút)"
                  >
                    <TimePicker
                      onChange={onTimeChange}
                      format={timeFormat}
                      minuteStep={15}
                    />
                  </Form.Item>
                  <Form.Item name="img" label="Ảnh">
                    <Upload
                      listType="picture"
                      beforeUpload={() => false}
                      // fileList={fileList} //fileList thì mới có cái này, vì nó receive array
                      onChange={handleImageChange}
                      showUploadList={false} // Hide default list
                    >
                      <Button icon={<UploadOutlined />}>Tải ảnh</Button>
                    </Upload>
                    {imageUrl && (
                      <Image
                        src={imageUrl}
                        alt="Service Image"
                        style={{ width: "100%", marginTop: "10px" }}
                      />
                    )}
                  </Form.Item>
                </Form>
              </Modal>
            </>
          )}
        />
        <Flex justify="center" align="center">
          {listService && !isLoading && (
            <Button
              icon={<PlusCircleOutlined />}
              hidden={servicesList.length > 0 ? false : true}
              onClick={onLoadMore}
            >
              More
            </Button>
          )}
        </Flex>
      </div>
    </>
  );
}

export default ListServices;
