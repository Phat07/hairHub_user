// AccountDeletionGuide.js
import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import style from "../css/AccountDeletionGuide.module.css";
import { MenuOutlined } from "@ant-design/icons";

const AccountDeletionGuide = () => {
  const navigate = useNavigate();

  return (
    <div className={style.guideContainer} style={{ marginTop: "90px" }}>
      <h1 className={style.header}>Hướng dẫn xóa tài khoản</h1>
      <p className={style.Subheader}>
        Nếu bạn muốn xóa tài khoản, vui lòng đọc kỹ các chính sách sau:
      </p>
      <ul className={style.list}>
        <li className={style.listItem}>
          Mọi dữ liệu của bạn về{" "}
          <span className={style.highlight}>ảnh đại diện, tên, email</span> sẽ
          bị xóa vĩnh viễn và không thể khôi phục.
        </li>
        <li className={style.listItem}>
          Các{" "}
          <span className={style.highlight}>dịch vụ hoặc lịch sử dịch vụ</span>{" "}
          sẽ không còn khả dụng sau khi tài khoản bị xóa.
        </li>
        <li className={style.listItem}>
          Các{" "}
          <span className={style.highlight}>
            nhận xét về các salon/barber shop
          </span>{" "}
          sẽ được giữ lại nhằm phục vụ cho đánh giá cửa hàng, nhưng{" "}
          <span className={style.highlight}>
            tên, ảnh đại diện, email, ảnh đánh giá
          </span>{" "}
          sẽ được ẩn đi và thay thế bằng người dùng ẩn danh
        </li>
        <li className={style.listItem}>
          Các <span className={style.highlight}>hình ảnh kiểu tóc</span> đã được
          lưu trữ trong phần mềm Hairhub sẽ được xóa toàn bộ
        </li>
        <li className={style.listItem}>
          Các <span className={style.highlight}>báo cáo</span> bạn gửi lên sẽ
          được lưu trữ lại nhằm mục đích xét duyệt, sẽ được xóa trong 30 ngày
        </li>
      </ul>

      <p className={style.Subheader}>Cách xóa tài khoản:</p>
      <ol className={style.list}>
        <li className={style.listItem}>
          <span className={style.highlight}>Bước 1: </span>Đăng nhập vào tài
          khoản của bạn tại trang web chính thức của Hairhub:{" "}
          <a href="https://www.hairhub.com.vn/">Hairhub - Đặt lịch cắt tóc</a>
        </li>
        <li className={style.listItem}>
          <span className={style.highlight}>Bước 2: </span>Nhấn vào Avatar của
          bạn tại góc trên màn hình bên phải
        </li>
        <li className={style.listItem}>
          {" "}
          <span className={style.highlight}>Bước 3: </span>Chọn "Thông tin cá
          nhân"
        </li>
        <li className={style.listItem}>
          <span className={style.highlight}>Bước 4: </span>Nhấn vào icon{" "}
          <MenuOutlined /> và chọn nút "Xóa tài khoản"
        </li>
        <li className={style.listItem}>
          <span className={style.highlight}>Bước 5: </span>Xác nhận xóa tài
          khoản bằng cách nhần vào nút "Đồng ý Xóa".
        </li>
        <li className={style.listItem}>
          <span className={style.highlight}>Bước 6: </span>Nhập mã OTP được gửi
          qua email của bạn đã đăng nhập để xác nhận hoàn thành
        </li>
        <li className={style.listItem}>
          Nếu có bất cứ thắc mắc, hãy liên hệ thông qua tại{" "}
          <ol className={style.list} style={{ marginTop: "10px" }}>
            <li className={style.listItem}>
              <span className={style.highlight}>
                Hệ Thống Fanpage Facebook:
              </span>{" "}
              <a
                href="https://www.facebook.com/profile.php?id=61559941142117"
                className={style.listItem}
                target="_blank" // Thêm target="_blank" để mở liên kết trong tab mới
                rel="noopener noreferrer" // Bảo mật cho liên kết mở trong tab mới
              >
                Hairhub | Ho Chi Minh City
              </a>
            </li>

            <li className={style.listItem}>
              <span className={style.highlight}>Số Điện Thoại / Zalo:</span>{" "}
              0706600157
            </li>
            <li className={style.listItem}>
              <span className={style.highlight}>Email Hỗ Trợ Khách Hàng:</span>{" "}
              <a
                href="mailto:hairhub.business@gmail.com"
                className={style.listItem}
              >
                hairhub.business@gmail.com
              </a>
            </li>
          </ol>
        </li>
      </ol>

      <div className={style.buttonContainer}>
        <Button type="default" onClick={() => navigate("/")}>
          Quay lại Trang Chủ
        </Button>
        {/* <Button
          type="primary"
          danger
          onClick={() => navigate("/delete-account")}
        >
          Xóa tài khoản
        </Button> */}
      </div>
    </div>
  );
};

export default AccountDeletionGuide;
