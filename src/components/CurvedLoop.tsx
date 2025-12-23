import { motion } from "framer-motion";

interface CurvedLoopProps {
  text?: string;
}

const CurvedLoop = ({ 
  text = "PREMIUM SHOPIFY THEMES ✦ HIGH CONVERSION ✦ READY TO SELL ✦ " 
}: CurvedLoopProps) => {
  const repeatedText = text.repeat(3);
  const radius = 200;
  const fontSize = 14;

  return (
    <div className="relative w-full py-16 md:py-24 overflow-hidden bg-background flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="relative"
        style={{ width: radius * 2 + 40, height: radius * 2 + 40 }}
      >
        <svg
          viewBox={`0 0 ${(radius + 20) * 2} ${(radius + 20) * 2}`}
          className="w-full h-full"
        >
          <defs>
            <path
              id="circlePath"
              d={`M ${radius + 20}, ${radius + 20} m -${radius}, 0 a ${radius},${radius} 0 1,1 ${radius * 2},0 a ${radius},${radius} 0 1,1 -${radius * 2},0`}
            />
          </defs>
          <text
            fill="hsl(var(--foreground) / 0.3)"
            fontSize={fontSize}
            fontFamily="Space Mono, monospace"
            letterSpacing="0.2em"
            className="uppercase font-bold"
          >
            <textPath href="#circlePath" startOffset="0%">
              {repeatedText}
            </textPath>
          </text>
        </svg>
      </motion.div>
    </div>
  );
};

export default CurvedLoop;
