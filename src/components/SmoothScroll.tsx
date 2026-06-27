import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Inertial smooth scrolling for the whole page.
 * Disabled when the user prefers reduced motion.
 */
const SmoothScroll = () => {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const isTouch =
      window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;

    // Native mobile scroll is smoother and cheaper over animated/WebGL heroes.
    if (isTouch) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
      touchMultiplier: 1.2,
    } as ConstructorParameters<typeof Lenis>[0]);

    let raf = 0;
    const tick = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
};

export default SmoothScroll;