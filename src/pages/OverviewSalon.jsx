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
  const [tempDates, setTempDates] = useState(dayjs());
  const [loading, setLoading] = useState(false);
  const handleDateChange = (dates) => {
    setTempDates(dates); // Lưu ngày tạm thời
  };
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };
  const pieDataCustomer = {
    labels: ["Khách hàng cũ", "Khách hàng mới"], // Nhãn cho các phần trong biểu đồ
    datasets: [
      {
        label: "Phân loại khách hàng", // Nhãn chung cho dữ liệu
        data: [70, 30], // Giá trị tương ứng với từng nhãn
        backgroundColor: ["#36A2EB", "#FF6384"], // Màu sắc cho mỗi phần của biểu đồ
        hoverBackgroundColor: ["#5AD3D1", "#FF9AA2"], // Màu sắc khi di chuột qua
      },
    ],
  };
  const horizontalBarData = {
    labels: [
      "8 giờ",
      "9 giờ",
      "10 giờ",
      "11 giờ",
      "12 giờ",
      "13 giờ",
      "14 giờ",
      "15 giờ",
      "16 giờ",
      "17 giờ",
      "18 giờ",
      "19 giờ",
      "20 giờ",
    ], // Trục tung: Số giờ
    datasets: [
      {
        label: "Số người phục vụ",
        data: [10, 15, 20, 25, 30, 10, 15, 20, 25, 30, 15, 20, 25], // Trục hoành: Số người phục vụ
        backgroundColor: [
          "#3B82F6",
          "#22C55E",
          "#8B5CF6",
          "#FF9AA2",
          "#36A2EB",
        ], // Màu sắc cho từng cột
        borderWidth: 1,
      },
    ],
  };

  const lineChartRevenue = {
    labels: [
      "8 giờ",
      "9 giờ",
      "10 giờ",
      "11 giờ",
      "12 giờ",
      "13 giờ",
      "14 giờ",
      "15 giờ",
      "16 giờ",
      "17 giờ",
      "18 giờ",
      "19 giờ",
      "20 giờ",
    ], // Thời gian
    datasets: [
      {
        label: "Tổng doanh thu",
        data: [300, 500, 400, 700, 600, 800, 300, 500, 400, 700, 600, 800, 900], // Giá trị doanh thu tổng
        borderColor: "#3B82F6", // Màu đường
        fill: false, // Không tô màu dưới đường
      },
      {
        label: "Doanh thu ngoài hệ thống",
        data: [100, 200, 150, 250, 300, 350, 100, 200, 150, 250, 300, 350, 600], // Giá trị doanh thu ngoài hệ thống
        borderColor: "#22C55E",
        fill: false,
      },
      {
        label: "Doanh thu trong hệ thống",
        data: [200, 300, 250, 450, 300, 450, 200, 300, 250, 450, 300, 450, 500], // Giá trị doanh thu trong hệ thống
        borderColor: "#8B5CF6",
        fill: false,
      },
    ],
  };

  const pieCharRevenue = {
    labels: ["Doanh thu ngoài hệ thống", "Doanh thu trong hệ thống"], // Nhãn
    datasets: [
      {
        data: [1200, 1800], // Giá trị tương ứng
        backgroundColor: ["#22C55E", "#8B5CF6"], // Màu sắc
        hoverBackgroundColor: ["#16A34A", "#7C3AED"], // Màu khi hover
      },
    ],
  };

  const dataAppointment = [
    {
      appointmentType: "Lịch hẹn ngoài hệ thống",
      appointmentQuantity: 15, // Số lượng lịch hẹn
      customerQuantity: 12, // Số lượng khách phục vụ
      revenue: 1500000, // Doanh thu (VNĐ)
    },
    {
      appointmentType: "Lịch hẹn trong hệ thống",
      appointmentQuantity: 25,
      customerQuantity: 20,
      revenue: 2500000,
    },
    {
      appointmentType: "Lịch hẹn bị hủy",
      appointmentQuantity: 5,
      customerQuantity: 0,
      revenue: 0,
    },
    {
      appointmentType: "Lịch hẹn thất bại",
      appointmentQuantity: 8,
      customerQuantity: 0,
      revenue: 0,
    },
  ];

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

  const pieDataAppointmentRange = {
    labels: [
      "Lịch hẹn ngoài hệ thống",
      "Lịch hẹn trong hệ thống",
      "Lịch hẹn bị hủy",
      "Lịch hẹn thất bại",
    ],
    datasets: [
      {
        label: "Tỷ lệ lịch hẹn",
        data: [15, 25, 5, 8], // Số lượng lịch hẹn từ dataAppointment
        backgroundColor: [
          "#FF6384", // Màu cho Lịch hẹn ngoài hệ thống
          "#36A2EB", // Màu cho Lịch hẹn trong hệ thống
          "#FFCE56", // Màu cho Lịch hẹn bị hủy
          "#4BC0C0", // Màu cho Lịch hẹn thất bại
        ],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

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

  const dataEmployee = [
    {
      id: 1,
      fullName: "Nguyễn Văn A",
      numberOfService: 25,
      numberOfUsers: 20,
      revenue: 5000000, // doanh thu
    },
    {
      id: 2,
      fullName: "Trần Thị B",
      numberOfService: 30,
      numberOfUsers: 25,
      revenue: 7500000,
    },
    {
      id: 3,
      fullName: "Phạm Văn C",
      numberOfService: 15,
      numberOfUsers: 10,
      revenue: 3000000,
    },
    {
      id: 4,
      fullName: "Lê Thị D",
      numberOfService: 40,
      numberOfUsers: 35,
      revenue: 12000000,
    },
    {
      id: 5,
      fullName: "Hoàng Văn E",
      numberOfService: 10,
      numberOfUsers: 8,
      revenue: 2000000,
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
            const formattedDates = tempDates.map((date) =>
              date.format("YYYY-MM-DD")
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
            KHÁCH HÀNG {tempDates.format("DD/MM/YYYY")}
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
                    <p className="text-gray-700">10 khách</p>
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
                    <p className="text-gray-700">10 khách</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-md flex-1">
                    <h3
                      className="text-lg font-bold mb-2"
                      style={{ color: "#FF9900" }}
                    >
                      Khách hàng mới
                    </h3>
                    <p className="text-gray-700">10 khách</p>
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
            LƯỢNG KHÁCH NGÀY {tempDates.format("DD/MM/YYYY")}
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
            DOANH THU VÀO NGÀY {tempDates.format("DD/MM/YYYY")}
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
            THỐNG KÊ SỐ LỊCH HẸN NGÀY {tempDates.format("DD/MM/YYYY")}
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
                <Pie
                  data={pieDataAppointmentRange}
                  options={{ maintainAspectRatio: false }}
                />
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
                    data={horizontalBarChartService}
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
                  current={1}
                  pageSize={5}
                  total={50}
                  //   onChange={onPageChangeEmployee}
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
