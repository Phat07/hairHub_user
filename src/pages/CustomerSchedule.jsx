import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Calendar from "react-calendar";
import "../css/customerCalender.css";
import { Card, Divider } from "antd";
import moment from "moment";

function CustomerSchedule(props) {
  const [value, setValue] = useState(new Date());
  const datesWithEvents = [
    { date: "2024-06-10", time: "9:30:00", status: true },
    { date: "2024-06-10", time: "10:30:00", status: true },
    { date: "2024-06-10", time: "12:30:00", status: false },
    { date: "2024-06-15", time: "14:30:00", status: true },
    { date: "2024-06-20", time: "17:00:00", status: true },
  ];

  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      let dateString = date.toISOString().split("T")[0];
      console.log("dateString", dateString);
      const datesOnly = datesWithEvents.map((event) => event.date);
      if (datesOnly.includes(dateString)) {
        return "event-day";
      }
    }
  };

  const [currentWeek, setCurrentWeek] = useState(moment().startOf("isoWeek"));
  useEffect(() => {
    setValue(new Date(currentWeek.toDate()));
  }, [currentWeek]);

  const generateWeekOptions = () => {
    let weeks = [];
    for (let i = 0; i < 10; i++) {
      let startOfWeek = moment().add(i, "weeks").startOf("isoWeek");
      let endOfWeek = startOfWeek.clone().endOf("isoWeek");
      weeks.push({
        value: startOfWeek.format("YYYY-MM-DD"),
        label: `${startOfWeek.format("DD/MM")} to ${endOfWeek.format("DD/MM")}`,
      });
    }
    return weeks;
  };

  const handleWeekSelect = (event) => {
    setCurrentWeek(moment(event.target.value));
  };

  const weekOptions = generateWeekOptions();

  const weeklyAppointments = datesWithEvents.filter((event) =>
    moment(event.date).isSame(currentWeek, "week")
  );

  const handleAppointmentClick = (appointment) => {
    // Xử lý sự kiện click vào một cuộc hẹn
    console.log("Clicked appointment:", appointment);
  };

  const getCardColor = (status) => {
    return status ? "#98FB98" : "#FFC0CB";
  };

  return (
    <div>
      {/* Không đụng phần này  */}
      <Header />
      <div
        style={{
          marginTop: "140px",
          marginLeft: "250px",
          marginRight: "250px",
        }}
      ></div>
      <div
        style={{
          textAlign: "center",
          fontWeight: "bold",
          color: "black",
          fontSize: "4rem",
          marginBottom: "2rem",
        }}
      >
        <h1>Lịch hẹn của bạn</h1>
      </div>
      <div style={{ textAlign: "center", padding: "0px 250px" }}>
        <Card
          style={{
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            maxWidth: "700px",
            marginLeft: "auto",
            marginRight: "auto",
            // marginTop: "50px",
            padding: "20px",
          }}
          bordered={false}
        >
          <Calendar
            onChange={setValue}
            value={value}
            tileClassName={tileClassName}
          />
        </Card>
        <Divider />
      </div>
      {/* Không đụng phần này  */}
      <div style={{ textAlign: "center", padding: "0px 250px" }}>
        <select
          onChange={handleWeekSelect}
          value={currentWeek.format("YYYY-MM-DD")}
        >
          {weekOptions.map((week) => (
            <option key={week.value} value={week.value}>
              {week.label}
            </option>
          ))}
        </select>
        <table className="weekly-calendar">
          <thead>
            <tr>
              <th>Monday</th>
              <th>Tuesday</th>
              <th>Wednesday</th>
              <th>Thursday</th>
              <th>Friday</th>
              <th>Saturday</th>
              <th>Sunday</th>
            </tr>
          </thead>
          <tbody>
            <tr className="appointments">
              {[...Array(7)].map((_, dayIndex) => {
                const day = currentWeek.clone().add(dayIndex, "days");
                const dateString = day.format("YYYY-MM-DD");
                const dailyAppointments = datesWithEvents.filter(
                  (event) => event.date === dateString
                );
                return (
                  <td key={dayIndex}>
                    <ul>
                      {dailyAppointments.map((appointment, index) => (
                        <Card
                          key={index}
                          size="small"
                          title={
                            <span
                              style={{
                                backgroundColor: getCardColor(
                                  appointment.status
                                ),
                                borderRadius: "4px",
                              }}
                            >
                              {moment(appointment.time, "HH:mm:ss").format(
                                "HH:mm"
                              )}
                            </span>
                          }
                          bordered={false}
                          className="appointment-card"
                          onClick={() => handleAppointmentClick(appointment)}
                          style={{
                            marginBottom: "2rem",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <p>Thông tin chi tiết cuộc hẹn...</p>
                        </Card>
                      ))}
                    </ul>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CustomerSchedule;
