import { UploadOutlined } from "@ant-design/icons";
import {
  GoogleMap,
  LoadScript,
  StandaloneSearchBox,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Flex,
  Form,
  Image,
  Input,
  message,
  Popconfirm,
  Row,
  Spin,
  TimePicker,
  Typography,
  Upload,
  Modal,
  Select,
} from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import "../../css/Salonform.css";
import {
  actGetSalonInformationByOwnerId,
  actPostCreateSalonInformation,
  actPutSalonInformationByOwnerId,
  actPutSalonScheduleByOwnerId,
} from "../../store/salonInformation/action";
import Loader from "../Loader";
import { fullNamePattern } from "../Regex/Patterns";
const { Option } = Select;
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
  const [activeButtons, setActiveButtons] = useState({});

  const [coordinates, setCoordinates] = useState({
    Longitude: "",
    Latitude: "",
  });
  const userName = useSelector((state) => state.ACCOUNT.userName);
  const idCustomer = useSelector((state) => state.ACCOUNT.idCustomer);
  const defaultCenter = {
    lat: 10.762622,
    lng: 106.660172,
  };

  // Tạo state để lưu vị trí được chọn
  const [selectedPosition, setSelectedPosition] = useState(defaultCenter);
  const [autocomplete, setAutocomplete] = useState(null);
  const [address, setAddress] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filteredResults, setFilteredResults] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  console.log("see1", autocomplete);
  const geocodeLatLng = async (lat, lng) => {
    try {
      const geocoder = new window.google.maps.Geocoder();
      const response = await geocoder.geocode({ location: { lat, lng } });
      console.log("test", response);

      if (response.results.length > 0) {
        // Lọc kết quả dựa trên types
        const filteredResults1 = response.results.filter((result) =>
          result.types.some((type) => type === "hair_care" || type === "health")
        );
        const filteredResults = response.results;
        console.log("te", filteredResults);
        if (filteredResults1.length > 0) {
          message.success("Chúc mừng tiệm của bạn đã có trên maps google");
        } else {
          message.info(
            "Tiệm của bạn chưa có thông tin trên maps google. Chúng tôi sẽ giúp bạn"
          );
        }
        if (filteredResults.length > 0) {
          // message.success("Chúc mừng tiệm của bạn đã có trên maps google");
          // Trả về kết quả đã lọc
          return filteredResults;
        } else {
          // message.info(
          //   "Tiệm của bạn chưa có thông tin trên maps google. Chúng tôi sẽ giúp bạn"
          // );
          console.error("Không tìm thấy thông tin địa chỉ với loại mong muốn.");
          return [];
        }
      } else {
        console.error("Không tìm thấy thông tin địa chỉ.");
        return [];
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin địa chỉ:", error);
      return [];
    }
  };

  // const handleMapClick = (event) => {
  //   setSelectedPosition({
  //     lat: event.latLng.lat(),
  //     lng: event.latLng.lng(),
  //   });
  // };
  const handleMapClick = async (event) => {
    // Bước 1: Lấy tọa độ từ sự kiện click
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    // Bước 2: Cập nhật vị trí đã chọn vào state
    setSelectedPosition({ lat, lng });
    console.log("lat", lat);
    console.log("lng", lng);

    // Bước 3: Gọi hàm geocode để lấy thông tin địa chỉ từ tọa độ
    const geocodeResult = await geocodeLatLng(lat, lng);
    if (geocodeResult) {
      // Bước 4: Lưu địa chỉ vào state hoặc xử lý theo nhu cầu
      setFilteredResults(geocodeResult); // Lưu kết quả lọc vào state
      setIsModalVisible(true); // Hiển thị modal
    }
  };
  console.log("ad", address);

  console.log("see", selectedPosition);
  const handleOk = () => {
    // Xử lý logic khi chọn xong option
    console.log("Selected Address:", selectedAddress);
    // Đóng modal
    form.setFieldsValue({ location: selectedAddress });
    setIsModalVisible(false);
  };

  const handleCancelMap = () => {
    // Đóng modal mà không cần xử lý thêm
    setIsModalVisible(false);
  };

  const handleSelectChange = (value) => {
    // Lưu địa chỉ đã chọn vào state
    setSelectedAddress(value);
    console.log("value", value);
  };
  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      console.log("place", place);

      if (place.geometry) {
        setSelectedPosition({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
      }
    }
  };
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
      message.error("Vui lòng điền thông tin!");
      return;
    }
    const convertedSchedules = convertScheduleFormat(formattedSchedules);
    formData.append("OwnerId", ownerId);
    formData.append("Name", upperCaseName);
    formData.append("Address", location);
    formData.append("Description", description);
    formData.append("Img", imageFile);
    // setSelectedPosition({ lat, lng });
    formData.append("Longitude", selectedPosition?.lng);
    formData.append("Latitude", selectedPosition?.lat);

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
    console.log("places", places);

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
  // const handlePlacesChanged = async () => {
  //   const places = searchBoxRef.current.getPlaces();
  //   console.log("places", places);

  //   if (places.length > 0) {
  //     const place = places[0];

  //     // Check for types in the place
  //     const types = place.types || [];
  //     const hasValidType =
  //       types.includes("hair_care") ||
  //       types.includes("health") ||
  //       types.includes("street_address");

  //     if (hasValidType) {
  //       message.info("Địa điểm của bạn đã có trên map.");
  //     } else {
  //       message.warning("Tiệm của bạn chưa có trên map.");
  //     }

  //     // Construct location from name and formatted_address
  //     let location = place.formatted_address; // Default to formatted_address
  //     if (place.name) {
  //       location = `${place.name}, ${location}`; // Prepend name if it exists
  //     }

  //     // Set the combined location
  //     form.setFieldsValue({ location });

  //     console.log("Combined Location:", location);

  //     try {
  //       // API call logic remains the same
  //       const response = await axios.get(
  //         "https://maps.googleapis.com/maps/api/geocode/json",
  //         {
  //           params: {
  //             address: encodeURIComponent(location),
  //             key: import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY,
  //           },
  //         }
  //       );

  //       const { results } = response.data;
  //       console.log("re", results);

  //       if (results && results.length > 0) {
  //         const { location: coords } = results[0].geometry;
  //         console.log("lo", coords);

  //         setCoordinates({
  //           Longitude: coords.lng,
  //           Latitude: coords.lat,
  //         });

  //         console.log("Tọa độ:", {
  //           Longitude: coords.lng,
  //           Latitude: coords.lat,
  //         });
  //       } else {
  //         message.error("No coordinates found for the given address.");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching coordinates:", error);
  //       message.error("Failed to fetch coordinates.");
  //     }
  //   } else {
  //     console.error("No places found");
  //   }
  // };

  const handleFieldChange = (dayValue) => {
    setActiveButtons({ ...activeButtons, [dayValue]: true });
  };
  const getLabelByDay = (dayValue) => {
    const day = daysOfWeek.find((d) => d.value === dayValue);
    return day ? day.label : null; // Return the label if found, otherwise null
  };
  function formatTimeCustom(time) {
    const hours = time.hour.toString().padStart(2, "0");
    const minutes = time.minute.toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }
  const handleConfirm = async (day) => {
    setLoading(true);
    let start = form.getFieldValue([day, "start"]);
    let end = form.getFieldValue([day, "end"]);
    let formattedStart = "";
    let formattedEnd = "";

    if (start && end) {
      if (dayOff[day]) {
        // If it's a day off, set start and end times to 00:00
        formattedStart = { hour: 0, minute: 0 };
        formattedEnd = { hour: 0, minute: 0 };
      } else {
        formattedStart = {
          hour: start.hour(),
          minute: start.minute(),
        };

        formattedEnd = {
          hour: end.hour(),
          minute: end.minute(),
        };
      }
      const capitalizedDay = (await day.charAt(0).toUpperCase()) + day.slice(1);
      const startTimeString = await formatTimeCustom(formattedStart);
      const endTimeString = await formatTimeCustom(formattedEnd);
      const data = {
        dayofWeeks: capitalizedDay,
        startTime: startTimeString,
        endTime: endTimeString,
        isActive: true,
      };
      const dayLabel = await getLabelByDay(day);
      dispatch(
        actPutSalonScheduleByOwnerId(
          salonDetail?.id,
          data,
          salonDetail?.salonOwner?.id
        )
      )
        .then((res) => {
          setLoading(false);
          message.success(
            `Cập nhật lịch làm ${dayLabel} thành công cho nhân viên ${salonDetail?.name}`
          );
          setDayOff({ ...dayOff, [day]: false });
          setActiveButtons({});
        })
        .catch((err) => {
          setDayOff({ ...dayOff, [day]: false });
          message.error(
            `Cập nhật lịch làm ${dayLabel} thất bại cho nhân viên ${salonDetail?.name}`
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
  // handleCancel function: Reset the changes and disable the button
  const handleCancel = (dayValue) => {
    // Disable the button since no changes are confirmed
    setActiveButtons({ ...activeButtons, [dayValue]: false });
    setDayOff({ ...dayOff, [dayValue]: false });
    const initialSchedule = salonDetail?.schedules?.find(
      (item) => item.dayOfWeek.toLowerCase() === dayValue.toLowerCase()
    );
    form.setFieldsValue({
      [dayValue]: {
        start: initialSchedule
          ? dayjs(initialSchedule.startTime, "HH:mm")
          : dayjs("07:00", formatTime), // Reset start time
        end: initialSchedule
          ? dayjs(initialSchedule.endTime, "HH:mm")
          : dayjs("17:00", formatTime), // Reset end time
      },
    });
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
            // rules={[
            //   {
            //     required: !dayOff[day.value],
            //     message: "Phải có thời gian bắt đầu trừ khi đó là ngày nghỉ!",
            //   },
            //   ({ getFieldValue }) => ({
            //     validator(_, value) {
            //       const endTime = getFieldValue([day.value, "end"]);
            //       if (!value || !endTime || value.isBefore(endTime)) {
            //         return Promise.resolve();
            //       }
            //       return Promise.reject(
            //         new Error(
            //           "Thời gian bắt đầu phải trước thời gian kết thúc!"
            //         )
            //       );
            //     },
            //   }),
            // ]}
            rules={[
              {
                required: !dayOff[day.value],
                message: "Phải có thời gian bắt đầu trừ khi đó là ngày nghỉ!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const endTime = getFieldValue([day.value, "end"]);

                  // Sử dụng dayjs để kiểm tra
                  if (
                    (value &&
                      endTime &&
                      dayjs(value).isSame(dayjs("00:00", "HH:mm"), "minute") &&
                      dayjs(endTime).isSame(
                        dayjs("00:00", "HH:mm"),
                        "minute"
                      )) ||
                    !value ||
                    !endTime ||
                    dayjs(value).isBefore(dayjs(endTime))
                  ) {
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
              onChange={() => handleFieldChange(day.value)} // Track changes
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            initialValue={initialTimeValue.add(10, "hour")}
            name={[day.value, "end"]}
            label={`${day.label} kết thúc`}
            dependencies={[[day.value, "start"]]}
            // rules={[
            //   {
            //     required: !dayOff[day.value],
            //     message:
            //       "Cần phải có thời gian kết thúc trừ khi đó là ngày nghỉ!",
            //   },
            //   ({ getFieldValue }) => ({
            //     validator(_, value) {
            //       const startTime = getFieldValue([day.value, "start"]);
            //       if (!value || !startTime || value.isAfter(startTime)) {
            //         return Promise.resolve();
            //       }
            //       return Promise.reject(
            //         new Error("Thời gian kết thúc phải sau thời gian bắt đầu!")
            //       );
            //     },
            //   }),
            // ]}
            rules={[
              {
                required: !dayOff[day.value],
                message:
                  "Cần phải có thời gian kết thúc trừ khi đó là ngày nghỉ!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const startTime = getFieldValue([day.value, "start"]);

                  // Sử dụng dayjs để kiểm tra
                  if (
                    (startTime &&
                      value &&
                      dayjs(startTime).isSame(
                        dayjs("00:00", "HH:mm"),
                        "minute"
                      ) &&
                      dayjs(value).isSame(dayjs("00:00", "HH:mm"), "minute")) ||
                    !value ||
                    !startTime ||
                    dayjs(value).isAfter(dayjs(startTime))
                  ) {
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
              onChange={() => handleFieldChange(day.value)} // Track changes
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Checkbox
            onChange={(e) => {
              setDayOff({ ...dayOff, [day.value]: e.target.checked });
              handleFieldChange(day.value); // Track changes
            }}
            checked={dayOff[day.value]}
          >
            Ngày nghỉ
          </Checkbox>
          {id && (
            <Popconfirm
              title="Bạn có chắc chắn muốn sửa đổi không?"
              onConfirm={() => handleConfirm(day.value)}
              onCancel={() => handleCancel(day.value)}
              okText="Có"
              cancelText="Hủy"
            >
              <Button
                style={{ backgroundColor: "#BF9456" }}
                htmlType="submit"
                disabled={!activeButtons[day.value]}
              >
                Chỉnh sửa
              </Button>
            </Popconfirm>
          )}
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
  const handleChangeSalon = async () => {
    setLoading(true);
    // const { name, location, description, ...schedules } = values;
    const name = await form.getFieldValue("name");
    const location = await form.getFieldValue("location");
    const description = await form.getFieldValue("description");

    const upperCaseName = name.toUpperCase();
    const imageFile = fileList.length > 0 ? fileList[0].originFileObj : null;
    if (
      // !imageFile ||
      !name ||
      !location ||
      !description
    ) {
      setLoading(false);
      message.error("Vui lòng điền thông tin!");
      return;
    }
    const formData = new FormData();
    // formData.append("OwnerId", ownerId);
    formData.append("Name", upperCaseName);
    formData.append("Address", location);
    formData.append("Description", description);
    formData.append("Image", imageFile);
    formData.append("Longitude", coordinates?.Longitude);
    formData.append("Latitude", coordinates?.Latitude);

    dispatch(
      actPutSalonInformationByOwnerId(
        salonDetail?.id,
        formData,
        salonDetail?.salonOwner?.id
      )
    )
      .then((res) => {
        setLoading(false);
        message.success(`Đã cập nhật salon ${salonDetail?.name} thành công`);
      })
      .catch((err) => {
        message.error(`Đã cập nhật salon ${salonDetail?.name} thất bại`);
      })
      .finally((err) => {
        setLoading(false);
      });
  };
  const handleCancelChangeSalon = () => {
    setFileList([
      { uid: "-1", name: "image.png", status: "done", url: salonDetail.img },
    ]);
    form.setFieldsValue({
      name: salonDetail.name,
      location: salonDetail.address,
      description: salonDetail.description,
      // ...daysOfWeek.reduce((acc, day) => {
      //   const schedule = salonDetail?.schedules?.find(
      //     (item) => item.dayOfWeek.toLowerCase() === day.value.toLowerCase()
      //   );
      //   acc[day.value] = {
      //     start: schedule ? dayjs(schedule.startTime, "HH:mm") : null,
      //     end: schedule ? dayjs(schedule.endTime, "HH:mm") : null,
      //   };
      //   return acc;
      // }, {}),
    });
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
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "400px" }}
          center={selectedPosition}
          zoom={15}
          onClick={handleMapClick} // Bắt sự kiện click để chọn vị trí
        >
          <Autocomplete
            onLoad={(autocompleteInstance) =>
              setAutocomplete(autocompleteInstance)
            }
            onPlaceChanged={onPlaceChanged}
          >
            <input
              type="text"
              placeholder="Tìm kiếm địa điểm"
              style={{
                boxSizing: "border-box",
                border: "1px solid transparent",
                width: "240px",
                height: "32px",
                padding: "0 12px",
                borderRadius: "3px",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
                fontSize: "14px",
                outline: "none",
                textOverflow: "ellipses",
                position: "absolute",
                left: "50%",
                top: "10px",
                marginLeft: "-120px",
              }}
            />
          </Autocomplete>

          <Marker position={selectedPosition} />
        </GoogleMap>
        <Modal
          title="Chọn Địa Chỉ"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancelMap}
        >
          <Select
            style={{ width: "100%" }}
            placeholder="Chọn địa chỉ"
            onChange={handleSelectChange}
          >
            {filteredResults.map((result, index) => (
              <Option key={index} value={result.formatted_address}>
                {result.formatted_address}
              </Option>
            ))}
          </Select>
        </Modal>
        {form && (
          <Card
            style={{ backgroundColor: "#ece8de" }}
            title={
              <Flex justify="space-between" align="center">
                <Typography.Title
                  level={4}
                  style={{ backgroundColor: "#bf9456" }}
                  className=" p-3 mt-3 border border2 rounded-md text-slate-500 hover:text-white transition ease-in-out hover:-translate-y-1 hover:scale-105 duration-300"
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
                    width={"20rem"}
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
                {/* <StandaloneSearchBox
                  onLoad={(ref) => (searchBoxRef.current = ref)}
                  onPlacesChanged={handlePlacesChanged}
                > */}
                <Form.Item
                  name="location"
                  label="Địa chỉ"
                  rules={[{ required: true }]}
                >
                  <Input readOnly placeholder="Điền vị trí" />
                </Form.Item>
                {/* </StandaloneSearchBox> */}
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

                <Form.Item
                  name="description"
                  label="Mô tả"
                  rules={[{ required: true }]}
                >
                  <Input.TextArea placeholder="Điền mô tả" />
                </Form.Item>
                <Form.Item>
                  <Popconfirm
                    title={
                      id
                        ? "Bạn có chắc muốn chỉnh sửa thông tin salon?"
                        : "Bạn có chắc muốn tạo salon?"
                    }
                    onConfirm={handleChangeSalon} // This will be triggered when the user clicks "Yes"
                    onCancel={handleCancelChangeSalon}
                    okText="Có"
                    cancelText="Hủy"
                  >
                    <Button
                      style={{ width: "100%", backgroundColor: "#bf9456" }}
                      type="primary"
                      // Removed the direct onClick as it's now handled in Popconfirm
                    >
                      {id ? "Chỉnh sửa thông tin salon" : "Tạo Salon"}
                    </Button>
                  </Popconfirm>
                </Form.Item>

                {renderTimePickers()}
                {!id ? (
                  <Form.Item>
                    <Button
                      style={{ width: "100%", backgroundColor: "#bf9456" }}
                      type="primary"
                      htmlType="submit"
                    >
                      Tạo salon/ baber shop
                    </Button>
                  </Form.Item>
                ) : (
                  <></>
                )}
              </Form>
            </Spin>
          </Card>
        )}
      </LoadScript>
    </div>
  );
};

export default SalonForm;
