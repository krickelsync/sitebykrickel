import { useEffect, useState, type ReactNode } from "react";
import { ReactLenis } from "lenis/react";

/**
 * Inertial smooth scrolling via the official Lenis React wrapper
 * (darkroomengineering/lenis). Disabled on reduced motion / save-data /
 * slow networks / low battery to keep the page snappy on weak devices.
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

    let cancelled = false;
    const bat = (navigator as any).getBattery?.();
    if (bat && typeof bat.then === "function") {
      bat.then((b: any) => {
        if (!cancelled && !(b.level <= 0.2 && !b.charging)) setEnabled(true);
      });
    } else {
      setEnabled(true);
    }
    return () => {
      cancelled = true;
    };
  }, []);

  if (!enabled) return <>{children}</>;

  return (
    <ReactLenis
      root
      options={{
        duration: isTouch ? 0.9 : 1.05,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        syncTouch: isTouch,
        syncTouchLerp: 0.075,
        touchMultiplier: 1.5,
      }}
    >
      {children}
    </ReactLenis>
  );
};

export default SmoothScroll;