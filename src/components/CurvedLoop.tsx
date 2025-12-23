import { motion } from "framer-motion";

interface CurvedLoopProps {
  text?: string;
}

const CurvedLoop = ({ 
  text = "NO ✦ MORE ✦ BORED ✦ THEMES ✦ " 
}: CurvedLoopProps) => {
  const repeatedText = text.repeat(8);

  return (
    <div className="relative w-full py-6 md:py-10 overflow-hidden bg-background">
      <motion.div
        animate={{ x: [0, -1000] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="whitespace-nowrap"
      >
        <svg
          viewBox="0 0 2000 200"
          className="w-[4000px] h-[100px] md:h-[150px]"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <path
              id="curvePath"
              d="M 0,150 Q 250,50 500,150 T 1000,150 T 1500,150 T 2000,150"
              fill="none"
            />
          </defs>
          <text
            fill="hsl(var(--foreground))"
            fontSize="48"
            fontFamily="Space Mono, monospace"
            letterSpacing="0.1em"
            className="uppercase font-black"
          >
            <textPath href="#curvePath" startOffset="0%">
              {repeatedText}
            </textPath>
          </text>
        </svg>
      </motion.div>
    </div>
  );
};

export default CurvedLoop;
