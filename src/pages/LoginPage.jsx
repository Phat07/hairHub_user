import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  GoogleOutlined,
  LockOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
  UserOutlined,
  createFromIconfontCN,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  Modal,
  Space,
  Steps,
  Tabs,
  Typography,
  message,
  theme,
} from "antd";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import "../css/login.css";
import styles from "../css/login.module.css";

import {
  LoginFormPage,
  ProConfigProvider,
  ProFormCheckbox,
  ProFormText,
} from "@ant-design/pro-components";

import axios from "axios";
// import { ProFormInstance } from "@ant-design/pro-components";
import OTPInput from "react-otp-input";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import {
  emailPattern,
  fullNamePattern,
  phonePattern,
  pwdPattern,
} from "../components/Regex/Patterns";
import ResendCode from "../components/Resend/resendCode";
import "../css/loader.css";
import { AccountServices } from "../services/accountServices";
import { fetchUserByTokenApi, loginAccount } from "../store/account/action";
// import LoginGoogle from "../components/googleSignIn/LoginGoogle";
import hairhubLogo from "../assets/images/hairHubLogo.png";
import classNames from "classnames";
import LoginGoogle from "@/components/LoginGoogle";

const { Meta } = Card;
//icon
const IconFont = createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js",
});
const LoginPage = () => {
  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 6,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 14,
      },
    },
  };

  //New form login
  // const { token } = theme.useToken();
  const [accessType, setAccessType] = useState("login");
  // const [loginSuccess, setLoginSucess] = useState(false);

  // const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(false);
  const [role, setRole] = useState("");
  const [id, setId] = useState(0);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailVerifiedNew, setEmailVerifiedNew] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(120);
  const dispatch = useDispatch();
  const [submitting, setSubmitting] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const submitButtonRef = useRef(null);

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpForgot, setOtpForgot] = useState("");
  const [loadingLoad, setLoadingLoad] = useState(false);

  const isTokenExpired = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Convert milliseconds to seconds
      return decodedToken.exp < currentTime;
    } catch (error) {
      return true;
    }
  };

  const authenticateUser = async () => {
    try {
      let accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        navigate("/");
      } else {
        return;
      }
    } catch (error) {
      // message.error("Lỗi xác thực người dùng");
    }
  };

  useEffect(() => {
    authenticateUser();
  }, []);
  const renderInput = (props) => (
    <input
      {...props}
      onKeyPress={(e) => {
        if (!/[0-9]/.test(e.key)) {
          message?.warning("Vui lòng không nhập chữ");
          e.preventDefault();
        }
      }}
    />
  );
  const getInputStyle = () => {
    const isSmallScreen = window.innerWidth <= 768;
    return {
      borderRadius: "10%",
      border: "2px solid #1119",
      width: isSmallScreen ? "2.5rem" : "4rem",
      height: isSmallScreen ? "2.5rem" : "4rem",
      margin: "0 0.5rem",
      fontSize: isSmallScreen ? "1.5rem" : "2rem",
      color: "black",
      textAlign: "center",
    };
  };

  const sendOtp = async () => {
    setLoading(true);
    const email = form.getFieldValue("email");
    const emailForgot = form.getFieldValue("emailForgot");
    if (email) {
      try {
        await axios
          .post("https://hairhub.gahonghac.net/api/v1/otps/SendOTPToEmail", {
            email,
          })
          .then((res) => {
            // setLoading(false);
            message.success("Xác thực Email thành công! Vui lòng điền otp!");
            // call api gửi otp
            setIsOtpModalOpen(true);
          })
          .catch((err) => {
            message.error("Gửi otp thất bại! Vui lòng thử lại!");
          })
          .finally(() => {
            setLoading(false);
          });
      } catch (error) {
        message.error("Gửi otp thất bại! Vui lòng chọn gửi lại!");
      }
    }
    if (emailForgot) {
      try {
        await axios
          .post("https://hairhub.gahonghac.net/api/v1/otps/SendOTPToEmail", {
            email: emailForgot,
          })
          .then((res) => {
            // setLoading(false);
            message.success("Xác thực Email thành công! Vui lòng điền otp!");
            // call api gửi otp
            setIsOtpModalOpen(true);
          })
          .catch((err) => {
            message.error(err);
          })
          .finally(() => {
            setLoading(false);
          });
      } catch (error) {
        message.error("Gửi otp thất bại! Vui lòng chọn gửi lại!");
      }
    }
  };

  const verifyOtp = () => {
    const email = form.getFieldValue("email");
    const emailForgot = form.getFieldValue("emailForgot");

    if (email) {
      axios
        .post("https://hairhub.gahonghac.net/api/v1/otps/checkOtp", {
          otpRequest: otp,
          email: email,
        })
        .then(() => {
          setLoading(true);
          setOtp("");
          setEmailVerified(true);
          setIsOtpModalOpen(false);
          message.success("Otp xác thực thành công!");
        })
        .catch((error) => {
          message.error(error?.response?.data?.message);
          setOtp("");
        })
        .finally(() => {
          setLoading(false);
        });
    }

    if (emailForgot) {
      axios
        .post("https://hairhub.gahonghac.net/api/v1/otps/checkOtp", {
          otpRequest: otp,
          email: emailForgot,
        })
        .then(() => {
          setLoading(true);
          setOtp("");
          setOtpVerified(true);
          setIsOtpModalOpen(false);
          message.success("Otp xác thực thành công!");
        })
        .catch((error) => {
          message.error(error?.response?.data?.message);
          setOtp("");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const showOtpModal = async () => {
    setLoading(true);
    const email = form.getFieldValue("email");
    if (!email || !emailPattern.test(email)) {
      setLoading(false);
      message.error("Email chưa đúng hoặc chưa điền!");
    } else {
      try {
        const response = await axios
          .post("https://hairhub.gahonghac.net/api/v1/otps/CheckExistEmail", {
            email,
          })
          .then((res) => {
            if (res.data == "Email đã tồn tại trên hệ thống!") {
              setLoading(false);
              message.error("Email này đã được đăng ký trước đó!");
            } else {
              // setLoading(false);
              sendOtp();
            }
          })
          .catch((err) => {
            message.error("Thất bại trong việc đăng ký!");
          });
        // .finally(() => {
        //   setLoading(false);
        // });
      } catch (error) {
        setLoading(false);
        message.error(error);
      }
    }
  };

  const showOtpNewPasswordModal = async () => {
    setLoading(true);
    const email = form.getFieldValue("emailForgot");
    if (!email || !emailPattern.test(email)) {
      setLoading(false);
      message.error("Email chưa đúng hoặc chưa điền!");
    } else {
      try {
        const response = await axios
          .post(
            "https://hairhub.gahonghac.net/api/v1/otps/CheckNonExistEmail",
            {
              email,
            }
          )
          .then((res) => {
            if (res.data === "gửi OTP thành công") {
              message.success("Gửi otp thành công");
              setOtpSent(true);
              setLoading(false);
              setIsOtpModalOpen(true);
              sendOtp();
            } else if (res.data === "Email không tồn tại trên hệ thống!") {
              message.info("Email không tồn tại trên hệ thống!");
            }
          })
          .catch((err) => {
            message.error("Lấy lại mật khẩu thất bại. Thử lại sau!!!");
          })
          .finally(() => {
            setLoading(false);
          });
      } catch (error) {
        setLoading(false);
        message.error(error);
      }
    }
  };
  const handleVerifyOtp = async () => {
    // Call the function to verify OTP
    const isOtpValid = await verifyOtpResetPassword(otpForgot);
    if (isOtpValid) {
      setOtpVerified(true);
    } else {
      // Handle OTP verification failure (e.g., show an error message)
    }
  };

  const handleSetFormDefault = () => {
    setId(0);
    setSelected(false);
  };

  const onFinish = (values) => {
    const newValues = { ...values, roleName: role };
    const data = {
      roleName: role,
      // email: values?.email,
      userName: values?.email,
      phone: values?.phone,
      fullName: values?.fullName,
      password: values?.password,
      fullname: values?.fullname,
    };
    let dataMap = {
      userName: values?.email,
      password: values?.password,
    };
    setLoadingLoad(true);
    setSubmitting(false);
    if (newValues) {
      AccountServices.registerUser(data)
        .then((res) => {
          message.success("Thông tin của bạn đã đúng");
          setCurrent(0);
          setSelected(false);
          form.resetFields();
          setUser(res.data);
          setEmailVerified(false);
          setAccessType("login");
          dispatch(loginAccount(dataMap, navigate))
            .then(() => {
              // message.success("Đăng nhập thành công");
              // Handle success (optional)
            })
            .catch((error) => {
              // Handle any errors (optional)
              console.error("Error during login:", error);
            })
            .finally((err) => {
              setSubmitting(false);
            });
        })
        .catch((err) => setLoadingLoad(false))
        .finally((err) => {
          setLoadingLoad(false);
        });
    }
  };
  const onFinishFailed = (errorInfo) => {
    message.error("Failed:", errorInfo);
  };

  const pwdMessage = (
    <span style={{ background: "black" }}>
      <Typography>
        <Typography.Text className="text-red-200">
          Chữ cái đầu phải viết hoa và &nbsp; có từ 8 đến 40 ký tự!
        </Typography.Text>
      </Typography>
    </span>
  );
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (submitButtonRef.current) {
        submitButtonRef.current.click();
      }
    }
  };

  const steps = [
    {
      title: "Chọn vai trò",
      content: (
        <Space direction="horizontal">
          <Card
            onClick={() => {
              setSelected(!selected), setRole("Customer");
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
              setSelected(!selected), setRole("SalonOwner");
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
      ),
    },
    {
      title: "Tạo tài khoản",
      content: (
        <Card>
          <Form
            {...formItemLayout}
            layout="horizontal"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            style={{ maxWidth: 600 }}
            form={form}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            initialValues={{
              remember: true,
            }}
          >
            <Form.Item
              label="Email:"
              name="email"
              rules={[
                { required: true, message: "This fields is required!" },
                {
                  pattern: emailPattern,
                  message: "Hãy nhập email đúng cú pháp!",
                },
              ]}
              // tooltip="example@gmail.com"
            >
              <Space>
                <Input
                  placeholder="example@gmail.com"
                  readOnly={emailVerified}
                />
              </Space>
            </Form.Item>
            {!emailVerified && (
              <Button
                type="text"
                size={"large"}
                style={{
                  backgroundColor: "#bf9456",
                  color: "black",
                }}
                loading={loading}
                onClick={showOtpModal}
              >
                Gửi OTP
              </Button>
            )}
            {emailVerified && (
              <>
                <Form.Item
                  label="Mật khấu:"
                  name="password"
                  rules={[
                    { required: true, message: "Vui lòng không bỏ trống!" },
                    {
                      pattern: pwdPattern,
                      message:
                        "Chữ cái đầu phải viết hoa và có từ 8 đến 40 ký tự!",
                    },
                  ]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item
                  label="Tên đầy đủ:"
                  name="fullName"
                  rules={[
                    { required: true, message: "Vui lòng không bỏ trống!" },
                    {
                      pattern: fullNamePattern,
                      message:
                        "Tên đầy đủ không chứa mã VNI, số và ký tự đặc biệt!",
                    },
                  ]}
                >
                  <Input placeholder="Nguyen Van A" />
                </Form.Item>
                <Form.Item
                  label="Số điện thoại:"
                  name="phone"
                  rules={[
                    { required: true, message: "Vui lòng không bỏ trống!" },
                    {
                      pattern: phonePattern,
                      message: "Số điện thoại phải có 10 chữ số!",
                    },
                  ]}
                >
                  <Input placeholder="037xxxxxxx" />
                </Form.Item>
                <Button
                  style={{
                    backgroundColor: "#bf9456",
                    color: "black",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                  }}
                  type="primary"
                  htmlType="submit"
                  loading={loadingLoad}
                >
                  Tạo
                </Button>
              </>
            )}
          </Form>
        </Card>
      ),
    },
    {
      title: "Bước cuối",
      content: (
        <Typography style={{ color: "#d69738ff" }}>
          <Typography.Title>Đăng ký thành công</Typography.Title>
          <Typography.Text>
            Cảm ơn bạn vì đã sử dụng hệ thống của chúng tôi!!!
          </Typography.Text>
        </Typography>
      ),
    },
  ];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const isEmptyObject = (obj) => {
    return Object.keys(obj).length === 0 && obj.constructor === Object; //check isObject is empty or object is object
  };

  const handleOk = () => {
    if (isEmptyObject(user)) {
      message.info("Vui lòng điền thông tin!");
    } else {
      setIsModalOpen(false);
    }
  };

  const handleCancel = () => {
    setAccessType("login");
    setIsModalOpen(false);
  };
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const next = () => {
    if (selected === false) {
      message.warning("Vui lòng chọn vai trò!");
      return;
    }
    if (role === "") {
      setCurrent(current);
      message.warning("Vui lòng chọn vai trò!");
    } else {
      setCurrent(current + 1);
    }
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));
  const contentStyle = {
    // lineHeight: "200px",
    textAlign: "center",
    // color: token.colorTextTertiary,
    // backgroundColor: token.colorFillAlter,
    // borderRadius: token.borderRadiusLG,
    // border: `1px dashed ${token.colorBorder}`,
    marginTop: 20,
  };

  useEffect(() => {
    if (id == 0) {
      setId(0);
    } else if (id != 1) {
      setId(2);
      setSelected(true);
    } else if (id != 2) {
      setId(1);
      setSelected(true);
    }
  }, [id, selected]);

  const handleFinish = (values) => {
    setSubmitting(true);

    if (accessType === "login") {
      dispatch(loginAccount(values, navigate))
        .then(() => {
          // message.success("Đăng nhập thành công");
          // Handle success (optional)
        })
        .catch((error) => {
          // Handle any errors (optional)
          console.error("Error during login:", error);
        })
        .finally((err) => {
          setSubmitting(false);
        });
    } else {
      setIsModalOpen(true);
      setAccessType("register");
      // Đăng ký tài khoản
      // AccountServices.registerUser(values)
      //   .then((res) => {
      //     message.success("Thông tin của bạn đã đúng");
      //     setCurrent(current + 1);
      //     setUser(res.data);
      //   })
      //   .catch((err) => message.error(err?.response?.data?.message || "Đã xảy ra lỗi!"));
    }
  };
  const handleSubmitChangePassword = () => {
    const pass = form.getFieldValue("newPassword");
    const email = form.getFieldValue("emailForgot");
    const emailConfirm = form.getFieldValue("confirmPassword");
    const data = {
      email: email,
      newPassword: pass,
      confirmNewPassword: pass,
    };
    if (!email || !pass || !emailConfirm) {
      message.error("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    if (emailConfirm !== pass) {
      message.error("Mật khẩu xác nhận không khớp.");
      return;
    }
    AccountServices.forgotPassword(data)
      .then((res) => {
        message.success("Bạn đã thay đổi mật khẩu thành công");
        setIsPasswordModalOpen(false);
      })
      .catch((err) => {
        // console.log(err);
      });
  };

  return (
    <>
      <div
        style={{
          backgroundColor: "black",
          height: "100vh",
        }}
      >
        <Modal
          title="Quên mật khẩu"
          visible={isPasswordModalOpen}
          onCancel={() => setIsPasswordModalOpen(false)}
          footer={null}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "1rem",
            }}
          >
            <Card>
              <Form
                // {...formItemLayout}
                layout="horizontal"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                style={{ maxWidth: 600 }}
                form={form}
                initialValues={{
                  remember: true,
                }}
              >
                <Form.Item
                  label="Email:"
                  name="emailForgot"
                  rules={[
                    { required: true, message: "This field is required!" },
                    {
                      pattern: emailPattern,
                      message: "Please input email including @!",
                    },
                  ]}
                  tooltip="example@gmail.com"
                >
                  <Space>
                    <Input
                      placeholder="example@gmail.com"
                      readOnly={emailVerified}
                    />
                  </Space>
                </Form.Item>

                {!otpSent && (
                  <Button
                    loading={loading}
                    type="primary"
                    onClick={showOtpNewPasswordModal}
                  >
                    Gửi OTP
                  </Button>
                )}

                {/* {otpSent && !otpVerified && (
                  <>
                    <Form.Item
                      label="OTP:"
                      name="otp"
                      rules={[
                        { required: true, message: "Please enter the OTP!" },
                      ]}
                    >
                      <Input
                        value={otpForgot}
                        onChange={(e) => setOtpForgot(e.target.value)}
                      />
                    </Form.Item>
                    <Button
                      loading={loading}
                      type="primary"
                      onClick={handleVerifyOtp}
                    >
                      Xác nhận OTP
                    </Button>
                  </>
                )} */}

                {otpVerified && (
                  <>
                    <Form.Item
                      label="Pass mới:"
                      name="newPassword"
                      rules={[
                        { required: true, message: "Vui lòng không bỏ trống!" },
                        {
                          pattern: pwdPattern,
                          message:
                            "Chữ cái đầu phải viết hoa và có từ 8 đến 40 ký tự!",
                        },
                      ]}
                    >
                      <Input.Password />
                    </Form.Item>
                    <Form.Item
                      label="Xác nhận:"
                      name="confirmPassword"
                      dependencies={["newPassword"]}
                      rules={[
                        { required: true, message: "Vui lòng không bỏ trống!" },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (
                              !value ||
                              getFieldValue("newPassword") === value
                            ) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error(
                                "Mật khẩu xác nhận không khớp với mật khẩu mới!"
                              )
                            );
                          },
                        }),
                      ]}
                    >
                      <Input.Password />
                    </Form.Item>
                    <Button onClick={handleSubmitChangePassword}>
                      Xác nhận mật khẩu
                    </Button>
                  </>
                )}
              </Form>
            </Card>
          </div>
        </Modal>
        <Modal
          title="Nhập OTP"
          visible={isOtpModalOpen}
          onOk={() => verifyOtp(otp)}
          onCancel={() => setIsOtpModalOpen(false)}
          // footer={[
          //   <Button
          //     key={2}
          //     type="text"
          //     style={{
          //       backgroundColor: "#bf9456",
          //       color: "black",
          //       justifyContent: "center",
          //       alignItems: "center",
          //     }}
          //     size={"middle"}
          //     onClick={() => {
          //       verifyOtp(otp);
          //     }}
          //   >
          //     Xác nhận
          //   </Button>,
          // ]}
          okButtonProps={{
            style: {
              backgroundColor: "#bf9456",
              color: "black",
            },
          }}
        >
          <div
          // style={{
          //   display: "flex",
          //   justifyContent: "center",
          //   marginBottom: "1rem",
          // }}
          >
            <OTPInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderInput={renderInput}
              separator={<span>-</span>}
              isInputNum
              inputStyle={getInputStyle()}
            />
          </div>
          <ResendCode isOtpModalOpen={isOtpModalOpen} form={form} />
          {/* <Button type="link" onClick={handleResendCode} disabled={timer > 0}>
            Gửi lại OTP {timer > 0 && `(${formatTime(timer)})`}
          </Button> */}
        </Modal>
        {/* <GlobalStyle /> */}
        <LoginFormPage
          mainStyle={{
            padding: "1rem",
            borderRadius: "0.5rem",
            background: "rgba(221, 240, 255, 0.1)",
          }}
          className="login-form-page"
          submitter={{
            // searchConfig: {
            //   submitText:
            //     (accessType === "login" || accessType === "register") &&
            //     accessType === "login"
            //       ? "Đăng nhập"
            //       : "Đăng ký",
            // },
            searchConfig: {
              submitText: submitting
                ? "Đang xử lý..."
                : accessType === "login"
                ? "Đăng nhập"
                : "Đăng ký",
            },
            htmlType: "button",
            //   submitButtonProps: {
            //     ref: submitButtonRef,
            //     style: {
            //       backgroundColor: "#bf9456",
            //       width: "100%",
            //     },
            //   }, // uncomment this line
            // }}
            submitButtonProps: {
              ref: submitButtonRef,
              style: {
                backgroundColor: "#bf9456",
                width: "100%",
              },
            },
            resetButtonProps: false,
            render: (props, doms) => {
              return (
                <>
                  {doms}
                  {/* Google Login Button below the submit button */}
                  <div style={{ marginTop: "1rem", textAlign: "center" }}>
                    <LoginGoogle />
                  </div>
                </>
              );
            },
          }}
          onKeyDown={handleKeyDown}
          onFinish={handleFinish}
          // backgroundImageUrl="https://res.cloudinary.com/dtlvihfka/image/upload/v1719936805/xov2xoo8jqppdas53kva.png"
          logo={
            <div onClick={() => navigate("/")} className="w-[3rem]">
              <img
                style={{ width: "100%", borderRadius: "5px" }}
                src={hairhubLogo}
                alt="HairHub Logo"
              />
            </div>
          }
          backgroundVideoUrl="https://res.cloudinary.com/dtlvihfka/video/upload/v1721741596/tu7g9jibn8je0ritnk4a.mp4"
          title="HairHub"
          subTitle="Là nơi để mọi người có thể đến và sử dụng các dịch vụ tốt nhất từ những Salon | Barber hàng đầu Việt Nam"
          containerStyle={{
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            backdropFilter: "blur(4px)",
          }}
          actions={
            accessType === "login" && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <Divider plain>
                  {/* <span
                      style={{
                        color: token.colorTextPlaceholder,
                        fontWeight: "normal",
                        fontSize: 14,
                      }}
                    >
                      Sign In as
                    </span> */}
                </Divider>
              </div>
            )
          }
        >
          <Tabs
            onClick={(activeKey) => showModal(activeKey)}
            centered
            activeKey={accessType}
            onChange={(activeKey) => {
              if (activeKey === "register") {
                setIsModalOpen(true);
              }
              setAccessType(activeKey);
            }}
            tabBarStyle={{
              color: "#bf9456",
            }}
          >
            <Tabs.TabPane key={"login"} tab={"Đăng nhập"} />
            <Tabs.TabPane key={"register"} tab={"Đăng ký"} />
          </Tabs>
          {accessType === "login" && (
            <>
              <ProFormText
                key="username"
                name="username"
                fieldProps={{
                  size: "large",
                  prefix: (
                    <UserOutlined
                      style={{
                        color: token.colorText,
                      }}
                      className={"prefixIcon"}
                    />
                  ),
                }}
                placeholder={"Email"}
                rules={[
                  {
                    required: true,
                    message: "Email của bạn là bắt buộc!",
                  },
                  {
                    pattern: emailPattern,
                    message: "Vui lòng điền đúng kiểu email @!",
                  },
                ]}
              />
              <ProFormText.Password
                key="password"
                name="password"
                fieldProps={{
                  size: "large",
                  prefix: (
                    <LockOutlined
                      style={{
                        color: token.colorText,
                      }}
                      className={"prefixIcon"}
                    />
                  ),
                }}
                placeholder={"Mật khẩu"}
                rules={[
                  {
                    required: true,
                    message: "Mật khẩu của bạn là bất buộc!",
                  },
                  {
                    pattern: pwdPattern,
                    message: pwdMessage,
                  },
                ]}
              />
            </>
          )}
          {accessType === "register" && (
            <Modal
              title="Đăng ký"
              open={isModalOpen}
              onCancel={() => {
                handleCancel(), handleSetFormDefault(), setCurrent(0);
              }}
              footer={[
                <Button
                  key={2}
                  type="text"
                  icon={<CloseCircleOutlined />}
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  size={"middle"}
                  onClick={() => {
                    // handleOk();
                    handleCancel(), handleSetFormDefault(), setCurrent(0);
                  }}
                >
                  Đóng
                </Button>,
                // <Button
                //   key={2}
                //   type="text"
                //   icon={<CheckCircleOutlined />}
                //   style={{
                //     backgroundColor: "#bf9456",
                //     color: "black",
                //     justifyContent: "center",
                //     alignItems: "center",
                //   }}
                //   size={"middle"}
                //   onClick={() => {
                //     handleOk();
                //     // handleCancel(),
                //     // handleSetFormDefault();
                //   }}
                // >
                //   Tạo tài khoản
                // </Button>,
              ]}
            >
              <motion.p
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
                Tham gia cùng chúng tôi...❤️
              </motion.p>
              <div className="registerSteps">
                <Steps current={current} items={items} />
              </div>
              <div style={contentStyle}>{steps[current].content}</div>
              <div
                style={{
                  marginTop: 24,
                }}
              >
                {current < steps.length - 1 && current < 1 && (
                  <Button
                    type="text"
                    icon={<StepForwardOutlined />}
                    size={"large"}
                    style={{
                      backgroundColor: "#bf9456",
                      color: "black",
                    }}
                    onClick={() => next()}
                  >
                    Bước tiếp theo
                  </Button>
                )}
                {current > 0 && current < 2 && (
                  <Button
                    type="text"
                    icon={<StepBackwardOutlined />}
                    size={"large"}
                    style={{
                      backgroundColor: "#bf9456",
                      color: "black",
                    }}
                    onClick={() => prev()}
                  >
                    Bước trước đó
                  </Button>
                )}
              </div>
            </Modal>
          )}
          {accessType === "login" && (
            <div
              style={{
                marginBlockEnd: 24,
              }}
            >
              <ProFormCheckbox noStyle name="autoLogin">
                Ghi nhớ tôi
              </ProFormCheckbox>
              <a
                style={{
                  float: "right",
                  cursor: "pointer",
                }}
                onClick={() => setIsPasswordModalOpen(true)}
              >
                Quên mật khẩu
              </a>
            </div>
          )}
        </LoginFormPage>
      </div>
      {isLoading && (
        <div className="overlay">
          <Loader />
        </div>
      )}
    </>
  );
};

// export default LoginPage;
export default () => {
  return (
    <ProConfigProvider dark>
      <LoginPage />
    </ProConfigProvider>
  );
};
