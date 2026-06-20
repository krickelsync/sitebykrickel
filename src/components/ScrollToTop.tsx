import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Snaps to top on every route change, instantly (no smooth-scroll flash).
 * Skips when navigating to a hash anchor on the same page.
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    const html = document.documentElement;
    const prev = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    html.style.scrollBehavior = prev;
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;