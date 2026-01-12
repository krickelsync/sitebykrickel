import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface CountdownTimerProps {
  initialSeconds: number;
  onExpire?: () => void;
}

const CountdownTimer = ({ initialSeconds, onExpire }: CountdownTimerProps) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) {
      onExpire?.();
      return;
    }

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds, onExpire]);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const isUrgent = seconds <= 30;
  const isCritical = seconds <= 10;

  // Dynamic styles based on urgency
  const getTextSize = () => {
    if (isCritical) return "text-5xl";
    if (isUrgent) return "text-4xl";
    return "text-2xl";
  };

  const getGlowStyle = () => {
    if (isCritical) {
      return {
        textShadow: "0 0 40px rgba(239, 68, 68, 1), 0 0 80px rgba(239, 68, 68, 0.6)",
        filter: "drop-shadow(0 0 20px rgba(239, 68, 68, 0.8))",
      };
    }
    if (isUrgent) {
      return {
        textShadow: "0 0 20px rgba(239, 68, 68, 0.8), 0 0 40px rgba(239, 68, 68, 0.4)",
      };
    }
    return {};
  };

  return (
    <div className="relative">
      {/* Background flash for critical state */}
      {isCritical && (
        <motion.div
          className="absolute -inset-4 bg-destructive/20 rounded-xl blur-xl"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 0.3, repeat: Infinity }}
        />
      )}
      
      {/* Urgent background pulse */}
      {isUrgent && !isCritical && (
        <motion.div
          className="absolute -inset-2 bg-destructive/10 rounded-lg blur-md"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      )}

      <motion.div
        className={`relative flex items-center justify-center gap-2 font-mono font-bold transition-all duration-300 ${getTextSize()} ${
          isUrgent ? "text-destructive" : "text-primary"
        }`}
        style={getGlowStyle()}
        animate={
          isCritical
            ? { scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }
            : isUrgent
            ? { scale: [1, 1.15, 1], opacity: [1, 0.8, 1] }
            : {}
        }
        transition={{
          duration: isCritical ? 0.2 : isUrgent ? 0.3 : 0.5,
          repeat: isUrgent ? Infinity : 0,
          ease: "easeInOut",
        }}
      >
        <div className="flex items-center gap-1">
          <motion.span
            key={`min-${minutes}`}
            initial={{ y: -20, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="inline-block min-w-[2ch] text-center"
          >
            {String(minutes).padStart(2, "0")}
          </motion.span>
          <motion.span
            animate={isCritical ? { opacity: [1, 0.3, 1] } : {}}
            transition={{ duration: 0.2, repeat: isCritical ? Infinity : 0 }}
          >
            :
          </motion.span>
          <motion.span
            key={`sec-${remainingSeconds}`}
            initial={{ y: -20, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="inline-block min-w-[2ch] text-center"
          >
            {String(remainingSeconds).padStart(2, "0")}
          </motion.span>
        </div>

        {/* URGENT label for critical state */}
        {isCritical && (
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: [1, 0.5, 1], x: 0 }}
            transition={{ duration: 0.3, repeat: Infinity }}
            className="absolute -right-16 text-xs font-bold uppercase tracking-wider"
          >
            HURRY!
          </motion.span>
        )}
      </motion.div>
    </div>
  );
};

export default CountdownTimer;
