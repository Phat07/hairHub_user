import { Card } from "antd";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import iconZalo from "../../src/assets/images/policyImg/zalo1.jpg";
import iconMes from "../../src/assets/images/policyImg/messager.png";
const ChatButton = () => {
  // Animation config cho Messenger
  const [messengerKey, setMessengerKey] = useState(0);
  const [zaloKey, setZaloKey] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setMessengerKey((prev) => prev + 1);
      setTimeout(() => {
        setZaloKey((prev) => prev + 1);
      }, 250); // Zalo lắc sau Messenger 250ms
    }, 100); // Interval 2 giây

    return () => clearInterval(intervalId);
  }, []);

  // Cấu hình animation lắc
  const shakeAnimation = {
    shake: {
      rotate: [0, -10, 10, -10, 10, 0],
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="fixed bottom-20 right-2 z-50">
      <div className="flex flex-col gap-4">
        <a
          href="https://m.me/hairhubvn"
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <motion.div
            key={messengerKey}
            animate="shake"
            variants={shakeAnimation}
            className="w-16 h-16 rounded-full overflow-hidden hover:scale-110 transition-transform duration-300"
            whileHover={{ scale: 1.1 }}
          >
            <img
              src={iconMes}
              alt="Messenger"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </a>

        <a
          href="https://zalo.me/2991839580870454972"
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <motion.div
            key={zaloKey}
            animate="shake"
            variants={shakeAnimation}
            className="w-14 h-14 rounded-full overflow-hidden hover:scale-110 transition-transform duration-300"
            whileHover={{ scale: 1.1 }}
          >
            <img
              src={iconZalo}
              alt="Zalo"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </a>
        {/* <a target="_blank" rel="noopener noreferrer" onClick={toggleChatBox}>
          <div className={`${styles.icon}`}>
            <Avatar src={logo} size={50} />
          </div>
        </a> */}
      </div>
    </div>
  );
};

export default ChatButton;
