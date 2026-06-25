import { motion } from "framer-motion";

interface Props {
  items: string[];
  speed?: number;
  direction?: "left" | "right";
  color?: string;
}

const MarqueeBlock = ({ items, speed = 30, direction = "left", color }: Props) => {
  if (!items?.length) return null;
  const dist = direction === "left" ? -1920 : 1920;
  return (
    <div className="w-full overflow-hidden bg-primary/5 py-4 border-y border-primary/10 rounded-2xl">
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{ x: [0, dist] }}
        transition={{ x: { repeat: Infinity, repeatType: "loop", duration: speed, ease: "linear" } }}
      >
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <span key={i} className="text-sm font-mono flex items-center gap-8" style={color ? { color } : undefined}>
            {item}
            <span className="text-primary">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default MarqueeBlock;