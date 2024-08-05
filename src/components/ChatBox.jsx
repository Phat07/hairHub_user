import React, { useState } from "react";
import {
  MainContainer,
  ChatContainer,
  ConversationHeader,
  MessageList,
  Message,
  MessageInput,
  Avatar,
  TypingIndicator,
  VoiceCallButton,
  VideoCallButton,
  InfoButton,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import "../css/ChatComponent.css";
import { FaTimes, FaComments } from "react-icons/fa";
import logo from "../assets/images/hairHubLogo.png";

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);

  const toggleChatBox = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = async (message) => {
    if (message.trim() === "") return;

    const userMessage = {
      text: message,
      direction: "outgoing",
      avatar: { logo },
      sender: "User",
      sentTime: "Just now",
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // Gửi tin nhắn tới API Gemini và nhận phản hồi
    const response = await fetch("/api/gemini", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });
    const data = await response.json();

    const replyMessage = {
      text: data.reply,
      direction: "incoming",
      avatar: { logo },
      sender: "Hairhub",
      sentTime: "Just now",
    };
    setMessages((prevMessages) => [...prevMessages, userMessage, replyMessage]);
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
          width: "6rem",
          height: "6rem",
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
        <MainContainer>
          <ChatContainer
            className="cs-main-container"
            style={{ height: "400px", width: "35rem" }}
          >
            <ConversationHeader>
              <Avatar name="Hairhub" src={logo} />
              <ConversationHeader.Content
                info="Active 10 mins ago"
                userName="Hairhub"
              />
              <ConversationHeader.Actions>
                <VoiceCallButton />
                <VideoCallButton />
                <InfoButton />
              </ConversationHeader.Actions>
            </ConversationHeader>
            <MessageList
              typingIndicator={<TypingIndicator content="Hairhub is typing" />}
              className="cs-message-list" // Áp dụng class CSS để kiểm soát thanh cuộn
            >
              {messages.map((msg, i) => (
                <Message
                  key={i}
                  model={{
                    direction: msg.direction,
                    message: msg.text,
                    position: "single",
                    sender: msg.sender,
                    sentTime: msg.sentTime,
                  }}
                >
                  {msg.direction === "incoming" && (
                    <Avatar name={msg.sender} src={msg.avatar} />
                  )}
                </Message>
              ))}
            </MessageList>
            <MessageInput placeholder="Type message here" onSend={handleSend} />
          </ChatContainer>

          <button
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
            }}
            onClick={toggleChatBox}
          >
            <FaTimes size={16} color="black" />
          </button>
        </MainContainer>
      )}
    </div>
  );
};

export default ChatBox;
