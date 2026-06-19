import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const KATAKANA = "アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789";

const PageTransition = () => {
  const { pathname } = useLocation();
  const [show, setShow] = useState(false);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setShow(true);
    const t = setTimeout(() => setShow(false), 500);
    return () => clearTimeout(t);
  }, [pathname]);

  const cols = 18;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="page-transition"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[9998] pointer-events-none bg-background overflow-hidden"
          aria-hidden
        >
          <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
            {Array.from({ length: cols }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: "-100%" }}
                animate={{ y: "100%" }}
                transition={{ duration: 0.5, delay: i * 0.015, ease: [0.7, 0, 0.3, 1] }}
                className="font-mono text-primary text-xs leading-tight flex flex-col items-center opacity-80"
              >
                {Array.from({ length: 24 }).map((__, j) => (
                  <span key={j} style={{ opacity: 1 - j * 0.04 }}>
                    {KATAKANA[Math.floor(Math.random() * KATAKANA.length)]}
                  </span>
                ))}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageTransition;