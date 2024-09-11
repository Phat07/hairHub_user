import React from "react";
import { Carousel } from "react-carousel3";
import image1 from "../../assets/images/serviceImg2/1.png";
import image2 from "../../assets/images/serviceImg2/2.png";
import image3 from "../../assets/images/serviceImg2/3.png";
import image4 from "../../assets/images/serviceImg2/4.png";
import image5 from "../../assets/images/serviceImg2/5.png";
import image6 from "../../assets/images/serviceImg2/6.png";
import image7 from "../../assets/images/serviceImg2/7.png";
import image8 from "../../assets/images/serviceImg2/8.png";

const style = {
  width: 10,
  height: 30,
};
const imgStyle = {
  padding: "2px",
  background: "black",
  borderRadius: "20px",
};
const images = [image1, image2, image3, image4, image5, image6, image7, image8];
function ReactCarouselComponent() {
  return (
    <div
      style={{
        margin: "0px",
        padding: "0px",
        display: "flex",
        justifyContent: "center",
        background: "linear-gradient(to bottom,  white 0%, gray 100%)",
      }}
    >
      <Carousel
        height={"100vh"}
        width={700}
        yOrigin={0}
        xOrigin={0}
        yRadius={50}
        xRadius={600}
      >
        {images.map((image, index) => (
          <div key={index} style={style}>
            <img alt="" src={image} style={imgStyle} />
          </div>
        ))}
      </Carousel>
    </div>
  );
}
export default ReactCarouselComponent;