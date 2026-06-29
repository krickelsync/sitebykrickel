import { useEffect, useState } from "react";

/**
 * Detects "low-power" environments where heavy visual effects should be skipped:
 * - Battery <= 20% and NOT charging
 * - Save-Data header / Data Saver enabled
 * - prefers-reduced-motion
 * Re-evaluates on battery level/charging changes.
 */
export const useLowPower = (): boolean => {
  const [low, setLow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let battery: any | null = null;
    let cancelled = false;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = Boolean((navigator as any).connection?.saveData);
    const slowNet = ["slow-2g", "2g"].includes((navigator as any).connection?.effectiveType ?? "");
    // Treat all mobile/touch devices and low-core CPUs as "low power" so heavy
    // effects (Lenis smooth scroll, ripple loops, parallax, marquees) are
    // skipped regardless of battery level — eliminates frame drops on phones.
    const isMobile =
      /Android|iPhone|iPad|iPod|Mobile|Silk|Kindle|BlackBerry|Opera Mini/i.test(navigator.userAgent) ||
      (window.matchMedia?.("(pointer: coarse)").matches ?? false) ||
      window.innerWidth < 1024;
    const lowCpu = (navigator.hardwareConcurrency ?? 8) <= 4;
    const lowMem = ((navigator as any).deviceMemory ?? 8) <= 4;

    const evaluate = () => {
      const lowBat = battery ? battery.level <= 0.5 && !battery.charging : false;
      setLow(reduce || saveData || slowNet || lowBat || isMobile || lowCpu || lowMem);
    };

    const getBat = (navigator as any).getBattery?.bind(navigator);
    if (getBat) {
      getBat().then((b: any) => {
        if (cancelled) return;
        battery = b;
        b.addEventListener("levelchange", evaluate);
        b.addEventListener("chargingchange", evaluate);
        evaluate();
      }).catch(evaluate);
    } else {
      evaluate();
    }

    return () => {
      cancelled = true;
      if (battery) {
        battery.removeEventListener("levelchange", evaluate);
        battery.removeEventListener("chargingchange", evaluate);
      }
    };
  }, []);

  return low;
};