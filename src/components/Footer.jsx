import { Col, Flex, Row } from "antd";
import { footer } from "./data.jsx";
import "../css/footer.css";

function Footer() {
  return (
    <div>
      {/* <footer className="footer page-wrapper">
        <div className="footer-wrap page">
          <Row>
            {footer.map((foot, index) => (
              <Col
                key={index.toString()}
                md={8}
                xs={24}
                className="footer-item-col"
              >
                <Flex wrap vertical justify="center" align="center">
                  <h2 className="h3Footer">
                    {foot.icon && (
                      <img
                        style={{ width: 50, marginRight: 16 }}
                        src={foot.icon}
                        alt="img"
                      />
                    )}
                    {foot.title}
                  </h2>
                  {foot.children.map((child) => (
                    <Row align="middle" gutter={16} key={child.link}>
                      <a
                        className="text-2xl text-slate-500"
                        target="_blank"
                        href={child.link}
                      >
                        {child.icon}
                        <span>
                          {child.title}
                          {/* {child.desc && (
                            <span
                              style={{ color: "rgba(255, 255, 255, 0.65)" }}
                            >
                              {child.desc}
                            </span>
                          )} 
                        </span>
                      </a>
                    </Row>
                  ))}
                </Flex>
              </Col>
            ))}
          </Row>
        </div> */}

      {/*  */}

      {/* <div className="footer-bottom">
          <div className="page">
            <Row>
              <Col
                md={4}
                xs={24}
                style={{ textAlign: "left" }}
                className="mobile-hide"
              >
                <a
                  href="https://www.hella.com/hella-com/en/"
                  rel="noopener noreferrer"
                  target="_blank"
                  style={{
                    color: "rgba(256, 256, 256, 0.9)",
                    textAlign: "left",
                  }}
                >
                  HELLA
                </a>
              </Col>
              <Col md={20} xs={24}>
                <span
                  className="mobile-hide"
                  style={{
                    lineHeight: "16px",
                    paddingRight: 12,
                    marginRight: 11,
                  }}
                >
                  <a href="" rel="noopener noreferrer" target="_blank">
                    hellaBookingTour@gmail.com
                  </a>
                </span>
                <span style={{ marginRight: 24 }} className="mobile-hide">
                  <a href="" rel="noopener noreferrer" target="_blank">
                    Fb: Hella Booking Tour
                  </a>
                </span>
                <span style={{ marginRight: 12 }}>Tele-phone: 0112233444</span>
                <span style={{ marginRight: 12 }}>Copyright © 20124</span>
              </Col>
            </Row>
          </div>
        </div> */}
      {/* </footer> */}
      <div className="footer-container">
        <footer className="footer">
          <div className="waves">
            <div className="wave" id="wave1"></div>
            <div className="wave" id="wave2"></div>
            <div className="wave" id="wave3"></div>
            <div className="wave" id="wave4"></div>
          </div>
          <ul className="social-icon">
            <li className="social-icon__item">
              <a className="social-icon__link" href="#">
                <ion-icon name="logo-facebook"></ion-icon>
              </a>
            </li>
            <li className="social-icon__item">
              <a className="social-icon__link" href="#">
                <ion-icon name="logo-twitter"></ion-icon>
              </a>
            </li>
            <li className="social-icon__item">
              <a className="social-icon__link" href="#">
                <ion-icon name="logo-linkedin"></ion-icon>
              </a>
            </li>
            <li className="social-icon__item">
              <a className="social-icon__link" href="#">
                <ion-icon name="logo-instagram"></ion-icon>
              </a>
            </li>
          </ul>
          <ul className="menu">
            <li className="menu__item">
              <a className="menu__link" href="#">
                Home
              </a>
            </li>
            <li className="menu__item">
              <a className="menu__link" href="#">
                About
              </a>
            </li>
            <li className="menu__item">
              <a className="menu__link" href="#">
                Services
              </a>
            </li>
            <li className="menu__item">
              <a className="menu__link" href="#">
                Team
              </a>
            </li>
            <li className="menu__item">
              <a className="menu__link" href="#">
                Contact
              </a>
            </li>
          </ul>
          <p>&copy;2024 HairHub Team | All Rights Reserved</p>
        </footer>
      </div>
    </div>
  );
}

export default Footer;
