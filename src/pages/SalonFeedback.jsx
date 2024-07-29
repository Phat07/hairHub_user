import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { actGetSalonInformationByOwnerIdAsync } from "../store/salonAppointments/action";
import { actGetAllFeedbackBySalonId } from "../store/ratingCutomer/action";
import { Card, Col, message, Pagination, Rate, Row } from "antd";
import moment from "moment";

function SalonFeedback(props) {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const auth = useAuthUser();
  console.log("auth", auth);

  const salonInformationByOwnerId = useSelector(
    (state) => state.SALONAPPOINTMENTS.salonInformationByOwnerId
  );
  console.log("salonInformationByOwnerId", salonInformationByOwnerId);

  useEffect(() => {
    dispatch(actGetSalonInformationByOwnerIdAsync(auth.idOwner));
  }, []);

  const salonFeedback = useSelector(
    (state) => state.RATING.getAllFeedbackbySalonId
  );
  console.log("salonFeedback", salonFeedback);

  const totalPages = useSelector((state) => state.RATING.totalPages);
  console.log("totalPages", totalPages);

  useEffect(() => {
    if (salonInformationByOwnerId) {
      try {
        dispatch(
          actGetAllFeedbackBySalonId(
            salonInformationByOwnerId.id,
            currentPage,
            pageSize
          )
        );
      } catch (err) {
        message.error("Không thể lấy dữ liệu!");
      }
    } else {
      message.error("Không thể lấy dữ liệu!");
    }
  }, [dispatch, salonInformationByOwnerId]);

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  return (
    <div
      style={{
        padding: "20px",
        marginTop: "25rem",
        marginLeft: "20rem",
        marginRight: "20rem",
      }}
    >
      <Row gutter={16}>
        {salonFeedback?.map((feedback) => (
          <Col span={5} key={feedback.id}>
            <Card
              hoverable
              cover={
                <img
                  alt="example"
                  src={feedback.fileFeedbacks[0]?.img}
                  style={{ height: "20rem", objectFit: "cover" }}
                />
              }
            >
              <Card.Meta />

              <div>
                <Rate disabled defaultValue={feedback.rating} />
              </div>
              <div>
                <strong>Khách hàng:</strong> {feedback.customer?.fullName}
              </div>
              <div>
                <strong>Bình luận:</strong> {feedback.comment}
              </div>
              <div>
                <strong>Ngày tạo:</strong>{" "}
                {moment(feedback.createDate).format("DD/MM/YYYY")}
              </div>
            </Card>
          </Col>
        ))}
      </Row>
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={totalPages * pageSize}
        onChange={handlePageChange}
        style={{ textAlign: "center", marginTop: "20px" }}
      />
    </div>
  );
}

export default SalonFeedback;
