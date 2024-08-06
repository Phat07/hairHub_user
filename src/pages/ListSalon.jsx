import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import Loader from "../components/Loader";
import {
  Card,
  Col,
  DatePicker,
  Divider,
  Input,
  List,
  Pagination,
  Rate,
  Row,
  message,
  Modal,
  Button,
  Typography,
} from "antd";
import {
  ClockCircleOutlined,
  EnvironmentFilled,
  EnvironmentOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import "../css/ListSalon.css";
import "../css/loader.css";
import { LoadScript, StandaloneSearchBox } from "@react-google-maps/api";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SalonInformationServices } from "../services/salonInformationServices";
import { ProConfigProvider } from "@ant-design/pro-components";

const { Meta } = Card;

const location = {
  area: "HCM City",
  number: "115",
};

const libraries = ["places"]; // Load the places library for Places Autocomplete

const ListSalon = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("");
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [salonList, setSalonList] = useState([]);

  const [totalPages, setTotalPages] = useState(1);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const servicesName = searchParams.get("servicesName");
  const salonName = searchParams.get("salonName");
  const locationSalon = searchParams.get("location");
  const [searchLocation, setSearchLocation] = useState(locationSalon || "");
  const [searchTerm, setSearchTerm] = useState(salonName || "");
  useEffect(() => {
    if (!locationSalon && !servicesName && !salonName) {
      SalonInformationServices.getAllSalonInformation(currentPage, pageSize)
        .then((res) => {
          setSalonList(res.data.items);
          setTotalPages(res.data.totalPages);
        })
        .catch((err) => {
          console.log(err, "errors");
        });
    }
    SalonInformationServices.getAllSalonInformationByAddressOrSalonName(
      servicesName || null,
      locationSalon || null,
      salonName || null,
      currentPage,
      pageSize
    ).then((res) => {
      setSalonList(res.data.items);
      setTotalPages(res.data.totalPages);
    });
  }, [servicesName, salonName, locationSalon, currentPage, pageSize]);
  useEffect(() => {
    SalonInformationServices.getAllSalonInformation(currentPage, pageSize)
      .then((res) => {
        setSalonList(res.data.items);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => {
        console.log(err, "errors");
      });
  }, []);
  const navigate = useNavigate();
  // const searchBoxRef = useRef(null);

  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     if (!isApiLoaded) {
  //       window.location.reload();
  //     }
  //   }, 1000); // 5 seconds timeout

  //   return () => clearTimeout(timeoutId);
  // }, [isApiLoaded]);

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const handlePlacesChanged = () => {
    const places = searchBoxRef.current.getPlaces();
    if (places?.length > 0) {
      const place = places[0];
      setSearchLocation(place.formatted_address);
      setCurrentLocation(place.formatted_address);
    }
  };

  // const handleEnableLocation = () => {
  //   document.body.style.overflow = "hidden";

  //   Modal.confirm({
  //     title: "Bật vị trí hiện tại",
  //     content: "Bạn có muốn cho phép truy cập vào vị trí của bạn?",
  //     onOk() {
  //       setLoading(true);

  //       if ("geolocation" in navigator) {
  //         navigator.geolocation.getCurrentPosition(
  //           (pos) => {
  //             const { latitude, longitude } = pos.coords;
  //             const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${
  //               import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY
  //             }&loading=async`;

  //             fetch(url)
  //               .then((res) => res.json())
  //               .then((data) => {
  //                 console.log("Geocode API response:", data);
  //                 if (data.status === "OK") {
  //                   message.success("Cảm ơn bạn đã kích hoạt dịch vụ định vị.");
  //                   const address = data.results[0].formatted_address;
  //                   setCurrentLocation(address);
  //                   setSearchLocation(address);
  //                 } else {
  //                   message.error("Không thể lấy được vị trí!");
  //                 }
  //               })
  //               .finally(() => {
  //                 setLoading(false);
  //                 document.body.style.overflow = "";
  //               });
  //           },
  //           (error) => {
  //             message.error("Bạn đã từ chối quyền truy cập vị trí!");
  //             setLoading(false);
  //             document.body.style.overflow = "";
  //           }
  //         );
  //       } else {
  //         message.error(
  //           "Định vị địa lý không được trình duyệt của bạn hỗ trợ."
  //         );
  //         setLoading(false);
  //         document.body.style.overflow = "";
  //       }
  //     },
  //     onCancel() {
  //       message.error("Chưa cấp quyền truy cập vị trí.");
  //       document.body.style.overflow = "";
  //     },
  //   });
  // };

  const handleFoundBaber = () => {
    if (!searchTerm) {
      navigate(`/list_salon?location=${searchLocation}`);
    } else if (!searchLocation) {
      navigate(`/list_salon?salonName=${searchTerm}`);
    } else {
      navigate(
        `/list_salon?salonName=${searchTerm}&location=${searchLocation}`
      );
    }
  };

  return (
    <div>
      <Header />
      <div
        style={{
          marginTop: "140px",
          marginLeft: "250px",
          marginRight: "250px",
        }}
      ></div>
      {/* <LoadScript
        googleMapsApiKey={`${
          import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY
        }&loading=async`}
        libraries={libraries}
        onLoad={() => {
          if (isApiLoaded) {
            console.clear(); // Clear console to remove previous logs
          }
          setIsApiLoaded(true);
        }}
      /> */}
      {/* {isApiLoaded ? ( */}
        <div className="list-salon-contain-repo">
          <motion.div
            variants={{
              hidden: { y: "-100vh", opacity: 0 },
              visible: {
                y: "-1px",
                opacity: 1,
                transition: {
                  delay: 0.5,
                  type: "spring",
                  stiffness: 30,
                },
              },
            }}
            initial="hidden"
            animate="visible"
          >
            <div className="search-container mb-3">
              <Row gutter={16} style={{ width: "100%" }}>
                <Col xs={24} sm={24} md={8} lg={8}>
                  <Input
                    prefix={<SearchOutlined />}
                    placeholder="Nhập tên tiệm barber"
                    size="large"
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button
                    type="primary"
                    style={{
                      marginTop: "8px",
                      width: "100%",
                    }}
                    onClick={handleFoundBaber}
                  >
                    Tìm kiếm barber
                  </Button>
                </Col>
                {/* <Col xs={24} sm={24} md={8} lg={8}>
                  <StandaloneSearchBox
                    onLoad={(ref) => (searchBoxRef.current = ref)}
                    onPlacesChanged={handlePlacesChanged}
                  >
                    <Input
                      style={{ maxHeight: "4rem" }}
                      prefix={<EnvironmentOutlined />}
                      placeholder={currentLocation ? currentLocation : "Where?"}
                      size="large"
                      className="search-input"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      suffix={
                        currentLocation && (
                          <Button
                            type="text"
                            onClick={() => {
                              setCurrentLocation("");
                              setSearchLocation("");
                            }}
                          >
                            Xóa
                          </Button>
                        )
                      }
                    />
                  </StandaloneSearchBox>
                  <Button
                    type="primary"
                    style={{ marginTop: "8px", width: "100%" }}
                    onClick={handleEnableLocation}
                  >
                    Bật quyền truy cập vị trí
                  </Button>
                </Col> */}
                {/* <Col xs={24} sm={24} md={8} lg={8}>
                  <DatePicker
                    suffixIcon={<ClockCircleOutlined />}
                    placeholder="When?"
                    size="large"
                    className="search-input"
                    style={{ width: "100%" }}
                  />
                </Col> */}
              </Row>
            </div>
          </motion.div>
          {/* <div className="list-salon-tilte" >
            Tiệm barber ở {locationSalon || "Hồ Chí Minh"} | Đang có hơn{" "}
            {salonList.length} tiệm
          </div> */}
          {/* <div
            className="list-salon-divider"
            //  style={{ width: "115rem" }}
          >
            <Divider />
          </div> */}
          <div
          // style={{ width: "110.5rem" }}
          >
            <List
              grid={{ gutter: 16, column: 3 }}
              dataSource={salonList}
              renderItem={(item) => (
                <List.Item>
                  <Card
                    hoverable
                    onClick={() => navigate(`/salon_detail/${item.id}`)}
                    className="list-salon-list"
                    cover={
                      <img
                        style={{ width: "115rem", height: 200 }}
                        alt={item.name}
                        src={item.img}
                      />
                    }
                  >
                    <Meta
                      // style={{ width: "30rem", height: "15rem" }} //width, height of Card content
                      title={
                        <>
                          <Typography.Title level={4}>
                            {item.name}
                          </Typography.Title>
                        </>
                      }
                      description={
                        <>
                          <Typography.Title level={5}>
                            {/* Reviews {item.reviews}
                            <Rate
                              style={{ fontSize: 12 }}
                              disabled
                              defaultValue="4.5"
                            /> */}
                          </Typography.Title>
                          <Typography.Text>
                            <EnvironmentOutlined /> {item.address}
                          </Typography.Text>
                        </>
                      }
                    />
                  </Card>
                </List.Item>
              )}
            />
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalPages}
              onChange={handlePageChange}
              className="list-salon-pagi"
              // style={{ textAlign: "center", marginTop: "2rem" }}
            />
          </div>
        </div>
      {/* ) : (
        <div className="overlay">
          <Loader />
        </div>
      )} */}
    </div>
  );
};

export default () => {
  return (
    <ProConfigProvider>
      <ListSalon />
    </ProConfigProvider>
  );
};
