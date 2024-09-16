import {
  SearchOutlined,
  EnvironmentOutlined,
  CloseCircleOutlined,
  RightOutlined,
  LeftOutlined,
  SortAscendingOutlined,
} from "@ant-design/icons";
import {
  // Button,
  Col,
  Input,
  Row,
  DatePicker,
  Popover,
  Menu,
  Divider,
  Pagination,
  Spin,
  Modal,
  Select,
  Empty,
  message,
  Form,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import styles from "../css/ListSalonVer2.module.css";
import { SalonInformationServices } from "../services/salonInformationServices";
import { ServiceHairServices } from "../services/servicesHairServices";
import { useNavigate } from "react-router-dom";
import { LoadScript, StandaloneSearchBox } from "@react-google-maps/api";
import axios from "axios";
import LoadScriptMap from "../components/LoadScriptMap";
import { motion } from "framer-motion";
import "antd/dist/reset.css";
import "../css/customerAppointmentTable.css";
import Meteors from "@/components/magicui/meteors";
import SparklesText from "@/components/magicui/sparkles-text";

import { set } from "rsuite/esm/internals/utils/date";
import { useTransition } from "@react-spring/web";
const defaultCenter = {
  lat: 10.8231, // Default to Ho Chi Minh City
  lng: 106.6297,
};
const MotionButton = motion.button;
const Button = ({ children, className, ...props }) => (
  <MotionButton
    whileHover={{ scale: 0.9, color: "black" }}
    whileTap={{ scale: 0.9 }}
    transition={{ duration: 0.3 }}
    className={`${styles[className] || ""} ${className}`}
    {...props} // Spread props để truyền tất cả các thuộc tính khác
  >
    {children}
  </MotionButton>
);
const MotionDiv = motion.div;

const vietnamProvinces = [
  { name: "Hà Nội", lat: 21.0285, lng: 105.8542 },
  { name: "Hồ Chí Minh", lat: 10.8231, lng: 106.6297 },
  { name: "Đà Nẵng", lat: 16.0544, lng: 108.2022 },
  { name: "Hải Phòng", lat: 20.8449, lng: 106.6881 },
  { name: "Cần Thơ", lat: 10.0452, lng: 105.7469 },
  { name: "An Giang", lat: 10.5216, lng: 105.1259 },
  { name: "Bà Rịa - Vũng Tàu", lat: 10.5417, lng: 107.2429 },
  { name: "Bắc Giang", lat: 21.273, lng: 106.1946 },
  { name: "Bắc Kạn", lat: 22.1497, lng: 105.834 },
  { name: "Bạc Liêu", lat: 9.2853, lng: 105.7247 },
  { name: "Bắc Ninh", lat: 21.186, lng: 106.0763 },
  { name: "Bến Tre", lat: 10.241, lng: 106.3758 },
  { name: "Bình Định", lat: 13.782, lng: 109.219 },
  { name: "Bình Dương", lat: 11.1731, lng: 106.6666 },
  { name: "Bình Phước", lat: 11.7512, lng: 106.7235 },
  { name: "Bình Thuận", lat: 11.0906, lng: 108.0721 },
  { name: "Cà Mau", lat: 9.1796, lng: 105.15 },
  { name: "Cao Bằng", lat: 22.6668, lng: 106.257 },
  { name: "Đắk Lắk", lat: 12.71, lng: 108.2378 },
  { name: "Đắk Nông", lat: 12.2549, lng: 107.6098 },
  { name: "Điện Biên", lat: 21.386, lng: 103.023 },
  { name: "Đồng Nai", lat: 10.9447, lng: 106.8244 },
  { name: "Đồng Tháp", lat: 10.5359, lng: 105.654 },
  { name: "Gia Lai", lat: 13.8074, lng: 108.1094 },
  { name: "Hà Giang", lat: 22.7656, lng: 104.9113 },
  { name: "Hà Nam", lat: 20.5835, lng: 105.9229 },
  { name: "Hà Tĩnh", lat: 18.355, lng: 105.8877 },
  { name: "Hải Dương", lat: 20.938, lng: 106.3161 },
  { name: "Hậu Giang", lat: 9.784, lng: 105.4701 },
  { name: "Hoà Bình", lat: 20.7087838, lng: 105.0167035 },
  { name: "Hưng Yên", lat: 20.6468, lng: 106.0511 },
  { name: "Khánh Hòa", lat: 12.2586, lng: 109.0526 },
  { name: "Kiên Giang", lat: 10.0159, lng: 105.0809 },
  { name: "Kon Tum", lat: 14.3545, lng: 107.9843 },
  { name: "Lai Châu", lat: 22.3871, lng: 103.4669 },
  { name: "Lâm Đồng", lat: 11.5753, lng: 107.855 },
  { name: "Lạng Sơn", lat: 21.8526, lng: 106.7615 },
  { name: "Lào Cai", lat: 22.338, lng: 104.1487 },
  { name: "Long An", lat: 10.6084, lng: 106.6291 },
  { name: "Nam Định", lat: 20.4375, lng: 106.1746 },
  { name: "Nghệ An", lat: 18.8066, lng: 105.6813 },
  { name: "Ninh Bình", lat: 20.2506, lng: 105.9745 },
  { name: "Ninh Thuận", lat: 11.577, lng: 108.98 },
  { name: "Phú Thọ", lat: 21.3191, lng: 105.2083 },
  { name: "Phú Yên", lat: 13.0884, lng: 109.0929 },
  { name: "Quảng Bình", lat: 17.6103, lng: 106.3487 },
  { name: "Quảng Nam", lat: 15.5394, lng: 108.0191 },
  { name: "Quảng Ngãi", lat: 15.1205, lng: 108.7923 },
  { name: "Quảng Ninh", lat: 21.0042, lng: 107.2925 },
  { name: "Quảng Trị", lat: 16.7416, lng: 107.1855 },
  { name: "Sóc Trăng", lat: 9.6036, lng: 105.9805 },
  { name: "Sơn La", lat: 21.328, lng: 103.9144 },
  { name: "Tây Ninh", lat: 11.3545, lng: 106.1472 },
  { name: "Thái Bình", lat: 20.4463, lng: 106.3361 },
  { name: "Thái Nguyên", lat: 21.592, lng: 105.8442 },
  { name: "Thanh Hóa", lat: 19.8082, lng: 105.7764 },
  { name: "Thừa Thiên Huế", lat: 16.4498, lng: 107.5624 },
  { name: "Tiền Giang", lat: 10.4493, lng: 106.342 },
  { name: "Trà Vinh", lat: 9.9366, lng: 106.3442 },
  { name: "Tuyên Quang", lat: 21.823, lng: 105.213 },
  { name: "Vĩnh Long", lat: 10.2537, lng: 105.9721 },
  { name: "Vĩnh Phúc", lat: 21.3089, lng: 105.6049 },
  { name: "Yên Bái", lat: 21.7229, lng: 104.9113 },
];
function ListSalonVer2(props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [searchVisible, setSearchVisible] = useState(false);
  const [locationVisible, setLocationVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [salonList, setSalonList] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const searchParams = new URLSearchParams(location.search);
  const navigate = useNavigate();
  const servicesNameUrl = searchParams.get("servicesName");
  const salonNameUrl = searchParams.get("salonName");
  const locationSalonUrl = searchParams.get("location");

  console.log("salonList", salonList);

  const [servicesName, setServicesName] = useState(servicesNameUrl || "");
  const [locationSalon, setLocationSalon] = useState(locationSalonUrl || "");
  const [salonName, setSalonName] = useState(salonNameUrl || "");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [distance, setDistance] = useState(10);
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(defaultCenter);

  const scrollContainerRef = useRef(null);

  // const [locationVisible, setLocationVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [locationInput, setLocationInput] = useState("");
  const searchBoxRef = useRef(null);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const libraries = ["places"];
  const [selectedProvince, setSelectedProvince] = useState(locationSalon);
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const [searchBox, setSearchBox] = useState(null);
  const [inputLocation, setInputLocation] = useState(""); // Lưu giá trị nhập vào của vị trí

  const [mapStyle, setMapStyle] = useState({
    height: "500px",
    width: "auto",
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 480) {
        setMapStyle({ height: "250px", width: window.innerWidth - 40 });
      } else if (window.innerWidth <= 768) {
        setMapStyle({ height: "300px", width: window.innerWidth - 40 });
      } else {
        setMapStyle({ height: "300px", width: "auto" });
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial call

    return () => window.removeEventListener("resize", handleResize);
  }, [window.innerWidth]);
  useEffect(() => {
    axios
      .get(
        "https://raw.githubusercontent.com/madnh/hanhchinhvn/master/dist/tinh_tp.json"
      )
      .then((response) => {
        const mapper = Object.values(response.data).map((e) => {
          return { code: e.code, value: e.name, label: e.name };
        });
        setProvinces(mapper);
      })
      .catch((error) => console.error("Error fetching provinces:", error));
  }, []);
  useEffect(() => {
    if (selectedProvince) {
      axios
        .get(
          "https://raw.githubusercontent.com/madnh/hanhchinhvn/master/dist/quan_huyen.json"
        )
        .then((response) => {
          const districtsData = Object.values(response.data).filter(
            (district) => district.path.includes(selectedProvince)
          );
          const mapper = districtsData.map((e) => {
            return { value: e?.name, label: e?.name };
          });

          if (selectedProvince === "Hồ Chí Minh") {
            mapper.push({ value: "9", label: "9" });
          }
          setDistricts(mapper);
        })
        .catch((error) => console.error("Error fetching districts:", error));
    } else {
      setDistricts([]);
    }
  }, [selectedProvince]);

  const handleChange = (value) => {
    // setLoading(true);
    const province = vietnamProvinces.find(
      (province) => province.name === value
    );

    if (province) {
      setCurrentLocation({ lat: province.lat, lng: province.lng });
    } else {
      setCurrentLocation(defaultCenter);
    }

    setSelectedProvince(value);
    setSelectedDistrict("");

    // fetchSalonData();
  };
  const handleChangeDistrict = (value) => {
    setSelectedDistrict(value);
  };
  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const popularServices = (
    <Menu>
      <Menu.Item onClick={() => handleServiceSelect("Cắt tóc")}>
        Cắt tóc
      </Menu.Item>
      <Menu.Item onClick={() => handleServiceSelect("Nhuộm tóc")}>
        Nhuộm tóc
      </Menu.Item>
      <Menu.Item onClick={() => handleServiceSelect("Uốn tóc")}>
        Uốn tóc
      </Menu.Item>
      <Menu.Item onClick={() => handleServiceSelect("Duỗi tóc")}>
        Duỗi tóc
      </Menu.Item>
      <Menu.Item onClick={() => handleServiceSelect("Gội đầu")}>
        Gội đầu
      </Menu.Item>
      <Menu.Item onClick={() => handleServiceSelect("Ráy tay")}>
        Ráy tay
      </Menu.Item>
      <Menu.Item onClick={() => handleServiceSelect("Cạo râu")}>
        Cạo râu
      </Menu.Item>
    </Menu>
  );

  const filterOptions = (
    <Menu>
      <Menu.Item onClick={() => handleFilterSelect("Rating")}>Rating</Menu.Item>
      <Menu.Item onClick={() => handleFilterSelect("Recommended")}>
        Recommended
      </Menu.Item>
    </Menu>
  );

  const handlePlacesChanged = () => {
    const places = searchBoxRef.current.getPlaces();

    if (places.length === 0) return;

    const userInputAddress = locationInput; // This is the full address the user entered

    // Extract a significant part of the user's input to match (e.g., the first few words)
    const userInputAddressPart = userInputAddress.split(",")[0]; // e.g., "91 Đường Hàng Tre"

    // Find the best match in the places array
    const bestPlace =
      places.find((place) => {
        return place.formatted_address.includes(userInputAddressPart);
      }) || places[0]; // Fallback to the first place if no match is found

    const location = bestPlace.formatted_address;

    const lat = bestPlace.geometry.location.lat();
    const lng = bestPlace.geometry.location.lng();

    setLocationInput(location);
    setLatitude(lat);
    setLongitude(lng);
  };

  useEffect(() => {
    fetchSalonData();
  }, [
    currentPage,
    servicesName,
    salonNameUrl,
    // salonName,
    selectedProvince,
    selectedDistrict,
  ]);
  const handSubmitSalonName = () => {
    fetchSalonData();
  };
  const handleServiceSelect = async (service) => {
    try {
      const params = new URLSearchParams(location.search);

      if (service) {
        params.set("servicesName", service);
      } else {
        params.delete("servicesName");
      }
      navigate(`?${params.toString()}`);

      // Chờ đợi fetchSalonData hoàn thành
      await fetchSalonData();
      setServicesName(service);
      setSearchVisible(false);
    } catch (error) {
      console.error("Error fetching salon data:", error);
    }
  };

  const handleClearService = () => {
    // setSelectedService("");
    setServicesName("");
  };

  const handleFilterClick = () => {
    setFilterVisible(!filterVisible);
  };

  const handleFilterSelect = (filter) => {
    setFilterVisible(false);
  };
  const fetchSalonData = async () => {
    try {
      setLoading(true);
      let dataAddress = selectedProvince;
      if (selectedDistrict) {
        dataAddress = `${selectedDistrict}, ${selectedProvince}`;
      }
      const salonRes =
        await SalonInformationServices.getAllSalonInformationByAddressOrSalonName(
          servicesName ? servicesName : null,
          dataAddress ? dataAddress : null,
          salonName ? salonName : null,
          latitude ? latitude : null,
          longitude ? longitude : null,
          distance ? distance : null,
          currentPage,
          pageSize
        );
      const salons = salonRes.data.items;

      // const servicePromises = await salons.map((salon) =>
      //   ServiceHairServices.getServiceHairBySalonNotPaging(salon.id).then(
      //     (serviceData) => ({
      //       ...salon,
      //       services: serviceData.data,
      //     })
      //   )
      // );

      // const salonsWithServices = await Promise.all(servicePromises);

      setSalonList(salons);
      // setSalonList(salonsWithServices);
      // console.log("salonwwith", salonsWithServices);

      setTotalPages(salonRes.data.total);
      setTotal(salonRes.data.total);
    } catch (err) {
      console.log(err, "errors");
    } finally {
      setLoading(false);
    }
  };
  const fetchSalonDataNear = async (latitude, longtitude, distance) => {
    try {
      setLoading(true);
      let dataAddress = selectedProvince;
      if (selectedDistrict) {
        dataAddress = `${selectedDistrict}, ${selectedProvince}`;
      }
      const salonRes =
        await SalonInformationServices.getAllSalonInformationByAddressOrSalonName(
          servicesName ? servicesName : null,
          null,
          salonName ? salonName : null,
          latitude ? latitude : null,
          longtitude ? longtitude : null,
          distance ? distance : null,
          currentPage,
          pageSize
        );
      const salons = salonRes.data.items;

      // const servicePromises = await salons.map((salon) =>
      //   ServiceHairServices.getServiceHairBySalonNotPaging(salon.id).then(
      //     (serviceData) => ({
      //       ...salon,
      //       services: serviceData.data,
      //     })
      //   )
      // );

      // const salonsWithServices = await Promise.all(servicePromises);

      // setSalonList(salonsWithServices);
      setSalonList(salons);
      setTotalPages(salonRes.data.total);
      setTotal(salonRes.data.total);
      message.info(
        <>
          Có {salons.length || 0} salon gần bạn
          {servicesName && <> với dịch vụ: {servicesName}</>}
          {salonName && <> , salon: {salonName}</>}
        </>
      );
    } catch (err) {
      console.log(err, "errors");
    } finally {
      setLoading(false);
    }
  };
  // useEffect(() => {
  //   fetchSalonData();
  // }, [currentPage, servicesName, locationSalon, salonName]);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      const params = new URLSearchParams();
      if (salonName) params.set("salonName", salonName);
      if (servicesName) params.set("servicesName", servicesName);

      navigate(`?${params.toString()}`);
      fetchSalonData();
    }
  };

  const handleSalonNameChange = (e) => {
    setSalonName(e.target.value);
  };
  const handleServiceNameChange = (e) => {
    setServicesName(e.target.value);
  };
  const handleClick = () => {
    // Clear the servicesName state
    setServicesName("");

    // Update the URL parameters
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    params.delete("servicesName");
    url.search = params.toString();

    // Replace the current URL without reloading the page
    window.history.replaceState({}, "", url.toString());
  };
  const handleLocationClick = () => {
    setLocationVisible(false); // Close the popover
    setModalVisible(true); // Show the modal
  };
  const handleModalClose = () => {
    setModalVisible(false); // Close the modal
  };
  const [form] = Form.useForm();
  const handleSearch = async () => {
    const validateDistance = async () => {
      try {
        const values = await form.validateFields(["distance"]);
        return values.distance;
      } catch (error) {
        document.body.style.overflow = "";
        message.error("Vui lòng nhập khoảng cách hợp lệ.");
        return null; // Trả về null để báo lỗi nhưng không đóng modal
      }
    };

    const handleOk = async () => {
      const distance = await validateDistance();
      if (!distance) {
        return Promise.reject(); // Trả về Promise.reject() để ngăn việc đóng modal
      }

      if ("geolocation" in navigator) {
        setLoading(true);
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const { latitude, longitude } = pos.coords;
            try {
              await fetchSalonDataNear(latitude, longitude, distance);
              // message.success("Cảm ơn bạn đã kích hoạt dịch vụ định vị.");
              document.body.style.overflow = "";
            } catch (error) {
              message.error("Có lỗi xảy ra khi tìm kiếm salon.");
            } finally {
              document.body.style.overflow = "";

              setLoading(false);
            }
          },
          (error) => {
            setLoading(false);
            document.body.style.overflow = "";
            message.error("Bạn đã từ chối quyền truy cập vị trí!");
          }
        );
      } else {
        message.error("Định vị địa lý không được trình duyệt của bạn hỗ trợ.");
      }
    };

    document.body.style.overflow = "hidden";
    Modal.confirm({
      title: "Bật vị trí hiện tại",
      content: (
        <Form form={form} layout="vertical">
          <Form.Item
            label="Nhập khoảng cách bạn muốn tìm (km)"
            name="distance"
            rules={[
              { required: true, message: "Vui lòng nhập khoảng cách!" },
              { pattern: /^\d+$/, message: "Khoảng cách phải là số!" },
            ]}
          >
            <Input placeholder="Nhập khoảng cách" />
          </Form.Item>
        </Form>
      ),
      async onOk() {
        await handleOk(); // Chỉ đóng modal nếu handleOk không trả về Promise.reject()
      },
      onCancel() {
        message.error("Bạn đã từ chối quyền truy cập vị trí.");
        document.body.style.overflow = "";
      },
    });
  };

  const onPlacesChanged = () => {
    const places = searchBox.getPlaces();
    if (places.length > 0) {
      setInputLocation(places[0].formatted_address);
    }
  };
  function formatMoneyVND(amount) {
    return amount.toLocaleString("vi-VN");
  }
  return (
    <div
      style={{
        marginTop: "80px",
      }}
    >
      <div className={styles["list-salon-header"]}>
        <div className={styles["list-salon-search"]}>
          <div
            style={{
              marginBottom: "1rem",
            }}
          >
            <Button
              // icon={<EnvironmentOutlined />}
              onClick={handleSearch}
              className={"book-button"}
            >
              <EnvironmentOutlined
                style={{ fontSize: "1rem", marginRight: "8px" }}
              />
              Nhấn vào đây để tìm salon gần bạn
            </Button>
            <Modal
              title="Nhập vị trí hiện tại của bạn"
              visible={modalVisible}
              onCancel={handleModalClose}
              footer={[
                <Button key="close" onClick={handleModalClose}>
                  Đóng
                </Button>,
              ]}
            >
              <LoadScript
                googleMapsApiKey={`${
                  import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY
                }&loading=async`}
                libraries={libraries}
                onLoad={() => setIsApiLoaded(true)}
              >
                {isApiLoaded && (
                  <StandaloneSearchBox
                    onLoad={(ref) => (searchBoxRef.current = ref)}
                    onPlacesChanged={handlePlacesChanged}
                  >
                    <Input
                      value={locationInput}
                      placeholder="Nhập vị trí hiện tại của bạn"
                      onChange={(e) => setLocationInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                    />
                  </StandaloneSearchBox>
                )}
              </LoadScript>
            </Modal>
          </div>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <MotionDiv
                whileHover={{ scale: 1.02 }} // Tăng nhẹ kích thước khi hover
                whileTap={{ scale: 0.95 }} // Giảm nhẹ kích thước khi nhấn
                transition={{ duration: 0.3 }} // Thời gian chuyển đổi
              >
                <Input
                  className={styles["ant-input"]}
                  allowClear
                  placeholder="Tìm kiếm salon"
                  prefix={<SearchOutlined />}
                  onChange={handleSalonNameChange}
                  onKeyDown={handleKeyPress}
                  value={salonName}
                  onSubmit={handSubmitSalonName}
                />
              </MotionDiv>
            </Col>
            <Col
              // style={{
              //   backgroundColor: "#ECE8DE",
              //   paddingLeft: "0px",
              //   paddingRight: "0px",
              // }}
              span={12}
            >
              {/* <Popover
                content={popularServices}
                visible={searchVisible}
                onVisibleChange={setSearchVisible}
                trigger="click"
                placement="bottom"
                overlayClassName="popover-overlay"
              > */}
              <MotionDiv
                whileHover={{ scale: 1.02 }} // Tăng nhẹ kích thước khi hover
                whileTap={{ scale: 0.95 }} // Giảm nhẹ kích thước khi nhấn
                transition={{ duration: 0.3 }} // Thời gian chuyển đổi
              >
                <Input
                  className={styles["ant-input"]}
                  placeholder="Tìm kiếm dịch vụ"
                  prefix={<SearchOutlined />}
                  suffix={
                    servicesName && (
                      <CloseCircleOutlined onClick={handleClick} />
                    )
                  }
                  value={servicesName}
                  onChange={handleServiceNameChange}
                  onKeyUp={handleKeyPress}
                />
              </MotionDiv>
              {/* </Popover> */}
            </Col>
            {/* <div className={styles["list-salon-service"]}>
              <div
                onClick={() => handleServiceSelect("Cắt tóc")}
                className={styles["service-item"]}
              >
                Cắt tóc
              </div>
              <div
                onClick={() => handleServiceSelect("Nhuộm tóc")}
                className={styles["service-item"]}
              >
                Nhuộm tóc
              </div>
              <div
                onClick={() => handleServiceSelect("Uốn tóc")}
                className={styles["service-item"]}
              >
                Uốn tóc
              </div>
              <div
                onClick={() => handleServiceSelect("Duỗi tóc")}
                className={styles["service-item"]}
              >
                Duỗi tóc
              </div>
              <div
                onClick={() => handleServiceSelect("Gội đầu")}
                className={styles["service-item"]}
              >
                Gội đầu
              </div>
              <div
                onClick={() => handleServiceSelect("Ráy tai")}
                className={styles["service-item"]}
              >
                Ráy tai
              </div>
              <div
                onClick={() => handleServiceSelect("Cạo râu")}
                className={styles["service-item"]}
              >
                Cạo râu
              </div>
            </div> */}
            <div className={styles["list-salon-service"]}>
              {[
                "Cắt tóc",
                "Nhuộm tóc",
                "Uốn tóc",
                "Duỗi tóc",
                "Gội đầu",
                "Ráy tai",
                "Cạo râu",
              ].map((service) => (
                <div
                  key={service}
                  onClick={() => handleServiceSelect(service)}
                  className={styles["service-item"]}
                >
                  {service}
                </div>
              ))}
            </div>
          </Row>
        </div>
      </div>
      <div className={styles["list-salon-container"]}>
        {/* <Meteors number={30} /> */}
        <div className={styles["left-side"]}>
          <div className={styles["custom_spin"]}>
            <Spin spinning={loading}>
              <div className={styles["list-salon-center"]}>
                <div>
                  <p className={styles["list-salon-result"]}>
                    <SparklesText text={`Kết quả: (${total})`} />
                  </p>
                </div>
              </div>
              <Divider />
              <div className={styles["list-salon-end"]}>
                <div className={styles["list-salon-actbtn"]}>
                  <div className={styles["list-salon-filmap"]}>
                    <Popover
                      content={filterOptions}
                      visible={filterVisible}
                      onVisibleChange={handleFilterClick}
                      trigger="click"
                      placement="bottom"
                      overlayClassName="popover-overlay"
                    >
                      <Button
                        className={styles["sort-button"]}
                        icon={<SortAscendingOutlined />}
                      >
                        Sắp xếp
                      </Button>
                    </Popover>
                    {/* <Button
                className="view-map-button"
                icon={<EnvironmentOutlined />}
              >
                View Map
              </Button> */}
                  </div>
                </div>

                <div className={styles["list-salon-content"]}>
                  {salonList.length !== 0 ? (
                    salonList.map((salon) => (
                      <motion.div
                        className={styles["list-salon-item"]}
                        key={salon.id}
                        whileHover={{
                          scale: 1.05,
                          border: "1px solid #bc8d4a",
                          borderRadius: "0.5rem",
                          padding: "0.5rem",
                        }} // Scale effect on hover
                        transition={{ duration: 0.3 }} // Transition duration
                        initial={{ opacity: 0 }} // Initial opacity for scroll effect
                        animate={{ opacity: 1 }} // Final opacity for scroll effect
                        exit={{ opacity: 0 }} // Fade out on exit
                      >
                        <div
                          className={styles["list-salon-image"]}
                          style={{ width: "30%" }}
                        >
                          <img
                            src={salon.img}
                            alt={salon.name}
                            style={{ width: "100%" }}
                          />
                          <div
                            style={{
                              marginTop: "8px",
                              fontSize: "1rem",
                              textAlign: "center",
                            }}
                          >
                            <motion.div
                              key={salon.operatingStatus} // Ensures re-render when status changes
                              initial={{
                                opacity: 0,
                                color:
                                  salon.operatingStatus === "Đang hoạt động"
                                    ? "#EF4444"
                                    : "#10B981",
                              }}
                              animate={{
                                opacity: 1,
                                color:
                                  salon.operatingStatus === "Đang hoạt động"
                                    ? "#EF4444"
                                    : "#10B981",
                              }}
                              transition={{ duration: 0.5 }} // Adjust the duration
                              className="transform transition-transform duration-500"
                            >
                              <p
                                className={`text-lg font-semibold ${
                                  salon.operatingStatus === "Đang hoạt động"
                                    ? "text-green-500"
                                    : "text-red-500"
                                }`}
                              >
                                {salon.operatingStatus}
                              </p>
                            </motion.div>

                            <div className="flex items-center space-x-2">
                              {salon.distance === null ? (
                                <div className="flex align-middle">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    className="w-6 h-6 text-gray-500"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 2a9 9 0 00-9 9c0 6 9 11 9 11s9-5 9-11a9 9 0 00-9-9zm0 13a3 3 0 100-6 3 3 0 000 6z"
                                    />
                                  </svg>
                                  <p className="text-gray-500 font-medium ml-2">
                                    ...
                                  </p>
                                </div>
                              ) : (
                                <div className="flex align-middle">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    className="w-6 h-6 text-green-500"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 2a9 9 0 00-9 9c0 6 9 11 9 11s9-5 9-11a9 9 0 00-9-9zm0 13a3 3 0 100-6 3 3 0 000 6z"
                                    />
                                  </svg>
                                  <p className="text-green-500 font-medium">
                                    {salon.distance.toFixed(1)} km
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div
                          className={styles["list-salon-info"]}
                          style={{ width: "70%", paddingLeft: "16px" }}
                        >
                          <p style={{ fontSize: "1.5rem" }}>{salon.name}</p>
                          <p style={{ fontSize: "1rem" }}>
                            <strong>Mô tả:</strong> {salon.description}
                          </p>
                          <p style={{ fontSize: "1rem" }}>
                            <strong>Địa chỉ:</strong> {salon.address}
                          </p>
                          <ul>
                            {salon.services
                              .slice(0, 3)
                              .map((service, index) => (
                                <motion.li
                                  key={index}
                                  className={styles["service-list-item"]}
                                  whileHover={{ scale: 1.03 }} // Scale effect on hover
                                  transition={{ duration: 0.2 }} // Transition duration for hover
                                  initial={{ opacity: 0.8 }} // Initial opacity for scroll effect
                                  animate={{ opacity: 1 }} // Final opacity for scroll effect
                                  exit={{ opacity: 0.8 }} // Fade out on exit
                                >
                                  <div className={styles["service-details"]}>
                                    <span className={styles["service-name"]}>
                                      {service.serviceName}:{" "}
                                    </span>
                                    <span
                                      className={styles["service-description"]}
                                    >
                                      {service.description} -{" "}
                                      {formatMoneyVND(service.price)} vnđ
                                    </span>
                                  </div>
                                  <Button
                                    onClick={() =>
                                      navigate(`/salon_detail/${salon?.id}`)
                                    }
                                    className={styles["book-button"]}
                                  >
                                    Đặt lịch
                                  </Button>
                                </motion.li>
                              ))}
                          </ul>

                          {salon.services.length > 3 && (
                            <div style={{ marginTop: "8px" }}>
                              <Button
                                onClick={() =>
                                  navigate(`/salon_detail/${salon?.id}`)
                                }
                                className={styles["view-more-button"]}
                              >
                                Xem thêm ...
                              </Button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <>
                      <Empty />
                    </>
                  )}
                </div>
                {salonList.length !== 0 && (
                  <Pagination
                    // className={styles["custom-pagination"]}
                    className="paginationAppointment"
                    current={currentPage}
                    pageSize={pageSize}
                    total={totalPages}
                    onChange={(page) => setCurrentPage(page)}
                    style={{ textAlign: "center", marginTop: "20px" }}
                  />
                )}
              </div>
            </Spin>
          </div>
        </div>
        <div className={styles["right-side"]}>
          <div className={styles["tinhHuyen"]}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <MotionDiv
                  whileHover={{ scale: 1.05 }} // Tăng nhẹ kích thước khi hover
                  whileTap={{ scale: 0.95 }} // Giảm nhẹ kích thước khi nhấn
                  transition={{ duration: 0.3 }} // Thời gian chuyển đổi
                  style={{ marginRight: "10px" }}
                >
                  <Select
                    value={selectedProvince || undefined}
                    onChange={handleChange}
                    options={[{ value: null, label: "ĐẶT LẠI" }, ...provinces]}
                    placeholder="Tỉnh/Thành phố"
                    className={styles["select_1"]}
                  />
                </MotionDiv>
              </Col>
              <Col span={12}>
                <MotionDiv
                  whileHover={{ scale: 1.05 }} // Tăng nhẹ kích thước khi hover
                  whileTap={{ scale: 0.95 }} // Giảm nhẹ kích thước khi nhấn
                  transition={{ duration: 0.3 }} // Thời gian chuyển đổi
                >
                  <Select
                    value={selectedDistrict || undefined}
                    onChange={handleChangeDistrict}
                    options={selectedProvince ? districts : <Empty />}
                    placeholder="Quận/Huyện" // Set the placeholder text
                    className={styles["select_2"]}
                  />
                </MotionDiv>
              </Col>
            </Row>
          </div>
          <div className={styles["showMap"]}>
            <LoadScriptMap
              salonList={salonList}
              mapStyle={mapStyle}
              currentLocation={currentLocation}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListSalonVer2;
