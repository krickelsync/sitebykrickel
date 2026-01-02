import { motion } from "framer-motion";
import { useMagneticEffect } from "@/hooks/useMagneticEffect";
import { ReactNode } from "react";

interface MagneticTextProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  radius?: number;
  repel?: boolean;
  as?: "span" | "div" | "h1" | "h2" | "h3" | "p";
}

const MagneticText = ({
  children,
  className = "",
  strength = 0.4,
  radius = 120,
  repel = false,
  as = "span",
}: MagneticTextProps) => {
  const { ref, position, handlers } = useMagneticEffect({
    strength,
    radius,
    repel,
  });

  const Component = motion[as];

  return (
    <Component
      ref={ref as any}
      className={`inline-block cursor-default ${className}`}
      animate={{
        x: position.x,
        y: position.y,
      }}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 15,
        mass: 0.1,
      }}
      {...handlers}
    >
      {children}
    </Component>
  );
};

export default MagneticText;
