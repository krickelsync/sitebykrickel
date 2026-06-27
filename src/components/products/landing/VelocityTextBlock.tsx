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
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const directionFactor = useRef<number>(1);
  const repeatedText = Array.from({ length: 8 }, () => text);

  useAnimationFrame((_t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    if (velocityFactor.get() < 0) directionFactor.current = -1;
    else if (velocityFactor.get() > 0) directionFactor.current = 1;
    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="w-screen max-w-[100vw] overflow-hidden whitespace-nowrap">
      <motion.div
        className={`flex w-max min-w-[200vw] whitespace-nowrap font-display text-4xl md:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight will-change-transform ${className ?? ""}`}
        style={{ x, ...(color ? { color } : {}) }}
      >
        {[0, 1].map((group) => (
          <div key={group} className="flex min-w-full shrink-0" aria-hidden={group === 1}>
            {repeatedText.map((item, index) => (
              <span key={`${group}-${index}`} className="shrink-0 pr-6 md:pr-10">
                {item}
              </span>
            ))}
          </div>
        ))}
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
      className={`${spacing.sectionY} relative w-screen max-w-[100vw] overflow-hidden`}
      style={{ marginLeft: "calc(50% - 50vw)", marginRight: "calc(50% - 50vw)" }}
    >
      {rows.map((r, i) => (
        <Row key={i} text={r.text} baseVelocity={r.velocity ?? (i % 2 === 0 ? -2 : 2)} color={r.color} className={r.color ? undefined : "text-foreground/20"} />
      ))}
    </section>
  );
};

export default VelocityTextBlock;