import React, { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
// import { FiMousePointer } from "react-icons/fi";

const TitleCard = ({ img }) => {
  return (
    // <div className="grid w-full place-content-center bg-gradient-to-br from-indigo-500 to-violet-500 px-4 py-12 text-slate-900">
    //   <TiltCard />
    // </div>
    <div>
      <TiltCard img={img} />
    </div>
  );
};

const ROTATION_RANGE = 32.5;
const HALF_ROTATION_RANGE = 32.5 / 2;

const TiltCard = ({ img }) => {
  const ref = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x);
  const ySpring = useSpring(y);

  const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

  const handleMouseMove = (e) => {
    if (!ref.current) return [0, 0];

    const rect = ref.current.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = (e.clientX - rect.left) * ROTATION_RANGE;
    const mouseY = (e.clientY - rect.top) * ROTATION_RANGE;

    const rX = (mouseY / height - HALF_ROTATION_RANGE) * -1;
    const rY = mouseX / width - HALF_ROTATION_RANGE;

    x.set(rX);
    y.set(rY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        // width: '95%',  
        // height: '95%', 
        transformStyle: "preserve-3d",
        transform,
      }}
      className="relative w-full max-w-xs h-64 md:max-w-sm md:h-80 lg:max-w-4xl lg:h-96 rounded-xl bg-gradient-to-br from-[#E9E6D9] to-[#f2caab]"
    >
      <div
        style={{
          transform: "translateZ(75px)",
          transformStyle: "preserve-3d",
        }}
        className="absolute inset-4 flex items-center justify-center rounded-xl bg-white shadow-lg"
      >
        <img
        className="w-full h-auto object-contain"
          src={img} // Đường dẫn đến ảnh của bạn
          alt={img}
          style={{
            width: "95%", // Đặt width là 100% để chiếm toàn bộ chiều rộng của phần tử cha
            height: "95%", // Đặt height là 100% để chiếm toàn bộ chiều cao của phần tử cha
            objectFit: "cover",
            transform: "translateZ(100px)",
          }}
        />
      </div>
    </motion.div>
    // <motion.div
    //   ref={ref}
    //   onMouseMove={handleMouseMove}
    //   onMouseLeave={handleMouseLeave}
    //   style={{
    //     transformStyle: "preserve-3d",
    //     transform,
    //   }}
    //   className="relative w-full max-w-3xs h-64 md:max-w-sm md:h-80 lg:max-w-xl lg:h-96 rounded-xl bg-gradient-to-br from-indigo-300 to-violet-300"
    // >
    //   <div
    //     style={{
    //       transform: "translateZ(75px)",
    //       transformStyle: "preserve-3d",
    //     }}
    //     className="absolute inset-4 flex items-center justify-center rounded-xl bg-white shadow-lg"
    //   >
    //     <img
    //       src={img} // Đường dẫn đến ảnh của bạn
    //       alt="Hover me"
    //       className="object-cover"
    //       style={{
    //         width: "95%",
    //         height: "95%",
    //         transform: "translateZ(100px)",
    //       }}
    //     />
    //   </div>
    // </motion.div>
  );
};

export default TitleCard;
