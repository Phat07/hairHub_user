import { Avatar } from "antd";
import React, { useState } from "react";
import { FaComments, FaTimes } from "react-icons/fa";
import iconZalo from "../../src/assets/images/policyImg/zalo1.jpg";
import iconMes from "../../src/assets/images/policyImg/messager.png";
import logo from "../assets/images/hairHubLogo.png";
import styles from "../css/chatMesZalo.module.css";
import {
  MainContainer,
  ChatContainer,
  ConversationHeader,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
  VoiceCallButton,
  VideoCallButton,
  InfoButton,
} from "@chatscope/chat-ui-kit-react";
import { Avatar as ChatAvatar } from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
const ChatButton = () => {
  // const handleClick = () => {
  //   window.open("https://m.me/hairhubvn", "_blank");
  // };
  const isSmallScreen = window.innerWidth <= 768;
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      direction: "incoming",
      text: "Hello! How can we assist you today?",
      sender: "Hairhub",
      sentTime: "10:30 AM",
      avatar: logo,
    },
    {
      direction: "outgoing",
      text: "Hi, I would like to book an appointment.",
      sender: "User",
      sentTime: "10:32 AM",
    },
    {
      direction: "incoming",
      text: "Sure! Do you have a specific time in mind?",
      sender: "Hairhub",
      sentTime: "10:33 AM",
      avatar: logo,
    },
  ]);

  const toggleChatBox = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={styles.iconContainer}
      // onClick={handleClick}
    >
      {/* <FaComments size={24} color="white" /> */}
      <div className={styles.socialIcon}>
        <a
          href="https://m.me/hairhubvn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className={`${styles.icon} ${styles.messenger}`}>
            <Avatar src={iconMes} size={60} />
          </div>
        </a>
        <a
          href="https://zalo.me/2991839580870454972"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className={`${styles.icon} ${styles.zalo}`}>
            <Avatar src={iconZalo} size={50} />
          </div>
        </a>
        {/* <a target="_blank" rel="noopener noreferrer" onClick={toggleChatBox}>
          <div className={`${styles.icon}`}>
            <Avatar src={logo} size={50} />
          </div>
        </a> */}
      </div>
      {isOpen && (
        <MainContainer>
          <ChatContainer
            className={`${styles.chatContainer}`}
            style={
              isSmallScreen
                ? { height: "78vh", width: "78vw" }
                : { height: "75vh", width: "35vw" }
            }
          >
            <ConversationHeader>
              <ChatAvatar name="Hairhub" src={logo} />
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
              className={`${styles.chatList}`}
              typingIndicator={<TypingIndicator content="Hairhub is typing" />}
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
            <MessageInput placeholder="Type message here" />
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

export default ChatButton;