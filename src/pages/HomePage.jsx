import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
  HeartFilled,
  HeartOutlined,
  LeftCircleOutlined,
  RightCircleOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Flex, Modal, Row, Typography } from "antd";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import heroBanner from "../assets/images/bannerHomePage.jpg";
import video from "../assets/images/Hairhub mobile andoird app (1).mp4";
import video1 from "../assets/images/Hairhub mobile andoird app (4).mp4";
import video2 from "../assets/images/Hairhub mobile andoird app (5).mp4";
import bannerHomepage1 from "../assets/images/Hairhub mobile andoird app.png";
import locationPhone from "../assets/images/phoneMap.png";
import img1 from "../assets/images/serviceImg2/1.png";
import img2 from "../assets/images/serviceImg2/2.png";
import img3 from "../assets/images/serviceImg2/3.png";
import img4 from "../assets/images/serviceImg2/4.png";
import img5 from "../assets/images/serviceImg2/5.png";
import img6 from "../assets/images/serviceImg2/6.png";
import img7 from "../assets/images/serviceImg2/7.png";
import img8 from "../assets/images/serviceImg2/8.png";
import "../css/flaticon.min.css";
import "../css/homePage.css";
import "../css/ListSalon.css";
// import "../css/style.css";


import { useDispatch, useSelector } from "react-redux";
import { EmptyComponent } from "../components/EmptySection/DisplayEmpty";
import { actGetAllSalonInformation } from "../store/salonInformation/action";
import { actGetStatusPayment } from "../store/salonPayment/action";
const { Title, Text } = Typography;
function HomePage(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const salonList = useSelector(
    (state) => state.SALONINFORMATION.getSalonSuggestion
  );
  const [heartButton, setHeartButton] = useState(
    Array(salonList.length).fill(false)
  );

  const ownerId = useSelector((state) => state.ACCOUNT.idOwner);
  const scrollContainerRef = useRef(null);
  const recommendedSalons = salonList;

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -200 : 1000;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleHeartButton = (item, index) => {
    setHeartButton((prevHeartButton) => {
      const updateHeartButton = [...prevHeartButton];
      updateHeartButton[index] = !prevHeartButton[index];
      return updateHeartButton;
    });
  };
  const url = new URL(window.location.href);
  const orderCode = url.searchParams.get("orderCode");
  const amount = url.searchParams.get("amount");
  const configId = url.searchParams.get("configId");
  const id = url.searchParams.get("id");
  // const login = url.searchParams.get("login");

  // useEffect(()=>{
  //   if(login){
  //     message.success('Đăng nhập thành công')
  //   }
  // },[login])
  useEffect(() => {
    if (orderCode && amount && configId && id) {
      setIsModalVisible(true);
    }
  }, [orderCode, amount, configId, id]);

  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    dispatch(actGetAllSalonInformation());
  }, []);

  const handleOk = () => {
    setIsModalVisible(false);
    handleClick();
  };
  const handleClick = () => {
    const dataMapping = {
      ordercode: orderCode,
      configId: configId,
      salonOWnerID: ownerId,
    };
    dispatch(actGetStatusPayment(dataMapping, orderCode, ownerId))
      .then((res) => {
        console.log("res", res);

        // navigate("/listPayment");
      })
      .catch((e) => {
        console.log("Lỗi không lưu được trạng thái thanh toán xuống database");
      });
  };
  function formatVND(number) {
    // Chuyển đổi số thành chuỗi
    let numberString = number?.toString();
    // Sử dụng regex để thêm dấu chấm mỗi 3 chữ số từ phải sang trái
    let formattedString = numberString?.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return formattedString + " VND";
  }

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleFilterService = (service) => {
    navigate(`/list_salon?servicesName=${service}`);
  };
  const scrollLeft = () => {
    document
      .querySelector(".card-list")
      .scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    document
      .querySelector(".card-list")
      .scrollBy({ left: 300, behavior: "smooth" });
  };

  
  return (
    <div>
      <main>
        <article>
          {/* HERO */}
          <section
            className="section hero has-before has-bg-image"
            id="home"
            aria-label="home"
            style={{
              backgroundImage: `url(${heroBanner})`,
              // backgroundClip: `url(${videoAboutUs})`,
            }}
          >
            {/* <Button onClick={() => navigate("/list_barber_employees")}>
              List Barber Employees
            </Button> */}
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
              className="container title-container"
            >
              {/* <Title
                className="hero-title"
                style={{ fontSize: "10rem", margin: "0" }}
              >
                HỆ THỐNG ĐẶT LỊCH SALON, BARBER SHOP
              </Title> */}
              {/* <Title
                className="hero-title"
                style={{ fontSize: "6.5rem", margin: "0", fontWeight: "bold" }}
              >
                Salon - Barber Shop
              </Title> */}
              {/* <Text className="hero-text text-4xl">
                Trải nghiệm những dịch vụ tuyệt vời nhất từ những salon, barber
                shop tốt nhất trên thị trường Việt Nam
              </Text> */}
              {/* <Link to={"/list_salon"}>
                <Text className="btn has-before text-white hover:text-white-600">
                  Khám phá những dịch vụ nổi bật
                </Text>
              </Link> */}
              <Text className="titleHomePage">
                HỆ THỐNG ĐẶT LỊCH SALON, BARBER SHOP
              </Text>
              <Link to={"/list_salon"}>
                <Text className="btn has-before text-white hover:text-white-600">
                  Đặt lịch ngay
                </Text>
              </Link>
            </motion.div>
            {/* <video
              src={videoAboutUs} // Đường dẫn đến video
              autoPlay
              loop
              muted
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover", // Đảm bảo video bao phủ toàn bộ phần tử
                zIndex: -1, // Đưa video ra sau nội dung khác
              }}
            /> */}
          </section>
          <Flex className="mt-32" align="center" gap={24}>
            {/* <button
              className="arrow-button ml-[20rem] text-gray-800"
              onClick={() => handleScroll("left")}
            >
              <LeftOutlined />
            </button> */}
            <div className="container">
              <div className="scroll-wrapper" ref={scrollContainerRef}>
                <Title level={3} className="customTitle">
                  Barber Shop - Salon gợi ý
                </Title>
                <div className="scroll-icons">
                  <LeftCircleOutlined
                    className="scroll-icon"
                    onClick={() => {
                      const container = scrollContainerRef.current;
                      container.scrollBy({ left: -250, behavior: "smooth" });
                    }}
                  />
                  <RightCircleOutlined
                    className="scroll-icon"
                    onClick={() => {
                      const container = scrollContainerRef.current;
                      container.scrollBy({ left: 250, behavior: "smooth" });
                    }}
                  />
                </div>
                <div className="scroll-content mt-12">
                  {recommendedSalons?.length > 0 ? (
                    recommendedSalons?.map((item, index) => (
                      <Card
                        hoverable
                        style={{
                          width: "25rem",
                          position: "relative",
                          backgroundColor: "#ece8de",
                        }} // Add position: relative to parent
                        key={item.id}
                        className="small-card"
                        cover={
                          <img
                            style={{
                              objectFit: "cover", //display image in card
                              height: "15rem",
                              width: "100%",
                              cursor: "default",
                            }}
                            alt={item.name}
                            src={item.img}
                          />
                        }
                        actions={
                          heartButton[index]
                            ? [
                                <HeartFilled
                                  onClick={() => handleHeartButton(item, index)}
                                  style={{ color: "red" }}
                                  key="heart"
                                />,
                              ]
                            : [
                                <HeartOutlined
                                  onClick={() => handleHeartButton(item, index)}
                                  key="heart"
                                />,
                              ]
                        }
                      >
                        <Card.Meta
                          onClick={() => navigate(`/salon_detail/${item.id}`)}
                          title={
                            <>
                              <Title
                                level={4}
                                style={{
                                  fontSize: "1.5rem",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  maxWidth: "23rem",
                                }}
                              >
                                {item.name}
                              </Title>
                            </>
                          }
                          description={
                            <div className="h-[7rem]">
                              <Text
                                style={{
                                  fontSize: "1.2rem",
                                }}
                              >
                                <EnvironmentOutlined /> {item.address}
                              </Text>
                            </div>
                          }
                        />
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <div
                            style={{
                              backgroundColor: "rgba(191, 148, 86, 0.8)",
                              color: "white",
                              padding: "1rem",
                              borderRadius: "0 8px 0 8px",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              fontSize: "1rem",
                            }}
                          >
                            {item.totalReviewer > 0 ? (
                              <>
                                <div>{item.totalRating}/5</div>
                                <div>{item.totalReviewer} đánh giá</div>
                              </>
                            ) : (
                              <div>Không có đánh giá</div>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <EmptyComponent description={"Hiện không có salon nào!"} />
                  )}
                </div>
              </div>
            </div>
            {/* <button
              className="arrow-button mr-[20rem] text-gray-800"
              onClick={() => handleScroll("right")}
            >
              <RightOutlined />
            </button> */}
          </Flex>
          <section
            className="section service mt-32"
            id="services"
            aria-label="services"
            // style={{ marginBottom: "100px" }}
          >
            <div className="container">
              <Title
                level={3}
                className="customTitle"
                style={{ color: "#bf9456" }}
              >
                Dịch vụ nổi bật
              </Title>
              {/* <Text className="section-text text-center text-4xl">
                Dưới đây là 1 số dịch vụ có thể bao gồm trong những Barber Shop,
                những cũng có thể có thêm vài dịch vụ bổ sung từ các tiệm
              </Text> */}
              <div className="container-service-list">
                <ArrowLeftOutlined
                  className="scroll-icon2 left-icon"
                  onClick={scrollLeft}
                />
                <ul className="card-list">
                  <li>
                    <div className="service-card2">
                      <div className="card-img flex justify-center">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <img
                            src={img1}
                            alt="img"
                            style={{
                              width: "100%",
                              height: "100%",
                              maxWidth: "35rem",
                              maxHeight: "35rem",
                              objectFit: "cover",
                              borderRadius: "2rem",
                              paddingTop: "1rem",
                            }}
                            onClick={() => {
                              navigate("/list_salon_ver2?servicesName=Cắt tóc");
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="service-card2">
                      <div className="card-img flex justify-center">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <img
                            src={img2}
                            alt="img"
                            style={{
                              width: "100%",
                              height: "100%",
                              maxWidth: "35rem",
                              maxHeight: "35rem",
                              objectFit: "cover",
                              borderRadius: "2rem",
                              paddingTop: "1rem",
                            }}
                            onClick={() => {
                              navigate("/list_salon_ver2?servicesName=Gội đầu");
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="service-card2">
                      <div className="card-img flex justify-center">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <img
                            src={img3}
                            alt="img"
                            style={{
                              width: "100%",
                              height: "100%",
                              maxWidth: "35rem",
                              maxHeight: "35rem",
                              objectFit: "cover",
                              borderRadius: "2rem",
                              paddingTop: "1rem",
                            }}
                            onClick={() => {
                              navigate(
                                "/list_salon_ver2?servicesName=Lấy ráy tai"
                              );
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="service-card2">
                      <div className="card-img flex justify-center">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <img
                            src={img4}
                            alt="img"
                            style={{
                              width: "100%",
                              height: "100%",
                              maxWidth: "35rem",
                              maxHeight: "35rem",
                              objectFit: "cover",
                              borderRadius: "2rem",
                              paddingTop: "1rem",
                            }}
                            onClick={() => {
                              navigate(
                                "/list_salon_ver2?servicesName=Dịch vụ làm đẹp"
                              );
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="service-card2">
                      <div className="card-img flex justify-center">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <img
                            src={img5}
                            alt="img"
                            style={{
                              width: "100%",
                              height: "100%",
                              maxWidth: "35rem",
                              maxHeight: "35rem",
                              objectFit: "cover",
                              borderRadius: "2rem",
                              paddingTop: "1rem",
                            }}
                            onClick={() => {
                              navigate("/list_salon_ver2?servicesName=Cạo râu");
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="service-card2">
                      <div className="card-img flex justify-center">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <img
                            src={img6}
                            alt="img"
                            style={{
                              width: "100%",
                              height: "100%",
                              maxWidth: "35rem",
                              maxHeight: "35rem",
                              objectFit: "cover",
                              borderRadius: "2rem",
                              paddingTop: "1rem",
                            }}
                            onClick={() => {
                              navigate(
                                "/list_salon_ver2?servicesName=Nhuộm tóc"
                              );
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="service-card2">
                      <div className="card-img flex justify-center">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <img
                            src={img7}
                            alt="img"
                            style={{
                              width: "100%",
                              height: "100%",
                              maxWidth: "35rem",
                              maxHeight: "35rem",
                              objectFit: "cover",
                              borderRadius: "2rem",
                              paddingTop: "1rem",
                            }}
                            onClick={() => {
                              navigate(
                                "/list_salon_ver2?servicesName=Phục hồi tóc"
                              );
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="service-card2">
                      <div className="card-img flex justify-center">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <img
                            src={img8}
                            alt="img"
                            style={{
                              width: "100%",
                              height: "100%",
                              maxWidth: "35rem",
                              maxHeight: "35rem",
                              objectFit: "cover",
                              borderRadius: "2rem",
                              paddingTop: "1rem",
                            }}
                            onClick={() => {
                              navigate("/list_salon_ver2?servicesName=Uốn tóc");
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
                <ArrowRightOutlined
                  className="scroll-icon2 right-icon"
                  onClick={scrollRight}
                />
              </div>
            </div>
          </section>

          <Title
            level={3}
            className="customTitle1"
            style={{ color: "#bf9456" }}
          >
            ĐẶT LỊCH MỌI LÚC
          </Title>
          <Title
            level={3}
            className="customTitle"
            style={{ marginBlock: "5px" }}
          >
            PHỤC VỤ MỌI NƠI
          </Title>
          <div className="container">
            <Row className="location-container">
              <Col xs={24} md={12} className="location-card-container">
                <Card
                  className="location-card"
                  style={{
                    textAlign: "center",
                    padding: "2rem",
                    backgroundColor: "#DDF0FF",
                  }}
                >
                  {/* <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "1rem",
                    }}
                  >
                    <Avatar
                      size={50}
                      shape="square"
                      src={logo}
                      style={{
                        border: "2px solid #bf9456",
                      }}
                    />
                    <Text
                      style={{
                        marginLeft: "1rem",
                        fontSize: "1.5rem",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      Hairhub Mobile Android App
                    </Text>
                  </div> */}
                  <Title level={3}>HAIRHUB ANDROID APP</Title>
                  <Text
                    style={{
                      // fontSize: "2.5rem",
                      fontWeight: "bold",
                      marginBottom: "1rem",
                      display: "block",
                    }}
                  >
                    Sử dụng ứng dụng di động Hairhub để nhận được nhiều tính
                    năng thú vị và ưu đãi hấp dẫn
                  </Text>
                  <Text
                    style={{
                      fontSize: "1.7rem",
                      marginBottom: "0.5rem",
                      display: "block",
                      padding: "5px",
                    }}
                  >
                    Nhận được nhiều voucher giảm giá từ salon, hệ thống
                  </Text>
                  <Text
                    style={{
                      fontSize: "1.7rem",
                      marginBottom: "1rem",
                      display: "block",
                      padding: "5px",
                    }}
                  >
                    Các tính năng nâng cấp như lưu giữ kiểu tóc người dùng
                  </Text>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "1rem",
                    }}
                  >
                    <img
                      src={bannerHomepage1}
                      alt="bannerHomepage1"
                      style={{
                        width: "100%",
                        height: "auto",
                        maxWidth: "40rem",
                        maxHeight: "40rem",
                        objectFit: "contain",
                        borderRadius: "0 2px 2px 0",
                      }}
                    />
                  </div>
                </Card>
              </Col>
              <Col xs={24} md={12} className="location-card-container">
                <Card
                  bodyStyle={{ padding: 0 }}
                  className="location-card"
                  style={{
                    textAlign: "center",
                    padding: "2rem",
                    backgroundColor: "#E1E1E1",
                  }}
                >
                  <div className="location-card-col">
                    <div style={{ padding: "1rem" }}>
                      <Title level={3}>BẬT CHỨC NĂNG VỊ TRÍ</Title>
                      <Text
                        style={{
                          // fontSize: "2.5rem",
                          fontWeight: "bold",
                          marginBottom: "1rem",
                          display: "block",
                        }}
                      >
                        Dễ dàng tìm kiếm, đặt lịch ở các sanlon, barber shop gần
                        bạn bằng cách bật chức năng vị trí
                      </Text>
                      <div
                        // style={{
                        //   marginTop: "1rem",
                        //   display: "flex",
                        //   alignItems: "center",
                        //   justifyContent: "center",
                        // }}
                        className="location-card-buton"
                      >
                        <Button
                          // onClick={() => navigate("/search-near-you")}
                          style={{
                            borderWidth: "0",
                          }}
                          className="location-buton1"
                        >
                          Tìm kiếm gần bạn
                        </Button>
                        <Button
                          style={{
                            borderWidth: "0",
                          }}
                          className="location-buton2"
                        >
                          Không phải bây giờ
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "1rem",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={locationPhone}
                      alt="locationPhone Banner"
                      style={{
                        width: "100%",
                        height: "100%",
                        maxWidth: "40rem",
                        maxHeight: "50rem",
                        objectFit: "cover",
                        borderRadius: "0 2px 2px 0",
                      }}
                    />
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
          {/* <div className="container" style={{ marginBlock: "10rem" }}>
            <Card bodyStyle={{ padding: 0 }} className="location-card">
              <Row>
                <Col xs={24} md={16} className="location-card-col">
                  <div style={{ padding: "1rem" }}>
                    <Title level={3} style={{ color: "white" }}>
                      Bật chức năng vị trí
                    </Title>
                    <Text style={{ color: "white" }}>
                      Để tìm kiếm cửa hàng gần bạn
                    </Text>
                    <div
                      // style={{
                      //   marginTop: "1rem",
                      //   display: "flex",
                      //   alignItems: "center",
                      //   justifyContent: "center",
                      // }}
                      className="location-card-buton"
                    >
                      <Button
                        // onClick={() => navigate("/search-near-you")}
                        style={{
                          borderWidth: "0",
                        }}
                        className="location-buton1"
                      >
                        Tìm kiếm gần bạn
                      </Button>
                      <Button
                        style={{
                          borderWidth: "0",
                        }}
                        className="location-buton2"
                      >
                        Không phải bây giờ
                      </Button>
                    </div>
                  </div>
                </Col>
                <Col xs={24} md={8}>
                  <img
                    src={locationPhone}
                    alt="locationPhone Banner"
                    style={{
                      width: "100%",
                      height: "100%",
                      maxWidth: "30rem",
                      maxHeight: "30rem",
                      objectFit: "cover",
                      borderRadius: "0 2px 2px 0",
                    }}
                  />
                </Col>
              </Row>
            </Card>
          </div>
          <div
            className="container"
            style={{ maxWidth: "80rem", margin: "auto" }}
          >
            <Card
              className="banner-card"
              style={{ textAlign: "center", padding: "2rem" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1rem",
                }}
              >
                <Avatar
                  size={50}
                  shape="square"
                  src={logo}
                  style={{
                    border: "2px solid #bf9456",
                  }}
                />
                <Text
                  style={{
                    marginLeft: "1rem",
                    fontSize: "1.5rem",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  Hairhub Mobile Android App
                </Text>
              </div>
              <Text
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "bold",
                  marginBottom: "1rem",
                  display: "block",
                }}
              >
                Tìm kiếm, đặt lịch tiện lợi hơn với ứng dụng di động
              </Text>
              <Text
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  marginBottom: "1rem",
                  display: "block",
                }}
              >
                Sử dụng ứng dụng di động Hairhub để nhận được nhiều tính năng
                thú vị và ưu đãi hấp dẫn:
              </Text>
              <Text
                style={{
                  fontSize: "1.7rem",
                  marginBottom: "0.5rem",
                  display: "block",
                }}
              >
                Nhận được nhiều voucher giảm giá từ salon, hệ thống
              </Text>
              <Text
                style={{
                  fontSize: "1.7rem",
                  marginBottom: "1rem",
                  display: "block",
                }}
              >
                Các tính năng nâng cấp như lưu giữ kiểu tóc người dùng
              </Text>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center", // Căn giữa ảnh theo chiều ngang
                  marginTop: "1rem",
                }}
              >
                <img
                  src={bannerHomepage1}
                  alt="bannerHomepage1"
                  style={{
                    width: "100%",
                    height: "auto",
                    maxWidth: "40rem",
                    maxHeight: "40rem",
                    objectFit: "contain",
                    borderRadius: "0 2px 2px 0",
                  }}
                />
              </div>
            </Card>
          </div> */}
          <div className="container">
            <Card bodyStyle={{ padding: 0 }} className="card-homepage">
              <Row>
                <Col xs={24} md={14} className="location-card-col">
                  <Title level={2} className="title-card-homepage">
                    Tìm kiếm nhanh chóng, chỉ đường dễ dàng
                  </Title>
                  <Text className="text-card-homepage">
                    Hairhub giúp bạn tìm kiếm nhanh chóng các tiệm salon, barber
                    shop ở gần vị trí của bạn theo tên cửa tiệm tóc, tên dịch
                    vụ.{" "}
                  </Text>
                  <Text className="text-card-homepage">
                    Hairhub còn giúp chỉ đường cho bạn đến cửa tiệm tóc bằng bản
                    đồ Google Map dễ dàng.{" "}
                  </Text>
                </Col>
                <Col xs={24} md={10}>
                  <div style={{ position: "relative", paddingTop: "80%" }}>
                    <video
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                      autoPlay
                      loop
                      muted
                      playsInline
                      disablePictureInPicture
                      controlsList="nodownload nofullscreen noremoteplayback"
                    >
                      <source src={video} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </Col>
              </Row>
            </Card>
          </div>

          <div className="container">
            <Card bodyStyle={{ padding: 0 }} className="card-homepage">
              <Row>
                <Col xs={24} md={10}>
                  <div style={{ position: "relative", paddingTop: "80%" }}>
                    <video
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                      autoPlay
                      loop
                      muted
                      playsInline
                      disablePictureInPicture
                      controlsList="nodownload nofullscreen noremoteplayback"
                    >
                      <source src={video1} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </Col>
                <Col xs={24} md={14} className="location-card-col">
                  <Title level={2} className="title-card-homepage">
                    Đặt lịch tiện lợi, quản lý dễ dàng
                  </Title>
                  <Text className="text-card-homepage">
                    Bạn hoàn toàn có thể đặt lịch hẹn trực tuyến với cửa tiệm
                    tóc chỉ vài thao tác đơn giản.
                  </Text>
                  <Text className="text-card-homepage">
                    Đặt lịch hẹn theo cửa tiệm tóc, khung giờ và dịch vụ giúp
                    bạn tiết kiệm thời gian hơn mà không phải chờ đợi
                  </Text>
                  <Text className="text-card-homepage">
                    Bạn cũng có thể dễ dàng quản lý lịch hẹn sẽ giúp bạn có thể
                    bám sát lịch trình rõ ràng hơn.
                  </Text>
                  <Text className="text-card-homepage">
                    Nhận được nhiều voucher hấp dẫn từ hệ thống và cửa tiệm tóc
                    khi sử dụng ứng dụng Hairhub trên điện thoại.
                  </Text>
                </Col>
              </Row>
            </Card>
          </div>
          <div className="container">
            <Card bodyStyle={{ padding: 0 }} className="card-homepage">
              <Row>
                <Col xs={24} md={14} className="location-card-col">
                  <Title level={2} className="title-card-homepage">
                    Check in tức thời, đánh giá thuận tiện
                  </Title>
                  <Text className="text-card-homepage">
                    Khi đến barber shop, salon hãy quét mã QR để check in nhanh
                    chóng cho đơn đặt lịch của mình.
                  </Text>
                  <Text className="text-card-homepage">
                    Ngoài ra, sau khi hoàn thành đơn cắt tóc của mình, bạn cũng
                    có thể đánh giá cho salon, barber shop và xem nó ở phần
                    thông tin của cửa tiệm tóc trên Hairhub.
                  </Text>
                </Col>
                <Col xs={24} md={10}>
                  <div style={{ position: "relative", paddingTop: "80%" }}>
                    <video
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                      autoPlay
                      loop
                      muted
                      playsInline
                      disablePictureInPicture
                      controlsList="nodownload nofullscreen noremoteplayback"
                    >
                      <source src={video2} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </Col>
              </Row>
            </Card>
          </div>
          {/* SERVICE */}
          {/* <section
            className="section service mt-32"
            id="services"
            aria-label="services"
            // style={{ marginBottom: "100px" }}
          >
            <div className="container">
              <Title level={3} className="section-title customTitle text-start">
                Những dịch vụ nổi bật
              </Title>
              <div className="containerServiceList">
                <ul className="grid-list">
                  <li>
                    <div className="service-card">
                      <div className="card-icon flex justify-center">
                        <LiaCutSolid />
                      </div>
                      <Title className="card-title" level={3}>
                        Cắt tóc
                      </Title>
                      <Text className="card-text">Có tóc thì mới được cắt</Text>
                      <a
                        onClick={() => handleFilterService("cắt tóc")}
                        // href=""
                        className="card-btn"
                        aria-label="more"
                      >
                        <FaArrowRight />
                      </a>
                    </div>
                  </li>
                  <li>
                    <div className="service-card">
                      <div className="card-icon flex justify-center">
                        <PiHairDryerBold />
                      </div>
                      <Title className="card-title" level={3}>
                        Gội đầu
                      </Title>
                      <Text className="card-text">Có tóc thì mới được gội</Text>
                      <a
                        onClick={() => handleFilterService("gội đầu")}
                        //  href="#"
                        className="card-btn"
                        aria-label="more"
                      >
                        <FaArrowRight />
                      </a>
                    </div>
                  </li>
                  <li>
                    <div className="service-card">
                      <div className="card-icon flex justify-center">
                        <BsFillEarFill />
                      </div>
                      <Title className="card-title" level={3}>
                        Ráy tai
                      </Title>
                      <Text className="card-text">Lấy ráy tai</Text>
                      <a
                        
                        onClick={() => handleFilterService("ráy tai")}
                        className="card-btn"
                        aria-label="more"
                      >
                        <FaArrowRight />
                      </a>
                    </div>
                  </li>
                  <li>
                    <div className="service-card">
                      <div className="card-icon flex justify-center">
                        <BsFillPencilFill />
                      </div>
                      <Title className="card-title" level={3}>
                        Dịch vụ làm đẹp
                      </Title>
                      <Text className="card-text">
                        Không phải dịch vụ làm xấu
                      </Text>
                      <a href="#" className="card-btn" aria-label="more">
                        <FaArrowRight />
                      </a>
                    </div>
                  </li>
                  <li>
                    <div className="service-card">
                      <div className="card-icon flex justify-center">
                        <BsFillCupHotFill />
                      </div>
                      <Title className="card-title" level={3}>
                        Cạo râu
                      </Title>
                      <Text className="card-text">Có râu mới được cạo</Text>
                      <a
                        onClick={() => handleFilterService("cạo râu")}
                        className="card-btn"
                        aria-label="more"
                      >
                        <FaArrowRight />
                      </a>
                    </div>
                  </li>
                  <li>
                    <div className="service-card">
                      <div className="card-icon flex justify-center">
                        <BsFillBagCheckFill />
                      </div>
                      <Title className="card-title" level={3}>
                        Nhuộm tóc
                      </Title>
                      <Text className="card-text">Có tóc mới được nhuộm</Text>
                      <a href="#" className="card-btn" aria-label="more">
                        <FaArrowRight />
                      </a>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </section> */}

          <Modal
            title="Thông báo thanh toán"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
              <Button key="back" onClick={handleCancel}>
                Hủy
              </Button>,
              <Button key="submit" type="primary" onClick={handleOk}>
                Quay về lịch sử thanh toán thành công
              </Button>,
            ]}
          >
            <Card
              style={{ width: "100%", textAlign: "center", padding: "20px" }}
            >
              <CheckCircleOutlined
                style={{ fontSize: "64px", color: "#52c41a" }}
              />
              <Title level={2} style={{ color: "#52c41a", marginTop: "16px" }}>
                THANH TOÁN THÀNH CÔNG
              </Title>
              <div style={{ marginTop: "16px" }}>
                <Text>
                  Mã đơn:{" "}
                  <Text strong style={{ display: "inline" }}>
                    #{id}
                  </Text>{" "}
                  - Tổng tiền:{" "}
                  <Text strong style={{ display: "inline" }}>
                    {formatVND(amount)}
                  </Text>
                </Text>
              </div>
              <Text style={{ display: "block", marginTop: "8px" }}>
                Kiểu thanh toán: Online
              </Text>
            </Card>
          </Modal>
        </article>
      </main>
    </div>
  );
}

export default HomePage;
