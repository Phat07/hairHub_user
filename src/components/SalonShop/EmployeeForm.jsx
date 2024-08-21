import { ClockCircleOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  Image,
  Input,
  message,
  Row,
  Select,
  Space,
  Spin,
  TimePicker,
  Upload,
} from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
// import "../../css/ListSalon.css";
import styles from "../../css/employeeForm.module.css";
import { ServiceHairServices } from "../../services/servicesHairServices";
import { actPostCreateSalonEmployees } from "../../store/salonEmployees/action";
import { emailPattern, fullNamePattern, phonePattern } from "../Regex/Patterns";

const { Option } = Select;

const AddEmployeeForm = ({
  onAddEmployees,
  isOpen,
  isReset,
  status,
  salonInformation,
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [services, setServices] = useState([]);
  const [dayOff, setDayOff] = useState({
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false,
  });

  const dispatch = useDispatch();
  const { id } = useParams();
  const formatTime = "HH:mm";
  const [loading,setLoading] = useState(false)
  const salonDetail = useSelector(
    (state) => state.SALONINFORMATION.getSalonByOwnerId
  );
  useEffect(() => {
    ServiceHairServices.getServiceHairBySalonNotPaging(salonDetail?.id)
      .then((response) => {
        setServices(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch services", error);
      });
  }, [salonDetail]);

  const convertScheduleFormat = (scheduleData) => {
    const daysOfWeek = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    const convertedSchedule = [];

    daysOfWeek.forEach((day) => {
      const dayData = {
        DayOfWeek: day,
        StartTime: "00:00",
        EndTime: "00:00",
        IsActive: false,
      };

      const dayInfo = scheduleData[day.toLowerCase()];
      if (dayInfo && dayInfo.start !== "00:00" && dayInfo.end !== "00:00") {
        dayData.StartTime = dayInfo.start;
        dayData.EndTime = dayInfo.end;
        dayData.IsActive = true;
      }

      convertedSchedule.push(dayData);
    });

    return convertedSchedule;
  };

  const onFinish = (values) => {
    const schedules = {};
    setLoading(true)
    for (const day in values) {
      if (dayOff[day]) {
        schedules[day.toLowerCase()] = {
          start: "00:00",
          end: "00:00",
        };
      } else if (values[day]?.start && values[day]?.end) {
        schedules[day.toLowerCase()] = {
          start: dayjs(values[day].start).format("HH:mm"),
          end: dayjs(values[day].end).format("HH:mm"),
        };
      }
    }

    const formattedSchedules = convertScheduleFormat(schedules);

    const formData = new FormData();
    const imageFile = fileList.length > 0 ? fileList[0].originFileObj : null;

    if (
      !imageFile ||
      !values.fullName ||
      // !values.address ||
      !values.gender ||
      !values.phone ||
      !values.email ||
      !values.serviceHairId ||
      Object.keys(formattedSchedules).length === 0
    ) {
      console.error("Required fields are missing.");
      message.error("Required fields are missing.");
      return;
    }

    formData.append("Saloninformationid", salonDetail?.id);
    formData.append("SalonEmployees[0].FullName", values.fullName);
    formData.append("SalonEmployees[0].Gender", values.gender);
    formData.append("SalonEmployees[0].Phone", values.phone);
    formData.append("SalonEmployees[0].IsActive", true);
    formData.append("SalonEmployees[0].ImgEmployee", imageFile);

    values.serviceHairId.forEach((serviceId, index) => {
      formData.append(`SalonEmployees[0].ServiceHairId[${index}]`, serviceId);
    });

    formattedSchedules.forEach((schedule, index) => {
      formData.append(
        `SalonEmployees[0].ScheduleEmployees[${index}].Date`,
        schedule.DayOfWeek
      );
      formData.append(
        `SalonEmployees[0].ScheduleEmployees[${index}].StartTime`,
        schedule.StartTime
      );
      formData.append(
        `SalonEmployees[0].ScheduleEmployees[${index}].EndTime`,
        schedule.EndTime
      );
      formData.append(
        `SalonEmployees[0].ScheduleEmployees[${index}].IsActive`,
        schedule.IsActive
      );
    });
    try {
      dispatch(actPostCreateSalonEmployees(formData, salonDetail?.id)).then((res)=>{
          message.success("Thêm nhân viên thành công!");
          setLoading(false)
      }).catch((err)=>{
        message.error("Nhân viên chưa được thêm!, kiểm tra lại");
      }).finally((err)=>{
        setLoading(false)
      });
      isOpen(false);
      setDayOff({
        Monday: false,
        Tuesday: false,
        Wednesday: false,
        Thursday: false,
        Friday: false,
        Saturday: false,
        Sunday: false,
      });
      form.resetFields();
      setFileList([]);
    } catch (err) {
      console.log(err);
    }
    setDayOff({
      Monday: false,
      Tuesday: false,
      Wednesday: false,
      Thursday: false,
      Friday: false,
      Saturday: false,
      Sunday: false,
    });
    isOpen(false);
    form.resetFields();
    setFileList([]);
  };

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleRemove = (file) => {
    setFileList((prevFileList) =>
      prevFileList.filter((item) => item.uid !== file.uid)
    );
  };

  const handleDayOffChange = (day) => {
    setDayOff((prevDayOff) => ({
      ...prevDayOff,
      [day]: !prevDayOff[day],
    }));
  };

  const convertDayFromEngToVi = (day) => {
    if (day === "Monday") return "Thứ Hai";
    if (day === "Tuesday") return "Thứ Ba";
    if (day === "Wednesday") return "Thứ Tư";
    if (day === "Thursday") return "Thứ Năm";
    if (day === "Friday") return "Thứ Sáu";
    if (day === "Saturday") return "Thứ Bảy";
    if (day === "Sunday") return "Chủ Nhật";
  };

  const handleTimeChange = (day) => {
    setTimeout(() => {
      form.validateFields([
        [day, "start"],
        [day, "end"],
      ]);
    }, 0);
  };

  const validateStartTime = (getFieldValue, day) => ({
    validator(_, value) {
      if (value && getFieldValue([day, "end"])) {
        if (value.isAfter(getFieldValue([day, "end"]))) {
          return Promise.reject(
            new Error("Start time cannot be after end time")
          );
        }
      }
      return Promise.resolve();
    },
  });

  const validateEndTime = (getFieldValue, day) => ({
    validator(_, value) {
      if (value && getFieldValue([day, "start"])) {
        if (value.isBefore(getFieldValue([day, "start"]))) {
          return Promise.reject(
            new Error("End time cannot be before start time")
          );
        }
      }
      return Promise.resolve();
    },
  });

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <Spin spinning={loading}>
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Row
        className={styles.rowContainer}
        gutter={24}
        style={{ display: "flex", marginBottom: "10px" }}
      >
        <Col span={11} className={styles.colWithBorder}>
          <div className={styles.workDemo}>Thông tin cá nhân</div>
          <Form.Item
            name="fullName"
            label="Tên đầy đủ"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên đầy đủ!",
              },
              {
                pattern: fullNamePattern,
                message: "Vui lòng nhập tên đúng cú pháp!",
              },
            ]}
          >
            <Input placeholder="Họ và tên" />
          </Form.Item>
          <Form.Item
            name="dateOfBirth"
            label="Ngày sinh"
            rules={[{ required: true, message: "Vui lòng nhập ngày sinh!" }]}
          >
            <DatePicker
              format={"YYYY-MM-DD"}
              disabledDate={(current) => current && current.isAfter(new Date())}
              placeholder="Ngày sinh"
            />
          </Form.Item>
          <Form.Item
            name="gender"
            label="Giới tính"
            rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
          >
            <Select placeholder="Giới tính">
              <Option value="Male">Nam</Option>
              <Option value="Female">Nữ</Option>
              <Option value="Other">Khác</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              {
                pattern: emailPattern,
                message: "Vui lòng nhập email theo @example.com!",
              },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              {
                pattern: phonePattern,
                message:
                  "Vui lòng nhập số điện thoại hợp lệ (10 chữ số) và số 0 ở đầu!",
              },
            ]}
          >
            <Input placeholder="Số điện thoại" />
          </Form.Item>
          <Form.Item
            name="serviceHairId"
            label="Dịch vụ"
            rules={[{ required: true, message: "Vui lòng chọn một dịch vụ!" }]}
          >
            <Select
              className={styles.selectOption}
              mode="multiple"
              placeholder="Chọn dịch vụ"
            >
              {services?.map((service) => (
                <Option key={service.id} value={service.id}>
                  {service.serviceName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="imgEmployee" label="Ảnh">
            <Upload
              multiple
              listType="picture"
              beforeUpload={() => false}
              onChange={handleUploadChange}
              onRemove={handleRemove}
              fileList={fileList}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
            <Space size={"small"} wrap direction="horizontal">
              {fileList.map((file) => (
                <Image
                  width={200}
                  height={"100%"}
                  key={file.uid}
                  src={URL.createObjectURL(file.originFileObj)}
                  alt="avatar"
                />
              ))}
            </Space>
          </Form.Item>
        </Col>
        <Col span={12} className={styles.colWithBorder1}>
          <div className={styles.workDemo} style={{ fontSize: "2rem" }}>
            Thời gian làm việc
          </div>
          {daysOfWeek.map((day) => {
            const salonDay = salonInformation?.schedules?.find(
              (schedule) => schedule.dayOfWeek === day
            );
            const salonStartTime = salonDay
              ? dayjs(salonDay.startTime, "HH:mm")
              : null;
            const salonEndTime = salonDay
              ? dayjs(salonDay.endTime, "HH:mm")
              : null;

            return (
              <Space
                key={day}
                direction="vertical"
                style={{ marginBottom: 10, marginLeft: 20 }}
              >
                <Checkbox
                  onChange={() => handleDayOffChange(day)}
                  disabled={
                    dayOff[day] ||
                    (salonStartTime.format("HH:mm") === "00:00" &&
                      salonEndTime.format("HH:mm") === "00:00")
                  }
                  checked={dayOff[day]}
                >
                  {convertDayFromEngToVi(day)} nghỉ
                </Checkbox>
                <Space
                  style={{ display: "flex" }}
                  align="baseline"
                  wrap
                  direction="horizontal"
                >
                  <Form.Item
                    initialValue={salonStartTime}
                    name={[day, "start"]}
                    label={`(${convertDayFromEngToVi(day)}) Thời gian mở cửa: `}
                    rules={[
                      {
                        required: !dayOff[day],
                        message: `Vui lòng chọn thời gian mở cửa cho ${convertDayFromEngToVi(
                          day
                        )}`,
                      },
                      ({ getFieldValue }) =>
                        validateStartTime(getFieldValue, day),
                    ]}
                  >
                    <TimePicker
                      className={styles["custom-timepicker"]}
                      minuteStep={15}
                      format="HH:mm"
                      disabled={
                        dayOff[day] ||
                        (salonStartTime.format("HH:mm") === "00:00" &&
                          salonEndTime.format("HH:mm") === "00:00")
                      }
                      disabledHours={() => {
                        if (!salonStartTime || !salonEndTime) return [];
                        const startHour = salonStartTime.hour();
                        const endHour = salonEndTime.hour();
                        return Array.from({ length: 24 }, (_, i) => i).filter(
                          (hour) => hour < startHour || hour > endHour
                        );
                      }}
                      disabledMinutes={(selectedHour) => {
                        if (!salonStartTime || !salonEndTime) return [];
                        const startHour = salonStartTime.hour();
                        const endHour = salonEndTime.hour();
                        if (selectedHour === startHour) {
                          return Array.from({ length: 60 }, (_, i) => i).filter(
                            (minute) => minute < salonStartTime.minute()
                          );
                        } else if (selectedHour === endHour) {
                          return Array.from({ length: 60 }, (_, i) => i).filter(
                            (minute) => minute > salonEndTime.minute()
                          );
                        } else {
                          return [];
                        }
                      }}
                      hideDisabledOptions
                      defaultOpenValue={salonStartTime}
                      onChange={() => handleTimeChange(day)}
                    />
                  </Form.Item>
                  <Form.Item
                    initialValue={salonEndTime}
                    name={[day, "end"]}
                    label={`(${convertDayFromEngToVi(
                      day
                    )}) Thời gian đóng cửa: `}
                    rules={[
                      {
                        required: !dayOff[day],
                        message: `Vui lòng chọn thời gian mở cửa cho ${convertDayFromEngToVi(
                          day
                        )}`,
                      },
                      ({ getFieldValue }) =>
                        validateEndTime(getFieldValue, day),
                    ]}
                  >
                    <TimePicker
                      className={styles["custom-timepicker"]}
                      minuteStep={15}
                      format="HH:mm"
                      disabled={
                        dayOff[day] ||
                        (salonStartTime.format("HH:mm") === "00:00" &&
                          salonEndTime.format("HH:mm") === "00:00")
                      }
                      disabledHours={() => {
                        if (!salonStartTime || !salonEndTime) return [];
                        const startHour = salonStartTime.hour();
                        const endHour = salonEndTime.hour();
                        return Array.from({ length: 24 }, (_, i) => i).filter(
                          (hour) => hour < startHour || hour > endHour
                        );
                      }}
                      disabledMinutes={(selectedHour) => {
                        if (!salonStartTime || !salonEndTime) return [];
                        const startHour = salonStartTime.hour();
                        const endHour = salonEndTime.hour();
                        if (selectedHour === startHour) {
                          return Array.from({ length: 60 }, (_, i) => i).filter(
                            (minute) => minute < salonStartTime.minute()
                          );
                        } else if (selectedHour === endHour) {
                          return Array.from({ length: 60 }, (_, i) => i).filter(
                            (minute) => minute > salonEndTime.minute()
                          );
                        } else {
                          return [];
                        }
                      }}
                      hideDisabledOptions
                      defaultOpenValue={salonEndTime}
                      onChange={() => handleTimeChange(day)}
                    />
                  </Form.Item>
                </Space>
                {salonStartTime && salonEndTime && (
                  <div>
                    <ClockCircleOutlined /> &nbsp; Thời gian tiệm hoạt động vào{" "}
                    {convertDayFromEngToVi(day)} là:{" "}
                    {salonStartTime.format("HH:mm")} -{" "}
                    {salonEndTime.format("HH:mm")}
                  </div>
                )}
                <Divider />
              </Space>
            );
          })}
        </Col>
      </Row>

      {/* <Form.Item
        name="address"
        label="Địa chỉ"
        rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
      >
        <Input placeholder="Địa chỉ" />
      </Form.Item> */}

      <Form.Item>
        <div style={{ textAlign: "right" }}>
          <Button
            style={{ backgroundColor: "#BF9456" }}
            type="primary"
            htmlType="submit"
          >
            Lưu nhân viên
          </Button>
        </div>
      </Form.Item>
    </Form>
    </Spin>
  );
};

export default AddEmployeeForm;
