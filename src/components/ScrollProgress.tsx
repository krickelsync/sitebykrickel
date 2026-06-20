import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Thin top progress bar that tracks vertical scroll across the page.
 * Purely decorative — pointer-events disabled, hidden from a11y tree.
 */
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 20,
    mass: 0.3,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX, transformOrigin: "0% 50%" }}
      className="fixed top-0 left-0 right-0 h-[2px] bg-primary z-[60] pointer-events-none shadow-[0_0_10px_hsl(var(--primary)/0.6)]"
    />
  );
};

export default ScrollProgress;