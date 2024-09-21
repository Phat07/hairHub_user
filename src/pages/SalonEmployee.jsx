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
import { actGetAllServicesBySalonId } from "../store/salonEmployees/action";
import { actGetSalonInformationByOwnerId } from "../store/salonInformation/action";
import classNames from "classnames";

function SalonEmployee(props) {
  dayjs.locale("vi");
  const currentDate = dayjs();
  const formattedDate = "DD/MM/YYYY";
  const { Panel } = Collapse;
  const [initLoading, setInitLoading] = useState(true);
  const [currentPageService, setCurrentPageService] = useState(1);
  const [pageSizeService, setPageSizeService] = useState(4);

  // const auth = useAuthUser();
  // const ownerId = auth?.idOwner;
  const idCustomer = useSelector((state) => state.ACCOUNT.idCustomer);
  const ownerId = useSelector((state) => state.ACCOUNT.idOwner);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const timeFormat = "HH:mm";
  const [serviceTime, setServiceTime] = useState(dayjs("00:00", timeFormat));

  const salonDetail = useSelector(
    (state) => state.SALONINFORMATION.getSalonByOwnerId
  );
  const listTotalService = useSelector(
    (state) => state.SALONEMPLOYEES.listService
  );
  const totalPagesService = useSelector(
    (state) => state.SALONEMPLOYEES.totalPagesServices
  );
  //logic fillter
  const [searchService, setSearchService] = useState("");
  const [searchServiceKey, setSearchServiceKey] = useState("");
  const [SortService, setSortService] = useState(null);
  const [FillterService, setFillterService] = useState("");
  const [sortLabelService, setSortLabelService] = useState("Sắp xếp");
  const [filterLabelService, setFilterLabelService] = useState("Lọc");

  const handleMenuClickServiceSort = (e) => {
    setSortService(e.key);
    setSortLabelService(e.key === "" ? "Tất cả" : `Sắp xếp theo ${e.key}`);
  };

  const handleMenuClickServiceFillter = (e) => {
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
    setSearchServiceKey(searchService);
  };

  useEffect(() => {
    dispatch(actGetSalonInformationByOwnerId(ownerId));
  }, []);

  useEffect(() => {
    if (
      salonDetail &&
      salonDetail.id &&
      currentPageService &&
      pageSizeService
    ) {
      dispatch(
        actGetAllServicesBySalonId(
          salonDetail.id,
          currentPageService,
          pageSizeService,
          searchServiceKey,
          FillterService,
          SortService
        )
      );
      // setIsLoading(false);
    }
  }, [
    salonDetail,
    currentPageService,
    pageSizeService,
    searchServiceKey,
    FillterService,
    SortService,
  ]);

  useEffect(() => {
    dispatch(actGetAllServicesBySalonId(salonDetail.id, 1, 4));
  }, []);

  useEffect(() => {
    if (isEmptyObject(salonDetail)) {
      setTimeout(() => {
        // message.info("Bạn cần phải tạo salon đầu tiên!");
        if (isEmptyObject(salonDetail)) {
          // navigate("/create_shop");
        } else {
          return;
        }
      }, 3000);
    } else if (ownerId) {
      dispatch(actGetSalonInformationByOwnerId(ownerId));
      setInitLoading(false);
    }
  }, [ownerId]);

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
        {!isEmptyObject(salonDetail) ? (
          <>
            <Card
              title="Thông tin Salon"
              className={styles["responsive-card"]}
              bodyStyle={{ padding: "10px" }}

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
                            src={salonDetail.img}
                            alt="img"
                            style={{
                              width: "100%",
                              height: "100%",
                              maxWidth: "15rem",
                              maxHeight: "15rem",
                              objectFit: "cover",
                              borderRadius: "1rem",
                            }}
                          />
                        </div>
                      </div>
                    }
                    bordered
                    className={styles["responsive-descriptions"]}
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
                      }}
                      span={2}
                      className={
                        salonDetail.status === "APPROVED"
                          ? "bg-green-300 border-dotted border-2 text-white font-bold"
                          : salonDetail.status === "REJECTED"
                          ? "bg-red-400 border-dotted border-2 text-white font-bold"
                          : salonDetail.status === "PENDING"
                          ? "bg-yellow-400 border-dotted border-2 text-white font-bold"
                          : salonDetail.status === "EDITED"
                          ? "bg-blue-300 border-dotted border-2 text-white font-bold"
                          : salonDetail.status === "SUSPENDED"
                          ? "bg-orange-400 border-dotted border-2 text-white font-bold"
                          : salonDetail.status === "CREATING"
                          ? "bg-purple-300 border-dotted border-2 text-white font-bold"
                          : salonDetail.status === "OVERDUE"
                          ? "bg-yellow-600 border-dotted border-2 text-white font-bold"
                          : salonDetail.status === "DISABLED"
                          ? "bg-gray-400 border-dotted border-2 text-white font-bold"
                          : "bg-gray-300 border-dotted border-2 text-white font-bold"
                      }
                      label="Trạng thái"
                    >
                      {salonDetail.status === "APPROVED"
                        ? "Hoạt động"
                        : salonDetail.status === "REJECTED"
                        ? "Bị từ chối"
                        : salonDetail.status === "PENDING"
                        ? "Chờ duyệt"
                        : salonDetail.status === "EDITED"
                        ? "Đang chỉnh sửa"
                        : salonDetail.status === "SUSPENDED"
                        ? "Bị đình chỉ"
                        : salonDetail.status === "CREATING"
                        ? "Đang tạo"
                        : salonDetail.status === "OVERDUE"
                        ? "Quá hạn thanh toán"
                        : salonDetail.status === "DISABLED"
                        ? "Bị cấm"
                        : salonDetail.status}
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
                  <Descriptions title="Thời gian đóng / mở cửa" bordered>
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
                  <Descriptions title="Lịch làm việc cá nhân" bordered>
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
                          style={{ maxWidth: "20rem" }}
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
                      <div className={styles["table-container"]}>
                        <Table
                          dataSource={listTotalService}
                          columns={columnsService}
                          pagination={false}
                          rowKey="phone"
                        />
                      </div>

                      <Pagination
                        current={currentPageService}
                        pageSize={pageSizeService}
                        total={totalPagesService}
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
