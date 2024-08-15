import React, { useState, useEffect } from "react";
import { Button, Dropdown, Menu } from "antd";
import { useLocation } from "react-router-dom";
import "../css/AboutPage.css";
import AboutUsContent from "../components/AboutContent/AboutUsContent";
import PrivacyPolicyContent from "../components/AboutContent/PrivacyPolicyContent";
import TermsOfServiceContent from "../components/AboutContent/TermsOfServiceContent";
import FAQsContent from "../components/AboutContent/FAQsContent";
import { DownOutlined } from "@ant-design/icons";

const contentMap = {
  aboutUs: <AboutUsContent />,
  privacyPolicy: <PrivacyPolicyContent />,
  termsOfService: <TermsOfServiceContent />,
  faqs: <FAQsContent />,
};

function AboutPage() {
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState("aboutUs");
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0); // Cuộn lên đầu trang
  }, [selectedKey]);

  useEffect(() => {
    if (location.state && location.state.selectedKey) {
      setSelectedKey(location.state.selectedKey);
    }
  }, [location.state]);

  const handleMenuClick = (e) => {
    setSelectedKey(e.key);
  };

  return (
    <div className="policy-container">
      {/* {window.innerWidth > 768 ? ( */}
      <Menu
        mode="vertical"
        selectedKeys={[selectedKey]}
        onClick={handleMenuClick}
        className="policy-menu"
      >
        <Menu.Item key="aboutUs">Giới thiệu về chúng tôi</Menu.Item>
        <Menu.Item key="privacyPolicy">Chính sách</Menu.Item>
        <Menu.Item key="termsOfService">Lợi Ích</Menu.Item>
        <Menu.Item key="faqs">Thông Tin Liên Hệ</Menu.Item>
      </Menu>
      {/* ) : (
        <Dropdown
          overlay={menu}
          visible={isDropdownVisible}
          onVisibleChange={setDropdownVisible}
          trigger={["click"]}
          className="policy-menu-dropdown"
        >
          <Button className="ant-dropdown-trigger">Menu</Button>
        </Dropdown>
      )} */}

      <div className="policy-content">{contentMap[selectedKey]}</div>
    </div>
  );
}

export default AboutPage;
