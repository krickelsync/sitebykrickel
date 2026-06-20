import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { scrollToId } from "@/lib/scroll";

/**
 * Mobile-only sticky bottom CTA that appears after the user scrolls past the hero
 * and hides when the pricing section is in view (to avoid duplicate CTAs).
 */
const LandingStickyCTA = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const pastHero = window.scrollY > window.innerHeight * 0.8;
      const pricing = document.getElementById("pricing");
      let pricingVisible = false;
      if (pricing) {
        const r = pricing.getBoundingClientRect();
        pricingVisible = r.top < window.innerHeight * 0.7 && r.bottom > 0;
      }
      setVisible(pastHero && !pricingVisible);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        >
          <div className="bg-background/95 border-t border-white/10 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
            <a
              href="#pricing"
              onClick={(e) => {
                e.preventDefault();
                scrollToId("pricing");
              }}
              aria-label="Jump to pricing packages"
              className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-primary-foreground font-mono text-xs font-bold uppercase tracking-wider rounded-md min-h-11"
            >
              View Packages
              <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LandingStickyCTA;