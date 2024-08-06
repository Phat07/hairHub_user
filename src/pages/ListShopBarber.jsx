// import React, { useEffect, useState } from "react";
// import {
//   Avatar,
//   Button,
//   List,
//   Skeleton,
//   Popover,
//   Input,
//   Modal,
//   Flex,
//   Typography,
//   message,
//   Card,
//   Row,
//   Col,
//   Descriptions,
//   Rate,
//   Space,
//   Image,
//   Divider,
// } from "antd";
// import Header from "../components/Header";
// import { Link, useNavigate } from "react-router-dom";
// import AddServiceForm from "../components/SalonShop/ServiceForm";
// import AddEmployeeForm from "../components/SalonShop/EmployeeForm";
// import { MdDesignServices } from "react-icons/md";
// import { BsPersonCircle } from "react-icons/bs";
// import {
//   EditFilled,
//   EditOutlined,
//   LineOutlined,
//   MoreOutlined,
//   PlusCircleOutlined,
// } from "@ant-design/icons";
// import useAuthUser from "react-auth-kit/hooks/useAuthUser";
// import axios from "axios";
// import { useDispatch, useSelector } from "react-redux";
// import { actGetSalonInformationByOwnerIdAsync } from "../store/salonAppointments/action";
// import { actGetSalonInformationByOwnerId } from "../store/salonInformation/action";
// import { isEmptyObject } from "../components/formatCheckValue/checkEmptyObject";
// import {
//   actGetAllEmployees,
//   actGetAllServicesBySalonId,
// } from "../store/salonEmployees/action";

// const count = 3;

// function ListShopBarber(props) {
//   const [initLoading, setInitLoading] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState([]);
//   const [list, setList] = useState([]);
//   const [page, setPage] = useState(1);
//   // const auth = useAuthUser();
//   // const ownerId = auth?.idOwner;
//   const idCustomer = useSelector(
//     (state) => state.ACCOUNT.idCustomer
//   );
//   const ownerId = useSelector(
//     (state) => state.ACCOUNT.idOwner
//   );
//   const dispatch = useDispatch();

//   const navigate = useNavigate();
//   const [openPopoverId, setOpenPopoverId] = useState(null);

//   const [filterName, setFilterName] = useState("");
//   const [filterLocation, setFilterLocation] = useState("");

//   const salonDetail = useSelector(
//     (state) => state.SALONINFORMATION.getSalonByOwnerId
//   );
//   //Salon employee
//   const listEmployee = useSelector(
//     (state) => state.SALONEMPLOYEES.listEmployee
//   );

//   const hidePopover = () => {
//     setOpenPopoverId(null);
//   };
//   useEffect(() => {
//     dispatch(actGetSalonInformationByOwnerId(ownerId));
//   }, []);
//   const handleOpenPopover = (newOpen, id) => {
//     setOpenPopoverId(newOpen ? id : null);
//   };

//   const handleFilter = () => {
//     if (!filterName && !filterLocation) {
//       setList(data);
//       return;
//     }

//     const filteredList = data.filter(
//       (item) =>
//         item.name.toLowerCase().includes(filterName.toLowerCase()) &&
//         item.address.toLowerCase().includes(filterLocation.toLowerCase())
//     );
//     setList(filteredList);
//   };
//   useEffect(() => {
//     dispatch(actGetAllServicesBySalonId(salonDetail?.id));
//   }, []);
//   const listService = useSelector((state) => state.SALONEMPLOYEES.listService);
//   const checkEmployeeListExist = () => {
//     if (listService?.length === 0) {
//       navigate(`/list_service/${salonDetail.id}`);
//       message.info("Bạn cần phải tạo các dịch vụ trước!!!");
//     } else {
//       navigate(`/list_barber_employees/${salonDetail.id}`);
//     }
//   };

//   useEffect(() => {
//     if (isEmptyObject(salonDetail)) {
//       setTimeout(() => {
//         // message.info("Bạn cần phải tạo salon đầu tiên!");
//         if (isEmptyObject(salonDetail)) {
//           navigate("/create_shop");
//         } else {
//           return;
//         }
//       }, 3000);
//     } else if (ownerId) {
//       dispatch(actGetSalonInformationByOwnerId(ownerId));
//       setInitLoading(false);
//     }
//   }, [ownerId]);

//   useEffect(() => {
//     if (salonDetail?.id) dispatch(actGetAllEmployees(salonDetail?.id));
//   }, [salonDetail?.id]);

//   const convertDayOfWeekToVietnamese = (dayOfWeek) => {
//     const daysMapping = {
//       Monday: "Thứ Hai",
//       Tuesday: "Thứ Ba",
//       Wednesday: "Thứ Tư",
//       Thursday: "Thứ Năm",
//       Friday: "Thứ Sáu",
//       Saturday: "Thứ Bảy",
//       Sunday: "Chủ Nhật",
//     };
//     return daysMapping[dayOfWeek] || dayOfWeek;
//   };

//   return (
//     <div>
//       <div
//         style={{
//           marginTop: "140px",
//           marginLeft: "60px",
//           marginRight: "60px",
//         }}
//       >
//         {!isEmptyObject(salonDetail) ? (
//           <>
//             <Card
//               title="Thông tin Salon"
//               style={{ width: "100%", height: "100%", margin: "20px auto" }}
//             >
//               <Row gutter={16}>
//                 <Col span={6}>
//                   <Image size={300} src={salonDetail.img} />
//                 </Col>
//                 <Col span={18}>
//                   <Descriptions
//                     title={
//                       <Flex justify="space-between" align="center">
//                         <Flex className="bg-blue-600 p-3 w-max border border-red-300 rounded-md cursor-pointer">
//                           <Typography.Title
//                             style={{ color: "rgb(241 245 249)" }}
//                             level={3}
//                             onClick={()=>{
//                               navigate(`/create_shop/${salonDetail?.id}`)
//                             }}
//                           >
//                             {salonDetail.name}
//                           </Typography.Title>
//                         </Flex>
//                         <Flex gap={"middle"} align="base-line">
//                           <Button
//                             type="primary"
//                             onClick={() => checkEmployeeListExist()}
//                           >
//                             Danh sách nhân viên
//                           </Button>
//                           <Button
//                             type="primary"
//                             onClick={() =>
//                               navigate(`/list_service/${salonDetail.id}`)
//                             }
//                           >
//                             Danh sách dịch vụ
//                           </Button>
//                           <Button
//                             type="primary"
//                             onClick={() =>
//                               navigate(`/list_voucher/${salonDetail.id}`)
//                             }
//                           >
//                             Danh sách các voucher
//                           </Button>
//                         </Flex>
//                       </Flex>
//                     }
//                     bordered
//                   >
//                     <Descriptions.Item span={1} label="Địa chỉ">
//                       {salonDetail.address}
//                     </Descriptions.Item>
//                     <Descriptions.Item span={2} label="Chủ Salon">
//                       {salonDetail?.salonOwner?.fullName}
//                     </Descriptions.Item>
//                     <Descriptions.Item span={1} label="Mô tả">
//                       {salonDetail.description}
//                     </Descriptions.Item>

//                     <Descriptions.Item
//                       contentStyle={{
//                         textAlign: "center",
//                         // justifyContent: "space-between",
//                         // alignContent: "center",
//                       }}
//                       span={2}
//                       className={
//                         salonDetail.status !== "REJECTED" &&
//                         salonDetail.status !== "DISABLED" &&
//                         salonDetail.status !== "CREATING"
//                           ? "bg-green-300 border-dotted border-2 text-slate-100 font-bold"
//                           : "bg-red-300 border-dotted border-2 text-slate-100 font-bold"
//                       }
//                       label="Trạng thái"
//                     >
//                       {salonDetail.status}
//                     </Descriptions.Item>
//                     <Descriptions.Item label="Đánh giá">
//                       <Rate disabled defaultValue={salonDetail.rate} />
//                     </Descriptions.Item>
//                     <Descriptions.Item label="Tổng đánh giá">
//                       {salonDetail.totalRating}
//                     </Descriptions.Item>
//                     <Descriptions.Item label="Số đánh giá">
//                       {salonDetail.totalReviewer}
//                     </Descriptions.Item>
//                   </Descriptions>
//                 </Col>
//               </Row>
//               <Row gutter={16} style={{ marginTop: "20px" }}>
//                 <Col span={24}>
//                   <Descriptions title="Lịch trình" bordered>
//                     {salonDetail?.schedules?.map((schedule, index) => (
//                       <Descriptions.Item
//                         key={index}
//                         label={convertDayOfWeekToVietnamese(schedule.dayOfWeek)}
//                       >
//                         <Space size={10}>
//                           <Typography.Text strong>
//                             {schedule.startTime.slice(0, 5)}
//                             AM
//                           </Typography.Text>
//                           <LineOutlined />
//                           <Typography.Text strong>
//                             {schedule.endTime.slice(0, 5)}
//                             PM
//                           </Typography.Text>
//                         </Space>
//                       </Descriptions.Item>
//                     ))}
//                   </Descriptions>
//                 </Col>
//               </Row>
//             </Card>
//           </>
//         ) : (
//           <Skeleton
//             avatar
//             paragraph={{
//               rows: 4,
//             }}
//           />
//         )}
//       </div>
//     </div>
//   );
// }

// export default ListShopBarber;
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
  Menu,
  Dropdown,
} from "antd";
import "../css/listShopBarber.css";
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
  MenuOutlined,
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
  // const auth = useAuthUser();
  // const ownerId = auth?.idOwner;
  const idCustomer = useSelector((state) => state.ACCOUNT.idCustomer);
  const ownerId = useSelector((state) => state.ACCOUNT.idOwner);
  const dispatch = useDispatch();

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
    dispatch(
      actGetAllServicesBySalonId(
        salonDetail.id,
        localStorage.getItem("currentPage"),
        localStorage.getItem("pageSize")
      )
    );
  }, []);
  const listService = useSelector(
    (state) => state.SALONEMPLOYEES.salonServicesList
  );
  console.log("list", listService);

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

  const sortSchedules = (schedules) => {
    const dayOrder = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    return schedules.sort(
      (a, b) => dayOrder.indexOf(a.dayOfWeek) - dayOrder.indexOf(b.dayOfWeek)
    );
  };

  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleMenuClick = ({ key }) => {
    if (key === "employeeList") {
      checkEmployeeListExist();
    } else if (key === "serviceList") {
      navigate(`/list_service/${salonDetail.id}`);
    } else if (key === "voucherList") {
      navigate(`/list_voucher/${salonDetail.id}`);
    }
    setDropdownVisible(false);
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="employeeList">Danh sách nhân viên</Menu.Item>
      <Menu.Item key="serviceList">Danh sách dịch vụ</Menu.Item>
      <Menu.Item key="voucherList">Danh sách các voucher</Menu.Item>
    </Menu>
  );

  return (
    <div>
      <div className="container_list">
        {!isEmptyObject(salonDetail) ? (
          <>
            <Card
              title="Thông tin Salon"
              className="responsive-card"
              style={{ width: "100%", height: "100%", margin: "20px auto" }}
            >
              <Row
                gutter={16}
                className="responsive-row"
                style={{ display: "flex" }}
              >
                <Col className="responsive-col">
                  <Image size={300} src={salonDetail.img} />
                </Col>
                <Col span={18} xs={24} className="responsive-col1">
                  <Descriptions
                    title={
                      <Flex justify="space-between" align="center">
                        {/* <Flex className="bg-blue-600 p-3 w-max border border-red-300 rounded-md cursor-pointer salon-title">
                          <Typography.Title
                            style={{ color: "rgb(241 245 249)" }}
                            level={3}
                            onClick={() => {
                              navigate(`/create_shop/${salonDetail?.id}`);
                            }}
                          >
                            {salonDetail.name}
                          </Typography.Title>
                        </Flex> */}
                        <Button
                          type="primary"
                          style={{ color: "rgb(241 245 249)" }}
                          onClick={() => {
                            navigate(`/create_shop/${salonDetail?.id}`);
                          }}
                          className="salon-title"
                        >
                          {salonDetail.name}
                        </Button>
                        <Flex
                          gap={"middle"}
                          align="base-line"
                          className="dropdown-btns"
                        >
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
                        <Dropdown
                          overlay={menu}
                          trigger={["click"]}
                          visible={dropdownVisible}
                          onVisibleChange={(flag) => setDropdownVisible(flag)}
                        >
                          <MenuOutlined
                            className="dropdown-icon"
                            style={{ fontSize: "24px" }}
                          />
                        </Dropdown>
                      </Flex>
                    }
                    bordered
                    className="responsive-descriptions"
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
                      <Rate disabled defaultValue={salonDetail?.rate} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Tổng đánh giá">
                      {salonDetail?.totalRating}
                    </Descriptions.Item>
                    <Descriptions.Item label="Số đánh giá">
                      {salonDetail?.totalReviewer}
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
              </Row>
              <Row gutter={16} style={{ marginTop: "20px" }}>
                <Col span={24}>
                  <Descriptions title="Lịch trình" bordered>
                    {salonDetail?.schedules &&
                      sortSchedules(salonDetail?.schedules).map(
                        (schedule, index) => (
                          <Descriptions.Item
                            key={index}
                            label={convertDayOfWeekToVietnamese(
                              schedule.dayOfWeek
                            )}
                          >
                            {schedule.startTime === "00:00:00" &&
                            schedule.endTime === "00:00:00" ? (
                              <Typography.Text strong style={{ color: "red" }}>
                                Không hoạt động
                              </Typography.Text>
                            ) : (
                              <Space size={10}>
                                <Typography.Text strong className="small-text">
                                  {schedule.startTime.slice(0, 5)} AM
                                </Typography.Text>
                                <LineOutlined />
                                <Typography.Text strong className="small-text">
                                  {schedule.endTime.slice(0, 5)} PM
                                </Typography.Text>
                              </Space>
                            )}
                          </Descriptions.Item>
                        )
                      )}
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
