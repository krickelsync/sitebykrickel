import { spacing } from "@/components/ui/typography";
import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform, useMotionValue, useVelocity, useAnimationFrame } from "framer-motion";
import { wrap } from "@popmotion/popcorn";

function Row({ text, baseVelocity, className, color }: { text: string; baseVelocity: number; className?: string; color?: string }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);
  const directionFactor = useRef<number>(1);

  useAnimationFrame((_t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    if (velocityFactor.get() < 0) directionFactor.current = -1;
    else if (velocityFactor.get() > 0) directionFactor.current = 1;
    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="overflow-hidden whitespace-nowrap flex flex-nowrap">
      <motion.div
        className={`flex whitespace-nowrap flex-nowrap font-display text-4xl md:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight ${className ?? ""}`}
        style={{ x, ...(color ? { color } : {}) }}
      >
        <span className="mr-8">{text}</span>
        <span className="mr-8">{text}</span>
        <span className="mr-8">{text}</span>
        <span className="mr-8">{text}</span>
      </motion.div>
    </div>
  );
}

interface Props {
  rows: { text: string; velocity?: number; color?: string }[];
}

const VelocityTextBlock = ({ rows }: Props) => {
  if (!rows?.length) return null;
  return (
    <section
      className={`${spacing.sectionY} overflow-hidden relative left-1/2 right-1/2 -mx-[50vw] w-screen`}
    >
      {rows.map((r, i) => (
        <Row key={i} text={r.text} baseVelocity={r.velocity ?? (i % 2 === 0 ? -2 : 2)} color={r.color} className={r.color ? undefined : "text-foreground/20"} />
      ))}
    </section>
  );
};

export default VelocityTextBlock;