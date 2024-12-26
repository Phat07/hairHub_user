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
const OverviewSalon = () => {
  const navigate = useNavigate();
  const { RangePicker } = DatePicker;
  const [tempDates, setTempDates] = useState(() => dayjs());
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const ownerId = useSelector((state) => state.ACCOUNT.idOwner);
  const [customer, setCustomer] = useState(null);
  const [dataAppointment, setDataAppointment] = useState([]);
  const [pieData, setPieData] = useState({
    labels: ["Không có dữ liệu"],
    datasets: [
      {
        label: "Tỷ lệ lịch hẹn",
        data: [100], // Giá trị mặc định
        backgroundColor: ["#d3d3d3"], // Màu xám
        hoverBackgroundColor: ["#d3d3d3"],
      },
    ],
  });
  const [pieDataCustomer, setPieDataCustomer] = useState({
    labels: ["Không có dữ liệu"], // Nhãn mặc định
    datasets: [
      {
        label: "Phân loại khách hàng",
        data: [100], // Giá trị mặc định
        backgroundColor: ["#d3d3d3"], // Màu xám
        hoverBackgroundColor: ["#d3d3d3"], // Màu xám khi di chuột
      },
    ],
  });
  // const [loadingAppointment, setLoadingAppointment] = useState(false);
  const [sortEmployee, setSortEmployee] = useState("Số lượng dịch vụ giảm dần");
  const [currentPageEmployee, setCurrentPageEmployee] = useState(1);
  const [pageSizeEmployee, setPageSizeEmployee] = useState(4);
  const [total, setTotal] = useState(1);
  const [dataEmployee, setDataEmplyee] = useState([]);
  const [dataRevenue, setDataRevenue] = useState(null);
  const [chartDataService, setChartDataService] = useState({
    labels: [],
    datasets: [
      {
        label: "Số người phục vụ",
        data: [],
        backgroundColor: "#36A2EB",
        borderColor: "#2a8cd6",
        borderWidth: 1,
      },
    ],
  });

  const [horizontalBarData, setHorizontalBarData] = useState({
    labels: [],
    datasets: [
      {
        label: "Số người phục vụ",
        data: [],
        backgroundColor: [
          "#3B82F6",
          "#22C55E",
          "#8B5CF6",
          "#FF9AA2",
          "#36A2EB",
        ],
        borderWidth: 1,
      },
    ],
  });
  const [lineChartRevenue, setLineChartRevenue] = useState({
    labels: [], // Hours (X-axis labels)
    datasets: [
      {
        label: "Doanh thu ngoài",
        data: [], // Outside revenue
        borderColor: "rgba(255, 99, 132, 1)", // Line color
        backgroundColor: "rgba(255, 99, 132, 0.2)", // Fill color (if applicable)
        fill: false, // No area fill under the line
      },
      {
        label: "Doanh thu nền tảng",
        data: [], // Platform revenue
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: false,
      },
      {
        label: "Tổng doanh thu",
        data: [], // Total revenue
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: false,
      },
    ],
  });
  const [pieCharRevenue, setPieCharRevenue] = useState({
    labels: ["Không có dữ liệu"], // Nhãn mặc định
    datasets: [
      {
        data: [100], // Giá trị mặc định
        backgroundColor: ["#d3d3d3"], // Màu xám
        hoverBackgroundColor: ["#d3d3d3"], // Màu xám khi hover
      },
    ],
  });

  useEffect(() => {
    if (dataRevenue) {
      const outsideRevenue = dataRevenue?.outsideRevenue || 0;
      const platformRevenue = dataRevenue?.platformRevenue || 0;

      if (outsideRevenue > 0 || platformRevenue > 0) {
        // Có dữ liệu hợp lệ
        setPieCharRevenue({
          labels: ["Doanh thu ngoài hệ thống", "Doanh thu trong hệ thống"],
          datasets: [
            {
              data: [outsideRevenue, platformRevenue], // Dữ liệu thực tế
              backgroundColor: ["#22C55E", "#8B5CF6"], // Màu sắc thực tế
              hoverBackgroundColor: ["#16A34A", "#7C3AED"], // Màu hover thực tế
            },
          ],
        });
      } else {
        // Không có dữ liệu (cả hai đều bằng 0)
        setPieCharRevenue({
          labels: ["Không có dữ liệu"],
          datasets: [
            {
              data: [100], // Giá trị mặc định
              backgroundColor: ["#d3d3d3"], // Màu xám
              hoverBackgroundColor: ["#d3d3d3"], // Màu xám khi hover
            },
          ],
        });
      }
    } else {
      // Trường hợp `dataRevenue` không tồn tại
      setPieCharRevenue({
        labels: ["Không có dữ liệu"],
        datasets: [
          {
            data: [100], // Giá trị mặc định
            backgroundColor: ["#d3d3d3"], // Màu xám
            hoverBackgroundColor: ["#d3d3d3"], // Màu xám khi hover
          },
        ],
      });
    }
  }, [dataRevenue]);

  const salonInformationByOwnerId = useSelector(
    (state) => state.SALONAPPOINTMENTS.salonInformationByOwnerId
  );
  useEffect(() => {
    if (ownerId) {
      dispatch(actGetSalonInformationByOwnerIdAsync(ownerId));
    }
  }, [ownerId]);
  const handleDateChange = (date) => {
    setTempDates(date || dayjs()); // Provide fallback to current date if null
  };
  useEffect(() => {
    if (tempDates && salonInformationByOwnerId?.id) {
      setLoading(true);
      const formattedDate = dayjs(tempDates)?.format("YYYY-MM-DD");
      API.get(
        `/saloninformations/CustomerQuantityByDate/${salonInformationByOwnerId.id}`,
        {
          params: {
            date: formattedDate,
          },
        }
      )
        .then((response) => {
          const data = response.data;
          console.log("data", data);
          const oldPercent = data?.customerDate?.oldCustomerPercent || 0;
          const newPercent = data?.customerDate?.newCustomerPercent || 0;
          if (oldPercent > 0 || newPercent > 0) {
            // Có dữ liệu
            setPieDataCustomer({
              labels: ["Khách hàng cũ", "Khách hàng mới"],
              datasets: [
                {
                  label: "Phân loại khách hàng",
                  data: [oldPercent, newPercent], // Sử dụng dữ liệu thực
                  backgroundColor: ["#36A2EB", "#FF6384"], // Màu sắc thực
                  hoverBackgroundColor: ["#5AD3D1", "#FF9AA2"], // Màu sắc khi di chuột
                },
              ],
            });
          } else {
            // Không có dữ liệu (cả hai giá trị đều bằng 0)
            setPieDataCustomer({
              labels: ["Không có dữ liệu"],
              datasets: [
                {
                  label: "Phân loại khách hàng",
                  data: [100], // Giá trị mặc định
                  backgroundColor: ["#d3d3d3"], // Màu xám
                  hoverBackgroundColor: ["#d3d3d3"], // Màu xám khi di chuột
                },
              ],
            });
          }
          setCustomer(data?.customerDate);
          // Transform the API response into chart data
          const labels = data.charCustomer.map((entry) => `${entry.time} giờ`);
          const chartData = data.charCustomer.map(
            (entry) => entry.numberOfCustomer
          );

          // Update state with the formatted data
          setHorizontalBarData({
            labels,
            datasets: [
              {
                label: "Số người phục vụ",
                data: chartData,
                backgroundColor: [
                  "#3B82F6",
                  "#22C55E",
                  "#8B5CF6",
                  "#FF9AA2",
                  "#36A2EB",
                ],
                borderWidth: 1,
              },
            ],
          });
        })
        .catch((error) => {
          console.error("Error fetching customer data:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [tempDates, salonInformationByOwnerId]);

  useEffect(() => {
    if (tempDates && salonInformationByOwnerId?.id) {
      const formattedDate = dayjs(tempDates)?.format("YYYY-MM-DD");

      API.get(
        `/saloninformations/RevenueStatisticsOnOverview/${salonInformationByOwnerId.id}`,
        {
          params: { date: formattedDate },
        }
      )
        .then((response) => {
          const data = response.data;

          const outsideRevenue = data?.outsideRevenue || 0;
          const platformRevenue = data?.platformRevenue || 0;
          if (outsideRevenue > 0 || platformRevenue > 0) {
            // Có dữ liệu hợp lệ
            setPieCharRevenue({
              labels: ["Doanh thu ngoài hệ thống", "Doanh thu trong hệ thống"],
              datasets: [
                {
                  data: [outsideRevenue, platformRevenue], // Dữ liệu thực tế
                  backgroundColor: ["#22C55E", "#8B5CF6"], // Màu sắc thực tế
                  hoverBackgroundColor: ["#16A34A", "#7C3AED"], // Màu hover thực tế
                },
              ],
            });
          } else {
            // Không có dữ liệu (cả hai đều bằng 0)
            setPieCharRevenue({
              labels: ["Không có dữ liệu"],
              datasets: [
                {
                  data: [100], // Giá trị mặc định
                  backgroundColor: ["#d3d3d3"], // Màu xám
                  hoverBackgroundColor: ["#d3d3d3"], // Màu xám khi hover
                },
              ],
            });
          }

          // Process the API response
          const labels = data.hourlyOutSideRevenues.map(
            (item) => `${item.hour}h`
          );
          const outsideData = data.hourlyOutSideRevenues.map(
            (item) => item.revenue
          );
          const platformData = data.hourlyPlatformRevenues.map(
            (item) => item.revenue
          );
          const totalData = data.hourlyTotalRevenues.map(
            (item) => item.revenue
          );

          // Update the chart data state
          setLineChartRevenue({
            labels,
            datasets: [
              {
                label: "Doanh thu ngoài",
                data: outsideData,
                borderColor: "rgba(255, 99, 132, 1)",
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                fill: false,
              },
              {
                label: "Doanh thu nền tảng",
                data: platformData,
                borderColor: "rgba(54, 162, 235, 1)",
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                fill: false,
              },
              {
                label: "Tổng doanh thu",
                data: totalData,
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                fill: false,
              },
            ],
          });
          setDataRevenue(data);
        })
        .catch((error) => {
          console.error("Error fetching revenue data:", error);
        });
    }
  }, [tempDates, salonInformationByOwnerId]);
  useEffect(() => {
    if (tempDates && salonInformationByOwnerId?.id) {
      setLoading(true);
      const formattedDate = dayjs(tempDates)?.format("YYYY-MM-DD");
      API.get(
        `/saloninformations/CompileAppointmentSalon/${salonInformationByOwnerId.id}`,
        {
          params: {
            startDate: formattedDate,
            endDate: formattedDate,
          },
        }
      )
        .then((response) => {
          const data = response.data;
          console.log("Data fetched:", data);

          // Kiểm tra dữ liệu nhận về
          if (data && data.length > 0) {
            const totalPercent = data.reduce(
              (sum, item) => sum + item.percent,
              0
            );

            if (totalPercent > 0) {
              // Có dữ liệu hợp lệ
              setPieData({
                labels: data.map((item) => item.appointmentType),
                datasets: [
                  {
                    label: "Tỷ lệ lịch hẹn",
                    data: data.map((item) => item.percent),
                    backgroundColor: [
                      "#FF6384",
                      "#36A2EB",
                      "#4BC0C0",
                      "#FFCE56",
                    ],
                    hoverBackgroundColor: [
                      "#FF6384",
                      "#36A2EB",
                      "#4BC0C0",
                      "#FFCE56",
                    ],
                  },
                ],
              });
            } else {
              // Tất cả giá trị percent đều bằng 0
              setPieData({
                labels: ["Không có dữ liệu"],
                datasets: [
                  {
                    label: "Tỷ lệ lịch hẹn",
                    data: [100], // Giá trị mặc định
                    backgroundColor: ["#d3d3d3"], // Màu xám
                    hoverBackgroundColor: ["#d3d3d3"],
                  },
                ],
              });
            }
          } else {
            // Mảng rỗng hoặc không có dữ liệu
            setPieData({
              labels: ["Không có dữ liệu"],
              datasets: [
                {
                  label: "Tỷ lệ lịch hẹn",
                  data: [100], // Giá trị mặc định
                  backgroundColor: ["#d3d3d3"], // Màu xám
                  hoverBackgroundColor: ["#d3d3d3"],
                },
              ],
            });
          }

          setDataAppointment(data); // Lưu lại dữ liệu gốc
        })
        .catch((error) => {
          console.error("Error fetching customer data:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [tempDates, salonInformationByOwnerId]);

  useEffect(() => {
    if (tempDates && salonInformationByOwnerId?.id) {
      setLoading(true);
      const formattedDate = dayjs(tempDates)?.format("YYYY-MM-DD");
      API.get(
        `/appointments/EvaluatedService/${salonInformationByOwnerId.id}`,
        {
          params: {
            startdate: formattedDate,
            enddate: formattedDate,
          },
        }
      )
        .then((response) => {
          const data = response.data.evaluatedServices || [];
          console.log("Data from server:", data);

          // Chuyển đổi dữ liệu cho biểu đồ
          if (data.length > 0) {
            const labels = data.map((item) => item.serviceName);
            const counts = data.map((item) => Number(item.number));
            setChartDataService({
              labels,
              datasets: [
                {
                  label: "Số người phục vụ",
                  data: counts,
                  backgroundColor: "#36A2EB",
                  borderColor: "#2a8cd6",
                  borderWidth: 1,
                },
              ],
            });
          } else {
            // Nếu mảng rỗng, hiển thị biểu đồ với giá trị 0
            setChartDataService({
              labels: ["Không có dữ liệu"],
              datasets: [
                {
                  label: "Số người phục vụ",
                  data: [0],
                  backgroundColor: "#36A2EB",
                  borderColor: "#2a8cd6",
                  borderWidth: 1,
                },
              ],
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching customer data:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [tempDates, salonInformationByOwnerId]);

  useEffect(() => {
    if (tempDates && salonInformationByOwnerId?.id) {
      setLoading(true);
      const formattedDate = dayjs(tempDates)?.format("YYYY-MM-DD");
      API.get(
        `/saloninformations/CompileEmployeeSalon/${salonInformationByOwnerId.id}`,
        {
          params: {
            startDate: formattedDate,
            endDate: formattedDate,
            filter: sortEmployee,
            page: currentPageEmployee,
            size: pageSizeEmployee,
          },
        }
      )
        .then((response) => {
          const data = response.data;
          setTotal(data?.totalPages);
          setDataEmplyee(data?.items);
        })
        .catch((error) => {
          console.error("Error fetching customer data:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [tempDates, salonInformationByOwnerId, currentPageEmployee, sortEmployee]);
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };
  // const pieDataCustomer = {
  //   labels: ["Khách hàng cũ", "Khách hàng mới"], // Nhãn cho các phần trong biểu đồ
  //   datasets: [
  //     {
  //       label: "Phân loại khách hàng", // Nhãn chung cho dữ liệu
  //       data: [customer?.oldCustomerPercent, customer?.newCustomerPercent], // Giá trị tương ứng với từng nhãn
  //       backgroundColor: ["#36A2EB", "#FF6384"], // Màu sắc cho mỗi phần của biểu đồ
  //       hoverBackgroundColor: ["#5AD3D1", "#FF9AA2"], // Màu sắc khi di chuột qua
  //     },
  //   ],
  // };

  // const pieCharRevenue = {
  //   labels: ["Doanh thu ngoài hệ thống", "Doanh thu trong hệ thống"], // Nhãn
  //   datasets: [
  //     {
  //       data: [dataRevenue?.outsideRevenue, dataRevenue?.platformRevenue], // Giá trị tương ứng
  //       backgroundColor: ["#22C55E", "#8B5CF6"], // Màu sắc
  //       hoverBackgroundColor: ["#16A34A", "#7C3AED"], // Màu khi hover
  //     },
  //   ],
  // };

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
            const formattedDates = tempDates.map((date) =>
              date.format("YYYY-MM-DD")
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

  // const pieDataAppointmentRange = {
  //   labels: [
  //     "Lịch hẹn ngoài hệ thống",
  //     "Lịch hẹn thành công",
  //     "Lịch hẹn bị hủy",
  //     "Lịch hẹn thất bại",
  //   ],
  //   datasets: [
  //     {
  //       label: "Tỷ lệ lịch hẹn",
  //       data: [
  //         dataAppointment[0]?.percent,
  //         dataAppointment[1]?.percent,
  //         dataAppointment[3]?.percent,
  //         dataAppointment[2]?.percent,
  //       ], // Số lượng lịch hẹn từ dataAppointment
  //       backgroundColor: [
  //         "#FF6384", // Màu cho Lịch hẹn ngoài hệ thống
  //         "#36A2EB", // Màu cho Lịch hẹn trong hệ thống
  //         "#FFCE56", // Màu cho Lịch hẹn bị hủy
  //         "#4BC0C0", // Màu cho Lịch hẹn thất bại
  //       ],
  //       hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
  //     },
  //   ],
  // };

  const horizontalBarChartService = {
    labels: ["Cắt tóc", "Gội đầu", "Uốn tóc", "Nhuộm tóc", "Massage"],
    datasets: [
      {
        label: "Số người phục vụ",
        data: [50, 30, 15, 20, 10], // Số người phục vụ theo từng dịch vụ
        backgroundColor: "#36A2EB", // Màu cột
        borderColor: "#2a8cd6", // Màu viền cột
        borderWidth: 1,
      },
    ],
  };

  const horizontalBarChartOptions = {
    indexAxis: "y", // Đặt trục hoành nằm ngang
    scales: {
      x: {
        title: {
          display: true,
          text: "Số người phục vụ",
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
            // const formattedDates = tempDates?.map((date) =>
            //   date.format("YYYY-MM-DD")
            // );
            const formattedDate = tempDates?.format("YYYY-MM-DD");
            navigate(
              `/salon_appointment?appoinmentStatus=ALL&appoinmentEmployeeName=${employeeName}&startDate=${formattedDate}&endDate=${formattedDate}`
            );
          }}
        >
          Chi tiết
        </Button>
      ),
    },
  ];
  console.log("date", tempDates);

  const onPageChangeEmployee = (page) => {
    setCurrentPageEmployee(page);
  };
  return (
    <>
      <div
        className={`${styles.appointmentContainer} bg-customGray min-h-screen p-4 sm:p-8`}
      >
        <h1 className="text-2xl font-bold mb-3" style={{ textAlign: "center" }}>
          Tổng quan theo ngày
        </h1>
        <div
          className="datePickerCustome"
          // className={styles["date-picker-custome"]}
          style={{
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <p className="text-lg sm:text-xl font-bold" style={{ margin: "0" }}>
            Chọn ngày
          </p>
          <DatePicker
            onChange={handleDateChange}
            value={tempDates}
            dropdownClassName="custom-dropdown-range-picker"
          />
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-4 sm:mb-6">
          <h2
            className="text-lg sm:text-xl font-bold mb-4"
            style={{ borderBottom: "0" }}
          >
            KHÁCH HÀNG {tempDates?.format("DD/MM/YYYY")}
          </h2>
          <Spin className="custom-spin" spinning={loading}>
            <div className="flex flex-col sm:flex-row gap-4">
              <div
                className="w-full sm:w-2/3 flex flex-col gap-4 rounded-lg shadow-md p-4"
                style={{ backgroundColor: "#ece8de" }}
              >
                <div className="flex gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-md flex-1">
                    <h3
                      className="text-lg font-bold mb-2"
                      style={{ color: "#33CC66" }}
                    >
                      Tổng số khách hàng phục vụ
                    </h3>
                    <p className="text-gray-700">
                      {customer?.totalCustomer} khách
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-md flex-1">
                    <h3
                      className="text-lg font-bold mb-2"
                      style={{ color: "#0099FF" }}
                    >
                      Khách hàng cũ
                    </h3>
                    <p className="text-gray-700">
                      {customer?.numberOfOldCustomer} khách
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-md flex-1">
                    <h3
                      className="text-lg font-bold mb-2"
                      style={{ color: "#FF9900" }}
                    >
                      Khách hàng mới
                    </h3>
                    <p className="text-gray-700">
                      {customer?.numberOfNewCustomer} khách
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="w-full sm:w-1/3 flex flex-col gap-4 mt-4 sm:mt-0 rounded-lg shadow-md p-4"
                style={{ backgroundColor: "#ece8de" }}
              >
                <div className="h-64 sm:h-50">
                  <Pie
                    data={pieDataCustomer}
                    options={{ maintainAspectRatio: false }}
                  />
                </div>
              </div>
            </div>
          </Spin>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold mb-4">
            LƯỢNG KHÁCH NGÀY {tempDates?.format("DD/MM/YYYY")}
          </h2>
          <Spin className="custom-spin" spinning={loading}>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Biểu đồ đường lớn hơn */}
              <div className="w-full">
                <div className="h-64 sm:h-80 lg:h-96">
                  <Bar
                    data={horizontalBarData}
                    options={{
                      indexAxis: "y", // Đảo trục để biểu đồ trở thành cột ngang
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          title: {
                            display: true,
                            text: "Số người phục vụ", // Nhãn trục hoành
                          },
                          beginAtZero: true, // Bắt đầu từ 0
                        },
                        y: {
                          title: {
                            display: true,
                            text: "Số giờ", // Nhãn trục tung
                          },
                        },
                      },
                      plugins: {
                        legend: {
                          display: false, // Ẩn chú thích nếu không cần thiết
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </Spin>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-lg sm:text-xl font-bold mb-4">
            DOANH THU VÀO NGÀY {tempDates?.format("DD/MM/YYYY")}
          </h2>
          <Spin className="custom-spin" spinning={loading}>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Biểu đồ đường lớn hơn */}
              <div className="w-full sm:w-2/3">
                <div className="h-64 sm:h-80 lg:h-96">
                  <Line
                    data={lineChartRevenue}
                    options={{
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          title: {
                            display: true,
                            text: "Thời gian (Giờ)", // Nhãn trục x
                          },
                        },
                        y: {
                          title: {
                            display: true,
                            text: "Doanh thu (Triệu đồng)", // Nhãn trục y
                          },
                          beginAtZero: true, // Bắt đầu từ 0
                        },
                      },
                      plugins: {
                        legend: {
                          display: true, // Hiển thị chú thích
                        },
                      },
                    }}
                  />
                </div>
              </div>

              {/* Biểu đồ tròn */}
              <div className="w-full sm:w-1/3">
                <div className="h-64 sm:h-80">
                  <Pie
                    data={pieCharRevenue}
                    options={{
                      maintainAspectRatio: false,
                      //   plugins: {
                      //     legend: {
                      //       display: false,
                      //     },
                      //   },
                    }}
                  />
                </div>
              </div>
            </div>
          </Spin>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold mb-4">
            THỐNG KÊ SỐ LỊCH HẸN NGÀY {tempDates?.format("DD/MM/YYYY")}
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-2/3">
              <div className="h-auto">
                <div className={styles["table-container"]}>
                  <Spin className="custom-spin" spinning={loading}>
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
                              <button className={stylesCard.buttonCard}>
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
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold mb-4">
            DỊCH VỤ NỔI BẬT NGÀY {tempDates.format("DD/MM/YYYY")}
          </h2>
          <Spin className="custom-spin" spinning={loading}>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Biểu đồ đường lớn hơn */}
              <div className="w-full">
                <div className="h-64 sm:h-80 lg:h-96">
                  <Bar
                    data={chartDataService}
                    options={horizontalBarChartOptions}
                  />
                </div>
              </div>
            </div>
          </Spin>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-lg sm:text-xl font-bold mb-4">
            THỐNG KÊ TỪNG NHÂN VIÊN NGÀY {tempDates.format("DD/MM/YYYY")}
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Biểu đồ đường lớn hơn */}
            <div className="w-full">
              <div className="h-auto">
                <div className={styles["table-container"]}>
                  <Spin className="custom-spin" spinning={loading}>
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
                                  const formattedDates = tempDates.map((date) =>
                                    date.format("YYYY-MM-DD")
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
    </>
  );
};

export default OverviewSalon;
