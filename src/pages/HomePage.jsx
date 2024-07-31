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
import { BsFillEarFill } from "react-icons/bs";
import { IoMenu } from "react-icons/io5";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button, Card, Flex, message, Modal, Rate, Space, Typography } from "antd";
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
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { actGetStatusPayment } from "../store/salonPayment/action";

function HomePage(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const salonList = useSelector((state) => state.SALONINFORMATION.getAllSalon);
  const [heartButton, setHeartButton] = useState(
    Array(salonList.length).fill(false)
  );
  const auth = useAuthUser();
  const ownerId = auth?.idOwner;
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
      .then(() => {
        navigate("/listPayment");
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
              <Title className="hero-title" style={{ fontSize: "10rem" }}>
                Hệ thống Salon - Barber Shop
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
                  {recommendedSalons?.map((item, index) => (
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
                  ))}
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
              <Text className="section-text text-center text-4xl">
                Dưới đây là 1 số dịch vụ có thể bao gồm trong những Barber Shop,
                những cũng có thể có thêm vài dịch vụ bổ sung từ các tiệm
              </Text>
              <div className="containerServiceList">
                <ul className="grid-list">
                  <li>
                    <div className="service-card">
                      <div className="card-icon flex justify-center">
                        {/* <i className="flaticon-salon" /> */}
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
                        <svg
                          fill="#D5A153"
                          height="70px"
                          width="70px"
                          version="1.1"
                          id="Layer_1"
                          xmlns="http://www.w3.org/2000/svg"
                          xmlns:xlink="http://www.w3.org/1999/xlink"
                          viewBox="0 0 512.00 512.00"
                          xml:space="preserve"
                          stroke="#000000"
                        >
                          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                          <g
                            id="SVGRepo_tracerCarrier"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke="#CCCCCC"
                            stroke-width="24.576"
                          >
                            {" "}
                            <g>
                              {" "}
                              <g>
                                {" "}
                                <path d="M345.498,33.391l60.68,45.617l20.065-26.69L356.65,0H116.837v33.391h50.298v41.804h-31.498v78.978 c-44.01,12.215-76.408,52.63-76.408,100.477V512h316.057V254.649c0-47.846-32.4-88.262-76.409-100.477V75.195h-31.499V33.391 H345.498z"></path>{" "}
                              </g>{" "}
                            </g>{" "}
                            <g>
                              {" "}
                              <g>
                                {" "}
                                <path d="M429.775,111.144c-1.031-1.317-2.003-2.56-2.886-3.716l-10.68-14.01l-10.682,14.009c-0.882,1.156-1.853,2.399-2.884,3.715 c-9.159,11.706-23,29.396-23,48.27c0,20.161,16.403,36.563,36.563,36.563s36.563-16.402,36.563-36.563 C452.773,140.537,438.934,122.849,429.775,111.144z"></path>{" "}
                              </g>{" "}
                            </g>{" "}
                          </g>
                          <g id="SVGRepo_iconCarrier">
                            {" "}
                            <g>
                              {" "}
                              <g>
                                {" "}
                                <path d="M345.498,33.391l60.68,45.617l20.065-26.69L356.65,0H116.837v33.391h50.298v41.804h-31.498v78.978 c-44.01,12.215-76.408,52.63-76.408,100.477V512h316.057V254.649c0-47.846-32.4-88.262-76.409-100.477V75.195h-31.499V33.391 H345.498z"></path>{" "}
                              </g>{" "}
                            </g>{" "}
                            <g>
                              {" "}
                              <g>
                                {" "}
                                <path d="M429.775,111.144c-1.031-1.317-2.003-2.56-2.886-3.716l-10.68-14.01l-10.682,14.009c-0.882,1.156-1.853,2.399-2.884,3.715 c-9.159,11.706-23,29.396-23,48.27c0,20.161,16.403,36.563,36.563,36.563s36.563-16.402,36.563-36.563 C452.773,140.537,438.934,122.849,429.775,111.144z"></path>{" "}
                              </g>{" "}
                            </g>{" "}
                          </g>
                        </svg>
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
                        {/* <i className="flaticon-shaving-razor" /> */}
                        <svg
                          fill="#D5A153"
                          height="70px"
                          width="70px"
                          version="1.1"
                          id="Layer_1"
                          xmlns="http://www.w3.org/2000/svg"
                          xmlns:xlink="http://www.w3.org/1999/xlink"
                          viewBox="0 0 239.659 239.659"
                          xml:space="preserve"
                        >
                          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                          <g
                            id="SVGRepo_tracerCarrier"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></g>
                          <g id="SVGRepo_iconCarrier">
                            {" "}
                            <g>
                              {" "}
                              <g>
                                {" "}
                                <g>
                                  {" "}
                                  <path d="M124.991,182.352c1.508-1.728,2.472-3.808,2.624-5.896c0.376-5.164-2.588-9.772-5.656-14.048 c-2.488-3.472-5.304-7.404-5.164-11.456c0.1-2.884,1.668-5.624,3.324-8.528c0.752-1.308,1.496-2.616,2.124-3.952 c2.64-5.616,3.064-11.54,1.184-16.684c-0.788-2.152-2.012-4.12-3.54-5.812v-0.744c0-3.54-1.64-6.664-4.14-8.64 c0.38-0.44,0.74-0.976,1.064-1.676c7.076-15.36,14.812-31.784,23.664-50.212c1.184-2.468,0.98-4.468-0.672-6.684 c-11.172-14.972-25.904-22.592-45.028-23.296c-16.412-0.836-31.404,5.896-44.46,20.052l-0.676,0.728 c-2.552,2.624-1.232,5.656-0.796,6.652c4.636,10.636,9.228,21.296,13.816,31.952l6.608,15.34c0.28,0.648,0.516,1.364,0.756,2.084 c0.66,1.992,1.444,4.192,3.104,5.468c-2.224,1.988-3.668,4.92-3.668,8.232v0.816c-1.516,1.68-2.76,3.604-3.54,5.74 c-1.88,5.14-1.456,11.068,1.184,16.68c0.628,1.336,1.38,2.652,2.124,3.96c1.656,2.9,3.224,5.636,3.32,8.516 c0.048,1.332-0.244,2.648-0.72,3.94c-0.44-0.292-0.812-0.576-0.904-0.772c-2.132-10.916-9.94-15.904-18.06-19.668 c-4.708-2.188-7.696-4.916-6.976-11.128l0.384-3.332l-3.104,1.264c-9.232,3.764-15.224,9.196-18.86,17.096 c-1.168,2.544-2.516,4.344-3.792,5.068l-1.024,0.576c-5.38,3.012-8.456,4.74-9.724,11.896c-5.416,2.768-7.772,9.196-5.92,16.24 c-6.572,9.9-4.7,18.996,5.444,26.344c9.872,7.156,20.144,10.736,30.728,10.736c8.076,0,16.328-2.084,24.72-6.26l1.196-0.612 c1.6-0.832,3.256-1.692,4.688-1.776c2.604-0.148,5.008-0.716,7.212-1.576h43.848c4.768,0,8.648-3.88,8.648-8.648 C130.331,186.74,128.123,183.656,124.991,182.352z M72.919,97.872L66.31,82.536c-4.592-10.664-9.184-21.328-13.82-31.968 c-0.692-1.584-0.34-1.948,0.004-2.3l0.748-0.8c11.548-12.516,24.592-18.844,38.828-18.844c0.836,0,1.68,0.02,2.528,0.068h0.028 c17.856,0.656,31.596,7.752,42.008,21.704c0.728,0.976,0.844,1.412,0.272,2.596c-8.86,18.444-16.608,34.888-23.688,50.264 c-0.472,1.024-0.592,1.08-1.888,1.036c-2.156-0.02-5.196,0-8.58,0.028l3.688-20.416c0.108-0.616-0.3-1.204-0.916-1.316 c-0.636-0.124-1.208,0.3-1.32,0.916l-3.764,20.836c-1.36,0.012-2.848,0.024-4.404,0.036l-0.26-24.044 c-0.004-0.624-0.512-1.124-1.132-1.124c-0.004,0-0.008,0-0.012,0c-0.624,0.004-1.128,0.52-1.12,1.144l0.26,24.036 c-0.748,0.004-1.5,0.008-2.256,0.012h-2.848l-3.508-20.652c-0.104-0.616-0.664-1.04-1.308-0.928 c-0.616,0.104-1.032,0.688-0.924,1.308l3.444,20.272c-5.332-0.024-9.836-0.136-10.776-0.448c-0.728-0.452-1.32-2.232-1.792-3.664 C73.523,99.448,73.243,98.62,72.919,97.872z M115.655,113.248H73.703c0.78-2.824,3.192-4.884,6.032-4.884h29.888 C112.463,108.364,114.871,110.424,115.655,113.248z M70.703,136.784c-2.192-4.652-2.564-9.496-1.052-13.636 c0.848-2.324,2.356-4.356,4.236-5.932h41.596c1.876,1.576,3.368,3.616,4.216,5.932c1.512,4.14,1.14,8.984-1.052,13.632 c-0.584,1.244-1.28,2.456-1.976,3.672c-1.824,3.192-3.712,6.492-3.848,10.356c-0.188,5.404,3.192,10.12,5.908,13.908 c2.752,3.84,5.204,7.604,4.92,11.448c-0.104,1.452-0.924,3.02-2.308,4.304c-0.396,0.428-0.944,0.816-1.444,1.216H90.471 c0.012-0.156,0.056-0.296,0.064-0.452c0.752-12.9-7.62-19.708-15.004-24.204c-0.068-0.04-0.152-0.084-0.224-0.124 c0.788-1.912,1.284-3.948,1.208-6.096c-0.132-3.86-2.02-7.16-3.844-10.348C71.987,139.244,71.287,138.028,70.703,136.784z M70.399,196.6c-2.28,0.132-4.412,1.24-6.292,2.216l-1.128,0.58c-17.964,8.936-35.244,7.544-51.352-4.136 c-7.996-5.792-9.632-12.088-5.212-19.64c8.552,14.096,24.244,20.8,40.768,17.416c1.428-0.292,0.824-2.48-0.604-2.188 c-16,3.276-30.888-3.54-38.808-17.416l0.432-0.616l-0.292-0.936c-1.78-5.656-0.18-10.6,3.924-12.54 c9.184,9.628,21.664,14.756,35.064,14.232c1.456-0.056,1.46-2.324,0-2.268c-12.84,0.5-24.608-4.332-33.408-13.512l0.036-0.264 c0.868-6.132,2.5-7.048,7.904-10.076l1.04-0.584c0.948-0.536,1.84-1.344,2.688-2.36c1.168,6.532,6.64,11.528,13.876,11.44 c1.46-0.016,1.464-2.284,0-2.268c-6.948,0.084-12.232-5.44-11.868-12.24c0.252-0.468,0.508-0.916,0.748-1.436 c2.852-6.196,7.208-10.548,13.932-13.824c0.452,6.796,5.12,9.896,9.348,11.86c8.164,3.788,13.956,8.072,15.74,16.484 c-0.016,0.036-0.048,0.06-0.06,0.104c-1.58,4.504-5.492,7.604-10.176,8.332c-1.436,0.224-0.828,2.408,0.604,2.188 c4.836-0.752,8.856-3.836,10.996-8.124c1.012,1.044,2.42,1.872,3.772,2.608c0.496,0.268,0.98,0.532,1.408,0.792 c9.684,5.896,13.6,12.052,13.104,20.584C86.071,189.808,79.567,196.072,70.399,196.6z M84.243,195.016 c2.66-2.468,4.576-5.652,5.564-9.36h3.064l-3.156,9.36H84.243z M99.698,195.016h-7.4l3.156-9.36h6.684L99.698,195.016z M109.299,195.016h-7.056l2.444-9.36h7.092L109.299,195.016z M119.051,195.016h-7.208l2.48-9.36h7.28L119.051,195.016z M121.683,195.016h-0.076l2.368-8.672c1.4,0.808,2.388,2.264,2.388,3.992C126.359,192.916,124.263,195.016,121.683,195.016z"></path>{" "}
                                  <path d="M229.235,89.592c-2.492-1.98-5.7-2.732-9.032-2.128c-3.236,0.588-6.2,2.4-8.34,5.1 c-46.528,58.728-46.692,58.972-46.756,59.064l-0.944,1.416l1.248,1.16c3.016,2.796,3.564,7.672,1.324,11.856l-0.136,0.252 c-0.232,0.372-0.668,1-0.912,1.352c-0.524-1.096-1.028-2.184-1.632-3.336c-1.484-2.848-3.008-5.392-4.484-7.848 c-5.752-9.584-10.296-17.156-7.364-34.348c0.776-4.556,4.448-10.6,7.4-15.456c0.9-1.484,1.752-2.888,2.464-4.152l0.604-1.064 l-0.676-1.024c-2.548-3.868-5.98-7.196-9.928-9.636c-0.968-0.592-2.06-1.124-3.36-1.012c-1.772,0.156-2.82,1.468-3.512,2.336 l-0.352,0.432c-26.224,30.6-8.372,67.632,1.216,87.524l0.156,0.324c-11.308,9-11.44,25.264-8.168,31.832 c0.716,1.432,2.112,2.476,3.652,2.716c0.224,0.036,0.444,0.052,0.66,0.052c2.248,0,4.032-1.84,4.632-3.752 c0.364-1.164,0.308-2.272,0.256-3.252c-0.024-0.452-0.052-0.904-0.016-1.348c0.844-10.056,3.688-13.236,5.9-14.82 c2.608,3.34,4.836,4.744,7.248,4.744c0.02,0,0.04,0,0.064,0c1.436,0.204,5.8-0.1,8.464-3.876c1.52-2.156,2.124-5.016,1.9-8.504 c0.548-0.42,1.052-0.904,1.492-1.46l67.356-84.872L229.235,89.592z M165.659,190.376c-1.416,2.024-3.712,2.232-4.596,2.232 c-0.188,0-0.348-0.016-0.348-0.012c-1.1,0-2.604-0.552-5.44-4.612l-1.104-1.576l-2.064,1.32 c-3.724,2.316-7.78,5.852-8.848,18.588c-0.056,0.624-0.028,1.256,0.004,1.884c0.04,0.74,0.072,1.376-0.084,1.856 c-0.184,0.588-0.676,0.96-0.848,0.944c-0.26-0.04-0.56-0.272-0.696-0.548c-2.784-5.584-2.404-20.452,8.24-27.784l1.412-0.972 l-1.612-3.356c-9.84-20.408-26.304-54.568-1.78-83.184l0.44-0.54c0.232-0.292,0.62-0.776,0.732-0.844c0,0,0,0,0.004,0 c0.08,0,0.296,0.06,0.912,0.432c3.104,1.916,5.852,4.468,7.996,7.424c-0.552,0.932-1.156,1.928-1.784,2.964 c-3.284,5.416-7.012,11.552-7.92,16.86c-3.18,18.656,1.944,27.192,7.88,37.084c1.444,2.408,2.936,4.9,4.368,7.64 C168.707,181.924,167.255,188.1,165.659,190.376z M169.999,179.212c-0.552-2.268-1.376-4.736-2.472-7.404l1.192-1.504 c0.916-1.304,1.412-2.012,1.64-2.54c2.664-5.136,2.228-11.076-0.964-15.128c5.464-6.92,31.332-39.576,45.6-57.588 c1.54-1.936,3.64-3.236,5.92-3.648c2.2-0.4,4.252,0.076,5.832,1.328l0.368,0.292l-43.852,55.26l2.22,1.76l43.856-55.26 l4.704,3.732L169.999,179.212z"></path>{" "}
                                  <path d="M156.251,180.98c-0.744,0.932-1.076,2.096-0.936,3.28c0.14,1.184,0.728,2.244,1.656,2.98 c0.796,0.632,1.76,0.968,2.764,0.968c0.172,0,0.344-0.008,0.52-0.028c1.184-0.136,2.244-0.728,2.984-1.66 c1.524-1.924,1.2-4.736-0.728-6.264C160.591,178.728,157.779,179.06,156.251,180.98z M161.463,185.112 c-0.364,0.46-0.888,0.748-1.468,0.816c-0.572,0.076-1.148-0.096-1.608-0.46h-0.004c-0.944-0.752-1.104-2.132-0.356-3.076 c0.432-0.544,1.076-0.828,1.724-0.828c0.472,0,0.952,0.152,1.352,0.468C162.051,182.784,162.207,184.168,161.463,185.112z"></path>{" "}
                                </g>{" "}
                              </g>{" "}
                            </g>{" "}
                          </g>
                        </svg>
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
                        {/* <i className="flaticon-hair-dye" /> */}
                        <svg
                          fill="#D5A153"
                          height="70px"
                          width="70px"
                          version="1.1"
                          id="Capa_1"
                          xmlns="http://www.w3.org/2000/svg"
                          xmlns:xlink="http://www.w3.org/1999/xlink"
                          viewBox="0 0 308.385 308.385"
                          xml:space="preserve"
                          stroke="#D5A153"
                        >
                          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                          <g
                            id="SVGRepo_tracerCarrier"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></g>
                          <g id="SVGRepo_iconCarrier">
                            {" "}
                            <g>
                              {" "}
                              <g>
                                {" "}
                                <path d="M249.697,203.704h-23.499c-0.777-23.756-13.893-37.255-25.422-44.545c-13.359-8.448-27.175-10.247-27.757-10.319 c-3.159-0.396-6.224,1.25-7.642,4.102c-1.419,2.851-0.882,6.286,1.337,8.568c7.02,7.222,7.451,13.325,5.686,16.357 c-0.829,1.424-2.464,2.749-4.579,2.2c-2.301-0.599-4.669-1.701-7.412-2.979c-8.426-3.928-19.794-9.219-42.629-6.637v-49.771 c0-0.071-0.001-0.143-0.003-0.214c-0.811-28.383-19.246-50.934-25.837-58.114v-32.56c0-12.715-10.344-23.059-23.058-23.059H51.438 c-12.715,0-23.06,10.344-23.06,23.059v32.56c-6.591,7.181-25.026,29.731-25.837,58.114c-0.002,0.071-0.003,0.143-0.003,0.214 v147.638c0,12.119,9.097,21.978,20.279,21.978h50.667c10.093,11.65,18.791,16.687,19.578,17.129 c1.121,0.629,2.385,0.959,3.67,0.959h85.568c1.285,0,2.549-0.33,3.67-0.959c1.046-0.587,25.785-14.81,40.937-52.957 c0.47-1.183,3.62-2.798,6.398-4.223c8.936-4.582,23.891-12.25,23.891-39.043C257.197,207.061,253.839,203.704,249.697,203.704z M154.076,190.685c3.121,1.454,6.348,2.957,9.971,3.899c8.304,2.158,16.871-1.527,21.319-9.174 c2.465-4.237,3.714-9.974,2.383-16.415c10.598,5.226,22.487,15.384,23.421,34.708H83.67c5.467-6.947,15.354-15.407,32.024-17.858 C136.971,182.716,146.059,186.95,154.076,190.685z M43.379,29.793c0-4.443,3.616-8.059,8.06-8.059h17.444 c4.443,0,8.058,3.615,8.058,8.059v28.072H43.379V29.793z M22.818,275.297c-2.862,0-5.279-3.195-5.279-6.978V120.792 c0.692-22.7,16.021-41.75,21.573-47.927h42.096c5.552,6.177,20.881,25.226,21.573,47.927v52.622 c-22.066,6.755-32.683,22.22-36.88,30.289H49.3c-2.133,0-4.166,0.908-5.588,2.498c-1.423,1.59-2.102,3.71-1.866,5.83 c3.097,27.871,11.515,48.477,20.657,63.266H22.818z M226.462,236.899c-5.13,2.631-10.945,5.612-13.495,12.033 c-11.036,27.784-27.796,40.957-32.867,44.453H98.906c-6.595-4.49-33.055-25.313-41.021-74.682h183.769 C239.817,230.051,233.545,233.267,226.462,236.899z"></path>{" "}
                                <path d="M305.646,273.935l-38.209-152.15c11.907-14.67,14.879-40.86,6.844-64.573l-4.501-13.282 c-0.639-1.884-1.999-3.437-3.783-4.317c-1.783-0.881-3.845-1.017-5.728-0.379l-1.018,0.345l-11.82-34.507 c-1.342-3.918-5.607-6.005-9.525-4.665c-3.919,1.343-6.007,5.607-4.665,9.526l11.803,34.459l-6.067,2.056l-11.797-34.44 c-1.342-3.918-5.604-6.005-9.525-4.665c-3.919,1.343-6.007,5.608-4.665,9.526l11.78,34.393l-6.067,2.056l-11.773-34.373 c-1.342-3.918-5.604-6.006-9.525-4.665c-3.919,1.343-6.007,5.607-4.665,9.526l11.757,34.325l-6.067,2.056L186.68,25.879 c-1.342-3.918-5.604-6.005-9.525-4.665c-3.919,1.343-6.007,5.607-4.665,9.526l11.745,34.289c-3.522,1.548-5.339,5.555-4.082,9.267 l4.5,13.283c8.436,24.895,28.471,41.897,44.763,46.77l62.066,144.375c1.221,2.84,3.987,4.54,6.894,4.54 C298.98,283.264,307.226,282.773,305.646,273.935z M198.86,82.766l-2.094-6.18l61.215-20.739l2.093,6.179 c7.468,22.039,2.772,43.886-6.081,52.273c-2.23,2.112-2.873,5.268-1.896,7.983l16.212,64.559l-26.283-61.138 c-0.819-2.577-3.002-4.623-5.85-5.123C223.646,118.381,205.817,103.299,198.86,82.766z"></path>{" "}
                              </g>{" "}
                            </g>{" "}
                          </g>
                        </svg>
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
      <Footer />
    </div>
  );
}

export default HomePage;
