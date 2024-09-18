import { useMotionValue, motion, useSpring, useTransform } from "framer-motion";
import React, { useRef } from "react";
import { FiArrowRight } from "react-icons/fi";
import image1 from "../../assets/images/serviceImg2/1.png";

export const HoverImageLinks = ({ employees }) => {
  return (
    <section className="bg-[#E9E6D9] p-6 md:p-12">
      <div className="mx-auto max-w-5xl">
        {employees?.map((e) => {
          return (
            <Link
              key={e?.id} // Make sure to provide a unique key if possible
              heading={e?.fullName}
              subheading={e?.fullName}
              imgSrc={e?.img}
              href="#"
            />
          );
        })}
      </div>
    </section>
  );
};

// const Link = ({ heading, imgSrc, subheading, href }) => {
//   const ref = useRef(null);

//   const x = useMotionValue(0);
//   const y = useMotionValue(0);

//   const mouseXSpring = useSpring(x);
//   const mouseYSpring = useSpring(y);

//   const top = useTransform(mouseYSpring, [0.5, -0.5], ["40%", "60%"]);
//   const left = useTransform(mouseXSpring, [0.5, -0.5], ["60%", "70%"]);

//   const handleMouseMove = (e) => {
//     const rect = ref.current.getBoundingClientRect();

//     const width = rect.width;
//     const height = rect.height;

//     const mouseX = e.clientX - rect.left;
//     const mouseY = e.clientY - rect.top;

//     const xPct = mouseX / width - 0.5;
//     const yPct = mouseY / height - 0.5;

//     x.set(xPct);
//     y.set(yPct);
//   };

//   return (
//     <motion.a
//       href={href}
//       ref={ref}
//       onMouseMove={handleMouseMove}
//       initial="initial"
//       whileHover="whileHover"
//       className="group relative flex items-center justify-between border-b-2 border-neutral-700 py-4 transition-colors duration-500 hover:border-neutral-50 md:py-8 no-underline hover:no-underline"
//     >
//       <div>
//         <motion.span
//           variants={{
//             initial: { x: 0 },
//             whileHover: { x: -16 },
//           }}
//           transition={{
//             type: "spring",
//             staggerChildren: 0.075,
//             delayChildren: 0.25,
//           }}
//           className="relative z-10 mt-2 block text-2xl text-neutral-500 transition-colors duration-500 group-hover:text-neutral-50 no-underline hover:no-underline whitespace-nowrap overflow-hidden text-ellipsis"
//         >
//           {heading.split("").map((l, i) => (
//             <motion.span
//               variants={{
//                 initial: { x: 0 },
//                 whileHover: { x: 16 },
//               }}
//               transition={{ type: "spring" }}
//               className="inline-block"
//               key={i}
//             >
//               {l}
//             </motion.span>
//           ))}
//         </motion.span>
//       </div>

//       <motion.img
//         style={{
//           top,
//           left,
//           translateX: "-50%",
//           translateY: "-50%",
//         }}
//         variants={{
//           initial: { scale: 0, rotate: "-12.5deg" },
//           whileHover: { scale: 1, rotate: "12.5deg" },
//         }}
//         transition={{ type: "spring" }}
//         src={imgSrc}
//         className="absolute z-0 h-24 w-32 rounded-lg object-cover md:h-48 md:w-64"
//         alt={`Image representing a link for ${heading}`}
//       />

//       <motion.div
//         variants={{
//           initial: {
//             x: "25%",
//             opacity: 0,
//           },
//           whileHover: {
//             x: "0%",
//             opacity: 1,
//           },
//         }}
//         transition={{ type: "spring" }}
//         className="relative z-10 p-4"
//       >
//         <FiArrowRight className="text-5xl text-neutral-50" />
//       </motion.div>
//     </motion.a>
//   );
// };

const Link = ({ heading, imgSrc, subheading, href }) => {
    const ref = useRef(null);
  
    const x = useMotionValue(0);
    const y = useMotionValue(0);
  
    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);
  
    const top = useTransform(mouseYSpring, [0.5, -0.5], ["40%", "60%"]);
    const left = useTransform(mouseXSpring, [0.5, -0.5], ["60%", "70%"]);
  
    const handleMouseMove = (e) => {
      const rect = ref.current.getBoundingClientRect();
  
      const width = rect.width;
      const height = rect.height;
  
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
  
      const xPct = mouseX / width - 0.5;
      const yPct = mouseY / height - 0.5;
  
      x.set(xPct);
      y.set(yPct);
    };
  
    const [isTouched, setIsTouched] = React.useState(false);
  
    return (
      <motion.a
        href={href}
        ref={ref}
        onMouseMove={handleMouseMove}
        onTouchStart={() => setIsTouched(true)}
        onTouchEnd={() => setIsTouched(false)}
        initial="initial"
        animate={isTouched ? "whileHover" : "initial"}
        whileHover="whileHover"
        className="group relative flex items-center justify-between border-b-2 border-neutral-700 py-4 transition-colors duration-500 hover:border-neutral-50 md:py-8 no-underline hover:no-underline"
      >
        <div className="flex flex-wrap">
          <motion.span
            variants={{
              initial: { x: 0 },
              whileHover: { x: -16 },
            }}
            transition={{
              type: "spring",
              staggerChildren: 0.075,
              delayChildren: 0.25,
            }}
             className="relative z-10 block text-2xl text-neutral-500 transition-colors duration-500 group-hover:text-neutral-50 no-underline hover:no-underline whitespace-normal break-words"
          >
            {heading.split("").map((l, i) => (
              <motion.span
                variants={{
                  initial: { x: 0 },
                  whileHover: { x: 16 },
                }}
                transition={{ type: "spring" }}
                className="inline-block"
                key={i}
              >
                {l}
              </motion.span>
            ))}
          </motion.span>
        </div>
  
        <motion.img
          style={{
            top,
            left,
            translateX: "-50%",
            translateY: "-50%",
          }}
          variants={{
            initial: { scale: 0, rotate: "-12.5deg" },
            whileHover: { scale: 1, rotate: "12.5deg" },
          }}
          transition={{ type: "spring" }}
          src={imgSrc}
          className="absolute z-0 h-24 w-32 rounded-lg object-cover md:h-48 md:w-64"
          alt={`Image representing a link for ${heading}`}
        />
  
        {/* <motion.div
          variants={{
            initial: {
              x: "25%",
              opacity: 0,
            },
            whileHover: {
              x: "0%",
              opacity: 1,
            },
          }}
          transition={{ type: "spring" }}
          className="relative z-10 p-4"
        >
          <FiArrowRight className="text-5xl text-neutral-50" />
        </motion.div> */}
      </motion.a>
    );
  };
  