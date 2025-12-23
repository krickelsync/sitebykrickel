import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
} from "framer-motion";
import { wrap } from "@popmotion/popcorn";

interface VelocityRowProps {
  children: React.ReactNode;
  direction: 1 | -1;
  className?: string;
}

const VelocityRow = ({ children, direction, className }: VelocityRowProps) => {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  
  // Smooth the velocity so it decelerates naturally
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 300,
  });
  
  // Transform velocity to movement factor
  const velocityFactor = useTransform(smoothVelocity, [-1000, 0, 1000], [-15, 0, 15], {
    clamp: false,
  });

  const x = useTransform(baseX, (v) => `${wrap(-25, -50, v)}%`);

  const directionFactor = useRef<number>(direction);

  useAnimationFrame((t, delta) => {
    // ONLY move based on scroll velocity - no base movement
    const velocity = velocityFactor.get();
    
    // Update direction based on scroll direction
    if (velocity < 0) {
      directionFactor.current = -1;
    } else if (velocity > 0) {
      directionFactor.current = 1;
    }
    
    // Movement is purely from scroll velocity
    const moveBy = direction * velocity * (delta / 1000);
    
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="overflow-hidden whitespace-nowrap flex">
      <motion.div
        className={`flex whitespace-nowrap font-syne font-bold uppercase text-2xl md:text-4xl tracking-wide ${className}`}
        style={{ 
          x, 
          willChange: "transform",
          transform: "translateZ(0)",
        }}
      >
        <span className="block mr-8">{children}</span>
      </motion.div>
    </div>
  );
};

const VelocityText = () => {
  // Text content with dimmed stars for contrast
  const row1Content = (
    <>
      {Array(4).fill(null).map((_, i) => (
        <span key={i}>
          <span className="text-white">TRUSTED BY 1000+ STORES</span>
          <span className="text-gray-500 mx-4">✦</span>
        </span>
      ))}
    </>
  );

  const row2Content = (
    <>
      {Array(4).fill(null).map((_, i) => (
        <span key={i}>
          <span className="text-[#CCFF00]">PRICE CAN CHANGE ANYTIME!</span>
          <span className="text-gray-500 mx-4">✦</span>
        </span>
      ))}
    </>
  );

  return (
    <div className="py-6 md:py-10 bg-background overflow-hidden">
      {/* Row 1 - Pure white text */}
      <VelocityRow direction={1} className="mb-4">
        {row1Content}
      </VelocityRow>
      
      {/* Row 2 - Bright acid green text */}
      <VelocityRow direction={-1}>
        {row2Content}
      </VelocityRow>
    </div>
  );
};

export default VelocityText;
