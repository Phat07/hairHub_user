import { Line, Pie } from "react-chartjs-2";
import { motion } from "framer-motion";
import styles from "../css/reviewAppointment.module.css";
import stylesCard from "../css/customerAppointment.module.css";
import "../css/revenue.css";
import { useEffect, useState } from "react";
import classNames from "classnames";
import {
  Button,
  DatePicker,
  Dropdown,
  Menu,
  message,
  Pagination,
  Spin,
  Table,
  Tag,
} from "antd";
import dayjs from "dayjs";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { actGetSalonInformationByOwnerIdAsync } from "@/store/salonAppointments/action";
import { API } from "@/services/api";
const RevenueYearPage = () => {
  const { RangePicker } = DatePicker;
  const [currentPageService, setCurrentPageService] = useState(1);
  const [pageSizeService, setPageSizeService] = useState(4);
  const [sortLabelService, setSortLabelService] = useState(
    "Số lượng sử dụng tăng dần"
  );
  const [sortService, setSortService] = useState("sử dụng tăng dần");
  const [currentPageEmployee, setCurrentPageEmployee] = useState(1);
  const [pageSizeEmployee, setPageSizeEmployee] = useState(4);
  const [total, setTotal] = useState(1);
  const [totalService, setTotalService] = useState(1);
  const [sortLabelEmployee, setSortLabelEmployee] = useState(
    "Số lượng dịch vụ tăng dần"
  );
  const [dataEmployee, setDataEmplyee] = useState([]);
  const [dataService, setDataService] = useState([]);
  const [sortEmployee, setSortEmployee] = useState("dịch vụ tăng dần");
  const [startIndex, setStartIndex] = useState(0); // Vị trí bắt đầu hiển thị
  const [activeYear, setActiveYear] = useState(null); // Năm đang được chọn
  const years = Array.from({ length: 30 }, (_, i) => 2023 + i); // Danh sách năm từ 2020 đến 2030
  const visibleYears = years.slice(startIndex, startIndex + 4); // Lấy 4 năm để hiển thị

  const [dataRevenue, setDataRevenue] = useState({});
  const [tempDates, setTempDates] = useState([
    dayjs().subtract(7, "day"), // Ngày bắt đầu
    dayjs(), // Ngày kết thúc
  ]);

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

  //   useEffect(() => {
  //     const fetchData = async (url, params, setData) => {
  //       setLoading(true);
  //       try {
  //         const response = await API.get(url, { params });
  //         setData(response.data);
  //       } catch (error) {
  //         console.error("Error fetching data:", error);
  //       } finally {
  //         setLoading(false);
  //       }
  //     };
  //     const formattedDates = tempDates?.map((date) =>
  //       dayjs(date.$d).format("YYYY-MM-DD")
  //     );
  //     const compileEmployeeUrl = `/saloninformations/CompileEmployeeSalon/${salonInformationByOwnerId?.id}`;
  //     const compileRevenuetUrl = `/saloninformations/RevenueStatistics/${salonInformationByOwnerId?.id}`;
  //     const compileServicetUrl = `/saloninformations/ServiceStatistics/${salonInformationByOwnerId?.id}`;
  //     if (
  //       salonInformationByOwnerId?.id &&
  //       sortEmployee &&
  //       tempDates &&
  //       sortService &&
  //       currentPageEmployee &&
  //       currentPageService
  //     ) {
  //       fetchData(
  //         compileEmployeeUrl,
  //         {
  //           startDate: formattedDates[0],
  //           endDate: formattedDates[1],
  //           filter: sortEmployee,
  //           page: currentPageEmployee,
  //           size: pageSizeEmployee,
  //         },
  //         (data) => {
  //           console.log("da1", data);

  //           setDataEmplyee(data?.employeeStatictis);
  //         }
  //       );
  //       fetchData(
  //         compileServicetUrl,
  //         {
  //           startDate: formattedDates[0],
  //           endDate: formattedDates[1],
  //           filter: sortService,
  //           page: currentPageService,
  //           size: pageSizeService,
  //         },
  //         (data) => {
  //           console.log("data", data);
  //           setDataService(data.items);
  //           setTotalService(data?.totalPages)
  //         }
  //       );

  //       // Fetch appointment data if salon ID and activeYear exist
  //       fetchData(
  //         compileRevenuetUrl,
  //         { startDate: formattedDates[0], endDate: formattedDates[1] },
  //         (data) => {
  //           setDataRevenue(data);
  //         }
  //       );
  //     }
  //   }, [
  //     tempDates,
  //     salonInformationByOwnerId,
  //     sortEmployee,
  //     sortService,
  //     currentPageEmployee,
  //     currentPageService,
  //     pageSizeEmployee,
  //     pageSizeService,
  //   ]);
  const [loadingEmployee, setLoadingEmployee] = useState(false);
  const [loadingService, setLoadingService] = useState(false);
  const [loadingRevenue, setLoadingRevenue] = useState(false);
  const fetchData = async (url, params, setData) => {
    try {
      const response = await API.get(url, { params });
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

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
        dayjs(date.$d).format("YYYY-MM-DD")
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
        dayjs(date.$d).format("YYYY-MM-DD")
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
    if (salonInformationByOwnerId?.id && tempDates) {
      setLoadingRevenue(true);
      const compileRevenuetUrl = `/saloninformations/RevenueStatistics/${salonInformationByOwnerId.id}`;
      const formattedDates = tempDates?.map((date) =>
        dayjs(date.$d).format("YYYY-MM-DD")
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
    setSortLabelService(
      e.key === "" ? "sử dụng tăng dần" : `Sắp xếp theo ${e.key}`
    );
  };

  const sortMenuService = (
    <Menu onClick={handleMenuClickServiceSort}>
      {/* <Menu.Item key="">Không sắp xếp</Menu.Item> */}
      <Menu.Item key="sử dụng tăng dần">Số lượng sử dụng tăng dần</Menu.Item>
      <Menu.Item key="sử dụng giảm dần">Số lượng sử dụng giảm dần</Menu.Item>
      <Menu.Item key="khách tăng dần">Số lượng khách tăng dần</Menu.Item>
      <Menu.Item key="khách giảm dần">Số lượng khách giảm dần</Menu.Item>
      <Menu.Item key="doanh thu tăng dần">Số doanh thu tăng dần</Menu.Item>
      <Menu.Item key="doanh thu giảm dần">Số doanh thu giảm dần</Menu.Item>
    </Menu>
  );

  const handleMenuClickEmployeeSort = (e) => {
    setCurrentPageEmployee(1);
    setSortEmployee(e.key);
    setSortLabelEmployee(
      e.key === "" ? "sử dụng tăng dần" : `Sắp xếp theo ${e.key}`
    );
  };

  const sortMenuEmployee = (
    <Menu onClick={handleMenuClickEmployeeSort}>
      {/* <Menu.Item key="">Không sắp xếp</Menu.Item> */}
      <Menu.Item key="dịch vụ tăng dần">Số lượng dịch vụ tăng dần</Menu.Item>
      <Menu.Item key="dịch vụ giảm dần">Số lượng dịch vụ giảm dần</Menu.Item>
      <Menu.Item key="khách tăng dần">Số lượng khách tăng dần</Menu.Item>
      <Menu.Item key="khách giảm dần">Số lượng khách giảm dần</Menu.Item>
      <Menu.Item key="doanh thu tăng dần">Số doanh thu tăng dần</Menu.Item>
      <Menu.Item key="doanh thu giảm dần">Số doanh thu giảm dần</Menu.Item>
    </Menu>
  );

  const columnsAppointment = [
    {
      title: "Kiểu lịch hẹn",
      dataIndex: "AppointmentType",
      key: "AppointmentType",
      align: "center",
    },
    {
      title: "Số lượng lịch hẹn",
      dataIndex: "AppointmentNumber",
      key: "AppointmentNumber",
      align: "center",
    },
    {
      title: "Số lượng khách phục vụ",
      dataIndex: "NumberPeopleService",
      align: "center",
      key: "NumberPeopleService",
    },
    {
      title: "Doanh Thu",
      dataIndex: "AppointmentRevenue",
      key: "AppointmentRevenue",
      align: "center",
      render: (AppointmentRevenue) => formatCurrency(AppointmentRevenue),
    },
    {
      title: "Chi tiết",
      key: "action",
      align: "center",
      render: (_, record) => (
        <button
          className={stylesCard.buttonCard}
          onClick={() =>
            console.log(`Kiểu lịch hẹn: ${record.AppointmentType}`)
          }
        >
          Chi tiết
        </button>
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
        <button
          className={stylesCard.buttonCard}
          onClick={() =>
            console.log(`Kiểu lịch hẹn: ${record.AppointmentType}`)
          }
        >
          Chi tiết
        </button>
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
        <button
          className={stylesCard.buttonCard}
          onClick={() =>
            console.log(`Kiểu lịch hẹn: ${record?.AppointmentType}`)
          }
        >
          Chi tiết
        </button>
      ),
    },
  ];

  const dataSource = [
    {
      id: "1",
      AppointmentType: "Lịch hẹn ngoài",
      AppointmentNumber: 25,
      NumberPeopleService: 20,
      AppointmentRevenue: 5000000,
      isActive: true,
    },
    {
      id: "2",
      AppointmentType: "Lịch hẹn qua hệ thống",
      AppointmentNumber: 15,
      NumberPeopleService: 12,
      AppointmentRevenue: 3000000,
      isActive: false,
    },
    {
      id: "3",
      AppointmentType: "Lịch hẹn bị hủy",
      AppointmentNumber: 10,
      NumberPeopleService: 8,
      AppointmentRevenue: 4000000,
      isActive: true,
    },
    {
      id: "3",
      AppointmentType: "Lịch hẹn thất bại",
      AppointmentNumber: 10,
      NumberPeopleService: 8,
      AppointmentRevenue: 4000000,
      isActive: true,
    },
  ];

  const handleDateChange = (dates) => {
    setTempDates(dates); // Lưu ngày tạm thời
    console.log("date", dates);
  };

  const handleFilter = () => {
    if (tempDates && tempDates.length === 2) {
      const [startDate, endDate] = tempDates; // Lấy ngày bắt đầu và kết thúc
      setSelectedStartDates(startDate.format("YYYY-MM-DD")); // Lưu ngày bắt đầu
      setSelectedEndDates(endDate.format("YYYY-MM-DD")); // Lưu ngày kết thúc
    } else {
      message.error("Vui lòng chọn khoảng thời gian.");
    }
  };

  const onPageChangeEmployee = (page) => {
    setCurrentPageEmployee(page);
  };
  const onPageChangeService = (page) => {
    setCurrentPageService(page);
  };

  return (
    <>
      <div
        className={`${styles.appointmentContainer} bg-customGray min-h-screen p-4 sm:p-8`}
      >
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
            THỐNG KÊ LỊCH HẸN NĂM {activeYear}
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
            THỐNG KÊ DOANH THU NĂM {activeYear}
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
            onChange={handleDateChange}
            defaultValue={tempDates}
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
            THỐNG KÊ TỪ{" "}
            {tempDates?.[0]
              ? dayjs(tempDates[0].$d).format("YYYY-MM-DD")
              : " ? "}{" "}
            đến{" "}
            {tempDates?.[1]
              ? dayjs(tempDates[1].$d).format("YYYY-MM-DD")
              : " ? "}
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
                        dataRevenue?.numberOfPlatformAppointment}
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
                      {dataRevenue?.numberOfOutsideAppointment}
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
                      {dataRevenue?.numberOfPlatformAppointment}
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
                    Tỉ lệ khách hàng quay lại:
                  </h3>
                  <p className="text-gray-700">{parseFloat(dataRevenue?.rateOfReturnCustomers || 0).toFixed(3)} %</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="text-lg font-bold mb-2">
                    Giá trị trung bình mỗi đơn hàng: 
                  </h3>
                  <p className="text-gray-700">{formatCurrency(dataRevenue?.valueAverageOnProduct)}</p>
                </div>
              </div>
            </div>
          </Spin>
        </div>
        {/* Biểu đồ thống kê lịch hẹn */}
        {/* <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold mb-4">
                THỐNG KÊ SỐ LỊCH HẸN TỪ{" "}
                {tempDates?.[0]
                ? dayjs(tempDates[0].$d).format("YYYY-MM-DD")
                : "N/A"}{" "}
                đến{" "}
                {tempDates?.[1]
                ? dayjs(tempDates[1].$d).format("YYYY-MM-DD")
                : "N/A"}
            </h2>
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-2/3">
                <div className="h-auto">
                    <div className={styles["table-container"]}>
                    <Spin className="custom-spin" spinning={loading}>
                        <Table
                        className={stylesCard.appointmentTable}
                        dataSource={dataSource}
                        columns={columnsAppointment}
                        pagination={false}
                        rowKey="id"
                        />
                        <div className={stylesCard.container}>
                        {dataSource?.length === 0 && (
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
                            {dataSource?.map((service) => (
                            <div key={service.id} className={stylesCard.card}>
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
                                    {service.AppointmentType}
                                </span>
                                </h4>
                                <h4 className={stylesCard.description}>
                                Số lượng lịch hẹn: {service.AppointmentNumber}
                                </h4>
                                <h4 className={stylesCard.description}>
                                Số lượng khách phục vụ:{" "}
                                {service.NumberPeopleService}
                                </h4>
                                <h4>
                                Doanh Thu:{" "}
                                {formatCurrency(service.AppointmentRevenue)}
                                </h4>
                                <h4>
                                <button
                                    className={stylesCard.buttonCard}
                                    onClick={() =>
                                    console.log(
                                        `Kiểu lịch hẹn: ${service.AppointmentType}`
                                    )
                                    }
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
                    <Pie data={pieData} options={{ maintainAspectRatio: false }} />
                </div>
                </div>
            </div>
            </div> */}

        {/* Biểu đồ thống kê doanh thu */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold mb-4">
            THỐNG KÊ DỊCH VỤ TỪ{" "}
            {tempDates?.[0]
              ? dayjs(tempDates[0].$d).format("YYYY-MM-DD")
              : " ? "}{" "}
            đến{" "}
            {tempDates?.[1]
              ? dayjs(tempDates[1].$d).format("YYYY-MM-DD")
              : " ? "}
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
                      {dataSource?.length === 0 && (
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
                        {dataSource?.map((service) => (
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
                                onClick={() =>
                                  console.log(
                                    `Kiểu lịch hẹn: ${service.AppointmentType}`
                                  )
                                }
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
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-lg sm:text-xl font-bold mb-4">
            THỐNG KÊ TỪNG NHÂN VIÊN TỪ{" "}
            {tempDates?.[0]
              ? dayjs(tempDates[0].$d).format("YYYY-MM-DD")
              : " ? "}{" "}
            đến{" "}
            {tempDates?.[1]
              ? dayjs(tempDates[1].$d).format("YYYY-MM-DD")
              : " ? "}
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
                      {dataSource?.length === 0 && (
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
                                onClick={() =>
                                  console.log(
                                    `Kiểu lịch hẹn: ${service.AppointmentType}`
                                  )
                                }
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
    </>
  );
};

export default RevenueYearPage;
