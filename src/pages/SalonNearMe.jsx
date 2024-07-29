import React from "react";
import Header from "../components/Header";
import { Select, Button, Row, Col, Image, List } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";

const { Option } = Select;

function SalonNearMe(props) {
  const provinces = [
    "Hà Nội",
    "TP Hồ Chí Minh",
    "Đà Nẵng",
    "Cần Thơ",
    "Hải Phòng",
    "Hải Dương",
    "Phú Thọ",
    "Quảng Ninh",
    "Bắc Giang",
    "Bắc Ninh",
    "Lạng Sơn",
    "Thanh Hóa",
    "Nghệ An",
    "Hà Tĩnh",
    "Hà Nội",
    "TP Hồ Chí Minh",
    "Đà Nẵng",
    "Cần Thơ",
    "Hải Phòng",
    "Hải Dương",
    "Phú Thọ",
    "Quảng Ninh",
    "Bắc Giang",
    "Bắc Ninh",
    "Lạng Sơn",
    "Thanh Hóa",
    "Nghệ An",
    "Hà Tĩnh",
  ];
  const [selectedProvince, setSelectedProvince] = React.useState(null);
  const [selectedDistrict, setSelectedDistrict] = React.useState(null);

  const districts = ["Quận 1", "Quận 2", "Quận 3"]; // Thêm các quận/huyện còn lại theo tỉnh thành được chọn

  return (
    <div>
      <Header />
      <Row
        gutter={24}
        style={{
          marginTop: "140px",
          marginLeft: "250px",
          marginRight: "250px",
          backgroundColor: "white",
          paddingTop: "2rem",
          paddingBottom: "2rem",
          borderRadius: "5px",
        }}
      >
        <Col span={8} style={{}}>
          <div>
            <div>
              <Button
                type="primary"
                style={{
                  marginBottom: 20,
                  backgroundColor: "#15397F",
                  borderColor: "#15397F",
                }} // Thay đổi màu sắc của nút
                block // Chiếm hết diện tích
                icon={<EnvironmentOutlined />} // Thêm icon định vị
              >
                Tìm salon gần bạn
              </Button>
            </div>
          </div>
          <div
            style={{
              height: "60rem",
              overflowY: "scroll",
              border: "1px solid #ccc",
              padding: "10px",
              // textAlign: "center"
            }}
          >
            <List
              size="small"
              bordered={false}
              dataSource={provinces}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
          </div>
        </Col>
        <Col span={16}>
          <Row gutter={8}>
            {" "}
            <Col span={12}>
              <Select
                style={{ width: "100%" }}
                placeholder="Chọn tỉnh/thành"
                onChange={(value) => setSelectedProvince(value)}
              >
                {provinces.map((province) => (
                  <Option key={province} value={province}>
                    {province}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={12}>
              <Select
                style={{ width: "100%" }}
                placeholder="Chọn quận/huyện"
                onChange={(value) => setSelectedDistrict(value)}
              >
                {districts.map((district) => (
                  <Option key={district} value={district}>
                    {district}
                  </Option>
                ))}
              </Select>
            </Col>
          </Row>
          <div
            style={{
              marginTop: "2rem",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div style={{ pointerEvents: "none" }}>
              <Image
                src={
                  selectedProvince
                    ? "URL của bản đồ theo tỉnh thành được chọn"
                    : "https://30shine.com/static/media/map.818d0bbb.png"
                }
                alt="Map"
                style={{
                  width: "100%",
                  height: "58rem",
                  marginTop: 20,
                }}
              />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default SalonNearMe;
