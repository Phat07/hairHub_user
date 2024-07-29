import React, { useEffect, useState } from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { useDispatch, useSelector } from "react-redux";
import { actGetFeedBackByCustomerId } from "../store/ratingCutomer/action";
import { Card, Col, Pagination, Rate, Row } from "antd";
import moment from "moment";

function CustomerFeedback(props) {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const auth = useAuthUser();
  console.log("auth", auth);

  const customerFeedback = useSelector(
    (state) => state.RATING.getFeedbackbyCustomerId
  );
  console.log("customerFeedback", customerFeedback);

  const totalPages = useSelector((state) => state.RATING.totalPages);
  console.log("totalPages", totalPages);

  useEffect(() => {
    dispatch(
      actGetFeedBackByCustomerId(auth.idCustomer, currentPage, pageSize)
    );
  }, [dispatch, auth.idCustomer]);

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
        {customerFeedback?.map((feedback) => (
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
                <strong>Salon:</strong>{" "}
                {feedback.appointment.salonInformation?.name}
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

export default CustomerFeedback;
