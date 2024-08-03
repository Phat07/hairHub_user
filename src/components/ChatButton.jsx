// src/components/ChatButton.js
import React, { useState } from "react";
import { Button, Modal, Input, Avatar } from "antd";
import {
  MessageOutlined,
  CloseOutlined,
  SendOutlined,
} from "@ant-design/icons";
import "../css/ChatButton.css";
import logo from "../assets/images/hairHubLogo.png";

const ChatButton = () => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = () => {
    // Logic xử lý khi gửi tin nhắn
    if (message.trim()) {
      setChatMessages([...chatMessages, message]);
      setMessage(""); // Reset message input field
    }
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <>
      <Button
        type="primary"
        shape="circle"
        icon={visible ? <CloseOutlined /> : <MessageOutlined />}
        size="large"
        className="chat-button"
        onClick={visible ? handleCancel : showModal}
        style={{ width: "60px", height: "60px", fontSize: "24px" }}
      />
      <Modal
        title={
          <div className="chat-header">
            <img src={logo} alt="Logo" className="chat-logo" />
            <span className="chat-title">HairHub</span>
          </div>
        }
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        className="chat-modal"
        width={400}
        style={{ position: "fixed", right: "24px", bottom: "80px" }}
        bodyStyle={{
          height: "500px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div className="chat-content">
          {chatMessages.map((msg, index) => (
            <p key={index} className="chat-message">
              {msg}
            </p>
          ))}
        </div>
        <div className="chat-input">
          <Input
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onPressEnter={handleOk}
            suffix={
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleOk}
              />
            }
          />
        </div>
      </Modal>
    </>
  );
};

export default ChatButton;
