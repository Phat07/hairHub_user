import { Bar, Line, Pie } from "react-chartjs-2";
import { motion } from "framer-motion";
import styles from "../css/reviewAppointment.module.css";
import stylesCard from "../css/customerAppointment.module.css";
import style from "../css/salonDetail.module.css";
import stylesFillter from "../css/listShopBarber.module.css";
import "../css/revenue.css";
import { useEffect, useState } from "react";
import classNames from "classnames";
import {
  Avatar,
  Button,
  DatePicker,
  Dropdown,
  Image,
  Input,
  List,
  Menu,
  message,
  Pagination,
  Spin,
  Table,
  Tag,
} from "antd";
import dayjs from "dayjs";
import {
  BorderOutlined,
  CheckCircleOutlined,
  CheckSquareOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  DownOutlined,
  SearchOutlined,
  StarFilled,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { actGetSalonInformationByOwnerIdAsync } from "@/store/salonAppointments/action";
import { API } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { actGetFeedbackFromSalonOwner } from "@/store/ratingCutomer/action";
const RevenueYearPage = () => {
  const navigate = useNavigate();
  const { RangePicker } = DatePicker;
  const [currentPageService, setCurrentPageService] = useState(1);
  const [pageSizeService, setPageSizeService] = useState(4);
  const [sortLabelService, setSortLabelService] = useState(
    "Số lượng sử dụng tăng dần"
  );
  const [sortLabelRevenue, setSortLabelRevenue] = useState("7 ngày qua");
  const [sortService, setSortService] = useState("Số lượng sử dụng tăng dần");
  const [currentPageEmployee, setCurrentPageEmployee] = useState(1);
  const [pageSizeEmployee, setPageSizeEmployee] = useState(4);
  const [total, setTotal] = useState(1);
  const [totalService, setTotalService] = useState(1);
  const [totalCustomer, setTotalCustomer] = useState(1);
  const [currentPageCustomer, setCurrentPageCustomer] = useState(1);
  const [pageSizeCustomer, setPageSizeCustomer] = useState(4);
  const [sortLabelEmployee, setSortLabelEmployee] = useState(
    "Số lượng dịch vụ tăng dần"
  );
  const [sortLabelCustomer, setSortLabelCustomer] = useState(
    "Số cuộc hẹn tăng dần"
  );
  const [fillterLabelCustomer, setFillterLabelCustomer] = useState("Tất cả");
  const [dataEmployee, setDataEmplyee] = useState([]);
  const [dataService, setDataService] = useState([]);
  const [dataAppointment, setDataAppointment] = useState([]);
  const [dataCustomer, setDataCustomer] = useState([]);
  const [dataEmployeeFeedback, setDataEmployeeFeedback] = useState([]);
  const [dataServiceFeedback, setDataServiceFeedback] = useState([]);
  const [sortEmployee, setSortEmployee] = useState("Số lượng dịch vụ tăng dần");
  const [sortCustomer, setSortCustomer] = useState("Số cuộc hẹn tăng dần");
  const [fillterCustomer, setFillterCustomer] = useState("ALL");
  const [startIndex, setStartIndex] = useState(0); // Vị trí bắt đầu hiển thị
  const [activeYear, setActiveYear] = useState(null); // Năm đang được chọn
  const years = Array.from({ length: 30 }, (_, i) => 2023 + i); // Danh sách năm từ 2020 đến 2030
  const visibleYears = years.slice(startIndex, startIndex + 4); // Lấy 4 năm để hiển thị
  const [dataRevenue, setDataRevenue] = useState({});
  const [tempDates, setTempDates] = useState([
    dayjs().subtract(7, "day"), // Ngày bắt đầu
    dayjs(), // Ngày kết thúc
  ]);
  const [dateLabelFeedback, setDateLabelFeedback] = useState("7 ngày qua");
  const [tempDatesFeedback, setTempDatesFeedback] = useState([
    dayjs().subtract(7, "day"), // Ngày bắt đầu
    dayjs(), // Ngày kết thúc
  ]);
  const [filterRating, setFilterRating] = useState(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [sortLabelStatus, setSortLabelStatus] = useState("Sắp xếp");
  const [SortStatus, setSortStatus] = useState(null);
  const [dateCommentFilter, setDateCommentFilter] = useState(null);
  const [searchEmployee, setSearchEmployee] = useState(null);
  const pageSizeFeedback = 5;
  const [currentPageFeedback, setCurrentPageFeedback] = useState(1);
  const totalPagesFeedback = useSelector((state) => state.RATING.totalPages);
  const listFeedback = useSelector(
    (state) => state.RATING.getAllFeedbackFromSalonOwner
  );
  const [selectedStartDates, setSelectedStartDates] = useState(
    dayjs().subtract(7, "day").format("YYYY-MM-DD")
  ); // 7 ngày trước
  const [selectedEndDates, setSelectedEndDates] = useState(
    dayjs().format("YYYY-MM-DD")
  ); // Hôm nay

  const [isLoading, setIsLoading] = useState(false);
  const [pieData, setPieData] = useState({
    labels: [],
    datasets: [],
  });
  const [lineData, setLineData] = useState({
    labels: [],
    datasets: [],
  });
  const [pieDataAppointment, setPieDataAppointment] = useState({
    labels: [],
    datasets: [],
  });
  const [lineDataAppointment, setLineDataAppointment] = useState({
    labels: [],
    datasets: [],
  });
  const [pieDataAppointmentRange, setPieDataAppointmentRange] = useState({
    labels: [],
    datasets: [],
  });
  const dispatch = useDispatch();
  const ownerId = useSelector((state) => state.ACCOUNT.idOwner);
  const salonInformationByOwnerId = useSelector(
    (state) => state.SALONAPPOINTMENTS.salonInformationByOwnerId
  );
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    if (years.includes(currentYear)) {
      setActiveYear(currentYear);
    } else {
      setActiveYear(years[0]);
    }
  }, []);
  useEffect(() => {
    if (ownerId) {
      dispatch(actGetSalonInformationByOwnerIdAsync(ownerId));
    }
  }, [ownerId]);
  useEffect(() => {
    const fetchData = async (url, params, setData) => {
      setIsLoading(true);
      try {
        const response = await API.get(url, { params });
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const compileRevenueUrl = `/saloninformations/CompileRevenueSalonByYear/${salonInformationByOwnerId?.id}`;
    const compileAppointmentUrl = `/saloninformations/CompileAppointmentSalonByYear/${salonInformationByOwnerId?.id}`;

    // Fetch revenue data if salon ID and activeYear exist
    if (salonInformationByOwnerId?.id && activeYear) {
      fetchData(compileRevenueUrl, { year: activeYear }, (data) => {
        setLineData(formatLineChartData(data));
        setPieData(formatPieChartData(data));
      });

      // Fetch appointment data if salon ID and activeYear exist
      fetchData(compileAppointmentUrl, { year: activeYear }, (data) => {
        setLineDataAppointment(formatDataForLineChart(data.revenuewStatistics));
        setPieDataAppointment(
          formatDataForPieChart(
            data.inSideAppointmentPercent,
            data.outSideAppointmentPercent,
            data.cancelAppointmentPercent,
            data.failedAppointmentPercent
          )
        );
      });
    }
  }, [activeYear, salonInformationByOwnerId]);

  const [loadingAppointment, setLoadingAppointment] = useState(false);
  const [loadingEmployee, setLoadingEmployee] = useState(false);
  const [loadingService, setLoadingService] = useState(false);
  const [loadingRevenue, setLoadingRevenue] = useState(false);
  const [loadingCustomer, setLoadingCustomer] = useState(false);
  const [loadingFeedbackEmployee, setLoadingFeedbackEmployee] = useState(false);
  const [loadingFeedbackService, setLoadingFeedbackService] = useState(false);
  const fetchData = async (url, params, setData) => {
    try {
      const response = await API.get(url, { params });
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (salonInformationByOwnerId?.id && tempDatesFeedback) {
      setLoadingFeedbackEmployee(true);
      const compileEmployeeUrl = `/saloninformations/EmployeeEvaluation/${salonInformationByOwnerId.id}`;
      const formattedDates = tempDatesFeedback?.map((date) =>
        date && date.$d ? dayjs(date.$d).format("YYYY-MM-DD") : null
      );
      fetchData(
        compileEmployeeUrl,
        {
          startDate: formattedDates[0],
          endDate: formattedDates[1],
        },
        (data) => {
          setDataEmployeeFeedback(data);
        }
      ).finally(() => setLoadingFeedbackEmployee(false));
    }
  }, [salonInformationByOwnerId?.id, tempDatesFeedback]);

  useEffect(() => {
    if (salonInformationByOwnerId?.id && tempDatesFeedback) {
      setLoadingFeedbackService(true);
      const compileEmployeeUrl = `/appointments/EvaluatedService/${salonInformationByOwnerId.id}`;
      const formattedDates = tempDatesFeedback?.map((date) =>
        date && date.$d ? dayjs(date.$d).format("YYYY-MM-DD") : null
      );
      fetchData(
        compileEmployeeUrl,
        {
          startDate: formattedDates[0],
          endDate: formattedDates[1],
        },
        (data) => {
          setDataServiceFeedback(data);
        }
      ).finally(() => setLoadingFeedbackService(false));
    }
  }, [salonInformationByOwnerId?.id, tempDatesFeedback]);

  useEffect(() => {
    if (
      salonInformationByOwnerId?.id &&
      sortEmployee &&
      tempDates &&
      currentPageEmployee
    ) {
      setLoadingEmployee(true);
      const compileEmployeeUrl = `/saloninformations/CompileEmployeeSalon/${salonInformationByOwnerId.id}`;
      const formattedDates = tempDates?.map((date) =>
        date && date.$d ? dayjs(date.$d).format("YYYY-MM-DD") : null
      );
      fetchData(
        compileEmployeeUrl,
        {
          startDate: formattedDates[0],
          endDate: formattedDates[1],
          filter: sortEmployee,
          page: currentPageEmployee,
          size: pageSizeEmployee,
        },
        (data) => {
          console.log("da", data);
          setTotal(data?.totalPages);
          setDataEmplyee(data?.items);
        }
      ).finally(() => setLoadingEmployee(false));
    }
  }, [
    salonInformationByOwnerId?.id,
    sortEmployee,
    tempDates,
    currentPageEmployee,
  ]);

  useEffect(() => {
    if (
      salonInformationByOwnerId?.id &&
      sortService &&
      tempDates &&
      currentPageService
    ) {
      setLoadingService(true);
      const compileServicetUrl = `/saloninformations/ServiceStatistics/${salonInformationByOwnerId.id}`;
      const formattedDates = tempDates?.map((date) =>
        date && date.$d ? dayjs(date.$d).format("YYYY-MM-DD") : null
      );
      fetchData(
        compileServicetUrl,
        {
          startDate: formattedDates[0],
          endDate: formattedDates[1],
          filter: sortService,
          page: currentPageService,
          size: pageSizeService,
        },
        (data) => {
          setDataService(data.items);
          setTotalService(data?.totalPages);
        }
      ).finally(() => setLoadingService(false));
    }
  }, [
    salonInformationByOwnerId?.id,
    sortService,
    tempDates,
    currentPageService,
  ]);

  useEffect(() => {
    if (
      salonInformationByOwnerId?.id &&
      sortCustomer &&
      tempDates &&
      currentPageCustomer
    ) {
      setLoadingCustomer(true);
      const fillter = fillterCustomer === "ALL" ? null : fillterCustomer;
      const compileServicetUrl = `/appointments/FrequentlyCustomers/${salonInformationByOwnerId.id}`;
      const formattedDates = tempDates?.map((date) =>
        date && date.$d ? dayjs(date.$d).format("YYYY-MM-DD") : null
      );
      fetchData(
        compileServicetUrl,
        {
          startDate: formattedDates[0],
          endDate: formattedDates[1],
          filter: sortCustomer,
          statusAppointment: fillter,
          page: currentPageCustomer,
          size: pageSizeCustomer,
        },
        (data) => {
          setTotalCustomer(data?.total);
          setDataCustomer(data?.items);
        }
      ).finally(() => setLoadingCustomer(false));
    }
  }, [
    salonInformationByOwnerId?.id,
    sortCustomer,
    tempDates,
    currentPageCustomer,
    fillterCustomer,
  ]);

  useEffect(() => {
    if (salonInformationByOwnerId?.id && tempDates) {
      setLoadingAppointment(true);
      const compileAppointmentUrl = `/saloninformations/CompileAppointmentSalon/${salonInformationByOwnerId.id}`;
      const formattedDates = tempDates?.map((date) =>
        date && date.$d ? dayjs(date.$d).format("YYYY-MM-DD") : null
      );
      fetchData(
        compileAppointmentUrl,
        {
          startDate: formattedDates[0],
          endDate: formattedDates[1],
        },
        (data) => {
          setDataAppointment(data);
          setPieDataAppointmentRange(formatPieChartDataAppointment(data));
        }
      ).finally(() => setLoadingAppointment(false));
    }
  }, [salonInformationByOwnerId?.id, tempDates]);

  useEffect(() => {
    if (salonInformationByOwnerId?.id && tempDates) {
      setLoadingRevenue(true);
      const compileRevenuetUrl = `/saloninformations/RevenueStatistics/${salonInformationByOwnerId.id}`;
      const formattedDates = tempDates?.map((date) =>
        date && date.$d ? dayjs(date.$d).format("YYYY-MM-DD") : null
      );
      fetchData(
        compileRevenuetUrl,
        { startDate: formattedDates[0], endDate: formattedDates[1] },
        (data) => {
          console.log("data", data);

          setDataRevenue(data);
        }
      ).finally(() => setLoadingRevenue(false));
    }
  }, [salonInformationByOwnerId?.id, tempDates]);

  useEffect(() => {
    if (salonInformationByOwnerId?.id || currentPageFeedback) {
      setLoadingFeedback(true);
      dispatch(
        actGetFeedbackFromSalonOwner(
          salonInformationByOwnerId?.id,
          currentPageFeedback,
          pageSizeFeedback
        )
      )
        .then((res) => {})
        .catch((err) => {})
        .finally((err) => {
          setLoadingFeedback(false);
        });
    }
  }, [salonInformationByOwnerId?.id, currentPageFeedback]);

  const formatLineChartData = (data) => {
    const labels = data.revenuewStatistics.map((item) => item.month);
    const totalRevenueData = data.revenuewStatistics.map(
      (item) => item.totalRevenue
    );
    const outSideRevenueData = data.revenuewStatistics.map(
      (item) => item.outSideRevenue
    );
    const inSideRevenueData = data.revenuewStatistics.map(
      (item) => item.inSideRevenue
    );

    return {
      labels,
      datasets: [
        {
          label: "Tổng doanh thu",
          data: totalRevenueData,
          borderColor: "#4F46E5",
          backgroundColor: "rgba(79, 70, 229, 0.2)",
        },
        {
          label: "Doanh thu ngoài hệ thống",
          data: outSideRevenueData,
          borderColor: "#10B981",
          backgroundColor: "rgba(16, 185, 129, 0.2)",
        },
        {
          label: "Doanh thu trong hệ thống",
          data: inSideRevenueData,
          borderColor: "#46e0f4",
          backgroundColor: "rgba(0, 225, 255, 0.2)",
        },
      ],
    };
  };
  const formatPieChartData = (data) => {
    return {
      labels: ["Doanh thu ngoài hệ thống", "Doanh thu trong hệ thống"],
      datasets: [
        {
          data: [data.outSideRevenuePercent, data.inSideRevenuePercent],
          backgroundColor: ["#10B981", "#46e0f4"],
          hoverBackgroundColor: ["#059669", "#1c95a5"],
        },
      ],
    };
  };
  const formatPieChartDataAppointment = (data) => {
    return {
      labels: data.map((item) => item.appointmentType), // Lấy tên loại lịch hẹn
      datasets: [
        {
          label: "Tỉ lệ lịch hẹn",
          data: data.map((item) => item.percent), // Dữ liệu phần trăm
          backgroundColor: [
            "#FF6384", // Màu sắc từng phần
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
          ],
          hoverOffset: 4, // Hiệu ứng khi hover
        },
      ],
    };
  };
  const formatDataForLineChart = (revenuewStatistics) => {
    return {
      labels: [
        "Tháng 1",
        "Tháng 2",
        "Tháng 3",
        "Tháng 4",
        "Tháng 5",
        "Tháng 6",
        "Tháng 7",
        "Tháng 8",
        "Tháng 9",
        "Tháng 10",
        "Tháng 11",
        "Tháng 12",
      ],
      datasets: [
        {
          label: "Lịch hẹn ngoài hệ thống",
          data: revenuewStatistics.map((item) => item.outSideAppointment),
          borderColor: "#10B981", // Xanh lá cây
          backgroundColor: "rgba(16, 185, 129, 0.2)",
        },
        {
          label: "Lịch hẹn trong hệ thống",
          data: revenuewStatistics.map((item) => item.inSideAppointment),
          borderColor: "#46e0f4", // Xanh dương nhạt
          backgroundColor: "rgba(0, 225, 255, 0.2)",
        },
        {
          label: "Lịch hẹn bị hủy",
          data: revenuewStatistics.map((item) => item.cancelAppointment),
          borderColor: "#F87171", // Đỏ
          backgroundColor: "rgba(248, 113, 113, 0.2)",
        },
        {
          label: "Lịch hẹn thất bại",
          data: revenuewStatistics.map((item) => item.failedAppointment),
          borderColor: "#FBBF24", // Vàng
          backgroundColor: "rgba(251, 191, 36, 0.2)",
        },
      ],
    };
  };

  const formatDataForPieChart = (
    inSideAppointmentPercent,
    outSideAppointmentPercent,
    cancelAppointmentPercent,
    failedAppointmentPercent
  ) => {
    return {
      labels: [
        "Lịch hẹn trong hệ thống",
        "Lịch hẹn ngoài hệ thống",
        "Lịch hẹn bị hủy",
        "Lịch hẹn thất bại",
      ],
      datasets: [
        {
          data: [
            inSideAppointmentPercent,
            outSideAppointmentPercent,
            cancelAppointmentPercent,
            failedAppointmentPercent,
          ],
          backgroundColor: [
            "#46e0f4", // Xanh dương nhạt
            "#10B981", // Xanh lá cây
            "#F87171", // Đỏ
            "#FBBF24", // Vàng
          ],
          hoverBackgroundColor: [
            "#1c95a5", // Hover xanh dương nhạt
            "#059669", // Hover xanh lá cây
            "#E11D48", // Hover đỏ
            "#F59E0B", // Hover vàng
          ],
        },
      ],
    };
  };

  const handleYearScroll = (direction) => {
    if (direction === "prev" && startIndex > 0) {
      setStartIndex(startIndex - 1);
    } else if (direction === "next" && startIndex + 4 < years.length) {
      setStartIndex(startIndex + 1);
    }
  };
  const handleYearClick = (year) => {
    setActiveYear(year); // Cập nhật năm được chọn
    console.log("Selected year:", year); // Log để kiểm tra giá trị
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const handleMenuClickServiceSort = (e) => {
    setCurrentPageService(1);
    setSortService(e.key);
    setSortLabelService(e.key === "" ? "Sắp xếp" : `${e.key}`);
  };

  const sortMenuService = (
    <Menu onClick={handleMenuClickServiceSort}>
      {/* <Menu.Item key="">Không sắp xếp</Menu.Item> */}
      <Menu.Item key="Số lượng sử dụng tăng dần">
        Số lượng sử dụng tăng dần
      </Menu.Item>
      <Menu.Item key="Số lượng sử dụng giảm dần">
        Số lượng sử dụng giảm dần
      </Menu.Item>
      <Menu.Item key="Số lượng khách tăng dần">
        Số lượng khách tăng dần
      </Menu.Item>
      <Menu.Item key="Số lượng khách giảm dần">
        Số lượng khách giảm dần
      </Menu.Item>
      <Menu.Item key="Số doanh thu tăng dần">Số doanh thu tăng dần</Menu.Item>
      <Menu.Item key="Số doanh thu giảm dần">Số doanh thu giảm dần</Menu.Item>
    </Menu>
  );

  const handleMenuClickEmployeeSort = (e) => {
    setCurrentPageEmployee(1);
    setSortEmployee(e.key);
    setSortLabelEmployee(e.key === "" ? "Sắp xếp" : `${e.key}`);
  };

  const sortMenuEmployee = (
    <Menu onClick={handleMenuClickEmployeeSort}>
      {/* <Menu.Item key="">Không sắp xếp</Menu.Item> */}
      <Menu.Item key="Số lượng dịch vụ tăng dần">
        Số lượng dịch vụ tăng dần
      </Menu.Item>
      <Menu.Item key="Số lượng dịch vụ giảm dần">
        Số lượng dịch vụ giảm dần
      </Menu.Item>
      <Menu.Item key="Số lượng khách tăng dần">
        Số lượng khách tăng dần
      </Menu.Item>
      <Menu.Item key="Số lượng khách giảm dần">
        Số lượng khách giảm dần
      </Menu.Item>
      <Menu.Item key="Số doanh thu tăng dần">Số doanh thu tăng dần</Menu.Item>
      <Menu.Item key="Số doanh thu giảm dần">Số doanh thu giảm dần</Menu.Item>
    </Menu>
  );

  const handleMenuClickCustomerSort = (e) => {
    setCurrentPageCustomer(1);
    setSortCustomer(e.key);
    setSortLabelCustomer(e.key === "" ? "Sắp xếp" : `${e.key}`);
  };

  const sortMenuCustomer = (
    <Menu onClick={handleMenuClickCustomerSort}>
      {/* <Menu.Item key="">Không sắp xếp</Menu.Item> */}
      <Menu.Item key="Số cuộc hẹn tăng dần">Số cuộc hẹn tăng dần</Menu.Item>
      <Menu.Item key="Số cuộc hẹn giảm dần">Số cuộc hẹn giảm dần</Menu.Item>
      <Menu.Item key="Số tiền tăng dần">Số tiền tăng dần</Menu.Item>
      <Menu.Item key="Số tiền giảm dần">Số tiền giảm dần</Menu.Item>
    </Menu>
  );

  const handleMenuClickCustomerFillter = (e) => {
    setCurrentPageCustomer(1);
    setFillterCustomer(e.key);
    // Map key to label
    const labelMapping = {
      ALL: "Tất cả",
      SUCCESSED: "Trong hệ thống",
      OUT_SIDE: "Ngoài hệ thống",
    };

    // Set the label based on the mapping
    setFillterLabelCustomer(labelMapping[e.key] || "Lọc theo");
  };

  const fillterMenuCustomer = (
    <Menu onClick={handleMenuClickCustomerFillter}>
      {/* <Menu.Item key="">Không sắp xếp</Menu.Item> */}
      <Menu.Item key="ALL">Tất cả</Menu.Item>
      <Menu.Item key="SUCCESSED">Trong hệ thống</Menu.Item>
      <Menu.Item key="OUT_SIDE">Ngoài hệ thống</Menu.Item>
    </Menu>
  );

  const appointmentTypeMapping = {
    "Lịch hẹn bị hủy": "CANCEL_BY_CUSTOMER",
    "Lịch hẹn thất bại": "FAILED",
    "Lịch hẹn thành công": "SUCCESSED",
    "Lịch hẹn ngoài hệ thống": "OUT_SIDE",
  };

  const columnsAppointment = [
    {
      title: "Kiểu lịch hẹn",
      dataIndex: "appointmentType",
      key: "appointmentType",
      align: "center",
    },
    {
      title: "Số lượng lịch hẹn",
      dataIndex: "appointmentQuantity",
      key: "appointmentQuantity",
      align: "center",
    },
    {
      title: "Số lượng khách phục vụ",
      dataIndex: "customerQuantity",
      align: "center",
      key: "customerQuantity",
    },
    {
      title: "Doanh Thu",
      dataIndex: "revenue",
      key: "revenue",
      align: "center",
      render: (AppointmentRevenue) => formatCurrency(AppointmentRevenue),
    },
    {
      title: "Chi tiết",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Button
          className={stylesCard.buttonCard}
          onClick={() => {
            const status = appointmentTypeMapping[record.appointmentType];
            const formattedDates = tempDates?.map((date) =>
              date ? date.format("YYYY-MM-DD") : ""
            );
            navigate(
              `/salon_appointment?appoinmentStatus=${status}&startDate=${formattedDates[0]}&endDate=${formattedDates[1]}`
            );
          }}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  const columnsService = [
    {
      title: "Tên dịch vụ",
      dataIndex: "serviceName",
      key: "serviceName",
      align: "center",
    },
    {
      title: "Số lần phục vụ",
      dataIndex: "numberOfUses",
      key: "numberOfUses",
      align: "center",
    },
    {
      title: "Số khách phục vụ",
      dataIndex: "numberOfCustomers",
      align: "center",
      key: "numberOfCustomers",
    },
    {
      title: "Doanh Thu",
      dataIndex: "revenueFromService",
      key: "revenueFromService",
      align: "center",
      render: (AppointmentRevenue) => formatCurrency(AppointmentRevenue),
    },
    {
      title: "Chi tiết",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Button
          className={stylesCard.buttonCard}
          onClick={() => {
            const service = record.serviceName;
            const formattedDates = tempDates?.map((date) =>
              date ? date.format("YYYY-MM-DD") : ""
            );
            navigate(
              `/salon_appointment?appoinmentStatus=ALL&appoinmentServiceName=${service}&startDate=${formattedDates[0]}&endDate=${formattedDates[1]}`
            );
          }}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  const columnsCustomer = [
    {
      title: "Tên khách hàng",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      align: "center",
    },
    {
      title: "Số cuộc hẹn",
      dataIndex: "numberofSuccessAppointment",
      align: "center",
      key: "numberofSuccessAppointment",
    },
    {
      title: "Dịch vụ",
      dataIndex: "userService", // Trường chứa danh sách dịch vụ
      key: "userService",
      render: (services) => {
        // Kiểm tra nếu mảng không rỗng, nối thành chuỗi
        return services && services.length > 0
          ? services.join(", ")
          : "Không có dịch vụ";
      },
      align: "center",
    },
    {
      title: "Số tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      align: "center",
      render: (AppointmentRevenue) => formatCurrency(AppointmentRevenue),
    },
    {
      title: "Chi tiết",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Button
          className={stylesCard.buttonCard}
          onClick={() => {
            const name = record.name;
            const formattedDates = tempDates?.map((date) =>
              date ? date.format("YYYY-MM-DD") : ""
            );
            navigate(
              `/salon_appointment?appoinmentStatus=ALL&appoinmentCustomerName=${name}&startDate=${formattedDates[0]}&endDate=${formattedDates[1]}`
            );
          }}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  const columnsEmployee = [
    {
      title: "Tên nhân viên",
      dataIndex: "fullName",
      key: "fullName",
      align: "center",
    },
    {
      title: "Số dịch vụ đã thực hiện",
      dataIndex: "numberOfService",
      key: "numberOfService",
      align: "center",
    },
    {
      title: "Số khách đã phục vụ",
      dataIndex: "numberOfUsers",
      align: "center",
      key: "numberOfUsers",
    },
    {
      title: "Doanh Thu",
      dataIndex: "revenue",
      key: "revenue",
      align: "center",
      render: (AppointmentRevenue) => formatCurrency(AppointmentRevenue),
    },
    {
      title: "Chi tiết",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Button
          className={stylesCard.buttonCard}
          onClick={() => {
            const employeeName = record.fullName;
            const formattedDates = tempDates?.map((date) =>
              date ? date.format("YYYY-MM-DD") : ""
            );
            navigate(
              `/salon_appointment?appoinmentStatus=ALL&appoinmentEmployeeName=${employeeName}&startDate=${formattedDates[0]}&endDate=${formattedDates[1]}`
            );
          }}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  const handleDateChange = (dates) => {
    setTempDates(dates); // Lưu ngày tạm thời
  };

  const handleMenuClickRevenueSort = (e) => {
    let startDate;
    let endDate = dayjs(); // Mặc định là hôm nay
    setSortLabelRevenue(e.key);
    setCurrentPageService(1);
    setCurrentPageCustomer(1);
    setCurrentPageEmployee(1);
    switch (e.key) {
      case "hôm nay":
        startDate = dayjs(); // Ngày hôm nay
        break;
      case "hôm qua":
        startDate = dayjs().subtract(1, "day"); // Ngày hôm qua
        endDate = dayjs().subtract(1, "day");
        break;
      case "7 ngày qua":
        startDate = dayjs().subtract(7, "day"); // 7 ngày trước
        break;
      case "Tháng này":
        startDate = dayjs().startOf("month"); // Ngày đầu tháng
        break;
      case "Tháng trước":
        startDate = dayjs().subtract(1, "month").startOf("month"); // Ngày đầu tháng trước
        endDate = dayjs().subtract(1, "month").endOf("month"); // Ngày cuối tháng trước
        break;
      case "3 tháng trước":
        startDate = dayjs().subtract(3, "month").startOf("month"); // 3 tháng trước, đầu tháng
        break;
      case "Năm nay":
        startDate = dayjs().startOf("year"); // Ngày đầu năm nay
        break;
      case "Năm trước":
        startDate = dayjs().subtract(1, "year").startOf("year"); // Ngày đầu năm trước
        endDate = dayjs().subtract(1, "year").endOf("year"); // Ngày cuối năm trước
        break;
      case "Toàn thời gian":
        startDate = null; // Không giới hạn thời gian
        endDate = null;
        break;
      case "Tùy chọn":
        startDate = dayjs().subtract(7, "day"); // Giá trị mặc định
        break;
      default:
        startDate = dayjs(); // Mặc định là hôm nay
    }

    // Cập nhật giá trị tempDates
    setTempDates([startDate, endDate]);
  };

  const sortMenuRevenue = (
    <Menu onClick={handleMenuClickRevenueSort}>
      <Menu.Item key="hôm nay">Hôm nay</Menu.Item>
      <Menu.Item key="hôm qua">Hôm qua</Menu.Item>
      <Menu.Item key="7 ngày qua">7 ngày qua</Menu.Item>
      <Menu.Item key="Tháng này">Tháng này</Menu.Item>
      <Menu.Item key="Tháng trước">Tháng trước</Menu.Item>
      <Menu.Item key="3 tháng trước">3 tháng trước</Menu.Item>
      <Menu.Item key="Năm nay">Năm nay</Menu.Item>
      <Menu.Item key="Năm trước">Năm trước</Menu.Item>
      <Menu.Item key="Toàn thời gian">Toàn thời gian</Menu.Item>
      <Menu.Item key="Tùy chọn">Tùy chọn</Menu.Item>
    </Menu>
  );

  const handleMenuClickSort = (e, setTempDates, setSortLabel) => {
    let startDate;
    let endDate = dayjs();
    setSortLabel(e.key);

    switch (e.key) {
      case "hôm nay":
        startDate = dayjs(); // Ngày hôm nay
        break;
      case "hôm qua":
        startDate = dayjs().subtract(1, "day"); // Ngày hôm qua
        endDate = dayjs().subtract(1, "day"); // Ngày hôm qua
        break;
      case "7 ngày qua":
        startDate = dayjs().subtract(7, "day"); // 7 ngày trước
        break;
      case "Tháng này":
        startDate = dayjs().startOf("month"); // Ngày đầu tháng
        break;
      case "Tháng trước":
        startDate = dayjs().subtract(1, "month").startOf("month"); // Tháng trước
        endDate = dayjs().subtract(1, "month").endOf("month"); // Cuối tháng trước
        break;
      case "3 tháng":
        startDate = dayjs().subtract(3, "month").startOf("month"); // Tháng trước
        break;
      case "Năm nay":
        startDate = dayjs().startOf("year"); // Ngày đầu năm
        break;
      case "Toàn thời gian":
        setTempDates([null, null]);
        break;
      case "Tùy chọn":
        startDate = dayjs().subtract(7, "day");
        break;
      default:
        startDate = dayjs(); // Mặc định là hôm nay
    }
    setTempDates([startDate, endDate]);
  };

  const createSortMenu = (handleClick) => (
    <Menu onClick={handleClick}>
      {/* <Menu.Item key="hôm nay">Hôm nay</Menu.Item>
      <Menu.Item key="hôm qua">Hôm qua</Menu.Item> */}
      <Menu.Item key="7 ngày qua">7 ngày qua</Menu.Item>
      <Menu.Item key="Tháng này">Tháng này</Menu.Item>
      <Menu.Item key="Tháng trước">Tháng trước</Menu.Item>
      <Menu.Item key="3 tháng">3 tháng</Menu.Item>
      <Menu.Item key="Năm nay">Năm nay</Menu.Item>
      <Menu.Item key="Toàn thời gian">Toàn thời gian</Menu.Item>
      {/* <Menu.Item key="Tùy chọn">Tùy chọn</Menu.Item> */}
    </Menu>
  );

  const handleMenuClickFeedbackDate = (e) => {
    handleMenuClickSort(e, setTempDatesFeedback, setDateLabelFeedback);
  };
  const dateMenuFeedback = createSortMenu(handleMenuClickFeedbackDate);

  const onPageChangeEmployee = (page) => {
    setCurrentPageEmployee(page);
  };
  const onPageChangeService = (page) => {
    setCurrentPageService(page);
  };
  const onPageChangeCustomer = (page) => {
    setCurrentPageCustomer(page);
  };

  const handleFeedbackAction = (options = {}) => {
    const {
      rating = filterRating,
      isSearchConfirm = isSearch,
      keepForm,
    } = options;
    // if (
    //   isSearchConfirm &&
    //   searchEmployee === null &&
    //   dateCommentFilter === null
    // ) {
    //   message.warning("Không có dữ liệu để tìm kiếm.");
    //   setLoadingFeedback(false);
    //   return;
    // }
    setCurrentPageFeedback(1);
    setLoadingFeedback(true);
    setFilterRating(rating);
    setIsSearch(isSearchConfirm);
    if (!keepForm) {
      setSearchEmployee(null);
      setDateCommentFilter(null);
      setSortStatus(null);
      setSortLabelStatus("Sắp xếp");
    }
    dispatch(
      actGetFeedbackFromSalonOwner(
        salonInformationByOwnerId?.id,
        currentPageFeedback,
        pageSizeFeedback,
        rating,
        isSearchConfirm ? searchEmployee : null,
        isSearchConfirm ? dateCommentFilter : null
      )
    )
      .then((res) => {
        // Xử lý thành công nếu cần
      })
      .catch((err) => {
        // Xử lý lỗi nếu cần
      })
      .finally(() => {
        setLoadingFeedback(false);
      });
  };

  function renderStars2(stars) {
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
              top: 6,
            }}
          />
          <StarFilled
            style={{
              position: "absolute",
              color: "#FFD700",
              clipPath: `inset(0 ${100 - fraction * 100}% 0 0)`, // phần sao được tô vàng
              zIndex: 2, // lớp trên cùng
              left: 0,
              top: 6,
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

  const handleMenuClickStatusSort = (e) => {
    setSortStatus(e.key === "" ? null : e.key === "true");
    setSortLabelStatus(
      e.key === "" ? "Tất cả" : e.key === "true" ? "Chưa trả lời" : "Đã trả lời"
    );
  };

  const sortStatus = (
    <Menu onClick={handleMenuClickStatusSort}>
      <Menu.Item key="">Tất cả</Menu.Item>
      <Menu.Item key="true">Chưa trả lời</Menu.Item>
      <Menu.Item key="false">Đã trả lời</Menu.Item>
    </Menu>
  );

  const handleDateChangeFeedback = (date, dateString) => {
    setIsSearch(false);
    if (dateString === "") {
      setDateCommentFilter(null);
    } else {
      setDateCommentFilter(dateString);
    }
  };

  const chartDataRatingEmloyee = {
    labels: dataEmployeeFeedback?.map((employee) => employee.fullName), // Tên nhân viên
    datasets: [
      {
        label: "Đánh giá (số sao)", // Nhãn của biểu đồ
        data: dataEmployeeFeedback?.map((employee) => employee.rate), // Điểm đánh giá
        backgroundColor: ["#bf9456"],
      },
    ],
  };

  const chartDataRatingService = {
    labels: dataServiceFeedback?.evaluatedServices?.map(
      (service) => service.serviceName
    ), // Tên dịch vụ
    datasets: [
      {
        label: "Số lượt đánh giá", // Nhãn của biểu đồ
        data: dataServiceFeedback?.evaluatedServices?.map((service) =>
          parseInt(service.number)
        ), // Số lượng đánh giá
        backgroundColor: ["#bf9456"],
      },
    ],
  };

  const horizontalRatingEmloyee = {
    indexAxis: "y", // Đặt trục hoành nằm ngang
    scales: {
      x: {
        title: {
          display: true,
          text: "Số sao",
        },
        beginAtZero: true, // Bắt đầu từ 0
      },
      y: {
        title: {
          display: true,
          text: "Tên nhân viên",
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  const horizontalRatingService = {
    indexAxis: "y", // Đặt trục hoành nằm ngang
    scales: {
      x: {
        title: {
          display: true,
          text: "Số sao",
        },
        beginAtZero: true, // Bắt đầu từ 0
      },
      y: {
        title: {
          display: true,
          text: "Tên dịch vụ",
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <>
      {/* <div
        className={`${styles.appointmentContainer} bg-customGray  p-4 sm:p-8`}
      >
        <h1 className="text-2xl font-bold mb-3" style={{ textAlign: "center" }}>
          Khách hàng
        </h1>
      </div> */}

      <div
        className={`${styles.appointmentContainer} bg-customGray min-h-screen p-4 sm:p-8`}
      >
        <h1 className="text-2xl font-bold mb-3" style={{ textAlign: "center" }}>
          Thống kê
        </h1>
        <div
          className={classNames("my-custom-add", styles["table-fillter"])}
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <Dropdown
            overlay={sortMenuRevenue}
            className="custom-dropdown-range-picker"
          >
            <Button>
              {sortLabelRevenue}:{" "}
              {
                tempDates && tempDates[0] && tempDates[1]
                  ? tempDates[0].isSame(tempDates[1], "day")
                    ? tempDates[0].format("DD/MM/YYYY") // Nếu start date và end date giống nhau, chỉ hiển thị một ngày
                    : `${tempDates[0].format(
                        "DD/MM/YYYY"
                      )} đến ${tempDates[1].format("DD/MM/YYYY")}`
                  : "" // Trường hợp không có dữ liệu hoặc giá trị null
              }
            </Button>
          </Dropdown>
        </div>
        <div
          className="datePickerCustome"
          // className={styles["date-picker-custome"]}
          style={{
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <RangePicker
            disabled={sortLabelRevenue !== "Tùy chọn"}
            onChange={handleDateChange}
            value={tempDates}
            dropdownClassName="custom-dropdown-range-picker"
          />
          {/* <button
                className={stylesCard.buttonCard}
                onClick={handleFilter}
                style={{ maxWidth: "5rem", paddingBlock: "10px" }}
            >
                Lọc
            </button> */}
        </div>
        {/* Biểu đồ số */}
        <div className="mb-4 sm:mb-6">
          <h2
            className="text-lg sm:text-xl font-bold mb-4"
            style={{ borderBottom: "0" }}
          >
            THỐNG KÊ{" "}
            {
              tempDates && tempDates[0] && tempDates[1]
                ? tempDates[0].isSame(tempDates[1], "day")
                  ? tempDates[0].format("DD/MM/YYYY") // Nếu start date và end date giống nhau, chỉ hiển thị một ngày
                  : `${tempDates[0].format(
                      "DD/MM/YYYY"
                    )} đến ${tempDates[1].format("DD/MM/YYYY")}`
                : "TOÀN THỜI GIAN" // Trường hợp không có dữ liệu hoặc giá trị null
            }
          </h2>
          <Spin className="custom-spin" spinning={loadingRevenue}>
            <div className="flex flex-col sm:flex-row gap-4">
              <div
                className="w-full sm:w-2/3 flex flex-col gap-4 rounded-lg shadow-md p-4"
                style={{ backgroundColor: "#BF9456" }}
              >
                <div className="flex gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-md flex-1">
                    <h3
                      className="text-lg font-bold mb-2"
                      style={{ color: "#33CC66" }}
                    >
                      Doanh thu
                    </h3>
                    <p className="text-gray-700">
                      {formatCurrency(dataRevenue?.totalRevenue)} /
                      {dataRevenue?.numberOfOutsideAppointment +
                        dataRevenue?.numberOfPlatformAppointment}{" "}
                      đơn
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-md flex-1">
                    <h3
                      className="text-lg font-bold mb-2"
                      style={{ color: "#FF9900" }}
                    >
                      Doanh thu lịch hẹn ngoài
                    </h3>
                    <p className="text-gray-700">
                      {formatCurrency(dataRevenue?.outsideRevenue)} /{" "}
                      {dataRevenue?.numberOfOutsideAppointment} đơn
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-md flex-1">
                    <h3
                      className="text-lg font-bold mb-2"
                      style={{ color: "#0099FF" }}
                    >
                      Doanh thu lịch hẹn qua hệ thống
                    </h3>
                    <p className="text-gray-700">
                      {formatCurrency(dataRevenue?.platformRevenue)} /
                      {dataRevenue?.numberOfPlatformAppointment} đơn
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-md flex-1">
                    <h3
                      className="text-lg font-bold mb-2"
                      style={{ color: "#EE0000" }}
                    >
                      Số tiền đã giảm cho khách hàng
                    </h3>
                    <p className="text-gray-700">Số tiền / Số đơn</p>
                  </div>
                </div>
              </div>

              <div
                className="w-full sm:w-1/3 flex flex-col gap-4 mt-4 sm:mt-0 rounded-lg shadow-md p-4"
                style={{ backgroundColor: "#BF9456" }}
              >
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="text-lg font-bold mb-2">
                    Tỉ lệ khách hàng quay lại
                  </h3>
                  <p className="text-gray-700">
                    {parseFloat(
                      dataRevenue?.rateOfReturnCustomers || 0
                    ).toFixed(3)}{" "}
                    %
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="text-lg font-bold mb-2">
                    Giá trị trung bình mỗi đơn đặt lịch
                  </h3>
                  <p className="text-gray-700">
                    {formatCurrency(dataRevenue?.valueAverageOnProduct)}
                  </p>
                </div>
              </div>
            </div>
          </Spin>
        </div>
        {/* Biểu đồ thống kê lịch hẹn */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold mb-4">
            THỐNG KÊ SỐ LỊCH HẸN{" "}
            {
              tempDates && tempDates[0] && tempDates[1]
                ? tempDates[0].isSame(tempDates[1], "day")
                  ? tempDates[0].format("DD/MM/YYYY") // Nếu start date và end date giống nhau, chỉ hiển thị một ngày
                  : `${tempDates[0].format(
                      "DD/MM/YYYY"
                    )} đến ${tempDates[1].format("DD/MM/YYYY")}`
                : "TOÀN THỜI GIAN" // Trường hợp không có dữ liệu hoặc giá trị null
            }
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-2/3">
              <div className="h-auto">
                <div className={styles["table-container"]}>
                  <Spin className="custom-spin" spinning={loadingAppointment}>
                    <Table
                      className={stylesCard.appointmentTable}
                      dataSource={
                        Array.isArray(dataAppointment) ? dataAppointment : []
                      }
                      columns={columnsAppointment}
                      pagination={false}
                      rowKey="appointmentType"
                    />
                    <div className={stylesCard.container}>
                      {dataAppointment?.length === 0 && (
                        <h4
                          style={{
                            fontWeight: "bold",
                            color: "#bf9456",
                            textAlign: "center",
                            fontSize: "1.2rem",
                          }}
                        >
                          Không tìm thấy số liệu nào !!!
                        </h4>
                      )}

                      <div className={stylesCard.grid}>
                        {dataAppointment?.map((service) => (
                          <div
                            key={service.appointmentType}
                            className={stylesCard.card}
                          >
                            <h4>
                              Kiểu lịch hẹn:
                              <span
                                style={{
                                  display: "block",
                                  fontWeight: "bold",
                                  color: "#bf9456",
                                  textAlign: "center",
                                  fontSize: "1rem",
                                }}
                              >
                                {service.appointmentType}
                              </span>
                            </h4>
                            <h4 className={stylesCard.description}>
                              Số lượng lịch hẹn: {service.appointmentQuantity}
                            </h4>
                            <h4 className={stylesCard.description}>
                              Số lượng khách phục vụ: {service.customerQuantity}
                            </h4>
                            <h4>
                              Doanh Thu: {formatCurrency(service.revenue)}
                            </h4>
                            <h4>
                              <button
                                className={stylesCard.buttonCard}
                                onClick={() => {
                                  const status =
                                    appointmentTypeMapping[
                                      service.appointmentType
                                    ];
                                  const formattedDates = tempDates?.map(
                                    (date) =>
                                      date ? date.format("YYYY-MM-DD") : ""
                                  );
                                  navigate(
                                    `/salon_appointment?appoinmentStatus=${status}&startDate=${formattedDates[0]}&endDate=${formattedDates[1]}`
                                  );
                                }}
                              >
                                Chi tiết
                              </button>
                            </h4>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Spin>
                </div>
              </div>
            </div>
            <div className="w-full sm:w-1/3">
              <div className="h-64 sm:h-80">
                <Pie
                  data={pieDataAppointmentRange}
                  options={{ maintainAspectRatio: false }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Biểu đồ thống kê doanh thu */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold mb-4">
            THỐNG KÊ DỊCH VỤ{" "}
            {
              tempDates && tempDates[0] && tempDates[1]
                ? tempDates[0].isSame(tempDates[1], "day")
                  ? tempDates[0].format("DD/MM/YYYY") // Nếu start date và end date giống nhau, chỉ hiển thị một ngày
                  : `${tempDates[0].format(
                      "DD/MM/YYYY"
                    )} đến ${tempDates[1].format("DD/MM/YYYY")}`
                : "TOÀN THỜI GIAN" // Trường hợp không có dữ liệu hoặc giá trị null
            }
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Biểu đồ đường lớn hơn */}
            <div className="w-full">
              <div className="h-auto">
                <div
                  className={classNames(
                    "my-custom-add",
                    styles["table-fillter"]
                  )}
                >
                  <Dropdown
                    overlay={sortMenuService}
                    className={styles["table-fillter-item"]}
                  >
                    <Button>
                      {sortLabelService} <DownOutlined />
                    </Button>
                  </Dropdown>
                </div>
                <div className={styles["table-container"]}>
                  <Spin className="custom-spin" spinning={loadingService}>
                    <Table
                      className={stylesCard.appointmentTable}
                      dataSource={Array.isArray(dataService) ? dataService : []}
                      columns={columnsService}
                      pagination={false}
                      rowKey="id"
                    />
                    <div className={stylesCard.container}>
                      {dataService?.length === 0 && (
                        <h4
                          style={{
                            fontWeight: "bold",
                            color: "#bf9456",
                            textAlign: "center",
                            fontSize: "1.2rem",
                          }}
                        >
                          Không tìm thấy dịch vụ nào !!!
                        </h4>
                      )}

                      <div className={stylesCard.grid}>
                        {dataService?.map((service) => (
                          <div key={service.id} className={stylesCard.card}>
                            <h4>
                              Tên dịch vụ:
                              <span
                                style={{
                                  display: "block",
                                  fontWeight: "bold",
                                  color: "#bf9456",
                                  textAlign: "center",
                                  fontSize: "1rem",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {service.serviceName}
                              </span>
                            </h4>
                            <h4 className={stylesCard.description}>
                              Số lượng phục vụ: {service.numberOfUses}
                            </h4>
                            <h4 className={stylesCard.description}>
                              Số lượng khách phục vụ:{" "}
                              {service.numberOfCustomers}
                            </h4>
                            <h4>
                              Doanh Thu:{" "}
                              {formatCurrency(service.revenueFromService)}
                            </h4>
                            <h4>
                              <button
                                className={stylesCard.buttonCard}
                                onClick={() => {
                                  const service = service.serviceName;
                                  const formattedDates = tempDates?.map(
                                    (date) =>
                                      date ? date.format("YYYY-MM-DD") : ""
                                  );
                                  navigate(
                                    `/salon_appointment?appoinmentStatus=ALL&appoinmentServiceName=${service}&startDate=${formattedDates[0]}&endDate=${formattedDates[1]}`
                                  );
                                }}
                              >
                                Chi tiết
                              </button>
                            </h4>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Spin>
                </div>
                <Pagination
                  className="paginationAppointment"
                  current={currentPageService}
                  pageSize={pageSizeService}
                  total={totalService * pageSizeService}
                  onChange={onPageChangeService}
                  style={{ marginTop: "20px", textAlign: "center" }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold mb-4">
            THỐNG KÊ KHÁCH HÀNG{" "}
            {
              tempDates && tempDates[0] && tempDates[1]
                ? tempDates[0].isSame(tempDates[1], "day")
                  ? tempDates[0].format("DD/MM/YYYY") // Nếu start date và end date giống nhau, chỉ hiển thị một ngày
                  : `${tempDates[0].format(
                      "DD/MM/YYYY"
                    )} đến ${tempDates[1].format("DD/MM/YYYY")}`
                : "TOÀN THỜI GIAN" // Trường hợp không có dữ liệu hoặc giá trị null
            }
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full">
              <div className="h-auto">
                <div
                  className={classNames(
                    "my-custom-add",
                    styles["table-fillter"]
                  )}
                >
                  {/* <Dropdown
                      overlay={dateMenuCustomer}
                      className={styles["table-fillter-item"]}
                    >
                      <Button>
                        {dateLabelCustomer}{" "}
                        {
                          tempDatesCustomer &&
                          tempDatesCustomer[0] &&
                          tempDatesCustomer[1]
                            ? tempDatesCustomer[0].isSame(
                                tempDatesCustomer[1],
                                "day"
                              )
                              ? tempDatesCustomer[0].format("DD/MM/YYYY") // Nếu start date và end date giống nhau, chỉ hiển thị một ngày
                              : `${tempDatesCustomer[0].format(
                                  "DD/MM/YYYY"
                                )} đến ${tempDatesCustomer[1].format(
                                  "DD/MM/YYYY"
                                )}`
                            : "" 
                        }
                      </Button>
                    </Dropdown> */}

                  <Dropdown
                    overlay={sortMenuCustomer}
                    className={styles["table-fillter-item"]}
                  >
                    <Button>
                      {sortLabelCustomer} <DownOutlined />
                    </Button>
                  </Dropdown>
                  <Dropdown
                    overlay={fillterMenuCustomer}
                    className={styles["table-fillter-item"]}
                  >
                    <Button>
                      {fillterLabelCustomer} <DownOutlined />
                    </Button>
                  </Dropdown>
                </div>
                <h2 className="text-sm sm:text-sm font-bold mb-4">
                  TỔNG {totalCustomer} KHÁCH HÀNG
                </h2>
                <div className={styles["table-container"]}>
                  <Spin className="custom-spin" spinning={loadingCustomer}>
                    <Table
                      className={stylesCard.appointmentTable}
                      dataSource={
                        Array.isArray(dataCustomer) ? dataCustomer : []
                      }
                      columns={columnsCustomer}
                      pagination={false}
                      rowKey="id"
                    />
                    <div className={stylesCard.container}>
                      {dataCustomer?.length === 0 && (
                        <h4
                          style={{
                            fontWeight: "bold",
                            color: "#bf9456",
                            textAlign: "center",
                            fontSize: "1.2rem",
                          }}
                        >
                          Không tìm thấy khách hàng nào !!!
                        </h4>
                      )}

                      <div className={stylesCard.grid}>
                        {dataCustomer?.map((service) => (
                          <div key={service.id} className={stylesCard.card}>
                            <h4>
                              Tên khách hàng:
                              <span
                                style={{
                                  display: "block",
                                  fontWeight: "bold",
                                  color: "#bf9456",
                                  textAlign: "center",
                                  fontSize: "1rem",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {service.name}
                              </span>
                            </h4>
                            <h4 className={stylesCard.description}>
                              Số điện thoại: {service.phone}
                            </h4>
                            <h4 className={stylesCard.description}>
                              Số cuộc hẹn: {service.numberofSuccessAppointment}
                            </h4>
                            <h4 className={stylesCard.description}>
                              Dịch vụ:{" "}
                              <span>
                                {service &&
                                service?.userService &&
                                service?.userService?.length > 0
                                  ? service?.userService?.join(", ")
                                  : "Không có dịch vụ"}
                              </span>
                            </h4>
                            <h4>
                              Số tiền: {formatCurrency(service.totalPrice)}
                            </h4>
                            <h4>
                              <button
                                className={stylesCard.buttonCard}
                                onClick={() => {
                                  const service = service.name;
                                  const formattedDates = tempDates?.map(
                                    (date) =>
                                      date ? date.format("YYYY-MM-DD") : ""
                                  );
                                  navigate(
                                    `/salon_appointment?appoinmentStatus=ALL&appoinmentCustomerName=${service}&startDate=${formattedDates[0]}&endDate=${formattedDates[1]}`
                                  );
                                }}
                              >
                                Chi tiết
                              </button>
                            </h4>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Spin>
                </div>
                <Pagination
                  className="paginationAppointment"
                  current={currentPageCustomer}
                  pageSize={pageSizeCustomer}
                  total={totalCustomer}
                  onChange={onPageChangeCustomer}
                  style={{ marginTop: "20px", textAlign: "center" }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-lg sm:text-xl font-bold mb-4">
            THỐNG KÊ TỪNG NHÂN VIÊN{" "}
            {
              tempDates && tempDates[0] && tempDates[1]
                ? tempDates[0].isSame(tempDates[1], "day")
                  ? tempDates[0].format("DD/MM/YYYY") // Nếu start date và end date giống nhau, chỉ hiển thị một ngày
                  : `${tempDates[0].format(
                      "DD/MM/YYYY"
                    )} đến ${tempDates[1].format("DD/MM/YYYY")}`
                : "TOÀN THỜI GIAN" // Trường hợp không có dữ liệu hoặc giá trị null
            }
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Biểu đồ đường lớn hơn */}
            <div className="w-full">
              <div className="h-auto">
                <div
                  className={classNames(
                    "my-custom-add",
                    styles["table-fillter"]
                  )}
                >
                  <Dropdown
                    overlay={sortMenuEmployee}
                    className={styles["table-fillter-item"]}
                  >
                    <Button>
                      {sortLabelEmployee} <DownOutlined />
                    </Button>
                  </Dropdown>
                </div>
                <div className={styles["table-container"]}>
                  <Spin className="custom-spin" spinning={loadingEmployee}>
                    <Table
                      className={stylesCard.appointmentTable}
                      dataSource={
                        Array.isArray(dataEmployee) ? dataEmployee : []
                      }
                      columns={columnsEmployee}
                      pagination={false}
                      rowKey="id"
                    />
                    <div className={stylesCard.container}>
                      {dataEmployee?.length === 0 && (
                        <h4
                          style={{
                            fontWeight: "bold",
                            color: "#bf9456",
                            textAlign: "center",
                            fontSize: "1.2rem",
                          }}
                        >
                          Không tìm thấy nhân viên nào !!!
                        </h4>
                      )}

                      <div className={stylesCard.grid}>
                        {dataEmployee?.map((service) => (
                          <div key={service.id} className={stylesCard.card}>
                            <h4>
                              Tên nhân viên:
                              <span
                                style={{
                                  display: "block",
                                  fontWeight: "bold",
                                  color: "#bf9456",
                                  textAlign: "center",
                                  fontSize: "1rem",
                                }}
                              >
                                {service.fullName}
                              </span>
                            </h4>
                            <h4 className={stylesCard.description}>
                              Số lượng dịch vụ: {service.numberOfService}
                            </h4>
                            <h4 className={stylesCard.description}>
                              Số lượng khách phục vụ:
                              {service.numberOfUsers}
                            </h4>
                            <h4>
                              Doanh Thu: {formatCurrency(service.revenue)}
                            </h4>
                            <h4>
                              <button
                                className={stylesCard.buttonCard}
                                onClick={() => {
                                  const employeeName = service.fullName;
                                  const formattedDates = tempDates?.map(
                                    (date) =>
                                      date ? date.format("YYYY-MM-DD") : ""
                                  );
                                  navigate(
                                    `/salon_appointment?appoinmentStatus=ALL&appoinmentEmployeeName=${employeeName}&startDate=${formattedDates[0]}&endDate=${formattedDates[1]}`
                                  );
                                }}
                              >
                                Chi tiết
                              </button>
                            </h4>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Spin>
                </div>
                <Pagination
                  className="paginationAppointment"
                  current={currentPageEmployee}
                  pageSize={pageSizeEmployee}
                  total={total * pageSizeEmployee}
                  onChange={onPageChangeEmployee}
                  style={{ marginTop: "20px", textAlign: "center" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`${styles.appointmentContainer} bg-customGray min-h-screen p-4 sm:p-8`}
      >
        <h1 className="text-2xl font-bold mb-3" style={{ textAlign: "center" }}>
          Thống kê theo năm
        </h1>
        <div className="flex flex-col items-center mb-6">
          <div className="flex flex-wrap justify-center items-center space-x-2 sm:space-x-4">
            {/* Nút cuộn trái */}
            <button
              onClick={() => handleYearScroll("prev")}
              className={`text-lg sm:text-xl font-bold p-2 ${
                startIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={startIndex === 0}
            >
              &lt;
            </button>

            {/* Danh sách các năm */}
            <motion.div
              className="flex flex-wrap justify-center items-center bg-customYellow px-2 py-1 sm:px-4 sm:py-2 rounded-full space-x-2 sm:space-x-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {visibleYears.map((year) => (
                <motion.div
                  key={year}
                  className={`text-base sm:text-xl font-bold px-2 sm:px-4 py-1 sm:py-2 cursor-pointer rounded-full transition-all ${
                    activeYear === year
                      ? "bg-customGold text-white"
                      : "bg-transparent text-black"
                  }`}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleYearClick(year)}
                >
                  {year}
                </motion.div>
              ))}
            </motion.div>

            {/* Nút cuộn phải */}
            <button
              onClick={() => handleYearScroll("next")}
              className={`text-lg sm:text-xl font-bold p-2 ${
                startIndex + 4 >= years.length
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={startIndex + 4 >= years.length}
            >
              &gt;
            </button>
          </div>
        </div>

        {/* Biểu đồ thống kê lịch hẹn */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold mb-4">
            THỐNG KÊ DOANH THU NĂM {activeYear}
          </h2>
          <Spin className="custom-spin" spinning={isLoading}>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Biểu đồ đường lớn hơn */}
              <div className="w-full sm:w-2/3">
                <div className="h-64 sm:h-80 lg:h-96">
                  <Line
                    data={lineData}
                    options={{ maintainAspectRatio: false }}
                  />
                </div>
              </div>

              {/* Biểu đồ tròn */}
              <div className="w-full sm:w-1/3">
                <div className="h-64 sm:h-80">
                  <Pie
                    data={pieData}
                    options={{ maintainAspectRatio: false }}
                  />
                </div>
              </div>
            </div>
          </Spin>
        </div>

        {/* Biểu đồ thống kê doanh thu */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-lg sm:text-xl font-bold mb-4">
            THỐNG KÊ LỊCH HẸN NĂM {activeYear}
          </h2>
          <Spin className="custom-spin" spinning={isLoading}>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Biểu đồ đường lớn hơn */}
              <div className="w-full sm:w-2/3">
                <div className="h-64 sm:h-80 lg:h-96">
                  <Line
                    data={lineDataAppointment}
                    options={{ maintainAspectRatio: false }}
                  />
                </div>
              </div>

              {/* Biểu đồ tròn */}
              <div className="w-full sm:w-1/3">
                <div className="h-64 sm:h-80">
                  <Pie
                    data={pieDataAppointment}
                    options={{ maintainAspectRatio: false }}
                  />
                </div>
              </div>
            </div>
          </Spin>
        </div>
      </div>
      <div
        className={`${styles.appointmentContainer} bg-customGray min-h-screen p-4 sm:p-8`}
      >
        <h1 className="text-2xl font-bold mb-3" style={{ textAlign: "center" }}>
          Đánh giá
        </h1>
        <div
          className={classNames("my-custom-add", styles["table-fillter"])}
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <Dropdown
            overlay={dateMenuFeedback}
            className="custom-dropdown-range-picker"
          >
            <Button>
              {dateLabelFeedback}{" "}
              {tempDatesFeedback && tempDatesFeedback[0] && tempDatesFeedback[1]
                ? tempDatesFeedback[0].isSame(tempDatesFeedback[1], "day")
                  ? tempDatesFeedback[0].format("DD/MM/YYYY") // Nếu start date và end date giống nhau, chỉ hiển thị một ngày
                  : `${tempDatesFeedback[0].format(
                      "DD/MM/YYYY"
                    )} đến ${tempDatesFeedback[1].format("DD/MM/YYYY")}`
                : ""}
            </Button>
          </Dropdown>
        </div>
        {/* Biểu đồ thống kê lịch hẹn */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold mb-4">
            BẢNG ĐÁNH GIÁ NHÂN VIÊN{" "}
            {
              tempDates && tempDates[0] && tempDates[1]
                ? tempDates[0].isSame(tempDates[1], "day")
                  ? tempDates[0].format("DD/MM/YYYY") // Nếu start date và end date giống nhau, chỉ hiển thị một ngày
                  : `${tempDates[0].format(
                      "DD/MM/YYYY"
                    )} đến ${tempDates[1].format("DD/MM/YYYY")}`
                : "TOÀN THỜI GIAN" // Trường hợp không có dữ liệu hoặc giá trị null
            }
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full">
              <Spin className="custom-spin" spinning={loadingFeedbackEmployee}>
                <div className="h-64 sm:h-80">
                  <Bar
                    data={chartDataRatingEmloyee}
                    options={horizontalRatingEmloyee}
                  />
                </div>
              </Spin>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold mb-4">
            BẢNG ĐÁNH GIÁ DỊCH VỤ{" "}
            {
              tempDates && tempDates[0] && tempDates[1]
                ? tempDates[0].isSame(tempDates[1], "day")
                  ? tempDates[0].format("DD/MM/YYYY") // Nếu start date và end date giống nhau, chỉ hiển thị một ngày
                  : `${tempDates[0].format(
                      "DD/MM/YYYY"
                    )} đến ${tempDates[1].format("DD/MM/YYYY")}`
                : "TOÀN THỜI GIAN" // Trường hợp không có dữ liệu hoặc giá trị null
            }
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full">
              <div className="h-64 sm:h-80">
                <Bar
                  data={chartDataRatingService}
                  options={horizontalRatingService}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold mb-4">
            THỐNG KÊ ĐÁNH GIÁ TRÊN HỆ THỐNG
          </h2>

          <div>
            <div
              className={style["review-fillter"]}
              // style={{ justifyContent: "flex-start" }}
            >
              <div
                onClick={() =>
                  handleFeedbackAction({ rating: null, keepForm: true })
                }
                className={style["fillter-item1"]}
                style={{ fontSize: 14 }}
              >
                {filterRating === null ? (
                  <CheckSquareOutlined
                    style={{ marginRight: 8, fontSize: 24 }}
                  />
                ) : (
                  <BorderOutlined style={{ marginRight: 8, fontSize: 24 }} />
                )}
                Tất cả
              </div>
              {[5, 4, 3, 2, 1].map((rating) => (
                <div
                  key={rating}
                  onClick={() =>
                    handleFeedbackAction({
                      rating: rating,
                      keepForm: true,
                    })
                  }
                  className={style["fillter-item1"]}
                  style={{ fontSize: 14 }}
                >
                  {filterRating === rating ? (
                    <CheckSquareOutlined
                      style={{ marginRight: 8, fontSize: 24 }}
                    />
                  ) : (
                    <BorderOutlined style={{ marginRight: 8, fontSize: 24 }} />
                  )}
                  {rating} sao
                </div>
              ))}
            </div>
            <div
              className={classNames(
                "my-custom-add",
                stylesFillter["table-fillter"]
              )}
            >
              <Dropdown
                overlay={sortStatus}
                className={stylesFillter["table-fillter-item"]}
              >
                <Button style={{ color: "#fff" }}>
                  {sortLabelStatus} <DownOutlined />
                </Button>
              </Dropdown>
              <DatePicker
                className={stylesFillter["table-fillter-item"]}
                style={{ backgroundColor: "#ece8de" }}
                format={"YYYY-MM-DD"}
                disabledDate={(current) =>
                  current && current.isAfter(new Date())
                }
                placeholder="Tìm kiếm theo ngày"
                value={
                  dateCommentFilter
                    ? dayjs(dateCommentFilter, "YYYY-MM-DD")
                    : null
                }
                onChange={handleDateChangeFeedback}
              />
              <Input
                placeholder="Tìm kiếm theo tên dịch vụ"
                className={stylesFillter["table-fillter-item"]}
                style={{ maxWidth: "23rem", backgroundColor: "#ece8de" }}
                value={searchEmployee} // Liên kết state với giá trị input
                onChange={(e) => {
                  setSearchEmployee(e.target.value);
                  setIsSearch(false);
                }} // Cập nhật state khi người dùng nhập
              />
              <div className={stylesFillter["table-fillter-item"]}>
                <Button
                  icon={!isSearch ? <SearchOutlined /> : <DeleteOutlined />}
                  type="link"
                  variant="outlined"
                  className={style.replyButton}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "10px", // Thêm khoảng cách nếu là nút tìm kiếm
                    borderColor: !isSearch ? "#1890ff" : "#ff4d4f", // Màu sắc khác nhau cho từng trạng thái
                    color: "#fff",
                  }}
                  onClick={() =>
                    handleFeedbackAction({
                      isSearchConfirm: !isSearch,
                      keepForm: !isSearch,
                    })
                  }
                >
                  {!isSearch ? "Áp dụng" : "Xóa"}
                </Button>
              </div>
            </div>
            <h2 className="text-sm sm:text-sm font-bold mb-4">
              TỔNG CÓ {totalPagesFeedback} NHẬN XÉT
            </h2>
            <List
              itemLayout="horizontal"
              locale={{
                emptyText:
                  listFeedback.length > 0
                    ? `Không có đánh giá ${filterRating} sao nào`
                    : "Không có đánh giá nào",
              }}
              loading={loadingFeedback}
              dataSource={listFeedback}
              renderItem={(feedback) => (
                <List.Item
                  className={style.listItem}
                  actions={[
                    <>
                      <Button
                        type="link"
                        variant="outlined"
                        // onClick={() => handleReply(feedback)}
                        style={{ borderColor: "#BF9456", color: "#BF9456" }}
                        className={style.replyButton}
                      >
                        Trả lời
                      </Button>
                    </>,
                  ]}
                >
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
                          {renderStars2(feedback?.rating)}
                        </div>
                        <p className={style.commentFeedback}>
                          {feedback.comment}
                        </p>
                        <div className={style["feedback-images"]}>
                          {feedback.fileFeedbacks?.map((e, index) => (
                            <Image
                              key={index}
                              src={e.img}
                              alt={`Feedback Image ${index}`}
                              className={style["feedback-image"]}
                              preview={true} // Enable image preview
                            />
                          ))}
                        </div>
                      </div>
                    }
                    className={style.listItemMeta}
                  />
                </List.Item>
              )}
            />

            <div className={style["rating"]}>
              <Pagination
                current={currentPageFeedback}
                total={totalPagesFeedback}
                pageSize={pageSizeFeedback}
                onChange={(page) => setCurrentPageFeedback(page)}
                className="paginationAppointment"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RevenueYearPage;
