import { motion, useTransform, useReducedMotion, type MotionValue } from "framer-motion";
import { Smartphone, Zap, TrendingUp } from "lucide-react";

interface Props {
  mx: MotionValue<number>;
  my: MotionValue<number>;
}

/**
 * Floating glass stat cards — reference: TOTAL SALES, CONVERSION RATE,
 * FULLY RESPONSIVE, FAST LOADING SPEED. Mouse parallax is applied ONLY
 * to these assets (per design spec).
 */
const HeroFloatingStats = ({ mx, my }: Props) => {
  const reduce = useReducedMotion();

  // depth factors per card (some move more, some less → 3D layering)
  // kept conservative so cards never drift off-screen
  const tlX = useTransform(mx, (v) => (reduce ? 0 : v * 18));
  const tlY = useTransform(my, (v) => (reduce ? 0 : v * 14));
  const trX = useTransform(mx, (v) => (reduce ? 0 : v * -14));
  const trY = useTransform(my, (v) => (reduce ? 0 : v * 12));
  const blX = useTransform(mx, (v) => (reduce ? 0 : v * 12));
  const blY = useTransform(my, (v) => (reduce ? 0 : v * -14));
  const brX = useTransform(mx, (v) => (reduce ? 0 : v * -16));
  const brY = useTransform(my, (v) => (reduce ? 0 : v * -12));

  const cardBase =
    "pointer-events-none rounded-2xl border border-white/10 px-4 py-3 backdrop-blur-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] will-change-transform";
  const cardStyle = {
    background:
      "linear-gradient(135deg, hsl(0 0% 100% / 0.08), hsl(0 0% 100% / 0.02))",
    WebkitBackdropFilter: "blur(18px) saturate(160%)",
  } as const;
  const accent = "hsl(75 95% 60%)"; // lime/yellow-green from refs

  const floatTransition = (d: number) => ({
    duration: 6 + d,
    repeat: Infinity,
    ease: "easeInOut" as const,
  });

  return (
    <div aria-hidden className="absolute inset-0 z-[3] pointer-events-none">
      {/* TOP LEFT — TOTAL SALES */}
      <div className="absolute top-[12%] left-1 sm:left-3 lg:left-6 scale-[0.45] sm:scale-[0.6] md:scale-75 lg:scale-90 xl:scale-100 origin-top-left">
      <motion.div
        style={{ x: tlX, y: tlY }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        <motion.div
          animate={reduce ? {} : { y: [0, -10, 0] }}
          transition={floatTransition(0)}
          className={cardBase}
          style={cardStyle}
        >
          <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/60 mb-1">
            Total Sales
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-syne text-2xl font-bold text-white">$28,420</span>
            <span className="font-mono text-[10px] flex items-center gap-0.5" style={{ color: accent }}>
              <TrendingUp size={10} /> 24%
            </span>
          </div>
          {/* sparkline */}
          <svg viewBox="0 0 100 30" className="mt-2 w-32 h-8">
            <defs>
              <linearGradient id="spark1" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={accent} stopOpacity="0.4" />
                <stop offset="100%" stopColor={accent} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0,22 L15,18 L30,24 L45,12 L60,16 L75,6 L100,2 L100,30 L0,30 Z" fill="url(#spark1)" />
            <path d="M0,22 L15,18 L30,24 L45,12 L60,16 L75,6 L100,2" fill="none" stroke={accent} strokeWidth="1.5" />
          </svg>
        </motion.div>
      </motion.div>
      </div>

      {/* TOP RIGHT — CONVERSION RATE */}
      <div className="absolute top-[12%] right-1 sm:right-3 lg:right-6 scale-[0.45] sm:scale-[0.6] md:scale-75 lg:scale-90 xl:scale-100 origin-top-right">
      <motion.div
        style={{ x: trX, y: trY }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.8 }}
      >
        <motion.div
          animate={reduce ? {} : { y: [0, 12, 0] }}
          transition={floatTransition(1)}
          className={cardBase}
          style={cardStyle}
        >
          <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/60 mb-1">
            Conversion Rate
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="font-syne text-2xl font-bold text-white">3.68%</span>
            <span className="font-mono text-[10px] flex items-center gap-0.5" style={{ color: accent }}>
              <TrendingUp size={10} /> 18%
            </span>
          </div>
          <div className="h-1.5 w-32 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "72%" }}
              transition={{ delay: 1.4, duration: 1.2, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${accent}, hsl(45 100% 60%))` }}
            />
          </div>
        </motion.div>
      </motion.div>
      </div>

      {/* BOTTOM LEFT — FULLY RESPONSIVE */}
      <div className="absolute bottom-[30%] sm:bottom-[26%] left-1 sm:left-3 lg:left-6 scale-[0.5] sm:scale-[0.65] md:scale-75 lg:scale-90 xl:scale-100 origin-bottom-left">
      <motion.div
        style={{ x: blX, y: blY }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <motion.div
          animate={reduce ? {} : { y: [0, -8, 0] }}
          transition={floatTransition(0.5)}
          className={`${cardBase} flex items-center gap-3`}
          style={cardStyle}
        >
          <div className="grid place-items-center w-9 h-9 rounded-lg border" style={{ borderColor: accent, color: accent }}>
            <Smartphone size={16} />
          </div>
          <div>
            <div className="font-syne text-sm font-bold uppercase text-white leading-none">Fully</div>
            <div className="font-syne text-sm font-bold uppercase text-white leading-tight">Responsive</div>
          </div>
        </motion.div>
      </motion.div>
      </div>

      {/* BOTTOM RIGHT — FAST LOADING SPEED */}
      <div className="absolute bottom-[30%] sm:bottom-[26%] right-1 sm:right-3 lg:right-6 scale-[0.5] sm:scale-[0.65] md:scale-75 lg:scale-90 xl:scale-100 origin-bottom-right">
      <motion.div
        style={{ x: brX, y: brY }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <motion.div
          animate={reduce ? {} : { y: [0, 10, 0] }}
          transition={floatTransition(1.5)}
          className={`${cardBase} text-center`}
          style={cardStyle}
        >
          <motion.div
            animate={reduce ? {} : { scale: [1, 1.15, 1], filter: ["drop-shadow(0 0 0px " + accent + ")", "drop-shadow(0 0 12px " + accent + ")", "drop-shadow(0 0 0px " + accent + ")"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="mx-auto mb-1.5"
            style={{ color: accent }}
          >
            <Zap size={22} fill={accent} />
          </motion.div>
          <div className="font-syne text-[11px] font-bold uppercase text-white leading-tight">Fast Loading</div>
          <div className="font-syne text-[11px] font-bold uppercase text-white leading-tight">Speed</div>
        </motion.div>
      </motion.div>
      </div>
    </div>
  );
};

export default HeroFloatingStats;