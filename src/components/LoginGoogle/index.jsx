import { AccountServices } from "@/services/accountServices";
import { GoogleLogin } from "@react-oauth/google";
import { Card, Divider, Input, message, Modal, Space, Typography } from "antd";
import { motion } from "framer-motion";
import { useState } from "react";
const { Meta } = Card;

function LoginGoogle(props) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [role, setRole] = useState(null); // To track the selected role
  const [phone, setPhone] = useState(""); // To track the entered phone number
  const [selected, setSelected] = useState(false); // To track if a role is selected
  // Hàm xử lý khi đăng nhập thành công
  const handleLoginSuccess = (response) => {
    const idToken = response.credential; // Lấy idToken từ response
    console.log("idToken", idToken);
    let data = {
      idToken: idToken,
    };
    AccountServices.loginGoogle(data)
      .then((res) => {
        setIsModalVisible(true);
        console.log("res", res);
      })
      .catch((err) => {
        message.error(err?.response?.data?.message);
      });
  };
  const handleModalOk = () => {
    if (!role || !phone) {
      message.error("Vui lòng chọn vai trò và nhập số điện thoại.");
      return;
    }
    // Xử lý gửi vai trò và số điện thoại lên server
    console.log("Selected Role:", role);
    console.log("Phone:", phone);
    setIsModalVisible(false); // Đóng modal sau khi xử lý xong
  };

  const handleModalCancel = () => {
    setIsModalVisible(false); // Đóng modal nếu người dùng bấm hủy
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
        <Typography.Title level={5}>Đăng nhập hoặc đăng ký bằng...</Typography.Title>
      </Divider>
      <Space size={3} className="flex justify-center">
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={() => {
            console.log("Login Failed");
          }}
        />
      </Space>
      <Modal
        title="Chọn vai trò và nhập số điện thoại"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Space direction="horizontal">
          <Card
            onClick={() => {
              setSelected(true);
              setRole("Customer");
            }}
            hoverable
            className="register-img"
            style={{
              opacity: selected === true && role === "Customer" ? 0.5 : 1,
            }}
            cover={
              <img
                className="register-child-img"
                alt="example"
                src="https://amis.misa.vn/wp-content/uploads/2022/03/khach-hang.jpg"
              />
            }
          >
            <Meta title="Khách hàng" />
          </Card>

          <Card
            onClick={() => {
              setSelected(true);
              setRole("SalonOwner");
            }}
            hoverable
            className="register-img"
            style={{
              opacity: selected === true && role === "SalonOwner" ? 0.5 : 1,
            }}
            cover={
              <img
                className="register-child-img"
                alt="example"
                src="https://res.cloudinary.com/dkjghxf2j/image/upload/v1719246287/Default/ewx9nzljcilf0sychzmb.jpg"
              />
            }
          >
            <Meta title="Chủ salon" />
          </Card>
        </Space>
        <Divider />
        <Input
          placeholder="Nhập số điện thoại"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </Modal>
    </motion.div>
  );
}

export default LoginGoogle;
