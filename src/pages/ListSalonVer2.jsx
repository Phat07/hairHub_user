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
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import "../css/ListSalonVer2.css";
import { SalonInformationServices } from "../services/salonInformationServices";
import { ServiceHairServices } from "../services/servicesHairServices";

function ListSalonVer2(props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [searchVisible, setSearchVisible] = useState(false);
  const [locationVisible, setLocationVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  // const [selectedService, setSelectedService] = useState("");
  const [salonList, setSalonList] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [servicesName, setServicesName] = useState("");
  const [locationSalon, setLocationSalon] = useState("");
  const [salonName, setSalonName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [distance, setDistance] = useState("");
  const [loading, setLoading] = useState(false);

  const scrollContainerRef = useRef(null);

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

  const handleLocationClick = () => {
    setLocationVisible(!locationVisible);
    setSearchVisible(false);
  };

  const handleServiceSelect = (service) => {
    // setSelectedService(service);
    setServicesName(service);
    setSearchVisible(false);
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

  useEffect(() => {
    const fetchSalonData = async () => {
      try {
        setLoading(true);
        const salonRes =
          await SalonInformationServices.getAllSalonInformationByAddressOrSalonName(
            servicesName ? servicesName : null,
            locationSalon ? locationSalon : null,
            salonName ? salonName : null,
            currentPage,
            pageSize,
            latitude ? latitude : null,
            longitude ? longitude : null,
            distance ? distance : null
          );
        const salons = salonRes.data.items;
        console.log("vđ",salonRes.data);
        
        console.log("bcss",salons);
        

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
        setTotalPages(salonRes.data.totalPages);
        setTotal(salonRes.data.total);
      } catch (err) {
        console.log(err, "errors");
      } finally {
        setLoading(false);
      }
    };

    fetchSalonData();
  }, [currentPage, servicesName, locationSalon, salonName]);

  const handleLocationChange = (e) => {
    setLocationSalon(e.target.value);
  };

  const handleSalonNameChange = (e) => {
    setSalonName(e.target.value);
  };

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
                />
              </Popover>
            </Col>
            <Col span={8}>
              <Popover
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
                />
              </Popover>
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
