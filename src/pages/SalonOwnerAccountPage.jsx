// import React, { useEffect, useState } from "react";
// import {
//   Card,
//   Avatar,
//   Descriptions,
//   message,
//   Typography,
//   Button,
//   Space,
// } from "antd";
// import { UserOutlined } from "@ant-design/icons";
// import { AccountServices } from "../services/accountServices";
// import { Link } from "react-router-dom";
// import { useSelector } from "react-redux";
// import "../css/SalonOwnerAccountPage.css";

// function SalonOwnerAccountPage() {
//   const userName = useSelector((state) => state.ACCOUNT.userName);
//   const idCustomer = useSelector((state) => state.ACCOUNT.idCustomer);
//   const idOwner = useSelector((state) => state.ACCOUNT.idOwner);
//   const uid = useSelector((state) => state.ACCOUNT.uid);

//   const [salonData, setSalonData] = useState({});

//   useEffect(() => {
//     AccountServices.GetInformationAccount(uid)
//       .then((res) => {
//         setSalonData(res.data);
//       })
//       .catch((err) => {
//         message.error("Can not get your salon details!");
//       });
//   }, [uid]);

//   const handleReload = () => {
//     window?.location?.reload();
//   };

//   return (
//     <div className="salon-owner-account">
//       {uid ? (
//         <Card className="salon-card">
//           <Avatar
//             src={salonData.img || <UserOutlined />}
//             size={100}
//             className="salon-avatar"
//           />
//           <Descriptions className="salon-info" column={1}>
//             <Descriptions.Item>
//               <Typography.Text strong>{salonData?.fullName}</Typography.Text>
//             </Descriptions.Item>
//             <Descriptions.Item>{salonData?.phone}</Descriptions.Item>
//             <Descriptions.Item>{salonData?.email}</Descriptions.Item>
//           </Descriptions>
//           <div className="salon-buttons">
//             {idOwner && (
//               <>
//                 <Link to="/salon_report">
//                   <Button type="primary">Danh sách báo cáo của bạn</Button>
//                 </Link>
//                 <Link to="/dashboardTransaction">
//                   <Button type="primary">Thống kê doanh thu</Button>
//                 </Link>
//               </>
//             )}
//             {idCustomer && (
//               <>
//                 <Link to="/customer_report">
//                   <Button type="primary">Danh sách báo cáo của bạn</Button>
//                 </Link>
//                 {/* <Link to="/dashboardTransaction"> */}
//                   <Button onClick={handleScan} type="primary">Bật quét Qr</Button>
//                 {/* </Link> */}
//               </>
//             )}
//           </div>
//         </Card>
//       ) : (
//         <div className="salon-reload">
//           <Space direction="vertical">
//             <Typography.Title>Your account is not found!</Typography.Title>
//             <Button style={{ width: "100%" }} onClick={handleReload}>
//               Reload
//             </Button>
//           </Space>
//         </div>
//       )}
//     </div>
//   );
// }

// export default SalonOwnerAccountPage;
import React, { useEffect, useState } from "react";
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
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import QrScanner from "react-qr-scanner";
import "../css/SalonOwnerAccountPage.css";
import dayjs from "dayjs";
import Loader from "../components/Loader";

const { Option } = Select;

function SalonOwnerAccountPage() {
  const { id } = useParams();
  const idCustomer = useSelector((state) => state.ACCOUNT.idCustomer);
  const idOwner = useSelector((state) => state.ACCOUNT.idOwner);
  const uid = useSelector((state) => state.ACCOUNT.uid);

  const [salonData, setSalonData] = useState({});
  const [showScanner, setShowScanner] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isNotified, setIsNotified] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [passwordForm] = Form.useForm();

  useEffect(() => {
    AccountServices.GetInformationAccount(id)
      .then((res) => {
        setSalonData(res.data);
        setAvatarUrl(res.data.img);
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
    console.error(err);
    message.error("Không truy cập máy ảnh!");
  };

  const previewStyle = {
    height: 240,
    width: 320,
  };

  const maskPassword = (password) => {
    if (!password) return "";
    return "*".repeat(password.length - 2) + password.slice(-2);
  };

  const handleSave = (values) => {
    const formData = new FormData();
    setIsLoading(true);
    formData.append("roleId", idCustomer);
    formData.append("phone", values.phone ?? salonData.phone);
    formData.append("password", salonData.password);
    formData.append("fullName", values.fullName ?? salonData.fullName);
    formData.append(
      "dayOfBirth",
      values.dayOfBirth
        ? values.dayOfBirth.format("YYYY-MM-DD")
        : salonData.dayOfBirth
    );
    formData.append("gender", values.gender ?? salonData.gender);
    formData.append("email", values.email ?? salonData.email);
    formData.append("address", values.address ?? salonData.address);

    if (avatarFile) {
      formData.append("img", avatarFile);
    }

    AccountServices.updateUserById(id, formData)
      .then((res) => {
        message.success("Cập nhật tài khoản thành công");
        return AccountServices.GetInformationAccount(id);
      })
      .then((res) => {
        setSalonData(res.data);
        setAvatarUrl(res.data.img);
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

  const [avatarUrl, setAvatarUrl] = useState(null);
  console.log(avatarUrl);
  console.log(avatarUrl);

  const handleAvatarChange = (info) => {
    const isLt5M = info.file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("Ảnh phải nhỏ hơn 5MB!");
      return;
    }
    const file = info.file;
    console.log("File info:", info.file);
    console.log("Origin File Object:", info.file.originFileObj);
    if (file) {
      console.log("File selected:", file); // Debugging log
      setAvatarFile(file);
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
      form.setFieldsValue({ avatar: url });
    } else {
      console.log("No file selected or invalid file");
    }
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
            <Link to="/customer_report">Danh sách báo cáo của bạn</Link>
          </Menu.Item>
          <Menu.Item>
            <Button onClick={() => setShowScanner(true)} type="primary">
              Bật quét Qr
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
              <div style={{ margin: "0 auto" }}>
                <QrScanner
                  delay={300}
                  onError={handleError}
                  onScan={handleScan}
                  style={previewStyle}
                  facingMode="environment"
                />
              </div>
            )}
          </div>
          <div>
            <Typography.Text strong style={{ fontSize: "2rem" }}>
              Chỉnh sửa thông tin người dùng
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
    </div>
  );
}

export default SalonOwnerAccountPage;
