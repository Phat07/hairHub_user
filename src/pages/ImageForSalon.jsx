import React, { useEffect, useState } from "react";
import styles from "../css/imagesForSalon.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  actDeleteImagesForSalon,
  actGetSalonInformationByOwnerId,
  actGetSalonInformationByOwnerIdForImages,
  actPostCreateImages,
} from "@/store/salonInformation/action";
import {
  Button,
  Image,
  message,
  Pagination,
  Spin,
  Upload,
  Popconfirm,
} from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useSpring, animated } from "react-spring";
import { useParams } from "react-router-dom";

function ImageForSalon(props) {
  const { id } = useParams();

  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingDelete, setUploadingDelete] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const pageSize = 6; // Page size

  const springProps = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { tension: 170, friction: 14 },
  });

  const ownerId = useSelector((state) => state.ACCOUNT.idOwner);

  const salonDetail = useSelector(
    (state) => state.SALONINFORMATION.getSalonByOwnerId
  );
  const salonImages = useSelector(
    (state) => state.SALONINFORMATION.getSalonByOwnerIdForImages
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (ownerId) {
      dispatch(actGetSalonInformationByOwnerId(ownerId));
    }
  }, [ownerId]);

  useEffect(() => {
    if (id) {
      setLoading(true);
      dispatch(
        actGetSalonInformationByOwnerIdForImages(id, currentPage, pageSize)
      )
        .then((res) => {
          setLoading(false);
        })
        .catch((err) => {
          // handle error if needed
        })
        .finally((err) => {
          setLoading(false);
        });
    }
  }, [id, currentPage]);

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
    dispatch(actPostCreateImages(id, formData, 1, pageSize))
      .then((res) => {
        setFileList([]);
        message.success("Đã thêm ảnh thành công!!!");
      })
      .catch((err) => {
        message.error("Có lỗi xảy ra khi thêm ảnh!");
      })
      .finally((err) => {
        setUploading(false);
      });
  };

  // Handle image deletion
  const handleDeleteImage = (imageId) => {
    let data= {
      imagesId:[imageId]
    }
    setUploadingDelete(true);
    dispatch(actDeleteImagesForSalon(id, data, 1, pageSize))
      .then((res) => {
        message.success("Đã xóa ảnh thành công!!!");
      })
      .catch((err) => {
        message.error("Có lỗi xảy ra khi xóa ảnh!!!");
      })
      .finally((err) => {
        setUploadingDelete(false);
      });
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className={styles["dashboard-container"]}>
      <div className="flex flex-col md:flex-row items-center justify-around min-h-screen bg-[#ece8de] p-4">
        <div className="w-full md:w-4/12 h-96 md:h-4/5 bg-[#ece8de] p-4 rounded-lg shadow-lg mb-4 md:mb-0">
          <Upload
            listType="picture"
            fileList={fileList}
            onChange={handleUploadChange}
            beforeUpload={(file) => {
              return false;
            }}
            multiple
            showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
          >
            <Button icon={<UploadOutlined />}>Hình ảnh tiệm của bạn</Button>
          </Upload>
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
        <Spin className="custom-spin" spinning={loading}>
          <div className="w-full md:w-8/12 h-auto md:h-4/5 bg-[#ece8de] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 rounded-lg shadow-lg mx-auto">
            {salonImages.items?.length > 0 ? (
              salonImages.items?.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative w-full"
                >
                  <div className="w-full h-full">
                    <Image
                      src={image.salonImages[0]?.img}
                      alt={`Salon Image ${index}`}
                      className="w-full h-full object-cover rounded-lg"
                      style={{
                        aspectRatio: "16/9", // Giữ tỉ lệ ảnh
                        maxHeight: "200px", // Giới hạn chiều cao
                      }}
                    />
                  </div>
                  {image.salonImages[0]?.id && (
                    <Popconfirm
                      title="Bạn có chắc muốn xóa ảnh này?"
                      onConfirm={() =>
                        handleDeleteImage(image.salonImages[0]?.id)
                      }
                    >
                      <Button
                        className="absolute top-2 right-2"
                        type="primary"
                        danger
                        loading={uploadingDelete}
                        shape="circle"
                        icon={<DeleteOutlined />}
                      />
                    </Popconfirm>
                  )}
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
            <Pagination
              className="col-span-full mx-auto mt-4" // Thêm khoảng cách bên dưới
              current={currentPage}
              pageSize={pageSize}
              total={salonImages?.total || 0}
              onChange={handlePageChange}
            />
          </div>
        </Spin>
      </div>
    </div>
  );
}

export default ImageForSalon;
