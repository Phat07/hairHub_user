import { Line, Pie } from "react-chartjs-2";
import { motion } from "framer-motion";
import styles from "../css/reviewAppointment.module.css";
import "../css/revenue.css";
import { useEffect, useState } from "react";
const RevenueYearPage = () => {
  const [startIndex, setStartIndex] = useState(0); // Vị trí bắt đầu hiển thị
  const [activeYear, setActiveYear] = useState(null); // Năm đang được chọn
  const years = Array.from({ length: 30 }, (_, i) => 2023 + i); // Danh sách năm từ 2020 đến 2030
  const visibleYears = years.slice(startIndex, startIndex + 4); // Lấy 4 năm để hiển thị
  
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    if (years.includes(currentYear)) {
      setActiveYear(currentYear);
    } else {
      setActiveYear(years[0]);
    }
  }, []); 
  useEffect(() => {
    console.log("Active year updated:", activeYear);
  }, [activeYear]);
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
  
  const lineData = {
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
        label: "Tổng lịch hẹn",
        data: [10, 20, 15, 25, 30, 35, 40, 45, 50, 55, 60, 65],
        borderColor: "#4F46E5",
        backgroundColor: "rgba(79, 70, 229, 0.2)",
      },
      {
        label: "Lịch hẹn ngoài hệ thống",
        data: [5, 10, 7, 15, 20, 17, 22, 27, 32, 37, 42, 47],
        borderColor: "#10B981",
        backgroundColor: "rgba(16, 185, 129, 0.2)",
      },
    ],
  };

  const pieData = {
    labels: ["Tổng lịch hẹn", "Lịch hẹn ngoài hệ thống", "Lịch hẹn bị hủy"],
    datasets: [
      {
        data: [65, 25, 10],
        backgroundColor: ["#4F46E5", "#10B981", "#EF4444"],
        hoverBackgroundColor: ["#4338CA", "#059669", "#DC2626"],
      },
    ],
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
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Biểu đồ đường lớn hơn */}
          <div className="w-full sm:w-2/3">
            <div className="h-64 sm:h-80 lg:h-96">
              <Line data={lineData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>

          {/* Biểu đồ tròn */}
          <div className="w-full sm:w-1/3">
            <div className="h-64 sm:h-80">
              <Pie data={pieData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
      </div>

      {/* Biểu đồ thống kê doanh thu */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <h2 className="text-lg sm:text-xl font-bold mb-4">
          THỐNG KÊ DOANH THU
        </h2>
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Biểu đồ đường lớn hơn */}
          <div className="w-full sm:w-2/3">
            <div className="h-64 sm:h-80 lg:h-96">
              <Line data={lineData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>

          {/* Biểu đồ tròn */}
          <div className="w-full sm:w-1/3">
            <div className="h-64 sm:h-80">
              <Pie data={pieData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueYearPage;
