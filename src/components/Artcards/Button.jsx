// import { Button1 } from "antd";
import { useNavigate } from "react-router-dom";
import Styles from "../../css/Button.module.css";

function Button({ text, title }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => {
        navigate(`/list_salon_ver2?servicesName=${title}`);
      }}
      className={Styles.btn}
    >
      {text}
    </button>
  );
}

export default Button;
