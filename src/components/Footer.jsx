import React from "react";
import { Row, Col, Form, Input, Button } from "antd";
import { FacebookOutlined, InstagramOutlined } from "@ant-design/icons";
import "../css/footer.css";

const Footer = () => {
  return (
    <div className="footer-container">
      <div className="waves">
        <div className="wave" id="wave1"></div>
        <div className="wave" id="wave2"></div>
        <div className="wave" id="wave3"></div>
        <div className="wave" id="wave4"></div>
      </div>
      <Row justify="space-between" className="footer-content">
        <Col span={12}>
          <h3>LIÊN HỆ</h3>
          <p>
            Điền vào biểu mẫu dưới đây để gửi cho chúng tôi một tin nhắn và
            chúng tôi sẽ trả lời bạn sớm nhất có thể.
          </p>
          <Form className="form-send" layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="name">
                  <Input placeholder="Tên" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="email">
                  <Input placeholder="Email" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="message">
              <Input.TextArea placeholder="Tin nhắn" rows={2} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                GỬI TIN NHẮN
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col span={10} className="contact-info">
          <h3>Thông tin liên hệ</h3>
          <p>
            <strong>Địa chỉ:</strong> Lô E2a-7, Đường D1, Đ. D1, Long Thạnh Mỹ,
            Thành Phố Thủ Đức, Thành phố Hồ Chí Minh 700000
          </p>
          <p>
            <strong>Điện thoại:</strong> +84 86 936 26 19
          </p>
          <p>
            <strong>Email:</strong> hairhub.business@gmail.com
          </p>
        </Col>
      </Row>
      <Row justify="center" className="social-links">
        <a
          href="https://www.facebook.com/profile.php?id=61559941142117"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FacebookOutlined className="social-icon" />
        </a>
        <a
          href="https://www.instagram.com/hair_hub2024?fbclid=IwY2xjawEXH4RleHRuA2FlbQIxMAABHcU-ErcSfFW_dY4RCcrsM9JndPfn-gyjzGDj_1BIGJjuxznpo-p1Pk6nZA_aem_0g8FC4RzX60yd6_YJbqiHQ"
          target="_blank"
          rel="noopener noreferrer"
        >
          <InstagramOutlined className="social-icon" />
        </a>
      </Row>
    </div>
  );
};

export default Footer;
