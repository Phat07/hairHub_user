import React, { useEffect, useState } from "react";
import styles from "../css/imagesForSalon.module.css";
import { useDispatch, useSelector } from "react-redux";
import { actGetSalonInformationByOwnerId } from "@/store/salonInformation/action";
import { Button, Image, Pagination, Spin, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { motion } from "framer-motion"; // for animations
import { useSpring, animated } from "react-spring";
const salonDetail1 = {
  listImage: [
    "https://via.placeholder.com/300x200?text=Image+1",
    "https://via.placeholder.com/300x200?text=Image+2",
    "https://via.placeholder.com/300x200?text=Image+3",
    "https://via.placeholder.com/300x200?text=Image+4",
    "https://via.placeholder.com/300x200?text=Image+5",
    "https://via.placeholder.com/300x200?text=Image+6",
    //   "https://via.placeholder.com/300x200?text=Image+7",
    //   "https://via.placeholder.com/300x200?text=Image+8",
    //   "https://via.placeholder.com/300x200?text=Image+9",
    //   "https://via.placeholder.com/300x200?text=Image+10"
  ],
};

function ImageForSalon(props) {
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false)
  const springProps = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { tension: 170, friction: 14 },
  });

  const ownerId = useSelector((state) => state.ACCOUNT.idOwner);
  const dispatch = useDispatch();

  useEffect(() => {
    if (ownerId) {
      dispatch(actGetSalonInformationByOwnerId(ownerId));
    }
  }, [ownerId]);

  const salonDetail = useSelector(
    (state) => state.SALONINFORMATION.getSalonByOwnerId
  );
  console.log("salon", salonDetail);

  // Handle file change (upload)
  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    // Set preview image below the upload button
    if (newFileList.length) {
      const latestFile = newFileList[newFileList.length - 1];
      setPreviewImage(URL.createObjectURL(latestFile.originFileObj));
    } else {
      setPreviewImage(null);
    }
  };
  

  return (
    <div className={styles["dashboard-container"]}>
      {/* Xin chào {salonDetail?.name} */}
      <div className="flex flex-col md:flex-row items-center justify-around min-h-screen bg-[#ece8de] p-4">
        <div className="w-full md:w-3/12 h-96 md:h-4/5 bg-[#ece8de] p-4 rounded-lg shadow-lg mb-4 md:mb-0">
          <Upload
            listType="picture" 
            fileList={fileList}
            onChange={handleUploadChange}
            beforeUpload={(file) => {
              // Do something with the file before upload (e.g., add to fileList)
              return false; // Prevent the default upload behavior
            }}
            multiple
            showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
          >
            <Button icon={<UploadOutlined />}>
              Hình ảnh tiệm của bạn
            </Button>
          </Upload>
        </div>
        <Spin spinning={loading} >
          <div className="w-full md:w-9/12 h-auto md:h-4/5 bg-[#ece8de] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 rounded-lg shadow-lg">
            {salonDetail1?.listImage ? (
              salonDetail1.listImage.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-48 md:h-auto"
                >
                  <Image
                    src={image}
                    alt={`Salon Image ${index}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </motion.div>
              ))
            ) : (
              <div className="flex justify-center items-center w-full h-full">
                <animated.p
                  style={springProps}
                  className="text-center text-lg font-semibold text-gray-600"
                >
                  Chưa có hình ảnh nào cho shop của bạn
                </animated.p>
              </div>
            )}
            <Pagination />
          </div>
        </Spin>
      </div>
    </div>
  );
}

export default ImageForSalon;
