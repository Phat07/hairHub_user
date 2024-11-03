import { AccountServices } from "@/services/accountServices";
import { fetchUserByTokenApi } from "@/store/account/action";
import { GoogleLogin } from "@react-oauth/google";
import {
  Button,
  Card,
  Divider,
  Input,
  message,
  Modal,
  Space,
  Spin,
  Typography,
} from "antd";
import { motion } from "framer-motion";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { phonePattern } from "../Regex/Patterns";
import { CheckCircleOutlined } from "@ant-design/icons";
const { Meta } = Card;

function LoginGoogle(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [role, setRole] = useState(null); // To track the selected role
  const [phone, setPhone] = useState(""); // To track the entered phone number
  const [selected, setSelected] = useState(false); // To track if a role is selected
  const [loading, setLoading] = useState(false);
  const [loadingCreate, setLoadingCeate] = useState(false);
  const [error, setError] = useState("");
  const [idToken, setIdToken] = useState("");

  // Hàm xử lý khi đăng nhập thành công
  const handleLoginSuccess = async (response) => {
    setIdToken(response.credential);
    let token = response.credential;
    setLoading(true);
    let data = {
      idToken: token,
    };

    try {
      const res = await AccountServices.loginGoogle(data);
      // Storing tokens and role in localStorage
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("role", res.data.roleName);

      // Retrieve the access token for further dispatch
      const accessToken = res.data.accessToken;
      let owner = res?.data?.salonOwnerResponse;
      let employee = res?.data?.salonEmployeeResponse;

      // Dispatching action to fetch user by token
      await dispatch(fetchUserByTokenApi(accessToken, navigate))
        .then((res) => {
          if (owner) {
            navigate("/list_shop");
          } else if (employee) {
            navigate("/SalonEmployee");
          } else {
            navigate("/");
          }
          message.success("Đăng nhập thành công!!!");
        })
        .catch((err) => {})
        .finally(() => {
          setLoading(false);
        });
    } catch (err) {
      setIsModalVisible(true);
      // message.error(err?.response?.data?.message);
    }
  };

  const handleCreateAccount = async () => {
    // Check if role is selected and phone number is valid
    if (!role || !phonePattern.test(phone)) {
      message.info("Vui lòng chọn vai trò và nhập số điện thoại.");
      return;
    }

    let data = {
      idToken: idToken,
      roleName: role,
      phone: phone,
    };
    setLoadingCeate(true);
    try {
      // Call the account creation API
      const res = await AccountServices.createAccountByGoogle(data);

      // Storing tokens and role in localStorage
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("role", res.data.roleName);

      const accessToken = res.data.accessToken;
      let owner = res?.data?.salonOwnerResponse;
      let employee = res?.data?.salonEmployeeResponse;

      // Dispatching action to fetch user by token
      await dispatch(fetchUserByTokenApi(accessToken, navigate))
        .then(() => {
          // Navigate based on the user role
          if (owner) {
            navigate("/list_shop");
          } else if (employee) {
            navigate("/SalonEmployee");
          } else {
            navigate("/");
          }
          message.success("Đăng nhập thành công!!!");
        })
        .catch((err) => {
          setLoadingCeate(false);
          console.error("Error fetching user by token:", err);
          message.error("Đã xảy ra lỗi khi lấy thông tin người dùng.");
        })
        .finally(() => {
          setLoadingCeate(false);

          setLoading(false);
        });
    } catch (err) {
      setLoadingCeate(false);
      setLoading(false);
      console.error("Error creating account:", err);
      message.error("Đã xảy ra lỗi khi tạo tài khoản.");
    } finally {
      setLoadingCeate(false);
      setLoading(false);
      setIsModalVisible(false); // Close modal after processing
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhone(value);

    if (!phonePattern.test(value)) {
      setError("Số điện thoại phải gồm 10 chữ số.");
    } else {
      setError(""); // Clear the error if the phone number is valid
    }
  };

  return (
    <Spin spinning={loading} className="custom-spin">
      <motion.div
      // variants={{
      //   hidden: { y: "-100vh", opacity: 0 },
      //   visible: {
      //     y: "-1px",
      //     opacity: 1,
      //     transition: {
      //       delay: 0.5,
      //       type: "spring",
      //       stiffness: 500,
      //     },
      //   },
      // }}
      // initial="hidden"
      // animate="visible"
      >
        <Divider>
          <Typography.Title level={5}>
            Đăng nhập hoặc đăng ký bằng...
          </Typography.Title>
        </Divider>
        <Space size={3} className="flex justify-center">
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={() => {
              // console.log("Login Failed");
              message.warning("Vui lòng thử lại");
            }}
          />
        </Space>
        <Modal
          title="Chọn vai trò và nhập số điện thoại"
          visible={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false), setLoading(false), setError("");
          }}
          footer={null}
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
                opacity: selected === true && role === "Customer" ? 1 : 0.5,
              }}
              cover={
                <img
                  className="register-child-img"
                  alt="example"
                  src="https://i2-prod.manchestereveningnews.co.uk/news/article30022959.ece/ALTERNATES/s615/1_The-hands-of-young-barber-making-haircut-to-attractive-man.jpg"
                />
              }
            >
              <Meta style={{ textAlign: "center" }} title="Khách hàng" />
              {selected === true && role === "Customer" && (
                <CheckCircleOutlined
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)", // Căn giữa icon
                    fontSize: "7rem",
                    color: "#52c41a", // Màu xanh lá cây cho icon
                    zIndex: 1, // Đảm bảo icon ở trên ảnh
                  }}
                />
              )}
            </Card>

            <Card
              onClick={() => {
                setSelected(true);
                setRole("SalonOwner");
              }}
              hoverable
              className="register-img"
              style={{
                opacity: selected === true && role === "SalonOwner" ? 1 : 0.5,
              }}
              cover={
                <img
                  className="register-child-img"
                  alt="example"
                  src="https://tdtdecor.vn/wp-content/uploads/2023/06/thiet-ke-baber-shop-02.jpg"
                />
              }
            >
              <Meta style={{ textAlign: "center" }} title="Chủ salon" />
              {selected === true && role === "SalonOwner" && (
                <CheckCircleOutlined
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)", // Căn giữa icon
                    fontSize: "7rem",
                    color: "#52c41a", // Màu xanh lá cây cho icon
                    zIndex: 1, // Đảm bảo icon ở trên ảnh
                  }}
                />
              )}
            </Card>
          </Space>
          <Divider />
          <div>
            <Input
              placeholder="Nhập số điện thoại"
              value={phone}
              type="number"
              onChange={handlePhoneChange}
            />
          </div>

          {error && (
            <div style={{ color: "red", marginTop: "10px" }}>{error}</div>
          )}
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <Button
              loading={loadingCreate}
              type="primary"
              className="bg-[#BF9456] text-white border border-black hover:!text-black hover:!bg-[#d4b88a] hover:!border-black !important"
              onClick={handleCreateAccount}
            >
              Tạo tài khoản
            </Button>
          </div>
        </Modal>
      </motion.div>
    </Spin>
  );
}

export default LoginGoogle;
