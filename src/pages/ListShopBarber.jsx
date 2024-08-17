import {
  CaretRightOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  DollarCircleOutlined,
  DownOutlined,
  EditOutlined,
  LineOutlined,
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  Collapse,
  DatePicker,
  Descriptions,
  Dropdown,
  Flex,
  Form,
  Image,
  Input,
  InputNumber,
  Menu,
  Modal,
  Pagination,
  Popconfirm,
  Rate,
  Row,
  Skeleton,
  Space,
  Table,
  Tag,
  TimePicker,
  Typography,
  Upload,
  message,
} from "antd";
import axios from "axios";
import dayjs from "dayjs";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { isEmptyObject } from "../components/formatCheckValue/checkEmptyObject";
import AddEmployeeForm from "../components/SalonShop/EmployeeForm";
import AddServiceForm from "../components/SalonShop/ServiceForm";
import styles from "../css/listShopBarber.module.css";
import { ServiceHairServices } from "../services/servicesHairServices";
import { voucherServices } from "../services/voucherServices";
import { actGetVoucherBySalonId } from "../store/manageVoucher/action";
import {
  actGetAllEmployees,
  actGetAllServicesBySalonId,
} from "../store/salonEmployees/action";
import { actGetSalonInformationByOwnerId } from "../store/salonInformation/action";

const count = 3;

function ListShopBarber(props) {
  dayjs.locale("vi");
  const [form] = Form.useForm();
  const currentDate = dayjs();
  const formattedDate = "DD/MM/YYYY";
  const { Panel } = Collapse;
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [currentPageEmployee, setCurrentPageEmployee] = useState(1);
  const [pageSizeEmployee, setPageSizeEmployee] = useState(4);
  const [currentPageService, setCurrentPageService] = useState(1);
  const [pageSizeService, setPageSizeService] = useState(4);
  const [currentPageVoucher, setCurrentPageVoucher] = useState(1);
  const [pageSizeVoucher, setPageSizeVoucher] = useState(4);
  const [open, setOpen] = useState(false);
  const [openEmployee, setOpenEmployee] = useState(false);
  const [reset, setReset] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [status, setStatus] = useState(false);
  const [currencyValue, setCurrencyValue] = useState(100000);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currencyValueUpdate, setCurrencyValueUpdate] = useState(null);

  // const auth = useAuthUser();
  // const ownerId = auth?.idOwner;
  const idCustomer = useSelector((state) => state.ACCOUNT.idCustomer);
  const ownerId = useSelector((state) => state.ACCOUNT.idOwner);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [openPopoverId, setOpenPopoverId] = useState(null);

  const [filterName, setFilterName] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [isUpdateModalService, setisUpdateModalService] = useState(false);
  const [imageFile, setImageFile] = useState({});
  const [imageUrl, setImageUrl] = useState(null);
  const [updateService, setServiceUpdate] = useState({});

  const [currencyValueVoucherUpdate, setCurrencyValueVoucherUpdate] =
    useState(null);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [voucherUpdate, setVoucherUpdate] = useState({});

  const timeFormat = "HH:mm";
  const [serviceTime, setServiceTime] = useState(dayjs("00:00", timeFormat));

  const salonDetail = useSelector(
    (state) => state.SALONINFORMATION.getSalonByOwnerId
  );
  const listEmployee = useSelector(
    (state) => state.SALONEMPLOYEES.listEmployee
  );
  const totalPagesEmployee = useSelector(
    (state) => state.SALONEMPLOYEES.totalPages
  );
  const listTotalService = useSelector(
    (state) => state.SALONEMPLOYEES.listService
  );
  const totalPagesService = useSelector(
    (state) => state.SALONEMPLOYEES.totalPagesServices
  );
  const voucherList = useSelector(
    (state) => state.SALONVOUCHERS.getVoucherBySalonId
  );
  const totalPagesVoucher = useSelector(
    (state) => state.SALONVOUCHERS.totalPages
  );
  const hidePopover = () => {
    setOpenPopoverId(null);
  };
  useEffect(() => {
    dispatch(actGetSalonInformationByOwnerId(ownerId));
  }, []);

  useEffect(() => {
    if (salonDetail || currentPageEmployee) {
      dispatch(
        actGetAllEmployees(
          salonDetail.id,
          currentPageEmployee,
          pageSizeEmployee
        )
      );
    }
  }, [salonDetail, currentPageEmployee]);

  useEffect(() => {
    if (
      salonDetail &&
      salonDetail.id &&
      currentPageService &&
      pageSizeService
    ) {
      dispatch(
        actGetAllServicesBySalonId(
          salonDetail.id,
          currentPageService,
          pageSizeService
        )
      );
      // setIsLoading(false);
    }
  }, [salonDetail, currentPageService, pageSizeService]);

  useEffect(() => {
    if (
      salonDetail &&
      salonDetail.id &&
      currentPageVoucher &&
      pageSizeVoucher
    ) {
      dispatch(
        actGetVoucherBySalonId(
          currentPageService,
          pageSizeService,
          salonDetail.id
        )
      );
    }
  }, [salonDetail, currentPageVoucher, pageSizeVoucher]);
  useEffect(() => {
    const { description, minimumOrderAmount, discountPercentage, expiryDate } =
      voucherUpdate;

    const configDiscountPercentage = discountPercentage * 100;
    if (isUpdateModalVisible && voucherUpdate) {
      form.setFieldsValue({
        descriptionUpdate: description,
        minimumOrderAmountUpdate: minimumOrderAmount,
        discountPercentageUpdate: configDiscountPercentage,
        expiryDateUpdate: dayjs(expiryDate), // Use moment to format date
      });
    }
  }, [isUpdateModalVisible, voucherUpdate]);

  const handleUpdateVoucher = (values) => {
    setVoucherUpdate(values);
    setIsUpdateModalVisible(!isUpdateModalVisible);
    setCurrencyValueUpdate(values.minimumOrderAmount);
  };

  const handleOpenPopover = (newOpen, id) => {
    setOpenPopoverId(newOpen ? id : null);
  };

  const handleFilter = () => {
    if (!filterName && !filterLocation) {
      setList(data);
      return;
    }

    const filteredList = data.filter(
      (item) =>
        item.name.toLowerCase().includes(filterName.toLowerCase()) &&
        item.address.toLowerCase().includes(filterLocation.toLowerCase())
    );
    setList(filteredList);
  };
  useEffect(() => {
    dispatch(actGetAllServicesBySalonId(salonDetail.id, 1, 4));
  }, []);
  const listService = useSelector(
    (state) => state.SALONEMPLOYEES.salonServicesList
  );

  const checkEmployeeListExist = () => {
    if (listService?.length === 0) {
      navigate(`/list_service/${salonDetail.id}`);
      message.info("Bạn cần phải tạo các dịch vụ trước!!!");
    } else {
      navigate(`/list_barber_employees/${salonDetail.id}`);
    }
  };
  console.log("salonDeaa", salonDetail);

  useEffect(() => {
    if (isEmptyObject(salonDetail)) {
      setTimeout(() => {
        // message.info("Bạn cần phải tạo salon đầu tiên!");
        if (isEmptyObject(salonDetail)) {
          // navigate("/create_shop");
        } else {
          return;
        }
      }, 3000);
    } else if (ownerId) {
      dispatch(actGetSalonInformationByOwnerId(ownerId));
      setInitLoading(false);
    }
  }, [ownerId]);

  useEffect(() => {
    if (salonDetail?.id) dispatch(actGetAllEmployees(salonDetail?.id));
  }, [salonDetail?.id]);

  const handleDeleteEmployee = (employee) => {
    axios
      .put(
        `http://14.225.218.91:8080/api/v1/salonemployees/DeleteSalonEmployee/${employee.id}`
      )
      .then(() => {
        dispatch(actGetAllEmployees(salonDetail.id));
        message.success("Employee was deleted!");
      });
  };

  const convertDayOfWeekToVietnamese = (dayOfWeek) => {
    const daysMapping = {
      Monday: "Thứ Hai",
      Tuesday: "Thứ Ba",
      Wednesday: "Thứ Tư",
      Thursday: "Thứ Năm",
      Friday: "Thứ Sáu",
      Saturday: "Thứ Bảy",
      Sunday: "Chủ Nhật",
    };
    return daysMapping[dayOfWeek] || dayOfWeek;
  };
  function convertServiceTimeFromBe(serviceTime) {
    // Extract hours and minutes
    let hours = Math.floor(serviceTime);
    let minutes = Math.round((serviceTime - hours) * 60);

    // Use dayjs to format the time
    let formattedTime = dayjs().hour(hours).minute(minutes);

    return formattedTime;
  }
  const sortSchedules = (schedules) => {
    const dayOrder = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    return schedules.sort(
      (a, b) => dayOrder.indexOf(a.dayOfWeek) - dayOrder.indexOf(b.dayOfWeek)
    );
  };

  const columnsEmployee = [
    {
      title: "Hình ảnh",
      dataIndex: "img",
      key: "img",
      align: "center",
      render: (text) => <Avatar shape="square" size={"large"} src={text} />,
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      align: "center",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      align: "center",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      align: "center",
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      align: "center",
      render: (isActive) =>
        isActive ? (
          <Tag icon={<CheckCircleOutlined />} color="green">
            Hoạt động
          </Tag>
        ) : (
          <Tag icon={<CloseCircleOutlined />} color="red">
            Không hoạt động
          </Tag>
        ),
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      width: "10rem",
      render: (_, record) => (
        <Space size="middle">
          <Link to={`account_details/${record.id}`}>
            <Button
              className="editButtonStyle"
              onClick={() => {}}
              icon={<EditOutlined />}
            >
              Chỉnh sửa
            </Button>
          </Link>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa nhân viên này không?"
            onConfirm={() => handleDeleteEmployee(record)}
            okText="Có"
            cancelText="Không"
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
      ),
    },
  ];

  // Hàm định dạng phần trăm giảm giá
  const formatDiscount = (value) => {
    const result = value * 100;
    const resultPercent = result + "%";
    return resultPercent;
  };

  // Hàm định dạng thành VND
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const formatDateTime = (dateString) => {
    return moment(dateString).format("DD/MM/YYYY HH:mm:ss");
  };

  const formatTime = (value) => {
    return `${value * 60} phút`;
  };
  const handleDelete = async (voucher) => {
    console.log(voucher.id);
    voucherServices
      .deleteVoucherById(voucher.id)
      .then(async (res) => {
        setStatus(!status);
        await dispatch(
          actGetVoucherBySalonId(
            currentPageVoucher,
            pageSizeVoucher,
            salonDetail?.id
          )
        );
        message.success(`Xóa ${voucher.description} voucher thành công!`);
      })
      .catch((err) => console.log(err, "errors"));
    // Thêm logic xóa voucher ở đây (ví dụ: call API)
  };

  // Cấu hình cột của bảng
  const columnsVoucher = [
    {
      title: "Mã giảm giá",
      dataIndex: "code",
      key: "code",
      align: "center",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      align: "center",
    },
    {
      title: "Số tiền tối thiểu",
      dataIndex: "minimumOrderAmount",
      key: "minimumOrderAmount",
      align: "center",
      render: (value) => formatCurrency(value),
    },
    {
      title: "Phần trăm giảm giá",
      dataIndex: "discountPercentage",
      key: "discountPercentage",
      align: "center",
      render: (value) => formatDiscount(value),
    },
    {
      title: "Ngày hết hạn",
      dataIndex: "expiryDate",
      key: "expiryDate",
      align: "center",
      render: (date) => formatDateTime(date), // Định dạng ngày giờ
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      align: "center",
      render: (date) => formatDateTime(date), // Định dạng ngày giờ
    },
    {
      title: "Ngày sửa đổi",
      dataIndex: "modifiedDate",
      key: "modifiedDate",
      align: "center",
      render: (date) => (date ? formatDateTime(date) : "Chưa sửa đổi"), // Định dạng ngày giờ hoặc hiển thị thông báo nếu chưa sửa đổi
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      align: "center",
      render: (isActive) =>
        isActive ? (
          <Tag icon={<CheckCircleOutlined />} color="green">
            Hoạt động
          </Tag>
        ) : (
          <Tag icon={<CloseCircleOutlined />} color="red">
            Không hoạt động
          </Tag>
        ),
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      width: "10rem",
      // dataSource: { data },
      render: (_, record) => (
        <Space size="middle">
          {record?.isActive ? (
            <Button
              className="editButtonStyle"
              onClick={() => handleUpdateVoucher(record)}
              icon={<EditOutlined />}
            >
              Chỉnh sửa
            </Button>
          ) : (
            <></>
          )}

          <Button
            className="deleteButtonStyle"
            onClick={() => handleDelete(record)}
            icon={<DeleteOutlined />}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const columnsService = [
    {
      title: "Hình ảnh",
      dataIndex: "img",
      key: "img",
      align: "center",
      render: (text) => (
        <Avatar shape="square" size={"large"} src={text} alt="service" />
      ),
    },
    {
      title: "Tên dịch vụ",
      dataIndex: "serviceName",
      key: "serviceName",
      align: "center",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      align: "center",
    },
    {
      title: "Giá",
      dataIndex: "price",
      align: "center",
      key: "price",
      render: (price) => formatCurrency(price),
    },
    {
      title: "Thời gian",
      dataIndex: "time",
      key: "time",
      align: "center",
      render: (time) => formatTime(time),
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      align: "center",
      render: (isActive) =>
        isActive ? (
          <Tag icon={<CheckCircleOutlined />} color="green">
            Hoạt động
          </Tag>
        ) : (
          <Tag icon={<CloseCircleOutlined />} color="red">
            Không hoạt động
          </Tag>
        ),
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      width: "10rem",
      // dataSource: { data },
      render: (_, record) => (
        <Space size={"small"} className="service-actions">
          <Button
            onClick={() => {
              handleUpdate(record);
            }}
            className="editButtonStyle"
            icon={<EditOutlined />}
          >
            Chỉnh sửa
          </Button>
          <Popconfirm
            title="Xóa dịch vụ"
            description="Bạn có chắc chắn muốn xóa dịch vụ này?"
            onConfirm={() => {}}
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
      ),
    },
  ];

  const handleMenuClick1 = (e) => {
    console.log("Clicked on:", e.key);
  };

  const sortMenu = (
    <Menu onClick={handleMenuClick1}>
      <Menu.Item key="name">Sắp xếp theo tên</Menu.Item>
      <Menu.Item key="gender">Sắp xếp theo giới tính</Menu.Item>
    </Menu>
  );

  const filterMenu = (
    <Menu onClick={handleMenuClick1}>
      <Menu.Item key="active">Lọc theo trạng thái hoạt động</Menu.Item>
      <Menu.Item key="gender">Lọc theo giới tính</Menu.Item>
    </Menu>
  );

  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleMenuClick = ({ key }) => {
    if (key === "employeeList") {
      checkEmployeeListExist();
    } else if (key === "serviceList") {
      navigate(`/list_service/${salonDetail.id}`);
    } else if (key === "voucherList") {
      navigate(`/list_voucher/${salonDetail.id}`);
    }
    setDropdownVisible(false);
  };

  const onPageChangeEmployee = (page) => {
    setCurrentPageEmployee(page);
  };

  const onPageChangeService = (page) => {
    setCurrentPageService(page);
  };

  const onPageChangeVoucher = (page) => {
    setCurrentPageVoucher(page);
  };

  const handleOk = () => {
    setModalText("Your service is adding...");
    // message;
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };
  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };
  const handleChange = () => {
    setStatus(true);
  };
  const showAddServiceModal = () => {
    setOpen(true);
  };
  const showModalVoucher = () => {
    setIsModalVisible(true);
  };

  const handleOkVoucher = () => {
    setIsModalVisible(false);
  };

  const handleCancelVoucher = () => {
    setIsModalVisible(false);
  };

  const onFinish = (values) => {
    console.log("Voucher Values", values);
    const { description, minimumOrderAmount, discountPercentage, expiryDate } =
      values;
    const configDiscountPercentage = discountPercentage / 100;

    const configExpiryDate = () => {
      // const newDate = new Date();
      const expiryDate1 = expiryDate.toDate();
      const newExpiryDate = expiryDate1.getDate() + 1;
      expiryDate1.setDate(newExpiryDate);
      return expiryDate1;
    };
    const configCurrentDate = () => {
      const currentDate1 = currentDate.toDate();
      const newCurrentDate = currentDate1.getDate() + 1;
      currentDate1.setDate(newCurrentDate);
      return currentDate1;
    };

    const formVoucherData = {
      salonInformationId: salonDetail.id, //salonInformationId
      description: description,
      minimumOrderAmount: minimumOrderAmount,
      discountPercentage: configDiscountPercentage,
      expiryDate: configExpiryDate(), //convert dayjs to new Date and plus 1 day :v
      createdDate: configCurrentDate(), //config dayjs to new Date and plus 1 day :v
      modifiedDate: null,
      isSystemCreated: false,
      isActive: true,
    };
    voucherServices
      .createNewVoucher(formVoucherData)
      .then((res) => {
        console.log(formVoucherData);
        message.success("Voucher is created!");
        console.log(res.data, "Voucher is created");
        setStatus(!status);
        setIsModalVisible(!isModalVisible);
      })
      .catch((err) => console.log(err, "errors"));

    form.resetFields();
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="employeeList">Danh sách nhân viên</Menu.Item>
      <Menu.Item key="serviceList">Danh sách dịch vụ</Menu.Item>
      <Menu.Item key="voucherList">Danh sách các voucher</Menu.Item>
    </Menu>
  );

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
  const handleUpdateOk = async () => {
    const serviceName = await form.getFieldValue("serviceName");
    const description = await form.getFieldValue("description");
    const price = await form.getFieldValue("price");
    const time = await form.getFieldValue("time");
    const formDataUpdate = new FormData();

    const formattedTime = await onTimeChange(time);
    if (isEmptyObject(imageFile)) {
      await formDataUpdate.append("ServiceName", serviceName);
      await formDataUpdate.append("Description", description);
      await formDataUpdate.append("Price", price);
      await formDataUpdate.append("Time", formattedTime);
      await formDataUpdate.append("IsActive", true);

      await ServiceHairServices.updateServiceHairById(
        updateService?.id,
        formDataUpdate
      )
        .then(() => {
          message.success(`Bạn đã cập nhật dịch vụ ${serviceName} thành công!`);
          form.resetFields();
          setisUpdateModalService(false);
          dispatch(actGetAllServicesBySalonId(salonDetail.id, 1, 4));
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
          message.success(`Bạn đã cập nhật dịch vụ ${serviceName} thành công!`);
          form.resetFields();
          setisUpdateModalService(false);
          dispatch(actGetAllServicesBySalonId(salonDetail.id, 1, 4));
        })
        .catch((err) => {
          console.log(err, "errors");
        });
    }
  };
  function roundUpToNearestIncrement(number, increment) {
    const roundedValue = Math.ceil(number / increment) * increment; //Math.ceil làm tròn lên, 1 * increment
    return roundedValue === number
      ? roundedValue
      : Math.ceil(number / increment) * increment;
  }
  const onTimeChange = (time) => {
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
  const handleImageChange = (info) => {
    console.log("infor", info);
    setImageFile(info.file);

    getBase64(info.file, (imageUrl) => {
      setImageUrl(imageUrl);
    });
  };
  const handleCheckAddEmployee = () => {
    if (listTotalService.length === 0) {
      message.info("Vui lòng thêm dịch vụ trước!!!");
    } else {
      setOpenEmployee(true);
    }
  };
  const handleUpdateVoucherOk = () => {
    form
      .validateFields()
      .then((values) => {
        const {
          descriptionUpdate,
          minimumOrderAmountUpdate,
          discountPercentageUpdate,
          expiryDateUpdate,
        } = values;
        const configDiscountPercentageUpdate = discountPercentageUpdate / 100;
        const updatedVoucher = {
          ...voucherUpdate,
          description: descriptionUpdate,
          minimumOrderAmount: minimumOrderAmountUpdate,
          discountPercentage: configDiscountPercentageUpdate,
          expiryDate: expiryDateUpdate,
        };

        voucherServices
          .updateVoucherById(voucherUpdate?.id, updatedVoucher)
          .then((res) => {
            console.log(res, "res");
            message.success(
              `Cập  nhật voucher ${voucherUpdate.description} thành công!`
            );
          })
          .catch((err) => console.log(err, "errors"));

        // Call API or perform update operation
        // console.log("Updated Voucher Data:", updatedVoucher);
        setIsUpdateModalVisible(false); // Close modal after update
        form.resetFields(); // Reset form fields
      })
      .catch((error) => {
        console.error("Validation Failed:", error);
      });
  };

  return (
    <div>
      <div className={styles["container_list"]}>
        {!isEmptyObject(salonDetail) ? (
          <>
            <Card
              title="Thông tin Salon"
              className={styles["responsive-card"]}
              style={{ width: "100%", height: "100%", margin: "20px auto" }}
            >
              <Row
                gutter={16}
                className={styles["responsive-row"]}
                style={{ display: "flex" }}
              >
                {/* <Col span={8} xs={24} className="responsive-col">
                  <Image size={300} src={salonDetail.img} />
                </Col> */}
                <Col span={18} xs={24} className="responsive-col1">
                  <Descriptions
                    title={
                      <div className={styles["salon-title-container"]}>
                        {/* <Flex className="bg-blue-600 p-3 w-max border border-red-300 rounded-md cursor-pointer salon-title">
                          <Typography.Title
                            style={{ color: "rgb(241 245 249)" }}
                            level={3}
                            onClick={() => {
                              navigate(`/create_shop/${salonDetail?.id}`);
                            }}
                          >
                            {salonDetail.name}
                          </Typography.Title>
                        </Flex> */}
                        <div>
                          <img
                            src={salonDetail.img}
                            alt="img"
                            style={{
                              width: "100%",
                              height: "100%",
                              maxWidth: "15rem",
                              maxHeight: "15rem",
                              objectFit: "cover",
                              borderRadius: "2rem",
                            }}
                            onClick={() => {
                              navigate("/list_salon_ver2?servicesName=Gội đầu");
                            }}
                          />
                        </div>
                        <div
                          style={{ padding: "1rem" }}
                          className={styles["salon-title-cover"]}
                        >
                          <div className={styles["salon-title"]}>
                            {salonDetail.name}
                          </div>
                          <Button
                            type="primary"
                            onClick={() => {
                              navigate(`/create_shop/${salonDetail?.id}`);
                            }}
                          >
                            Chỉnh sửa thông tin
                          </Button>
                        </div>

                        {/* <Flex
                          gap={"middle"}
                          align="base-line"
                          className="dropdown-btns"
                        >
                          <Button
                            type="primary"
                            onClick={() => checkEmployeeListExist()}
                          >
                            Danh sách nhân viên
                          </Button>
                          <Button
                            type="primary"
                            onClick={() =>
                              navigate(`/list_service/${salonDetail.id}`)
                            }
                          >
                            Danh sách dịch vụ
                          </Button>
                          <Button
                            type="primary"
                            onClick={() =>
                              navigate(`/list_voucher/${salonDetail.id}`)
                            }
                          >
                            Danh sách các voucher
                          </Button>
                        </Flex> */}
                        {/* <Dropdown
                          overlay={menu}
                          trigger={["click"]}
                          visible={dropdownVisible}
                          onVisibleChange={(flag) => setDropdownVisible(flag)}
                        >
                          <MenuOutlined
                            className="dropdown-icon"
                            style={{ fontSize: "24px" }}
                          />
                        </Dropdown> */}
                      </div>
                    }
                    bordered
                    className={styles["responsive-descriptions"]}
                  >
                    <Descriptions.Item span={1} label="Địa chỉ">
                      {salonDetail.address}
                    </Descriptions.Item>
                    <Descriptions.Item span={2} label="Chủ Salon">
                      {salonDetail?.salonOwner?.fullName}
                    </Descriptions.Item>
                    <Descriptions.Item span={1} label="Mô tả">
                      {salonDetail.description}
                    </Descriptions.Item>

                    <Descriptions.Item
                      contentStyle={{
                        textAlign: "center",
                        // justifyContent: "space-between",
                        // alignContent: "center",
                      }}
                      span={2}
                      className={
                        salonDetail.status !== "REJECTED" &&
                        salonDetail.status !== "DISABLED" &&
                        salonDetail.status !== "CREATING"
                          ? "bg-green-300 border-dotted border-2 text-slate-100 font-bold"
                          : "bg-red-300 border-dotted border-2 text-slate-100 font-bold"
                      }
                      label="Trạng thái"
                    >
                      {salonDetail.status}
                    </Descriptions.Item>
                    <Descriptions.Item label="Đánh giá">
                      <Rate disabled defaultValue={salonDetail?.rate} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Tổng đánh giá">
                      {salonDetail?.totalRating}
                    </Descriptions.Item>
                    <Descriptions.Item label="Số đánh giá">
                      {salonDetail?.totalReviewer}
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
              </Row>
              <Row gutter={16} style={{ marginTop: "20px" }}>
                <Col span={24}>
                  <Descriptions title="Lịch trình" bordered>
                    {salonDetail?.schedules &&
                      sortSchedules(salonDetail?.schedules).map(
                        (schedule, index) => (
                          <Descriptions.Item
                            key={index}
                            label={convertDayOfWeekToVietnamese(
                              schedule.dayOfWeek
                            )}
                          >
                            {schedule.startTime === "00:00:00" &&
                            schedule.endTime === "00:00:00" ? (
                              <Typography.Text strong style={{ color: "red" }}>
                                Không hoạt động
                              </Typography.Text>
                            ) : (
                              <Space size={10}>
                                <Typography.Text
                                  strong
                                  className={styles["small-text"]}
                                >
                                  {schedule.startTime.slice(0, 5)} AM
                                </Typography.Text>
                                <LineOutlined />
                                <Typography.Text
                                  strong
                                  className={styles["small-text"]}
                                >
                                  {schedule.endTime.slice(0, 5)} PM
                                </Typography.Text>
                              </Space>
                            )}
                          </Descriptions.Item>
                        )
                      )}
                  </Descriptions>
                </Col>
              </Row>
              <Row gutter={16} style={{ marginTop: "20px" }}>
                <Col span={24}>
                  <Collapse
                    defaultActiveKey={["1"]}
                    expandIcon={({ isActive }) => (
                      <CaretRightOutlined rotate={isActive ? 90 : 0} />
                    )}
                    ghost
                    expandIconPosition={"end"}
                  >
                    <Panel
                      header={
                        <div className={styles["custom-header"]}>Nhân viên</div>
                      }
                      key="1"
                      className={styles["title-table-collapse"]}
                    >
                      <div className={styles["table-fillter"]}>
                        <Button
                          className={styles["table-fillter-item"]}
                          type="primary"
                          icon={<PlusOutlined />}
                          // onClick={() => setOpenEmployee(true)}
                          onClick={handleCheckAddEmployee}
                        >
                          Thêm nhân viên
                        </Button>
                        <Dropdown
                          overlay={sortMenu}
                          className={styles["table-fillter-item"]}
                        >
                          <Button>
                            Sắp xếp <DownOutlined />
                          </Button>
                        </Dropdown>

                        <Dropdown
                          overlay={filterMenu}
                          className={styles["table-fillter-item"]}
                        >
                          <Button>
                            Lọc <DownOutlined />
                          </Button>
                        </Dropdown>
                        <Input
                          placeholder="Tìm kiếm nhân viên"
                          className={styles["table-fillter-item"]}
                          style={{ maxWidth: "20rem" }}
                          suffix={
                            <SearchOutlined style={{ cursor: "pointer" }} />
                          }
                          onPressEnter={() => {}} // Trigger search on Enter key press
                        />
                      </div>
                      <div className={styles["table-container"]}>
                        <Table
                          dataSource={listEmployee}
                          columns={columnsEmployee}
                          pagination={false}
                          rowKey="phone"
                        />
                      </div>

                      <Pagination
                        current={currentPageEmployee}
                        pageSize={pageSizeEmployee}
                        total={totalPagesEmployee}
                        onChange={onPageChangeEmployee}
                        style={{ marginTop: "20px", textAlign: "center" }}
                      />
                    </Panel>
                  </Collapse>
                </Col>
              </Row>
              <Row gutter={16} style={{ marginTop: "20px" }}>
                <Col span={24}>
                  <Collapse
                    defaultActiveKey={["1"]}
                    expandIcon={({ isActive }) => (
                      <CaretRightOutlined rotate={isActive ? 90 : 0} />
                    )}
                    ghost
                    expandIconPosition={"end"}
                  >
                    <Panel
                      header={
                        <div className={styles["custom-header"]}>Dịch vụ</div>
                      }
                      key="1"
                      className={styles["title-table-collapse"]}
                    >
                      <div className={styles["table-fillter"]}>
                        <Button
                          className={styles["table-fillter-item"]}
                          type="primary"
                          icon={<PlusOutlined />}
                          onClick={showAddServiceModal}
                        >
                          Thêm dịch vụ
                        </Button>
                        <Dropdown
                          overlay={sortMenu}
                          className={styles["table-fillter-item"]}
                        >
                          <Button>
                            Sắp xếp <DownOutlined />
                          </Button>
                        </Dropdown>

                        <Dropdown
                          overlay={filterMenu}
                          className={styles["table-fillter-item"]}
                        >
                          <Button>
                            Lọc <DownOutlined />
                          </Button>
                        </Dropdown>
                        <Input
                          placeholder="Tìm kiếm nhân viên"
                          className={styles["table-fillter-item"]}
                          style={{ maxWidth: "20rem" }}
                          suffix={
                            <SearchOutlined style={{ cursor: "pointer" }} />
                          }
                          onPressEnter={() => {}} // Trigger search on Enter key press
                        />
                      </div>
                      <div className={styles["table-container"]}>
                        <Table
                          dataSource={listTotalService}
                          columns={columnsService}
                          pagination={false}
                          rowKey="phone"
                        />
                      </div>

                      <Pagination
                        current={currentPageService}
                        pageSize={pageSizeService}
                        total={totalPagesService}
                        onChange={onPageChangeService}
                        style={{ marginTop: "20px", textAlign: "center" }}
                      />
                    </Panel>
                  </Collapse>
                </Col>
              </Row>
              <Row gutter={16} style={{ marginTop: "20px" }}>
                <Col span={24}>
                  <Collapse
                    defaultActiveKey={["1"]}
                    expandIcon={({ isActive }) => (
                      <CaretRightOutlined rotate={isActive ? 90 : 0} />
                    )}
                    ghost
                    expandIconPosition={"end"}
                  >
                    <Panel
                      header={
                        <div className={styles["custom-header"]}>Voucher</div>
                      }
                      key="1"
                      className={styles["title-table-collapse"]}
                    >
                      <div className={styles["table-fillter"]}>
                        <Button
                          className={styles["table-fillter-item"]}
                          type="primary"
                          icon={<PlusOutlined />}
                          onClick={showModalVoucher}
                        >
                          Thêm Voucher
                        </Button>
                        <Dropdown
                          overlay={sortMenu}
                          className={styles["table-fillter-item"]}
                        >
                          <Button>
                            Sắp xếp <DownOutlined />
                          </Button>
                        </Dropdown>

                        <Dropdown
                          overlay={filterMenu}
                          className={styles["table-fillter-item"]}
                        >
                          <Button>
                            Lọc <DownOutlined />
                          </Button>
                        </Dropdown>
                        <Input
                          placeholder="Tìm kiếm nhân viên"
                          className={styles["table-fillter-item"]}
                          style={{ maxWidth: "20rem" }}
                          suffix={
                            <SearchOutlined style={{ cursor: "pointer" }} />
                          }
                          onPressEnter={() => {}} // Trigger search on Enter key press
                        />
                      </div>
                      <div className={styles["table-container"]}>
                        <Table
                          dataSource={voucherList}
                          columns={columnsVoucher}
                          rowKey="code"
                          pagination={false} // Nếu bạn muốn thêm phân trang, có thể cấu hình tại đây
                        />
                      </div>

                      <Pagination
                        current={currentPageVoucher}
                        pageSize={pageSizeVoucher}
                        total={totalPagesVoucher}
                        onChange={onPageChangeVoucher}
                        style={{ marginTop: "20px", textAlign: "center" }}
                      />
                    </Panel>
                  </Collapse>
                </Col>
              </Row>
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
                  salonInformationId={salonDetail.id}
                />
              </Modal>
              <Modal
                title="Thêm voucher"
                visible={isModalVisible}
                onOk={handleOkVoucher}
                onCancel={handleCancelVoucher}
                width={"40rem"}
                footer={[
                  <Button key="back" onClick={handleCancelVoucher}>
                    Quay lại
                  </Button>,
                  <Button
                    type="primary"
                    key="submit"
                    onClick={handleCancelVoucher}
                  >
                    Hoàn tất
                  </Button>,
                ]}
              >
                <Form form={form} onFinish={onFinish} layout="vertical">
                  <Form.Item
                    label="Mô tả"
                    name="description"
                    //   rules={[
                    //     { required: true, message: "Please input the description!" },
                    //   ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Giá thấp nhất"
                    name="minimumOrderAmount"
                    initialValue={100000}
                    rules={[
                      {
                        required: true,
                        message: "Please input the minimum order amount!",
                      },
                    ]}
                  >
                    <InputNumber
                      onChange={(value) => setCurrencyValue(value)}
                      min={1}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                  <Flex className="mt-3" gap={"small"}>
                    {<DollarCircleOutlined />}
                    <Typography.Text strong>
                      Giá: {formatCurrency(currencyValue)}
                    </Typography.Text>
                  </Flex>

                  <Form.Item
                    label="Giảm (%)"
                    name="discountPercentage"
                    tooltip={"Your discount can from 1% to 100%"}
                    rules={[
                      {
                        required: true,
                        message: "Please input the discount percentage!",
                      },
                    ]}
                  >
                    <InputNumber
                      min={1}
                      max={100}
                      // formatter={(value) => `${value}`}
                      // parser={(value) => value.replace("%", "")}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Ngày hết hạn"
                    name="expiryDate"
                    tooltip="Ngày/Tháng/Năm"
                    // initialValue={currentDate}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn ngày hết hạn!",
                      },
                    ]}
                  >
                    <DatePicker
                      style={{ width: "100%" }}
                      // defaultValue={dayjs()} //if set defaultValue here, formItem does not receive data from initial //~~~~~~~~~~~~~~~~~~~~ Caution ~~~~~~~~~~~~~~~~~~~~ DatePicker or TimePicker receive Date Object, do not pass String value
                      format={formattedDate}
                      disabledDate={(current) => {
                        return current && current < dayjs().startOf("day");
                      }}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      style={{ width: "100%" }}
                      type="primary"
                      htmlType="submit"
                    >
                      Tạo voucher
                    </Button>
                  </Form.Item>
                </Form>
              </Modal>

              <Modal
                title="Cập nhật Voucher"
                visible={isUpdateModalVisible}
                onOk={handleUpdateVoucherOk}
                onCancel={() => {
                  setIsUpdateModalVisible(!isUpdateModalVisible);
                  form.resetFields(); // Reset form khi đóng Modal
                }}
              >
                <Form form={form} layout="vertical">
                  <Form.Item name="descriptionUpdate" label="Description">
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Minimum Order Amount"
                    name="minimumOrderAmountUpdate"
                  >
                    <InputNumber
                      onChange={(value) => setCurrencyValueVoucherUpdate(value)}
                      min={1}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                  <div
                    className="mt-3"
                    style={{ display: "flex", gap: "small" }}
                  >
                    <DollarCircleOutlined />
                    <Typography.Text strong>
                      Currency: {formatCurrency(currencyValueVoucherUpdate)}
                    </Typography.Text>
                  </div>
                  <Form.Item
                    label="Discount Percentage (%)"
                    name="discountPercentageUpdate"
                  >
                    <InputNumber
                      min={1}
                      max={100}
                      formatter={(value) => `${value}`}
                      parser={(value) => value.replace("%", "")}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                  <Form.Item label="Expiry Date" name="expiryDateUpdate">
                    <DatePicker
                      style={{ width: "100%" }}
                      format="YYYY-MM-DD"
                      disabledDate={(current) => {
                        return current && current < dayjs().startOf("day");
                      }}
                    />
                  </Form.Item>
                </Form>
              </Modal>

              <Modal
                width={800}
                title="Tạo nhân viên mới"
                open={openEmployee}
                onOk={() => setOpenEmployee(false)}
                onCancel={() => setOpenEmployee(false)}
                footer={null}
              >
                <AddEmployeeForm
                  salonInformation={salonDetail}
                  isOpen={(e) => setOpenEmployee(!e)}
                />
              </Modal>
              <Modal
                title="Cập nhật dịch vụ"
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
            </Card>
          </>
        ) : (
          <Skeleton
            avatar
            paragraph={{
              rows: 4,
            }}
          />
        )}
      </div>
    </div>
  );
}

export default ListShopBarber;
