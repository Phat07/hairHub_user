import React, { useEffect, useRef, useState } from "react";
import "../css/flaticon.min.css";
import "../css/ListSalon.css";
import "../css/style.css";
import "../css/salonDetail.css";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LiaCutSolid } from "react-icons/lia";
import { FaArrowRight } from "react-icons/fa";
import { PiHairDryerBold } from "react-icons/pi";
import {
  BsFillBagCheckFill,
  BsFillCupHotFill,
  BsFillEarFill,
  BsFillPencilFill,
} from "react-icons/bs";
import { IoMenu } from "react-icons/io5";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  Button,
  Card,
  Flex,
  message,
  Modal,
  Rate,
  Space,
  Typography,
} from "antd";
import heroBanner from "../assets/images/bannerHomePage.jpg";
import {
  CheckCircleOutlined,
  EnvironmentOutlined,
  HeartFilled,
  HeartOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
const { Title, Text } = Typography;

import { useDispatch, useSelector } from "react-redux";
import { actGetAllSalonInformation } from "../store/salonInformation/action";
import { actGetStatusPayment } from "../store/salonPayment/action";
import { EmptyComponent } from "../components/EmptySection/DisplayEmpty";

function HomePage(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const salonList = useSelector((state) => state.SALONINFORMATION.getSalonSuggestion);
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
              className="container"
            >
              <Title
                className="hero-title"
                style={{ fontSize: "10rem", margin: "0" }}
              >
                Hệ thống
              </Title>
              <Title
                className="hero-title"
                style={{ fontSize: "6.5rem", margin: "0", fontWeight: "bold" }}
              >
                Salon - Barber Shop
              </Title>
              <Text className="hero-text text-4xl">
                Trải nghiệm những dịch vụ tốt nhất từ những salon, barber shop
                tốt nhất trên thị trường Việt Nam
              </Text>
              <Link to={"/list_salon"}>
                <Text className="btn has-before text-white hover:text-blue-600">
                  Khám phá những dịch vụ của chúng tôi
                </Text>
              </Link>
            </motion.div>
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
                <Title className="customTitle">Những tiệm Barber gần đây</Title>
                <div className="scroll-content mt-12">
                  {recommendedSalons?.length > 0 ? (
                    recommendedSalons?.map((item, index) => (
                      <Card
                        hoverable
                        style={{ width: "25rem" }}
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
                              <Title level={4}>{item.name}</Title>
                            </>
                          }
                          description={
                            <div className="h-[12rem]">
                              {/* <Rate
                              disabled
                              defaultValue="5.0"
                              style={{ fontSize: 12 }}
                            /> */}
                              <Text>{item.reviews}</Text>
                              <Text>
                                <EnvironmentOutlined /> {item.address}
                              </Text>
                            </div>
                          }
                        />
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
          {/* SERVICE */}
          <section
            className="section service mt-32"
            id="services"
            aria-label="services"
          >
            <div className="container">
              <Title className="section-title customTitle text-start">
                Những dịch vụ mà chúng tôi cung cấp
              </Title>
              {/* <Text className="section-text text-center text-4xl">
                Dưới đây là 1 số dịch vụ có thể bao gồm trong những Barber Shop,
                những cũng có thể có thêm vài dịch vụ bổ sung từ các tiệm
              </Text> */}
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
                        //  href="#"
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
                        //  href="#"
                        onClick={() => handleFilterService("cạo râu")}
                        className="card-btn"
                        aria-label="more"
                      >
                        {/* <ion-icon name="arrow-forward" aria-hidden="true" /> */}
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
                        {/* <ion-icon name="arrow-forward" aria-hidden="true" /> */}
                        <FaArrowRight />
                      </a>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </section>
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
