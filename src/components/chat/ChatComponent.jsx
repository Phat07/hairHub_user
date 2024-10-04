// import React, { useState } from 'react';
// import {
//   MainContainer,
//   ChatContainer,
//   ConversationHeader,
//   MessageList,
//   Message,
//   MessageInput,
//   Avatar,
//   TypingIndicator,
//   MessageSeparator,
//   VoiceCallButton,
//   VideoCallButton,
//   InfoButton
// } from '@chatscope/chat-ui-kit-react';
// import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
// import "../../css/ChatComponent.css"

// const ChatComponent = () => {
//   const [messages, setMessages] = useState([]);

//   const handleSend = async (message) => {
//     if (message.trim() === '') return;

//     const userMessage = {
//       text: message,
//       direction: 'outgoing',
//       avatar: 'https://path-to-user-avatar.png',
//       sender: 'User',
//       sentTime: 'Just now'
//     };
//     setMessages((prevMessages) => [...prevMessages, userMessage]);

//     // Gửi tin nhắn tới API Gemini và nhận phản hồi
//     const response = await fetch('/api/gemini', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({ message })
//     });
//     const data = await response.json();

//     const replyMessage = {
//       text: data.reply,
//       direction: 'incoming',
//       avatar: 'https://chatscope.io/storybook/react/assets/emily-xzL8sDL2.svg',
//       sender: 'Emily',
//       sentTime: 'Just now'
//     };
//     setMessages((prevMessages) => [...prevMessages, userMessage, replyMessage]);
//   };

//   return (
//     <MainContainer>
//       <ChatContainer style={{ height: '400px' }}>
//         <ConversationHeader>
//           <Avatar
//             name="Emily"
//             src="https://chatscope.io/storybook/react/assets/emily-xzL8sDL2.svg"
//           />
//           <ConversationHeader.Content info="Active 10 mins ago" userName="Emily" />
//           <ConversationHeader.Actions>
//             <VoiceCallButton />
//             <VideoCallButton />
//             <InfoButton />
//           </ConversationHeader.Actions>
//         </ConversationHeader>
//         <MessageList typingIndicator={<TypingIndicator content="Emily is typing" />}>
//           <MessageSeparator content="Saturday, 30 November 2019" />
//           {messages.map((msg, i) => (
//             <Message
//               key={i}
//               model={{
//                 direction: msg.direction,
//                 message: msg.text,
//                 position: 'single',
//                 sender: msg.sender,
//                 sentTime: msg.sentTime,
//               }}
//             >
//               {msg.direction === 'incoming' && (
//                 <Avatar
//                   name={msg.sender}
//                   src={msg.avatar}
//                 />
//               )}
//             </Message>
//           ))}
//         </MessageList>
//         <MessageInput placeholder="Type message here" onSend={handleSend} />
//       </ChatContainer>
//     </MainContainer>
//   );
// };

// export default ChatComponent;
import React, { useState } from 'react';
import {
  MainContainer,
  ChatContainer,
  ConversationHeader,
  MessageList,
  Message,
  MessageInput,
  Avatar,
  TypingIndicator,
  MessageSeparator,
  VoiceCallButton,
  VideoCallButton,
  InfoButton
} from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import "../../css/ChatComponent.css";

const ChatComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  
  const handleSend = async (message) => {
    if (message.trim() === '') return;

    const userMessage = {
      text: message,
      direction: 'outgoing',
      avatar: 'https://path-to-user-avatar.png',
      sender: 'User',
      sentTime: 'Just now'
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // Gửi tin nhắn tới API Gemini và nhận phản hồi
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message })
    });
    const data = await response.json();

    const replyMessage = {
      text: data.reply,
      direction: 'incoming',
      avatar: 'https://chatscope.io/storybook/react/assets/emily-xzL8sDL2.svg',
      sender: 'HairHub',
      sentTime: 'Just now'
    };
    setMessages((prevMessages) => [...prevMessages, userMessage, replyMessage]);
  };

  return (
    <>
      {!isOpen ? (
        <button 
          className="open-button" 
          onClick={() => setIsOpen(true)}
        >
          Open Chat
        </button>
      ) : (
        <MainContainer>
          <ChatContainer style={{ height: '400px' }}>
            <ConversationHeader>
              <Avatar
                name="HairHub"
                src="https://chatscope.io/storybook/react/assets/emily-xzL8sDL2.svg"
              />
              <ConversationHeader.Content info="Active 10 mins ago" userName="HairHub" />
              <ConversationHeader.Actions>
                <VoiceCallButton disabled />
                <VideoCallButton disabled />
                <InfoButton disabled />
              </ConversationHeader.Actions>
            </ConversationHeader>
            <MessageList typingIndicator={<TypingIndicator content="HairHub is typing" />}>
              <MessageSeparator content="Saturday, 30 November 2019" />
              {messages.map((msg, i) => (
                <Message
                  key={i}
                  model={{
                    direction: msg.direction,
                    message: msg.text,
                    position: 'single',
                    sender: msg.sender,
                    sentTime: msg.sentTime,
                  }}
                >
                  {msg.direction === 'incoming' && (
                    <Avatar
                      name={msg.sender}
                      src={msg.avatar}
                    />
                  )}
                </Message>
              ))}
            </MessageList>
            <MessageInput placeholder="Type message here" onSend={handleSend} />
          </ChatContainer>
          <button 
            className="close-button" 
            onClick={() => setIsOpen(false)}
          >
            Close Chat
          </button>
        </MainContainer>
      )}
    </>
  );
};

export default ChatComponent;
