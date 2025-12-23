import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";

interface ScrollVelocityProps {
  text1?: string;
  text2?: string;
}

const ScrollVelocity = ({ 
  text1 = "TRUSTED BY 1000+ STORES ✦ TRUSTED BY 1000+ STORES ✦ ", 
  text2 = "PRICE CAN CHANGE ANYTIME! ✦ PRICE CAN CHANGE ANYTIME! ✦ " 
}: ScrollVelocityProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const x1 = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["-50%", "0%"]);

  const springX1 = useSpring(x1, { stiffness: 100, damping: 30 });
  const springX2 = useSpring(x2, { stiffness: 100, damping: 30 });

  const repeatedText1 = text1.repeat(6);
  const repeatedText2 = text2.repeat(6);

  return (
    <div ref={containerRef} className="py-8 md:py-12 overflow-hidden bg-background">
      <motion.div 
        style={{ x: springX1 }}
        className="whitespace-nowrap text-4xl md:text-6xl lg:text-7xl font-display font-bold text-foreground/20 uppercase tracking-tight mb-4"
      >
        {repeatedText1}
      </motion.div>
      <motion.div 
        style={{ x: springX2 }}
        className="whitespace-nowrap text-4xl md:text-6xl lg:text-7xl font-display font-bold text-foreground/20 uppercase tracking-tight"
      >
        {repeatedText2}
      </motion.div>
    </div>
  );
};

export default ScrollVelocity;
