import { Line, Pie } from "react-chartjs-2";
import { motion } from "framer-motion";
import styles from "../css/reviewAppointment.module.css";
import "../css/revenue.css";
import { useEffect, useState } from "react";
import { API } from "@/services/api";
import { actGetSalonInformationByOwnerIdAsync } from "@/store/salonAppointments/action";
import { useDispatch, useSelector } from "react-redux";
import { Spin } from "antd";
const RevenueYearPage = () => {
  const [startIndex, setStartIndex] = useState(0); // Vị trí bắt đầu hiển thị
  const [activeYear, setActiveYear] = useState(null); // Năm đang được chọn
  const years = Array.from({ length: 30 }, (_, i) => 2023 + i); // Danh sách năm từ 2020 đến 2030
  const visibleYears = years.slice(startIndex, startIndex + 4); // Lấy 4 năm để hiển thị
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
    if (ownerId) {
      dispatch(actGetSalonInformationByOwnerIdAsync(ownerId));
    }
  }, [ownerId]);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    if (years.includes(currentYear)) {
      setActiveYear(currentYear);
    } else {
      setActiveYear(years[0]);
    }
  }, []);
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
  return (
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
        <h2 className="text-lg sm:text-xl font-bold mb-4">THỐNG KÊ LỊCH HẸN</h2>
        <Spin className="custom-spin" spinning={isLoading}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-2/3">
              <div className="h-64 sm:h-80 lg:h-96">
                <Line
                  data={lineDataAppointment}
                  options={{ maintainAspectRatio: false }}
                />
              </div>
            </div>
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

      {/* Biểu đồ thống kê doanh thu */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <h2 className="text-lg sm:text-xl font-bold mb-4">
          THỐNG KÊ DOANH THU
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
                <Pie data={pieData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
          </div>
        </Spin>
      </div>
    </div>
  );
};

export default RevenueYearPage;
