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

function VelocityRow({ children, baseVelocity, className }: VelocityRowProps) {
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

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);
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

  return (
    <div className="overflow-hidden whitespace-nowrap flex flex-nowrap">
      <motion.div
        className={`flex whitespace-nowrap flex-nowrap font-display text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight ${className}`}
        style={{ x }}
      >
        <span className="mr-8">{children}</span>
        <span className="mr-8">{children}</span>
        <span className="mr-8">{children}</span>
        <span className="mr-8">{children}</span>
      </motion.div>
    </div>
  );
}

const ProductVelocityText = () => {
  return (
    <section className={`${spacing.sectionY} overflow-hidden bg-background`}>
      <VelocityRow baseVelocity={-2} className="text-foreground/20">
        {"TRUSTED BY 500+ BRANDS ✦ STUDIO QUALITY RESULTS ✦ INSTANT GENERATION ✦ "}
      </VelocityRow>
      <VelocityRow
        baseVelocity={2}
        className="text-[#39FF14] [text-shadow:0_0_20px_rgba(57,255,20,0.5)]"
      >
        {"PRICE CAN CHANGE ANYTIME! ✦ LIMITED TIME OFFER ✦ DON'T MISS OUT ✦ "}
      </VelocityRow>
    </section>
  );
};

export default ProductVelocityText;
