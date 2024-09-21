import { UploadOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Checkbox,
  DatePicker,
  Flex,
  Form,
  Image,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Space,
  Spin,
  TimePicker,
  Upload,
} from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { SalonEmployeesServices } from "../services/salonEmployeesServices";
import { ServiceHairServices } from "../services/servicesHairServices";
import {
  actGetAllEmployees,
  actGetSalonEmployeeById,
  actGetSalonEmployeeServiceById,
  actPutSalonEmployeeById,
  actPutSalonEmployeeServiceById,
  actPutUpdateSalonEmployees,
} from "../store/salonEmployees/action";
import styles from "../css/accountPage.module.css";
import classNames from "classnames";
import OTPInput from "react-otp-input";
import ResendCode from "@/components/Resend/resendCode";
import { emailPattern } from "@/components/Regex/Patterns";
const renderInput = (props) => (
  <input
    {...props}
    onKeyPress={(e) => {
      if (!/[0-9]/.test(e.key)) {
        message?.warning("Vui lòng không nhập chữ");
        e.preventDefault();
      }
    }}
  />
);
function AccountPage() {
  const [form] = Form.useForm();
  // const { id, employeeId } = useParams();
  const { employeeId } = useParams();
  const [dayOff, setDayOff] = useState({
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false,
  });
  const [user, setUser] = useState({});
  const [accountEmployeeDetail, setAccountEmployeeDetail] = useState(null);
  const [servicesList, setServicesList] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [activeButtons, setActiveButtons] = useState({});
  const [pendingConfirmations, setPendingConfirmations] = useState({});
  const [loading, setLoading] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [isEmail, setIsEmail] = useState("");
  const [show, setShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);

  const salonDetail = useSelector(
    (state) => state.SALONINFORMATION.getSalonByOwnerId
  );
  const employeeIdOfSalon = useSelector(
    (state) => state.SALONEMPLOYEES.employeeId
  );

  const employeeServiceIdOfSalon = useSelector(
    (state) => state.SALONEMPLOYEES.employeeServiceList
  );
  useEffect(() => {
    if (employeeServiceIdOfSalon) {
      setServicesList(employeeServiceIdOfSalon);
    }
  }, [employeeServiceIdOfSalon]);
  const [selectedServices, setSelectedServices] = useState([]);

  const EMPLOYEESDETAILS_URL_UPDATE =
    "https://hairhub.gahonghac.net/api/v1/salonemployees/UpdateSalonEmployee/";

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const initialEditableStates = {}; // Đối tượng lưu trạng thái có thể chỉnh sửa cho từng ngày
  schedules?.forEach((day) => {
    initialEditableStates[day.id] = true; // Ban đầu tất cả các ngày đều có thể chỉnh sửa
  });

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

      const dayInfo = scheduleData[day];
      if (dayInfo && dayInfo.start !== "00:00" && dayInfo.end !== "00:00") {
        dayData.StartTime = dayInfo.start;
        dayData.EndTime = dayInfo.end;
        dayData.IsActive = true;
      }

      convertedSchedule.push(dayData);
    });

    return convertedSchedule;
  };
  useEffect(() => {
    if (salonDetail) {
      dispatch(actGetSalonEmployeeServiceById(salonDetail?.id));
    }

    dispatch(actGetSalonEmployeeById(employeeId));
    // dispatch(actGetSalonEmployeeServiceById(employeeId))
  }, [employeeId, salonDetail]);
  const serviceHairsList = employeeIdOfSalon?.serviceHairs;
  useEffect(() => {
    setAccountEmployeeDetail(employeeIdOfSalon);
    // setSchedules(res.data.schedules);
    // const userAccount = res.data.id === id;
    const userData = employeeIdOfSalon;

    setUser(employeeIdOfSalon);
    if (userData) {
      const birthDay = dayjs(userData?.dayOfBirth);
      const schedules = {};
      for (const index in userData?.schedules) {
        const daySchedule = userData?.schedules[index];

        // Kiểm tra nếu đối tượng daySchedule tồn tại và chứa các thuộc tính cần thiết
        if (daySchedule && daySchedule.startTime && daySchedule.endTime) {
          // Sử dụng dayjs để định dạng startTime và endTime
          schedules[daySchedule.dayOfWeek] = {
            // start: dayjs(daySchedule.startTime, "HH:mm:ss").format("HH:mm"),
            // end: dayjs(daySchedule.endTime, "HH:mm:ss").format("HH:mm"),
            start: dayjs(daySchedule.startTime, "HH:mm").format("HH:mm"),
            end: dayjs(daySchedule.endTime, "HH:mm").format("HH:mm"),
          };
        } else {
          console.error("Invalid schedule data:", daySchedule);
        }
      }

      const formattedSchedules = convertScheduleFormat(schedules);
      setSchedules(formattedSchedules);
      const serviceHairs = userData?.serviceHairs?.map(
        ({ id, serviceName }) => ({
          id,
          serviceName,
        })
      );

      form.setFieldsValue({
        fullName: userData.fullName,
        email: userData.email,
        gender: userData.gender,
        phone: userData.phone,
        address: userData.address,
        dayOfBirth: birthDay,
        avatar: userData.avatar,
        serviceHairs: serviceHairs?.map((service) => service.serviceName),
      });
      setSelectedServices(serviceHairs);
    } else {
    }
    // setSalonId(res.data.salonInformationId);
  }, [employeeIdOfSalon]);

  const onFinish = async (item) => {
    // const gender = await form.getFieldValue("gender");
    // const phone = await form.getFieldValue("phone");
    // const imageFile = fileList.length > 0 ? fileList[0].originFileObj : null;
    // const formData = await new FormData();
    // // formData.append("id", employeeId);
    // await formData.append("SalonInformationId", salonDetail.id);
    // await formData.append("Gender", gender);
    // await formData.append("Img", imageFile);
    // await formData.append("Phone", phone);
    // await formData.append("IsActive", true);
    // await axios
    //   .put(EMPLOYEESDETAILS_URL_UPDATE + `${employeeId}`, formData)
    //   .then((res) => {
    //     navigate(`/list_barber_employees/${salonDetail.id}`);
    //     dispatch(actGetAllEmployees(salonDetail.id));
    //     message.success("Chỉnh sửa thông tin nhân viên thành công");
    //   })
    //   .catch((err) => message.error(err));
  };

  const handleEdit = async () => {
    const gender = await form.getFieldValue("gender");
    const phone = await form.getFieldValue("phone");
    const imageFile = fileList.length > 0 ? fileList[0].originFileObj : null;
    const formData = new FormData();
    // formData.append("id", employeeId);
    await formData.append("SalonInformationId", salonDetail.id);
    await formData.append("Gender", gender);
    await formData.append("Img", imageFile);
    await formData.append("Phone", phone);
    await formData.append("IsActive", true);

    dispatch(actPutUpdateSalonEmployees(employeeId, formData))
      .then((res) => {
        message.success("Chỉnh sửa thông tin nhân viên thành công");
      })
      .catch((err) => {
        message.error(
          "Chỉnh sửa nhân viên không thành công. Vui lòng thử lại!!!"
        );
      });
  };

  const handleUploadChange = ({ fileList }) => setFileList(fileList);
  const dayOfWeekMap = {
    Monday: "Thứ hai",
    Tuesday: "Thứ ba",
    Wednesday: "Thứ tư",
    Thursday: "Thứ năm",
    Friday: "Thứ sáu",
    Saturday: "Thứ bảy",
    Sunday: "Chủ nhật",
  };

  const convertDayOfWeek = (day) => {
    return dayOfWeekMap[day] || day;
  };
  const initialValuesRef = useRef({});

  // Store initial values in ref
  useEffect(() => {
    const initialValues = {};
    schedules.forEach((day) => {
      initialValues[day.DayOfWeek] = {
        start: dayjs(day.StartTime, "HH:mm"),
        end: dayjs(day.EndTime, "HH:mm"),
      };
    });
    initialValuesRef.current = initialValues;
    form.setFieldsValue(initialValues); // Set initial values in the form
    validateAllFields(); // Validate fields on initial load
  }, [schedules]);

  // Validate all fields
  const validateAllFields = async () => {
    try {
      for (const day of schedules) {
        await validateFields(day.DayOfWeek);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Validate fields based on current values
  const validateFields = async (dayOfWeek) => {
    const startValue = form.getFieldValue([dayOfWeek, "start"]);
    const endValue = form.getFieldValue([dayOfWeek, "end"]);

    if (startValue && endValue) {
      if (startValue.isAfter(endValue)) {
        form.setFields([
          {
            name: [dayOfWeek, "start"],
            errors: ["Giờ bắt đầu phải nhỏ hơn giờ kết thúc"],
          },
        ]);
      } else {
        form.setFields([{ name: [dayOfWeek, "start"], errors: [] }]);
      }

      if (endValue.isBefore(startValue)) {
        form.setFields([
          {
            name: [dayOfWeek, "end"],
            errors: ["Giờ kết thúc phải lớn hơn giờ bắt đầu"],
          },
        ]);
      } else {
        form.setFields([{ name: [dayOfWeek, "end"], errors: [] }]);
      }
    }
  };

  const handleStartChange = (value, dayOfWeek) => {
    form.setFieldsValue({ [dayOfWeek]: { start: value } });
    validateFields(dayOfWeek);
    checkIfButtonShouldBeEnabled(dayOfWeek);
  };

  const handleEndChange = (value, dayOfWeek) => {
    form.setFieldsValue({ [dayOfWeek]: { end: value } });
    validateFields(dayOfWeek);
    checkIfButtonShouldBeEnabled(dayOfWeek);
  };

  // Handle changes in checkbox
  const handleCheckboxChange = (dayOfWeek) => {
    handleDayOffChange(dayOfWeek);
    checkIfButtonShouldBeEnabled(dayOfWeek);
  };

  const handleDayOffChange = (dayOfWeek) => {
    setDayOff((prevDayOff) => {
      const updatedDayOff = {
        ...prevDayOff,
        [dayOfWeek]: !prevDayOff[dayOfWeek], // Đảo ngược trạng thái của ngày nghỉ
      };

      // Nếu ngày nghỉ được bật (checkbox được chọn), đặt thời gian về "00:00"
      if (updatedDayOff[dayOfWeek]) {
        const resetTime = dayjs("00:00", "HH:mm");
        form.setFieldsValue({
          [dayOfWeek]: { start: resetTime, end: resetTime },
        });
      }

      // Kiểm tra nếu button cần được kích hoạt
      checkIfButtonShouldBeEnabled(dayOfWeek);

      return updatedDayOff;
    });
  };

  // Check if the button for a specific day should be enabled
  const checkIfButtonShouldBeEnabled = (dayOfWeek) => {
    const initialStart = initialValuesRef.current[dayOfWeek]?.start;
    const initialEnd = initialValuesRef.current[dayOfWeek]?.end;
    const currentStart = form.getFieldValue([dayOfWeek, "start"]);
    const currentEnd = form.getFieldValue([dayOfWeek, "end"]);
    const checkboxChecked = dayOff[dayOfWeek];

    // Enable the button if the checkbox is checked or if there are changes to start/end times
    const isEnabled =
      checkboxChecked ||
      !checkboxChecked ||
      (currentStart &&
        currentEnd &&
        (currentStart !== initialStart || currentEnd !== initialEnd));

    setActiveButtons((prevState) => ({
      ...prevState,
      [dayOfWeek]: isEnabled,
    }));
  };
  function formatTime(time) {
    const hours = time.hour.toString().padStart(2, "0");
    const minutes = time.minute.toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }
  const handleConfirm = async (dayOfWeek) => {
    setLoading(true);
    const start = form.getFieldValue([dayOfWeek, "start"]);
    const end = form.getFieldValue([dayOfWeek, "end"]);
    if (start && end) {
      const formattedStart = {
        hour: start.hour(),
        minute: start.minute(),
      };

      const formattedEnd = {
        hour: end.hour(),
        minute: end.minute(),
      };
      const startTimeString = await formatTime(formattedStart);
      const endTimeString = await formatTime(formattedEnd);
      const data = {
        dayofWeeks: dayOfWeek,
        startTime: startTimeString,
        endTime: endTimeString,
        isActive: true,
      };
      dispatch(actPutSalonEmployeeById(employeeId, data))
        .then((res) => {
          setLoading(false);
          message.success(
            `Cập nhật lịch làm ${dayOfWeek} thành công cho nhân viên ${employeeIdOfSalon?.fullName}`
          );
          setActiveButtons({});
        })
        .catch((err) => {
          message.error(
            `Cập nhật lịch làm ${dayOfWeek} thất bại cho nhân viên ${employeeIdOfSalon?.fullName}`
          );
        })
        .finally((err) => {
          setLoading(false);
        });

      // Thực hiện các hành động khác với dữ liệu đã format
    } else {
      console.log("Thời gian không hợp lệ.");
    }
  };

  const handleCancel = (dayOfWeek) => {
    // Mark the button as disabled (or reset to initial state)
    setPendingConfirmations((prevState) => ({
      ...prevState,
      [dayOfWeek]: false,
    }));
    setActiveButtons((prevState) => ({
      ...prevState,
      [dayOfWeek]: false,
    }));
    // loại dayOfWeek khi truyền vào setDayOff để trừ ngày này ra
    setDayOff((prevState) => {
      const updatedDayOff = { ...prevState };
      delete updatedDayOff[dayOfWeek];
      return updatedDayOff;
    });

    // Optionally reset form fields to their initial values
    form.setFieldsValue({
      [dayOfWeek]: {
        start: initialValuesRef.current[dayOfWeek]?.start,
        end: initialValuesRef.current[dayOfWeek]?.end,
      },
    });

    // Revalidate fields to ensure errors are cleared
    validateFields(dayOfWeek);
  };

  const handleConfirmService = () => {
    // setLoading(true);

    let data = {
      listServiceID: selectedServices.map((e) => e?.id),
    };

    dispatch(actPutSalonEmployeeServiceById(employeeId, data))
      .then((res) => {
        setLoading(false);
        message.success(
          `Đã cập nhật nhân viên ${employeeIdOfSalon?.fullName} thành công`
        );
      })
      .catch((err) => {
        message.error(err?.response?.data);
        // message.error(
        //   `Đã cập nhật nhân viên ${employeeIdOfSalon?.fullName} thất bại`
        // );
      })
      .finally((err) => {
        setLoading(false);
      });
  };
  const handleCancelService = () => {
    setSelectedServices(serviceHairsList);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setIsEmail(value);

    // Validate email
    if (value && !emailPattern.test(value)) {
      setErrorMessage("Email không hợp lệ!");
    } else {
      setErrorMessage("");
    }
  };
  const sendOtp = async () => {
    setLoading(true);
    const email = isEmail;
    if (email) {
      try {
        await axios
          .post("https://hairhub.gahonghac.net/api/v1/otps/SendOTPToEmail", {
            email,
          })
          .then((res) => {
            // setLoading(false);
            message.success("Xác thực Email thành công! Vui lòng điền otp!");
            // call api gửi otp
            setIsOtpModalOpen(true);
          })
          .catch((err) => {
            message.error("Gửi otp thất bại! Vui lòng thử lại!");
          })
          .finally(() => {
            setLoading(false);
          });
      } catch (error) {
        message.error("Gửi otp thất bại! Vui lòng chọn gửi lại!");
      }
    }
  };
  const verifyOtp = async () => {
    const email = isEmail;
    if (!otp) {
      message.error("Vui lòng nhập otp!");
      return;
    }
    if (email) {
      try {
        setLoading(true); // Start loading
        const response = await axios.post(
          "https://hairhub.gahonghac.net/api/v1/otps/checkOtp",
          {
            otpRequest: otp,
            email: email,
          }
        );
        setOtp("");
        setEmailVerified(true);
        setIsOtpModalOpen(false);
        // message.success("Otp xác thực thành công!");
        let data = {
          email: email,
          employeeId: employeeId,
        };

        // Only called if the previous request was successful
        await SalonEmployeesServices.activateEmployee(data).then((res) => {
          message.success("Chúc mừng đã kích hoạt tài khoản thành công!");
          setShow(!show);
        });
      } catch (error) {
        // Error block
        message.error(error?.response?.data?.message);
        setOtp("");
        return; // Exit on error, preventing further execution
      } finally {
        // Stop loading in both success and error cases
        setLoading(false);
      }
    }
  };

  const showOtpModal = async () => {
    setLoading(true);
    const email = isEmail;
    if (!email || !emailPattern.test(email)) {
      setLoading(false);
      message.error("Email chưa đúng hoặc chưa điền!");
    } else {
      const response = await axios
        .post("https://hairhub.gahonghac.net/api/v1/otps/CheckExistEmail", {
          email,
        })
        .then((res) => {
          if (res.data == "Email đã tồn tại trên hệ thống!") {
            setLoading(false);
            message.error("Email này đã được đăng ký trước đó!");
          } else {
            console.log("45");
            // setLoading(false);
            sendOtp();
          }
        })
        .catch((err) => {
          message.error("Thất bại trong việc đăng ký!");
        });
      // .finally(() => {
      //   setLoading(false);
      // });
    }
  };
  return (
    <div>
      <Spin spinning={loading}>
        <div className={styles.containerAccount}>
          <Flex justify="center">
            <Card className="bg-slate-100 w-full md:w-[80%] lg:w-[60%] p-5">
              <Space
                align="center"
                size={2}
                direction="vertical"
                className="w-full"
              >
                <Avatar
                  size={250}
                  shape="circle"
                  src={
                    user?.img ||
                    "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg"
                  }
                />
                {show && (
                  <div style={{ textAlign: "center" }}>
                    <Input
                      placeholder="Vui lòng nhập email"
                      value={isEmail}
                      readOnly={emailVerified}
                      onChange={handleEmailChange}
                      style={{ marginTop: "1rem", marginBottom: "1rem" }}
                    />
                    {errorMessage && (
                      <div style={{ color: "red", marginBottom: "1rem" }}>
                        {errorMessage}
                      </div>
                    )}

                    <Button
                      className={styles.customButton}
                      style={{ marginBottom: "1rem" }}
                      onClick={showOtpModal}
                    >
                      Gửi Otp
                    </Button>
                  </div>
                )}

                <Button
                  onClick={() => setShow(!show)}
                  className={styles.customButton}
                >
                  {show ? "Hủy" : "Kích hoạt tài khoản"}
                </Button>
                {fileList.map((file) => (
                  <div
                    key={file.uid}
                    className="max-w-full md:max-w-[40rem] mt-8"
                    style={{ maxHeight: "50rem" }}
                  >
                    <Image
                      width="100%"
                      src={
                        file.url ||
                        (file.originFileObj
                          ? URL.createObjectURL(file.originFileObj)
                          : null)
                      }
                      alt={file.name}
                    />
                  </div>
                ))}
                <Form
                  className="w-full md:w-[90%] lg:w-[50rem]"
                  id={employeeId}
                  form={form}
                  layout="vertical"
                  onFinish={onFinish}
                  autoComplete="off"
                >
                  <Form.Item
                    name="image"
                    label="Tải hình ảnh lên"
                    tooltip="Add only one Image!"
                  >
                    <Upload
                      multiple
                      listType="picture"
                      fileList={fileList}
                      onChange={handleUploadChange}
                      beforeUpload={() => false}
                    >
                      <Button icon={<UploadOutlined />}>Tải lên</Button>
                    </Upload>
                  </Form.Item>
                  <Form.Item
                    label="Tên đầy đủ:"
                    name="fullName"
                    rules={[
                      { required: true, message: "Vui lòng không để trống!" },
                    ]}
                  >
                    <Input disabled={true} />
                  </Form.Item>
                  <Form.Item label="Giới tính:" name="gender">
                    <Select>
                      <Select.Option value="Male">Nam</Select.Option>
                      <Select.Option value="Female">Nữ</Select.Option>
                      <Select.Option value="Other">Khác</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="Ngày sinh:"
                    name="dayOfBirth"
                    rules={[
                      { required: true, message: "Vui lòng không để trống!" },
                    ]}
                  >
                    <DatePicker disabled={true} />
                  </Form.Item>
                  <Form.Item
                    label="Số điện thoại:"
                    name="phone"
                    rules={[
                      { required: true, message: "Vui lòng không để trống!" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      onClick={handleEdit}
                      className={styles.customButton}
                      // className="bg-[#BF9456] text-black border border-transparent hover:text-white hover:border-black px-4 py-2 rounded"
                    >
                      Chỉnh sửa nhưng không chỉnh sửa lịch làm
                    </Button>
                  </Form.Item>
                  <Form.Item
                    label="Dịch vụ:"
                    name="serviceHairs"
                    rules={[
                      { required: true, message: "Vui lòng chọn dịch vụ!" },
                    ]}
                  >
                    <Select
                      mode="multiple"
                      // disabled={true}
                      placeholder="Chọn dịch vụ"
                      value={selectedServices?.map((s) => s.serviceName)}
                      onChange={(values) => {
                        const selected = servicesList.filter((service) =>
                          values.includes(service.serviceName)
                        );
                        setSelectedServices(selected);
                      }}
                    >
                      {servicesList?.map((service) => (
                        <Select.Option
                          key={service.id}
                          value={service.serviceName}
                        >
                          {service.serviceName}
                        </Select.Option>
                      ))}
                    </Select>
                    <Popconfirm
                      title={`Bạn có chắc chắn muốn thay đổi dịch vụ cho nhân viên ${employeeIdOfSalon?.fullName} không?`}
                      onConfirm={handleConfirmService}
                      onCancel={handleCancelService}
                      okText="Có"
                      cancelText="Hủy"
                    >
                      <Button
                        style={{ marginTop: "1rem" }}
                        className={styles.customButton}
                      >
                        Chỉnh sửa dịch vụ
                      </Button>
                    </Popconfirm>
                  </Form.Item>
                  <Form.Item></Form.Item>
                  {schedules?.map((day) => (
                    <Space
                      key={day.DayOfWeek}
                      direction="vertical"
                      style={{
                        marginBottom: 10,
                        marginLeft: 20,
                        display: "flex",
                      }}
                    >
                      <Checkbox
                        onChange={() => handleCheckboxChange(day.DayOfWeek)}
                        checked={dayOff[day.DayOfWeek]}
                      >
                        {convertDayOfWeek(day.DayOfWeek)} Nghỉ
                      </Checkbox>

                      <Space
                        align="baseline"
                        style={{
                          display: "flex",
                          justifyContent: "space-around",
                          width: "100%",
                        }}
                      >
                        <Form.Item
                          name={[day.DayOfWeek, "start"]}
                          label={`Bắt đầu (${convertDayOfWeek(day.DayOfWeek)})`}
                          rules={[
                            {
                              validator: (_, value) => {
                                // Validation will be handled by validateFields function
                                return Promise.resolve();
                              },
                            },
                          ]}
                        >
                          <TimePicker
                            format="HH:mm"
                            minuteStep={15}
                            defaultValue={dayjs(day.StartTime, "HH:mm")}
                            disabled={dayOff[day.DayOfWeek]}
                            onChange={(value) =>
                              handleStartChange(value, day.DayOfWeek)
                            }
                          />
                        </Form.Item>

                        <Form.Item
                          name={[day.DayOfWeek, "end"]}
                          label={`Kết thúc (${convertDayOfWeek(
                            day.DayOfWeek
                          )})`}
                          rules={[
                            {
                              validator: (_, value) => {
                                // Validation will be handled by validateFields function
                                return Promise.resolve();
                              },
                            },
                          ]}
                        >
                          <TimePicker
                            format="HH:mm"
                            minuteStep={15}
                            defaultValue={dayjs(day.EndTime, "HH:mm")}
                            disabled={dayOff[day.DayOfWeek]}
                            onChange={(value) =>
                              handleEndChange(value, day.DayOfWeek)
                            }
                          />
                        </Form.Item>

                        <Popconfirm
                          title="Bạn có chắc chắn muốn sửa đổi không?"
                          onConfirm={() => handleConfirm(day.DayOfWeek)}
                          onCancel={() => handleCancel(day.DayOfWeek)}
                          okText="Có"
                          cancelText="Hủy"
                        >
                          <Button
                            style={{ backgroundColor: "#BF9456" }}
                            htmlType="submit"
                            disabled={!activeButtons[day.DayOfWeek]}
                          >
                            Chỉnh sửa
                          </Button>
                        </Popconfirm>
                      </Space>
                    </Space>
                  ))}
                </Form>
              </Space>
            </Card>
            <Modal
              title="Enter OTP"
              visible={isOtpModalOpen}
              onOk={() => verifyOtp(otp)}
              onCancel={() => setIsOtpModalOpen(false)}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "1rem",
                }}
              >
                <OTPInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={6}
                  renderInput={renderInput}
                  separator={<span>-</span>}
                  isInputNum
                  inputStyle={{
                    borderRadius: "50%",
                    border: "2px solid #1119",
                    width: "4rem",
                    height: "4rem",
                    margin: "0 0.5rem",
                    fontSize: "2rem",
                    color: "black",
                    textAlign: "center",
                  }}
                />
              </div>
              <ResendCode isOtpModalOpen={isOtpModalOpen} form={form} />
              {/* <Button type="link" onClick={handleResendCode} disabled={timer > 0}>
            Gửi lại OTP {timer > 0 && `(${formatTime(timer)})`}
          </Button> */}
            </Modal>
          </Flex>
        </div>
      </Spin>
    </div>
  );
}

export default AccountPage;
