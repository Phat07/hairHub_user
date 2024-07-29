import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Input,
  InputNumber,
  List,
  Row,
  Space,
  Typography,
} from "antd";
import { BsPerson } from "react-icons/bs";
import { Form } from "react-router-dom";
import { Select } from "@react-three/drei";

const { Title, Text } = Typography;

const AccountForm = ({ id, user }) => {
  return (
    <Card id={id} title="My Account">
      <Row gutter={16}>
        <Col span={8}>
          <Avatar
            size={300}
            src={
              user?.avatar ||
              "https://zos.alipay.com/v0/antdesign/assets/default_avatar.png"
            }
          />
        </Col>
        <Col span={16}>
          <Row>
            <Col>
              <Title level={4}>{user?.fullName}</Title>
            </Col>
            <Col
              flex={1}
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Button type="primary">Edit</Button>
            </Col>
          </Row>
          <List bordered id={id}>
            <List.Item>
              <Text strong>Username:</Text>
              <Text>{user?.fullName}</Text>
            </List.Item>
            <List.Item>
              <Text strong>Email:</Text>
              <Text>{user?.email}</Text>
            </List.Item>
            <List.Item>
              <Text strong>Gender:</Text>
              <Text>{user?.gender}</Text>
            </List.Item>
            <List.Item>
              <Text strong>Day Of Birth:</Text>
              <Text>{user?.dayOfBirth}</Text>
            </List.Item>
            <List.Item>
              <Text strong>Phone:</Text>
              <Text>{user?.phone}</Text>
            </List.Item>
            <List.Item>
              <Text strong>Address:</Text>
              <Text>{user?.address}</Text>
            </List.Item>
          </List>
        </Col>
      </Row>
    </Card>
  );
};

export default AccountForm;
