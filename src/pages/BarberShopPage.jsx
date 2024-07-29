import React, { useEffect, useState } from "react";
import { Steps, Button, message, Modal } from "antd";
import Header from "../components/Header";
import SalonForm from "../components/SalonShop/SalonForm";
import AddEmployeeForm from "../components/SalonShop/EmployeeForm";
import AddServiceForm from "../components/SalonShop/ServiceForm";
import axios from "axios";
import { useParams } from "react-router-dom";

const { Step } = Steps;
function BarberShopPage(props) {
  const { id } = useParams();
  const [current, setCurrent] = useState(0);
  const [salon, setSalon] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [services, setServices] = useState([]);
  const [salonDetail, setSalonDetail] = useState({});

  const SALONDETAIL_URL =
    "http://14.225.218.91:8080/api/v1/saloninformations/GetSalonInformationById/";
  // const salonId = "a90133a4-01b5-4202-4df7-08dc858e1932"
  useEffect(() => {
    axios.get(SALONDETAIL_URL + id).then((res) => {
      setSalonDetail(res.data);
      console.log(res.data, "salon detail");
    });
  }, [id]);

  return (
    <div>
      <div
        style={{
          marginTop: "140px",
          // backgroundColor: "orange",
          marginLeft: "250px",
          marginRight: "250px",
        }}
      >
        <SalonForm
          id={id}
          salon={salonDetail}
          onAddSalon={(salon) => {
            setSalon(salon);
          }}
        />
      </div>
    </div>
  );
}

export default BarberShopPage;
