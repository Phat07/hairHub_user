import React from "react";
import "../../css/PrivacyPolicyContent.css"; // Tái sử dụng CSS

function FAQsContent() {
  return (
    <div className="privacy-policy-content">
      <h1>Thông Tin Liên Hệ</h1>
      {/* <h6>
        <strong>
          Để hỗ trợ và giải đáp thắc mắc, khách hàng và đối tác có thể liên hệ
          với chúng tôi qua các kênh sau:
        </strong>
      </h6> */}
      <section className="policy-section">
        <h2>Thông Tin Liên Hệ Chính</h2>
        <p>
          <strong>Địa Chỉ Văn Phòng:</strong> Lô E2a-7, Đường D1, Đ. D1, Long
          Thạnh Mỹ, Thành Phố Thủ Đức
        </p>
        <p>
          <strong>Số Điện Thoại:</strong> 0706600157
        </p>
        <p>
          <strong>Email Hỗ Trợ Khách Hàng:</strong> hairhub.business@gmail.com
        </p>
        <p>
          <strong>Giờ Làm Việc:</strong>
        </p>
        <ul>
          <li>
            <strong>Thứ Hai đến Thứ Sáu:</strong> 8:00 AM - 6:00 PM
          </li>
          <li>
            <strong>Thứ Bảy:</strong> 8:00 AM - 11:30 AM
          </li>
          <li>
            <strong>Chủ Nhật:</strong> Đóng cửa
          </li>
        </ul>

        <h2>Liên Hệ Qua Mạng Xã Hội</h2>
        <p>
          <strong>Facebook:</strong>{" "}
          <a href="https://www.facebook.com/profile.php?id=61559941142117">
            Hairhub | Ho Chi Minh City
          </a>
        </p>
        <p>
          <strong>Instagram:</strong>{" "}
          <a href="https://www.instagram.com/hair_hub2024/">
            Instagram (@hair_hub2024)
          </a>
        </p>

        <h2>Hỗ Trợ Trực Tuyến</h2>
        <p className="no-wrap-text">
          <strong>Chat Trực Tuyến:</strong>
          <p>
            Truy cập trang web và sử dụng tính năng chat trực tuyến để nhận hỗ
            trợ ngay lập tức.
            <a href="https://hairhub.id.vn/">hairhub.id.vn</a>
          </p>
        </p>
        <p>
          <strong>Hệ Thống Fanpage Facebook:</strong> Gửi yêu cầu hỗ trợ qua
          fanpage Hairhub.
          <a href="https://www.facebook.com/profile.php?id=61559941142117">
            Hairhub | Ho Chi Minh City
          </a>
        </p>
      </section>
    </div>
  );
}

export default FAQsContent;
