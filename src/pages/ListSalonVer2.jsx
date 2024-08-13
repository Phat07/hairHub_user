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
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import "../css/ListSalonVer2.css";
import { SalonInformationServices } from "../services/salonInformationServices";
import { ServiceHairServices } from "../services/servicesHairServices";
import { useNavigate } from "react-router-dom";
import { LoadScript, StandaloneSearchBox } from "@react-google-maps/api";
function ListSalonVer2(props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(2);
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
  const [distance, setDistance] = useState("");
  const [loading, setLoading] = useState(false);

  const scrollContainerRef = useRef(null);

  // const [locationVisible, setLocationVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [locationInput, setLocationInput] = useState("");
  const searchBoxRef = useRef(null);
  const libraries = ["places"];

  // const handleLocationClick = () => {
  //   setLocationVisible(!locationVisible);
  // };

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
  // const handlePlacesChanged = () => {
  //   const places = searchBoxRef.current.getPlaces();
  //   if (places && places.length > 0) {
  //     console.log("places", places);

  //     const place = places[0];
  //     console.log("place", place);

  //     const address = place.formatted_address;
  //     const lat = place.geometry.location.lat();
  //     const lng = place.geometry.location.lng();

  //     setLocationInput(address);
  //     setLatitude(lat);
  //     setLongitude(lng);
  //   }
  // };
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

      const servicePromises = salons.map((salon) =>
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
    console.log("locationInputttt", locationInput);

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
  console.log("inputloca", locationInput);

  return (
    <div className="list-salon-container">
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
            <Col span={8}>
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
              <Popover
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
              </Popover>

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
                        name="salonLocationInput"
                        value={locationInput}
                        placeholder="Nhập vị trí hiện tại của bạn"
                        onChange={(e) => setLocationInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                      />
                    </StandaloneSearchBox>
                  )}
                </LoadScript>
              </Modal>
            </Col>
          </Row>
        </div>
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
      </div>
      <Spin spinning={loading}>
        <div className="list-salon-center">
          <div>
            <p className="list-salon-result">Results ({total})</p>
          </div>
          <div className="list-salon-scoll">
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
          </div>
        </div>
      </Spin>
      <Divider />
      <div className="list-salon-end">
        <div className="list-salon-actbtn">
          {" "}
          <div className="list-salon-filmap">
            <Popover
              content={filterOptions}
              visible={filterVisible}
              onVisibleChange={handleFilterClick}
              trigger="click"
              placement="bottom"
              overlayClassName="popover-overlay"
            >
              <Button className="sort-button" icon={<SortAscendingOutlined />}>
                Sort By
              </Button>
            </Popover>
            <Button className="view-map-button" icon={<EnvironmentOutlined />}>
              View Map
            </Button>
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
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalPages}
          onChange={(page) => setCurrentPage(page)}
          style={{ textAlign: "center", marginTop: "20px" }}
        />
      </div>
    </div>
  );
}

export default ListSalonVer2;
