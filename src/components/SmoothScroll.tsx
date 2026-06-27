import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Inertial smooth scrolling for the whole page.
 * - Disabled on reduced motion / low-power (battery <=20%, save-data, slow net).
 * - Mobile uses lighter settings (shorter duration, no smoothTouch) to avoid jank.
 */
const SmoothScroll = () => {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const isTouch =
      window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;

    // Low-power guard: battery <=20% unplugged, save-data, or 2g/slow-2g.
    const conn = (navigator as any).connection;
    const saveData = !!conn?.saveData;
    const slowNet = /(^| )(2g|slow-2g)/.test(conn?.effectiveType || "");

    let cancelled = false;
    let raf = 0;
    let lenis: Lenis | null = null;
    let visHandler: (() => void) | null = null;

    const start = (lowBattery: boolean) => {
      if (cancelled || saveData || slowNet || lowBattery) return;

      lenis = new Lenis({
        duration: isTouch ? 0.8 : 1.05,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        // smoothTouch off: native iOS/Android scroll is GPU-accelerated & cheaper.
        smoothTouch: false,
        touchMultiplier: 1.2,
      } as ConstructorParameters<typeof Lenis>[0]);

      let running = true;
      const tick = (time: number) => {
        if (!running) return;
        lenis?.raf(time);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);

      // Pause RAF when tab hidden to save battery.
      visHandler = () => {
        if (document.hidden) {
          running = false;
          cancelAnimationFrame(raf);
        } else if (!running) {
          running = true;
          raf = requestAnimationFrame(tick);
        }
      };
      document.addEventListener("visibilitychange", visHandler);
    };

    const bat = (navigator as any).getBattery?.();
    if (bat && typeof bat.then === "function") {
      bat.then((b: any) => start(!b.charging && b.level <= 0.2));
    } else {
      start(false);
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      if (visHandler) document.removeEventListener("visibilitychange", visHandler);
      lenis?.destroy();
    };
  }, []);

  return null;
};

export default SmoothScroll;