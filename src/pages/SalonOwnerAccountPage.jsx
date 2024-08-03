import React from "react";
import { useEffect, useState } from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { SalonInformationServices } from "../services/salonInformationServices";
import {
  Card,
  Avatar,
  List,
  Descriptions,
  Row,
  Col,
  Image,
  message,
  Typography,
  Flex,
  Button,
  Space,
} from "antd";
import { UserOutlined, CalendarOutlined } from "@ant-design/icons";
import { AccountServices } from "../services/accountServices";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function SalonOwnerAccountPage() {
 
  const userName = useSelector(
    (state) => state.ACCOUNT.userName
  );
  const idCustomer = useSelector(
    (state) => state.ACCOUNT.idCustomer
  );
  const idOwner = useSelector(
    (state) => state.ACCOUNT.idOwner
  );
  const uid = useSelector(
    (state) => state.ACCOUNT.uid
  );
 

  const [salonData, setSalonData] = useState({});

  useEffect(() => {
    AccountServices.GetInformationAccount(uid)
      .then((res) => {
        console.log(res, "res SalonInfo");
        setSalonData(res.data);
      })
      .catch((err) => {
        message.error("Can not get your salon details!");
      });
  }, []);

  const handleReload = () => {
    window?.location?.reload();
  };

  const { name, address, description, img, salonOwner, schedules } = salonData;
  return (
    <div
      style={{
        marginTop: "140px",
        marginLeft: "100px",
        marginRight: "100px",
      }}
    >
      {uid ? (
        <>
          <Card title={name} bordered={false} style={{ width: "100%" }}>
            <Row gutter={16}>
              <Col span={6}>
                <Image width={250} src={img} />
              </Col>
              <Col span={18}>
                <Descriptions title="Thông tin người dùng">
                  <Descriptions.Item label="Name">
                    {salonData?.fullName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Phone">
                    {salonData?.phone}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    {salonData?.email}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={6}>
                {idOwner && (
                  <Link to={"/salon_report"}> Danh sách báo cáo của bạn</Link>
                )}
                {idCustomer && (
                  <Link to={"/customer_report"}>
                    {" "}
                    Danh sách báo cáo của bạn
                  </Link>
                )}
              </Col>
              <Col span={6}>
                {idOwner && (
                  <Link to={"/dashboardTransaction"}> Thống kê doanh thu</Link>
                )}
              </Col>
            </Row>
          </Card>

          {/* <Card
            title="Owner Information"
            bordered={false}
            style={{ width: "100%", marginTop: "20px" }}
          >
            <Row gutter={16}>
              <Col span={8}>
                <Avatar
                  size={100}
                  src={salonOwner?.img}
                  icon={<UserOutlined />}
                />
              </Col>
              <Col span={16}>
                <Descriptions title="Owner Details">
                  <Descriptions.Item label="Full Name">
                    {salonOwner?.fullName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    {salonOwner?.email}
                  </Descriptions.Item>
                  <Descriptions.Item label="Phone">
                    {salonOwner?.phone}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
          </Card> */}

          {/* <Card
            title="Schedule"
            bordered={false}
            style={{ width: "100%", marginTop: "20px" }}
          >
            <List
              itemLayout="horizontal"
              dataSource={schedules}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<CalendarOutlined />} />}
                    title={item.dayOfWeek}
                    description={`${item.startTime} - ${item.endTime} ${
                      item.isActive ? "(Active)" : "(Inactive)"
                    }`}
                  />
                </List.Item>
              )}
            />
          </Card> */}
        </>
      ) : (
        <Flex justify="center" align="center">
          <Space direction="vertical">
            <Typography.Title>Your account is not found!</Typography.Title>
            <Button style={{ width: "100%" }} onClick={handleReload}>
              Reload
            </Button>
          </Space>
        </Flex>
      )}
    </div>
  );
}

export default SalonOwnerAccountPage;
