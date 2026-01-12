import { motion } from "framer-motion";

const items = [
  "NO MORE EXPENSIVE PHOTOSHOOTS",
  "INSTANT RESULTS",
  "STUDIO QUALITY",
  "AI-POWERED",
  "SAVE 70% ON PRODUCTION",
  "CAMPAIGN-READY",
  "100+ VARIATIONS",
  "NO PHOTOGRAPHER NEEDED",
];

const ProductMarquee = () => {
  return (
    <div className="w-full overflow-hidden bg-primary/5 py-4 border-y border-primary/10">
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{
          x: [0, -1920],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 30,
            ease: "linear",
          },
        }}
      >
        {[...items, ...items, ...items, ...items].map((item, index) => (
          <span
            key={index}
            className="text-sm font-mono text-primary/80 flex items-center gap-8"
          >
            {item}
            <span className="text-primary">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default ProductMarquee;
