import React, { useState } from "react";
import {
  Descriptions,
  Avatar,
  Typography,
  Button,
  Form,
  Input,
  Modal,
} from "antd";
import { UserOutlined, EditOutlined } from "@ant-design/icons";
import Header from "../components/Header";

const { Title } = Typography;

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditAvatar = () => {
    console.log("Chỉnh sửa ảnh đại diện");
  };

  const handleEditInfo = () => {
    setIsEditing(true);
  };

  const handleSaveInfo = () => {
    setIsEditing(false);
    console.log("Lưu thông tin đã chỉnh sửa");
  };

  return (
    <div>
      <Header />
      <div
        style={{
          marginTop: "140px",
          marginLeft: "250px",
          marginRight: "250px",
        }}
      ></div>
      <div style={{ padding: "50px 350px" }}>
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <div style={{ position: "relative", display: "inline-block" }}>
            <Avatar size={128} icon={<UserOutlined />} />
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={handleEditAvatar}
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                transform: "translate(25%, 25%)",
                border: "none",
                color: "white",
                backgroundColor: "#1890ff",
              }}
            />
          </div>
          <Title level={2} style={{ marginTop: "15px" }}>
            Tên Người Dùng
          </Title>
        </div>
        <div
          style={{
            backgroundColor: "white",
            padding: "24px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          {isEditing ? (
            <Form layout="vertical" onFinish={handleSaveInfo}>
              <Form.Item name="username" label="Tên Đăng Nhập">
                <Input />
              </Form.Item>
              <Form.Item name="fullName" label="Họ và Tên">
                <Input />
              </Form.Item>
              <Form.Item name="dayOfBirth" label="Ngày Sinh">
                <Input />
              </Form.Item>
              <Form.Item name="gender" label="Giới Tính">
                <Input />
              </Form.Item>
              <Form.Item name="email" label="Email">
                <Input />
              </Form.Item>
              <Form.Item name="phone" label="Số Điện Thoại">
                <Input />
              </Form.Item>
              <Form.Item name="roleName" label="Vai Trò">
                <Input />
              </Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginTop: "24px" }}
              >
                Lưu
              </Button>
            </Form>
          ) : (
            <>
              <Descriptions title="Thông Tin Cá Nhân" bordered column={1}>
                <Descriptions.Item label="Tên Đăng Nhập">
                  username
                </Descriptions.Item>
                <Descriptions.Item label="Họ và Tên">
                  fullName
                </Descriptions.Item>
                <Descriptions.Item label="Ngày Sinh">
                  dayOfBirth
                </Descriptions.Item>
                <Descriptions.Item label="Giới Tính">gender</Descriptions.Item>
                <Descriptions.Item label="Email">
                  email@example.com
                </Descriptions.Item>
                <Descriptions.Item label="Số Điện Thoại">
                  0123456789
                </Descriptions.Item>
                <Descriptions.Item label="Vai Trò">roleName</Descriptions.Item>
              </Descriptions>
              <Button
                type="primary"
                onClick={handleEditInfo}
                style={{ marginTop: "24px" }}
              >
                Chỉnh Sửa Thông Tin
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
