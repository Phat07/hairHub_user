import React from "react";
import "../../css/AboutUsContent.css";
// import "../../css/style.css";
import { Card, Col, Row } from "antd";
import video from "../../assets/images/AboutUsHairhub.mp4";
import img from "../../assets/images/policyImg/1.png";
import img1 from "../../assets/images/policyImg/2.png";
function AboutUsContent() {
  return (
    <div className="about-us-content">
      <h1>Về chúng tôi</h1>
      <Card
        bodyStyle={{ padding: 0 }}
        className="card-policy"
        // style={{ maxHeight: "35rem", padding: "0", margin: "0" }}
      >
        <Row>
          <Col xs={24} md={14} className="policy-card-col">
            <section className="introduction-section">
              <h2>Hairhub - Đặt lịch mọi lúc, phục vụ mọi nơi</h2>
              <p>
                Hairhub là một dự án được xây dựng và phát triển bởi một nhóm
                sinh viên trường Đại học FPT với mong muốn mang lại một nền tảng
                đặt lịch cắt tóc trực tuyến hàng đầu Việt Nam giúp khách hàng và
                các salon, barber shop kết nối dễ dàng với nhau một cách chuyên
                nghiệp và tiện ích.
              </p>
              <p>
                Ra đời trong thời điểm ngành công nghiệp làm đẹp và dịch vụ trực
                tuyến ngày càng phát triển mạnh mẽ, Hairhub tự hào là một trong
                những đơn vị tiên phong trong lĩnh vực đặt lịch cắt tóc trực
                tuyến tại Việt Nam. Với sự gia tăng nhu cầu về trải nghiệm dịch
                vụ tiện ích và chất lượng, chúng tôi đã nỗ lực không ngừng để
                mang đến cho khách hàng một giải pháp đặt lịch cắt tóc đơn giản,
                nhanh chóng và hiệu quả.
              </p>
            </section>
          </Col>
          <Col xs={24} md={10}>
            <div style={{ position: "relative", paddingTop: "80%" }}>
              <video
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  // borderRadius: "1rem",
                }}
                autoPlay
                loop
                muted
                playsInline
                disablePictureInPicture
                controlsList="nodownload nofullscreen noremoteplayback"
              >
                <source src={video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </Col>
        </Row>
      </Card>

      <Card
        bodyStyle={{ padding: 0 }}
        className="card-policy"
        // style={{ maxHeight: "35rem", padding: "0", margin: "0" }}
      >
        <Row>
          <Col xs={24} md={14} className="policy-card-col">
            <section className="vision-section">
              <h2>Tầm Nhìn Của Chúng Tôi</h2>
              <p>
                <strong>
                  Tại Hairhub, chúng tôi hướng tới việc tạo ra một trải nghiệm
                  dịch vụ làm đẹp vừa thoải mái vừa tiện lợi cho mọi khách hàng.
                </strong>
                Tầm nhìn của chúng tôi là trở thành nền tảng hàng đầu trong việc
                cung cấp giải pháp đặt lịch cắt tóc và dịch vụ làm đẹp trực
                tuyến, nơi bạn có thể dễ dàng lựa chọn và lên lịch cho các dịch
                vụ làm đẹp ở các tiệm tóc bất cứ khi nào và ở bất cứ đâu mà
                không phải mất nhiều thời gian chờ đợi.
              </p>
              <p>
                <strong>
                  Chúng tôi cam kết nâng cao cả số lượng và chất lượng khách
                  hàng cho các tiệm tóc vừa và nhỏ,
                </strong>
                giúp họ mở rộng và phát triển mạnh mẽ hơn trong thị trường cạnh
                tranh. Hairhub không chỉ là cầu nối giữa khách hàng và các nhà
                tạo mẫu tóc, mà còn là nền tảng để kết nối, chia sẻ và gợi ý về
                các kiểu tóc, từ đó mang đến cho khách hàng những lựa chọn phù
                hợp nhất với phong cách và nhu cầu của họ.
              </p>
              <p>
                <strong>
                  Chúng tôi mong muốn tạo ra một trải nghiệm thư giãn và tích
                  cực cho tất cả người dùng của mình,
                </strong>
                từ việc lên lịch cắt tóc và tận hưởng dịch vụ tại tiệm tóc cho
                đến việc quản lý các lịch hẹn, doanh thu, ... cho các tiệm tóc.
                Với Hairhub, chúng tôi tin rằng việc đặt lịch hẹn bằng Hairhub
                không chỉ là một hành động cứng ngắt và nhàm chán, mà là một
                khoảnh khắc thú vị và đáng nhớ.
              </p>
            </section>
          </Col>
          <Col xs={24} md={10}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={img}
                alt="img"
                style={{
                  width: "100%",
                  height: "100%",
                  maxWidth: "35rem",
                  // maxHeight: "35rem",
                  objectFit: "cover",
                  borderRadius: "2rem",
                  paddingTop: "1rem",
                }}
              />
            </div>
          </Col>
        </Row>
      </Card>

      <Card
        bodyStyle={{ padding: 0 }}
        className="card-policy"
        // style={{ maxHeight: "35rem", padding: "0", margin: "0" }}
      >
        <Row>
          <Col xs={24} md={14} className="policy-card-col">
            <section className="mission-section">
              <h2>Sứ Mệnh Của Hairhub</h2>
              <ul>
                <li>
                  <strong>Xây Dựng Một Nền Tảng An Toàn và Chất Lượng:</strong>
                  Chúng tôi cam kết tạo ra một nền tảng kết nối đáng tin cậy
                  giữa khách hàng và các salon, barber shop. Hairhub đảm bảo
                  rằng các đối tác của chúng tôi đều đạt tiêu chuẩn cao về an
                  toàn và chất lượng, mang đến cho khách hàng những dịch vụ làm
                  đẹp tốt nhất và salon, barber shop những môi trường phát triển
                  tuyệt vời nhất.
                </li>
                <li>
                  <strong>Tạo Ra Cộng Đồng Làm Đẹp Tích Cực:</strong> Chúng tôi
                  nỗ lực xây dựng một cộng đồng làm đẹp nơi mà các salon, barber
                  shop và khách hàng có thể kết nối và chia sẻ. Hairhub không
                  chỉ là nơi để đặt lịch, mà còn là không gian để tạo ra những
                  mối quan hệ tích cực và ý nghĩa trong ngành làm đẹp.
                </li>
                <li>
                  <strong>Cung Cấp Trải Nghiệm Thoải Mái và Thú Vị:</strong>
                  Chúng tôi hiểu rằng việc làm đẹp không chỉ là nhu cầu mà còn
                  là cơ hội để thư giãn và làm mới tinh thần. Hairhub mang đến
                  những trải nghiệm làm đẹp dễ dàng và vui vẻ cùng với việc quản
                  lý lịch hẹn, khách hàng và doanh thu giúp bạn cảm thấy thoải
                  mái và xua tan căng thẳng.
                </li>
                <li>
                  <strong>
                    Đồng Hành Cùng Bạn Trong Mỗi Bước Đường Làm Đẹp:
                  </strong>
                  Chúng tôi là người bạn đồng hành đáng tin cậy trong hành trình
                  làm đẹp của bạn. Dù bạn đang tìm kiếm sự thay đổi phong cách
                  hay chỉ đơn giản là chăm sóc bản thân, Hairhub luôn sẵn sàng
                  hỗ trợ và cung cấp các giải pháp phù hợp nhất.
                </li>
              </ul>
            </section>
          </Col>
          <Col xs={24} md={10}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={img1}
                alt="img1"
                style={{
                  width: "100%",
                  height: "100%",
                  maxWidth: "35rem",
                  // maxHeight: "35rem",
                  objectFit: "cover",
                  borderRadius: "2rem",
                  paddingTop: "1rem",
                }}
              />
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
}

export default AboutUsContent;
