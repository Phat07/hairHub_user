import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  List,
  Skeleton,
  Popover,
  Input,
  Modal,
  Flex,
  Typography,
  message,
  Card,
  Row,
  Col,
  Descriptions,
  Rate,
  Space,
  Image,
  Divider,
} from "antd";
import Header from "../components/Header";
import { Link, useNavigate } from "react-router-dom";
import AddServiceForm from "../components/SalonShop/ServiceForm";
import AddEmployeeForm from "../components/SalonShop/EmployeeForm";
import { MdDesignServices } from "react-icons/md";
import { BsPersonCircle } from "react-icons/bs";
import {
  EditFilled,
  EditOutlined,
  LineOutlined,
  MoreOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { actGetSalonInformationByOwnerIdAsync } from "../store/salonAppointments/action";
import { actGetSalonInformationByOwnerId } from "../store/salonInformation/action";
import { isEmptyObject } from "../components/formatCheckValue/checkEmptyObject";
import {
  actGetAllEmployees,
  actGetAllServicesBySalonId,
} from "../store/salonEmployees/action";

const count = 3;

function ListShopBarber(props) {
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const auth = useAuthUser();
  const ownerId = auth?.idOwner;
 
  const dispatch = useDispatch();
  const SALONINFORMATION_URL =
    "http://14.225.218.91:8080/api/v1/saloninformations/GetSalonInformationByOwnerId/";
  // ownerId = "a8d13ca7-4d1a-46c6-8022-effc36231430" //EricLee
  // ownerId = "99b8ac8b-5717-4fdc-9027-01d3775421e2" //Khoa123

  const navigate = useNavigate();
  const [openPopoverId, setOpenPopoverId] = useState(null);

  const [filterName, setFilterName] = useState("");
  const [filterLocation, setFilterLocation] = useState("");

  const salonDetail = useSelector(
    (state) => state.SALONINFORMATION.getSalonByOwnerId
  );
  //Salon employee
  const listEmployee = useSelector(
    (state) => state.SALONEMPLOYEES.listEmployee
  );

  const hidePopover = () => {
    setOpenPopoverId(null);
  };
  useEffect(() => {
    dispatch(actGetSalonInformationByOwnerId(ownerId));
  }, []);
  const handleOpenPopover = (newOpen, id) => {
    setOpenPopoverId(newOpen ? id : null);
  };

  const handleFilter = () => {
    if (!filterName && !filterLocation) {
      setList(data);
      return;
    }

    const filteredList = data.filter(
      (item) =>
        item.name.toLowerCase().includes(filterName.toLowerCase()) &&
        item.address.toLowerCase().includes(filterLocation.toLowerCase())
    );
    setList(filteredList);
  };
  useEffect(() => {
    dispatch(actGetAllServicesBySalonId(salonDetail?.id));
  }, []);
  const listService = useSelector((state) => state.SALONEMPLOYEES.listService);
  const checkEmployeeListExist = () => {
    if (listService?.length === 0) {
      navigate(`/list_service/${salonDetail.id}`);
      message.info("Bạn cần phải tạo các dịch vụ trước!!!");
    } else {
      navigate(`/list_barber_employees/${salonDetail.id}`);
    }
  };

  useEffect(() => {
    if (isEmptyObject(salonDetail)) {
      setTimeout(() => {
        // message.info("Bạn cần phải tạo salon đầu tiên!");
        if (isEmptyObject(salonDetail)) {
          navigate("/create_shop");
        } else {
          return;
        }
      }, 3000);
    } else if (ownerId) {
      dispatch(actGetSalonInformationByOwnerId(ownerId));
      setInitLoading(false);
    }
  }, [ownerId]);

  useEffect(() => {
    if (salonDetail?.id) dispatch(actGetAllEmployees(salonDetail?.id));
  }, [salonDetail?.id]);

  const convertDayOfWeekToVietnamese = (dayOfWeek) => {
    const daysMapping = {
      Monday: "Thứ Hai",
      Tuesday: "Thứ Ba",
      Wednesday: "Thứ Tư",
      Thursday: "Thứ Năm",
      Friday: "Thứ Sáu",
      Saturday: "Thứ Bảy",
      Sunday: "Chủ Nhật",
    };
    return daysMapping[dayOfWeek] || dayOfWeek;
  };

  return (
    <div>
      <div
        style={{
          marginTop: "140px",
          marginLeft: "60px",
          marginRight: "60px",
        }}
      >
        {!isEmptyObject(salonDetail) ? (
          <>
            <Card
              title="Thông tin Salon"
              style={{ width: "100%", height: "100%", margin: "20px auto" }}
            >
              <Row gutter={16}>
                <Col span={6}>
                  <Image size={300} src={salonDetail.img} />
                </Col>
                <Col span={18}>
                  <Descriptions
                    title={
                      <Flex justify="space-between" align="center">
                        <Flex className="bg-blue-600 p-3 w-max border border-red-300 rounded-md cursor-pointer">
                          <Typography.Title
                            style={{ color: "rgb(241 245 249)" }}
                            level={3}
                            onClick={()=>{
                              navigate(`/create_shop/${salonDetail?.id}`)
                            }}
                          >
                            {salonDetail.name}
                          </Typography.Title>
                        </Flex>
                        <Flex gap={"middle"} align="base-line">
                          <Button
                            type="primary"
                            onClick={() => checkEmployeeListExist()}
                          >
                            Danh sách nhân viên
                          </Button>
                          <Button
                            type="primary"
                            onClick={() =>
                              navigate(`/list_service/${salonDetail.id}`)
                            }
                          >
                            Danh sách dịch vụ
                          </Button>
                          <Button
                            type="primary"
                            onClick={() =>
                              navigate(`/list_voucher/${salonDetail.id}`)
                            }
                          >
                            Danh sách các voucher
                          </Button>
                        </Flex>
                      </Flex>
                    }
                    bordered
                  >
                    <Descriptions.Item span={1} label="Địa chỉ">
                      {salonDetail.address}
                    </Descriptions.Item>
                    <Descriptions.Item span={2} label="Chủ Salon">
                      {salonDetail?.salonOwner?.fullName}
                    </Descriptions.Item>
                    <Descriptions.Item span={1} label="Mô tả">
                      {salonDetail.description}
                    </Descriptions.Item>

                    <Descriptions.Item
                      contentStyle={{
                        textAlign: "center",
                        // justifyContent: "space-between",
                        // alignContent: "center",
                      }}
                      span={2}
                      className={
                        salonDetail.status !== "REJECTED" &&
                        salonDetail.status !== "DISABLED" &&
                        salonDetail.status !== "CREATING"
                          ? "bg-green-300 border-dotted border-2 text-slate-100 font-bold"
                          : "bg-red-300 border-dotted border-2 text-slate-100 font-bold"
                      }
                      label="Trạng thái"
                    >
                      {salonDetail.status}
                    </Descriptions.Item>
                    <Descriptions.Item label="Đánh giá">
                      <Rate disabled defaultValue={salonDetail.rate} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Tổng đánh giá">
                      {salonDetail.totalRating}
                    </Descriptions.Item>
                    <Descriptions.Item label="Số đánh giá">
                      {salonDetail.totalReviewer}
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
              </Row>
              <Row gutter={16} style={{ marginTop: "20px" }}>
                <Col span={24}>
                  <Descriptions title="Lịch trình" bordered>
                    {salonDetail?.schedules?.map((schedule, index) => (
                      <Descriptions.Item
                        key={index}
                        label={convertDayOfWeekToVietnamese(schedule.dayOfWeek)}
                      >
                        <Space size={10}>
                          <Typography.Text strong>
                            {schedule.startTime.slice(0, 5)}
                            AM
                          </Typography.Text>
                          <LineOutlined />
                          <Typography.Text strong>
                            {schedule.endTime.slice(0, 5)}
                            PM
                          </Typography.Text>
                        </Space>
                      </Descriptions.Item>
                    ))}
                  </Descriptions>
                </Col>
              </Row>
            </Card>
          </>
        ) : (
          <Skeleton
            avatar
            paragraph={{
              rows: 4,
            }}
          />
        )}
      </div>
    </div>
  );
}

export default ListShopBarber;
