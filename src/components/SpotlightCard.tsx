import { useRef, useState, MouseEvent } from "react";
import { motion } from "framer-motion";

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  spotlightSize?: number;
  spotlightOpacity?: number;
}

const SpotlightCard = ({
  children,
  className = "",
  spotlightColor = "hsl(var(--primary))",
  spotlightSize = 300,
  spotlightOpacity = 0.15,
}: SpotlightCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden ${className}`}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Spotlight effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: isHovered
            ? `radial-gradient(${spotlightSize}px circle at ${mousePosition.x}px ${mousePosition.y}px, ${spotlightColor} / ${spotlightOpacity}, transparent 100%)`
            : "transparent",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />

      {/* Inner highlight line at top */}
      <div 
        className="absolute top-0 left-0 right-0 h-px z-20 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent, hsl(0 0% 100% / 0.15), transparent)"
        }}
      />

      {/* Content */}
      <div className="relative z-0">
        {children}
      </div>
    </motion.div>
  );
};

export default SpotlightCard;
