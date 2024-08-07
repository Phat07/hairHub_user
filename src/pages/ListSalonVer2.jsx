import {
  SearchOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  CloseCircleOutlined,
  RightOutlined,
  LeftOutlined,
  FilterOutlined,
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
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import "../css/ListSalonVer2.css";
import { SalonInformationServices } from "../services/salonInformationServices";

function ListSalonVer2(props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [searchVisible, setSearchVisible] = useState(false);
  const [locationVisible, setLocationVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [salonList, setSalonList] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(1);

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
      <Menu.Item onClick={() => handleServiceSelect("Gọi đầu")}>
        Gọi đầu
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
    setSelectedService(service);
    setSearchVisible(false);
  };

  const handleClearService = () => {
    setSelectedService("");
  };

  const handleFilterClick = () => {
    setFilterVisible(!filterVisible);
  };

  const handleFilterSelect = (filter) => {
    console.log("Selected filter:", filter);
    setFilterVisible(false);
  };

  useEffect(() => {
    SalonInformationServices.getAllSalonInformation(currentPage, pageSize)
      .then((res) => {
        setSalonList(res.data.items);
        setTotalPages(res.data.totalPages);
        setTotal(res.data.total);
      })
      .catch((err) => {
        console.log(err, "errors");
      });
  }, []);
  console.log("SalonList", salonList);

  return (
    <div className="list-salon-container">
      <div className="list-salon-header">
        <div className="list-salon-search">
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Popover
                content={popularServices}
                visible={searchVisible}
                onVisibleChange={handleSearchClick}
                trigger="click"
                placement="bottom"
                overlayClassName="popover-overlay"
              >
                <Input
                  placeholder="Tìm kiếm dịch vụ"
                  prefix={<SearchOutlined />}
                  suffix={
                    selectedService && (
                      <CloseCircleOutlined onClick={handleClearService} />
                    )
                  }
                  value={selectedService}
                  onClick={handleSearchClick}
                  readOnly
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
                  readOnly
                />
              </Popover>
            </Col>
            <Col span={8}>
              <DatePicker style={{ width: "100%" }} inputReadOnly />
            </Col>
          </Row>
        </div>
        <div className="list-salon-service">
          <div className="service-item">Cắt tóc</div>
          <div className="service-item">Nhuộm tóc</div>
          <div className="service-item">Uốn tóc</div>
          <div className="service-item">Duỗi tóc</div>
          <div className="service-item">Gọi đầu</div>
          <div className="service-item">Ráy tay</div>
          <div className="service-item">Cạo râu</div>
        </div>
      </div>
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
                <p>{salon.description}</p>
                <p>
                  <strong>Lịch trình:</strong>
                </p>
                <ul>
                  {salon.schedules.map((schedule, index) => (
                    <li key={index}>
                      {schedule.dayOfWeek}: {schedule.startTime} -{" "}
                      {schedule.endTime}
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
          total={total}
          onChange={(page) => setCurrentPage(page)}
          style={{ textAlign: "center", marginTop: "20px" }}
        />
      </div>
    </div>
  );
}

export default ListSalonVer2;
