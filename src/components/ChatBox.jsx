import React, { useState } from "react";
import { FaComments } from "react-icons/fa";

const ChatButton = () => {
  const handleClick = () => {
    window.open("https://m.me/hairhubvn", "_blank");
  };

  return (
    <button
      style={{
        position: "fixed",
        bottom: "55px",
        right: "5px",
        zIndex: 1000,
        backgroundColor: "#bf9456",
        border: "none",
        borderRadius: "50%",
        width: "4rem",
        height: "4rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      }}
      onClick={handleClick}
    >
      <FaComments size={24} color="white" />
    </button>
  );
};

export default ChatButton;
