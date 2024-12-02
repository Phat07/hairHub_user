import { FacebookOutlined, InstagramOutlined } from "@ant-design/icons";
import { Row, Typography } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import googleplay from "../assets/images/imageGooglePlay.png";
import "../css/footer2.css";
const { Title } = Typography;

const Footer2 = () => {
  const navigate = useNavigate();
  const handleNavigation = (selectedKey) => {
    navigate(`/Hairhub/${selectedKey}`);
  };
  return (
    <div className="footer-container">
      <div className="waves">
        <div className="wave" id="wave1"></div>
        <div className="wave" id="wave2"></div>
        <div className="wave" id="wave3"></div>
        <div className="wave" id="wave4"></div>
      </div>
      <div className="navbar-footer-container">
        <nav className="navbar-footer">
          <ul className="navbar-footer-list">
            <li className="navbar-footer-item">
              <div
                className="navbar-footer-link"
                onClick={() => handleNavigation("aboutUs")}
              >
                Giới thiệu về chúng tôi
              </div>
            </li>
            <li className="navbar-footer-item">
              <div
                className="navbar-footer-link"
                onClick={() => handleNavigation("privacyPolicy")}
              >
                Chính sách
              </div>
            </li>
            <li className="navbar-footer-item">
              <div
                className="navbar-footer-link"
                onClick={() => handleNavigation("termsOfService")}
              >
                Lợi Ích
              </div>
            </li>
            <li className="navbar-footer-item">
              <div
                className="navbar-footer-link"
                onClick={() => handleNavigation("faqs")}
              >
                Thông Tin Liên Hệ
              </div>
            </li>
          </ul>
        </nav>
        <a
          href="https://play.google.com/store/apps/details?id=com.hairhub.hairhubvn&pcampaignid=web_share"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={googleplay}
            alt="Google Play Banner"
            style={{
              width: "100%",
              height: "100%",
              maxWidth: "10rem",
              maxHeight: "10rem",
              objectFit: "cover",
              borderRadius: "0 2px 2px 0",
            }}
            className="googleplay-footer"
          />
        </a>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "0.5rem",
          marginBottom: "1rem",
        }}
      >
        <Title style={{ margin: "0", color: "white", fontSize: "2rem" }}>
          HairHub{" "}
        </Title>
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
    </div>
  );
};

export default Footer2;
