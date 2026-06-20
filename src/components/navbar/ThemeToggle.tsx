import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

/**
 * Dramatic dark/light toggle used inside the navbar pill.
 * Renders an invisible placeholder before mount to avoid hydration flash.
 */
const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-5 h-5" />;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative p-2 transition-colors hover:text-primary overflow-hidden"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ scale: 0, rotate: -180, opacity: 0, y: 20 }}
          animate={{ scale: 1, rotate: 0, opacity: 1, y: 0 }}
          exit={{ scale: 0, rotate: 180, opacity: 0, y: -20 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="relative"
        >
          {isDark ? (
            <motion.div
              animate={{ rotate: [0, 15, -15, 10, -10, 0] }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <Sun className="w-5 h-5 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.6)]" />
            </motion.div>
          ) : (
            <motion.div
              animate={{ rotate: [0, -15, 15, -10, 10, 0], scale: [1, 1.15, 1] }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <Moon className="w-5 h-5 text-blue-300 drop-shadow-[0_0_10px_rgba(147,197,253,0.6)]" />
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      <motion.div
        className="absolute inset-0 rounded-full -z-10"
        animate={{
          backgroundColor: isDark
            ? "rgba(250, 204, 21, 0.15)"
            : "rgba(147, 197, 253, 0.15)",
          scale: [1, 1.3, 1],
        }}
        transition={{ duration: 0.6 }}
      />
    </button>
  );
};

export default ThemeToggle;