import React from "react";
import Card from "./Card";
import { v4 as uuidv4 } from "uuid";
import styles from '../../css/contentService.module.css'
import image1 from "../../assets/images/serviceImg2/1.png";
import image2 from "../../assets/images/serviceImg2/2.png";
import image3 from "../../assets/images/serviceImg2/3.png";
import image4 from "../../assets/images/serviceImg2/4.png";
import image5 from "../../assets/images/serviceImg2/5.png";
import image6 from "../../assets/images/serviceImg2/6.png";
import image7 from "../../assets/images/serviceImg2/7.png";
import image8 from "../../assets/images/serviceImg2/8.png";
import Carroussel from "./Carroussel";
function CarrousselComponent(props) {
  let cards = [
    {
      key: uuidv4(),
      content: <Card title={"Cắt Tóc"} imagen={image1} />,
    },
    {
      key: uuidv4(),
      content: <Card title={"Gội Đầu"} imagen={image2} />,
    },
    {
      key: uuidv4(),
      content: <Card title={"Lấy Ráy Tai"} imagen={image3} />,
    },
    {
      key: uuidv4(),
      content: <Card title={"Dịch vụ làm đẹp"} imagen={image4} />,
    },
    {
      key: uuidv4(),
      content: <Card title={"Cạo Râu"} imagen={image5} />,
    },
    {
      key: uuidv4(),
      content: <Card title={"Nhuộm tóc"} imagen={image6} />,
    },
    {
      key: uuidv4(),
      content: <Card title={"Phục Hồi Tóc"} imagen={image7} />,
    },
    {
      key: uuidv4(),
      content: <Card title={"Uốn Tóc"} imagen={image8} />,
    },
  ];
  return (
    <div className={styles.contentService}>
      <Carroussel
        cards={cards}
        height="500px"
        width="100%"
        margin="0 auto"
        offset={200}
        showArrows={false}
      />
    </div>
  );
}

export default CarrousselComponent;
