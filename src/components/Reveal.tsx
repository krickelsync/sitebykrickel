import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "scale" | "fade";

interface RevealProps {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  amount?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  as?: "div" | "section" | "article" | "li" | "span";
}

const offsets: Record<Direction, { x?: number; y?: number; scale?: number }> = {
  up: { y: 40 },
  down: { y: -40 },
  left: { x: 40 },
  right: { x: -40 },
  scale: { scale: 0.92 },
  fade: {},
};

const Reveal = ({
  children,
  direction = "up",
  delay = 0,
  amount = 0.2,
  duration = 0.7,
  className,
  once = true,
  as = "div",
}: RevealProps) => {
  const reduce = useReducedMotion();
  const off = offsets[direction];

  const variants: Variants = {
    hidden: { opacity: 1, x: 0, y: 0, scale: 1 },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: { duration: 0.01 },
    },
  };

  const MotionTag = motion[as] as typeof motion.div;

  return (
    <MotionTag
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      className={className}
    >
      {children}
    </MotionTag>
  );
};

export default Reveal;