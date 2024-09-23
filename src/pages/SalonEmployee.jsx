import {
  CaretRightOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  DollarCircleOutlined,
  DownOutlined,
  EditOutlined,
  LineOutlined,
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  Collapse,
  DatePicker,
  Descriptions,
  Dropdown,
  Flex,
  Form,
  Image,
  Input,
  InputNumber,
  Menu,
  Modal,
  Pagination,
  Popconfirm,
  Rate,
  Row,
  Skeleton,
  Space,
  Spin,
  Table,
  Tag,
  TimePicker,
  Typography,
  Upload,
  message,
} from "antd";
import axios from "axios";
import dayjs from "dayjs";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { isEmptyObject } from "../components/formatCheckValue/checkEmptyObject";
import styles from "../css/listShopBarber.module.css";
import {
  actGetSalonByEmployeeId,
  actGetScheduleByEmployeeId,
  actGetServiceHairByEmployeeId,
} from "../store/employee/action";
import classNames from "classnames";

function SalonEmployee(props) {
  dayjs.locale("vi");
  const currentDate = dayjs();
  const formattedDate = "DD/MM/YYYY";
  const { Panel } = Collapse;
  const [initLoading, setInitLoading] = useState(true);
  const [currentPageService, setCurrentPageService] = useState(1);
  const [pageSizeService, setPageSizeService] = useState(4);
  const [loading, setLoading] = useState(false);
  // const auth = useAuthUser();
  // const ownerId = auth?.idOwner;
  const idEmployee = useSelector((state) => state.ACCOUNT.idEmployee);

  const dispatch = useDispatch();

  const salonDetailEmployee = useSelector(
    (state) => state.EMPLOYEE.getSalonByEmployeeId
  );
  const listServiceEmployee = useSelector(
    (state) => state.EMPLOYEE.getServiceHairByEmployeeId
  );
  const listScheduleEmployee = useSelector(
    (state) => state.EMPLOYEE.getScheduleByEmployeeId
  );

  //logic fillter
  const [searchService, setSearchService] = useState("");
  const [searchServiceKey, setSearchServiceKey] = useState("");
  const [SortService, setSortService] = useState(null);
  const [FillterService, setFillterService] = useState("");
  const [sortLabelService, setSortLabelService] = useState("Sắp xếp");
  const [filterLabelService, setFilterLabelService] = useState("Lọc");

  const handleMenuClickServiceSort = (e) => {
    setCurrentPageService(1);
    setSortService(e.key);
    setSortLabelService(e.key === "" ? "Tất cả" : `Sắp xếp theo ${e.key}`);
  };

  const handleMenuClickServiceFillter = (e) => {
    setCurrentPageService(1);
    setFillterService(e.key);
    setFilterLabelService(
      e.key === ""
        ? "Tất cả"
        : e.key === "true"
        ? "Lọc theo trạng thái đang hoạt động"
        : "Lọc theo trạng thái không hoạt động"
    );
  };

  const sortMenuService = (
    <Menu onClick={handleMenuClickServiceSort}>
      <Menu.Item key="">Tất cả</Menu.Item>
      <Menu.Item key="giá tăng dần">Sắp xếp theo theo giá tăng dần</Menu.Item>
      <Menu.Item key="giá giảm dần">Sắp xếp theo theo giá giảm dần</Menu.Item>
      <Menu.Item key="thời gian tăng dần">
        Sắp xếp theo theo thời gian tăng dần
      </Menu.Item>
      <Menu.Item key="thời gian giảm dần">
        Sắp xếp theo theo thời gian giảm dần
      </Menu.Item>
    </Menu>
  );
  const filterMenuService = (
    <Menu onClick={handleMenuClickServiceFillter}>
      <Menu.Item key="">Tất cả</Menu.Item>
      <Menu.Item key="true">Lọc theo trạng thái đang hoạt động</Menu.Item>
      <Menu.Item key="false">Lọc theo trạng thái không hoạt động</Menu.Item>
    </Menu>
  );

  const handleSearchService = () => {
    setCurrentPageService(1);
    setSearchServiceKey(searchService);
  };

  useEffect(() => {
    if (idEmployee) {
      dispatch(actGetSalonByEmployeeId(idEmployee));
    }
  }, [idEmployee]);
  useEffect(() => {
    if (idEmployee) {
      dispatch(actGetScheduleByEmployeeId(idEmployee));
    }
  }, [idEmployee]);

  useEffect(() => {
    if (idEmployee && currentPageService && pageSizeService) {
      setLoading(true);
      dispatch(
        actGetServiceHairByEmployeeId(
          idEmployee,
          currentPageService,
          pageSizeService,
          searchServiceKey,
          FillterService,
          SortService
        )
      )
        .then((res) => {
          setLoading(false);
        })
        .catch((res) => {
          setLoading(false);
        })
        .finally((res) => {
          setLoading(false);
        });
      // setIsLoading(false);
    }
  }, [
    idEmployee,
    currentPageService,
    pageSizeService,
    searchServiceKey,
    FillterService,
    SortService,
  ]);

  // useEffect(() => {
  //   dispatch(actGetAllServicesBySalonId(salonDetail.id, 1, 4));
  // }, []);

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

  // Hàm định dạng thành VND
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };
  const formatTime = (value) => {
    return `${value * 60} phút`;
  };
  const columnsService = [
    {
      title: "Hình ảnh",
      dataIndex: "img",
      key: "img",
      align: "center",
      render: (text) => (
        <Avatar shape="square" size={72} src={text} alt="service" />
      ),
    },
    {
      title: "Tên dịch vụ",
      dataIndex: "serviceName",
      key: "serviceName",
      align: "center",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      align: "center",
    },
    {
      title: "Giá",
      dataIndex: "price",
      align: "center",
      key: "price",
      render: (price) => formatCurrency(price),
    },
    {
      title: "Thời gian",
      dataIndex: "time",
      key: "time",
      align: "center",
      render: (time) => formatTime(time),
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      align: "center",
      render: (isActive) =>
        isActive ? (
          <Tag icon={<CheckCircleOutlined />} color="green">
            Hoạt động
          </Tag>
        ) : (
          <Tag icon={<CloseCircleOutlined />} color="red">
            Không hoạt động
          </Tag>
        ),
    },
  ];

  const onPageChangeService = (page) => {
    setCurrentPageService(page);
  };

  return (
    <div>
      <div className={styles["container_list"]}>
        {!isEmptyObject(salonDetailEmployee) ? (
          <>
            <Card
              // title="Thông tin Salon"
              title={
                <span style={{ fontSize: "1.3rem", color: "#bf9456" }}>
                  Thông tin Salon
                </span>
              }
              className={styles["responsive-card"]}
              style={{ padding: 0, marginBlock: "10px" }}
              bodyStyle={{ padding: 0 }}

              // style={{ width: "100%", height: "100%", padding: "10px" }}
            >
              <Row
                gutter={16}
                className={styles["responsive-row"]}
                style={{ display: "flex" }}
              >
                {/* <Col span={8} xs={24} className="responsive-col">
                    <Image size={300} src={salonDetail.img} />
                  </Col> */}
                <Col span={18} xs={24} className="responsive-col1">
                  <Descriptions
                    title={
                      <div className={styles["salon-title-container"]}>
                        <div>
                          <img
                            src={salonDetailEmployee.img}
                            alt="img"
                            style={{
                              width: "100%",
                              height: "100%",
                              maxWidth: "15rem",
                              maxHeight: "15rem",
                              objectFit: "cover",
                              borderRadius: "1rem",
                              marginInline: "1rem",
                            }}
                          />
                        </div>
                      </div>
                    }
                    bordered
                    className={styles["responsive-descriptions"]}
                  >
                    <Descriptions.Item span={1} label="Địa chỉ">
                      {salonDetailEmployee.address}
                    </Descriptions.Item>
                    <Descriptions.Item span={2} label="Chủ Salon">
                      {salonDetailEmployee?.salonOwner?.fullName}
                    </Descriptions.Item>
                    <Descriptions.Item span={1} label="Mô tả">
                      {salonDetailEmployee.description}
                    </Descriptions.Item>

                    <Descriptions.Item
                      contentStyle={{
                        textAlign: "center",
                      }}
                      span={2}
                      className={
                        salonDetailEmployee.status === "APPROVED"
                          ? "bg-green-300 border-dotted border-2 text-white font-bold"
                          : salonDetailEmployee.status === "REJECTED"
                          ? "bg-red-400 border-dotted border-2 text-white font-bold"
                          : salonDetailEmployee.status === "PENDING"
                          ? "bg-yellow-400 border-dotted border-2 text-white font-bold"
                          : salonDetailEmployee.status === "EDITED"
                          ? "bg-blue-300 border-dotted border-2 text-white font-bold"
                          : salonDetailEmployee.status === "SUSPENDED"
                          ? "bg-orange-400 border-dotted border-2 text-white font-bold"
                          : salonDetailEmployee.status === "CREATING"
                          ? "bg-purple-300 border-dotted border-2 text-white font-bold"
                          : salonDetailEmployee.status === "OVERDUE"
                          ? "bg-yellow-600 border-dotted border-2 text-white font-bold"
                          : salonDetailEmployee.status === "DISABLED"
                          ? "bg-gray-400 border-dotted border-2 text-white font-bold"
                          : "bg-gray-300 border-dotted border-2 text-white font-bold"
                      }
                      label="Trạng thái"
                    >
                      {salonDetailEmployee.status === "APPROVED"
                        ? "Hoạt động"
                        : salonDetailEmployee.status === "REJECTED"
                        ? "Bị từ chối"
                        : salonDetailEmployee.status === "PENDING"
                        ? "Chờ duyệt"
                        : salonDetailEmployee.status === "EDITED"
                        ? "Đang chỉnh sửa"
                        : salonDetailEmployee.status === "SUSPENDED"
                        ? "Bị đình chỉ"
                        : salonDetailEmployee.status === "CREATING"
                        ? "Đang tạo"
                        : salonDetailEmployee.status === "OVERDUE"
                        ? "Quá hạn thanh toán"
                        : salonDetailEmployee.status === "DISABLED"
                        ? "Bị cấm"
                        : salonDetailEmployee.status}
                    </Descriptions.Item>

                    <Descriptions.Item label="Đánh giá">
                      <Rate disabled defaultValue={salonDetailEmployee?.rate} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Tổng đánh giá">
                      {salonDetailEmployee?.totalRating}
                    </Descriptions.Item>
                    <Descriptions.Item label="Số đánh giá">
                      {salonDetailEmployee?.totalReviewer}
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
              </Row>
              <Row gutter={16} style={{ marginTop: "20px" }}>
                <Col span={24}>
                  <Descriptions
                    title={
                      <span
                        style={{
                          fontSize: "1.3rem",
                          color: "#bf9456",
                          marginLeft: "1rem",
                        }}
                      >
                        Thời gian đóng / mở cửa
                      </span>
                    }
                    bordered
                  >
                    {salonDetailEmployee?.schedules &&
                      sortSchedules(salonDetailEmployee?.schedules).map(
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
                                <Typography.Text
                                  strong
                                  className={styles["small-text"]}
                                >
                                  {schedule.startTime.slice(0, 5)} AM
                                </Typography.Text>
                                <LineOutlined />
                                <Typography.Text
                                  strong
                                  className={styles["small-text"]}
                                >
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
              <Row gutter={16} style={{ marginTop: "20px" }}>
                <Col span={24}>
                  <Descriptions
                    title={
                      <span
                        style={{
                          fontSize: "1.3rem",
                          color: "#bf9456",
                          marginLeft: "1rem",
                        }}
                      >
                        Lịch làm việc cá nhân
                      </span>
                    }
                    bordered
                  >
                    {listScheduleEmployee &&
                      sortSchedules(listScheduleEmployee).map(
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
                                <Typography.Text
                                  strong
                                  className={styles["small-text"]}
                                >
                                  {schedule.startTime.slice(0, 5)} AM
                                </Typography.Text>
                                <LineOutlined />
                                <Typography.Text
                                  strong
                                  className={styles["small-text"]}
                                >
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
              <Row gutter={16} style={{ marginBlock: "30px" }}>
                <Col span={24}>
                  <Collapse
                    defaultActiveKey={["1"]}
                    expandIcon={({ isActive }) => (
                      <CaretRightOutlined rotate={isActive ? 90 : 0} />
                    )}
                    ghost
                    expandIconPosition={"end"}
                  >
                    <Panel
                      header={
                        <div className={styles["custom-header"]}>
                          Dịch vụ bạn phục vụ
                        </div>
                      }
                      key="1"
                      className={styles["title-table-collapse"]}
                    >
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

                        <Dropdown
                          overlay={filterMenuService}
                          className={styles["table-fillter-item"]}
                        >
                          <Button>
                            {filterLabelService} <DownOutlined />
                          </Button>
                        </Dropdown>
                        <Input
                          placeholder="Tìm kiếm theo tên dịch vụ"
                          className={styles["table-fillter-item"]}
                          style={{ maxWidth: "25rem" }}
                          suffix={
                            <SearchOutlined
                              style={{ cursor: "pointer" }}
                              onClick={handleSearchService} // Trigger search on icon click
                            />
                          }
                          value={searchService} // Liên kết state với giá trị input
                          onChange={(e) => setSearchService(e.target.value)} // Cập nhật state khi người dùng nhập
                          onPressEnter={handleSearchService} // Trigger search on Enter key press
                        />
                      </div>
                      {/* {listServiceEmployee.items.length > 0 && ( */}
                      <div className={styles["table-container"]}>
                        <Spin spinning={loading}>
                          <Table
                            dataSource={listServiceEmployee.items}
                            columns={columnsService}
                            pagination={false}
                            rowKey="phone"
                          />
                        </Spin>
                      </div>
                      {/* )} */}

                      <Pagination
                        current={currentPageService}
                        pageSize={pageSizeService}
                        total={listServiceEmployee.totalPages}
                        onChange={onPageChangeService}
                        style={{ marginTop: "20px", textAlign: "center" }}
                      />
                    </Panel>
                  </Collapse>
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

export default SalonEmployee;
