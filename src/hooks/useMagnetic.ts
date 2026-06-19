import { useEffect, useRef } from "react";

/**
 * Awwwards-style magnetic hover: pulls element toward the cursor.
 * Disabled on touch / coarse pointers and when prefers-reduced-motion is set.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.35) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === "undefined") return;

    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      el.style.transform = "translate3d(0, 0, 0)";
    };

    el.style.transition = "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)";
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [strength]);

  return ref;
}