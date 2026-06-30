import { useEffect, useState } from "react";

/**
 * Detects explicit user/network constraints only.
 * No battery, mobile, CPU, or memory hard caps . performance is handled by
 * pausing decorative loops while scrolling instead of permanently limiting UI.
 */
export const useLowPower = (): boolean => {
  const [low, setLow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = Boolean((navigator as any).connection?.saveData);
    const slowNet = ["slow-2g", "2g"].includes((navigator as any).connection?.effectiveType ?? "");

    setLow(reduce || saveData || slowNet);
  }, []);

  return low;
};