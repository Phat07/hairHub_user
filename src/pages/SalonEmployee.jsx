import {
  CaretRightOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownOutlined,
  LineOutlined,
  SearchOutlined,
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
  Form,
  Input,
  Menu,
  message,
  Modal,
  Pagination,
  Rate,
  Row,
  Skeleton,
  Space,
  Spin,
  Table,
  Tag,
  TimePicker,
  Typography,
} from "antd";
import classNames from "classnames";
import dayjs from "dayjs";
import moment from "moment";
import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { useDispatch, useSelector } from "react-redux";
import { isEmptyObject } from "../components/formatCheckValue/checkEmptyObject";
import stylesCard from "../css/customerAppointment.module.css";
import styles from "../css/listShopBarber.module.css";
import "../css/scheduleToday.css";
import {
  actDeleteBusySchedule,
  actGetBusyScheduleEmployee,
  actGetSalonByEmployeeId,
  actGetScheduleByEmployeeId,
  actGetScheduleTodayByEmployeeId,
  actGetServiceHairByEmployeeId,
  actPostSchedule,
  actUpdateBusySchedule,
} from "../store/employee/action";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { employeeService } from "@/services/employeeService";
const { RangePicker } = TimePicker;

const localizer = momentLocalizer(moment);

function SalonEmployee(props) {
  dayjs.locale("vi");
  const currentDate = dayjs();
  const formattedDate = "DD/MM/YYYY";
  const { Panel } = Collapse;
  const [initLoading, setInitLoading] = useState(true);
  const [currentPageService, setCurrentPageService] = useState(1);
  const [pageSizeService, setPageSizeService] = useState(4);
  const [loading, setLoading] = useState(false);
  // const auth = useAuthUser();
  // const ownerId = auth?.idOwner;
  const idEmployee = useSelector((state) => state.ACCOUNT.idEmployee);
  const idCustomer = useSelector((state) => state.ACCOUNT.idCustomer);
  const idOwner = useSelector((state) => state.ACCOUNT.idOwner);
  const dispatch = useDispatch();
  const salonDetailEmployee = useSelector(
    (state) => state.EMPLOYEE.getSalonByEmployeeId
  );
  const listServiceEmployee = useSelector(
    (state) => state.EMPLOYEE.getServiceHairByEmployeeId
  );
  const listScheduleEmployee = useSelector(
    (state) => state.EMPLOYEE.getScheduleByEmployeeId
  );
  const scheduleEmployeeToday = useSelector(
    (state) => state.EMPLOYEE.getScheduleTodayByEmployeeId
  );
  const scheduleEmployeeBusy = useSelector(
    (state) => state.EMPLOYEE.getBusyScheduleEmployee
  );
  //logic fillter
  const [searchService, setSearchService] = useState("");
  const [searchServiceKey, setSearchServiceKey] = useState("");
  const [SortService, setSortService] = useState(null);
  const [FillterService, setFillterService] = useState("");
  const [sortLabelService, setSortLabelService] = useState("Sắp xếp");
  const [filterLabelService, setFilterLabelService] = useState("Lọc");

  // const disabledRangePickerTimes = () => {
  //   const now = dayjs();
  //   const currentHour = now.hour();
  //   const currentMinute = now.minute();

  //   return {
  //     disabledHours: () => {
  //       // Chặn các giờ trước giờ hiện tại
  //       return Array.from({ length: currentHour }, (_, i) => i);
  //     },
  //     disabledMinutes: (selectedHour) => {
  //       // Nếu chọn giờ hiện tại, chặn các phút trước phút hiện tại
  //       if (selectedHour === currentHour) {
  //         return Array.from({ length: currentMinute }, (_, i) => i);
  //       }
  //       return [];
  //     },
  //   };
  // };
  const startTime = dayjs(scheduleEmployeeToday?.startTime, "HH:mm");
  const endTime = dayjs(scheduleEmployeeToday?.endTime, "HH:mm");
  const disabledRangePickerTimes = () => {
    const startTime = dayjs(scheduleEmployeeToday.startTime, "HH:mm");
    const endTime = dayjs(scheduleEmployeeToday.endTime, "HH:mm");

    return {
      disabledHours: () => {
        const hours = [];
        for (let i = 0; i < 24; i++) {
          if (
            dayjs().hour(i).isBefore(startTime) ||
            dayjs().hour(i).isAfter(endTime)
          ) {
            hours.push(i);
          }
        }
        return hours;
      },
      disabledMinutes: (selectedHour) => {
        const allowedMinutes = [0, 15, 30, 45]; // Các phút được phép
        const minutes = [];

        for (let i = 0; i < 60; i++) {
          if (!allowedMinutes.includes(i)) {
            minutes.push(i);
          }
        }

        if (selectedHour === startTime.hour()) {
          for (let i = 0; i < startTime.minute(); i++) {
            if (!allowedMinutes.includes(i)) {
              minutes.push(i);
            }
          }
        }

        if (selectedHour === endTime.hour()) {
          for (let i = endTime.minute() + 1; i < 60; i++) {
            if (!allowedMinutes.includes(i)) {
              minutes.push(i);
            }
          }
        }

        return minutes;
      },
    };
  };

  const events = [
    {
      startTime: "2024-12-09T09:00:00",
      endTime: "2024-12-09T10:00:00",
      title: "bận việc",
      isBusySchedule: true,
      idAppointment: null,
    },
    {
      startTime: "2024-12-09T18:30:00",
      endTime: "2024-12-09T18:30:00",
      title: "Lịch hẹn với khách hàng Nhat Linh",
      isBusySchedule: false,
      idAppointment: "40877986-feb-4cc5-bcc2-3663130121a9",
    },
    {
      startTime: "2024-12-09T12:30:00",
      endTime: "2024-12-09T13:00:00",
      title: "Lich hen với khách hàng Cao Kha",
      isBusySchedule: false,
      idAppointment: null,
    },
  ];

  const parsedEvents = scheduleEmployeeBusy?.map((event) => {
    const startDate = new Date(event.startTime);
    const endDate = new Date(event.endTime);

    return {
      ...event,
      start: startDate,
      end: endDate,
    };
  });

  const [isModalDetailBusyVisible, setIsModalDetailBusyVisible] =
    useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  console.log("selectedEvent", selectedEvent);

  const [formUpdateBusy] = Form.useForm();
  const navigate = useNavigate();
  const handleSelectEvent = (event) => {
    if (event.isBusySchedule) {
      formUpdateBusy.resetFields();
      // Nếu isBusySchedule là true, hiển thị modal
      setSelectedEvent(event);
      setIsModalDetailBusyVisible(true);
      formUpdateBusy.setFieldsValue({
        note: event.title || "",
        timeRange: [dayjs(event.start), dayjs(event.end)],
      });
    } else {
      // Nếu isBusySchedule là false, điều hướng theo logic
      if (idEmployee) {
        navigate(`/employee_appointment?appointmentId=${event.idAppointment}`);
      } else if (idCustomer) {
        navigate(`/customer_appointment?appointmentId=${event.idAppointment}`);
      } else if (idOwner) {
        navigate(`/salon_appointment?appointmentId=${event.idAppointment}`);
      }
    }
  };

  const handleCancelBusyModal = () => {
    setIsModalDetailBusyVisible(false);
    formUpdateBusy.resetFields();
  };

  const Event = ({ event }) => {
    const eventStyle = {
      backgroundColor: event.isBusySchedule ? "#4caf50" : "#f44336",
      color: "white",
      borderRadius: "4px",
      padding: "10px",
      display: "flex",
      alignItems: "center",
      height: "100%",
    };

    return <div style={eventStyle}>{event.title}</div>;
  };

  const handleMenuClickServiceSort = (e) => {
    setCurrentPageService(1);
    setSortService(e.key);
    setSortLabelService(e.key === "" ? "Tất cả" : `Sắp xếp theo ${e.key}`);
  };

  const handleMenuClickServiceFillter = (e) => {
    setCurrentPageService(1);
    setFillterService(e.key);
    setFilterLabelService(
      e.key === ""
        ? "Tất cả"
        : e.key === "true"
        ? "Lọc theo trạng thái đang hoạt động"
        : "Lọc theo trạng thái không hoạt động"
    );
  };

  const sortMenuService = (
    <Menu onClick={handleMenuClickServiceSort}>
      <Menu.Item key="">Tất cả</Menu.Item>
      <Menu.Item key="giá tăng dần">Sắp xếp theo theo giá tăng dần</Menu.Item>
      <Menu.Item key="giá giảm dần">Sắp xếp theo theo giá giảm dần</Menu.Item>
      <Menu.Item key="thời gian tăng dần">
        Sắp xếp theo theo thời gian tăng dần
      </Menu.Item>
      <Menu.Item key="thời gian giảm dần">
        Sắp xếp theo theo thời gian giảm dần
      </Menu.Item>
    </Menu>
  );
  const filterMenuService = (
    <Menu onClick={handleMenuClickServiceFillter}>
      <Menu.Item key="">Tất cả</Menu.Item>
      <Menu.Item key="true">Lọc theo trạng thái đang hoạt động</Menu.Item>
      <Menu.Item key="false">Lọc theo trạng thái không hoạt động</Menu.Item>
    </Menu>
  );

  const handleSearchService = () => {
    setCurrentPageService(1);
    setSearchServiceKey(searchService);
  };

  useEffect(() => {
    if (idEmployee) {
      dispatch(actGetSalonByEmployeeId(idEmployee));
    }
  }, [idEmployee]);
  useEffect(() => {
    if (idEmployee) {
      dispatch(actGetScheduleByEmployeeId(idEmployee));
    }
  }, [idEmployee]);
  useEffect(() => {
    if (idEmployee) {
      dispatch(actGetScheduleTodayByEmployeeId(idEmployee, message));
    }
  }, [idEmployee]);

  useEffect(() => {
    if (idEmployee && currentPageService && pageSizeService) {
      setLoading(true);
      dispatch(
        actGetServiceHairByEmployeeId(
          idEmployee,
          currentPageService,
          pageSizeService,
          searchServiceKey,
          FillterService,
          SortService
        )
      )
        .then((res) => {
          setLoading(false);
        })
        .catch((res) => {
          setLoading(false);
        })
        .finally((res) => {
          setLoading(false);
        });
      // setIsLoading(false);
    }
  }, [
    idEmployee,
    currentPageService,
    pageSizeService,
    searchServiceKey,
    FillterService,
    SortService,
  ]);

  useEffect(() => {
    const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");

    if (idEmployee) {
      dispatch(actGetBusyScheduleEmployee(idEmployee, currentDate));
    }
  }, [idEmployee]);

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

  // Hàm định dạng thành VND
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };
  const formatTime = (value) => {
    return `${value * 60} phút`;
  };
  const columnsService = [
    {
      title: "Hình ảnh",
      dataIndex: "img",
      key: "img",
      align: "center",
      render: (text) => (
        <Avatar shape="square" size={72} src={text} alt="service" />
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
  ];

  const onPageChangeService = (page) => {
    setCurrentPageService(page);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form] = Form.useForm();

  const handleAddBusySchedule = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    const currentDate = dayjs().format("YYYY-MM-DD HH:mm:ss");
    setLoading(true);
    form
      .validateFields()
      .then((values) => {
        // Bật trạng thái loading
        const [startTime, endTime] = values.timeRange || [];
        if (startTime.isBefore(currentDate)) {
          message.warning(
            "Thời gian bắt đầu không được nhỏ hơn thời gian hiện tại!"
          );
          setLoading(false); // Tắt trạng thái loading
          return; // Ngừng thực hiện nếu kiểm tra không thỏa mãn
        }
        const data = {
          startDate: startTime.local().add(7, "hour").toISOString(), // Cộng thêm 7 giờ vào thời gian bắt đầu
          endDate: endTime.local().add(7, "hour").toISOString(), // Cộng thêm 7 giờ vào thời gian kết thúc
          note: values.note,
        };
        // dispatch(actPostSchedule(data, idEmployee))
        employeeService
          .PostBusySchedule(data, idEmployee)
          .then((res) => {
            console.log("API Response:", res);
            message.success("Lịch bận đã được thêm!");
            dispatch(actGetBusyScheduleEmployee(idEmployee, currentDate));
            form.resetFields();
            setIsModalOpen(false);
          })
          .catch((err) => {
            console.error("API Error:", err);
            message.error("Thêm lịch bận thất bại!");
          })
          .finally(() => {
            setLoading(false); // Tắt trạng thái loading
          });
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  const handleDeleteBusy = () => {
    const currentTime = new Date(); // Lấy thời gian hiện tại
    const { timeRange } = formUpdateBusy.getFieldsValue(); // Lấy khoảng thời gian từ form

    if (timeRange && timeRange[1] && timeRange[1].toDate() < currentTime) {
      message.warning("Không thể xóa lịch bận đã qua thời gian hiện tại!");
      return;
    }

    // Thực hiện xóa lịch bận nếu chưa qua thời gian hiện tại
    Modal.confirm({
      title: "Xác nhận xóa lịch bận",
      content: "Bạn có chắc chắn muốn xóa lịch bận này không?",
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          setLoading(true);
          // dispatch(actDeleteBusySchedule(selectedEvent?.id))
          employeeService
            .DeleteBusySchedule(selectedEvent?.id)
            .then((res) => {
              console.log("API Response:", res);
              message.success("Xóa lịch bận thành công!");
              dispatch(actGetBusyScheduleEmployee(idEmployee, currentDate));
              form.resetFields();
              setIsModalDetailBusyVisible(false);
            })
            .catch((err) => {
              console.error("API Error:", err);
              message.error("Xóa lịch bận thất bại!");
            })
            .finally(() => {
              setLoading(false); // Tắt trạng thái loading
            });
          setLoading(false);
        } catch (error) {
          message.error("Đã xảy ra lỗi khi xóa lịch bận!");
          setLoading(false);
        }
      },
    });
  };

  const handleUpdateBusy = async () => {
    setLoading(true);
    const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
    const currentTime = new Date(); // Lấy thời gian hiện tại
    const { timeRange, note } = formUpdateBusy.getFieldsValue(); // Lấy khoảng thời gian từ form

    if (
      dayjs(selectedEvent.start).isBefore(currentDate) &&
      dayjs(selectedEvent.end).isBefore(currentDate)
    ) {
      // Nếu thời gian kết thúc đã qua
      message.warning("Không thể cập nhật lịch bận đã qua thời gian hiện tại!");
      setLoading(false);
      return;
    }

    const [startTime, endTime] = timeRange || [];
    // if (startTime.isBefore(currentDate)) {
    //   message.warning(
    //     "Thời gian bắt đầu không được nhỏ hơn thời gian hiện tại!"
    //   );
    //   setLoadingBusy(false);
    //   return;
    // }

    if (
      dayjs(selectedEvent.start).isBefore(currentDate) &&
      dayjs(selectedEvent.end).isAfter(currentDate) &&
      !startTime.isSame(dayjs(selectedEvent.start))
    ) {
      message.warning(
        "Thời gian bắt đầu đã qua, chỉ có thể cập nhật thời gian kết thúc!"
      );
      formUpdateBusy.setFieldsValue({
        note: selectedEvent.title || "",
        timeRange: [dayjs(selectedEvent.start), dayjs(selectedEvent.end)],
      });
      setLoading(false);
      return;
    }

    const isUnchanged =
      selectedEvent &&
      dayjs(selectedEvent.start).isSame(startTime) &&
      dayjs(selectedEvent.end).isSame(endTime) &&
      selectedEvent.title === note;

    if (isUnchanged) {
      message.info("Không có thay đổi nào để cập nhật.");
      setLoading(false);
      return;
    }

    formUpdateBusy
      .validateFields()
      .then((values) => {
        const [startTime, endTime] = values.timeRange || [];
        const data = {
          busyScheduleId: selectedEvent?.id,
          startDate: startTime.local().add(7, "hour").toISOString(), // Cộng thêm 7 giờ vào thời gian bắt đầu
          endDate: endTime.local().add(7, "hour").toISOString(), // Cộng thêm 7 giờ vào thời gian kết thúc
          note: values.note,
        };
        // dispatch(actUpdateBusySchedule(idEmployee, data))
        employeeService
          .UpdateBusySchedule(idEmployee, data)
          .then((res) => {
            console.log("API Response:", res);
            message.success("Lịch bận đã được chỉnh sửa!");
            dispatch(actGetBusyScheduleEmployee(idEmployee, currentDate));
            formUpdateBusy.resetFields();
            setIsModalDetailBusyVisible(false);
          })
          .catch((err) => {
            console.error("API Error:", err);
            message.error(
              err.response?.data?.message || "Chỉnh sửa lịch bận thất bại!"
            );
          })
          .finally(() => {
            setLoading(false);
          });
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  return (
    <div>
      <div className={styles["container_list"]}>
        {!isEmptyObject(salonDetailEmployee) ? (
          <>
            <Card
              // title="Thông tin Salon"
              title={
                <span style={{ fontSize: "1.3rem", color: "#bf9456" }}>
                  Thông tin Salon
                </span>
              }
              className={styles["responsive-card"]}
              style={{ padding: 0, marginBlock: "10px" }}
              bodyStyle={{ padding: 0 }}

              // style={{ width: "100%", height: "100%", padding: "10px" }}
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
                        <div>
                          <img
                            src={salonDetailEmployee.img}
                            alt="img"
                            style={{
                              width: "100%",
                              height: "100%",
                              maxWidth: "15rem",
                              maxHeight: "15rem",
                              objectFit: "cover",
                              borderRadius: "1rem",
                              marginInline: "1rem",
                            }}
                          />
                        </div>
                        <div
                          style={{ padding: "1rem" }}
                          className={classNames(
                            "my-custom-add",
                            styles["salon-title-cover"]
                          )}
                          // className={styles["salon-title-cover"]}
                        >
                          <div className={styles["salon-title"]}>
                            {salonDetailEmployee.name}
                          </div>
                        </div>
                      </div>
                    }
                    bordered
                    className={styles["responsive-descriptions"]}
                  >
                    <Descriptions.Item span={1} label="Địa chỉ">
                      {salonDetailEmployee.address}
                    </Descriptions.Item>
                    <Descriptions.Item span={2} label="Chủ Salon">
                      {salonDetailEmployee?.salonOwner?.fullName}
                    </Descriptions.Item>
                    <Descriptions.Item span={1} label="Mô tả">
                      {salonDetailEmployee.description}
                    </Descriptions.Item>

                    <Descriptions.Item
                      contentStyle={{
                        textAlign: "center",
                      }}
                      span={2}
                      className={
                        salonDetailEmployee.status === "APPROVED"
                          ? "bg-green-300 border-dotted border-2 text-white font-bold"
                          : salonDetailEmployee.status === "REJECTED"
                          ? "bg-red-400 border-dotted border-2 text-white font-bold"
                          : salonDetailEmployee.status === "PENDING"
                          ? "bg-yellow-400 border-dotted border-2 text-white font-bold"
                          : salonDetailEmployee.status === "EDITED"
                          ? "bg-blue-300 border-dotted border-2 text-white font-bold"
                          : salonDetailEmployee.status === "SUSPENDED"
                          ? "bg-orange-400 border-dotted border-2 text-white font-bold"
                          : salonDetailEmployee.status === "CREATING"
                          ? "bg-purple-300 border-dotted border-2 text-white font-bold"
                          : salonDetailEmployee.status === "OVERDUE"
                          ? "bg-yellow-600 border-dotted border-2 text-white font-bold"
                          : salonDetailEmployee.status === "DISABLED"
                          ? "bg-gray-400 border-dotted border-2 text-white font-bold"
                          : "bg-gray-300 border-dotted border-2 text-white font-bold"
                      }
                      label="Trạng thái"
                    >
                      {salonDetailEmployee.status === "APPROVED"
                        ? "Hoạt động"
                        : salonDetailEmployee.status === "REJECTED"
                        ? "Bị từ chối"
                        : salonDetailEmployee.status === "PENDING"
                        ? "Chờ duyệt"
                        : salonDetailEmployee.status === "EDITED"
                        ? "Đang chỉnh sửa"
                        : salonDetailEmployee.status === "SUSPENDED"
                        ? "Bị đình chỉ"
                        : salonDetailEmployee.status === "CREATING"
                        ? "Đang tạo"
                        : salonDetailEmployee.status === "OVERDUE"
                        ? "Quá hạn thanh toán"
                        : salonDetailEmployee.status === "DISABLED"
                        ? "Bị cấm"
                        : salonDetailEmployee.status}
                    </Descriptions.Item>

                    <Descriptions.Item label="Đánh giá">
                      <Rate
                        key={salonDetailEmployee?.id}
                        disabled
                        defaultValue={salonDetailEmployee?.rate}
                      />
                    </Descriptions.Item>
                    <Descriptions.Item label="Tổng đánh giá">
                      {salonDetailEmployee?.totalRating}
                    </Descriptions.Item>
                    <Descriptions.Item label="Số đánh giá">
                      {salonDetailEmployee?.totalReviewer}
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
              </Row>
              <Row gutter={16} style={{ marginTop: "20px" }}>
                <Col span={24}>
                  <Descriptions
                    title={
                      <span
                        style={{
                          fontSize: "1.3rem",
                          color: "#bf9456",
                          marginLeft: "1rem",
                        }}
                      >
                        Thời gian đóng / mở cửa
                      </span>
                    }
                    bordered
                  >
                    {salonDetailEmployee?.schedules &&
                      sortSchedules(salonDetailEmployee?.schedules)?.map(
                        (schedule, index) => (
                          <Descriptions.Item
                            key={index}
                            label={convertDayOfWeekToVietnamese(
                              schedule.dayOfWeek
                            )}
                          >
                            {schedule.startTime === "00:00" &&
                            schedule.endTime === "00:00" ? (
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
                  <Descriptions
                    title={
                      <span
                        style={{
                          fontSize: "1.3rem",
                          color: "#bf9456",
                          marginLeft: "1rem",
                        }}
                      >
                        Lịch làm việc cá nhân
                      </span>
                    }
                    bordered
                  >
                    {listScheduleEmployee &&
                      sortSchedules(listScheduleEmployee)?.map(
                        (schedule, index) => (
                          <Descriptions.Item
                            key={index}
                            label={convertDayOfWeekToVietnamese(
                              schedule.dayOfWeek
                            )}
                          >
                            {schedule.startTime === "00:00" ||
                            schedule.endTime === "00:00" ? (
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
                  <div className="schedule-container">
                    <div
                    // className="flex justify-start items-center"
                    >
                      <h3
                        className={styles["custom-header"]}
                        style={{ marginLeft: "1rem" }}
                      >
                        Thời gian làm việc hôm nay
                      </h3>
                    </div>
                    <button
                      className={styles["add-busy-button"]}
                      style={{
                        marginLeft: "1rem",
                      }}
                      onClick={handleAddBusySchedule}
                    >
                      Thêm Lịch Bận
                    </button>
                    <Modal
                      title="Thêm Lịch Bận"
                      visible={isModalOpen}
                      onOk={handleOk}
                      onCancel={handleCancel}
                      footer={null} // Ẩn nút mặc định của modal
                    >
                      <Form form={form} layout="vertical">
                        <Form.Item
                          name="timeRange"
                          label="Khoảng thời gian"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng chọn khoảng thời gian!",
                            },
                          ]}
                        >
                          <RangePicker
                            format="HH:mm"
                            showNow={false}
                            style={{ width: "100%" }}
                            // disabledTime={disabledRangePickerTimes}
                            showTime={{
                              hideDisabledOptions: true,
                              defaultValue: [
                                dayjs("00:00", "HH:mm"),
                                dayjs("00:00", "HH:mm"),
                              ],
                              disabledHours: () => {
                                const hours = [];
                                for (let i = 0; i < 24; i++) {
                                  if (
                                    i < startTime.hour() ||
                                    i > endTime.hour()
                                  ) {
                                    hours.push(i);
                                  }
                                }
                                return hours;
                              },
                              disabledMinutes: (selectedHour) => {
                                const allowedMinutes = [0, 15, 30, 45];
                                const disabledMinutes = [];

                                if (selectedHour === startTime.hour()) {
                                  for (let i = 0; i < 60; i++) {
                                    if (
                                      !allowedMinutes.includes(i) ||
                                      i < startTime.minute()
                                    ) {
                                      disabledMinutes.push(i);
                                    }
                                  }
                                } else if (selectedHour === endTime.hour()) {
                                  for (let i = 0; i < 60; i++) {
                                    if (
                                      !allowedMinutes.includes(i) ||
                                      i > endTime.minute()
                                    ) {
                                      disabledMinutes.push(i);
                                    }
                                  }
                                } else {
                                  for (let i = 0; i < 60; i++) {
                                    if (!allowedMinutes.includes(i)) {
                                      disabledMinutes.push(i);
                                    }
                                  }
                                }
                                return disabledMinutes;
                              },
                            }}
                          />
                        </Form.Item>
                        <Form.Item
                          name="note"
                          label="Ghi chú"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập ghi chú!",
                            },
                          ]}
                        >
                          <Input.TextArea
                            rows={4}
                            placeholder="Nhập ghi chú tại đây"
                          />
                        </Form.Item>
                        <Form.Item>
                          <Button
                            type="button"
                            onClick={handleOk}
                            className={styles["add-busy-button"]}
                            loading={loading} // Vô hiệu hóa nút khi đang loading
                          >
                            Thêm Lịch Bận
                          </Button>
                        </Form.Item>
                      </Form>
                    </Modal>
                    <Modal
                      title="Thông tin lịch bận"
                      visible={isModalDetailBusyVisible}
                      onCancel={handleCancelBusyModal}
                      footer={null} // Ẩn nút mặc định của modal
                    >
                      <Form form={formUpdateBusy} layout="vertical">
                        <Form.Item
                          name="timeRange"
                          label="Khoảng thời gian"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng chọn khoảng thời gian!",
                            },
                          ]}
                        >
                          <RangePicker
                            format="HH:mm"
                            showNow={false}
                            style={{ width: "100%" }}
                            // disabledTime={disabledRangePickerTimes}
                            showTime={{
                              hideDisabledOptions: true,
                              defaultValue: [
                                dayjs("00:00", "HH:mm"),
                                dayjs("00:00", "HH:mm"),
                              ],
                              disabledHours: () => {
                                const hours = [];
                                for (let i = 0; i < 24; i++) {
                                  if (
                                    i < startTime.hour() ||
                                    i > endTime.hour()
                                  ) {
                                    hours.push(i);
                                  }
                                }
                                return hours;
                              },
                              disabledMinutes: (selectedHour) => {
                                const allowedMinutes = [0, 15, 30, 45];
                                const disabledMinutes = [];

                                if (selectedHour === startTime.hour()) {
                                  for (let i = 0; i < 60; i++) {
                                    if (
                                      !allowedMinutes.includes(i) ||
                                      i < startTime.minute()
                                    ) {
                                      disabledMinutes.push(i);
                                    }
                                  }
                                } else if (selectedHour === endTime.hour()) {
                                  for (let i = 0; i < 60; i++) {
                                    if (
                                      !allowedMinutes.includes(i) ||
                                      i > endTime.minute()
                                    ) {
                                      disabledMinutes.push(i);
                                    }
                                  }
                                } else {
                                  for (let i = 0; i < 60; i++) {
                                    if (!allowedMinutes.includes(i)) {
                                      disabledMinutes.push(i);
                                    }
                                  }
                                }
                                return disabledMinutes;
                              },
                            }}
                          />
                        </Form.Item>
                        <Form.Item
                          name="note"
                          label="Ghi chú"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập ghi chú!",
                            },
                          ]}
                        >
                          <Input.TextArea
                            rows={4}
                            placeholder="Nhập ghi chú tại đây"
                          />
                        </Form.Item>
                        <Form.Item>
                          <Button
                            onClick={handleDeleteBusy}
                            type="primary"
                            danger
                            loading={loading} // Vô hiệu hóa nút khi đang loading
                          >
                            Xóa lịch Bận
                          </Button>
                          <Button
                            type="button"
                            onClick={handleUpdateBusy}
                            className={styles["add-busy-button"]}
                            style={{ marginLeft: "1rem" }}
                            loading={loading} // Vô hiệu hóa nút khi đang loading
                          >
                            Chỉnh sửa lịch bận
                          </Button>
                        </Form.Item>
                      </Form>
                    </Modal>
                    <Calendar
                      localizer={localizer}
                      events={parsedEvents}
                      startAccessor="start"
                      endAccessor="end"
                      style={{
                        marginLeft: "1rem",
                        marginRight: "1rem",
                        marginTop: "1rem",
                      }}
                      views={["day"]}
                      defaultView="day"
                      step={120}
                      timeslots={1}
                      popup={true}
                      // components={{
                      //   event: Event, // Sử dụng component Event tùy chỉnh
                      //   toolbar: () => null, // Ẩn toolbar
                      // }}
                      components={{
                        event: Event, // Sử dụng component Event tùy chỉnh
                        toolbar: (props) => (
                          <motion.div
                            className="text-center mb-4"
                            // initial={{ opacity: 0, y: -20 }}
                            // animate={{ opacity: 1, y: 0 }}
                            // transition={{ duration: 0.5 }}
                          >
                            <h2 className="text-lg font-semibold">
                              Thời gian làm việc hôm nay:{" "}
                              <span className="text-blue-500">
                                {scheduleEmployeeToday?.startTime} -{" "}
                                {scheduleEmployeeToday?.endTime}
                              </span>
                            </h2>
                          </motion.div>
                        ), // Thay đổi tiêu đề để hiển thị thời gian làm việc
                      }}
                      onSelectEvent={handleSelectEvent}
                    />
                  </div>
                </Col>
              </Row>
              <Row gutter={16} style={{ marginBlock: "30px" }}>
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
                        <div className={styles["custom-header"]}>
                          Dịch vụ bạn phục vụ
                        </div>
                      }
                      key="1"
                      className={styles["title-table-collapse"]}
                    >
                      <div
                        className={classNames(
                          "my-custom-add",
                          styles["table-fillter"]
                        )}
                      >
                        <Dropdown
                          overlay={sortMenuService}
                          className={styles["table-fillter-item"]}
                        >
                          <Button>
                            {sortLabelService} <DownOutlined />
                          </Button>
                        </Dropdown>

                        <Dropdown
                          overlay={filterMenuService}
                          className={styles["table-fillter-item"]}
                        >
                          <Button>
                            {filterLabelService} <DownOutlined />
                          </Button>
                        </Dropdown>
                        <div
                        // className="datePickerCustome"
                        // className={styles["date-picker-custome"]}
                        >
                          <Input
                            placeholder="Tìm kiếm theo tên dịch vụ"
                            className={styles["table-fillter-item"]}
                            // style={{ maxWidth: "25rem" }}
                            suffix={
                              <SearchOutlined
                                style={{
                                  cursor: "pointer",
                                  // padding: "5px",
                                  // backgroundColor: "#bf9456",
                                  // borderRadius: "5px",
                                }}
                                onClick={handleSearchService} // Trigger search on icon click
                              />
                            }
                            value={searchService} // Liên kết state với giá trị input
                            onChange={(e) => setSearchService(e.target.value)} // Cập nhật state khi người dùng nhập
                            onPressEnter={handleSearchService} // Trigger search on Enter key press
                          />
                        </div>
                      </div>
                      {/* {listServiceEmployee.items.length > 0 && ( */}
                      <div className={styles["table-container"]}>
                        <Spin className="custom-spin" spinning={loading}>
                          <Table
                            className={stylesCard.appointmentTable}
                            dataSource={listServiceEmployee.items}
                            columns={columnsService}
                            pagination={false}
                            rowKey="phone"
                          />
                          <div className={stylesCard.container}>
                            {listServiceEmployee?.items?.length === 0 && (
                              <h4
                                style={{
                                  fontWeight: "bold",
                                  color: "#bf9456",
                                  textAlign: "center",
                                  fontSize: "1.2rem",
                                }}
                              >
                                Không tìm thấy dịch vụ nào !!!
                              </h4>
                            )}

                            <div className={stylesCard.grid}>
                              {listServiceEmployee?.items?.map((service) => (
                                <div
                                  key={service.id}
                                  className={stylesCard.card}
                                >
                                  <img
                                    src={service?.img}
                                    alt="emplyee"
                                    className={stylesCard.employeeImage}
                                  />
                                  <h4>
                                    Tên:
                                    <span
                                      style={{
                                        display: "block",
                                        fontWeight: "bold",
                                        color: "#bf9456",
                                        textAlign: "center",
                                        fontSize: "1rem",
                                      }}
                                    >
                                      {service.serviceName}
                                    </span>
                                  </h4>
                                  <h4 className={stylesCard.description}>
                                    Mô tả: {service.description}
                                  </h4>
                                  <h4>
                                    Giá tiền: {formatCurrency(service.price)}
                                  </h4>
                                  <h4>Thời gian: {formatTime(service.time)}</h4>
                                  <h4>
                                    Trạng thái:{" "}
                                    <Tag
                                      icon={
                                        service.isActive ? (
                                          <CheckCircleOutlined />
                                        ) : (
                                          <CloseCircleOutlined />
                                        )
                                      }
                                      color={service.isActive ? "green" : "red"}
                                      style={{ marginBottom: "0.5rem" }}
                                    >
                                      {service.isActive
                                        ? "Hoạt động"
                                        : "Không hoạt động"}
                                    </Tag>
                                  </h4>
                                </div>
                              ))}
                            </div>
                          </div>
                        </Spin>
                      </div>
                      {/* )} */}

                      <Pagination
                        className="paginationAppointment"
                        current={currentPageService}
                        pageSize={pageSizeService}
                        total={listServiceEmployee.totalPages}
                        onChange={onPageChangeService}
                        style={{ marginTop: "20px", textAlign: "center" }}
                      />
                    </Panel>
                  </Collapse>
                </Col>
              </Row>
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

export default SalonEmployee;
