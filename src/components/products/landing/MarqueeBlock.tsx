import { motion } from "framer-motion";

interface Props {
  items: string[];
  speed?: number;
  direction?: "left" | "right";
  color?: string;
}

const MarqueeBlock = ({ items, speed = 30, direction = "left", color }: Props) => {
  if (!items?.length) return null;
  const x = direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"];
  const loopItems = Array.from({ length: 6 }, () => items).flat();

  return (
    <div
      className="relative w-screen max-w-[100vw] overflow-hidden bg-primary/5 py-4 border-y border-primary/10"
      style={{ marginLeft: "calc(50% - 50vw)", marginRight: "calc(50% - 50vw)" }}
    >
      <motion.div
        className="flex w-max min-w-[200vw] whitespace-nowrap will-change-transform"
        animate={{ x }}
        transition={{ x: { repeat: Infinity, repeatType: "loop", duration: speed, ease: "linear" } }}
      >
        {[0, 1].map((group) => (
          <div key={group} className="flex min-w-full shrink-0 gap-8 pr-8" aria-hidden={group === 1}>
            {loopItems.map((item, i) => (
              <span key={`${group}-${i}`} className="text-sm font-mono flex shrink-0 items-center gap-8" style={color ? { color } : undefined}>
                {item}
                <span className="text-primary">✦</span>
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default MarqueeBlock;