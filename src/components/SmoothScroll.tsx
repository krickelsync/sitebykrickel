import { useEffect, useState, type ReactNode } from "react";
import { ReactLenis } from "lenis/react";

/**
 * Inertial smooth scrolling via the official Lenis React wrapper
 * (darkroomengineering/lenis). No battery-based caps; decorative loops are
 * paused while the user scrolls so every battery level stays smooth.
 */
const SmoothScroll = ({ children }: { children?: ReactNode }) => {
  const [enabled, setEnabled] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const touch =
      window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;
    setIsTouch(touch);

    const conn = (navigator as any).connection;
    if (conn?.saveData) return;
    if (/(^| )(2g|slow-2g)/.test(conn?.effectiveType || "")) return;

    setEnabled(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let timer = 0;
    let ticking = false;

    const stop = () => {
      document.documentElement.classList.remove("is-scrolling");
    };

    const markScrolling = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(() => {
          document.documentElement.classList.add("is-scrolling");
          ticking = false;
        });
      }
      window.clearTimeout(timer);
      timer = window.setTimeout(stop, isTouch ? 180 : 140);
    };

    window.addEventListener("scroll", markScrolling, { passive: true });
    window.addEventListener("wheel", markScrolling, { passive: true });
    window.addEventListener("touchmove", markScrolling, { passive: true });

    return () => {
      window.clearTimeout(timer);
      stop();
      window.removeEventListener("scroll", markScrolling);
      window.removeEventListener("wheel", markScrolling);
      window.removeEventListener("touchmove", markScrolling);
    };
  }, [isTouch]);

  if (!enabled) return <>{children}</>;

  return (
    <ReactLenis
      root
      options={{
        duration: isTouch ? 0.62 : 0.95,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        lerp: isTouch ? 0.14 : 0.09,
        smoothWheel: true,
        syncTouch: false,
        touchMultiplier: 1,
      }}
    >
      {children}
    </ReactLenis>
  );
};

export default SmoothScroll;