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
  
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 300,
  });
  
  const velocityFactor = useTransform(smoothVelocity, [-1000, 0, 1000], [-15, 0, 15], {
    clamp: false,
  });

  const x = useTransform(baseX, (v) => `${wrap(-25, -50, v)}%`);

  const directionFactor = useRef<number>(direction);

  useAnimationFrame((t, delta) => {
    const velocity = velocityFactor.get();
    
    if (velocity < 0) {
      directionFactor.current = -1;
    } else if (velocity > 0) {
      directionFactor.current = 1;
    }
    
    const moveBy = direction * velocity * (delta / 1000);
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="w-full overflow-hidden whitespace-nowrap">
      <motion.div
        className={`inline-block whitespace-nowrap font-syne font-bold uppercase text-lg md:text-xl tracking-wide ${className}`}
        style={{ 
          x, 
          willChange: "transform",
          transform: "translateZ(0)",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

const VelocityText = () => {
  const row1Content = (
    <>
      {Array(6).fill(null).map((_, i) => (
        <span key={i}>
          <span className="text-foreground">TRUSTED BY 1000+ STORES</span>
          <span className="text-primary mx-3">✦</span>
        </span>
      ))}
    </>
  );

  const row2Content = (
    <>
      {Array(6).fill(null).map((_, i) => (
        <span key={i}>
          <span className="text-primary glow-text">PRICE CAN CHANGE ANYTIME!</span>
          <span className="text-muted-foreground mx-3">✦</span>
        </span>
      ))}
    </>
  );

  return (
    <div className="w-[100vw] relative left-[50%] translate-x-[-50%] max-w-none overflow-hidden mb-6 px-0 mx-0">
      {/* Row 1 - Pure white text */}
      <VelocityRow direction={1} className="leading-tight">
        {row1Content}
      </VelocityRow>
      
      {/* Row 2 - Bright acid green text with glow */}
      <VelocityRow direction={-1} className="leading-tight">
        {row2Content}
      </VelocityRow>
    </div>
  );
};

export default VelocityText;
