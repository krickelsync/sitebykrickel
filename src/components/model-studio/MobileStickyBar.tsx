import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface MobileStickyBarProps {
  onCtaClick: () => void;
  onPricingClick: () => void;
}

const MobileStickyBar = ({ onCtaClick, onPricingClick }: MobileStickyBarProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past hero (roughly 100vh)
      setIsVisible(window.scrollY > window.innerHeight * 0.8);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        >
          <div className="bg-background/90 backdrop-blur-xl border-t border-white/10 px-4 py-3 safe-area-inset-bottom">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onPricingClick}
                className="flex-1 py-5 text-sm border-white/10 hover:bg-white/5"
              >
                See Pricing
              </Button>
              <Button
                onClick={onCtaClick}
                className="flex-1 py-5 text-sm bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Get Access
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileStickyBar;
