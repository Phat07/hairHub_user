import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  Button,
  Spin,
  List,
  Typography,
  Avatar,
  Divider,
  message,
  Form,
  Input,
  Col,
  Row,
  InputNumber,
} from "antd";
import { Link, useNavigate } from "react-router-dom"; // Import Link from react-router-dom
import {
  ArrowLeftOutlined,
  CloseOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import style from "../../css/salonDetail.module.css";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { CoolMode } from "../magicui/cool-mode";
import RandomIcon from "@rsuite/icons/Random";
import { SalonInformationServices } from "@/services/salonInformationServices";
import { AppointmentService } from "@/services/appointmentServices";
import { ServiceHairServices } from "@/services/servicesHairServices";
import { SalonEmployeesServices } from "@/services/salonEmployeesServices";
import BookingConfirmationModal from "./BookingConfirmationModal";
import { AccountServices } from "@/services/accountServices";
import { actGetEmployeesWorkSchedule } from "@/store/salonEmployees/action";
import moment from "moment";
const { Title, Text } = Typography;

const AddAppointmentOutsite = ({ visible, onCancel }) => {
  // Di chuyển useState vào trong component
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showServiceList, setShowServiceList] = useState(false);
  const [displayVoucherList, setDisplayVoucherList] = useState(false);
  const [isBookingModalVisible, setIsBookingModalVisible] = useState(false);
  const [additionalServices, setAdditionalServices] = useState([]);
  const [voucherSelected, setVoucherSelected] = useState([]);
  const [data, setData] = useState([]);
  const [totalPriceVoucher, setTotalPriceVoucher] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [loadingTime, setLoadingTime] = useState(false);
  const [loadingBook, setLoadingBook] = useState(false);
  const [timeSlots, setTimeSlots] = useState([]);
  const [statusChangeStaff, setStatusChangeStaff] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [dataBooking, setDataBooking] = useState([]);
  const [calculateAppointmentData, setCalculateAppointmentData] = useState({});
  const [scrollIndex1, setScrollIndex1] = useState(0);
  const [isPriceModalVisible, setIsPriceModalVisible] = useState(false);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [appointmentData, setAppointmentData] = useState(null);
  const [error, setError] = useState(null);
  const [loadingCheck, setLoadingCheck] = useState(false);
  const [loadingCheckCus, setLoadingCheckCus] = useState(false);
  const [ediableCustomer, setEdiableCustomer] = useState(true);
  const [infoCus, setInfoCus] = useState(null);
  const [form] = Form.useForm();
  const [formPrice] = Form.useForm();
  const salonDetail = useSelector(
    (state) => state.SALONINFORMATION.getSalonByOwnerId
  );

  const id = salonDetail?.id;
  useEffect(() => {
    // SalonEmployeesServices.getSalonEmployeeBySalonInformationId(id).then(
    //   (res) => {
    //     setSalonEmployeeList(res.data.items);
    //   }
    // );

    //Hair Services
    if (salonDetail?.id) {
      ServiceHairServices.getServiceHairBySalonNotPaging(id)
        .then((res) => {
          setData(res?.data);
        })
        .catch((err) => {
          setError(err);
        });
    }
    // AppointmentService.calculatePrice(calculateAppointmentData)
    //   .then((res) => {
    //     const { originalPrice, totalPrice, discountedPrice } = res.data;
    //     const getEmployeeServiceId = dataBooking.map(
    //       ({ serviceHairId }) => serviceHairId
    //     );
    //     const getEmployeeId = dataBooking.map(({ employeeId }) => employeeId);
    //     const appointmentFormData = {
    //       customerId: userId,
    //       startDate: currentDate,
    //       totalPrice: totalPrice,
    //       originalPrice: originalPrice,
    //       discountedPrice: discountedPrice,
    //       appointmentDetails: [
    //         {
    //           salonEmployeeId: getEmployeeId,
    //           serviceHairId: getEmployeeServiceId,
    //           description: "string",
    //           endTime: "2024-06-23T04:34:56.026Z",
    //           startTime: "2024-06-23T04:34:56.026Z",
    //         },
    //       ],
    //       voucherIds: ["3fa85f64-5717-4562-b3fc-2c963f66afa6"],
    //     };
    //   })
    //   .catch((err) => setError(err));
    // fetchData();
  }, [id, voucherSelected, additionalServices, calculateAppointmentData]);
  const listVoucherNotPaging = useSelector(
    (state) => state.SALONVOUCHERS.getVoucherBySalonIdNotPaging
  );
  const formatTime = (decimalHours) => {
    const hours = Math.floor(decimalHours);

    // Get the decimal part and convert to minutes
    const decimalPart = decimalHours - hours;
    let minutes = 0;

    if (decimalPart >= 0.75) {
      minutes = 45;
    } else if (decimalPart >= 0.5) {
      minutes = 30;
    } else if (decimalPart >= 0.25) {
      minutes = 15;
    }

    let timeString = "";
    if (hours > 0) {
      timeString += `${hours} giờ `;
    }
    if (minutes > 0 || hours === 0) {
      timeString += `${minutes} phút`;
    }

    return timeString.trim() || "0 phút";
  };
  function formatMoneyVND(amount) {
    return amount.toLocaleString("vi-VN");
  }
  const formattedDateUi = (date) => {
    return dayjs(date).format("DD/MM/YYYY");
  };
  const formatDiscountPercentage = (value) => {
    return value * 100;
  };
  function generateNextSevenDays() {
    let days = [];
    const today = new Date();
    for (let i = 0; i < 4; i++) {
      const day = new Date(today);
      day.setDate(today.getDate() + i);
      days.push(day);
    }
    return days;
  }
  const currentMonthDays = generateNextSevenDays();
  const formatDate = (date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    const dayAfterTomorrow = new Date(today);
    const dayAfterThat = new Date(today);

    tomorrow.setDate(today.getDate() + 1);
    dayAfterTomorrow.setDate(today.getDate() + 2);
    dayAfterThat.setDate(today.getDate() + 3);

    const daysOfWeek = [
      "Chủ Nhật",
      "Thứ 2",
      "Thứ 3",
      "Thứ 4",
      "Thứ 5",
      "Thứ 6",
      "Thứ 7",
    ];

    const dayOfWeek = daysOfWeek[date.getDay()];
    const day = date.getDate();
    const month = date.getMonth() + 1; // Tháng từ 0 (Tháng 1) đến 11 (Tháng 12)
    const monthFormatted = month < 10 ? `0${month}` : month;

    // Hàm kiểm tra nếu ngày đầu vào trùng với các ngày đặc biệt
    if (date.toDateString() === today.toDateString()) {
      return `Hôm nay (${day < 10 ? "0" : ""}${day}/${monthFormatted})`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Ngày mai (${day < 10 ? "0" : ""}${day}/${monthFormatted})`;
    } else if (date.toDateString() === dayAfterTomorrow.toDateString()) {
      return `Ngày mốt (${day < 10 ? "0" : ""}${day}/${monthFormatted})`;
    } else if (date.toDateString() === dayAfterThat.toDateString()) {
      return `Ngày kia (${day < 10 ? "0" : ""}${day}/${monthFormatted})`;
    } else {
      return `${dayOfWeek} ngày ${day < 10 ? "0" : ""}${day}/${monthFormatted}`;
    }
  };
  const timeContainerRef = useRef(null);
  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentService(null);
  };
  function calculateTotal() {
    const mainServicePrice = selectedService?.price || 0;
    const additionalServicesPrice = additionalServices?.reduce(
      (total, service) => {
        return total + service.price;
      },
      0
    );
    const totalPrice = mainServicePrice + additionalServicesPrice;

    // Format the total price with thousands separators and append "vnđ"
    const formattedTotalPrice =
      new Intl.NumberFormat("vi-VN").format(totalPrice) + " vnđ";
    return formattedTotalPrice;
  }
  const handleServiceSelect = async (service) => {
    console.log(service);
    setLoading(true);
    const isChecked = additionalServices.some((s) => s.id === service.id);
    if (additionalServices.length === 0) {
      setAdditionalServices([service]); // Chuyển thành mảng chứa service
      setLoading(false);
      setShowServiceList(false);
      return;
    }
    if (isChecked) {
      setAdditionalServices(
        additionalServices.filter((s) => s.id !== service.id)
      );
      setShowServiceList(false);
      setLoading(false);
    } else {
      // setAdditionalServices([...additionalServices, service]);
      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Thêm số 0 vào trước tháng nếu cần
        const day = String(date.getDate()).padStart(2, "0"); // Thêm số 0 vào trước ngày nếu cần
        return `${year}-${month}-${day}`;
      };
      const dataMapping = [...additionalServices, service];

      const databooking = await dataMapping?.map((e) => {
        return {
          serviceHairId: e?.id,
          isAnyOne: true,
          salonEmployeeId: e?.bookingDetailResponses?.employees?.id || null,
        };
      });

      const formattedDate = formatDate(selectedDate);
      const requestBody = {
        day: formattedDate, // Thay bằng ngày bạn muốn book
        availableSlot: selectedTimeSlot || 0, // Thay bằng slot bạn muốn book
        salonId: id, // Thay bằng id của salon
        bookingDetail: databooking,
      };
      setDataBooking(databooking); //serviceHairId, salonEmployeeId

      SalonInformationServices.getBookAppointment(requestBody)
        .then((response) => {
          // Xử lý kết quả từ server nếu cần
          const updatedAdditionalServices = [...dataMapping];
          let total = 0;
          updatedAdditionalServices?.map((e) => {
            total += e?.price;
          });
          setTotalPriceVoucher(total);

          // const totalPriceMapping = listVoucherNotPaging?.filter(
          //   (e) => e?.minimumOrderAmount <= total
          // );

          // setVoucherList(totalPriceMapping);
          const updatedVoucherSelected = voucherSelected?.filter(
            (voucher) => voucher?.minimumOrderAmount <= total
          );

          setVoucherSelected(updatedVoucherSelected);
          // console.log("totalPriceMapping", totalPriceMapping);

          for (const service of dataMapping) {
            const matchingBookingDetailResponse =
              response.data.bookingDetailResponses.find(
                (responseDetail) =>
                  responseDetail?.serviceHair?.id === service.id
              );

            if (matchingBookingDetailResponse) {
              service.bookingDetailResponses = matchingBookingDetailResponse;
            }
          }

          setAdditionalServices(updatedAdditionalServices);
          setShowServiceList(false);
          setLoading(false);
          // Cập nhật state hoặc hiển thị thông báo thành công
        })
        .catch((error) => {
          setShowServiceList(true);
          message.warning(error?.response?.data?.message);
          setLoading(true);
        })
        .finally((err) => {
          setLoading(false);
        });
    }
  };
  const handleSelectedVoucher = (voucher) => {
    setVoucherSelected((prevVouchers) => {
      // Kiểm tra nếu voucher đã tồn tại trong danh sách
      const exists = prevVouchers.find((e) => e?.id === voucher?.id);

      // Nếu đã tồn tại, hiển thị thông báo và giữ nguyên danh sách voucher cũ
      if (exists) {
        message.warning("Mã khuyến mãi này đã được sử dụng.");
        return prevVouchers;
      }

      // Nếu danh sách đã có một voucher, hiển thị thông báo và giữ nguyên danh sách voucher cũ
      if (prevVouchers.length >= 1) {
        message.warning("Bạn chỉ có thể sử dụng một mã khuyến mãi.");
        return prevVouchers;
      }

      // Nếu chưa có voucher nào trong danh sách và voucher này chưa tồn tại, thêm voucher mới vào danh sách
      return [...prevVouchers, voucher];
    });

    //calculate service with voucher
    const servicesId = additionalServices.map(({ id }) => id);
    const voucherId = voucher?.id;
    const appointmentFormData = {
      voucherId: voucherId,
      serviceHairId: servicesId,
    };
    setCalculateAppointmentData(appointmentFormData);
  };
  const handleDateSelect = async () => {
    // if (!localStorage.getItem("accessToken")) {
    //   message.info("Vui lòng đăng nhập!");
    //   navigate("/login");
    //   return;
    // }
    setLoadingTime(true);
    const idSer = additionalServices[0]?.id;
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Thêm số 0 vào trước tháng nếu cần
      const day = String(date.getDate()).padStart(2, "0"); // Thêm số 0 vào trước ngày nếu cần
      return `${year}-${month}-${day}`;
    };
    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);
    if (formattedDate !== selectedDate) {
      setAdditionalServices((prevServices) =>
        prevServices.map((s) => ({
          ...s,
          bookingDetail: { ...s.bookingDetail, salonEmployeeId: null },
        }))
      );
      setSelectedDate(currentDate);
    }

    // if (formattedDate !== selectedDate) {
    //   setAdditionalServices((prevServices) =>
    //     prevServices.map((s) => ({
    //       ...s,
    //       bookingDetail: { ...s.bookingDetail, salonEmployeeId: null },
    //     }))
    //   );
    //   setSelectedDate(day);
    // }
    const postData = {
      day: formattedDate, // Chuyển đổi date thành ISO string
      salonId: id,
      serviceHairId: idSer,
      salonEmployeeId: null,
      isAnyOne: true,
    };
    setSelectedTimeSlot(null);

    try {
      const response = await SalonInformationServices.getGetAvailableTime(
        postData
      )
        .then((res) => {
          setTimeSlots(res?.data);
          const availableTimes = res?.data?.availableTimes?.map((e) => {
            return e.timeSlot;
          });
          // Check if the selectedTimeSlot is within the available times
          if (selectedTimeSlot && !availableTimes.includes(selectedTimeSlot)) {
            setSelectedTimeSlot(null);
          }
          setLoadingTime(false);
        })
        .catch((err) => {
          // setAdditionalServices([])
          // setSelectedDate(null);
          setLoadingTime(false);
          setTimeSlots(null);
          message.warning(err?.response?.data?.message);
        })
        .finally((err) => {
          setLoadingTime(false);
        });
      const dataMapping = [...additionalServices];
      const databooking = await dataMapping?.map((e) => {
        return {
          serviceHairId: e?.id,
          isAnyOne: true,
          salonEmployeeId: e?.bookingDetail?.salonEmployeeId || null,
        };
      });
      const requestBody = {
        day: formattedDate, // Thay bằng ngày bạn muốn book
        // availableSlot: selectedTimeSlot||0,
        availableSlot: 0, // Thay bằng slot bạn muốn book
        salonId: id, // Thay bằng id của salon
        bookingDetail: databooking,
      };
      setDataBooking(requestBody); //serviceHairId, salonEmployeeId
      SalonInformationServices.getBookAppointment(requestBody)
        .then((response) => {
          const updatedAdditionalServices = additionalServices.map(
            (service) => {
              // Tìm đối tượng matchingBookingDetailResponse tương ứng
              const matchingBookingDetailResponse =
                response.data.bookingDetailResponses.find(
                  (responseDetail) =>
                    responseDetail?.serviceHair?.id === service.id
                );

              // Tạo một bản sao của đối tượng service và cập nhật thuộc tính bookingDetailResponses và bookingDetail
              return {
                ...service,
                bookingDetailResponses: matchingBookingDetailResponse || {},
                bookingDetail: {
                  ...service.bookingDetail,
                  salonEmployeeId: null,
                },
              };
            }
          );

          setStatusChangeStaff(false);
          setAdditionalServices(updatedAdditionalServices);
        })
        .catch((error) => {
          setStatusChangeStaff(true);
          // Xử lý lỗi nếu có
          // console.error("Error booking appointment:", error);
          // message.warning(error.response.data.message);
        });

      //   console.log("Response:", response.data);
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  useEffect(() => {
    if (additionalServices[0]?.id) {
      handleDateSelect();
    }
  }, [additionalServices[0]?.id]);

  useEffect(() => {
    const totalPrice = parseInt(calculateTotal().replace(/[^0-9]/g, ""), 10);
    if (totalPrice > 0) {
      formPrice.setFieldsValue({
        price: totalPrice,
      });
    }
  }, [additionalServices]);

  const handleScroll1 = (direction, containerRef) => {
    const maxScroll =
      containerRef.current.scrollWidth - containerRef.current.clientWidth;
    const scrollAmount = containerRef.current.clientWidth / 2;

    if (direction === "left" && scrollIndex1 > 0) {
      setScrollIndex1(scrollIndex1 - 1);
      containerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    } else if (
      direction === "right" &&
      containerRef.current.scrollLeft < maxScroll
    ) {
      setScrollIndex1(scrollIndex1 + 1);
      containerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };
  const handleTimeSlotSelect = async (slot) => {
    setSelectedTimeSlot(slot);
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Thêm số 0 vào trước tháng nếu cần
      const day = String(date.getDate()).padStart(2, "0"); // Thêm số 0 vào trước ngày nếu cần
      return `${year}-${month}-${day}`;
    };
    const databooking = await additionalServices?.map((e) => {
      return {
        serviceHairId: e?.id,
        isAnyOne: true,
        salonEmployeeId: null,
      };
    });
    const formattedDate = formatDate(selectedDate);
    const requestBody = {
      day: formattedDate, // Thay bằng ngày bạn muốn book
      availableSlot: slot || 0, // Thay bằng slot bạn muốn book
      salonId: id, // Thay bằng id của salon
      bookingDetail: databooking,
    };

    SalonInformationServices.getBookAppointment(requestBody)
      .then((response) => {
        // Xử lý kết quả từ server nếu cần
        const updatedAdditionalServices = [...additionalServices];

        for (const service of additionalServices) {
          const matchingBookingDetailResponse =
            response.data.bookingDetailResponses.find(
              (responseDetail) => responseDetail.serviceHair?.id === service.id
            );

          if (matchingBookingDetailResponse) {
            service.bookingDetailResponses = matchingBookingDetailResponse;
          }
        }

        setAdditionalServices(updatedAdditionalServices);
        setStatusChangeStaff(false);
      })
      .catch((error) => {
        setSelectedTimeSlot(null);
        setStatusChangeStaff(true);
        console.error("Error booking appointment:", error);
        message.warning(error?.response?.data?.message);

        // Sao chép mảng additionalServices để thay đổi mà không ảnh hưởng đến state ban đầu
      });
  };
  const handleRemoveService = (serviceToRemove) => {
    // Filter out the service that matches the ID of the serviceToRemove
    const updatedServices = additionalServices.filter(
      (service) => service.id !== serviceToRemove.id
    );
    setAdditionalServices(updatedServices);
    let total = 0;
    updatedServices?.map((e) => {
      total += e?.price;
    });
    const updatedVoucherSelected = voucherSelected?.filter(
      (voucher) => voucher?.minimumOrderAmount <= total
    );
    setVoucherSelected(updatedVoucherSelected);
    setTotalPriceVoucher(total);
  };
  const handleChangeStaffSecond = (service, value) => {
    setAdditionalServices((prevServices) => {
      const updatedServices = prevServices.map((s) =>
        s.id === service.id
          ? {
              ...s,
              bookingDetail: {
                ...s.bookingDetail,
                salonEmployeeId: value,
                serviceHairId: service.id,
                isAnyOne: true,
              },
            }
          : s
      );

      // Set currentService to null after updating additionalServices
      setCurrentService(null);
      return updatedServices; // Return the updated services
    });

    // Close the modal after updating the state
    setIsModalVisible(false);
  };
  const handleChangeStaff = (service) => {
    if (!selectedTimeSlot) {
      message.warning("Vui lòng chọn thời gian cắt tóc");
    } else {
      setCurrentService(service);
      setIsModalVisible(true);
    }
  };
  const handleChangeRandomEmployee = () => {
    // Update additionalServices and then set currentService to null
    setAdditionalServices((prevServices) => {
      const updatedServices = prevServices.map((s) =>
        s.id === currentService.id
          ? {
              ...s,
              bookingDetail: {
                ...s.bookingDetail,
                salonEmployeeId: null,
                serviceHairId: currentService.id,
                isAnyOne: true,
              },
            }
          : s
      );

      // Set currentService to null after updating additionalServices
      setCurrentService(null);
      return updatedServices; // Return the updated services
    });

    // Close the modal after updating the state
    setIsModalVisible(false);
  };
  const handleAddServiceClick = () => {
    if (additionalServices.length > 0 && !selectedTimeSlot) {
      message.warning("Vui lòng chọn thời gian trước khi thêm dịch vụ.");
    } else {
      setShowServiceList(true);
    }
    // setShowServiceList(true);
  };
  const handleDisplayVoucherList = () => {
    setDisplayVoucherList(!displayVoucherList);
  };
  const handleRemoveVoucher = (id) => {
    const updatedVouchers = voucherSelected.filter((e) => e?.id !== id);
    setVoucherSelected(updatedVouchers);
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^(03|07|08|09|01[2|6|8|9])[0-9]{8}$/;
    return phoneRegex.test(phoneNumber);
  };

  const handleBooking = async () => {
    setLoading(true);
    if (!infoCus) {
      const values = form.getFieldsValue(); // Lấy giá trị từ form

      // Kiểm tra các trường cần thiết
      if (!values.email || !values.fullName || !values.phoneNumber) {
        message.error(
          "Vui lòng nhập đầy đủ thông tin: Email, Tên, và Số điện thoại."
        );
        setIsPriceModalVisible(false);
        setLoading(false);
        return;
      }
      if (!validatePhoneNumber(values.phoneNumber)) {
        message.error("Số điện thoại không hợp lệ!");
        setIsPriceModalVisible(false);
        setLoading(false);
        return;
      }
    }
    if (additionalServices.length === 0) {
      message.info("Vui lòng chọn dịch vụ!!");
      setIsPriceModalVisible(false);
      setLoading(false);
      return;
    }
    const isInvalid = additionalServices.some(
      (service) =>
        !service.bookingDetail || service.bookingDetail.salonEmployeeId == null
    );

    if (isInvalid) {
      message.error("Vui lòng chọn nhân viên cho tất cả các dịch vụ.");
      setIsPriceModalVisible(false);
      setLoading(false);
      return; // Dừng hàm nếu có điều kiện không hợp lệ
    }
    if (selectedTimeSlot === null) {
      message.info("Vui lòng chọn giờ!!");
      setIsPriceModalVisible(false);
      setLoading(false);
      return;
    }
    const valuesPrice = formPrice.getFieldsValue();
    if (!valuesPrice.price) {
      message.error("Vui lòng nhập giá tiền thu cho khách hàng");
      setIsPriceModalVisible(false);
      setLoading(false);
      return;
    }
    const totalPrice = parseInt(calculateTotal().replace(/[^0-9]/g, ""), 10);
    if (valuesPrice.price > totalPrice) {
      message.error("Giá tiền thu cho khách không được lớn hơn tổng tiền!");
      setIsPriceModalVisible(false);
      setLoading(false);
      return;
    }
    // Function to format the date
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const formattedDate = formatDate(selectedDate);
    const servicesId = additionalServices.map(({ id }) => id);
    const voucherId = voucherSelected[0]?.id;

    const appointmentFormData = {
      voucherId: voucherId,
      serviceHairId: servicesId,
    };

    await AppointmentService.calculatePrice(appointmentFormData)
      .then((res) => {
        const isPriceMatch = res.data.totalPrice === valuesPrice;
        console.log(valuesPrice);

        if (res.data.totalPrice === valuesPrice.price) {
          setOriginalPrice(res.data.originalPrice);
          setTotalPrice(res.data.totalPrice);
          setDiscountedPrice(res.data.discountedPrice);
        } else {
          setOriginalPrice(res.data.originalPrice);
          setTotalPrice(valuesPrice.price);
          setDiscountedPrice(res.data.originalPrice - valuesPrice.price);
        }
        setAppointmentData({
          customerId: infoCus ? infoCus.id : null,
          fullName: infoCus ? infoCus.fullName : form.getFieldValue("fullName"),
          phone: infoCus
            ? infoCus.phoneNumber
            : form.getFieldValue("phoneNumber"),
          email: infoCus ? infoCus.email : form.getFieldValue("email"),
          startDate: formattedDate,
          totalPrice: isPriceMatch ? res.data.totalPrice : valuesPrice.price,
          originalPrice: res.data.originalPrice,
          discountedPrice: isPriceMatch
            ? res.data.discountedPrice
            : res.data.originalPrice - valuesPrice.price,
          appointmentDetails: additionalServices.map((e) => ({
            salonEmployeeId: e?.bookingDetail?.salonEmployeeId
              ? e?.bookingDetail?.salonEmployeeId
              : e?.bookingDetailResponses?.employees[0]?.id,
            serviceHairId: e?.bookingDetail?.serviceHairId
              ? e?.bookingDetail?.serviceHairId
              : e?.bookingDetailResponses?.serviceHair?.id,
            description: e?.description,
            endTime: e?.bookingDetailResponses?.serviceHair?.endTime,
            startTime: e?.bookingDetailResponses?.serviceHair?.startTime,
          })),
        });
        setIsPriceModalVisible(true);
      })
      .catch((err) => {
        setLoading(false);
      })
      .finally((err) => {
        setLoading(false);
      });
  };
  const handleConfirmBooking = async () => {
    console.log("appointmentData", appointmentData);
    setLoadingCheck(true);
    try {
      const res = await AppointmentService.CreateAppointmentOutSide(
        appointmentData
      );
      if (res.status === 200) {
        console.log(res);
        message.success("Thêm lịch hẹn ngoài thành công");
        setIsPriceModalVisible(false);
        onCancel();
        setAdditionalServices([]);
        setVoucherSelected([]);
        setShowServiceList(false);
        setInfoCus(null);
        form.resetFields();
        formPrice.resetFields();
        setAppointmentData(null);
        await dispatch(
          actGetEmployeesWorkSchedule(
            salonDetail?.id,
            moment(new Date()).format("YYYY-MM-DD")
          )
        );
        return;
      } else {
        message.error("Có lỗi xảy ra khi dăt lịch!");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Có lỗi xảy ra khi đặt lịch!";
      console.error("Lỗi xảy ra khi đặt lịch:", errorMessage);
      message.error(errorMessage);
    } finally {
      setLoadingCheck(false);
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleCheckCustomer = async () => {
    const email = form.getFieldValue("email"); // Lấy giá trị email từ form

    if (!email) {
      message.error("Vui lòng nhập email!");
      return;
    }
    if (!isValidEmail(email)) {
      message.error("Email không đúng định dạng!");
      return;
    }

    setLoadingCheckCus(true);
    message.info("Đang kiểm tra khách hàng...");

    try {
      const res = await AccountServices.GetCustomerByEmail(email);
      if (res.status === 204) {
        message.warning("Khách hàng chưa có trên hệ thống!");
        setEdiableCustomer(false);
        setInfoCus(null);
        form.setFieldsValue({
          fullName: "",
          phoneNumber: "",
        });
        return;
      }
      // Nếu res hợp lệ, cập nhật form với fullName và phoneNumber
      form.setFieldsValue({
        fullName: res?.data?.fullName || "",
        phoneNumber: res?.data?.phoneNumber || "",
      });
      setEdiableCustomer(true);
      setInfoCus(res?.data);
      message.success("Khách hàng đã được tìm thấy!");
    } catch (err) {
      console.error("Lỗi kiểm tra khách hàng:", err);
      message.error("Có lỗi xảy ra khi kiểm tra khách hàng!");
    } finally {
      setLoadingCheckCus(false);
    }
  };

  return (
    <>
      <Modal
        wrapClassName="my-custom-modal"
        title={
          <div
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              textAlign: "center",
              backgroundColor: "#ece8de",
            }}
          >
            {showServiceList
              ? "Thêm dịch vụ"
              : displayVoucherList
              ? "Thêm voucher"
              : "Thêm lịch đặt ngoài cho hôm nay"}
          </div>
        }
        maskClosable={false}
        visible={visible}
        className={showServiceList ? "no-close-btn" : ""}
        onCancel={() => {
          Modal.confirm({
            title: "Bạn muốn thoát chứ?",
            content: "Dữ liệu lịch hẹn bạn đã chọn sẽ mất hết.",
            okText: "Thoát",
            cancelText: "Hủy",
            onOk: () => {
              onCancel();
              setAdditionalServices([]);
              setVoucherSelected([]);
              setShowServiceList(false);
              setInfoCus(null);
              form.resetFields();
              formPrice.resetFields();
              setAppointmentData(null);
            },
          });
        }}
        footer={null}
        width={800}
      >
        <Spin className="custom-spin" spinning={loading}>
          {showServiceList ? (
            <div
              style={{
                position: "absolute",
                top: "1.2rem",
                left: "1.2rem",
                zIndex: 1, // Để nút nằm trên tất cả các phần tử khác
                cursor: "pointer",
              }}
              onClick={() => {
                setShowServiceList(false);
              }}
            >
              <ArrowLeftOutlined style={{ fontSize: "20px" }} />
            </div> // Hiển thị khi `showServiceList` là true
          ) : displayVoucherList ? (
            <div
              style={{
                position: "absolute",
                top: "1.2rem",
                left: "1.2rem",
                zIndex: 1, // Để nút nằm trên tất cả các phần tử khác
                cursor: "pointer",
              }}
              onClick={() => {
                setDisplayVoucherList(false);
              }}
            >
              <ArrowLeftOutlined style={{ fontSize: "20px" }} />
            </div> // Hiển thị khi `displayVoucherList` là true và `showServiceList` là false
          ) : null}

          {showServiceList ? (
            <>
              <Spin className="custom-spin" spinning={loading}>
                <div>
                  {/* <Title level={3}>Thêm những dịch vụ khác</Title> */}
                  <List
                    itemLayout="horizontal"
                    dataSource={data}
                    renderItem={(service, index) => {
                      // Kiểm tra nếu dịch vụ đã được chọn
                      const isChecked = additionalServices.some(
                        (s) => s.id === service.id
                      );

                      return (
                        <List.Item
                          key={index} // Thêm thuộc tính key
                          style={{
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            padding: "0px",
                            marginTop: "10px",
                          }}
                        >
                          <List.Item.Meta
                            style={{
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            description={
                              <Typography
                                className={style["serviceBoking"]}
                                style={{
                                  boxShadow: "none",
                                  border: "none",
                                }}
                              >
                                <div
                                  className={style["serviceBookngContainer"]}
                                >
                                  <div
                                    className={style["serviceBookngContainer2"]}
                                  >
                                    <Text
                                      strong
                                      className={style["serviceBookngItem"]}
                                    >
                                      Tên dịch vụ:&nbsp;
                                      <Text
                                        style={{
                                          display: "inline",
                                          fontWeight: "normal",
                                        }}
                                      >
                                        {service.serviceName}
                                      </Text>
                                    </Text>
                                    <Text
                                      strong
                                      className={style["serviceBookngItem"]}
                                    >
                                      Mô tả:&nbsp;
                                      <Text
                                        style={{
                                          display: "inline",
                                          fontWeight: "normal",
                                        }}
                                      >
                                        {service.description}
                                      </Text>
                                    </Text>
                                    <Text
                                      strong
                                      className={style["serviceBookngItem"]}
                                    >
                                      Giá:&nbsp;
                                      <Text
                                        style={{
                                          display: "inline",
                                          fontWeight: "normal",
                                        }}
                                      >
                                        {formatMoneyVND(service.price)}
                                      </Text>
                                    </Text>
                                    <Text
                                      strong
                                      className={style["serviceBookngItem"]}
                                    >
                                      Thời gian:&nbsp;
                                      <Text
                                        style={{
                                          display: "inline",
                                          fontWeight: "normal",
                                        }}
                                      >
                                        {formatTime(service.time)}
                                      </Text>
                                    </Text>
                                  </div>
                                  <div
                                    className={style["serviceBookngContainer2"]}
                                    style={{
                                      alignItems: "end",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <Avatar
                                      size={{
                                        xs: 60,
                                        sm: 60,
                                        md: 60,
                                        lg: 60,
                                        xl: 60,
                                        xxl: 100,
                                      }}
                                      src={service?.img}
                                      shape="square"
                                      style={{ marginBottom: "10px" }}
                                    />
                                    <div
                                      className={`${style.customCheckbox} ${
                                        isChecked
                                          ? style.customCheckboxBooked
                                          : ""
                                      } ${style.customCheckboxHover}`}
                                      key={`checkbox-${index}`}
                                      onClick={() =>
                                        handleServiceSelect(service)
                                      }
                                    >
                                      {isChecked ? "Đã chọn" : "Chọn thêm"}
                                    </div>
                                  </div>
                                </div>
                              </Typography>
                            }
                          />
                        </List.Item>
                      );
                    }}
                    style={{ backgroundColor: "transparent" }}
                  />
                </div>
              </Spin>
            </>
          ) : displayVoucherList ? (
            // displayVoucherList && (
            <List
              style={{
                marginTop: "16px",
                // background: "#f0f0f0",
              }}
              size="middle"
              dataSource={listVoucherNotPaging}
              renderItem={(item) => (
                <List.Item
                  style={{
                    cursor:
                      item.minimumOrderAmount <= totalPriceVoucher &&
                      item?.quantity > 0 &&
                      new Date(item.expiryDate) >= new Date()
                        ? "pointer"
                        : "not-allowed",
                    opacity:
                      item.minimumOrderAmount <= totalPriceVoucher &&
                      item?.quantity > 0 &&
                      new Date(item.expiryDate) >= new Date()
                        ? 1
                        : 0.5,
                    padding: "5px 0px",
                  }}
                  onClick={() => {
                    if (
                      item.minimumOrderAmount <= totalPriceVoucher &&
                      item?.quantity > 0 &&
                      new Date(item.expiryDate) >= new Date()
                    ) {
                      handleSelectedVoucher(item);
                      setDisplayVoucherList(!displayVoucherList);
                    }
                  }}
                >
                  <div className="flex justify-between w-full">
                    <List.Item.Meta
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      description={
                        <div className={style["voucher-container"]}>
                          <div className={style["voucher-left"]}>
                            <p className={style["voucher-description"]}>
                              {item.description}
                            </p>
                            <p className={style["voucher-minimum"]}>
                              Số tiền tối thiểu:{" "}
                              {formatMoneyVND(item.minimumOrderAmount)}
                              vnđ
                            </p>
                            <p className={style["voucher-max-discount"]}>
                              Giảm giá tối đa:{" "}
                              {formatMoneyVND(item.maximumDiscount)} vnđ
                            </p>
                            <p
                              className={`voucher-max-discount ${
                                new Date(item.expiryDate) < new Date()
                                  ? "text-red-500"
                                  : ""
                              }`}
                            >
                              Ngày hết hạn: {formattedDateUi(item.expiryDate)}
                            </p>
                            <p className={style["voucher-max-discount"]}>
                              Số lượng: {item.quantity}
                            </p>
                            {item.minimumOrderAmount > totalPriceVoucher && (
                              <p className={style["voucher-condition"]}>
                                Không đủ điều kiện
                              </p>
                            )}
                          </div>
                          <div className={style["voucher-right"]}>
                            <span className={style["voucher-discount"]}>
                              GIẢM GIÁ
                            </span>
                            <span className={style["voucher-discount"]}>
                              {item.discountPercentage * 100}%
                            </span>
                          </div>
                        </div>
                      }
                    ></List.Item.Meta>
                  </div>
                </List.Item>
              )}
            />
          ) : (
            // )
            <div>
              <Divider />
              {/* <div>
              <div>
                <motion.div
                  className={style["date-picker"]}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {currentMonthDays.map((day, index) => (
                    <motion.div
                      key={index}
                      whileHover={{
                        scale: 1.05, // Phóng to khi hover
                        transition: {
                          duration: 0.3,
                          type: "spring",
                          stiffness: 300,
                        },
                      }}
                      whileTap={{
                        scale: 0.95, // Thu nhỏ khi nhấp
                        transition: {
                          duration: 0.2,
                        },
                      }}
                    >
                      <CoolMode
                        options={{
                          particle:
                            "https://res.cloudinary.com/dw4fjdcu7/image/upload/v1725877896/hairHubLogo_kq8daj.png",
                        }}
                        maxParticles={3}
                      >
                        <Button
                          onClick={() => handleDateSelect(day)}
                          className={
                            selectedDate &&
                            selectedDate.toDateString() === day.toDateString()
                              ? style.selected
                              : style.unselected
                          }
                          type="text"
                        >
                          {formatDate(day)}
                        </Button>
                      </CoolMode>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div> */}
              {/* <Divider /> */}
              <Form
                form={form}
                layout="vertical"
                initialValues={{ email: "", name: "", phone: "" }}
              >
                <Row
                  gutter={16}
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <Col
                    span={16}
                    style={{ alignItems: "center", justifyContent: "center" }}
                  >
                    <Form.Item
                      label="Email"
                      name="email"
                      onChange={() => {
                        form.setFieldsValue({
                          fullName: "",
                          phoneNumber: "",
                        });
                        setEdiableCustomer(true);
                        setInfoCus(null);
                      }}
                      rules={[
                        { required: true, message: "Vui lòng nhập email!" },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <button
                      type="button"
                      onClick={!loadingCheckCus ? handleCheckCustomer : null}
                      disabled={loadingCheckCus}
                      style={{
                        backgroundColor: loadingCheckCus
                          ? "#d9d9d9"
                          : "#bf9456",
                        paddingBlock: "5px",
                        width: "100%",
                        borderRadius: "5px",
                        fontWeight: "bold",
                        color: "white",
                        cursor: loadingCheckCus ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                      }}
                      className="mt-2"
                    >
                      {loadingCheckCus ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                          />
                          Đang kiểm tra...
                        </>
                      ) : (
                        "Kiểm tra khách hàng"
                      )}
                    </button>
                  </Col>
                </Row>
                <Form.Item
                  label="Tên"
                  name="fullName"
                  rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
                >
                  <Input disabled={ediableCustomer} />
                </Form.Item>
                <Form.Item
                  label="Số điện thoại"
                  name="phoneNumber"
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại!" },
                    {
                      pattern: /^(03|07|08|09|01[2|6|8|9])[0-9]{8}$/,
                      message: "Số điện thoại không hợp lệ!",
                    },
                  ]}
                >
                  <Input disabled={ediableCustomer} />
                </Form.Item>
              </Form>
              {additionalServices.length > 0 && (
                <>
                  <Spin className="custom-spin" spinning={loadingTime}>
                    <div className={style["time-picker"]}>
                      <Divider />
                      {timeSlots?.availableTimes?.length > 0 ? (
                        <>
                          {/* <Divider /> */}
                          <div className={style["scroll-container"]}>
                            <button
                              className={`${style["arrow-button"]}`}
                              // className="arrow-button"
                              onClick={() =>
                                handleScroll1("left", timeContainerRef)
                              }
                            >
                              <LeftOutlined />
                            </button>
                            <div
                              className={style["scroll-wrapper"]}
                              // className="scroll-wrapper"
                              ref={timeContainerRef}
                            >
                              <div
                                className={style["scroll-content"]}
                                // className="scroll-content"
                              >
                                {timeSlots?.availableTimes?.map(
                                  (slot, index) => {
                                    let timeString = "";
                                    const timeParts = slot?.timeSlot
                                      .toString()
                                      .split(".");
                                    const hour = parseInt(timeParts[0], 10);
                                    const minutes =
                                      timeParts.length > 1
                                        ? Math.round(
                                            parseFloat("0." + timeParts[1]) * 60
                                          )
                                        : 0;

                                    if (minutes === 0) {
                                      timeString = `${hour}h00`;
                                    } else if (minutes === 15) {
                                      timeString = `${hour}h15`;
                                    } else if (minutes === 30) {
                                      timeString = `${hour}h30`;
                                    } else if (minutes === 45) {
                                      timeString = `${hour}h45`;
                                    }

                                    const vietnamTimezone = "Asia/Ho_Chi_Minh";
                                    const currentTime =
                                      dayjs().tz(vietnamTimezone);

                                    const slotTime = dayjs()
                                      .tz(vietnamTimezone)
                                      .set("hour", hour)
                                      .set("minute", minutes)
                                      .set("second", 0)
                                      .set("millisecond", 0);

                                    const isDisabled =
                                      selectedDate &&
                                      dayjs(selectedDate)
                                        .tz(vietnamTimezone)
                                        .isSame(currentTime, "day") &&
                                      slotTime.isBefore(currentTime);

                                    return (
                                      <Button
                                        type="text"
                                        key={index}
                                        onClick={() =>
                                          handleTimeSlotSelect(slot?.timeSlot)
                                        }
                                        className={
                                          selectedTimeSlot === slot?.timeSlot
                                            ? style.selected
                                            : style.unselected
                                        }
                                        disabled={isDisabled}
                                      >
                                        {timeString}
                                      </Button>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                            <button
                              className={`${style["arrow-button"]}`}
                              // className="arrow-button"
                              onClick={() =>
                                handleScroll1("right", timeContainerRef)
                              }
                            >
                              <RightOutlined />
                            </button>
                          </div>
                        </>
                      ) : (
                        <Title className={style["warning-title"]} level={5}>
                          Salon không hoạt hộng hoặc không có nhân viên làm
                          trong khoảng thời gian này!
                        </Title>
                      )}
                    </div>
                    <Divider />
                  </Spin>
                </>
              )}
              {additionalServices?.length > 0 && (
                <div>
                  <Title level={5}>Dịch vụ đang đặt</Title>
                  <List
                    loading={loadingBook}
                    itemLayout="horizontal"
                    dataSource={additionalServices}
                    renderItem={(service) => {
                      const data =
                        service?.bookingDetailResponses?.employees.find(
                          (e) =>
                            e?.id === service?.bookingDetail?.salonEmployeeId
                        );

                      return (
                        <List.Item>
                          <div className="flex justify-between w-full">
                            <List.Item.Meta
                              style={{
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                              description={
                                <div className={style["serviceBoking"]}>
                                  {additionalServices?.length > 0 && (
                                    <Button
                                      key="close"
                                      type="text"
                                      icon={<CloseOutlined />}
                                      onClick={() =>
                                        handleRemoveService(service)
                                      }
                                      className={`${style["close-button-close"]} text-black`}
                                      style={{
                                        position: "absolute",
                                        top: "-10px", // Định vị nút cách cạnh trên 8px
                                        right: "-10px", // Định vị nút cách cạnh phải 8px
                                        zIndex: 1,
                                        backgroundColor: "gray",
                                        borderRadius: "50px",
                                        transition: "transform 0.3s ease",
                                      }}
                                    />
                                  )}
                                  {/* <Avatar
                                size={80}
                                shape="square"
                                src={service?.img}
                              /> */}
                                  <div
                                    className={style["serviceBookngContainer"]}
                                  >
                                    <span
                                      className={style["serviceBookngItem"]}
                                      style={{ fontWeight: "bold" }}
                                    >
                                      Tên dịch vụ: {service.serviceName}
                                    </span>
                                    <span
                                      className={style["serviceBookngItem"]}
                                    >
                                      Tiền: {formatMoneyVND(service.price)} vnđ
                                    </span>
                                  </div>

                                  <div
                                    className={style["serviceBookngContainer"]}
                                  >
                                    <span
                                      className={style["serviceBookngItem"]}
                                    >
                                      Thời gian dịch vụ:{" "}
                                      {formatTime(service.time)}
                                    </span>
                                    <span
                                      className={style["serviceBookngItem"]}
                                    >
                                      Thời gian chờ:{" "}
                                      {formatTime(service.waitingTime)}
                                    </span>
                                  </div>

                                  <div
                                    className={style["serviceBookngContainer"]}
                                  >
                                    <span
                                      className={style["serviceBookngItem"]}
                                    >
                                      Nhân viên:{" "}
                                      {data ? data?.fullName : <>Chưa chọn</>}
                                    </span>
                                    <Button
                                      key="change"
                                      onClick={() => handleChangeStaff(service)}
                                      type="primary"
                                      success
                                      style={{
                                        backgroundColor: "#bf9456",
                                      }}
                                      disabled={statusChangeStaff}
                                      // Add margin-top to space from the close button
                                    >
                                      Chọn nhân viên
                                    </Button>
                                  </div>
                                </div>
                              }
                            />
                          </div>
                          {currentService && (
                            <Modal
                              title={
                                <div
                                  style={{
                                    fontWeight: "bold",
                                    textAlign: "center",
                                    backgroundColor: "#ece8de",
                                  }}
                                >
                                  {`Chọn nhân viên cho dịch vụ ${currentService?.serviceName}`}
                                </div>
                              }
                              visible={isModalVisible}
                              onCancel={handleCancel}
                              footer={null}
                              wrapClassName="my-custom-modal"
                            >
                              <List
                                itemLayout="horizontal"
                                // dataSource={[
                                //   {
                                //     id: "random",
                                //     fullName: "Ngẫu nhiên",
                                //     img: <RandomIcon color="black" />,
                                //   },
                                //   ...(currentService?.bookingDetailResponses
                                //     ?.employees || []),
                                // ]}
                                dataSource={[
                                  ...(currentService?.bookingDetailResponses
                                    ?.employees || []),
                                ]}
                                renderItem={(employee) => (
                                  <List.Item
                                    actions={[
                                      <Button
                                        type="text"
                                        block
                                        success
                                        style={{
                                          backgroundColor: "#bf9456",
                                          fontSize: "1rem",
                                        }}
                                        key={employee.id}
                                        onClick={() => {
                                          if (employee.id === "random") {
                                            handleChangeRandomEmployee();
                                          } else {
                                            handleChangeStaffSecond(
                                              currentService,
                                              employee.id
                                            );
                                          }
                                        }}
                                      >
                                        Chọn
                                      </Button>,
                                    ]}
                                  >
                                    <List.Item.Meta
                                      avatar={
                                        <Avatar
                                          src={employee.img}
                                          alt={employee.fullName}
                                        />
                                      }
                                      title={employee.fullName}
                                    />
                                  </List.Item>
                                )}
                              />
                            </Modal>
                          )}
                        </List.Item>
                      );
                    }}
                  />
                </div>
              )}

              <Button
                type="text"
                block
                success
                style={{
                  backgroundColor: "#bf9456",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  color: "white",
                }}
                // onClick={() => setShowServiceList(true)}
                onClick={handleAddServiceClick}
              >
                Thêm dịch vụ
              </Button>
              {/* <Button
              type="primary"
              style={{
                backgroundColor: "#bf9456",
                marginTop: "16px",
              }}
              block
              onClick={handleDisplayVoucherList}
              // disabled
            >
              {displayVoucherList ? (
                <Text>Đóng</Text>
              ) : (
                <Text>Xem danh sách Voucher</Text>
              )}
            </Button> */}
              {voucherSelected &&
                voucherSelected.map((e) => (
                  <div
                    key={e.id}
                    title="Voucher đã chọn"
                    style={{
                      padding: "0px",
                      marginTop: "16px",
                    }}
                    // bordered={true}
                  >
                    <div className={style["voucher-container"]}>
                      <div className={style["voucher-left"]}>
                        <p
                          className={style["voucher-description"]}
                          style={{ marginBottom: "5px" }}
                        >
                          {e.description}
                        </p>
                        <p
                          className={style["voucher-minimum"]}
                          style={{ marginBottom: "5px" }}
                        >
                          Số tiền tối thiểu:{" "}
                          {formatMoneyVND(e.minimumOrderAmount)} vnđ
                        </p>
                        <p
                          className={style["voucher-max-discount"]}
                          style={{ marginBottom: "5px" }}
                        >
                          Giảm giá tối đa: {formatMoneyVND(e.maximumDiscount)}{" "}
                          vnđ
                        </p>
                        <p
                          className={style["voucher-max-discount"]}
                          style={{ marginBottom: "5px" }}
                        >
                          Ngày hết hạn: {formattedDateUi(e.expiryDate)}
                        </p>
                        <Button
                          type="primary"
                          danger
                          onClick={() => handleRemoveVoucher(e.id)}
                        >
                          Xóa mã khuyến mãi
                        </Button>
                      </div>
                      <div className={style["voucher-right"]}>
                        <span className={style["voucher-discount"]}>
                          GIẢM GIÁ
                        </span>
                        <span className={style["voucher-discount"]}>
                          {e.discountPercentage * 100}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              <div style={{ marginTop: "16px" }}>
                <Title style={{ marginBottom: "5px" }} level={4}>
                  Tổng số tiền
                </Title>
                <p
                  style={{
                    fontSize: voucherSelected?.length > 0 ? "1.9rem" : "1.2rem",
                    marginBottom: "0px",
                    // textDecoration:
                    //   voucherSelected?.length > 0
                    //     ? "line-through"
                    //     : "none",
                    color: voucherSelected?.length > 0 ? "gray" : "inherit",
                  }}
                >
                  {calculateTotal()}
                </p>
                <Title style={{ marginBlock: "5px" }} level={4}>
                  Giá tiền thu cho khách
                </Title>
                <Form
                  form={formPrice}
                  layout="vertical"
                  // onFinish={handleSubmit}
                  style={{ maxWidth: 400 }}
                >
                  <Form.Item
                    // label="Giá tiền thu cho khách"
                    name="price"
                    rules={[
                      { required: true, message: "Vui lòng nhập giá tiền!" },
                      {
                        validator: (_, value) => {
                          const totalPrice = parseInt(
                            calculateTotal().replace(/[^0-9]/g, ""),
                            10
                          );
                          if (!value || value <= totalPrice) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error("Giá tiền không được lớn hơn tổng tiền!")
                          );
                        },
                      },
                    ]}
                  >
                    <InputNumber
                      placeholder="Nhập giá tiền"
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      min={0}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Form>
                {voucherSelected?.length > 0 && (
                  <p
                    style={{
                      fontSize: "1.2rem",
                      marginBottom: "0px",
                      marginTop: "0px",
                    }}
                  >
                    {/* {formatCurrency(totalPrice)}{" "} */}
                    <span
                      style={{
                        marginLeft: "5px",
                      }}
                      className="font-bold text-green-500"
                    >
                      -
                      {formatDiscountPercentage(
                        voucherSelected[0]?.discountPercentage
                      )}
                      %
                    </span>
                  </p>
                )}
                <button
                  style={{
                    backgroundColor: "#bf9456",
                    paddingBlock: "10px",
                    width: "100%",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    color: "white",
                  }}
                  onClick={handleBooking}
                  type="primary"
                  className="mt-2"
                >
                  Xác nhận lịch đặt
                </button>
              </div>
            </div>
          )}
        </Spin>
      </Modal>
      <BookingConfirmationModal
        isVisible={isPriceModalVisible}
        onClose={() => setIsPriceModalVisible(false)}
        onConfirm={handleConfirmBooking}
        loadingCheck={loadingCheck}
        additionalServices={additionalServices}
        originalPrice={originalPrice}
        discountedPrice={discountedPrice}
        totalPrice={totalPrice}
        appointmentData={appointmentData}
      />
      ;
    </>
  );
};

export default AddAppointmentOutsite;
