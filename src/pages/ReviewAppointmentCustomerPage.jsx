import {
  BorderOutlined,
  CheckSquareOutlined,
  DeleteOutlined,
  DownOutlined,
  ReloadOutlined,
  SearchOutlined,
  StarFilled,
} from "@ant-design/icons";
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
} from "antd";
import classNames from "classnames";
import { useEffect, useState } from "react";
import styles from "../css/customerAppointment.module.css";
import stylesFillter from "../css/listShopBarber.module.css";
import "../css/customerAppointmentTable.css";
import style from "../css/salonDetail.module.css";
import { formatCurrency } from "@/components/formatCheckValue/formatCurrency";
import { API } from "@/services/api";
import { actGetSalonInformationByOwnerIdAsync } from "@/store/salonAppointments/action";
import { useDispatch, useSelector } from "react-redux";
import {
  actGetAllFeedbackBySalonId,
  actGetFeedbackFromSalonOwner,
} from "@/store/ratingCutomer/action";
import dayjs from "dayjs";
const { RangePicker } = DatePicker;
function ReviewAppointmentCustomerPage(props) {
  const [sortLabelPayment, setSortLabelPayment] = useState("Ngày hôm nay");
  const [type, setType] = useState("TODAY");
  const [loading, setLoading] = useState(false);
  const paymentHistory = [];
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [listData, setListData] = useState([]);
  const [total, setTotal] = useState(0);
  const [filterRating, setFilterRating] = useState(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [sortLabelStatus, setSortLabelStatus] = useState("Sắp xếp");
  const [SortStatus, setSortStatus] = useState(null);
  const [dateCommentFilter, setDateCommentFilter] = useState(null);
  const [searchEmployee, setSearchEmployee] = useState(null);
  const pageSizeFeedback = 5;
  const [currentPageFeedback, setCurrentPageFeedback] = useState(1);
  const totalPagesFeedback = useSelector((state) => state.RATING.totalPages);
  const ownerId = useSelector((state) => state.ACCOUNT.idOwner);
  const listFeedback = useSelector(
    (state) => state.RATING.getAllFeedbackFromSalonOwner
  );
  console.log("listFeedback", listFeedback);

  const salonInformationByOwnerId = useSelector(
    (state) => state.SALONAPPOINTMENTS.salonInformationByOwnerId
  );
  const fetchData = async () => {
    setLoading(true); // Bật loading
    if (salonInformationByOwnerId?.id) {
      const response = await API.get(
        `/appointments/FrequentlyCustomers/${salonInformationByOwnerId?.id}`,
        {
          params: { time: type, page: currentPage, size: itemsPerPage },
        }
      );
      setListData(response?.data?.items);
      setTotal(response?.data?.total);
    }

    setLoading(false); // Tắt loading sau khi gọi API xong
  };

  const dispatch = useDispatch();
  useEffect(() => {
    if (ownerId) {
      dispatch(actGetSalonInformationByOwnerIdAsync(ownerId));
    }
  }, [ownerId]);

  useEffect(() => {
    const fetchData = async () => {
      if (salonInformationByOwnerId?.id) {
        // Chỉ chạy khi salonInformationByOwnerId?.id tồn tại
        setLoading(true);
        try {
          const response = await API.get(
            `/appointments/FrequentlyCustomers/${salonInformationByOwnerId?.id}`,
            {
              params: { time: type, page: currentPage, size: itemsPerPage },
            }
          );
          setListData(response?.data?.items);
          setTotal(response?.data?.total);
        } catch (error) {
          console.error("Error fetching appointments:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [type, salonInformationByOwnerId, currentPage]);

  useEffect(() => {
    if (salonInformationByOwnerId?.id || currentPageFeedback) {
      setLoadingFeedback(true);
      dispatch(
        actGetFeedbackFromSalonOwner(
          salonInformationByOwnerId?.id,
          currentPageFeedback,
          pageSizeFeedback
        )
      )
        .then((res) => {})
        .catch((err) => {})
        .finally((err) => {
          setLoadingFeedback(false);
        });
    }
  }, [salonInformationByOwnerId?.id, currentPageFeedback]);

  const handleMenuClickPaymentSort = (e) => {
    const labelMap = {
      TODAY: "Ngày hôm nay",
      "7DAY": "7 ngày",
      "1MONTH": "1 tháng",
      "1YEAR": "1 năm",
      ALL: "Toàn thời gian",
    };

    setSortLabelPayment(labelMap[e.key] || "Ngày hôm nay");
    setType(e.key === "" ? null : e.key);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const sortMenu = (
    <Menu onClick={handleMenuClickPaymentSort}>
      <Menu.Item key="TODAY">Ngày hôm nay</Menu.Item>
      <Menu.Item key="7DAY">7 Ngày</Menu.Item>
      <Menu.Item key="1MONTH">1 Tháng</Menu.Item>
      <Menu.Item key="1YEAR">1 Năm</Menu.Item>
      <Menu.Item key="ALL">Toàn thời gian</Menu.Item>
    </Menu>
  );
  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Số cuộc hẹn",
      dataIndex: "numberofSuccessAppointment",
      key: "numberofSuccessAppointment",
    },
    {
      title: "Số tiền khách hàng đã bỏ ra",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (amount) => formatCurrency(amount),
    },
  ];
  // const handleFilterChange = (rating) => {
  //   setCurrentPageFeedback(1);
  //   setLoadingFeedback(true);
  //   setFilterRating(rating);
  //   dispatch(
  //     actGetFeedbackFromSalonOwner(
  //       salonInformationByOwnerId?.id,
  //       currentPageFeedback,
  //       pageSizeFeedback,
  //       rating,
  //       searchEmployee,
  //       dateCommentFilter
  //     )
  //   )
  //     .then((res) => {})
  //     .catch((err) => {})
  //     .finally((err) => {
  //       setLoadingFeedback(false);
  //     });
  // };
  // const handleSearchFeedback = (isDeleteConfirm) => {
  //   setCurrentPageFeedback(1);
  //   setLoadingFeedback(true);
  //   if (isDeleteConfirm) {
  //     setSearchEmployee(null);
  //     setDateCommentFilter(null);
  //     setSortStatus(null);
  //     setSortLabelStatus("Sắp xếp");
  //     // setSearchRating(null);
  //   }
  //   dispatch(
  //     actGetFeedbackFromSalonOwner(
  //       salonInformationByOwnerId?.id,
  //       currentPage,
  //       pageSizeFeedback,
  //       filterRating,
  //       isDeleteConfirm ? null : searchEmployee,
  //       isDeleteConfirm ? null : dateCommentFilter
  //     )
  //   )
  //     .then((res) => {
  //       // Xử lý thành công nếu cần
  //     })
  //     .catch((err) => {
  //       // Xử lý lỗi nếu cần
  //     })
  //     .finally(() => {
  //       setLoadingFeedback(false);
  //     });

  //   // setFilterRating(rating);
  // };

  const handleFeedbackAction = (options = {}) => {
    const {
      rating = filterRating,
      isSearchConfirm = isSearch,
      keepForm,
    } = options;
    // if (
    //   isSearchConfirm &&
    //   searchEmployee === null &&
    //   dateCommentFilter === null
    // ) {
    //   message.warning("Không có dữ liệu để tìm kiếm.");
    //   setLoadingFeedback(false);
    //   return;
    // }
    setCurrentPageFeedback(1);
    setLoadingFeedback(true);
    setFilterRating(rating);
    setIsSearch(isSearchConfirm);
    if (!keepForm) {
      setSearchEmployee(null);
      setDateCommentFilter(null);
      setSortStatus(null);
      setSortLabelStatus("Sắp xếp");
    }
    dispatch(
      actGetFeedbackFromSalonOwner(
        salonInformationByOwnerId?.id,
        currentPageFeedback,
        pageSizeFeedback,
        rating,
        isSearchConfirm ? searchEmployee : null,
        isSearchConfirm ? dateCommentFilter : null
      )
    )
      .then((res) => {
        // Xử lý thành công nếu cần
      })
      .catch((err) => {
        // Xử lý lỗi nếu cần
      })
      .finally(() => {
        setLoadingFeedback(false);
      });
  };

  function renderStars2(stars) {
    const filledStars = Math.floor(stars); // Số sao đầy đủ
    const fraction = stars % 1; // Phần thập phân của số sao
    const starIcons = [];

    // Thêm các sao đầy đủ
    for (let i = 0; i < filledStars; i++) {
      starIcons.push(<StarFilled key={i} style={{ color: "#FFD700" }} />);
    }

    // Thêm sao một phần nếu có phần thập phân
    if (fraction > 0) {
      starIcons.push(
        <span
          key={`partial-${filledStars}`}
          style={{
            position: "relative",
            display: "inline-block", // Keep stars inline
            width: "2.1rem", // Star size
            height: "2.1rem",
            overflow: "hidden",
            verticalAlign: "middle",
          }}
        >
          <StarFilled
            style={{
              position: "absolute",
              color: "#888", // màu sao trống
              zIndex: 1, // lớp dưới cùng
              left: 0,
              top: 6,
            }}
          />
          <StarFilled
            style={{
              position: "absolute",
              color: "#FFD700",
              clipPath: `inset(0 ${100 - fraction * 100}% 0 0)`, // phần sao được tô vàng
              zIndex: 2, // lớp trên cùng
              left: 0,
              top: 6,
            }}
          />
        </span>
      );
    }

    // Thêm các sao trống còn lại
    const remainingStars = 5 - filledStars - (fraction > 0 ? 1 : 0);
    for (let i = 0; i < remainingStars; i++) {
      starIcons.push(
        <StarFilled key={filledStars + i + 1} style={{ color: "#d4d2d2" }} />
      );
    }

    return starIcons;
  }

  const handleMenuClickStatusSort = (e) => {
    setSortStatus(e.key === "" ? null : e.key === "true");
    setSortLabelStatus(
      e.key === "" ? "Tất cả" : e.key === "true" ? "Chưa trả lời" : "Đã trả lời"
    );
  };

  const sortStatus = (
    <Menu onClick={handleMenuClickStatusSort}>
      <Menu.Item key="">Tất cả</Menu.Item>
      <Menu.Item key="true">Chưa trả lời</Menu.Item>
      <Menu.Item key="false">Đã trả lời</Menu.Item>
    </Menu>
  );

  const handleDateChange = (date, dateString) => {
    setIsSearch(false);
    if (dateString === "") {
      setDateCommentFilter(null);
    } else {
      setDateCommentFilter(dateString);
    }
  };

  return (
    <>
      <div
        className={styles.appointmentContainer}
        style={{ marginBottom: "1rem" }}
      >
        <h1 className="text-2xl font-bold mb-3" style={{ textAlign: "center" }}>
          Danh sách khách hàng thường xuyên đến cửa hàng
        </h1>

        <Spin
          className="custom-spin"
          spinning={loading}
          // tip="Loading..."
        >
          <div className="flex flex-wrap justify-end space-x-2 mb-3">
            <Button
              onClick={() => fetchData()}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "gray",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                textAlign: "center",
                fontSize: "1rem",
                fontWeight: "bold",
              }}
              icon={<ReloadOutlined />}
            />
          </div>
          <div
            className={`datePickerCustome ${styles.datePickerCustomeMobile}`}
            style={{ marginBottom: "10px" }}
          >
            <div
              className={classNames("my-custom-add", styles["table-fillter"])}
              style={{ marginBlock: "0px" }}
            >
              <Dropdown overlay={sortMenu} trigger={["click"]}>
                <Button className={styles["table-fillter-item"]}>
                  {sortLabelPayment} <DownOutlined />
                </Button>
              </Dropdown>
            </div>
          </div>

          <Table
            className={styles.appointmentTable}
            columns={columns}
            dataSource={listData}
            // loading={loading}
            rowKey="id"
            pagination={false}
          />
          <div className={styles.container}>
            <div className={styles.grid}>
              {listData?.map((appointment) => (
                <div key={appointment.id} className={styles.card}>
                  <h4
                    style={{
                      fontWeight: "bold",
                      color: "#bf9456",
                      textAlign: "center",
                    }}
                  >
                    {appointment?.name}
                  </h4>

                  <h4>
                    {/* Phương thức:{" "}
                  {(() => {
                    let vietnameseStatus = "";
                    let color = "green";
                    switch (appointment?.paymentType) {
                      case "DEPOSIT":
                        vietnameseStatus = "Nạp";
                        break;
                      case "WITHDRAW":
                        vietnameseStatus = "Rút";
                        color = "orange";
                        break;
                      default:
                        vietnameseStatus = "Không xác định";
                        color = "red";
                    }
                    return <Tag color={color}>{vietnameseStatus}</Tag>;
                  })()} */}
                  </h4>

                  <h4>
                    {/* Trạng thái:{" "}
                  {(() => {
                    let vietnameseStatus = "";
                    let color = "green";
                    switch (appointment?.status) {
                      case "CANCEL":
                        vietnameseStatus = "Thất bại";
                        color = "red";
                        break;
                      case "PAID":
                        vietnameseStatus = "Đã thanh toán";
                        break;
                      case "PENDING":
                        vietnameseStatus = "Đang xử lý";
                        color = "orange";
                        break;
                      default:
                        vietnameseStatus = "Không xác định";
                    }
                    return <Tag color={color}>{vietnameseStatus}</Tag>;
                  })()} */}
                  </h4>

                  <h4>
                    Số điện thoại: {appointment?.phone || "Không có mô tả"}
                  </h4>

                  <h4>Số tiền: {formatCurrency(appointment.totalPrice)}</h4>

                  <h4>
                    Số lần khách hàng đến:
                    {appointment?.numberofSuccessAppointment}
                  </h4>
                </div>
              ))}
            </div>
          </div>
          <Pagination
            className="paginationAppointment"
            current={currentPage}
            pageSize={itemsPerPage}
            total={total}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </Spin>
      </div>
      <div
        className={styles.appointmentContainer}
        style={{ marginTop: "1rem" }}
      >
        <h1 className="text-2xl font-bold mb-3" style={{ textAlign: "center" }}>
          Danh sách đánh giá salon
        </h1>
        <div>
          {/* <h3
            className={style["fillter-item1"]}
            style={{ marginBottom: "0", fontWeight: "bold", padding: "0px" }}
          >
            Số sao đánh giá:
          </h3> */}
          <div
            className={style["review-fillter"]}
            // style={{ justifyContent: "flex-start" }}
          >
            <div
              onClick={() =>
                handleFeedbackAction({ rating: null, keepForm: true })
              }
              className={style["fillter-item1"]}
              style={{ fontSize: 14 }}
            >
              {filterRating === null ? (
                <CheckSquareOutlined style={{ marginRight: 8, fontSize: 24 }} />
              ) : (
                <BorderOutlined style={{ marginRight: 8, fontSize: 24 }} />
              )}
              Tất cả
            </div>
            {[5, 4, 3, 2, 1].map((rating) => (
              <div
                key={rating}
                onClick={() =>
                  handleFeedbackAction({
                    rating: rating,
                    keepForm: true,
                  })
                }
                className={style["fillter-item1"]}
                style={{ fontSize: 14 }}
              >
                {filterRating === rating ? (
                  <CheckSquareOutlined
                    style={{ marginRight: 8, fontSize: 24 }}
                  />
                ) : (
                  <BorderOutlined style={{ marginRight: 8, fontSize: 24 }} />
                )}
                {rating} sao
              </div>
            ))}
          </div>
          <div
            className={classNames(
              "my-custom-add",
              stylesFillter["table-fillter"]
            )}
          >
            <Dropdown
              overlay={sortStatus}
              className={stylesFillter["table-fillter-item"]}
            >
              <Button style={{ color: "#fff" }}>
                {sortLabelStatus} <DownOutlined />
              </Button>
            </Dropdown>
            <DatePicker
              className={stylesFillter["table-fillter-item"]}
              style={{ backgroundColor: "#ece8de" }}
              format={"YYYY-MM-DD"}
              disabledDate={(current) => current && current.isAfter(new Date())}
              placeholder="Tìm kiếm theo ngày"
              value={
                dateCommentFilter
                  ? dayjs(dateCommentFilter, "YYYY-MM-DD")
                  : null
              }
              onChange={handleDateChange}
            />
            <Input
              placeholder="Tìm kiếm theo tên dịch vụ"
              className={stylesFillter["table-fillter-item"]}
              style={{ maxWidth: "23rem", backgroundColor: "#ece8de" }}
              value={searchEmployee} // Liên kết state với giá trị input
              onChange={(e) => {
                setSearchEmployee(e.target.value);
                setIsSearch(false);
              }} // Cập nhật state khi người dùng nhập
            />
            <div className={stylesFillter["table-fillter-item"]}>
              <Button
                icon={!isSearch ? <SearchOutlined /> : <DeleteOutlined />}
                type="link"
                variant="outlined"
                className={style.replyButton}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "10px", // Thêm khoảng cách nếu là nút tìm kiếm
                  borderColor: !isSearch ? "#1890ff" : "#ff4d4f", // Màu sắc khác nhau cho từng trạng thái
                  color: "#fff",
                }}
                onClick={() =>
                  handleFeedbackAction({
                    isSearchConfirm: !isSearch,
                    keepForm: !isSearch,
                  })
                }
              >
                {!isSearch ? "Áp dụng" : "Xóa"}
              </Button>
            </div>
          </div>
          <List
            itemLayout="horizontal"
            locale={{
              emptyText:
                listFeedback.length > 0
                  ? `Không có đánh giá ${filterRating} sao nào`
                  : "Không có đánh giá nào",
            }}
            loading={loadingFeedback}
            dataSource={listFeedback}
            renderItem={(feedback) => (
              <List.Item
                className={style.listItem}
                actions={[
                  <>
                    <Button
                      type="link"
                      variant="outlined"
                      // onClick={() => handleReply(feedback)}
                      style={{ borderColor: "#BF9456", color: "#BF9456" }}
                      className={style.replyButton}
                    >
                      Trả lời
                    </Button>
                  </>,
                ]}
              >
                <List.Item.Meta
                  title={
                    <div>
                      <div className={style.infoContainer}>
                        <div className={style.infoUser}>
                          <Avatar
                            src={feedback?.customer?.img}
                            shape="square"
                            size={"large"}
                          />
                          <div>
                            <p>{feedback?.customer.fullName}</p>
                            <p style={{ marginTop: "0" }}>
                              {new Date(
                                feedback?.createDate
                              ).toLocaleDateString("vi-VI", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                              | Dịch vụ sử dụng:{" "}
                              {feedback?.appointment?.appointmentDetails?.map(
                                (e, index, array) => (
                                  <span key={index}>
                                    {e?.serviceName}
                                    {index < array.length - 1 ? ", " : ""}
                                  </span>
                                )
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className={style.ratingFeedback}>
                        {renderStars2(feedback?.rating)}
                      </div>
                      <p className={style.commentFeedback}>
                        {feedback.comment}
                      </p>
                      <div className={style["feedback-images"]}>
                        {feedback.fileFeedbacks?.map((e, index) => (
                          <Image
                            key={index}
                            src={e.img}
                            alt={`Feedback Image ${index}`}
                            className={style["feedback-image"]}
                            preview={true} // Enable image preview
                          />
                        ))}
                      </div>
                    </div>
                  }
                  className={style.listItemMeta}
                />
              </List.Item>
            )}
          />

          <div className={style["rating"]}>
            <Pagination
              current={currentPageFeedback}
              total={totalPagesFeedback}
              pageSize={pageSizeFeedback}
              onChange={(page) => setCurrentPageFeedback(page)}
              className="paginationAppointment"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default ReviewAppointmentCustomerPage;
