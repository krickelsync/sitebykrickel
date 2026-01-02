import { motion } from "framer-motion";
import { useState } from "react";

interface AnimatedTextProps {
  text: string;
  className?: string;
  variant?: "stagger" | "wave" | "glitch";
  glowOnHover?: boolean;
}

const AnimatedText = ({ text, className = "", variant = "stagger", glowOnHover = false }: AnimatedTextProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const letters = text.split("");
  
  const containerVariants = {
    hover: {
      transition: {
        staggerChildren: 0.03,
      },
    },
  };
  
  const letterVariants = {
    initial: {
      y: 0,
      scale: 1,
    },
    hover: {
      y: [-2, 2, -1, 0],
      scale: [1, 1.1, 1.05, 1],
      transition: {
        duration: 0.4,
        ease: "easeOut" as const,
      },
    },
  };

  const glitchVariants = {
    initial: {
      x: 0,
      y: 0,
    },
    hover: {
      x: [0, -2, 2, -1, 1, 0],
      y: [0, 1, -1, 2, -2, 0],
      transition: {
        duration: 0.3,
        ease: "easeInOut" as const,
      },
    },
  };

  const waveVariants = {
    initial: {
      y: 0,
      rotate: 0,
    },
    hover: {
      y: [0, -8, 0],
      rotate: [0, -5, 5, 0],
      transition: {
        duration: 0.5,
        ease: "easeInOut" as const,
      },
    },
  };

  const getVariant = () => {
    switch (variant) {
      case "glitch":
        return glitchVariants;
      case "wave":
        return waveVariants;
      default:
        return letterVariants;
    }
  };

  return (
    <motion.span
      className={`inline-flex ${className} ${glowOnHover && isHovered ? "glow-text" : ""}`}
      variants={containerVariants}
      initial="initial"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{ cursor: "default" }}
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          variants={getVariant()}
          className="inline-block"
          style={{ 
            whiteSpace: letter === " " ? "pre" : "normal",
            display: "inline-block",
            minWidth: letter === " " ? "0.25em" : "auto",
          }}
        >
          {letter}
        </motion.span>
      ))}
    </motion.span>
  );
};

export default AnimatedText;
