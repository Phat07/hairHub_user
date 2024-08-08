import {
  CloseOutlined,
  HeartOutlined,
  LeftOutlined,
  RightOutlined,
  ShareAltOutlined,
  StarFilled,
  StarOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Carousel,
  Checkbox,
  Col,
  Collapse,
  Divider,
  Image,
  Layout,
  List,
  Modal,
  Pagination,
  Progress,
  Row,
  Select,
  Space,
  Spin,
  Typography,
  message,
} from "antd";
import { Content } from "antd/es/layout/layout";
import axios from "axios";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import "../css/salonDetail.css";
import { ServiceHairServices } from "../services/servicesHairServices";

import RandomIcon from "@rsuite/icons/Random";
import timezone from "dayjs/plugin/timezone";
import duration from "dayjs/plugin/duration";
import utc from "dayjs/plugin/utc";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import { AppointmentService } from "../services/appointmentServices";
import { SalonEmployeesServices } from "../services/salonEmployeesServices";
import { actGetVoucherBySalonIdNotPaging } from "../store/manageVoucher/action";
import { actGetAllFeedbackBySalonId } from "../store/ratingCutomer/action";
import { actGetAllSalonInformation } from "../store/salonInformation/action";
import { set } from "rsuite/esm/internals/utils/date";
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
function renderStars(stars) {
  const filledStars = Math.floor(stars);
  const hasHalfStar = stars % 1 !== 0;

  const starIcons = [];

  for (let i = 0; i < filledStars; i++) {
    starIcons.push(<StarFilled key={i} style={{ color: "#FFD700" }} />);
  }

  if (hasHalfStar) {
    starIcons.push(
      <StarOutlined key={filledStars} style={{ color: "#FFD700" }} />
    );
  }

  const remainingStars = 5 - filledStars - (hasHalfStar ? 1 : 0);

  for (let i = 0; i < remainingStars; i++) {
    starIcons.push(<StarOutlined key={filledStars + i + 1} />);
  }

  return starIcons;
}

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

  const [isPriceModalVisible, setIsPriceModalVisible] = useState(false);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [appointmentData, setAppointmentData] = useState(null);

  const [statusChangeStaff, setStatusChangeStaff] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const listVoucherNotPaging = useSelector(
    (state) => state.SALONVOUCHERS.getVoucherBySalonIdNotPaging
  );
  const listFeedback = useSelector(
    (state) => state.RATING.getAllFeedbackbySalonId
  );

  const totalPagesFeedback = useSelector((state) => state.RATING.totalPages);

  useEffect(() => {
    if (id) {
      dispatch(actGetAllFeedbackBySalonId(id, currentPage, pageSize));
      dispatch(actGetAllSalonInformation());
      const fetchEmployees = async () => {
        // setLoading(true);

        await SalonEmployeesServices.getSalonEmployeeBySalonInformationId(
          id,
          page,
          pageSizeEmployee
        )
          .then((response) => {
            console.log("response.data.items", response.data.items);

            setEmployees(response.data.items);
            setTotal(response.data.totalPages);
          })
          .catch((err) => {});

        // setLoading(false);
      };

      fetchEmployees();
    }
  }, [id, currentPage, page]);

  useEffect(() => {
    setListVoucher(listVoucherNotPaging);
  }, [listVoucherNotPaging]);
  const SALONDETAIL_URL =
    "https://hairhub.gahonghac.net/api/v1/saloninformations/GetSalonInformationById/";

  const handleScroll = (direction, containerRef) => {
    const maxScroll =
      containerRef.current.scrollWidth - containerRef.current.clientWidth;
    const scrollAmount = containerRef.current.clientWidth / 2;

    if (direction === "left" && scrollIndex > 0) {
      setScrollIndex(scrollIndex - 1);
      containerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    } else if (
      direction === "right" &&
      containerRef.current.scrollLeft < maxScroll
    ) {
      setScrollIndex(scrollIndex + 1);
      containerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };
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
    dispatch(actGetVoucherBySalonIdNotPaging(id));
  }, []);

  useEffect(() => {
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
      });

    AppointmentService.calculatePrice(calculateAppointmentData)
      .then((res) => {
        const { originalPrice, totalPrice, discountedPrice } = res.data;
        const getEmployeeServiceId = dataBooking.map(
          ({ serviceHairId }) => serviceHairId
        );
        const getEmployeeId = dataBooking.map(({ employeeId }) => employeeId);
        const appointmentFormData = {
          customerId: userId,
          startDate: currentDate,
          totalPrice: totalPrice,
          originalPrice: originalPrice,
          discountedPrice: discountedPrice,
          appointmentDetails: [
            {
              salonEmployeeId: getEmployeeId,
              serviceHairId: getEmployeeServiceId,
              description: "string",
              endTime: "2024-06-23T04:34:56.026Z",
              startTime: "2024-06-23T04:34:56.026Z",
            },
          ],
          voucherIds: ["3fa85f64-5717-4562-b3fc-2c963f66afa6"],
        };
      })
      .catch((err) => setError(err));
    // fetchData();
  }, [id, voucherSelected, additionalServices, calculateAppointmentData]);

  const dateContainerRef = useRef(null);
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
    if (userId) {
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
        const response = await axios
          .post(
            "https://hairhub.gahonghac.net/api/v1/appointments/GetAvailableTime",
            postData
          )
          .then((res) => {
            setTimeSlots(res?.data);
          })
          .catch((err) => {
            console.log("err", err);
          });
      } catch (error) {
        console.error("Error posting data:", error);
      }
    }
    setOneServiceData(service);
    const isServiceAlreadySelected = additionalServices.some(
      (s) => s?.id === service?.id
    );

    if (isServiceAlreadySelected) {
      // Hiển thị thông báo nếu dịch vụ đã được chọn
      setIsBookingModalVisible(true);
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
    // setVoucherSelected((prevVouchers) => {
    //   // Check if the voucher already exists
    //   const exists = prevVouchers.find((e) => e?.id === voucher?.id);

    //   // If it doesn't exist, add it to the array
    //   if (!exists) {
    //     return [...prevVouchers, voucher];
    //   } else {
    //     message.warning("Mã khuyến mãi này đã được sử đụng");
    //   }

    //   // If it exists, return the original array
    //   return prevVouchers;
    // });
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
    // setSelectedDate(day);
    const postData = {
      day: formattedDate, // Chuyển đổi date thành ISO string
      salonId: id,
      serviceHairId: idSer,
      salonEmployeeId: null,
      isAnyOne: true,
    };
    setSelectedTimeSlot(null);

    try {
      const response = await axios
        .post(
          "https://hairhub.gahonghac.net/api/v1/appointments/GetAvailableTime",
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
          //   tui muốn kiểm tra xem thời gian chọn là selectedTimeSlot nằm trong khoảng của res?.data.availableTimes.map((e)=>e.timeSlot xem selectedTimeSlot có nhỏ hơn hay vượt quá không nếu có thì setSelectedTimeSlot lại null)
        })
        .catch((err) => {
          setSelectedDate(null);
          setSelectedDate(null);
          // setSelectedTimeSlot(null)
          message.warning(err?.response?.data?.message);
        });
      const dataMapping = [...additionalServices];
      const databooking = await dataMapping?.map((e) => {
        return {
          serviceHairId: e?.id,
          isAnyOne: true,
          salonEmployeeId: e?.bookingDetail?.salonEmployeeId || null,
        };
      });
      const formattedDate = formatDate(selectedDate);
      const requestBody = {
        day: formattedDate, // Thay bằng ngày bạn muốn book
        availableSlot: selectedTimeSlot, // Thay bằng slot bạn muốn book
        salonId: id, // Thay bằng id của salon
        bookingDetail: databooking,
      };
      setDataBooking(requestBody); //serviceHairId, salonEmployeeId
      axios
        .post(
          "https://hairhub.gahonghac.net/api/v1/appointments/BookAppointment",
          requestBody
        )
        .then((response) => {
          // Xử lý kết quả từ server nếu cần
          // const updatedAdditionalServices = [...additionalServices];

          // for (const service of additionalServices) {
          //   const matchingBookingDetailResponse =
          //     response.data.bookingDetailResponses.find(
          //       (responseDetail) =>
          //         responseDetail?.serviceHair?.id === service.id
          //     );

          //   if (matchingBookingDetailResponse) {
          //     service.bookingDetailResponses = matchingBookingDetailResponse;
          //   }
          // }

          // setStatusChangeStaff(false);
          // setAdditionalServices(updatedAdditionalServices);
          // updatedAdditionalServices((prevServices) =>
          //   prevServices.map((s) => ({
          //     ...s,
          //     bookingDetail: { ...s.bookingDetail, salonEmployeeId: null },
          //   }))
          // );
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
          console.error("Error booking appointment:", error);
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
      availableSlot: slot, // Thay bằng slot bạn muốn book
      salonId: id, // Thay bằng id của salon
      bookingDetail: databooking,
    };

    axios
      .post(
        "https://hairhub.gahonghac.net/api/v1/appointments/BookAppointment",
        requestBody
      )
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

  const handleChangeStaffSecond = (service, value) => {
    setAdditionalServices((prevServices) =>
      prevServices.map((s) =>
        s.id === service.id
          ? {
              ...s,
              bookingDetail: {
                ...s.bookingDetail,
                salonEmployeeId: value,
              },
            }
          : s
      )
    );
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentService(null);
  };
  console.log("add", additionalServices);

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
        availableSlot: selectedTimeSlot, // Thay bằng slot bạn muốn book
        salonId: id, // Thay bằng id của salon
        bookingDetail: databooking,
      };
      setDataBooking(databooking); //serviceHairId, salonEmployeeId

      axios
        .post(
          "https://hairhub.gahonghac.net/api/v1/appointments/BookAppointment",
          requestBody
        )
        .then((response) => {
          console.log("bookRES", response.data);

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
          setShowServiceList(false);
          message.warning(error?.response?.data?.message);
          setLoading(true);
          // Xử lý lỗi nếu có
          // console.error("Error booking appointment:", error);
          // Hiển thị thông báo lỗi cho người dùng nếu cần
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

  const showReportModal = () => {
    setIsReportModalVisible(true);
  };

  const handleReport = () => {
    setIsReportModalVisible(false);
  };

  const onChangeCheckbox = (checkedValues) => {
    setSelectedReports(checkedValues);
  };

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

  const handleModalOk = () => {
    setAdditionalServices((prevServices) =>
      prevServices.map((s) =>
        s.id === currentService.id
          ? {
              ...s,
              bookingDetail: {
                serviceHairId: currentService.id,
                isAnyOne: true,
                salonEmployeeId: s?.bookingDetail?.salonEmployeeId,
              },
            }
          : s
      )
    );
    setIsModalVisible(false);
    setCurrentService(null);
  };
  const getSelectedEmployeeName = (serviceId) => {
    const selectedService = additionalServices.find((s) => s.id === serviceId);
    const selectedEmployeeId = selectedService?.bookingDetail?.salonEmployeeId;
    const employee = currentService?.bookingDetailResponses?.employees.find(
      (e) => e.id === selectedEmployeeId
    );
    return employee?.fullName;
  };

  const handleChangeStaff = (service) => {
    if (!selectedTimeSlot) {
      message.warning("Vui lòng chọn thời gian cắt tóc");
    } else {
      setCurrentService(service);
      setIsModalVisible(true);
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
    if (minutes > 0) {
      timeString += `${minutes} phút`;
    }

    return timeString.trim();
  };

  const handleChangeSelectedService = async () => {
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Thêm số 0 vào trước tháng nếu cần
      const day = String(date.getDate()).padStart(2, "0"); // Thêm số 0 vào trước ngày nếu cần
      return `${year}-${month}-${day}`;
    };
    const dataMapping = [...additionalServices];
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
      availableSlot: selectedTimeSlot, // Thay bằng slot bạn muốn book
      salonId: id, // Thay bằng id của salon
      bookingDetail: databooking,
    };
    setDataBooking(databooking); //serviceHairId, salonEmployeeId

    axios
      .post(
        "https://hairhub.gahonghac.net/api/v1/appointments/BookAppointment",
        requestBody
      )
      .then((response) => {
        // Xử lý kết quả từ server nếu cần
        const updatedAdditionalServices = [...additionalServices];
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

        for (const service of additionalServices) {
          const matchingBookingDetailResponse =
            response.data.bookingDetailResponses.find(
              (responseDetail) => responseDetail?.serviceHair?.id === service.id
            );

          if (matchingBookingDetailResponse) {
            service.bookingDetailResponses = matchingBookingDetailResponse;
          }
        }

        setAdditionalServices(updatedAdditionalServices);
        setShowServiceList(false);

        // Cập nhật state hoặc hiển thị thông báo thành công
      })
      .catch((error) => {
        message.warning(error?.response?.data?.message);
        // Xử lý lỗi nếu có
        // console.error("Error booking appointment:", error);
        // Hiển thị thông báo lỗi cho người dùng nếu cần
      });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND", // Replace 'USD' with your desired currency code
      // minimumFractionDigits: 5, // Adjust decimal places as needed
    }).format(value);
  };
  const formatDiscountPercentage = (value) => {
    return value * 100;
  };

  const handleBooking = async () => {
    if (additionalServices.length === 0) {
      message.info("Vui lòng chọn dịch vụ!!");
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

    try {
      const res = await AppointmentService.calculatePrice(appointmentFormData);
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
    } catch (err) {
      setError(err);
    }
  };

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
      const res = await AppointmentService.createAppointment(appointmentData)
        .then((res) => {
          setIsLoading(false);
          message.success("Tạo lịch cắt tóc thành công");
          setAdditionalServices([]);
          setVoucherSelected([]);
        })
        .catch((err) => {
          message.error(err.response.data.message);
          console.log(err);
        })
        .finally((e) => {
          setIsLoading(false);
        });
    } catch (err) {
      message.warning("Tạo lịch không thành công");
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
  return (
    <div>
      <Header />
      <div
        style={{
          marginTop: "10rem",
        }}
      ></div>
      <div>
        <Layout>
          <Content className="container">
            <Row gutter={16}>
              <Col
                xs={24}
                md={10}
                style={{ marginBottom: "16px" }}
                className="detail-salon-col-1"
              >
                <div>
                  {/* <div className="rating-overlay">
                    <div className="rating-score">
                      {averageRating !== "NaN" ? <>{averageRating}</> : <>0</>}
                    </div>
                    <div>Dựa trên {listFeedback.length} đánh giá</div>
                  </div> */}
                  <div>
                    <Carousel autoplay>
                      <img
                        src={salonDetail.img}
                        alt={salonDetail?.id}
                        className="carousel-image"
                      />
                      {/* </div>
                      ))} */}
                    </Carousel>
                  </div>
                </div>
                <div className="space-between">
                  <h2
                    style={{
                      fontSize: "2rem",
                      fontWeight: "bold",
                      margin: 0,
                    }}
                  >
                    {salonDetail?.name}
                  </h2>
                  <Space>
                    <Button
                      type="text"
                      icon={<ShareAltOutlined style={{ fontSize: "1.5rem" }} />}
                    />
                    <Button
                      type="text"
                      icon={<HeartOutlined style={{ fontSize: "1.5rem" }} />}
                    />
                  </Space>
                </div>
                <div>
                  <Collapse
                    bordered={false}
                    defaultActiveKey={["1"]}
                    expandIconPosition="end"
                    className="custom-collapse"
                    style={{
                      marginTop: "16px",
                      backgroundColor: "transparent",
                    }}
                  >
                    <Panel
                      header={
                        <span
                          style={{ fontSize: "1.8rem", fontWeight: "bold" }}
                        >
                          Dịch vụ
                        </span>
                      }
                      key="1"
                    >
                      <List
                        itemLayout="horizontal"
                        // dataSource={services}
                        dataSource={data}
                        renderItem={(service) => (
                          <List.Item
                            actions={[
                              <Button
                                type="primary"
                                key="book"
                                onClick={() => handleBookClick(service)}
                              >
                                Đặt lịch
                              </Button>,
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
                                    xl: 50,
                                    xxl: 50,
                                  }}
                                  src={service?.img}
                                />
                              }
                              title={
                                <span
                                  style={{
                                    fontSize: "1.3rem",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => setIsBookingModalVisible(true)}
                                >
                                  {service?.serviceName}
                                </span>
                              }
                              description={`${
                                service?.price
                              } vnđ • ${formatTime(service?.time)}`}
                              // description={`${service?.price} vnđ • ${service?.time}`}
                            />
                          </List.Item>
                        )}
                        style={{ backgroundColor: "transparent" }}
                      />
                    </Panel>
                  </Collapse>
                </div>
                <div>
                  <Spin spinning={loading}>
                    <Modal
                      title="Đặt dịch vụ"
                      visible={isBookingModalVisible}
                      className={showServiceList ? "no-close-btn" : ""}
                      onCancel={() => setIsBookingModalVisible(false)}
                      footer={null}
                      width={800}
                    >
                      {showServiceList ? (
                        <>
                          <Spin spinning={loading}>
                            <div>
                              <Title level={4}>Thêm những dịch vụ khác</Title>
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
                                        // <Checkbox
                                        //   className="custom-checkbox"
                                        //   key={`checkbox-${index}`} // Thêm thuộc tính key cho Checkbox
                                        //   checked={isChecked}
                                        //   onChange={() =>
                                        //     handleServiceSelect(service)
                                        //   }
                                        // >
                                        //   Book
                                        // </Checkbox>,
                                        <div
                                          className={`custom-checkbox ${
                                            isChecked ? "booked" : ""
                                          }`}
                                          s
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
                                              Mô tả: &nbsp;
                                              <Text
                                                style={{ display: "inline" }}
                                              >
                                                {service.description}
                                              </Text>
                                            </Text>
                                            <Text strong>
                                              Giá: &nbsp;
                                              <Text
                                                style={{ display: "inline" }}
                                              >
                                                {formatCurrency(service.price)}
                                              </Text>
                                            </Text>
                                            <Text strong>
                                              Thời gian: &nbsp;
                                              <Text
                                                style={{ display: "inline" }}
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
                                // onClick={() => setShowServiceList(false)}
                                // onClick={handleChangeSelectedService}
                                onClick={() => {
                                  setShowServiceList(false);
                                }}
                              >
                                Trở về
                              </Button>
                            </div>
                          </Spin>
                        </>
                      ) : (
                        <div>
                          <Divider />
                          <div className="scroll-container">
                            <button
                              className="arrow-button"
                              onClick={() =>
                                handleScroll("left", dateContainerRef)
                              }
                            >
                              <LeftOutlined />
                            </button>
                            <div
                              className="scroll-wrapper"
                              ref={dateContainerRef}
                            >
                              <div className="scroll-content">
                                {currentMonthDays.map((day, index) => (
                                  <Button
                                    key={index}
                                    onClick={() => handleDateSelect(day)}
                                    className={
                                      selectedDate &&
                                      selectedDate.toDateString() ===
                                        day.toDateString()
                                        ? "selected"
                                        : ""
                                    }
                                  >
                                    {day.toDateString().slice(0, 10)}
                                  </Button>
                                ))}
                              </div>
                            </div>
                            <button
                              className="arrow-button"
                              onClick={() =>
                                handleScroll("right", dateContainerRef)
                              }
                            >
                              <RightOutlined />
                            </button>
                          </div>
                          <Divider />

                          {selectedDate && (
                            <>
                              <div className="time-picker">
                                {timeSlots?.availableTimes?.length > 0 ? (
                                  <>
                                    <Divider />
                                    <div className="scroll-container">
                                      <button
                                        className="arrow-button"
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
                                        className="scroll-wrapper"
                                        ref={timeContainerRef}
                                      >
                                        <div className="scroll-content">
                                          {timeSlots?.availableTimes?.map(
                                            (slot, index) => {
                                              // Tạo biến timeString để lưu chuỗi thời gian hiển thị
                                              let timeString = "";
                                              const timeParts = slot?.timeSlot
                                                ?.toString()
                                                .split(".");
                                              const hour = parseInt(
                                                timeParts[0],
                                                10
                                              );
                                              const minutes =
                                                timeParts.length > 1
                                                  ? parseInt(timeParts[1], 10)
                                                  : 0;
                                              // Xử lý hiển thị theo định dạng giờ và phút
                                              if (minutes === 0) {
                                                timeString = `${hour} giờ`;
                                              } else if (minutes === 25) {
                                                timeString = `${hour} giờ 15 phút`;
                                              } else if (minutes === 5) {
                                                timeString = `${hour} giờ 30 phút`;
                                              } else if (minutes === 75) {
                                                timeString = `${hour} giờ 45 phút`;
                                              }
                                              const currentTime = new Date();
                                              const slotTime = dayjs()
                                                .hour(hour)
                                                .minute(minutes);

                                              const isDisabled =
                                                selectedDate &&
                                                dayjs(selectedDate).isSame(
                                                  dayjs(),
                                                  "day"
                                                ) &&
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
                                                      ? "selected"
                                                      : ""
                                                  }
                                                  disabled={isDisabled}
                                                >
                                                  {timeString}
                                                </Button>
                                              );
                                            }
                                          )}
                                          {/* {timeSlots?.availableTimes?.map(
                                          (slot, index) => {
                                            // Tạo biến timeString để lưu chuỗi thời gian hiển thị
                                            let timeString = "";
                                            const timeParts = slot?.timeSlot
                                              ?.toString()
                                              .split(".");
                                            const hour = parseInt(
                                              timeParts[0],
                                              10
                                            );
                                            const minutes =
                                              timeParts.length > 1
                                                ? parseInt(timeParts[1], 10) *
                                                  15
                                                : 0; // Chuyển đổi phút từ phần thập phân

                                            // Xử lý hiển thị theo định dạng giờ và phút
                                            if (minutes === 0) {
                                              timeString = `${hour} giờ`;
                                            } else if (minutes === 15) {
                                              timeString = `${hour} giờ 15 phút`;
                                            } else if (minutes === 30) {
                                              timeString = `${hour} giờ 30 phút`;
                                            } else if (minutes === 45) {
                                              timeString = `${hour} giờ 45 phút`;
                                            }

                                            // Thời gian hiện tại theo múi giờ Việt Nam
                                            const currentTime =
                                              dayjs().tz("Asia/Ho_Chi_Minh");
                                            // Thời gian slot theo múi giờ Việt Nam
                                            const slotTime = dayjs()
                                              .tz("Asia/Ho_Chi_Minh")
                                              .hour(hour)
                                              .minute(minutes);

                                            // Định dạng thời gian slot
                                            const formattedSlotTime =
                                              slotTime.format("HH:mm");
                                            console.log(
                                              "slotTime:",
                                              formattedSlotTime
                                            );

                                            // Xác định xem thời gian slot có bị disable hay không
                                            const isDisabled =
                                              selectedDate &&
                                              dayjs(selectedDate).isSame(
                                                dayjs(),
                                                "day"
                                              ) &&
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
                                                    ? "selected"
                                                    : ""
                                                }
                                                disabled={isDisabled}
                                              >
                                                {timeString}
                                              </Button>
                                            );
                                          }
                                        )} */}
                                        </div>
                                      </div>
                                      <button
                                        className="arrow-button"
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
                                  <Title className="warning-title" level={3}>
                                    Không tìm thấy dịch vụ nào trong khoảng thời
                                    gian này!
                                  </Title>
                                )}
                              </div>
                              <Divider />
                            </>
                          )}
                          {additionalServices?.length > 0 && (
                            <div>
                              <Title level={4}>Thêm dịch vụ</Title>
                              <List
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
                                          className="close-button-close"
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
                                        title={service.serviceName}
                                        description={
                                          <>
                                            {`${
                                              service.price
                                            } vnđ • ${formatTime(
                                              service.time
                                            )}`}
                                            <br />
                                            <span>
                                              Nhân viên:{" "}
                                              {data ? (
                                                <>
                                                  <Avatar
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
                                                  {data?.fullName}
                                                </>
                                              ) : (
                                                <>
                                                  <RandomIcon /> Ngẫu nhiên
                                                </>
                                              )}
                                            </span>
                                          </>
                                        }
                                      />
                                      {currentService && (
                                        <Modal
                                          title="Chọn nhân viên"
                                          visible={isModalVisible}
                                          onOk={handleModalOk}
                                          onCancel={handleCancel}
                                        >
                                          <Select
                                            placeholder="Lựa chọn 1 nhân viên"
                                            style={{ width: "100%" }}
                                            // value={
                                            //   selectedStaff[currentService.id]
                                            // }
                                            value={
                                              getSelectedEmployeeName(
                                                currentService.id
                                              ) || undefined
                                            }
                                            onChange={(value) =>
                                              handleChangeStaffSecond(
                                                currentService,
                                                value
                                              )
                                            }
                                          >
                                            {currentService?.bookingDetailResponses?.employees?.map(
                                              (e) => (
                                                <Option
                                                  key={e.id}
                                                  value={e.id || e.fullName}
                                                >
                                                  {e.fullName}
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
                            style={{ marginTop: "16px" }}
                            // onClick={() => setShowServiceList(true)}
                            onClick={handleAddServiceClick}
                          >
                            Thêm dịch vụ khác
                          </Button>
                          <Button
                            type="dashed"
                            block
                            style={{ marginTop: "16px" }}
                            onClick={handleDisplayVoucherList}
                          >
                            {displayVoucherList ? (
                              <Text>Đóng</Text>
                            ) : (
                              <Text>Thêm voucher</Text>
                            )}
                          </Button>
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
                                      <Text strong>Mô tả:</Text>{" "}
                                      {e?.description}
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
                            <p>{calculateTotal()}</p>
                            <Button
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
                {/* <div>
                  <div className="our-work-section">
                    <h2
                      style={{
                        fontSize: "1.8rem",
                        fontWeight: "bold",
                        marginBottom: "1rem",
                      }}
                    >
                      See Our Work
                    </h2>
                    <Row gutter={16}>
                      <Col xs={24} sm={12}>
                        <img
                          src={ourWorkImages[0]}
                          alt="Main Work"
                          style={{
                            width: "100%",
                            height: "auto",
                            borderRadius: "8px",
                          }}
                        />
                      </Col>
                      <Col xs={24} sm={12}>
                        <Row gutter={[8, 8]}>
                          {ourWorkImages.slice(1, 5).map((image, index) => (
                            <Col key={index} span={12}>
                              <img
                                src={image}
                                alt={`Work ${index + 1}`}
                                style={{
                                  width: "100%",
                                  height: "auto",
                                  borderRadius: "8px",
                                }}
                              />
                            </Col>
                          ))}
                        </Row>
                      </Col>
                    </Row>
                    <Button
                      block
                      onClick={() => setShowAllWork(true)}
                      style={{ marginTop: "16px" }}
                    >
                      SEE ALL WORK
                    </Button>
                  </div>

                  <div>
                    <Modal
                      title="All Our Work"
                      visible={showAllWork}
                      onCancel={() => setShowAllWork(false)}
                      footer={null}
                      width={800}
                    >
                      <Carousel arrows infinite={false}>
                        {ourWorkImages.map((image, index) => (
                          <div key={index}>
                            <img
                              src={image}
                              alt={`Work ${index}`}
                              style={{ width: "100%", height: "auto" }}
                            />
                          </div>
                        ))}
                      </Carousel>
                    </Modal>
                  </div>
                </div> */}
                <div>
                  <h2
                    style={{
                      fontSize: "1.8rem",
                      fontWeight: "bold",
                      marginBottom: "1rem",
                      marginTop: "1rem",
                    }}
                  >
                    Đánh giá
                  </h2>
                </div>
                <div className="rating-stats-container">
                  <div className="rating-summary">
                    <h3 className="rating">
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
                  <div className="divider-line"></div>
                  <div className="rating-distribution">
                    {[1, 2, 3, 4, 5].reverse().map((starValue) => (
                      <div key={starValue} className="rating-bar-container">
                        <span className="star-value">
                          {starValue} <StarFilled style={{ color: "gold" }} />
                        </span>
                        <Progress
                          className="rating-progress-bar"
                          percent={
                            (ratingDistribution[starValue] / totalReviews) * 100
                          }
                          status="active"
                          showInfo={false}
                        />
                        <span className="review-count">
                          {ratingDistribution[starValue]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <List
                    itemLayout="horizontal"
                    dataSource={listFeedback}
                    renderItem={(feedback) => (
                      <List.Item>
                        <List.Item.Meta
                          title={
                            <div>
                              <div>{renderStars(feedback?.rating)}</div>
                              <p>
                                {feedback?.customer.fullName} •{" "}
                                {new Date(
                                  feedback?.createDate
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                          }
                          description={
                            <div>
                              <p>{feedback.comment}</p>
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
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />
                  <div className="rating">
                    <Pagination
                      current={currentPage}
                      total={totalPagesFeedback}
                      pageSize={pageSize}
                      onChange={(page) => setCurrentPage(page)}
                    />
                  </div>
                </div>
              </Col>
              <div></div>
              <Col xs={24} md={7} className="sticky-col">
                <div
                  style={{
                    padding: "24px",
                    background: "#fff",
                    borderRadius: "8px",
                  }}
                  className="detail-salon-col-2"
                >
                  <div>
                    <Title level={4}>Địa chỉ</Title>
                    <Text>{salonDetail.address}</Text>
                    <a
                      style={{ marginTop: "10px", cursor: "pointer" }}
                      href={`https://www.google.com/maps/dir/?api=1&destination=${salonDetail.latitude},${salonDetail.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Chỉ đường
                    </a>
                    <Divider />
                  </div>

                  <div>
                    <Title level={4}>Thông tin</Title>
                    <Text>{salonDetail.description}</Text>
                    <Divider />
                  </div>
                  <div>
                    <Title level={4}>Nhân viên</Title>
                    <List
                      // loading={loading}
                      dataSource={employees}
                      renderItem={(employee) => (
                        <List.Item key={employee.id}>
                          <List.Item.Meta
                            avatar={<Avatar src={employee?.img} />}
                            title={<Text>{employee?.fullName}</Text>}
                          />
                        </List.Item>
                      )}
                    />
                    <Pagination
                      current={page}
                      pageSize={pageSizeEmployee}
                      total={total}
                      onChange={handlePageChangeEmployees}
                      // className={styles.pagination}
                    />
                    <Divider />
                  </div>

                  <div>
                    <Title level={4}>Liên hệ</Title>
                    <Row justify="space-between" align="middle">
                      <Text>{salonDetail?.salonOwner?.phone}</Text>
                      {/* <Button type="primary">Gọi</Button> */}
                    </Row>
                    <Divider />
                  </div>

                  <div>
                    <Title level={4}>Thời gian làm việc</Title>
                    {sortedSchedules?.map((e) => {
                      return (
                        <Row justify="space-between" key={e?.dayOfWeek}>
                          <Text strong>{daysOfWeek[e?.dayOfWeek]}</Text>
                          {/* <Text>
                            {e?.startTime?.slice(0, 5)} AM -{" "}
                            {e?.endTime?.slice(0, 5)} PM
                          </Text> */}
                          <Text>
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

                  {/* <div>
                    <Button danger block onClick={showReportModal}>
                      Report Shop
                    </Button>
                  </div> */}
                  <Modal
                    title="Xác nhận cuộc hẹn"
                    visible={isPriceModalVisible}
                    onOk={handleConfirmBooking}
                    onCancel={() => setIsPriceModalVisible(false)}
                    okText="Xác nhận"
                    cancelText="Hủy"
                  >
                    {additionalServices?.map((e) => {
                      const startTime =
                        e?.bookingDetailResponses?.serviceHair?.startTime;
                      const endTime =
                        e?.bookingDetailResponses?.serviceHair?.endTime;

                      const formattedStartTime =
                        dayjs(startTime).format("HH:mm");
                      const formattedEndTime = dayjs(endTime).format("HH:mm");

                      const totalTime = dayjs
                        .duration(dayjs(endTime).diff(dayjs(startTime)))
                        .asMinutes();
                      const employee =
                        e?.bookingDetailResponses?.employees.find(
                          (emp) => emp.id === e?.bookingDetail?.salonEmployeeId
                        );
                      return (
                        <Card
                          key={e.id}
                          actions={[
                            <>
                              <Text strong>Dịch vụ: {e?.serviceName} </Text>
                              <br />
                              {employee ? (
                                <>
                                  <Avatar
                                    src={employee.img}
                                    style={{ marginRight: 8 }}
                                  />
                                  Nhân viên: {employee.fullName}
                                </>
                              ) : (
                                <>
                                  <Avatar
                                    icon={<RandomIcon />}
                                    style={{ marginRight: 8 }}
                                  />
                                  Nhân viên: Ngẫu nhiên
                                </>
                              )}
                              <br />
                              <Text strong>
                                Thời gian: {formattedStartTime} -{" "}
                                {formattedEndTime}
                              </Text>
                              <br />
                              <Text strong>
                                Tổng thời gian: {totalTime} phút
                              </Text>
                              <Image width={150} src={e?.img} />
                            </>,
                          ]}
                        ></Card>
                      );
                    })}

                    <Typography className="w-fit">
                      <Text strong>
                        Giá gốc: &nbsp;
                        <Text style={{ display: "inline" }}>
                          {formatCurrency(originalPrice)}
                        </Text>
                      </Text>{" "}
                      <Text strong>
                        Giá đã giảm: &nbsp;
                        <Text style={{ display: "inline" }}>
                          {formatCurrency(discountedPrice)}
                        </Text>
                      </Text>
                      <Text strong>
                        Giá tổng: &nbsp;
                        <Text style={{ display: "inline" }}>
                          {formatCurrency(totalPrice)}
                        </Text>
                      </Text>
                    </Typography>
                  </Modal>
                  <div>
                    <Modal
                      title="Report Shop"
                      centered
                      visible={isReportModalVisible}
                      onOk={handleReport}
                      onCancel={handleCancel}
                      okText="Report"
                      cancelText="Cancel"
                      width={400}
                      style={{ textAlign: "center" }}
                      footer={null}
                    >
                      <Checkbox.Group
                        style={{ width: "100%" }}
                        onChange={onChangeCheckbox}
                      >
                        {reportOptions.map((option, index) => (
                          <div
                            key={index}
                            style={{
                              display: "block",
                              textAlign: "left",
                              width: "100%",
                              padding: "8px 0",
                            }}
                          >
                            <Checkbox value={option}>{option}</Checkbox>
                            {index < reportOptions.length - 1 && <Divider />}
                          </div>
                        ))}
                      </Checkbox.Group>
                      <div
                        style={{
                          textAlign: "center",
                          paddingTop: "10px",
                        }}
                      >
                        <Button
                          key="back"
                          onClick={handleCancel}
                          style={{ marginRight: "8px" }}
                        >
                          Cancel
                        </Button>
                        <Button
                          key="submit"
                          type="primary"
                          onClick={handleReport}
                        >
                          Report
                        </Button>
                      </div>
                    </Modal>
                  </div>
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
    </div>
  );
}

export default SalonDetail;
