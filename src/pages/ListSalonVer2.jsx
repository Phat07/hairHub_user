import {
  SearchOutlined,
  EnvironmentOutlined,
  CloseCircleOutlined,
  RightOutlined,
  LeftOutlined,
  SortAscendingOutlined,
} from "@ant-design/icons";
import {
  Button,
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
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import "../css/ListSalonVer2.css";
import { SalonInformationServices } from "../services/salonInformationServices";
import { ServiceHairServices } from "../services/servicesHairServices";
import { useNavigate } from "react-router-dom";
import { LoadScript, StandaloneSearchBox } from "@react-google-maps/api";
import axios from "axios";
import LoadScriptMap from "../components/LoadScriptMap";

const defaultCenter = {
  lat: 10.8231, // Default to Ho Chi Minh City
  lng: 106.6297,
};

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
  const [selectedProvince, setSelectedProvince] = useState(
    locationSalon || "Tỉnh/Thành phố"
  );
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [mapStyle, setMapStyle] = useState({
    height: "500px",
    width: "850px",
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 480) {
        setMapStyle({ height: "250px", width: "100%" });
      } else if (window.innerWidth <= 768) {
        setMapStyle({ height: "300px", width: "100%" });
      } else {
        setMapStyle({ height: "300px", width: "450px" });
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial call

    return () => window.removeEventListener("resize", handleResize);
  }, []);
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
          setDistricts(mapper);
        })
        .catch((error) => console.error("Error fetching districts:", error));
    } else {
      setDistricts([]);
      // setWards([]);
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
    setSelectedWard("");

    let fetchLatLng = false;
    fetchSalonData(fetchLatLng);
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
  const handleChangeDistrict = (value) => {
    setSelectedDistrict(value);
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

  const handleSearchClick = () => {
    setSearchVisible(!searchVisible);
    setLocationVisible(false);
  };

  // const handleLocationClick = () => {
  //   setLocationVisible(!locationVisible);
  //   setSearchVisible(false);
  // };
  const handleLocationClick = () => {
    setLocationVisible(false); // Close the popover
    setModalVisible(true); // Show the modal
  };

  const handlePlacesChanged = () => {
    const places = searchBoxRef.current.getPlaces();

    if (places.length === 0) return;
    console.log("places", places);

    const userInputAddress = locationInput; // This is the full address the user entered

    // Extract a significant part of the user's input to match (e.g., the first few words)
    const userInputAddressPart = userInputAddress.split(",")[0]; // e.g., "91 Đường Hàng Tre"

    // Find the best match in the places array
    const bestPlace =
      places.find((place) => {
        return place.formatted_address.includes(userInputAddressPart);
      }) || places[0]; // Fallback to the first place if no match is found
    console.log("best", bestPlace);

    const location = bestPlace.formatted_address;
    console.log("location", location);

    const lat = bestPlace.geometry.location.lat();
    const lng = bestPlace.geometry.location.lng();

    setLocationInput(location);
    setLatitude(lat);
    setLongitude(lng);
  };

  const handleModalClose = () => {
    setModalVisible(false); // Close the modal
  };

  // const handleServiceSelect = (service) => {
  //   // setSelectedService(service);
  //   setServicesName(service);
  //   setSearchVisible(false);
  // };
  const handleServiceSelect = (service) => {
    setServicesName(service);
    setSearchVisible(false);

    const params = new URLSearchParams(location.search);

    if (service) {
      params.set("servicesName", service);
    } else {
      params.delete("servicesName");
    }

    navigate(`?${params.toString()}`);
    fetchSalonData();
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
  const fetchSalonData = async (fetchLatLng = true) => {
    try {
      setLoading(true);
      const salonRes =
        await SalonInformationServices.getAllSalonInformationByAddressOrSalonName(
          servicesName ? servicesName : null,
          !fetchLatLng && locationSalon ? locationSalon : null,
          salonName ? salonName : null,
          currentPage,
          pageSize,
          fetchLatLng && latitude ? latitude : null,
          fetchLatLng && longitude ? longitude : null,
          distance ? distance : null
        );
      const salons = salonRes.data.items;

      const servicePromises = await salons.map((salon) =>
        ServiceHairServices.getServiceHairBySalonNotPaging(salon.id).then(
          (serviceData) => ({
            ...salon,
            services: serviceData.data,
          })
        )
      );

      const salonsWithServices = await Promise.all(servicePromises);

      setSalonList(salonsWithServices);
      setTotalPages(salonRes.data.total);
      setTotal(salonRes.data.total);
    } catch (err) {
      console.log(err, "errors");
    } finally {
      setLoading(false);
    }
  };
  // useEffect(() => {
  //   fetchSalonData();
  // }, [currentPage, servicesName, locationSalon, salonName]);
  useEffect(() => {
    fetchSalonData();
  }, [currentPage]);
  // const handleKeyPress = (event) => {
  //   if (event.key === "Enter") {
  //     const params = new URLSearchParams();

  //     if (salonName) params.set("salonName", salonName);
  //     if (servicesName) params.set("servicesName", servicesName);
  //     if (locationSalon) params.set("location", locationSalon);

  //     navigate(`?${params.toString()}`); // Với React Router v6, sử dụng navigate(`?${params.toString()}`);
  //     fetchSalonData();
  //     if (modalVisible) {
  //       setModalVisible(false);
  //       setLocationSalon(locationInput); // Set the entered location input
  //       // Optionally, trigger an API call with latitude and longitude
  //       fetchSalonData();
  //     }
  //   }
  // };
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      const params = new URLSearchParams();
      let fetchLatLng = false;

      if (event.target.name === "locationInput") {
        if (salonName) params.set("salonName", salonName);
        if (servicesName) params.set("servicesName", servicesName);
        if (locationSalon) {
          params.set("location", locationSalon);
          // Ensure lat and lng are removed if locationSalon is used
          params.delete("lat");
          params.delete("lng");
        }
      } else if (event.target.name === "salonLocationInput") {
        if (salonName) params.set("salonName", salonName);
        if (servicesName) params.set("servicesName", servicesName);
        if (locationInput) {
          // Add latitude and longitude if locationInput is used
          params.set("lat", latitude);
          params.set("lng", longitude);
          // Ensure locationSalon is removed if locationInput is used
          params.delete("location");
          fetchLatLng = true;
        }
      }

      navigate(`?${params.toString()}`);
      fetchSalonData(fetchLatLng);

      if (modalVisible) {
        setModalVisible(false);
        setLocationSalon(locationInput);
      }
    }
  };
  const handleLocationChange = (e) => {
    setLocationSalon(e.target.value);
  };

  const handleSalonNameChange = (e) => {
    setSalonName(e.target.value);
  };

  return (
    <div className="list-salon-container">
      <div className="left-side">
        <div className="list-salon-header">
          <div className="list-salon-search">
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Input
                  placeholder="Tìm kiếm salon"
                  prefix={<SearchOutlined />}
                  onChange={handleSalonNameChange}
                  onKeyDown={handleKeyPress}
                  value={salonName}
                />
              </Col>
              <Col style={{ backgroundColor: "#ECE8DE" }} span={16}>
                <Popover
                  content={popularServices}
                  visible={searchVisible}
                  onVisibleChange={setSearchVisible}
                  trigger="click"
                  placement="bottom"
                  overlayClassName="popover-overlay"
                >
                  <Input
                    placeholder="Tìm kiếm dịch vụ"
                    prefix={<SearchOutlined />}
                    suffix={
                      servicesName && (
                        <CloseCircleOutlined
                          onClick={() => setServicesName("")}
                        />
                      )
                    }
                    value={servicesName}
                    onChange={(e) => setServicesName(e.target.value)}
                    onKeyDown={handleKeyPress}
                  />
                </Popover>
                <div className="list-salon-service">
                  <div
                    onClick={() => handleServiceSelect("Cắt tóc")}
                    className="service-item"
                  >
                    Cắt tóc
                  </div>
                  <div
                    onClick={() => handleServiceSelect("Nhuộm tóc")}
                    className="service-item"
                  >
                    Nhuộm tóc
                  </div>
                  <div
                    onClick={() => handleServiceSelect("Uốn tóc")}
                    className="service-item"
                  >
                    Uốn tóc
                  </div>
                  <div
                    onClick={() => handleServiceSelect("Duỗi tóc")}
                    className="service-item"
                  >
                    Duỗi tóc
                  </div>
                  <div
                    onClick={() => handleServiceSelect("Gội đầu")}
                    className="service-item"
                  >
                    Gội đầu
                  </div>
                  <div
                    onClick={() => handleServiceSelect("Ráy tai")}
                    className="service-item"
                  >
                    Ráy tai
                  </div>
                  <div
                    onClick={() => handleServiceSelect("Cạo râu")}
                    className="service-item"
                  >
                    Cạo râu
                  </div>
                </div>
              </Col>
              <Col span={8}>
                {/* <Popover
                content={
                  <Button icon={<EnvironmentOutlined />}>
                    Bật quyền truy cập vị trí
                  </Button>
                }
                visible={locationVisible}
                onVisibleChange={handleLocationClick}
                trigger="click"
                placement="bottom"
                overlayClassName="popover-overlay"
              >
                <Input
                  placeholder="Nơi chốn?"
                  prefix={<EnvironmentOutlined />}
                  onClick={handleLocationClick}
                  onChange={handleLocationChange}
                  onKeyDown={handleKeyPress}
                />
              </Popover> */}
                {/* <Popover
                content={
                  <Button
                    icon={<EnvironmentOutlined />}
                    onClick={handleLocationClick}
                  >
                    Nhấn vào đây để tìm salon gần bạn
                  </Button>
                }
                visible={locationVisible}
                onVisibleChange={setLocationVisible}
                trigger="click"
                placement="bottom"
                overlayClassName="popover-overlay"
              >
                <Input
                  name="locationInput"
                  placeholder="Điền vị trí salon, baberShop bạn muốn đến?"
                  prefix={<EnvironmentOutlined />}
                  onClick={() => setLocationVisible(!locationVisible)}
                  onChange={handleLocationChange}
                  value={locationSalon}
                  onKeyDown={handleKeyPress}
                />
              </Popover> */}

                {/* <Modal
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
                        name="salonLocationInput"
                        value={locationInput}
                        placeholder="Nhập vị trí hiện tại của bạn"
                        onChange={(e) => setLocationInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                      />
                    </StandaloneSearchBox>
                  )}
                </LoadScript>
              </Modal> */}
              </Col>
            </Row>
          </div>
          {/* <div className="list-salon-service">
            <div
              onClick={() => handleServiceSelect("Cắt tóc")}
              className="service-item"
            >
              Cắt tóc
            </div>
            <div
              onClick={() => handleServiceSelect("Nhuộm tóc")}
              className="service-item"
            >
              Nhuộm tóc
            </div>
            <div
              onClick={() => handleServiceSelect("Uốn tóc")}
              className="service-item"
            >
              Uốn tóc
            </div>
            <div
              onClick={() => handleServiceSelect("Duỗi tóc")}
              className="service-item"
            >
              Duỗi tóc
            </div>
            <div
              onClick={() => handleServiceSelect("Gội đầu")}
              className="service-item"
            >
              Gội đầu
            </div>
            <div
              onClick={() => handleServiceSelect("Ráy tai")}
              className="service-item"
            >
              Ráy tai
            </div>
            <div
              onClick={() => handleServiceSelect("Cạo râu")}
              className="service-item"
            >
              Cạo râu
            </div>
          </div> */}
        </div>
        <Spin spinning={loading}>
          <div className="list-salon-center">
            <div>
              <p className="list-salon-result">Results ({total})</p>
            </div>
            {/* <div className="list-salon-scoll">
            <Button
              className="list-salon-arrow-button left"
              icon={<LeftOutlined />}
              onClick={() => handleScroll("left")}
            />
            <div className="list-salon-cards-scroll" ref={scrollContainerRef}>
              {salonList.map((salon) => (
                <div className="list-salon-card-scroll" key={salon.id}>
                  <img src={salon.img} alt={salon.name} />
                  <p style={{ fontWeight: "bold" }}>{salon.name}</p>
                  <p>{salon.address}</p>
                </div>
              ))}
            </div>
            <Button
              className="list-salon-arrow-button right"
              icon={<RightOutlined />}
              onClick={() => handleScroll("right")}
            />
          </div> */}
          </div>
        </Spin>
        <Divider />
        <div className="list-salon-end">
          <div className="list-salon-actbtn">
            <div className="list-salon-filmap">
              <Popover
                content={filterOptions}
                visible={filterVisible}
                onVisibleChange={handleFilterClick}
                trigger="click"
                placement="bottom"
                overlayClassName="popover-overlay"
              >
                <Button
                  className="sort-button"
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
          <div className="list-salon-content">
            {salonList.map((salon) => (
              <div className="list-salon-item" key={salon.id}>
                <div className="list-salon-image" style={{ width: "30%" }}>
                  <img
                    src={salon.img}
                    alt={salon.name}
                    style={{ width: "100%" }}
                  />
                </div>
                <div
                  className="list-salon-info"
                  style={{ width: "70%", paddingLeft: "16px" }}
                >
                  <h3>{salon.name}</h3>
                  <p style={{ fontSize: "1.5rem" }}>
                    <strong>Mô tả:</strong> {salon.description}
                  </p>
                  <p style={{ fontSize: "1.5rem" }}>
                    <strong>Địa chỉ:</strong> {salon.address}
                  </p>
                  <ul>
                    {salon.services.map((service, index) => (
                      <li key={index} className="service-list-item">
                        <div className="service-details">
                          <span className="service-name">
                            {service.serviceName}:
                          </span>
                          <span className="service-description">
                            {service.description} - {service.price} Vnđ
                          </span>
                        </div>
                        <Button className="book-button">Book</Button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          {salonList.length !== 0 && (
            <Pagination
              className="custom-pagination"
              current={currentPage}
              pageSize={pageSize}
              total={totalPages}
              onChange={(page) => setCurrentPage(page)}
              style={{ textAlign: "center", marginTop: "20px" }}
            />
          )}
        </div>
      </div>
      <div className="right-side">
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <Select
            value={selectedProvince || "Tỉnh/Thành phố"}
            style={{ width: 150, marginRight: "10px" }}
            onChange={handleChange}
            options={provinces}
          />

          <Select
            value={selectedDistrict || "Quận/Huyện"}
            style={{ width: 150 }}
            onChange={handleChangeDistrict}
            options={selectedProvince ? districts : <Empty />}
          />
        </div>
        <div className="showMap">
          <LoadScriptMap
            salonList={salonList}
            mapStyle={mapStyle}
            currentLocation={currentLocation}
          />
        </div>
      </div>
    </div>
  );
}

export default ListSalonVer2;
