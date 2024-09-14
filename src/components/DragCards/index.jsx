import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

export const DragCards = ({ data }) => {
  return (
    <section className="relative grid min-h-[60vh] w-full place-content-center overflow-hidden bg-neutral-950">
      <Cards data={data} />
    </section>
  );
};

const getRandomSize = () => {
  const sizes = ["w-18 md:w-28", "w-20 md:w-36", "w-24 md:w-40"];
  return sizes[Math.floor(Math.random() * sizes.length)];
};

const Cards = ({ data }) => {
  const containerRef = useRef(null);

  return (
    <div className="absolute inset-0 z-10" ref={containerRef}>
      {data.map((item, index) => (
        <Card
          key={index}
          containerRef={containerRef}
          src={item.img}
          alt={item.alt}
          rotate={item.rotate}
          top={item.top}
          left={item.left}
          className={getRandomSize()} // Sử dụng kích thước ngẫu nhiên
          name={item.fullName}
        />
      ))}
    </div>
  );
};

const Card = ({
  containerRef,
  src,
  alt,
  top,
  left,
  rotate,
  className,
  name,
}) => {
  const [zIndex, setZIndex] = useState(0);

  const updateZIndex = () => {
    const els = document.querySelectorAll(".drag-elements");

    let maxZIndex = -Infinity;

    els.forEach((el) => {
      let zIndex = parseInt(
        window.getComputedStyle(el).getPropertyValue("z-index")
      );

      if (!isNaN(zIndex) && zIndex > maxZIndex) {
        maxZIndex = zIndex;
      }
    });

    setZIndex(maxZIndex + 1);
  };

  return (
    <motion.div
      layout
      onMouseDown={updateZIndex}
      style={{
        top,
        left,
        rotate,
        zIndex,
      }}
      className={twMerge(
        "drag-elements relative w-48 bg-neutral-200 p-2 pb-4 rounded-lg shadow-lg overflow-hidden",
        className
      )}
      drag
      dragConstraints={containerRef}
      dragElastic={0.65}
    >
      {/* Image */}
      <img className="w-full h-auto rounded-md" src={src} alt={alt} />

      {/* Overlay Title */}
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300">
        <h3 className="text-xl font-bold text-white">{name}</h3>
      </div>
    </motion.div>
  );
};
