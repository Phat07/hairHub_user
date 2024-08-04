import React, { useState } from "react";
import { MessageList, Input, Button } from "react-chat-elements";
import "react-chat-elements/dist/main.css";
import { FaTimes, FaComments } from "react-icons/fa";
import logo from "../assets/images/hairHubLogo.png";

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isOnline, setIsOnline] = useState(true);

  const toggleChatBox = () => {
    setIsOpen(!isOpen);
  };

  const handleMessageChange = (e) => {
    setCurrentMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      setMessages([
        ...messages,
        {
          position: "right",
          type: "text",
          text: currentMessage,
          date: new Date(),
        },
      ]);
      setCurrentMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div>
      <button
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
          backgroundColor: "#007bff",
          border: "none",
          borderRadius: "50%",
          width: "5rem",
          height: "5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        }}
        onClick={toggleChatBox}
      >
        {isOpen ? (
          <FaTimes size={24} color="white" />
        ) : (
          <FaComments size={24} color="white" />
        )}
      </button>

      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "80px", // Điều chỉnh vị trí để không bị che bởi nút
            right: "20px",
            width: "35rem", // Tăng chiều rộng
            height: "40rem", // Tăng chiều cao
            border: "1px solid #ccc",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "white",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px",
              borderBottom: "1px solid #ccc",
              backgroundColor: "#007bff",
              borderRadius: "10px 10px 0 0",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={logo}
                alt="Logo"
                style={{
                  width: "30px",
                  height: "30px",
                  marginRight: "10px",
                  borderRadius: "50%",
                }}
              />
              <span style={{ color: "white", fontWeight: "bold" }}>
                Hairhub
              </span>
              <span
                style={{
                  marginLeft: "10px",
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: isOnline ? "green" : "red",
                }}
              ></span>
            </div>
            <button
              style={{
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
              }}
              onClick={toggleChatBox}
            >
              <FaTimes size={16} color="white" />
            </button>
          </div>
          <div style={{ padding: "10px", overflowY: "auto", flex: 1 }}>
            <MessageList
              className="message-list"
              lockable={true}
              toBottomHeight={"100%"}
              dataSource={messages}
            />
          </div>
          <div
            style={{
              display: "flex",
              padding: "10px",
              borderTop: "1px solid #ccc",
            }}
          >
            <Input
              placeholder="Điền vào đây..."
              multiline={false}
              value={currentMessage}
              onChange={handleMessageChange}
              onKeyPress={handleKeyPress}
              rightButtons={
                <Button
                  color="white"
                  backgroundColor="#007bff"
                  text="Gửi"
                  onClick={handleSendMessage}
                />
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
