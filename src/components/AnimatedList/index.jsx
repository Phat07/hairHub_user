import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Modal } from 'antd';
import 'antd/dist/reset.css'; // Import Ant Design styles

const AnimatedList = ({ items }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalImage, setModalImage] = useState('');

  const showModal = (imageSrc) => {
    setModalImage(imageSrc);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setModalImage('');
  };

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <motion.div
          key={item.id}
          className="relative flex items-center p-4 border-b-2 border-neutral-700 transition-colors duration-500 hover:border-neutral-50 cursor-pointer"
          initial={{ opacity: 1, scale: 1 }}
          whileHover={{ opacity: 1.2, scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <motion.img
            src={item.img}
            alt={`Image for ${item.fullName}`}
            className="w-12 h-12 rounded-full object-cover mr-4"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.2 }}
            transition={{ type: 'spring', stiffness: 300 }}
            onClick={() => showModal(item.img)} // Show modal on image click
          />
          <div>
            <h3 className="text-xl font-bold text-neutral-500 group-hover:text-neutral-50">
              {item.fullName}
            </h3>
          </div>
        </motion.div>
      ))}

      {/* Modal for preview */}
      <Modal
        visible={isModalVisible}
        footer={null}
        onCancel={handleCancel}
        width="90%" // Increase the width of the modal
        bodyStyle={{ padding: 0 }}
      >
        <img
          src={modalImage}
          alt="Preview"
          className="w-full h-auto" // Ensure the image scales correctly
          style={{ maxHeight: '80vh', objectFit: 'contain' }} // Ensure the image fits within the modal without distortion
        />
      </Modal>
    </div>
  );
};

export default AnimatedList;
