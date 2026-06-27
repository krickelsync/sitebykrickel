import { useEffect } from "react";
import { useMotionValue, useSpring, useReducedMotion } from "framer-motion";

/**
 * Tracks normalized mouse offset from the center of `target` (or window).
 * Returns spring-smoothed motion values in range [-1, 1] you can multiply
 * by a depth value to drive parallax layers.
 */
export const useMouseParallax = (target?: React.RefObject<HTMLElement>) => {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConf = { stiffness: 80, damping: 18, mass: 0.6 };
  const sx = useSpring(x, springConf);
  const sy = useSpring(y, springConf);

  useEffect(() => {
    if (reduce) return;
    // Skip on touch / coarse pointer devices
    if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) return;

    const handle = (e: MouseEvent) => {
      const el = target?.current;
      const rect = el ? el.getBoundingClientRect() : { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      x.set((e.clientX - cx) / (rect.width / 2));
      y.set((e.clientY - cy) / (rect.height / 2));
    };
    window.addEventListener("mousemove", handle, { passive: true });
    return () => window.removeEventListener("mousemove", handle);
  }, [target, reduce, x, y]);

  return { x: sx, y: sy };
};