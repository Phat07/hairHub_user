import React from "react";
import { useNavigate } from "react-router-dom"; // Assuming you're using react-router for navigation
import styles from "../css/footer-mobile.module.css";

const FooterMobile = () => {
  const navigate = useNavigate();

  return (
    <div className={styles["footer-mobile"]}>
      <button onClick={() => navigate("/home")}>Home</button>
      <button onClick={() => navigate("/profile")}>Profile</button>
      <button onClick={() => navigate("/settings")}>Settings</button>
    </div>
  );
};

export default FooterMobile;
