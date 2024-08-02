// ChatComponent.jsx
import React, { useState } from 'react';
import '../../css/ChatComponent.css';
import { MessageOutlined } from '@ant-design/icons';


const ChatComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'bot', text: "Welcome to our chat! We're a dynamic team offering quality services. Ready for exceptional experiences? How can we assist you today?" }
  ]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { sender: 'user', text: input }]);
      setInput('');
      // Simulate bot response
      setTimeout(() => {
        setMessages([...messages, { sender: 'user', text: input }, { sender: 'bot', text: "Seems like I've run out of juice, I won't be able to help you. Please try again in a while." }]);
      }, 1000);
    }
  };

  return (
    <>
      <div className={`chat-container ${isOpen ? 'open' : ''}`}>
        <div className="chat-header" onClick={() => setIsOpen(!isOpen)}>
          <span>hairHub</span>
          <span className="chat-status">online</span>
        </div>
        {isOpen && (
          <div className="chat-body">
            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div key={index} className={`chat-message ${msg.sender}`}>
                  {msg.text}
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input type="text" value={input} onChange={handleInputChange} placeholder="Enter your Query..." />
              <button onClick={handleSend}>Send</button>
            </div>
          </div>
        )}
      </div>
      {!isOpen && <button className="chat-fab" onClick={() => setIsOpen(!isOpen)}><MessageOutlined /></button>}
    </>
  );
};

export default ChatComponent;

