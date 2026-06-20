import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollToId } from "@/lib/scroll";

/**
 * Scrolls to the element matching `location.hash` whenever the hash changes.
 * Small delay lets React finish rendering the target element after navigation.
 */
export const useHashScroll = (delay = 50) => {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    const hash = location.hash.slice(1);
    const timer = setTimeout(() => scrollToId(hash), delay);
    return () => clearTimeout(timer);
  }, [location.pathname, location.hash, delay]);
};