import React, { useEffect, useRef, useState } from "react";
import {
  Form,
  Input,
  Button,
  TimePicker,
  Row,
  Col,
  Upload,
  Checkbox,
  message,
  Card,
  Flex,
  Image,
  Typography,
  Spin,
} from "antd";
import "../../css/Salonform.css";
import { UploadOutlined } from "@ant-design/icons";
import moment from "moment";
import { LoadScript, StandaloneSearchBox } from "@react-google-maps/api";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  actGetSalonInformationByOwnerId,
  actPostCreateSalonInformation,
} from "../../store/salonInformation/action";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import Loader from "../Loader";
import { fullNamePattern } from "../Regex/Patterns";

const daysOfWeek = [
  { label: "Thứ hai", value: "monday" },
  { label: "Thứ ba", value: "tuesday" },
  { label: "Thứ tư", value: "wednesday" },
  { label: "Thứ năm", value: "thursday" },
  { label: "Thứ sáu", value: "friday" },
  { label: "Thứ bảy", value: "saturday" },
  { label: "Chủ nhật", value: "sunday" },
];

const libraries = ["places"]; // Load the places library for Places Autocomplete

const SalonForm = ({ onAddSalon, salon, demo }) => {
  const { id } = useParams();

  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [dayOff, setDayOff] = useState({});
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchBoxRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const formatTime = "HH:mm";

  const [coordinates, setCoordinates] = useState({
    Longitude: "",
    Latitude: "",
  });
  const userName = useSelector((state) => state.ACCOUNT.userName);
  const idCustomer = useSelector((state) => state.ACCOUNT.idCustomer);
  const ownerId = useSelector((state) => state.ACCOUNT.idOwner);
  const uid = useSelector((state) => state.ACCOUNT.uid);
  const salonDetail = useSelector(
    (state) => state.SALONINFORMATION.getSalonByOwnerId
  );
  useEffect(() => {
    if (ownerId) {
      dispatch(actGetSalonInformationByOwnerId(ownerId));
    }
  }, [ownerId]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!isApiLoaded) {
        window.location.reload();
      }
    }, 1000); // 5 seconds timeout

    return () => clearTimeout(timeoutId);
  }, [isApiLoaded]);

  useEffect(() => {
    if (id && salonDetail.img) {
      setFileList([
        { uid: "-1", name: "image.png", status: "done", url: salonDetail.img },
      ]);
      form.setFieldsValue({
        name: salonDetail.name,
        location: salonDetail.address,
        description: salonDetail.description,
        ...daysOfWeek.reduce((acc, day) => {
          const schedule = salonDetail?.schedules?.find(
            (item) => item.dayOfWeek.toLowerCase() === day.value.toLowerCase()
          );
          acc[day.value] = {
            start: schedule ? dayjs(schedule.startTime, "HH:mm") : null,
            end: schedule ? dayjs(schedule.endTime, "HH:mm") : null,
          };
          return acc;
        }, {}),
      });
    }
  }, [id, salonDetail, form]);

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

  const onFinish = async (values) => {
    const { name, location, description, ...schedules } = values;
    const formattedSchedules = {};
    const upperCaseName = name.toUpperCase();

    for (const day in schedules) {
      if (!dayOff[day]) {
        if (schedules[day]?.start && schedules[day]?.end) {
          formattedSchedules[day] = {
            start: schedules[day].start.format("HH:mm"),
            end: schedules[day].end.format("HH:mm"),
          };
        }
      } else {
        formattedSchedules[day] = {
          start: "00:00",
          end: "00:00",
        };
      }
    }

    const formData = new FormData();
    const imageFile = fileList.length > 0 ? fileList[0].originFileObj : null;

    if (
      !imageFile ||
      !upperCaseName ||
      !location ||
      !coordinates.Longitude ||
      !coordinates.Latitude ||
      !description ||
      Object.keys(formattedSchedules).length === 0
    ) {
      console.error("Required fields are missing.");
      message.error("Required fields are missing.");
      return;
    }
    const convertedSchedules = convertScheduleFormat(formattedSchedules);
    formData.append("OwnerId", ownerId);
    formData.append("Name", upperCaseName);
    formData.append("Address", location);
    formData.append("Description", description);
    formData.append("Img", imageFile);
    formData.append("Longitude", coordinates?.Longitude);
    formData.append("Latitude", coordinates?.Latitude);

    convertedSchedules.forEach((schedule, index) => {
      formData.append(
        `SalonInformationSchedules[${index}].DayOfWeek`,
        schedule.DayOfWeek
      );
      formData.append(
        `SalonInformationSchedules[${index}].StartTime`,
        schedule.StartTime
      );
      formData.append(
        `SalonInformationSchedules[${index}].EndTime`,
        schedule.EndTime
      );
      formData.append(
        `SalonInformationSchedules[${index}].IsActive`,
        schedule.IsActive
      );
    });

    const asyncOnFinish = async () => {
      setLoading(true);
      try {
        await dispatch(actPostCreateSalonInformation(formData)).then((res) => {
          message.success("Tạo salon thành công");
          navigate("/list_shop");
        });
      } catch (error) {
        console.error("Error occurred:", error);
      } finally {
        setLoading(false);
      }
    };

    await asyncOnFinish();
    onAddSalon(formData, formattedSchedules);

    form.resetFields();
    setFileList("");
    setDayOff({});
  };

  const handlePlacesChanged = async () => {
    const places = searchBoxRef.current.getPlaces();
    if (places.length > 0) {
      const place = places[0];
      if (place && place.formatted_address) {
        form.setFieldsValue({ location: place.formatted_address });
        try {
          const response = await axios.get(
            "https://maps.googleapis.com/maps/api/geocode/json",
            {
              params: {
                address: place.formatted_address,
                key: import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY, // Replace with your API key
              },
            }
          );

          const { results } = response.data;
          if (results && results.length > 0) {
            const { location } = results[0].geometry;
            setCoordinates({
              Longitude: location.lng,
              Latitude: location.lat,
            });
          } else {
            message.error("No coordinates found for the given address.");
          }
        } catch (error) {
          console.error("Error fetching coordinates:", error);
          message.error("Failed to fetch coordinates.");
        }
      } else {
        console.error("Invalid place or formatted address");
      }
    } else {
      console.error("No places found");
    }
  };
  const renderTimePickers = () => {
    const initialTimeValue = dayjs("07:00", formatTime);

    return daysOfWeek.map((day) => (
      <Row key={day.value} gutter={16} align="middle">
        <Col span={8}>
          <Form.Item
            initialValue={initialTimeValue}
            name={[day.value, "start"]}
            label={`${day.label} bắt đầu`}
            dependencies={[[day.value, "end"]]}
            rules={[
              {
                required: !dayOff[day.value],
                message: "Phải có thời gian bắt đầu trừ khi đó là ngày nghỉ!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const endTime = getFieldValue([day.value, "end"]);
                  if (!value || !endTime || value.isBefore(endTime)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "Thời gian bắt đầu phải trước thời gian kết thúc!"
                    )
                  );
                },
              }),
            ]}
          >
            <TimePicker
              minuteStep={15}
              format={formatTime}
              disabled={dayOff[day.value]}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            initialValue={initialTimeValue.add(10, "hour")}
            name={[day.value, "end"]}
            label={`${day.label} kết thúc`}
            dependencies={[[day.value, "start"]]}
            rules={[
              {
                required: !dayOff[day.value],
                message:
                  "Cần phải có thời gian kết thúc trừ khi đó là ngày nghỉ!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const startTime = getFieldValue([day.value, "start"]);
                  if (!value || !startTime || value.isAfter(startTime)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Thời gian kết thúc phải sau thời gian bắt đầu!")
                  );
                },
              }),
            ]}
          >
            <TimePicker
              minuteStep={15}
              format={formatTime}
              disabled={dayOff[day.value]}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Checkbox
            onChange={(e) =>
              setDayOff({ ...dayOff, [day.value]: e.target.checked })
            }
            checked={dayOff[day.value]}
          >
            Ngày nghỉ
          </Checkbox>
        </Col>
      </Row>
    ));
  };

  const handleUploadChange = ({ fileList: newFileList }) => {
    // Chỉ lấy phần tử cuối cùng trong danh sách fileList
    const newFile = newFileList.slice(-1);
    setFileList(newFile);
  };
  const uploadProps = {
    fileList,
    onChange: handleUploadChange,
    beforeUpload: (file) => {
      setFileList([]);
      return false;
    },
  };

  return (
    <div className="container_list" style={{ marginBottom: "2rem" }}>
      <LoadScript
        googleMapsApiKey={`${
          import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY
        }&loading=async`}
        libraries={libraries}
        loadingElement={
          <div className="overlay">
            <Loader />
          </div>
        }
        onLoad={() => setIsApiLoaded(true)}
      >
        {form && (
          <Card
            style={{ backgroundColor: "#ece8de" }}
            title={
              <Flex justify="space-between" align="center">
                {/* -translate-y-1: căng thêm trên dưới vì trục y, scale-105: phóng to content thêm 5 vì 100 là cơ bản, dưới 100 thì thu nhỏ  */}
                <Typography.Title
                  level={4}
                  style={{ backgroundColor: "#bf9456" }}
                  className=" p-3 mt-3 border border2 rounded-md text-slate-500 hover:text-blue-500 transition ease-in-out hover:-translate-y-1 hover:scale-105 duration-300"
                >
                  {salonDetail ? "CHỈNH SỬA TIỆM CỦA BẠN" : "TẠO TIỆM CỦA BẠN"}
                </Typography.Title>
              </Flex>
            }
          >
            <Spin spinning={loading}>
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
                    width={"100%"}
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
              <Form form={form} onFinish={onFinish} layout="vertical">
                <Form.Item
                  name="image"
                  label="Tải hình ảnh lên"
                  rules={[{ required: true }]}
                  tooltip="Add only one Image!"
                >
                  <Upload
                    {...uploadProps}
                    // multiple
                    listType="picture"
                    // fileList={fileList} //array added image
                    // onChange={handleUploadChange}
                    // beforeUpload={() => false}
                  >
                    <Button icon={<UploadOutlined />}>Tải lên</Button>
                  </Upload>
                </Form.Item>
                <Form.Item
                  name="name"
                  label="Tên Salon"
                  rules={[
                    { required: true },
                    {
                      pattern: fullNamePattern,
                      message:
                        "Tên salon của bạn phải ít hơn 26 ký tự và không có ký tự đặc biệt!",
                    },
                  ]}
                >
                  <Input placeholder="Điền tên Salon" />
                </Form.Item>
                <StandaloneSearchBox
                  onLoad={(ref) => (searchBoxRef.current = ref)}
                  onPlacesChanged={handlePlacesChanged}
                >
                  <Form.Item
                    name="location"
                    label="Địa chỉ"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="Điền vị trí" />
                  </Form.Item>
                </StandaloneSearchBox>
                <Form.Item
                  name="description"
                  label="Mô tả"
                  rules={[{ required: true }]}
                >
                  <Input.TextArea placeholder="Điền mô tả" />
                </Form.Item>
                {renderTimePickers()}
                <Form.Item>
                  <Button
                    style={{ width: "100%", backgroundColor: "#bf9456" }}
                    type="primary"
                    htmlType="submit"
                  >
                    {id ? "Chỉnh Salon" : "Tạo Salon"}
                  </Button>
                </Form.Item>
              </Form>
            </Spin>
          </Card>
        )}
      </LoadScript>
    </div>
  );
};

export default SalonForm;
