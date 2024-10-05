import React, { useEffect, useState } from "react";
import styles from "../css/imagesForSalon.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  actGetSalonInformationByOwnerId,
  actGetSalonInformationByOwnerIdForImages,
  actPostCreateImages,
} from "@/store/salonInformation/action";
import { Button, Image, message, Pagination, Spin, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useSpring, animated } from "react-spring";

function ImageForSalon(props) {
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

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
  const salonImages = useSelector(
    (state) => state.SALONINFORMATION.getSalonByOwnerIdForImages
  );

  useEffect(() => {
    if (salonDetail?.id) {
      dispatch(actGetSalonInformationByOwnerIdForImages(salonDetail?.id));
    }
  }, [salonDetail, salonDetail?.id]);

  // Handle file change (upload)
  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList.length) {
      const latestFile = newFileList[newFileList.length - 1];
      setPreviewImage(URL.createObjectURL(latestFile.originFileObj));
    } else {
      setPreviewImage(null);
    }
  };

  // Handle image upload button click
  const handleUploadImages = async () => {
    if (!fileList.length) {
      return;
    }
    setUploading(true);
    const formData = new FormData();

    // Append all files to the FormData object
    fileList.forEach((file) => {
      formData.append("SalonImages", file.originFileObj);
    });
    dispatch(actPostCreateImages(salonDetail?.id, formData))
      .then((res) => {
        setFileList([])
        message.success("Đã thêm ảnh thành công!!!");
      })
      .catch((err) => {
        message.error("Có lỗi xảy ra khi thêm ảnh!");
      })
      .finally((err) => {
        setUploading(false);
      });
  };

  return (
    <div className={styles["dashboard-container"]}>
      <div className="flex flex-col md:flex-row items-center justify-around min-h-screen bg-[#ece8de] p-4">
        <div className="w-full md:w-3/12 h-96 md:h-4/5 bg-[#ece8de] p-4 rounded-lg shadow-lg mb-4 md:mb-0">
          <Upload
            listType="picture"
            fileList={fileList}
            onChange={handleUploadChange}
            beforeUpload={(file) => {
              // Prevent the default upload behavior
              return false;
            }}
            multiple
            showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
          >
            <Button icon={<UploadOutlined />}>Hình ảnh tiệm của bạn</Button>
          </Upload>
          {/* Upload Button */}
          <Button
            type="primary"
            onClick={handleUploadImages}
            disabled={fileList.length === 0 || uploading}
            loading={uploading}
            className="mt-4"
          >
            {uploading ? "Đang tải..." : "Tải hình ảnh lên"}
          </Button>
        </div>
        <Spin spinning={loading}>
          <div className="w-full md:w-9/12 h-auto md:h-4/5 bg-[#ece8de] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 rounded-lg shadow-lg">
            {salonImages.length > 0 ? (
              salonImages.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-48 md:h-auto"
                >
                  <Image
                    src={image.img}
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
