import Styles from "../../css/Card.module.css";
import React, { useState } from "react";
import { useSpring, animated } from "react-spring";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import GradualSpacing from "../magicui/gradual-spacing";

function Card({ title, imagen }) {
  const [show, setShown] = useState(false);
  const navigate = useNavigate();
  const props3 = useSpring({
    opacity: 1,
    transform: show ? "scale(1.03)" : "scale(1)",
    boxShadow: show
      ? "0 20px 25px rgb(0 0 0 / 25%)"
      : "0 2px 10px rgb(0 0 0 / 8%)",
  });
  return (
    <animated.div
      className={Styles.card}
      style={props3}
      onMouseEnter={() => setShown(true)}
      onMouseLeave={() => setShown(false)}
    >
      <img src={imagen} alt="" />
      {/* <GradualSpacing
        className="font-display text-center text-2xl font-bold tracking-[-0.1em]  text-black dark:text-white md:text-7xl md:leading-[5rem]"
        text={title}
      /> */}
      {/* <h2>{title}</h2> */}
      {/* <p>
        Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
        nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat
        volutpat.
      </p> */}
      <div className={Styles.btnn}>
        <Button title={title} text="Tìm kiếm" />

        {/* <Button text="Code" /> */}
      </div>
    </animated.div>
  );
}

export default Card;
