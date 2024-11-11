// import React, { useState, useEffect } from "react";
// import { Button, Dropdown, Menu } from "antd";
// import { useLocation } from "react-router-dom";
// import "../css/AboutPage.css";
// import AboutUsContent from "../components/AboutContent/AboutUsContent";
// import PrivacyPolicyContent from "../components/AboutContent/PrivacyPolicyContent";
// import TermsOfServiceContent from "../components/AboutContent/TermsOfServiceContent";
// import FAQsContent from "../components/AboutContent/FAQsContent";
// import { DownOutlined } from "@ant-design/icons";

// const contentMap = {
//   aboutUs: <AboutUsContent />,
//   privacyPolicy: <PrivacyPolicyContent />,
//   termsOfService: <TermsOfServiceContent />,
//   faqs: <FAQsContent />,
// };

// function AboutPage() {
//   const location = useLocation();
//   const [selectedKey, setSelectedKey] = useState("aboutUs");
//   const [isDropdownVisible, setDropdownVisible] = useState(false);

//   useEffect(() => {
//     window.scrollTo(0, 0); // Cuộn lên đầu trang
//   }, [selectedKey]);

//   useEffect(() => {
//     if (location.state && location.state.selectedKey) {
//       setSelectedKey(location.state.selectedKey);
//     }
//   }, [location.state]);

//   const handleMenuClick = (e) => {
//     setSelectedKey(e.key);
//   };

//   return (
//     <div className="policy-container">
//       {/* {window.innerWidth > 768 ? ( */}
//       <Menu
//         mode="vertical"
//         selectedKeys={[selectedKey]}
//         onClick={handleMenuClick}
//         className="policy-menu"
//       >
//         <Menu.Item key="aboutUs">Giới thiệu về chúng tôi</Menu.Item>
//         <Menu.Item key="privacyPolicy">Chính sách</Menu.Item>
//         <Menu.Item key="termsOfService">Lợi Ích</Menu.Item>
//         <Menu.Item key="faqs">Thông Tin Liên Hệ</Menu.Item>
//       </Menu>
//       {/* ) : (
//         <Dropdown
//           overlay={menu}
//           visible={isDropdownVisible}
//           onVisibleChange={setDropdownVisible}
//           trigger={["click"]}
//           className="policy-menu-dropdown"
//         >
//           <Button className="ant-dropdown-trigger">Menu</Button>
//         </Dropdown>
//       )} */}

//       <div className="policy-content">{contentMap[selectedKey]}</div>
//     </div>
//   );
// }

// export default AboutPage;

import React, { useState, useEffect } from "react";
import { Button, Menu } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import "../css/AboutPage.css";
import AboutUsContent from "../components/AboutContent/AboutUsContent";
import PrivacyPolicyContent from "../components/AboutContent/PrivacyPolicyContent";
import TermsOfServiceContent from "../components/AboutContent/TermsOfServiceContent";
import FAQsContent from "../components/AboutContent/FAQsContent";

const contentMap = {
  aboutUs: <AboutUsContent />,
  privacyPolicy: <PrivacyPolicyContent />,
  termsOfService: <TermsOfServiceContent />,
  faqs: <FAQsContent />,
};

function AboutPage() {
  const { key } = useParams(); // get the key parameter from the URL
  const navigate = useNavigate();
  const [selectedKey, setSelectedKey] = useState(key || "aboutUs");

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, [selectedKey]);

  useEffect(() => {
    // Update the selectedKey state if the URL parameter changes
    if (key) {
      setSelectedKey(key);
    }
  }, [key]);

  const handleMenuClick = (e) => {
    setSelectedKey(e.key);
    navigate(`/Hairhub/${e.key}`); // Update the URL based on the selected key
  };

  return (
    <div className="policy-container">
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
      <div className="policy-content">{contentMap[selectedKey]}</div>
    </div>
  );
}

export default AboutPage;
