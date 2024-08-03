// import React, { useEffect, useState } from "react";
// import {
//   List,
//   Avatar,
//   Image,
//   Button,
//   Flex,
//   Modal,
//   message,
//   Popconfirm,
//   Typography,
//   Card,
//   Row,
//   Col,
//   Descriptions,
// } from "antd";
// import axios from "axios";
// import {
//   BackwardOutlined,
//   DeleteOutlined,
//   EditOutlined,
//   ManOutlined,
//   PlusCircleOutlined,
//   UserAddOutlined,
// } from "@ant-design/icons";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import { BsPeople } from "react-icons/bs";
// import AddEmployeeForm from "../components/SalonShop/EmployeeForm";
// import { ServiceHairServices } from "../services/servicesHairServices";
// import { SalonEmployeesServices } from "../services/salonEmployeesServices";
// import { useDispatch, useSelector } from "react-redux";
// import { actGetAllEmployees } from "../store/salonEmployees/action";
// import useAuthUser from "react-auth-kit/hooks/useAuthUser";
// import { actGetSalonInformationByOwnerId } from "../store/salonInformation/action";

// function ListBarberEmployees() {
//   const { id } = useParams(); //salonId
//   const [open, setOpen] = useState(false);
//   const [reset, setReset] = useState(false);
//   const [confirmLoading, setConfirmLoading] = useState(false);
//   const [modalText, setModalText] = useState("Content of the modal");
//   const [employeesList, setEmployeesList] = useState([]);
//   const [servicesList, setServicesList] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   const [detailEmployee, setDetailEmployee] = useState("");

//   const EMPLOYEES_URL =
//     "http://14.225.218.91:8080/api/v1/salonemployees/GetSalonEmployeeBySalonInformationId/";
//   const EMPLOYEESDELETE_URL =
//     "http://14.225.218.91:8080/api/v1/salonemployees/DeleteSalonEmployee/";
//   const SERVICES_URL =
//     "http://14.225.218.91:8080/api/v1/servicehairs/GetServiceHairBySalonInformationId/";
//   const [page, setPage] = useState(1);
//   const limit = 5;
//   const [concatList, setConcatList] = useState([]);
//   const [status, setStatus] = useState(false);

//   const auth = useAuthUser();
//   const ownerId = auth?.idOwner;
//   console.log(ownerId, "ownerId");

//   useEffect(() => {
//     dispatch(actGetSalonInformationByOwnerId(ownerId));
//   }, []);
//   // const messageAddSuccess = message.success("Employee has been added!!!");
//   const navigate = useNavigate();
//   const listEmployee = useSelector(
//     (state) => state.SALONEMPLOYEES.listEmployee
//   );

//   console.log("list", listEmployee);
//   const handleChangeStatus = () => {
//     setStatus(!status);
//   };
//   const dispatch = useDispatch();
//   useEffect(() => {
//     dispatch(actGetAllEmployees(id));
//   }, []);
//   const salonInformationByOwnerId = useSelector(
//     (state) => state.SALONINFORMATION.getSalonByOwnerId
//   );
//   console.log("employee", salonInformationByOwnerId);
//   //   useEffect(() => {

//   //     if (status) {
//   //       SalonEmployeesServices.getSalonEmployeeBySalonInformationId(id)
//   //         .then((res) => {
//   //           setEmployeesList(res.data.items);
//   //           setIsLoading(false);
//   //           console.log(res.data, "EmployeeList");
//   //         })
//   //         .catch((err) => console.log(err, "errors"));
//   //     } else {
//   //       return;
//   //     }
//   //   }, [status]);
//   useEffect(() => {
//     setEmployeesList(listEmployee);
//     setIsLoading(false);
//   }, [listEmployee]);
//   console.log("status", status);
//   const onLoadMore = () => {
//     const nextPage = page + 1;
//     setTimeout(() => {
//       axios
//         .get(EMPLOYEES_URL + id + `?page=${nextPage}&limit=${limit}`)
//         .then((res) => {
//           // const nextData = employeesList.concat(res.data);
//           const concatData = [...employeesList, ...res.data.items];
//           setEmployeesList(concatData);
//           setPage(nextPage);
//           console.log(concatData, "Employee List Concat");
//           window.dispatchEvent(new Event("resize"));
//         });
//     }, 1000);
//   };

//   //delete employee
//   const handleDelete = (employee) => {
//     const employeeDeleted = employeesList.find(({ id }) => {
//       // { id } constructuring id from employeeList
//       if (id === employee.id) {
//         return id;
//       }
//     });
//     axios.put(EMPLOYEESDELETE_URL + `${employeeDeleted.id}`).then((res) => {
//       const updatedEmployeeList = employeesList.filter(
//         (emp) => emp.id !== employeeDeleted.id
//       );
//       setEmployeesList(updatedEmployeeList);
//       console.log(employeeDeleted, "Employee Delete");
//       console.log(updatedEmployeeList, "Update Employee List");
//       message.success("Employee was deleted!");
//       // setTimeout(() => {
//       //   setEmployeesList(updatedEmployeeList);
//       //   message.success("Employee was deleted!");
//       //   console.log(res.status);
//       // }, 1000);
//     });
//   };

//   const showAddEmployeeModal = () => {
//     setOpen(true);
//   };
//   const handleOk = () => {
//     setModalText("Your employee is adding...");
//     // message;
//     setConfirmLoading(true);
//     setTimeout(() => {
//       setOpen(false);
//       setConfirmLoading(false);
//     }, 2000);
//     console.log(employeesList, "Employee List");
//   };
//   const handleCancel = () => {
//     console.log("Clicked cancel button");
//     setOpen(false);
//   };

//   const confirm = (e) => {
//     console.log(e);
//     message.success("Click on Yes");
//   };
//   const cancel = (e) => {
//     console.log(e);
//     message.error("Click on No");
//   };
//   const handleDetail = (e) => {
//     setDetailEmployee(e);
//   };
//   // const employeeWithServiceList

//   // console.log(employeeWithServiceList(), "employeeWithService");
//   return (
//     <>
//       <div
//         style={{
//           marginTop: "175px",
//           marginLeft: "250px",
//           marginRight: "250px",
//         }}
//       >
//         {!employeesList ? (
//           <>
//             <Typography.Title level={3}>
//               Your employees list is empty!
//             </Typography.Title>
//           </>
//         ) : (
//           <>
//             <Flex
//               className="p-6 bg-zinc-300 border rounded-xl"
//               justify="space-around"
//               align="center"
//             >
//               <Button
//                 icon={<BackwardOutlined />}
//                 // type=""
//                 danger
//                 onClick={() => navigate(-1)}
//               >
//                 Back
//               </Button>
//               <Typography.Title className="pr-[20rem] pl-[20rem]">
//                 List barber employees
//               </Typography.Title>
//               <Button
//                 icon={<UserAddOutlined />}
//                 type="primary"
//                 onClick={showAddEmployeeModal}
//               >
//                 Add Employee
//               </Button>
//               <Modal
//                 width={2000}
//                 title="Create new employee"
//                 open={open}
//                 onOk={handleOk}
//                 onCancel={handleCancel}
//                 footer={[
//                   <Button key="back" onClick={handleCancel}>
//                     Return
//                   </Button>,
//                   <Button key="sumit" onClick={handleOk}>
//                     submit
//                   </Button>,
//                 ]}
//               >
//                 <AddEmployeeForm
//                   employeeList={employeesList}
//                   salonInformation={salonInformationByOwnerId}
//                   status={handleChangeStatus}
//                   isReset={(e) => {
//                     setReset(e);
//                   }}
//                   isOpen={(e) => {
//                     setOpen(e); //e is False from EmployeeForm component pass value to ListBarberEmployees
//                   }}
//                   // onAddEmployees={(employee) => {
//                   //   // const newEmployeeList = employeesList.concat(employee);
//                   //   const concatNewData = [...employeesList, ...employee];
//                   //   setEmployeesList(concatNewData);
//                   //   setConcatList(concatNewData);
//                   //   setOpen(false);
//                   // }}
//                 />
//               </Modal>
//             </Flex>
//             <List
//               // loadMore={onLoadMore}
//               loading={isLoading}
//               itemLayout="horizontal"
//               dataSource={listEmployee}
//               renderItem={(employeeList) => (
//                 <>
//                   <List.Item>
//                     <List.Item.Meta
//                       avatar={
//                         <Flex
//                           gap={employeeList?.id < 10 ? "middle" : "small"}
//                           justify="cetner"
//                           align="center"
//                         >
//                           <Avatar
//                             size={{
//                               xs: 24,
//                               sm: 32,
//                               md: 40,
//                               lg: 64,
//                               xl: 80,
//                               xxl: 100,
//                             }}
//                             src={employeeList?.img}
//                             style={{ cursor: "pointer" }}
//                             onClick={() => handleDetail(employeeList)}
//                           />
//                         </Flex>
//                       }
//                       title={employeeList?.fullName}
//                       description={employeeList?.email}
//                     />
//                     {/* <Link to={`account_details/${id}/${employeeList?.id}`}>
//                       <Button icon={<EditOutlined />} type="text">
//                         Edit
//                       </Button>
//                     </Link> */}
//                     <Link to={`account_details/${employeeList?.id}`}>
//                       <Button icon={<EditOutlined />} type="text">
//                         Edit
//                       </Button>
//                     </Link>

//                     <Popconfirm
//                       title="Delete employee"
//                       description="Are you sure to delete this employee?"
//                       onConfirm={() => handleDelete(employeeList)}
//                       onCancel={cancel}
//                       okText="Yes"
//                       cancelText="No"
//                     >
//                       <Button icon={<DeleteOutlined />} danger>
//                         Delete
//                       </Button>
//                     </Popconfirm>
//                   </List.Item>
//                 </>
//               )}
//             />
//             <Flex justify="center" align="center">
//               {employeesList && !isLoading && (
//                 <Button
//                   icon={<PlusCircleOutlined />}
//                   hidden={employeesList.length > 0 ? false : true}
//                   onClick={onLoadMore}
//                 >
//                   More
//                 </Button>
//               )}
//             </Flex>
//           </>
//         )}
//       </div>
//       {detailEmployee && (
//         <Modal
//           title="Employee Details"
//           visible={!!detailEmployee}
//           width="1000px" // Adjust width as needed
//           onCancel={() => setDetailEmployee(null)}
//           footer={null}
//           bodyStyle={{ height: "600px" }}
//         >
//           <Card
//             title={`Thông tin nhân viên ${detailEmployee?.fullName} `}
//             style={{ width: "100%", height: "100%", margin: "20px auto" }}
//           >
//             <Row gutter={16}>
//               <Col span={6}>
//                 <Avatar size={200} src={detailEmployee.img} />
//               </Col>
//               <Col span={18}>
//                 <Descriptions
//                   title={
//                     <Flex justify="space-between" align="center">
//                       <Flex className="bg-blue-400 p-3 w-max border border-red-200 rounded-md text-slate-100">
//                         Dịch vụ của nhân viên {" "}
//                         {detailEmployee?.fullName}
//                       </Flex>
//                       <Flex gap={"middle"} align="base-line">
//                         {detailEmployee?.serviceHairs?.map((e) => {
//                           return <></>;
//                         })}
//                       </Flex>
//                     </Flex>
//                   }
//                   bordered
//                 >
//                   {/* <Descriptions.Item label="Address">
//                     {detailEmployee.address}
//                   </Descriptions.Item>
//                   <Descriptions.Item label="Owner">
//                     {salonDetail?.salonOwner?.fullName}
//                   </Descriptions.Item> */}
//                   <Descriptions.Item label="Phone">
//                     {detailEmployee?.phone}
//                   </Descriptions.Item>
//                   <Descriptions.Item
//                     className={
//                       detailEmployee.isActive === true
//                         ? "bg-green-300 border-dotted border-2 text-slate-100 font-bold"
//                         : "bg-red-300 border-dotted border-2 text-slate-100 font-bold"
//                     }
//                     label="Status"
//                   >
//                     {detailEmployee.isActive === true
//                       ? "Còn làm việc"
//                       : "Nghỉ việc"}
//                   </Descriptions.Item>
//                   <Descriptions.Item label="Giơí Tính">
//                     {detailEmployee.gender === "Male" ? (
//                       <>
//                         <ManOutlined />
//                       </>
//                     ) : <>
//                         <WomanOutlined />
//                       </> ? (
//                       <>
//                         <QuestionCircleOutlined />
//                       </>
//                     ) : (
//                       <></>
//                     )}
//                   </Descriptions.Item>
//                 </Descriptions>
//               </Col>
//             </Row>
//             <Row gutter={16} style={{ marginTop: "20px" }}>
//               <Col span={24}>
//                 <Descriptions title="Schedules" bordered>
//                   {detailEmployee?.schedules?.map((schedule, index) => (
//                     <Descriptions.Item key={index} label={schedule.dayOfWeek}>
//                       {schedule.startTime.slice(0, 5)}am -
//                       {schedule.endTime.slice(0, 5)}pm
//                     </Descriptions.Item>
//                   ))}
//                 </Descriptions>
//               </Col>
//             </Row>
//           </Card>
//         </Modal>
//       )}
//     </>
//   );
// }

// export default ListBarberEmployees;
import React, { useEffect, useState } from "react";
import {
  List,
  Avatar,
  Button,
  Modal,
  message,
  Popconfirm,
  Typography,
  Card,
  Row,
  Col,
  Descriptions,
  Space,
} from "antd";
import axios from "axios";
import {
  BackwardOutlined,
  DeleteOutlined,
  EditOutlined,
  ManOutlined,
  PlusCircleOutlined,
  UserAddOutlined,
  QuestionCircleOutlined,
  WomanOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import AddEmployeeForm from "../components/SalonShop/EmployeeForm";
import { useDispatch, useSelector } from "react-redux";
import { actGetAllEmployees } from "../store/salonEmployees/action";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { actGetSalonInformationByOwnerId } from "../store/salonInformation/action";
import "../css/manageVoucher.css";

function ListBarberEmployees() {
  const { id } = useParams(); //salonId
  const [open, setOpen] = useState(false);
  const [detailEmployee, setDetailEmployee] = useState("");
  const [serviceModalVisible, setServiceModalVisible] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const listEmployee = useSelector(
    (state) => state.SALONEMPLOYEES.listEmployee
  );



  const idCustomer = useSelector(
    (state) => state.ACCOUNT.idCustomer
  );
  const ownerId = useSelector(
    (state) => state.ACCOUNT.idOwner
  );

  useEffect(() => {
    dispatch(actGetSalonInformationByOwnerId(ownerId));
    dispatch(actGetAllEmployees(id));
  }, [dispatch, id, ownerId]);

  const handleDelete = (employee) => {
    axios
      .put(
        `http://14.225.218.91:8080/api/v1/salonemployees/DeleteSalonEmployee/${employee.id}`
      )
      .then(() => {
        const updatedEmployeeList = listEmployee.filter(
          (emp) => emp.id !== employee.id
        );
        dispatch(actGetAllEmployees(id));
        message.success("Employee was deleted!");
      });
  };

  const handleDetail = (employee) => {
    setDetailEmployee(employee);
  };

  const handleServiceModal = () => {
    setServiceModalVisible(true);
  };
  const formatTime = (decimalHours) => {
    const hours = Math.floor(decimalHours);

    // Get the decimal part and convert to minutes
    const decimalPart = decimalHours - hours;
    let minutes = 0;

    if (decimalPart >= 0.75) {
      minutes = 45;
    } else if (decimalPart >= 0.5) {
      minutes = 30;
    } else if (decimalPart >= 0.25) {
      minutes = 15;
    }

    let timeString = "";
    if (hours > 0) {
      timeString += `${hours} giờ `;
    }
    if (minutes > 0) {
      timeString += `${minutes} phút`;
    }

    return timeString.trim();
  };

  return (
    <>
      <div
        style={{
          marginTop: "140px",
          marginLeft: "250px",
          marginRight: "250px",
        }}
      >
        {/* {listEmployee.length === 0 ? (
          <Typography.Title level={3}>
            Your employees list is empty!
          </Typography.Title>
        ) :
         ( */}
        <>
          <div className="p-6 bg-green-100 border rounded-xl flex justify-around items-center">
            <Button
              icon={<BackwardOutlined />}
              danger
              onClick={() => navigate(-1)}
            >
              Quay lại
            </Button>
            <Typography.Title className="pr-[15rem] pl-[15rem]">
              Danh sách nhân viên
            </Typography.Title>
            <Button
              className="addButtonStyle"
              icon={<UserAddOutlined />}
              onClick={() => setOpen(true)}
            >
              Thêm nhân viên
            </Button>
            <Modal
              width={800}
              title="Tạo nhân viên mới"
              open={open}
              onOk={() => setOpen(false)}
              onCancel={() => setOpen(false)}
              footer={null}
            >
              <AddEmployeeForm
                salonInformation={useSelector(
                  (state) => state.SALONINFORMATION.getSalonByOwnerId
                )}
                isOpen={(e) => setOpen(e)}
              />
            </Modal>
          </div>
          <List
            loading={false}
            itemLayout="horizontal"
            dataSource={listEmployee}
            renderItem={(employeeList) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      size={64}
                      src={employeeList.img}
                      onClick={() => handleDetail(employeeList)}
                      style={{ cursor: "pointer" }}
                    />
                  }
                  title={employeeList.fullName}
                  description={employeeList.email}
                />
                <Space size={"small"}>
                  <Link to={`account_details/${employeeList.id}`}>
                    <Button
                      className="editButtonStyle"
                      icon={<EditOutlined />}
                      type="text"
                    >
                      Chỉnh sửa
                    </Button>
                  </Link>
                  <Popconfirm
                    title="Delete employee"
                    onConfirm={() => handleDelete(employeeList)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button
                      className="deleteButtonStyle"
                      icon={<DeleteOutlined />}
                      danger
                    >
                      Xóa
                    </Button>
                  </Popconfirm>
                </Space>
              </List.Item>
            )}
          />
        </>
        {/* )} */}
      </div>
      {detailEmployee && (
        <Modal
          title={null}
          visible={!!detailEmployee}
          width="1000px"
          onCancel={() => setDetailEmployee(null)}
          footer={null}
          bodyStyle={{ height: "600px" }}
        >
          <Card
            title={`Thông tin nhân viên ${detailEmployee.fullName}`}
            style={{ width: "100%", height: "100%", margin: "20px auto" }}
          >
            <Row gutter={16}>
              <Col span={6}>
                <Avatar size={200} src={detailEmployee.img} />
              </Col>
              <Col span={18}>
                <Descriptions
                  title={
                    <div
                      className="bg-blue-400 p-3 w-max border border-red-200 rounded-md text-slate-100 cursor-pointer"
                      onClick={handleServiceModal}
                    >
                      Dịch vụ của nhân viên {detailEmployee.fullName}{" "}
                      <ArrowUpOutlined />
                    </div>
                  }
                  bordered
                >
                  <Descriptions.Item label="Số điện thoại">
                    {detailEmployee.phone}
                  </Descriptions.Item>
                  <Descriptions.Item
                    className={
                      detailEmployee.isActive
                        ? "bg-green-300 border-dotted border-2 text-slate-100 font-bold"
                        : "bg-red-300 border-dotted border-2 text-slate-100 font-bold"
                    }
                    label="Trạng thái"
                  >
                    {detailEmployee.isActive ? "Còn làm việc" : "Nghỉ việc"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Giới Tính">
                    {detailEmployee.gender === "Male" ? (
                      <ManOutlined />
                    ) : detailEmployee.gender === "Female" ? (
                      <WomanOutlined />
                    ) : (
                      <QuestionCircleOutlined />
                    )}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: "20px" }}>
              <Col span={24}>
                <Descriptions title="Lịch trình" bordered>
                  {detailEmployee.schedules.map((schedule, index) => (
                    <Descriptions.Item key={index} label={schedule.dayOfWeek}>
                      {schedule.startTime.slice(0, 5)}am -{" "}
                      {schedule.endTime.slice(0, 5)}pm
                    </Descriptions.Item>
                  ))}
                </Descriptions>
              </Col>
            </Row>
          </Card>
        </Modal>
      )}
      {serviceModalVisible && (
        <Modal
          title={`Dịch vụ của ${detailEmployee.fullName}`}
          visible={serviceModalVisible}
          onCancel={() => setServiceModalVisible(false)}
          footer={null}
        >
          <List
            dataSource={detailEmployee.serviceHairs}
            renderItem={(service) => (
              <>
                <List.Item>
                  {service.serviceName} -{" "}
                  {<Avatar size={100} src={service.img} />} -{" "}
                  {formatTime(service.time)}
                </List.Item>
                <List.Item>{service.description}</List.Item>
              </>
            )}
          />
        </Modal>
      )}
    </>
  );
}

export default ListBarberEmployees;
