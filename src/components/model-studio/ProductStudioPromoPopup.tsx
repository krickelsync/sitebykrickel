import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import aiProductStudioIcon from "@/assets/icons/ai-product-studio-icon.png";

const ProductStudioPromoPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already shown this session
    const hasShown = sessionStorage.getItem("productStudioPromoShown");
    if (hasShown) return;

    // Show after 5 seconds
    const showTimer = setTimeout(() => {
      setIsVisible(true);
      sessionStorage.setItem("productStudioPromoShown", "true");

      // Auto-hide after 2 minutes (120 seconds)
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, 120000);

      return () => clearTimeout(hideTimer);
    }, 5000);

    return () => clearTimeout(showTimer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleLearnMore = () => {
    navigate("/products/ai-product-studio");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-24 md:bottom-8 right-4 md:right-6 z-50 max-w-[300px] md:max-w-[320px]"
        >
          <div className="relative bg-card/95 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl shadow-black/20">
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Content */}
            <div className="flex flex-col items-center text-center">
              {/* Icon */}
              <img
                src={aiProductStudioIcon}
                alt="AI Product Studio"
                className="w-14 h-14 md:w-16 md:h-16 rounded-xl shadow-lg shadow-primary/10 mb-4"
              />

              {/* Text */}
              <span className="text-xs font-mono tracking-wider text-primary/80 mb-1">
                ALSO AVAILABLE
              </span>
              <h3 className="text-base md:text-lg font-display font-semibold text-foreground mb-2">
                AI Product Studio
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground mb-4 leading-relaxed">
                Transform your product photos into professional shots — no model needed.
              </p>

              {/* CTA */}
              <Button
                onClick={handleLearnMore}
                size="sm"
                className="w-full bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20"
              >
                Learn More
                <ArrowRight className="ml-2 w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductStudioPromoPopup;
