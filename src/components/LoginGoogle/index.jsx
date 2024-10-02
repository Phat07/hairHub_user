import React from "react";
import { motion } from "framer-motion";
import { Button, Divider, message, Space, Typography } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import axios from "axios"; // Để gửi idToken về server
import { AccountServices } from "@/services/accountServices";

function LoginGoogle(props) {
  // Hàm xử lý khi đăng nhập thành công
  const handleLoginSuccess = (response) => {
    const idToken = response.credential; // Lấy idToken từ response
    console.log("idToken", idToken);
    let data = {
      idToken: idToken,
    };
    AccountServices.loginGoogle(data)
      .then((res) => {
        console.log("res", res);
      })
      .catch((err) => {
        message.error(err?.response?.data?.message);
      });
    // Gửi idToken về server
    // axios
    //   .post("/api/auth/google", { idToken })
    //   .then((res) => {
    //     console.log("Server response:", res.data);
    //   })
    //   .catch((err) => {
    //     console.error("Error sending idToken to server:", err);
    //   });
  };

  return (
    <motion.div
      variants={{
        hidden: { y: "-100vh", opacity: 0 },
        visible: {
          y: "-1px",
          opacity: 1,
          transition: {
            delay: 0.5,
            type: "spring",
            stiffness: 500,
          },
        },
      }}
      initial="hidden"
      animate="visible"
    >
      <Divider>
        <Typography.Title level={5}>Đăng nhập bằng...</Typography.Title>
      </Divider>
      <Space size={3} className="flex justify-center">
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={() => {
            console.log("Login Failed");
          }}
        />
      </Space>
    </motion.div>
  );
}

export default LoginGoogle;
