import { useNavigate, useParams } from "react-router-dom";
import AccountForm from "./AccountForm";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Button,
  Avatar,
  Space,
  Flex,
  message,
  Popconfirm,
  TimePicker,
  Checkbox,
  Upload,
  Image,
} from "antd";
import dayjs from "dayjs";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { SalonEmployeesServices } from "../services/salonEmployeesServices";
import { ServiceHairServices } from "../services/servicesHairServices";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { actGetAllEmployees } from "../store/salonEmployees/action";

function AccountPage() {
  const [form] = Form.useForm();
  const { id, employeeId } = useParams(); //id
  console.log(employeeId, "emp Idddd");
  console.log(id, "salon Idddd"); //salonId
  const [dayOff, setDayOff] = useState({
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false,
  });
  // console.log(salonId);
  const [user, setUser] = useState({});
  const [accountEmployeeDetail, setAccountEmployeeDetail] = useState(null);
  const [servicesList, setServicesList] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [fileList, setFileList] = useState([]);

  const [selectedServices, setSelectedServices] = useState([]);
  const EMPLOYEESDETAILS_URL =
    "http://14.225.218.91:8080/api/v1/salonemployees/GetSalonEmployeeById/";

  const EMPLOYEESDETAILS_URL_UPDATE =
    "http://14.225.218.91:8080/api/v1/salonemployees/UpdateSalonEmployee/";
  const [isEdit, setIsEdit] = useState(true);
  const ACCOUNT_URL =
    "http://14.225.218.91:8080/api/v1/accounts/GetAccountById/";

  const auth = useAuthUser();
  const authUserId = auth?.uid;
  console.log(authUserId, "authAccountId");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const confirm = (e) => {
  //   console;
  //   message.success("Click on Yes");
  //   onFinish(user);
  // };
  // const cancel = (e) => {
  //   console.log(e);
  //   message.error("Click on No");
  // };

  const getAccountDetail = async () => {
    if (employeeId === (await accountEmployeeDetail.employeeId)) {
      return EMPLOYEESDETAILS_URL;
    } else {
      return ACCOUNT_URL;
    }
  };

  const initialEditableStates = {}; // Đối tượng lưu trạng thái có thể chỉnh sửa cho từng ngày
  schedules?.forEach((day) => {
    initialEditableStates[day.id] = true; // Ban đầu tất cả các ngày đều có thể chỉnh sửa
  });

  const [editableStates, setEditableStates] = useState(initialEditableStates); // State lưu trạng thái chỉnh sửa cho từng ngày

  const handleCheckSchedule = () => {
    // Logic kiểm tra lịch làm ở đây
    // Ví dụ: Kiểm tra xem có lịch làm trong khoảng thời gian schedules không
    schedules?.forEach((day) => {
      const isWorking = checkWorkingSchedule(day.id); // Hàm kiểm tra lịch làm của nhân viên cho từng ngày

      if (isWorking) {
        setEditableStates((prevState) => ({
          ...prevState,
          [day.id]: false, // Nếu có lịch làm thì disable form schedule cho ngày đó
        }));
      } else {
        setEditableStates((prevState) => ({
          ...prevState,
          [day.id]: true, // Nếu không có lịch làm thì cho phép chỉnh sửa form schedule cho ngày đó
        }));
      }
    });
  };

  useEffect(() => {
    SalonEmployeesServices.getSalonEmployeeById(employeeId)
      .then((res) => {
        setAccountEmployeeDetail(res.data);
        console.log(res.data, "account employee");
        setSchedules(res.data.schedules);
        // const userAccount = res.data.id === id;
        const userData = res.data;
        console.log(userData, "userData");
        setUser(res.data);
        // console.log(res.data);
        if (userData) {
          const birthDay = dayjs(userData.dayOfBirth); //set the value type to the value type of DatePicker component ant design, Date Library in Ant design config by dayjs library
          console.log(userData.schedules);
          // userData.schedules.forEach((day, index) => {
          //   console.log(`This is ${day} and index ${index}`);
          // });
          const schedules = {};

          // Format schedule times using dayjs
          for (const day in userData) {
            schedules[day.toLowerCase()] = {
              start: dayjs(userData[day].startTime).format("HH:mm"),
              end: dayjs(userData[day].endTime).format("HH:mm"),
            };
          }

          const formattedSchedules = convertScheduleFormat(schedules);
          console.log(formattedSchedules);
          // const serviceHairs = userData.serviceHairs.map(
          //   ({ serviceName }) => serviceName
          // );
          const serviceHairs = userData.serviceHairs.map(
            ({ id, serviceName }) => ({
              id,
              serviceName,
            })
          );
          console.log(serviceHairs, "serviceHairsss");
          // console.log(
          //   schedules.reduce((acc, cur) => ({ ...acc, ...cur }), {}),
          //   "schedulessss"
          // );
         

          form.setFieldsValue({
            fullName: userData.fullName,
            email: userData.email,
            gender: userData.gender,
            phone: userData.phone,
            address: userData.address,
            dayOfBirth: birthDay,
            avatar: userData.avatar,
            serviceHairs: serviceHairs.map((service) => service.serviceName),
            // serviceHairs:
            //   serviceHairs === null ? "Did not have any service" : serviceHairs,
            // schedules:
            //   schedules === null ? "Did not have any service" : schedules,
            // ...schedules.reduce((acc, cur) => ({ ...acc, ...cur }), {}),
          });
          setSelectedServices(serviceHairs);
        } else {
          console.log("Chạy cl");
        }
        // setSalonId(res.data.salonInformationId);
      })
      .catch((err) => {
        console.log(err, "errors");
      });
    ServiceHairServices.getServiceHairBySalonInformationId(id)
      .then((res) => {
        setServicesList(res.data);
        console.log(res.data, "servicehair salon");
      })
      .catch((err) => {
        console.log(err, "errrors");
      });

    // axios
    //   .get(
    //     employeeId === accountEmployeeDetail?.id
    //       ? ACCOUNT_URL
    //       : EMPLOYEESDETAILS_URL + employeeId
    //   ).then((res) => {
    //     // const userAccount = res.data.id === id;
    //     const userData = res.data;
    //     setUser(res.data);
    //     // console.log(res.data);
    //     if (userData) {
    //       const birthDay = dayjs(userData.dayOfBirth); //set the value type to the value type of DatePicker component ant design, Date Library in Ant design config by dayjs library
    //       // console.log(birthDay, "birthDay");
    //       // const schedules = userData.schedules.map(
    //       //   ({ dayOfWeek }) => dayOfWeek
    //       // );
    //       const convertedSchedule = [];
    //       schedules.dayOfWeek.forEach((day) => {
    //         const dayData = {
    //           DayOfWeek: day,
    //           StartTime: "00:00",
    //           EndTime: "00:00",
    //           IsActive: false,
    //         };

    //         const dayInfo = schedules.dayOfWeek[day.toLowerCase()];
    //         if (
    //           dayInfo &&
    //           dayInfo.start !== "00:00" &&
    //           dayInfo.end !== "00:00"
    //         ) {
    //           dayData.StartTime = dayInfo.start;
    //           dayData.EndTime = dayInfo.end;
    //           dayData.IsActive = true;
    //         }

    //         convertedSchedule.push(dayData);
    //       });

    //       const serviceHairs = userData.serviceHairs.map(
    //         ({ description }) => description
    //       );
    //       console.log(serviceHairs, "serviceHairsss");
    //       console.log(
    //         schedules.reduce((acc, cur) => ({ ...acc, ...cur }), {}),
    //         "schedulessss"
    //       );
    //       form.setFieldsValue({
    //         fullName: userData.fullName,
    //         email: userData.email,
    //         gender: userData.gender,
    //         phone: userData.phone,
    //         address: userData.address,
    //         dayOfBirth: birthDay,
    //         avatar: userData.avatar,
    //         serviceHairs:
    //           serviceHairs === null ? "Did not have any service" : serviceHairs,
    //         // schedules:
    //         //   schedules === null ? "Did not have any service" : schedules,
    //         ...schedules.reduce((acc, cur) => ({ ...acc, ...cur }), {}),
    //       });
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err, "errors");
    //   });
    // .then((res) => {
    //   // const userAccount = res.data.id === id;
    //   const userData = res.data;
    //   setUser(res.data);
    //   // console.log(res.data);
    //   if (userData) {
    //     const birthDay = dayjs(userData.dayOfBirth); //set the value type to the value type of DatePicker component ant design, Date Library in Ant design config by dayjs library
    //     // console.log(birthDay, "birthDay");
    //     // const schedules = userData.schedules.map(
    //     //   ({ dayOfWeek }) => dayOfWeek
    //     // );
    //     const convertedSchedule = [];
    //     schedules.dayOfWeek.forEach((day) => {
    //       const dayData = {
    //         DayOfWeek: day,
    //         StartTime: "00:00",
    //         EndTime: "00:00",
    //         IsActive: false,
    //       };

    //       const dayInfo = schedules.dayOfWeek[day.toLowerCase()];
    //       if (
    //         dayInfo &&
    //         dayInfo.start !== "00:00" &&
    //         dayInfo.end !== "00:00"
    //       ) {
    //         dayData.StartTime = dayInfo.start;
    //         dayData.EndTime = dayInfo.end;
    //         dayData.IsActive = true;
    //       }

    //       convertedSchedule.push(dayData);
    //     });

    //     const serviceHairs = userData.serviceHairs.map(
    //       ({ description }) => description
    //     );
    //     console.log(serviceHairs, "serviceHairsss");
    //     console.log(
    //       schedules.reduce((acc, cur) => ({ ...acc, ...cur }), {}),
    //       "schedulessss"
    //     );
    //     form.setFieldsValue({
    //       fullName: userData.fullName,
    //       email: userData.email,
    //       gender: userData.gender,
    //       phone: userData.phone,
    //       address: userData.address,
    //       dayOfBirth: birthDay,
    //       avatar: userData.avatar,
    //       serviceHairs:
    //         serviceHairs === null ? "Did not have any service" : serviceHairs,
    //       // schedules:
    //       //   schedules === null ? "Did not have any service" : schedules,
    //       ...schedules.reduce((acc, cur) => ({ ...acc, ...cur }), {}),
    //     });
    //   }
    // })
    // .catch((err) => {
    //   console.log(err, "errors");
    // });
  }, [employeeId]);
  console.log(schedules);

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

  const handleDayOffChange = (day) => {
    setDayOff((prevDayOff) => ({
      ...prevDayOff,
      [day]: !prevDayOff[day],
    }));
  };

  const onFinish = async (item) => {
    const gender = await form.getFieldValue("gender");
    const phone = await form.getFieldValue("phone");
    console.log("gender", gender);
    console.log("finish");
    console.log("item", item);
    const imageFile = fileList.length > 0 ? fileList[0].originFileObj : null;
    const formData = await new FormData();
    // formData.append("id", employeeId);
    await formData.append("SalonInformationId", id);
    await formData.append("Gender", gender);
    await formData.append("Img", imageFile);
    await formData.append("Phone", phone);
    await formData.append("IsActive", true);

    await axios
      .put(EMPLOYEESDETAILS_URL_UPDATE + `${employeeId}`, formData)
      .then((res) => {
        navigate(`/list_barber_employees/${id}`);
        dispatch(actGetAllEmployees(id));
        message.success("Chỉnh sửa thông tin nhân viên thành công");
        console.log(res, "res neeeee");
      })
      .catch((err) => message.error(err));
  };

  // console.log(user, "user Ne");
  const handleEdit = async () => {
    const imageFile = fileList.length > 0 ? fileList[0].originFileObj : null;
    const formData = new FormData();
    console.log(form.name);
    console.log("phone", form.phone);
    // formData.append("id", employeeId);
    await formData.append("SalonInformationId", id);
    await formData.append("Gender", form.gender);
    await formData.append("Img", imageFile);
    await formData.append("Phone", form.phone);
    await formData.append("IsActive", true);

    await axios
      .put(EMPLOYEESDETAILS_URL_UPDATE + `${employeeId}`, formData)
      .then((res) => {
        navigate(`/list_barber_employees/${id}`);
        dispatch(actGetAllEmployees(id));
        message.success("Chỉnh sửa thông tin nhân viên thành công");
        console.log(res, "res neeeee");
      })
      .catch((err) => message.error(err));
  };

  const handleUploadChange = ({ fileList }) => setFileList(fileList);

  return (
    <div>
      <div
        style={{
          marginTop: "140px",
          marginLeft: "250px",
          marginRight: "250px",
        }}
      >
        {/* <AccountForm id={id} user={user} /> */}
        {/* if id === accountDetail.id, Employee Account will be rendered */}
        <>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={handleEdit} type="primary">
              Chỉnh sửa nhưng không chỉnh sửa lịch làm
            </Button>
          </div>
          <Flex justify="center">
            <Card className="bg-slate-100">
              <Space
                align="center"
                className="w-[80rem]"
                size={2}
                direction="vertical"
              >
                <Avatar
                  size={250}
                  shape="circle"
                  src={
                    user?.img ||
                    "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg"
                  }
                />
                {fileList.map((file) => (
                  <div
                    key={file.uid}
                    style={{
                      maxHeight: "50rem",
                      maxWidth: "50rem",
                      marginTop: "2rem",
                    }}
                  >
                    <Image
                      width={400}
                      // key={file.uid} //because div already have key, don't need here
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
                  // disabled={isEdit}
                  className="w-[50rem]"
                  id={employeeId}
                  form={form}
                  // wrapperCol={{ span: 14, offset: 4 }}
                  layout="vertical"
                  onFinish={onFinish}
                  autoComplete="off"
                >
                  <Form.Item
                    name="image"
                    label="Tải hình ảnh lên"
                    // rules={[{ required: true }]}
                    tooltip="Add only one Image!"
                  >
                    <Upload
                      multiple
                      listType="picture"
                      fileList={fileList} //array added image
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
                  <Form.Item
                    label="Giới tính:"
                    name="gender"
                    // rules={[
                    //   { required: true, message: "Vui lòng không để trống!" },
                    // ]}
                  >
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
                  <Form.Item
                    label="Dịch vụ:"
                    name="serviceHairs"
                    rules={[
                      { required: true, message: "Vui lòng chọn dịch vụ!" },
                    ]}
                  >
                    <Select
                      mode="multiple"
                      disabled={true}
                      placeholder="Chọn dịch vụ"
                      value={selectedServices.map((s) => s.serviceName)}
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
                  </Form.Item>
                  {/* <Form.Item
                    label="Lịch trình:"
                    name="schedules"
                    rules={[
                      { required: true, message: "Vui lòng chọn lịch trình!" },
                    ]}
                  >
                    <Select mode="multiple" placeholder="Select Service">
                      {schedules?.map((schedule) => (
                        <Select.Option key={schedule.id} value={schedule.id}>
                          {schedule.dayOfWeek}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item> */}
                  <Form.Item>
                    <Button type="primary" onClick={handleCheckSchedule}>
                      Kiểm tra lịch làm
                    </Button>
                  </Form.Item>
                  {schedules?.map((day) => (
                    <Space
                      key={day.id}
                      direction="vertical"
                      style={{ marginBottom: 10, marginLeft: 20 }}
                    >
                      {/* Các trường schedule như đã có */}
                      <Checkbox
                        onChange={() => handleDayOffChange(day.dayOfWeek)}
                        checked={dayOff[day.dayOfWeek]}
                      >
                        {day.dayOfWeek} Day Off
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
                          name={[day.dayOfWeek, "start"]}
                          label={`Start Time (${day.dayOfWeek})`}
                          // rules={[
                          //   {
                          //     required: !dayOff[day],
                          //     message: `Please select start time for ${day.dayOfWeek}`,
                          //   },
                          // ]}
                        >
                          <TimePicker
                            format="HH:mm"
                            disabled={
                              !editableStates[day.id] || dayOff[day.dayOfWeek]
                            }
                          />
                        </Form.Item>
                        <Form.Item
                          name={[day.dayOfWeek, "end"]}
                          label={`End Time (${day.dayOfWeek})`}
                          // rules={[
                          //   {
                          //     required: !dayOff[day.dayOfWeek],
                          //     message: `Please select end time for ${day.dayOfWeek}`,
                          //   },
                          // ]}
                        >
                          <TimePicker
                            format="HH:mm"
                            disabled={
                              !editableStates[day.id] || dayOff[day.dayOfWeek]
                            }
                          />
                        </Form.Item>
                      </Space>
                    </Space>
                  ))}

                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Hoàn tất
                    </Button>
                  </Form.Item>
                </Form>
              </Space>
            </Card>
          </Flex>
        </>
      </div>
    </div>
  );
}

export default AccountPage;
