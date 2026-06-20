import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

/**
 * Lightweight page transition.
 * - No full-screen background curtain (avoids the "blink").
 * - Just a thin top progress bar + subtle fade.
 * - Skipped on reduced-motion.
 */
const PageTransition = () => {
  const { pathname } = useLocation();
  const [show, setShow] = useState(false);
  const first = useRef(true);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (reduce) return;
    setShow(true);
    const t = setTimeout(() => setShow(false), 350);
    return () => clearTimeout(t);
  }, [pathname, reduce]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="page-transition-bar"
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.7, 0, 0.3, 1] }}
          style={{ transformOrigin: "left center" }}
          className="fixed top-0 left-0 right-0 h-[2px] z-[9998] pointer-events-none bg-primary"
          aria-hidden
        />
      )}
    </AnimatePresence>
  );
};

export default PageTransition;