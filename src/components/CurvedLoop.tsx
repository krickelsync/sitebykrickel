import { motion } from "framer-motion";

interface CurvedLoopProps {
  text?: string;
}

const CurvedLoop = ({ 
  text = "NO ✦ MORE ✦ BORED ✦ THEMES ✦ " 
}: CurvedLoopProps) => {
  const repeatedText = text.repeat(6);

  return (
    <div className="relative w-full py-12 md:py-20 overflow-hidden bg-background">
      <div className="relative w-full overflow-hidden">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap"
        >
          <svg
            viewBox="0 0 2400 200"
            className="w-[2400px] h-[120px] md:h-[180px] flex-shrink-0"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <path
                id="curvePath1"
                d="M 0,160 Q 300,40 600,160 T 1200,160 T 1800,160 T 2400,160"
                fill="none"
              />
            </defs>
            <text
              fill="hsl(var(--foreground))"
              fontSize="72"
              fontWeight="900"
              fontFamily="Inter, sans-serif"
              letterSpacing="0.05em"
              className="uppercase"
            >
              <textPath href="#curvePath1" startOffset="0%">
                {repeatedText}
              </textPath>
            </text>
          </svg>
          <svg
            viewBox="0 0 2400 200"
            className="w-[2400px] h-[120px] md:h-[180px] flex-shrink-0"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <path
                id="curvePath2"
                d="M 0,160 Q 300,40 600,160 T 1200,160 T 1800,160 T 2400,160"
                fill="none"
              />
            </defs>
            <text
              fill="hsl(var(--foreground))"
              fontSize="72"
              fontWeight="900"
              fontFamily="Inter, sans-serif"
              letterSpacing="0.05em"
              className="uppercase"
            >
              <textPath href="#curvePath2" startOffset="0%">
                {repeatedText}
              </textPath>
            </text>
          </svg>
        </motion.div>
      </div>
    </div>
  );
};

export default CurvedLoop;
