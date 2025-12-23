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
  children: string;
  baseVelocity: number;
  className?: string;
}

const VelocityRow = ({ children, baseVelocity, className }: VelocityRowProps) => {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  const x = useTransform(baseX, (v) => `${wrap(-25, -50, v)}%`);

  const directionFactor = useRef<number>(1);

  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();

    baseX.set(baseX.get() + moveBy);
  });

  // Repeat 4 times for seamless loop
  const repeatedContent = Array(4).fill(children).join(" ");

  return (
    <div className="overflow-hidden whitespace-nowrap flex">
      <motion.div
        className={`flex whitespace-nowrap font-syne font-bold uppercase text-2xl md:text-4xl tracking-wide ${className}`}
        style={{ x, willChange: "transform" }}
      >
        <span className="block mr-8">{repeatedContent}</span>
      </motion.div>
    </div>
  );
};

const VelocityText = () => {
  return (
    <div className="py-6 md:py-10 bg-background overflow-hidden">
      {/* Row 1 - White text moving left */}
      <VelocityRow baseVelocity={-3} className="text-foreground mb-4">
        TRUSTED BY 1000+ STORES ✦ TRUSTED BY 1000+ STORES ✦ TRUSTED BY 1000+ STORES ✦ TRUSTED BY 1000+ STORES ✦
      </VelocityRow>
      
      {/* Row 2 - Acid green text moving right */}
      <VelocityRow baseVelocity={3} className="text-[#CCFF00]">
        PRICE CAN CHANGE ANYTIME! ✦ PRICE CAN CHANGE ANYTIME! ✦ PRICE CAN CHANGE ANYTIME! ✦ PRICE CAN CHANGE ANYTIME! ✦
      </VelocityRow>
    </div>
  );
};

export default VelocityText;
