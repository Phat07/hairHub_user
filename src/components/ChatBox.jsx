import { Avatar } from "antd";
import React, { useState } from "react";
import { FaComments } from "react-icons/fa";
import iconZalo from "../../src/assets/images/policyImg/zalo1.jpg";
import iconMes from "../../src/assets/images/policyImg/messager.png";
import "../css/chatMesZalo.css";
const ChatButton = () => {
  const handleClick = () => {
    window.open("https://m.me/hairhubvn", "_blank");
  };

  return (
    <button
      style={{
        position: "fixed",
        bottom: "120px",
        right: "5px",
        zIndex: 1000,
        // backgroundColor: "#bf9456",
        border: "none",
        borderRadius: "50%",
        width: "4rem",
        height: "4rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        // boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      }}
      onClick={handleClick}
    >
      {/* <FaComments size={24} color="white" /> */}
      <div className="social-icon">
        <a
          href="https://m.me/hairhubvn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="icon messenger">
            <Avatar src={iconMes} size={60} />
          </div>
        </a>
        <a
          href="https://zalo.me/2991839580870454972"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="icon zalo">
            <Avatar src={iconZalo} size={50} />
          </div>
        </a>
      </div>
    </button>
  );
};

export default ChatButton;
