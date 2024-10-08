import {
  CloseOutlined,
  HeartOutlined,
  LeftOutlined,
  PhoneOutlined,
  RightOutlined,
  ShareAltOutlined,
  StarFilled,
  StarOutlined,
} from "@ant-design/icons";
import * as signalR from "@microsoft/signalr";
import RandomIcon from "@rsuite/icons/Random";
import {
  Avatar,
  Button,
  Card,
  Carousel,
  Col,
  Collapse,
  Divider,
  Empty,
  Image,
  Layout,
  List,
  message,
  Modal,
  Pagination,
  Progress,
  Row,
  Select,
  Space,
  Spin,
  Typography,
} from "antd";
// import { ButtonMode } from "@/components/ui/button";
import { CoolMode } from "@/components/magicui/cool-mode";
import { Content } from "antd/es/layout/layout";
import axios from "axios";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import style from "../css/salonDetail.module.css";
import { AppointmentService } from "../services/appointmentServices";
import { SalonEmployeesServices } from "../services/salonEmployeesServices";
import { SalonInformationServices } from "../services/salonInformationServices";
import { ServiceHairServices } from "../services/servicesHairServices";
import {
  onBookAppointmentMessage,
  sendMessage,
  startConnection,
  stopConnection,
} from "../services/signalRService";
import { actGetVoucherBySalonIdNotPaging } from "../store/manageVoucher/action";
import { actGetAllFeedbackBySalonId } from "../store/ratingCutomer/action";
import {
  actGetAllSalonInformation,
  actGetSalonInformationByOwnerIdForImages,
} from "../store/salonInformation/action";
import TitleCard from "@/components/TitleCard";
import { DragCards } from "@/components/DragCards";
import { HoverImageLinks } from "@/components/HoverImageLinks";
import AnimatedList from "@/components/AnimatedList";
import { SmoothScrollHero } from "@/components/SmoothScrollHero";
const { Panel } = Collapse;
const { Title, Text } = Typography;
const { Option } = Select;
const daysOrder = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const ourWorkImages = [
  "https://via.placeholder.com/800x600?text=Work+1",
  "https://via.placeholder.com/800x600?text=Work+2",
  "https://via.placeholder.com/800x600?text=Work+3",
  "https://via.placeholder.com/800x600?text=Work+4",
  "https://via.placeholder.com/800x600?text=Work+5",
];

const daysOfWeek = {
  Monday: "Thứ hai",
  Tuesday: "Thứ ba",
  Wednesday: "Thứ tư",
  Thursday: "Thứ năm",
  Friday: "Thứ sáu",
  Saturday: "Thứ bảy",
  Sunday: "Chủ nhật",
};

const reportOptions = [
  "Spam or misleading",
  "Inappropriate content",
  "Hate speech or graphic violence",
  "Harassment or bullying",
];
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);
dayjs.extend(isSameOrBefore);
function renderStars(stars) {
  const filledStars = Math.floor(stars); // Số sao đầy đủ
  const fraction = stars % 1; // Phần thập phân của số sao
  const starIcons = [];

  // Thêm các sao đầy đủ
  for (let i = 0; i < filledStars; i++) {
    starIcons.push(<StarFilled key={i} style={{ color: "#FFD700" }} />);
  }

  // Thêm sao một phần nếu có phần thập phân
  if (fraction > 0) {
    starIcons.push(
      <span
        key={`partial-${filledStars}`}
        style={{
          position: "relative",
          display: "inline-block", // Keep stars inline
          width: "2.1rem", // Star size
          height: "2.1rem",
          overflow: "hidden",
          verticalAlign: "middle",
        }}
      >
        <StarFilled
          style={{
            position: "absolute",
            color: "#888", // màu sao trống
            zIndex: 1, // lớp dưới cùng
            left: 0,
            top: 0,
          }}
        />
        <StarFilled
          style={{
            position: "absolute",
            color: "#FFD700",
            clipPath: `inset(0 ${100 - fraction * 100}% 0 0)`, // phần sao được tô vàng
            zIndex: 2, // lớp trên cùng
            left: 0,
            top: 0,
          }}
        />
      </span>
    );
  }

  // Thêm các sao trống còn lại
  const remainingStars = 5 - filledStars - (fraction > 0 ? 1 : 0);
  for (let i = 0; i < remainingStars; i++) {
    starIcons.push(
      <StarFilled key={filledStars + i + 1} style={{ color: "#d4d2d2" }} />
    );
  }

  return starIcons;
}

const vietnamTimezone = "Asia/Ho_Chi_Minh";
const currentTime = dayjs().tz(vietnamTimezone);
const listItemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  hover: { scale: 1.05 },
};

function SalonDetail(props) {
  const { id } = useParams();
  const userName = useSelector((state) => state.ACCOUNT.username);
  const userIdCustomer = useSelector((state) => state.ACCOUNT.idCustomer);
  const userId = useSelector((state) => state.ACCOUNT.idOwner);
  const uid = useSelector((state) => state.ACCOUNT.uid);

  // const userAuth = useAuthUser();
  // const userId = userAuth?.idOwner;
  // const userIdCustomer = userAuth?.idCustomer;
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // Số lượng phản hồi trên mỗi trang
  const [employees, setEmployees] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSizeEmployee, setPageSizeEmployee] = useState(3);
  const [total, setTotal] = useState(0);
  const indexOfLastFeedback = currentPage * pageSize;
  const indexOfFirstFeedback = indexOfLastFeedback - pageSize;

  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const currentDate = new Date();

  const [salonEmployeeList, setSalonEmployeeList] = useState([]);

  //Voucher
  const [displayVoucherList, setDisplayVoucherList] = useState(false);
  const [voucherList, setVoucherList] = useState([]);
  const [voucherSelected, setVoucherSelected] = useState([]);

  //Appointment
  const [calculateAppointmentData, setCalculateAppointmentData] = useState({});
  //Services hair
  const [oneServiceData, setOneServiceData] = useState({});
  const [dataBooking, setDataBooking] = useState([]); //serviceHairId, employeeId
  const [selectedReports, setSelectedReports] = useState([]);
  const [showAllWork, setShowAllWork] = useState(false);
  const [isBookingModalVisible, setIsBookingModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  const [selectedStaff, setSelectedStaff] = useState({});
  const [visibleModals, setVisibleModals] = useState({});
  const [currentService, setCurrentService] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [additionalServices, setAdditionalServices] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [scrollIndex, setScrollIndex] = useState(0);
  const [scrollIndex1, setScrollIndex1] = useState(0);
  const [showServiceList, setShowServiceList] = useState(false);
  const [data, setData] = useState([]); // Initialize as an empty array
  const [error, setError] = useState(null);
  const [salonDetail, setSalonDetail] = useState({});
  const [listVoucher, setListVoucher] = useState([]);
  const [selectedVouchers, setSelectedVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [loadingTime, setLoadingTime] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [loadingEmployee, setLoadingEmployee] = useState(false);

  const [isPriceModalVisible, setIsPriceModalVisible] = useState(false);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [appointmentData, setAppointmentData] = useState(null);

  const [statusChangeStaff, setStatusChangeStaff] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingBook, setLoadingBook] = useState(false);
  const [isLoadingService, setIsLoadingService] = useState(false);
  const [filterRating, setFilterRating] = useState(null);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const listVoucherNotPaging = useSelector(
    (state) => state.SALONVOUCHERS.getVoucherBySalonIdNotPaging
  );

  const listFeedback = useSelector(
    (state) => state.RATING.getAllFeedbackbySalonId
  );
  const salonImages = useSelector(
    (state) => state.SALONINFORMATION.getSalonByOwnerIdForImages
  );

  const totalPagesFeedback = useSelector((state) => state.RATING.totalPages);
  useEffect(() => {
    if (id || currentPage) {
      setLoadingFeedback(true);
      dispatch(actGetAllFeedbackBySalonId(id, currentPage, pageSize))
        .then((res) => {})
        .catch((err) => {})
        .finally((err) => {
          setLoadingFeedback(false);
        });
    }
  }, [id, currentPage]);
  useEffect(() => {
    if (id) {
      setLoadingEmployee(true);
      dispatch(actGetAllSalonInformation());
      const fetchEmployees = async () => {
        // setLoading(true);

        await SalonEmployeesServices.getSalonEmployeeBySalonInformationId(
          id,
          page,
          pageSizeEmployee
        )
          .then((response) => {
            setLoadingEmployee(false);
            setEmployees(response.data.items);
            setTotal(response.data.total);
          })
          .catch((err) => {})
          .finally((err) => {
            setLoadingEmployee(false);
          });

        // setLoading(false);
      };

      fetchEmployees();
    }
  }, [id, page]);
  useEffect(() => {
    if (id) {
      dispatch(actGetVoucherBySalonIdNotPaging(id));
      dispatch(actGetSalonInformationByOwnerIdForImages(id, 1, 100));
    }
  }, [id]);

  useEffect(() => {
    setListVoucher(listVoucherNotPaging);
  }, [listVoucherNotPaging]);

  useEffect(() => {
    if (additionalServices.length === 0) {
      setSelectedTimeSlot(null);
    }
  }, [additionalServices]);
  const SALONDETAIL_URL =
    "https://hairhub.gahonghac.net/api/v1/saloninformations/GetSalonInformationById/";

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
  useEffect(() => {
    setIsLoadingService(true);
    SalonEmployeesServices.getSalonEmployeeBySalonInformationId(id).then(
      (res) => {
        setSalonEmployeeList(res.data.items);
      }
    );

    //Hair Services
    ServiceHairServices.getServiceHairBySalonNotPaging(id)
      .then((res) => {
        setData(res?.data);
      })
      .catch((err) => {
        setError(err);
      })
      .finally((err) => {
        setIsLoadingService(false);
      });

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

  const timeContainerRef = useRef(null);

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

  // Call the function to get the next seven days
  const currentMonthDays = generateNextSevenDays();

  const handleBookClick = async (service) => {
    if (userId === salonDetail?.salonOwner?.id || userId) {
      message.warning("Bạn là chủ cửa hàng không thể đặt lịch");
      return;
    }
    if (
      userName === undefined ||
      !localStorage.getItem("refreshToken") ||
      !localStorage.getItem("accessToken")
    ) {
      navigate("/login");
      message.warning("Vui lòng đăng ký hoặc đăng nhập để đặt lịch");
    }
    if (additionalServices.length < 1) {
      const data = listVoucherNotPaging?.filter(
        (e) => e?.minimumOrderAmount <= service?.price
      );
      setVoucherList(data);
      const currentDate = new Date(); // Lấy ngày hôm nay

      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Thêm số 0 vào trước tháng nếu cần
        const day = String(date.getDate()).padStart(2, "0"); // Thêm số 0 vào trước ngày nếu cần
        return `${year}-${month}-${day}`;
      };

      const formattedDate = formatDate(currentDate);
      const postData = {
        day: formattedDate, // Chuyển đổi date thành ISO string
        salonId: id,
        serviceHairId: service?.id,
        salonEmployeeId: null,
        isAnyOne: true,
      };
      setSelectedDate(currentDate);
      try {
        // Using async/await to make the API call
        const response = await SalonInformationServices.getGetAvailableTime(
          postData
        );

        if (response.status === 200 || response.status === 201) {
          setTimeSlots(response?.data); // Set time slots if response is successful
        } else {
          setTimeSlots([]); // Clear time slots in case of a different status
        }
      } catch (error) {
        // Check if the error response contains a status code
        if (error.response?.status === 404) {
          // Suppress the NotFound error and handle it silently
          setTimeSlots([]); // Clear time slots when no data is found
        } else {
          // Optionally handle other errors here (without logging them)
          setTimeSlots([]); // Clear time slots in case of other errors
        }
      }
    }
    setOneServiceData(service);
    const isServiceAlreadySelected = additionalServices.some(
      (s) => s?.id === service?.id
    );

    if (isServiceAlreadySelected) {
      // Hiển thị thông báo nếu dịch vụ đã được chọn
      setIsBookingModalVisible(true);
      message.warning("Dịch vụ này đã được chọn trước đó.");
    } else {
      // Thêm dịch vụ vào mảng additionalServices nếu chưa được chọn
      setAdditionalServices([...additionalServices, service]);
      // Hiển thị phần "Add Another Service"
      setIsBookingModalVisible(true);
    }
  };

  //Set selected voucher
  const handleDisplayVoucherList = () => {
    setDisplayVoucherList(!displayVoucherList);
  };

  //Set selected voucher
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
  const formattedDateUi = (date) => {
    return dayjs(date).format("DD/MM/YYYY");
  };

  const handleDateSelect = async (day) => {
    setLoadingTime(true);
    const idSer = additionalServices[0]?.id;
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Thêm số 0 vào trước tháng nếu cần
      const day = String(date.getDate()).padStart(2, "0"); // Thêm số 0 vào trước ngày nếu cần
      return `${year}-${month}-${day}`;
    };

    const formattedDate = formatDate(day);

    if (formattedDate !== selectedDate) {
      setAdditionalServices((prevServices) =>
        prevServices.map((s) => ({
          ...s,
          bookingDetail: { ...s.bookingDetail, salonEmployeeId: null },
        }))
      );
      setSelectedStaff("");
      setSelectedDate(day);
    }
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

  // const handleChangeStaffSecond = (service, value) => {
  //   setAdditionalServices((prevServices) =>
  //     prevServices.map((s) =>
  //       s.id === service.id
  //         ? {
  //             ...s,
  //             bookingDetail: {
  //               ...s.bookingDetail,
  //               salonEmployeeId: value,
  //               serviceHairId: service.id,
  //               isAnyOne: true,
  //             },
  //           }
  //         : s
  //     )
  //   );
  //   setIsModalVisible(false);
  // };
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
  
  // const handleChangeRandomEmployee = () => {
  //   setAdditionalServices((prevServices) =>
  //     prevServices.map((s) =>
  //       s.id === currentService.id
  //         ? {
  //             ...s,
  //             bookingDetail: {
  //               ...s.bookingDetail,
  //               salonEmployeeId: null,
  //               serviceHairId: currentService.id,
  //               isAnyOne: true,
  //             },
  //           }
  //         : s
  //     )
  //   );
  //   setIsModalVisible(false);
  // };
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
  

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentService(null);
  };

  const handleServiceSelect = async (service) => {
    setLoading(true);
    const isChecked = additionalServices.some((s) => s.id === service.id);
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

          const totalPriceMapping = listVoucherNotPaging?.filter(
            (e) => e?.minimumOrderAmount <= total
          );
          // setListVoucher(totalPriceMapping);
          setVoucherList(totalPriceMapping);
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
          setHasError(true);
        })
        .finally((err) => {
          setLoading(false);
        });
    }
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

  const calculateRatingDistribution = (feedbacks) => {
    const totalReviews = feedbacks.length;
    const ratingDistribution = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    let totalStars = 0;

    feedbacks.forEach((feedback) => {
      totalStars += feedback.rating;
      const roundedStars = Math.round(feedback.rating);
      ratingDistribution[roundedStars]++;
    });

    const averageRating = (totalStars / totalReviews).toFixed(1);

    return { averageRating, ratingDistribution, totalReviews };
  };

  const { averageRating, ratingDistribution, totalReviews } =
    calculateRatingDistribution(listFeedback);
    const getSelectedEmployeeName = (serviceId) => {
      const selectedService = additionalServices.find((s) => s.id === serviceId);
      const selectedEmployeeId = selectedService?.bookingDetail?.salonEmployeeId;
    
      // Check if selectedEmployeeId is undefined
      if (!selectedEmployeeId) {
        return undefined; // Return undefined if no employee is selected
      }
    
      const employee = currentService?.bookingDetailResponses?.employees.find(
        (e) => e.id === selectedEmployeeId
      );
    
      return employee?.fullName; // Returns employee's full name or undefined if not found
    };
    

  const handleChangeStaff = (service) => {
    if (!selectedTimeSlot) {
      message.warning("Vui lòng chọn thời gian cắt tóc");
    } else {
      setCurrentService(service);
      setIsModalVisible(true);
    }
  };

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

  useEffect(() => {
    axios
      .get(SALONDETAIL_URL + id)
      .then((res) => {
        setSalonDetail(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

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

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND", // Replace 'USD' with your desired currency code
    }).format(value);
  };
  const formatDiscountPercentage = (value) => {
    return value * 100;
  };

  const handleBooking = async () => {
    setLoadingBook(true);
    if (additionalServices.length === 0) {
      message.info("Vui lòng chọn dịch vụ!!");
      setIsPriceModalVisible(false);
      return;
    }
    if (selectedTimeSlot === null) {
      message.info("Vui lòng chọn giờ!!");
      setIsPriceModalVisible(false);
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
        setOriginalPrice(res.data.originalPrice);
        setTotalPrice(res.data.totalPrice);
        setDiscountedPrice(res.data.discountedPrice);
        setAppointmentData({
          customerId: userIdCustomer,
          startDate: formattedDate,
          totalPrice: res.data.totalPrice,
          originalPrice: res.data.originalPrice,
          discountedPrice: res.data.discountedPrice,
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
          voucherIds: voucherId ? [voucherId] : [],
        });
        setIsPriceModalVisible(true);
      })
      .catch((err) => {})
      .finally((err) => {
        setLoadingBook(false);
      });
  };
  const fetchAvailable = async (currentDate) => {
    console.log("Inside fetchAvailable with dateAppointment:", currentDate);
    const postData = {
      day: currentDate,
      salonId: id,
      serviceHairId: additionalServices[0]?.id,
      salonEmployeeId: null,
      isAnyOne: true,
    };

    try {
      // Call the API to get available time slots
      const response = await SalonInformationServices.getGetAvailableTime(
        postData
      );
      console.log("respon", response);

      // Update the time slots state with the received data
      if (response && response.data) {
        setTimeSlots(response.data);
      } else {
        setTimeSlots([]); // Handle empty or null response data
      }
    } catch (error) {
      console.error("Error posting data:", error);
      setTimeSlots([]); // Clear time slots in case of an error
    }
  };

  useEffect(() => {
    let connection;
    const setupSignalR = async () => {
      try {
        // Create the SignalR connection
        connection = new signalR.HubConnectionBuilder()
          .withUrl("https://hairhub.gahonghac.net/book-appointment-hub")
          .withAutomaticReconnect()
          .build();

        // Start the connection
        await connection.start();

        // Set up the event listener directly inside useEffect
        connection.on(
          "ReceiveMessage",
          async (message, dateAppointment, datenow, salonId, serviceId) => {
            // Make sure selectedDate is properly defined
            if (!selectedDate) {
              return;
            }

            // Function to format the date
            const formatDate = (date) => {
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, "0");
              const day = String(date.getDate()).padStart(2, "0");
              return `${year}-${month}-${day}`;
            };

            // Format the date
            const formattedDate = formatDate(selectedDate);

            // Make sure the condition is valid before calling the API
            if (dateAppointment === formattedDate && salonId === id) {
              try {
                await fetchAvailable(dateAppointment);
              } catch (error) {
                console.error("Error in fetchAvailable:", error);
              }
            }
          }
        );
      } catch (error) {
        console.error("Error setting up SignalR:", error);
      }
    };

    setupSignalR();

    // Clean up the connection when the component unmounts
    return () => {
      connection.stop().then(() => console.log("SignalR Disconnected."));
    };
  }, [selectedDate]); // Make sure selectedDate is part of the dependency array

  useEffect(() => {
    const initiateConnection = async () => {
      // try {
      await startConnection();
      // } catch (error) {
      //   console.error("Failed to start the SignalR connection:", error);
      // }
    };
    initiateConnection();
  }, []);

  const handleConfirmBooking = async () => {
    if (additionalServices.length === 0) {
      message.info("Vui lòng chọn dịch vụ!!!");
      setIsPriceModalVisible(false);
      return;
    }

    if (selectedTimeSlot === null) {
      message.warning("Vui lòng chọn giờ để đặt lịch");
      setIsPriceModalVisible(false);
      return;
    }

    try {
      setIsLoading(true);
      setIsPriceModalVisible(false);
      setIsBookingModalVisible(false);

      // Create the appointment
      const res = await AppointmentService.createAppointment(appointmentData)
        .then(async (res) => {
          await startConnection();
          const serviceHairIds =
            appointmentData?.appointmentDetails?.map(
              (detail) => detail.serviceHairId // Convert each ID to a string
            ) || [];
          let mappingData = {
            message: "send serviceId",
            dateAppointment: appointmentData?.startDate,
            salonId: salonDetail?.id,
            serviceId: serviceHairIds,
            ownerId: salonDetail?.ownerId,
          };
          // Listen for appointment creation events
          // await sendMessage(data.date,data.serviceHairIds);
          await AppointmentService.broadcastMessage(mappingData);
          setIsLoading(false);
          message.success("Tạo lịch cắt tóc thành công");
          setAdditionalServices([]);
          setVoucherSelected([]);
        })
        .catch((err) => {
          message.error("Tạo lịch cắt tóc không thành công!!");
          setIsLoading(false);
        })
        .finally((err) => {
          stopConnection();
        });
    } catch (err) {
      message.warning("Tạo lịch không thành công");
      setIsLoading(false);
      console.error(err);
    }
  };

  const handleAddServiceClick = () => {
    if (!selectedTimeSlot) {
      message.warning("Vui lòng chọn thời gian trước khi thêm dịch vụ.");
    } else {
      setShowServiceList(true);
    }
  };

  const handleSelectedVouchers = (values) => {
    const selected = listVoucher.filter((voucher) =>
      values.includes(voucher.id)
    );
    setSelectedVouchers(selected);
  };
  const handleRemoveVoucher = (id) => {
    const updatedVouchers = voucherSelected.filter((e) => e?.id !== id);
    setVoucherSelected(updatedVouchers);
  };

  const sortedSchedules = salonDetail?.schedules?.sort((a, b) => {
    return daysOrder.indexOf(a.dayOfWeek) - daysOrder.indexOf(b.dayOfWeek);
  });
  const handlePageChangeEmployees = (page, pageSizeEmployee) => {
    setPage(page);
    setPageSizeEmployee(pageSizeEmployee);
  };
  const handleRemoveService = (serviceToRemove) => {
    // Filter out the service that matches the ID of the serviceToRemove
    const updatedServices = additionalServices.filter(
      (service) => service.id !== serviceToRemove.id
    );

    // Update the state with the new array
    setAdditionalServices(updatedServices);
  };
  const handleFilterChange = (rating) => {
    setCurrentPage(1);
    setLoadingFeedback(true);
    dispatch(actGetAllFeedbackBySalonId(id, currentPage, pageSize, rating))
      .then((res) => {})
      .catch((err) => {})
      .finally((err) => {
        setLoadingFeedback(false);
      });

    setFilterRating(rating);
  };

  // const filteredFeedback = filterRating
  //   ? listFeedback.filter((feedback) => feedback?.rating === filterRating)
  //   : listFeedback;
  function formatMoneyVND(amount) {
    return amount.toLocaleString("vi-VN");
  }
  const getSelectedEmployeeIds = () => {
    return additionalServices
      .filter((service) => service.bookingDetail?.salonEmployeeId)
      .map((service) => service.bookingDetail.salonEmployeeId);
  };
  return (
    <div style={{ marginTop: "75px" }}>
      <Layout>
        <Content>
          <Row justify="center" gutter={0}>
            <Col xs={24} md={14} className={style["detail-salon-col-1"]}>
              <div>
                {/* <SmoothScrollHero imageSalon={salonDetail?.img} /> */}
                <div className="relative w-full h-full">
                  {/* <TitleCard img={salonDetail.img} /> */}
                  <Carousel autoplay className="w-full h-full">
                    <TitleCard img={salonDetail.img} />
                  </Carousel>
                </div>
              </div>
              <div
                className="text-center"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                  justifyContent: "start",
                  marginBlock: "10px",
                  marginLeft: "1rem",
                }}
              >
                <motion.h2
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{
                    scale: 1.1, // Tăng kích thước khi hover
                    color: "#ff6347", // Thay đổi màu sắc khi hover (tùy chỉnh theo ý muốn)
                    transition: {
                      duration: 0.3, // Thời gian hiệu ứng hover
                      type: "spring", // Loại chuyển động
                      stiffness: 300, // Độ cứng của lò xo
                    },
                  }}
                >
                  {salonDetail?.name}
                </motion.h2>
                <span className={style["text-address"]}>
                  <div>
                    Địa chỉ:{" "}
                    <span
                      style={{
                        display: "inline-block",
                        color: "#BF9456",
                      }}
                    >
                      {salonDetail.address}
                    </span>
                  </div>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${salonDetail.latitude},${salonDetail.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={style["link-address"]}
                  >
                    Chỉ đường
                  </a>
                </span>
              </div>

              <div>
                <Collapse
                  bordered={false}
                  defaultActiveKey={["1"]}
                  expandIconPosition="end"
                  className="custom-collapse"
                  style={{
                    backgroundColor: "transparent",
                  }}
                >
                  <Panel
                    header={
                      <span
                        style={{
                          fontSize: "1.4rem",
                          fontWeight: "bold",
                          textAlign: "center",
                        }}
                      >
                        DỊCH{" "}
                        <span
                          style={{
                            display: "inline-block",
                            color: "#BF9456",
                          }}
                        >
                          VỤ
                        </span>
                      </span>
                    }
                    key="1"
                  >
                    <Spin spinning={isLoadingService}>
                      <List
                        itemLayout="horizontal"
                        // dataSource={services}
                        dataSource={data}
                        renderItem={(service) => (
                          <motion.div
                            variants={listItemVariants}
                            initial="hidden"
                            animate="visible"
                            whileHover="hover"
                          >
                            <List.Item
                              actions={[
                                <Button
                                  type="primary"
                                  key="book"
                                  onClick={() => handleBookClick(service)}
                                  style={{ backgroundColor: "#bf9456" }}
                                >
                                  Đặt lịch
                                </Button>,
                              ]}
                            >
                              <List.Item.Meta
                                avatar={
                                  <Avatar
                                    shape="square"
                                    size={{
                                      xs: 24,
                                      sm: 32,
                                      md: 40,
                                      lg: 64,
                                      xl: 50,
                                      xxl: 50,
                                    }}
                                    src={service?.img}
                                  />
                                }
                                title={
                                  <span
                                    style={{
                                      fontSize: "1.1rem",
                                      cursor: "pointer",
                                    }}
                                    onClick={() =>
                                      setIsBookingModalVisible(true)
                                    }
                                  >
                                    {service?.serviceName}
                                  </span>
                                }
                                description={`${formatMoneyVND(
                                  service?.price
                                )} vnđ • ${formatTime(service?.time)}`}
                              />
                            </List.Item>
                          </motion.div>
                        )}
                        style={{ backgroundColor: "transparent" }}
                        pagination={{
                          pageSize: 5,
                          // showSizeChanger: true,
                          pageSizeOptions: ["5", "10", "20"],
                          className: "paginationAppointment",
                        }}
                      />
                    </Spin>
                  </Panel>
                </Collapse>
              </div>
              <div>
                <Spin spinning={loading}>
                  <Modal
                    wrapClassName="my-custom-modal"
                    title={
                      <div
                        style={{
                          fontSize: "3rem",
                          fontWeight: "bold",
                          textAlign: "center",
                          backgroundColor: "#ece8de",
                        }}
                      >
                        Đặt lịch cắt tóc
                      </div>
                    }
                    visible={
                      isBookingModalVisible && additionalServices?.length !== 0
                    }
                    className={showServiceList ? "no-close-btn" : ""}
                    onCancel={() => {
                      setIsBookingModalVisible(false);
                    }}
                    footer={null}
                    width={800}
                  >
                    {showServiceList ? (
                      <>
                        <Spin spinning={loading}>
                          <div>
                            <Title level={3}>Thêm những dịch vụ khác</Title>
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
                                    actions={[
                                      <div
                                        className={`${style.customCheckbox} ${
                                          isChecked
                                            ? style.customCheckboxBooked
                                            : ""
                                        } ${style.customCheckboxHover}`}
                                        key={`checkbox-${index}`} // Thêm thuộc tính key
                                        onClick={() =>
                                          handleServiceSelect(service)
                                        }
                                      >
                                        {isChecked ? "Đã đặt" : "Đặt lịch"}
                                      </div>,
                                    ]}
                                  >
                                    <List.Item.Meta
                                      avatar={
                                        <Avatar
                                          size={{
                                            xs: 24,
                                            sm: 32,
                                            md: 40,
                                            lg: 64,
                                            xl: 80,
                                            xxl: 100,
                                          }}
                                          src={service?.img}
                                        />
                                      }
                                      title={
                                        <Title level={4}>
                                          {service.serviceName}
                                        </Title>
                                      }
                                      description={
                                        <Typography className="w-fit">
                                          <Text strong>
                                            Mô tả:&nbsp;
                                            <Text
                                              style={{
                                                display: "inline",
                                                fontWeight: "normal",
                                              }}
                                            >
                                              {service.description}
                                            </Text>
                                          </Text>{" "}
                                          <br />
                                          <Text strong>
                                            Giá:&nbsp;
                                            <Text
                                              style={{
                                                display: "inline",
                                                fontWeight: "normal",
                                              }}
                                            >
                                              {formatMoneyVND(service.price)}
                                            </Text>
                                            <br />
                                          </Text>
                                          <Text strong>
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
                                        </Typography>
                                      }
                                    />
                                  </List.Item>
                                );
                              }}
                              style={{ backgroundColor: "transparent" }}
                            />
                            <Button
                              type="dashed"
                              block
                              style={{ marginTop: "16px" }}
                              onClick={() => {
                                setShowServiceList(false);
                              }}
                              // disabled={hasError}
                            >
                              Trở về
                            </Button>
                          </div>
                        </Spin>
                      </>
                    ) : (
                      <div>
                        <Divider />
                        <div>
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
                                        selectedDate.toDateString() ===
                                          day.toDateString()
                                          ? style.selected
                                          : ""
                                      }
                                    >
                                      {formatDate(day)}
                                    </Button>
                                  </CoolMode>
                                </motion.div>
                              ))}
                            </motion.div>
                          </div>
                        </div>
                        {/* <Divider /> */}

                        {selectedDate && (
                          <>
                            <Spin spinning={loadingTime}>
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
                                          handleScroll1(
                                            "left",
                                            timeContainerRef
                                          )
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
                                              const hour = parseInt(
                                                timeParts[0],
                                                10
                                              );
                                              const minutes =
                                                timeParts.length > 1
                                                  ? Math.round(
                                                      parseFloat(
                                                        "0." + timeParts[1]
                                                      ) * 60
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

                                              const vietnamTimezone =
                                                "Asia/Ho_Chi_Minh";
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
                                                  key={index}
                                                  onClick={() =>
                                                    handleTimeSlotSelect(
                                                      slot?.timeSlot
                                                    )
                                                  }
                                                  className={
                                                    selectedTimeSlot ===
                                                    slot?.timeSlot
                                                      ? style.selected
                                                      : ""
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
                                          handleScroll1(
                                            "right",
                                            timeContainerRef
                                          )
                                        }
                                      >
                                        <RightOutlined />
                                      </button>
                                    </div>
                                  </>
                                ) : (
                                  <Title
                                    className={style["warning-title"]}
                                    level={4}
                                  >
                                    Salon không hoạt hộng hoặc không có nhân
                                    viên làm trong khoảng thời gian này!
                                  </Title>
                                )}
                              </div>
                              <Divider />
                            </Spin>
                          </>
                        )}
                        {additionalServices?.length > 0 && (
                          <div>
                            <Title level={4}>Thêm dịch vụ</Title>
                            <List
                              loading={loadingBook}
                              itemLayout="horizontal"
                              dataSource={additionalServices}
                              renderItem={(service) => {
                                const data =
                                  service?.bookingDetailResponses?.employees.find(
                                    (e) =>
                                      e?.id ===
                                      service?.bookingDetail?.salonEmployeeId
                                  ); // Define data if necessary

                                return (
                                  <List.Item
                                    actions={[
                                      <Button
                                        key="change"
                                        onClick={() =>
                                          handleChangeStaff(service)
                                        }
                                        disabled={statusChangeStaff}
                                      >
                                        Nhân viên
                                      </Button>,
                                      <Button
                                        key="close"
                                        type="text"
                                        icon={<CloseOutlined />}
                                        onClick={() =>
                                          handleRemoveService(service)
                                        }
                                        className={style["close-button-close"]}
                                        style={{
                                          // position: "absolute",
                                          top: -30,
                                          right: 0,
                                          color: "#000",
                                          zIndex: 1,
                                          transition: "transform 0.3s ease",
                                        }} // Customize color if necessary
                                      />,
                                    ]}
                                  >
                                    <List.Item.Meta
                                      avatar={
                                        <Avatar
                                          size={{
                                            xs: 24,
                                            sm: 32,
                                            md: 40,
                                            lg: 64,
                                            xl: 80,
                                            xxl: 100,
                                          }}
                                          src={service?.img}
                                        />
                                      }
                                      title={
                                        <span
                                          style={{
                                            fontSize: "1.7rem",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          {service.serviceName}
                                        </span>
                                      }
                                      description={
                                        <div style={{ display: "inline-grid" }}>
                                          <span>
                                            Tiền:{" "}
                                            {formatMoneyVND(service.price)} vnđ
                                          </span>
                                          <span>
                                            Thời gian dịch vụ:{" "}
                                            {formatTime(service.time)}
                                          </span>
                                          <span>
                                            Thời gian chờ:{" "}
                                            {formatTime(service.waitingTime)}
                                          </span>
                                          <span>
                                            Nhân viên:{" "}
                                            {data ? (
                                              <>
                                                {data?.fullName}
                                                {/* <Avatar
                                                    size={{
                                                      xs: 24,
                                                      sm: 32,
                                                      md: 40,
                                                      lg: 34,
                                                      xl: 40,
                                                      xxl: 40,
                                                    }}
                                                    src={data?.img}
                                                    style={{ marginRight: 8 }}
                                                  />
                                                  <div>
                                                    <div>{data?.fullName}</div>
                                                    <div
                                                      style={{
                                                        fontSize: "12px",
                                                        color: "#888",
                                                      }}
                                                    >
                                                      Bắt đầu:{" "}
                                                      {dayjs(
                                                        service
                                                          ?.bookingDetailResponses
                                                          ?.serviceHair
                                                          ?.startTime
                                                      ).format("HH:mm")}{" "}
                                                      - Kết thúc:{" "}
                                                      {dayjs(
                                                        service
                                                          ?.bookingDetailResponses
                                                          ?.serviceHair
                                                          ?.startTime
                                                      ).format("HH:mm")}
                                                    </div>
                                                  </div> */}
                                              </>
                                            ) : (
                                              <>
                                                <RandomIcon /> Ngẫu nhiên
                                              </>
                                            )}
                                          </span>
                                        </div>
                                      }
                                    />
                                    {currentService && (
                                      <Modal
                                        title="Chọn nhân viên"
                                        visible={isModalVisible}
                                        // onOk={handleModalOk}
                                        onCancel={handleCancel}
                                        footer={null}
                                      >
                                        <Select
                                          placeholder="Lựa chọn 1 nhân viên"
                                          style={{ width: "100%" }}
                                          // value={
                                          //   selectedStaff[currentService.id]
                                          // }
                                          // value={
                                          //   getSelectedEmployeeName(
                                          //     currentService.id
                                          //   ) || undefined
                                          // }
                                          value={
                                            additionalServices.some(service => 
                                              service.id !== currentService.id && 
                                              service.bookingDetail?.salonEmployeeId === getSelectedEmployeeName(currentService.id)
                                            )
                                              ? undefined // If already assigned elsewhere, show placeholder
                                              : getSelectedEmployeeName(currentService.id) || undefined
                                          }
                                          onChange={(value) => {
                                            if (value === "random") {
                                              handleChangeRandomEmployee();
                                            } else {
                                              handleChangeStaffSecond(
                                                currentService,
                                                value
                                              );
                                            }
                                          }}
                                        >
                                          <Option key="random" value="random">
                                            Ngẫu nhiên
                                          </Option>
                                          {currentService?.bookingDetailResponses?.employees?.map(
                                            (e) => (
                                              <Option
                                                key={e.id}
                                                value={e.id || e.fullName}
                                              >
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                  }}
                                                >
                                                  <Avatar
                                                    src={e.img}
                                                    alt={e.fullName}
                                                    style={{ marginRight: 8 }}
                                                  />
                                                  {e.fullName}
                                                </div>
                                              </Option>
                                            )
                                          )}
                                        </Select>
                                      </Modal>
                                    )}
                                  </List.Item>
                                );
                              }}
                            />
                          </div>
                        )}

                        <Button
                          type="dashed"
                          block
                          style={{ fontSize: "1rem" }}
                          // onClick={() => setShowServiceList(true)}
                          onClick={handleAddServiceClick}
                        >
                          Thêm dịch vụ khác
                        </Button>
                        <Button
                          type="dashed"
                          block
                          style={{
                            marginTop: "16px",
                            opacity: 0.5, // Phủ mờ nút
                            cursor: "not-allowed", // Không cho phép chọn
                          }}
                          onClick={handleDisplayVoucherList}
                          disabled
                        >
                          {displayVoucherList ? (
                            <Text>Đóng</Text>
                          ) : (
                            <Text>Thêm voucher</Text>
                          )}
                        </Button>
                        <p
                          style={{
                            marginTop: "8px",
                            color: "#888",
                            textAlign: "center",
                          }}
                        >
                          Sử dụng ứng dụng di động HairHub để có thêm nhiều ưu
                          đãi hấp dẫn
                        </p>
                        {displayVoucherList && (
                          <List
                            style={{ marginTop: "16px", background: "#ee22" }}
                            size="middle"
                            bordered
                            dataSource={voucherList}
                            renderItem={(item) => (
                              <List.Item
                                style={{ cursor: "pointer" }}
                                onClick={() => handleSelectedVoucher(item)}
                              >
                                {item.description}
                              </List.Item>
                            )}
                          />
                        )}
                        {/* Voucher added */}
                        {voucherSelected &&
                          voucherSelected?.map((e) => {
                            return (
                              <>
                                <Card
                                  title="Voucher đã chọn"
                                  style={{
                                    marginTop: "16px",
                                    backgroundColor: "#fafafa",
                                  }}
                                  bordered={true}
                                >
                                  <p>
                                    <Text strong>Mô tả:</Text> {e?.description}
                                  </p>
                                  <p>
                                    <Text strong>Giá tối thiểu:</Text>{" "}
                                    {formatCurrency(e?.minimumOrderAmount)}
                                  </p>
                                  <p>
                                    <Text strong>Phần trăm giảm:</Text>
                                    {formatDiscountPercentage(
                                      e?.discountPercentage
                                    )}
                                    %
                                  </p>
                                  <p>
                                    <Text strong>Ngày hết hạn:</Text>{" "}
                                    {formattedDateUi(e?.expiryDate)}
                                  </p>
                                  <Button
                                    type="primary"
                                    danger
                                    onClick={() => handleRemoveVoucher(e?.id)}
                                  >
                                    Xóa mã khuyến mãi
                                  </Button>
                                </Card>
                              </>
                            );
                          })}

                        <div style={{ marginTop: "16px" }}>
                          <Title level={4}>Tổng</Title>
                          <p style={{ fontSize: "2rem" }}>{calculateTotal()}</p>
                          <Button
                            style={{ backgroundColor: "#bf9456" }}
                            onClick={handleBooking}
                            type="primary"
                            block
                          >
                            Đặt lịch
                          </Button>
                        </div>
                      </div>
                    )}
                  </Modal>
                </Spin>
              </div>
              <div>
                <div className="our-work-section">
                  <h2 className="text-2xl font-bold mb-4">Ảnh</h2>
                  <div className="flex flex-wrap justify-center">
                    {salonImages?.items?.length > 0 &&
                      salonImages.items[0]?.salonImages?.length > 0 && (
                        <div className="w-full sm:w-1/2 flex justify-center">
                          <img
                            src={salonImages.items[0].salonImages[0].img}
                            alt="Main Work"
                            className="w-4/5 h-auto rounded-lg"
                          />
                        </div>
                      )}
                    <div className="w-full sm:w-1/2 grid grid-cols-2 gap-2 justify-center">
                      {salonImages?.items?.length > 1 ? (
                        salonImages.items.slice(1, 5).map((image, index) => (
                          <div key={index} className="flex justify-center">
                            {image?.salonImages?.length > 0 && (
                              <img
                                src={image.salonImages[0].img}
                                alt={`Work ${index + 1}`}
                                className="w-3/4 h-auto rounded-lg"
                              />
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="col-span-2 text-center mt-4">
                          <Empty />
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    block
                    onClick={() => setShowAllWork(true)}
                    className="mt-4"
                  >
                    Ảnh khách hàng
                  </Button>
                </div>

                <div>
                  <Modal
                    title="Ảnh khách hàng"
                    visible={showAllWork}
                    onCancel={() => setShowAllWork(false)}
                    footer={null}
                    width={500}
                  >
                    <Carousel arrows infinite={false}>
                      {salonImages?.items?.length > 0 &&
                        salonImages.items.map((image, index) => (
                          <div key={index}>
                            {image?.salonImages?.length > 0 && (
                              <img
                                src={image.salonImages[0].img}
                                alt={`Work ${index}`}
                                className="w-full h-auto"
                              />
                            )}
                          </div>
                        ))}
                    </Carousel>
                  </Modal>
                </div>
              </div>

              <div>
                <h2
                  style={{
                    display: "flex",
                    fontSize: "1.4rem",
                    fontWeight: "bold",
                    marginBottom: "1rem",
                    marginTop: "1rem",
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  ĐÁNH{" "}
                  <span
                    style={{
                      display: "inline-block",
                      color: "#BF9456",
                      marginLeft: "5px",
                    }}
                  >
                    GIÁ
                  </span>
                </h2>
              </div>
              <div className={style["rating-stats-container"]}>
                <div className={style["rating-summary"]}>
                  <h3 className={style["rating"]}>
                    <span>
                      {averageRating !== "NaN" ? (
                        <>{averageRating}</>
                      ) : (
                        <h3>0</h3>
                      )}
                    </span>
                    /5
                    {renderStars(parseFloat(averageRating))}
                  </h3>

                  <p>Dựa trên {listFeedback.length || 0} đánh giá</p>
                </div>
                <div className={style["divider-line"]}></div>
                <div className={style["rating-distribution"]}>
                  {[1, 2, 3, 4, 5].reverse().map((starValue) => (
                    <div
                      key={starValue}
                      className={style["rating-bar-container"]}
                    >
                      <span className={style["star-value"]}>
                        {starValue} <StarFilled style={{ color: "gold" }} />
                      </span>
                      <Progress
                        className={style["rating-progress-bar"]}
                        percent={
                          (ratingDistribution[starValue] / totalReviews) * 100
                        }
                        status="active"
                        showInfo={false}
                        strokeColor={{
                          "0%": "#FFD700", // Gradient or color variations
                          "100%": "#FFD700",
                        }}
                      />
                      <span className={style["review-count"]}>
                        {ratingDistribution[starValue]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className={style["review-fillter"]}>
                  <div
                    onClick={() => handleFilterChange(null)}
                    className={`${style["fillter-item"]} ${
                      filterRating === null ? style["fillter-item-active"] : ""
                    }`}
                  >
                    Tất cả
                  </div>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div
                      key={rating}
                      onClick={() => handleFilterChange(rating)}
                      className={`${style["fillter-item"]} ${
                        filterRating === rating
                          ? style["fillter-item-active"]
                          : ""
                      }`}
                    >
                      {rating} sao
                    </div>
                  ))}
                </div>

                <List
                  itemLayout="horizontal"
                  locale={{
                    emptyText: listFeedback
                      ? `Không có đánh giá ${listFeedback} sao nào`
                      : "Không có đánh giá nào",
                  }}
                  loading={loadingFeedback}
                  dataSource={listFeedback}
                  renderItem={(feedback) => (
                    <List.Item className={style.listItem}>
                      <List.Item.Meta
                        title={
                          <div>
                            <div className={style.infoContainer}>
                              <div className={style.infoUser}>
                                <Avatar
                                  src={feedback?.customer?.img}
                                  shape="square"
                                  size={"large"}
                                />
                                <div>
                                  <p>{feedback?.customer.fullName}</p>
                                  <p style={{ marginTop: "0" }}>
                                    {new Date(
                                      feedback?.createDate
                                    ).toLocaleDateString("vi-VI", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })}
                                    | Dịch vụ sử dụng:{" "}
                                    {feedback?.appointment?.appointmentDetails?.map(
                                      (e, index, array) => (
                                        <span key={index}>
                                          {e?.serviceName}
                                          {index < array.length - 1 ? ", " : ""}
                                        </span>
                                      )
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className={style.ratingFeedback}>
                              {renderStars(feedback?.rating)}
                            </div>
                            <p className={style.commentFeedback}>
                              {feedback.comment}
                            </p>
                            <div className={style["feedback-images"]}>
                              {feedback.fileFeedbacks?.map((e, index) => (
                                <img
                                  key={index}
                                  src={e.img}
                                  alt={`Feedback Image ${index}`}
                                  className={style["feedback-image"]}
                                />
                              ))}
                            </div>
                          </div>
                        }
                        description={
                          <div>
                            {/* <p>{feedback.comment}</p>
                              <p style={{ display: "flex" }}>
                                Service:
                                {feedback?.appointment?.appointmentDetails?.map(
                                  (e, index, array) => (
                                    <span key={index}>
                                      {e?.serviceName}
                                      {index < array.length - 1 ? " - " : ""}
                                    </span>
                                  )
                                )}
                              </p>
                              <div className={style["feedback-images"]}>
                                {feedback.fileFeedbacks?.map((e, index) => (
                                  <img
                                    key={index}
                                    src={e.img}
                                    alt={`Feedback Image ${index}`}
                                    className={style["feedback-image"]}
                                  />
                                ))}
                              </div> */}
                          </div>
                        }
                        className={style.listItemMeta}
                      />
                    </List.Item>
                  )}
                />

                <div className={style["rating"]}>
                  <Pagination
                    current={currentPage}
                    total={totalPagesFeedback}
                    pageSize={pageSize}
                    onChange={(page) => setCurrentPage(page)}
                    className="paginationAppointment"
                  />
                </div>
              </div>
            </Col>
            <Col xs={24} md={6}>
              <div
                style={{
                  padding: "10px",
                  background: "#E9E6D9",
                  // borderLeft: "3px solid black",
                  // borderRight: "3px solid black",
                  // borderBottom: "3px solid black",
                  // borderBottomLeftRadius: "8px",
                  // borderBottomRightRadius: "8px",
                }}
                className={style["detail-salon-col-2"]}
              >
                <Title level={2} className={style["info_title"]}>
                  Chi tiết cửa hàng
                </Title>

                {/* <div className={style["text-address"]}>
                  <div>
                    <Title level={5}>Địa chỉ</Title>
                    <Text style={{ fontWeight: "normal" }}>
                      {salonDetail.address}{" "}
                    </Text>
                  </div>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${salonDetail.latitude},${salonDetail.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={style["link-address"]}
                  >
                    Chỉ đường
                  </a>
                </div> */}
                <Divider />
                <div>
                  <Title level={5}>Thông tin</Title>
                  <Text>{salonDetail.description}</Text>
                  <Divider />
                </div>
                <div>
                  {/* <Title level={4}>Nhân viên</Title> */}
                  <Spin spinning={loadingEmployee}>
                    <AnimatedList items={employees} />
                    {/* <List
                      dataSource={employees}
                      renderItem={(employee) => (
                        <List.Item key={employee.id}>
                          <List.Item.Meta
                            avatar={<Avatar src={employee?.img} />}
                            title={<Text>{employee?.fullName}</Text>}
                          />
                        </List.Item>
                      )}
                    /> */}
                    {/* <DragCards data={employees} /> */}
                    {/* <HoverImageLinks
                      employees={employees}
                    /> */}
                  </Spin>

                  <Pagination
                    style={{ textAlign: "center" }}
                    current={page}
                    pageSize={pageSizeEmployee}
                    total={total}
                    onChange={handlePageChangeEmployees}
                    className="paginationAppointment"
                  />
                  <Divider />
                </div>

                <div>
                  <Title level={4}>Liên hệ</Title>
                  <Row justify="space-between" align="middle">
                    <Col>
                      <Text>
                        <PhoneOutlined /> {salonDetail?.salonOwner?.phone}
                      </Text>
                    </Col>
                  </Row>
                  <Divider />
                </div>

                <div>
                  <Title level={4}>Thời gian làm việc</Title>
                  {sortedSchedules?.map((e) => {
                    return (
                      <Row
                        justify="space-between"
                        key={e?.dayOfWeek}
                        style={{ width: "100%" }}
                      >
                        <Text strong style={{ marginRight: 8 }}>
                          {daysOfWeek[e?.dayOfWeek]}:&nbsp;{" "}
                        </Text>
                        <Text style={{ textAlign: "right" }}>
                          {e?.startTime?.slice(0, 5) === "00:00" &&
                          e?.endTime?.slice(0, 5) === "00:00"
                            ? "Không hoạt động"
                            : `${e?.startTime?.slice(
                                0,
                                5
                              )} AM - ${e?.endTime?.slice(0, 5)} PM`}
                        </Text>
                      </Row>
                    );
                  })}
                  <Divider />
                </div>

                <Modal
                  wrapClassName="my-custom-modal"
                  title={
                    <Title
                      level={3}
                      style={{
                        textAlign: "center",
                        fontSize: "2rem",
                        backgroundColor: "#ece8de",
                      }}
                    >
                      Xác nhận cuộc hẹn
                    </Title>
                  }
                  visible={isPriceModalVisible}
                  onOk={handleConfirmBooking}
                  onCancel={() => setIsPriceModalVisible(false)}
                  okText="Xác nhận"
                  cancelText="Hủy"
                  okButtonProps={{
                    style: {
                      backgroundColor: "#bf9456",
                      borderColor: "#bf9456",
                    },
                  }}
                  cancelButtonProps={{
                    style: {
                      color: "#878787",
                    },
                  }}
                  width={800} // Set modal width to be wider
                  style={{ backgroundColor: "#f4f2eb" }} // Set modal background color
                >
                  {/* Section for Services */}
                  {additionalServices?.map((service, index) => {
                    const startTime =
                      service?.bookingDetailResponses?.serviceHair?.startTime;
                    const endTime =
                      service?.bookingDetailResponses?.serviceHair?.endTime;
                    const formattedStartTime = dayjs(startTime).format("HH:mm");
                    const formattedEndTime = dayjs(endTime).format("HH:mm");
                    const totalTime = dayjs
                      .duration(dayjs(endTime).diff(dayjs(startTime)))
                      .asMinutes();
                    const employee =
                      service?.bookingDetailResponses?.employees.find(
                        (emp) =>
                          emp.id === service?.bookingDetail?.salonEmployeeId
                      );

                    return (
                      <Card
                        key={service.id}
                        style={{
                          marginBottom: "20px",
                          borderRadius: "8px",
                          padding: "20px",
                          backgroundColor: "#ece8de",
                        }}
                      >
                        <Row gutter={16} align="middle">
                          {/* Service Info */}
                          <Col span={12}>
                            <Title level={4}>{service?.serviceName}</Title>
                            <Text strong>
                              Thời gian: {formattedStartTime} -{" "}
                              {formattedEndTime}
                            </Text>
                            <br />
                            <Text strong>Tổng thời gian: {totalTime} phút</Text>
                          </Col>

                          {/* Employee Info */}
                          <Col span={12} style={{ textAlign: "right" }}>
                            {employee ? (
                              <>
                                <Avatar
                                  src={employee.img}
                                  size="large"
                                  style={{ marginRight: 10 }}
                                />
                                <Text strong>
                                  Nhân viên: {employee.fullName}
                                </Text>
                              </>
                            ) : (
                              <>
                                <Avatar
                                  icon={<RandomIcon />}
                                  size="large"
                                  style={{ marginRight: 10 }}
                                />
                                <Text strong>Nhân viên: Ngẫu nhiên</Text>
                              </>
                            )}
                          </Col>
                        </Row>

                        {/* Service Image */}
                        {service?.img && (
                          <Row justify="center" style={{ marginTop: "10px" }}>
                            {" "}
                            {/* Center the image */}
                            <Col>
                              <Image
                                src={service?.img}
                                width={200}
                                style={{ borderRadius: "8px" }}
                              />
                            </Col>
                          </Row>
                        )}
                      </Card>
                    );
                  })}

                  {/* Price Section */}
                  <Divider />
                  <Row
                    gutter={16}
                    justify="space-between"
                    style={{ marginTop: "20px" }}
                  >
                    <Col span={8}>
                      <Text strong style={{ fontSize: "1.2rem" }}>
                        Giá gốc:
                      </Text>
                    </Col>
                    <Col span={16} style={{ textAlign: "right" }}>
                      <Text style={{ fontSize: "1.2rem" }}>
                        {formatCurrency(originalPrice)}
                      </Text>
                    </Col>
                  </Row>
                  <Row
                    gutter={16}
                    justify="space-between"
                    style={{ marginTop: "10px" }}
                  >
                    <Col span={8}>
                      <Text strong style={{ fontSize: "1.2rem" }}>
                        Giá đã giảm:
                      </Text>
                    </Col>
                    <Col span={16} style={{ textAlign: "right" }}>
                      <Text style={{ fontSize: "1.2rem" }}>
                        {formatCurrency(discountedPrice)}
                      </Text>
                    </Col>
                  </Row>
                  <Row
                    gutter={16}
                    justify="space-between"
                    style={{ marginTop: "10px" }}
                  >
                    <Col span={8}>
                      <Text strong style={{ fontSize: "1.2rem" }}>
                        Giá tổng:
                      </Text>
                    </Col>
                    <Col span={16} style={{ textAlign: "right" }}>
                      <Text strong style={{ fontSize: "1.2rem" }}>
                        {formatCurrency(totalPrice)}
                      </Text>
                    </Col>
                  </Row>
                </Modal>
              </div>
            </Col>
          </Row>
        </Content>
      </Layout>
      {isLoading && (
        <div className="overlay">
          <Loader />
        </div>
      )}
    </div>
  );
}

export default SalonDetail;
