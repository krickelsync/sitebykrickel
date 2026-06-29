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

    const evaluate = () => {
      const lowBat = battery ? battery.level <= 0.35 && !battery.charging : false;
      setLow(reduce || saveData || slowNet || lowBat);
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