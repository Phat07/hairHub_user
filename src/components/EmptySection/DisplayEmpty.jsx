import { Empty, Typography } from "antd";

export const EmptyComponent = ({ description }) => {
  return (
    <Empty
      image="https://res.cloudinary.com/dtlvihfka/image/upload/v1720800321/images-removebg-preview_kellwm.png"
      imageStyle={{
        background: "linear-gradient(90deg, #DCA68A 0%, #E7F1FF 85%)",
        height: 200, // Adjust the height as needed
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        objectFit: "cover", // Ensures the image covers the area
        margin: "0 auto", // Centers the image
      }}
      description={<Typography.Title level={4}>{description}</Typography.Title>}
    />
  );
};
