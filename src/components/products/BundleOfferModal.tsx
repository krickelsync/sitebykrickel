import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, Sparkles } from "lucide-react";
import CountdownTimer from "./CountdownTimer";

interface BundleOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAcceptBundle: () => void;
  onDeclineBundle: () => void;
  originalProduct: string;
}

const BundleOfferModal = ({
  isOpen,
  onClose,
  onAcceptBundle,
  onDeclineBundle,
  originalProduct,
}: BundleOfferModalProps) => {
  const [hasExpired, setHasExpired] = useState(false);
  const [initialSeconds, setInitialSeconds] = useState(120);

  useEffect(() => {
    if (isOpen) {
      // Check sessionStorage for existing timer
      const storedTime = sessionStorage.getItem("bundleOfferExpiry");
      if (storedTime) {
        const remaining = Math.floor(
          (parseInt(storedTime) - Date.now()) / 1000
        );
        if (remaining > 0) {
          setInitialSeconds(remaining);
        } else {
          setHasExpired(true);
        }
      } else {
        // Set new expiry time - 120 seconds (2 minutes)
        sessionStorage.setItem(
          "bundleOfferExpiry",
          String(Date.now() + 120000)
        );
        setInitialSeconds(120);
      }
    }
  }, [isOpen]);

  const handleExpire = () => {
    setHasExpired(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/90 backdrop-blur-md z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-lg glass-card p-8 relative overflow-hidden">
              {/* Decorative background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none" />

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-secondary rounded-lg transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Content */}
              <div className="relative z-10 text-center space-y-6">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: [0, -10, 10, 0] }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center"
                >
                  <Gift className="w-8 h-8 text-primary" />
                </motion.div>

                {/* Title */}
                <div className="space-y-2">
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-sm font-mono text-primary uppercase tracking-wider"
                  >
                    Wait — Exclusive Bundle Deal
                  </motion.p>
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="font-display text-2xl md:text-3xl font-bold"
                  >
                    This discount is only for you
                  </motion.h2>
                </div>

                {/* Bundle info */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="p-4 bg-secondary/50 rounded-xl space-y-3"
                >
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="font-mono">
                      AI Product Studio + AI Model Studio
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-4">
                    <span className="text-muted-foreground line-through font-mono text-lg">
                      $200
                    </span>
                    <span className="text-3xl font-bold font-mono text-primary">
                      $100
                    </span>
                    <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-mono font-bold">
                      SAVE $100
                    </span>
                  </div>
                </motion.div>

                {/* Timer */}
                {!hasExpired && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-2"
                  >
                    <p className="text-sm text-muted-foreground font-mono font-bold">
                      ⏰ HURRY UP! This offer expires in:
                    </p>
                    <CountdownTimer
                      initialSeconds={initialSeconds}
                      onExpire={handleExpire}
                    />
                    <p className="text-xs text-destructive/80 mt-2 font-medium">
                      ⚠️ After time runs out, this discount will NEVER appear again!
                    </p>
                  </motion.div>
                )}

                {hasExpired && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-2 p-4 bg-destructive/10 rounded-xl"
                  >
                    <p className="text-destructive font-mono text-sm font-bold">
                      ❌ OFFER EXPIRED
                    </p>
                    <p className="text-xs text-muted-foreground">
                      This exclusive 50% discount is no longer available.
                    </p>
                  </motion.div>
                )}

                {/* Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="space-y-3 pt-4"
                >
                  {!hasExpired && (
                    <button
                      onClick={onAcceptBundle}
                      className="w-full py-4 px-6 bg-primary text-primary-foreground font-mono font-bold rounded-xl hover:opacity-90 transition-opacity"
                    >
                      Get Both for $100
                    </button>
                  )}
                  <button
                    onClick={onDeclineBundle}
                    className="w-full py-3 px-6 text-muted-foreground hover:text-foreground font-mono text-sm transition-colors"
                  >
                    {hasExpired
                      ? `Continue with ${originalProduct}`
                      : "No thanks, continue with single product"}
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BundleOfferModal;
