import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  Avatar,
  Descriptions,
  message,
  Typography,
  Button,
  Space,
  Form,
  Input,
  Select,
  DatePicker,
  Upload,
  Modal,
  Col,
  Row,
  Menu,
  Dropdown,
} from "antd";
import {
  BarChartOutlined,
  CheckCircleOutlined,
  FormOutlined,
  InfoCircleOutlined,
  MenuOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { AccountServices } from "../services/accountServices";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import QrReader from "react-qr-scanner";
import "../css/SalonOwnerAccountPage.css";
import dayjs from "dayjs";
import Loader from "../components/Loader";
import ConfirmDeleteModal from "@/components/DeleteAccount/ConfirmDeleteModal";
import OTPModal from "@/components/DeleteAccount/OTPModal";
import axios from "axios";

const { Option } = Select;

function SalonOwnerAccountPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const idCustomer = useSelector((state) => state.ACCOUNT.idCustomer);
  const idOwner = useSelector((state) => state.ACCOUNT.idOwner);
  const uid = useSelector((state) => state.ACCOUNT.uid);

  const [salonData, setSalonData] = useState({});
  const [optData, setOptData] = useState({
    email: null,
    fullName: null,
  });
  const [showScanner, setShowScanner] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isNotified, setIsNotified] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [passwordForm] = Form.useForm();
  const [facingMode, setFacingMode] = useState("rear");
  const [isModalVisibleDeleteComfirm, setIsModalVisibleDeleteComfirm] =
    useState(false);
  const [isOTPModalVisible, setIsOTPModalVisible] = useState(false);
  const [otp, setOtp] = useState("");
  // Function to detect if the user is on a mobile device
  useEffect(() => {
    AccountServices.GetInformationAccount(id)
      .then((res) => {
        setSalonData(res.data);
        setAvatarUrl(res.data.img);
        setOptData({
          email: res.data.email,
          fullName: res.data.fullName,
        });
        form.setFieldsValue({
          fullName: res.data.fullName,
          phone: res.data.phone,
          email: res.data.email,
          dayOfBirth: res.data.dayOfBirth ? dayjs(res.data.dayOfBirth) : null,
          gender: res.data.gender,
          address: res.data.address,
          password: maskPassword(res.data.password),
          avatar: res.data.img,
        });
      })
      .catch((err) => {
        message.warning("Loading!!!");
      });
  }, [id]);

  const handleReload = () => {
    window?.location?.reload();
  };

  const handleScan = (data) => {
    if (data) {
      const mappingData = {
        customerId: idCustomer,
        dataString: data.text,
      };
      AccountServices.checkInByCustomer(mappingData)
        .then((res) => {
          setShowScanner(false);
          if (!isNotified) {
            message.success("Quét qr check in thành công");
            setIsNotified(true);
          }
        })
        .catch((err) => {
          setShowScanner(false);
          if (!isNotified) {
            message.error("Quét qr check in thất bại!");
            setIsNotified(true);
          }
        })
        .finally(() => {
          setShowScanner(false);
        });
    }
  };

  const handleError = (err) => {
    console.error("Camera error:", err);
    // if (err.name === "OverconstrainedError") {
    //   console.error("Switching to front camera.");
    //   setFacingMode("user"); // Switch to user camera as a fallback
    // }
  };

  const previewStyle = {
    width: "100%",
    height: "auto",
  };

  const toggleFacingMode = () => {
    // Toggle between 'front' and 'rear'
    setFacingMode((prevMode) => {
      const newMode = prevMode === "rear" ? "front" : "rear";
      console.log(`Switching to ${newMode} camera`); // Debug log
      return newMode;
    });
  };

  // useEffect(() => {
  //   const checkMobile = () => {
  //     setIsMobile(/Mobi|Android/i.test(navigator.userAgent));
  //   };
  //   checkMobile();
  // }, []);

  const maskPassword = (password) => {
    if (!password) return "";
    return "*".repeat(password.length - 2) + password.slice(-2);
  };
  const [avatarUrl, setAvatarUrl] = useState(null);

  const handleAvatarChange = (info) => {
    const isLt5M = info.file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("Ảnh phải nhỏ hơn 5MB!");
      return;
    }
    const file = info.file;
    if (file) {
      setAvatarFile(file);
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
      form.setFieldsValue({ avatar: url });
    } else {
      console.log("No file selected or invalid file");
    }
  };
  async function addFileFromUrlToFormData(url) {
    const formData = new FormData();

    try {
      // Tải tệp từ URL
      const response = await fetch(url);
      const blob = await response.blob(); // Chuyển đổi dữ liệu tải về thành Blob

      // Tạo đối tượng File từ Blob
      const filename = url.split("/").pop(); // Lấy tên tệp từ URL
      const file = new File([blob], filename, { type: blob.type });

      // Thêm đối tượng File vào FormData
      formData.append("Img", file);

      return formData;
    } catch (error) {
      console.error("Lỗi tải tệp từ URL:", error);
      throw error;
    }
  }

  const formatSalonData = (salonData) => {
    return {
      fullName: salonData.fullName,
      dayOfBirth: new Date(salonData.dayOfBirth).toISOString(), // Đảm bảo định dạng ngày tháng giống với values
      gender: salonData.gender,
      address: salonData.address,
      phone: salonData.phone,
      email: salonData.email,
      password: maskPassword(salonData.password), // Chỉ giữ lại 2 ký tự cuối giống như values
      avatar: salonData.img, // Chuyển 'img' thành 'avatar'
    };
  };
  const sortObject = (obj) => {
    return Object.keys(obj)
      .sort()
      .reduce((result, key) => {
        result[key] = obj[key];
        return result;
      }, {});
  };

  const handleSave = async (values) => {
    // Biến đổi salonData trước khi so sánh
    const transformedSalonData = formatSalonData(salonData);
    // So sánh biến đổi salonData với values
    if (
      JSON.stringify(sortObject(transformedSalonData)) ===
      JSON.stringify(sortObject(values))
    ) {
      message.warning("Thông tin người dùng không thay đổi!!!");
      return;
    }
    const formData = new FormData();
    setIsLoading(true);
    formData.append("roleId", idCustomer);
    formData.append("Phone", values.phone ?? salonData.phone);
    formData.append("password", salonData.password);
    formData.append("FullName", values.fullName ?? salonData.fullName);
    formData.append(
      "dayOfBirth",
      values.dayOfBirth
        ? values.dayOfBirth.format("YYYY-MM-DD")
        : salonData.dayOfBirth
    );
    formData.append("Gender", values.gender ?? salonData.gender);
    formData.append("Email", values.email ?? salonData.email);
    formData.append("Address", values.address ?? salonData.address);

    if (avatarFile) {
      formData.append("Img", avatarFile);
    } else if (avatarUrl) {
      try {
        const urlFormData = await addFileFromUrlToFormData(avatarUrl);
        for (const [key, value] of urlFormData.entries()) {
          formData.append(key, value);
        }
      } catch (error) {
        console.error("Error adding file from URL:", error);
      }
    }

    AccountServices.updateUserById(id, formData)
      .then((res) => {
        message.success("Cập nhật tài khoản thành công");
        return AccountServices.GetInformationAccount(id);
      })
      .then((res) => {
        setSalonData(res.data);
        setAvatarUrl(res.data.img);
        setOptData({
          email: res.data.email,
          fullName: res.data.fullName,
        });
        form.setFieldsValue({
          fullName: res.data.fullName,
          phone: res.data.phone,
          email: res.data.email,
          dayOfBirth: res.data.dayOfBirth ? dayjs(res.data.dayOfBirth) : null,
          gender: res.data.gender,
          address: res.data.address,
          password: maskPassword(res.data.password),
          avatar: res.data.img,
        });
      })
      .catch((err) => {
        message.warning("Cập nhật thất bại, vui lòng thử lại sau!!!");
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const showChangePasswordModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleChangePassword = (values) => {
    console.log("Change Password Form Values:", values);
    AccountServices.updatePasswordUserById(id, values)
      .then((res) => {
        message.success("Thay đổi mật khẩu thành công");
        AccountServices.GetInformationAccount(id)
          .then((res) => {
            setSalonData(res.data);
            setAvatarUrl(res.data.img);
            setOptData({
              email: res.data.email,
              fullName: res.data.fullName,
            });
            form.setFieldsValue({
              fullName: res.data.fullName,
              phone: res.data.phone,
              email: res.data.email,
              dayOfBirth: res.data.dayOfBirth
                ? dayjs(res.data.dayOfBirth)
                : null,
              gender: res.data.gender,
              address: res.data.address,
              password: maskPassword(res.data.password),
              avatar: res.data.img,
            });
          })
          .catch((err) => {
            message.warning("Loading!!!");
          });
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.message || err.message;
        message.warning(errorMessage);
      });
    passwordForm.resetFields();
    setIsModalVisible(false);
    ///api/v1/accounts/ChangePassword/{id}
  };

  const DeleteAccount = () => {
    setIsLoading(true);
    const refreshToken = localStorage.getItem("refreshToken");
    if (id && refreshToken) {
      AccountServices.DeleteAccount(id)
        .then(() => {
          AccountServices.LogOut(refreshToken);
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("role");
          navigate("/");
          message.success("Xóa tài khoản thành công!");
        })
        .catch((error) => {
          message.error(error?.response?.data?.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const sendOtp = async () => {
    setIsLoading(true);
    if (optData && optData.email && optData.fullName) {
      try {
        await axios
          .post(
            "https://hairhub.gahonghac.net/api/v1/otps/SendOTPToEmail",
            optData
          )
          .then((res) => {
            // setLoading(false);
            message.success("Xác thực Email thành công! Vui lòng điền otp!");
            setIsModalVisibleDeleteComfirm(false);
            setIsOTPModalVisible(true);
          })
          .catch((err) => {
            message.error("Gửi otp thất bại! Vui lòng thử lại!");
          })
          .finally(() => {
            setIsLoading(false);
          });
      } catch (error) {
        message.error("Gửi otp thất bại! Vui lòng chọn gửi lại!");
      }
    }
  };

  const verifyOtp = () => {
    setIsLoading(true);
    if (optData && optData.email && otp) {
      axios
        .post("https://hairhub.gahonghac.net/api/v1/otps/checkOtp", {
          otpRequest: otp,
          email: optData.email,
        })
        .then(() => {
          setIsOTPModalVisible(false);
          message.success("Otp xác thực thành công!");
          DeleteAccount();
        })
        .catch((error) => {
          message.error(error?.response?.data?.message);
        })
        .finally(() => {
          setIsLoading(false);
          setOtp("");
        });
    }
  };

  const handleCancelDeleteComfirm = () => {
    setIsModalVisibleDeleteComfirm(false);
  };

  const handleConfirmDelete = () => {
    sendOtp();
  };

  const handleCancelOTP = () => {
    setOtp("");
    setIsOTPModalVisible(false);
  };

  const handleOTPConfirm = () => {
    console.log("OTP đã nhập:", otp);
    if (!/^\d{6}$/.test(otp)) {
      message.error("OTP phải là số và có đúng 6 chữ số!");
      return;
    }
    verifyOtp();
    // Thêm logic xử lý OTP và xóa tài khoản ở đây
  };

  const menuFunction = (
    <Menu>
      {idOwner && (
        <>
          <Menu.Item icon={<InfoCircleOutlined />}>
            <Link to="/salon_report">Danh sách báo cáo của bạn</Link>
          </Menu.Item>
          <Menu.Item icon={<BarChartOutlined />}>
            <Link to="/dashboardTransaction">Thống kê doanh thu</Link>
          </Menu.Item>
        </>
      )}
      {idCustomer && (
        <>
          <Menu.Item>
            <Button
              style={{ backgroundColor: "#bf9456", borderColor: "#bf9456" }}
            >
              <Link to="/customer_report" style={{ color: "white" }}>
                Danh sách báo cáo của bạn
              </Link>
            </Button>
          </Menu.Item>
          <Menu.Item>
            <Button
              onClick={() => setShowScanner(true)}
              type="primary"
              style={{ backgroundColor: "#bf9456", borderColor: "#bf9456" }}
            >
              Bật quét Qr
            </Button>
          </Menu.Item>
          <Menu.Item>
            <Button
              type="primary"
              style={{ backgroundColor: "red", borderColor: "#bf9456" }}
              onClick={() => setIsModalVisibleDeleteComfirm(true)}
            >
              Xóa tài khoản
            </Button>
          </Menu.Item>
        </>
      )}
    </Menu>
  );

  return (
    <div className="salon-owner-account">
      {isLoading && (
        <div className="overlay">
          <Loader />
        </div>
      )}
      {uid ? (
        <div className="salon-layout">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "2rem",
            }}
          >
            <Dropdown overlay={menuFunction} trigger={["click"]}>
              <Button
                style={{
                  backgroundColor: "#f4f2eb",
                  border: "none",
                  boxShadow: "none",
                  padding: 0,
                }}
              >
                <span style={{ fontSize: "24px" }}>
                  <MenuOutlined />
                </span>
              </Button>
            </Dropdown>
            {showScanner && (
              <div>
                <QrReader
                  delay={300}
                  onError={handleError}
                  onScan={handleScan}
                  style={previewStyle}
                  facingMode={
                    facingMode === "rear"
                      ? { exact: "environment" }
                      : { exact: "user" }
                  } // Set facingMode correctly
                />
                {/* {isMobile && ( */}
                {/* <Button onClick={toggleFacingMode}>
                  Chuyển sang camera {facingMode === "rear" ? "trước" : "sau"}
                </Button> */}
                {/* )} */}
                <Button
                  onClick={() => setShowScanner(!showScanner)}
                  style={{ marginTop: "1rem" }}
                >
                  Đóng Qr
                </Button>
              </div>
            )}
          </div>
          <div>
            <Typography.Text strong style={{ fontSize: "2rem" }}>
              Thông tin người dùng
            </Typography.Text>
            <Form form={form} layout="vertical" onFinish={handleSave}>
              <Form.Item
                label={<span style={{ fontSize: "1.1rem" }}>Avatar</span>}
                className="form-item-custom"
                name="avatar"
                rules={[
                  { required: true, message: "Avatar không được để trống" },
                ]}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  <Avatar
                    src={avatarUrl || salonData.img || <UserOutlined />}
                    size={200}
                    className="salon-avatar"
                  />
                  <Upload
                    beforeUpload={() => false}
                    onChange={handleAvatarChange}
                    accept="image/*"
                    showUploadList={false}
                  >
                    <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                  </Upload>
                </div>
              </Form.Item>
              <Row gutter={[16, 16]} align="top">
                <Col xs={24} md={10}>
                  <Form.Item
                    label={
                      <span style={{ fontSize: "1.1rem" }}>Họ và tên</span>
                    }
                    className="form-item-custom"
                    name="fullName"
                    rules={[
                      {
                        required: true,
                        message: "Họ và tên không được để trống",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    label={
                      <span style={{ fontSize: "1.1rem" }}>Ngày sinh</span>
                    }
                    className="form-item-custom"
                    name="dayOfBirth"
                    rules={[
                      {
                        required: true,
                        message: "Ngày sinh không được để trống",
                      },
                      {
                        validator: (_, value) =>
                          value && value.isAfter(dayjs())
                            ? Promise.reject(
                                new Error(
                                  "Ngày sinh không được là ngày tương lai"
                                )
                              )
                            : Promise.resolve(),
                      },
                    ]}
                  >
                    <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item
                    label={
                      <span style={{ fontSize: "1.1rem" }}>Giới tính</span>
                    }
                    className="form-item-custom"
                    name="gender"
                    rules={[
                      {
                        required: true,
                        message: "Giới tính không được để trống",
                      },
                    ]}
                  >
                    <Select>
                      <Option value="male">Nam</Option>
                      <Option value="female">Nữ</Option>
                      <Option value="other">Khác</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]} align="top">
                <Col xs={24} md={16}>
                  <Form.Item
                    label={<span style={{ fontSize: "1.1rem" }}>Địa chỉ</span>}
                    className="form-item-custom"
                    name="address"
                    rules={[
                      {
                        required: true,
                        message: "Địa chỉ không được để trống",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    label={
                      <span style={{ fontSize: "1.1rem" }}>Số điện thoại</span>
                    }
                    className="form-item-custom"
                    name="phone"
                    rules={[
                      {
                        required: true,
                        message: "Số điện thoại không được để trống",
                      },
                      {
                        pattern: /^\d{10}$/,
                        message: "Số điện thoại phải đúng 10 số",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label={<span style={{ fontSize: "1.1rem" }}>Email</span>}
                className="form-item-custom"
                name="email"
                // rules={[
                //   { required: true, message: "Email không được để trống" },
                //   { type: "email", message: "Email không đúng định dạng" },
                // ]}
              >
                <Input disabled />
              </Form.Item>
              <Row gutter={[16, 16]} align="top">
                <Col xs={24} md={16}>
                  <Form.Item
                    label={<span style={{ fontSize: "1.1rem" }}>Mật khẩu</span>}
                    // className="form-item-custom"
                    name="password"
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Button
                    icon={<FormOutlined />}
                    onClick={showChangePasswordModal}
                    className="change-password-button"
                    style={{ marginTop: "2.2rem" }}
                  >
                    Thay đổi mật khẩu
                  </Button>
                </Col>
              </Row>

              <Form.Item>
                <Button
                  htmlType="submit"
                  className="change-password-button"
                  icon={<CheckCircleOutlined />}
                >
                  Lưu thông tin
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      ) : (
        <div className="salon-reload">
          <Space direction="vertical">
            <Typography.Title>Your account is not found!</Typography.Title>
            <Button style={{ width: "100%" }} onClick={handleReload}>
              Reload
            </Button>
          </Space>
        </div>
      )}
      <Modal
        title="Thay đổi mật khẩu"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handleChangePassword}
        >
          <Form.Item
            label="Nhập mật khẩu cũ"
            className="form-item-custom"
            name="currentPassword"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu cũ" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Nhập mật khẩu mới"
            className="form-item-custom"
            name="newPassword"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Nhập lại mật khẩu mới"
            className="form-item-custom"
            name="confirmNewPassword"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Vui lòng nhập lại mật khẩu mới" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Mật khẩu không khớp!"));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button style={{ marginRight: 8 }} onClick={handleCancel}>
              Đóng
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<FormOutlined />}
              style={{
                backgroundColor: "#bf9456",
                color: "white",
              }}
            >
              Thay đổi mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <ConfirmDeleteModal
        visible={isModalVisibleDeleteComfirm}
        onCancel={handleCancelDeleteComfirm}
        onConfirm={handleConfirmDelete}
      />
      <OTPModal
        visible={isOTPModalVisible}
        onCancel={handleCancelOTP}
        otp={otp}
        setOtp={setOtp}
        onConfirm={handleOTPConfirm}
        sendOTP={sendOtp}
      />
    </div>
  );
}

export default SalonOwnerAccountPage;
