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

  return (
    <motion.div
      className={`flex items-center justify-center gap-2 font-mono text-2xl font-bold ${
        isUrgent ? "text-destructive" : "text-primary"
      }`}
      animate={isUrgent ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 0.5, repeat: isUrgent ? Infinity : 0 }}
    >
      <div className="flex items-center gap-1">
        <motion.span
          key={minutes}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="inline-block min-w-[2ch] text-center"
        >
          {String(minutes).padStart(2, "0")}
        </motion.span>
        <span>:</span>
        <motion.span
          key={remainingSeconds}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="inline-block min-w-[2ch] text-center"
        >
          {String(remainingSeconds).padStart(2, "0")}
        </motion.span>
      </div>
    </motion.div>
  );
};

export default CountdownTimer;
