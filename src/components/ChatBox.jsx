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
import { AccountServices } from "@/services/accountServices";
import { useSelector } from "react-redux";
const ChatButton = () => {
  // const handleClick = () => {
  //   window.open("https://m.me/hairhubvn", "_blank");
  // };
  const idCustomer = useSelector((state) => state.ACCOUNT.idCustomer);
  const avatar = useSelector((state) => state.ACCOUNT.avatar);
  const userInfo = useSelector((state) => state.ACCOUNT.userInfo);
  const isSmallScreen = window.innerWidth <= 768;
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const refreshToken = localStorage.getItem("refreshToken");
  const toggleChatBox = () => {
    setIsOpen(!isOpen);
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); // Ví dụ: "14:30"
  };

  const handleSend = async (message) => {
    if (message.trim() === "") return;

    if (!idCustomer) {
      return;
    }
    if (!refreshToken) {
      return;
    }

    const userMessage = {
      text: message,
      direction: "outgoing",
      avatar: avatar,
      sender: userInfo?.fullName,
      sentTime: getCurrentTime(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // Lấy tin nhắn trước đó (nếu có)
    const previousMessage =
      messages
        .slice()
        .reverse()
        .find((msg) => msg.direction === "outgoing")?.text || "";
    setIsLoading(true);
    try {
      let data = {
        askMessage: message,
        preQuestion: previousMessage,
        customerId: idCustomer,
      };
      const response = await AccountServices.ChatMessageAI(data);
      const replyMessage = {
        text: response.data,
        direction: "incoming",
        avatar: logo,
        sender: "Hairhub",
        sentTime: getCurrentTime(),
      };
      setMessages((prevMessages) => [...prevMessages, replyMessage]);
    } catch (error) {
      console.error("Error fetching message:", error);
    } finally {
      // Kết thúc loading
      setIsLoading(false);
    }
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
            <Avatar src={iconMes} size={50} />
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
        {idCustomer && refreshToken && (
          <a
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              toggleChatBox();
            }}
          >
            <div className={`${styles.icon}`}>
              <Avatar src={logo} size={50} />
            </div>
          </a>
        )}
      </div>
      {isOpen && refreshToken && idCustomer && (
        <MainContainer>
          <ChatContainer
            className={`${styles.chatContainer}`}
            style={{
              height: isSmallScreen ? "78vh" : "65vh",
              width: isSmallScreen ? "78vw" : "25vw",
              minWidth: "300px", // Chiều rộng tối thiểu
              minHeight: "400px", // Chiều cao tối thiểu
              maxWidth: "100%", // Chiều rộng tối đa không vượt quá màn hình
            }}
          >
            <ConversationHeader>
              <ChatAvatar status="available" name="Hairhub" src={logo} />
              <ConversationHeader.Content
                // info="Chatbot by Hairhub"
                userName="Hairhub Chatbot"
              />
              {/* <ConversationHeader.Actions>
                <VoiceCallButton />
                <VideoCallButton />
                <InfoButton />
              </ConversationHeader.Actions> */}
            </ConversationHeader>
            <MessageList
              typingIndicator={
                isLoading && (
                  <TypingIndicator content="Chatbot Hairhub đang phản hồi" />
                )
              }
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
                    <ChatAvatar
                      status="available"
                      size="sm"
                      name={msg.sender}
                      src={msg.avatar}
                    />
                  )}
                  {msg.direction === "outgoing" && (
                    <ChatAvatar size="sm" name={msg.sender} src={msg.avatar} />
                  )}
                </Message>
              ))}
            </MessageList>
            <MessageInput
              placeholder="Nhập câu hỏi tại đây !!!"
              onSend={handleSend}
              attachButton="false"
            />
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
            onClick={() => {
              toggleChatBox();
            }}
          >
            <FaTimes size={16} color="black" />
          </button>
        </MainContainer>
      )}
    </div>
  );
};

export default ChatButton;
