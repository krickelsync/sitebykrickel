import { motion, useTransform, useReducedMotion, useMotionValue, useSpring, animate, type MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
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

  // ---- Synced looping counters (single progress driver per card) ----
  // Total Sales: $90k → $130k with trend 0% → 130%, perfectly synced.
  const SALES_FROM = 90000;
  const SALES_TO = 130000;
  const SALES_TREND_TO = 130;
  const salesProgress = useMotionValue(reduce ? 1 : 0);
  const [salesDisplay, setSalesDisplay] = useState({ sales: SALES_FROM, trend: 0 });
  // Sharp zigzag points — overall trending up, angular (kaku), full-width.
  const ZIG_PTS: [number, number][] = [
    [0, 38], [14, 28], [24, 33], [38, 22], [50, 27],
    [62, 15], [74, 20], [88, 10], [100, 14], [120, 4],
  ];
  const ZIG_PATH = ZIG_PTS.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
  const ZIG_AREA = `${ZIG_PATH} L120,44 L0,44 Z`;
  const getZigXY = (p: number): [number, number] => {
    const x = 120 * p;
    for (let i = 0; i < ZIG_PTS.length - 1; i++) {
      const [x1, y1] = ZIG_PTS[i];
      const [x2, y2] = ZIG_PTS[i + 1];
      if (x <= x2) return [x, y1 + ((y2 - y1) * (x - x1)) / (x2 - x1)];
    }
    return ZIG_PTS[ZIG_PTS.length - 1];
  };

  useEffect(() => {
    const commit = (p: number) => {
      setSalesDisplay({
        sales: Math.round(SALES_FROM + (SALES_TO - SALES_FROM) * p),
        trend: Math.round(SALES_TREND_TO * p),
      });
    };
    if (reduce) {
      salesProgress.set(1);
      commit(1);
      return;
    }
    let cancelled = false;
    let lastCommit = 0;
    let ctrl: ReturnType<typeof animate> | undefined;
    const loop = () => {
      salesProgress.set(0);
      commit(0);
      ctrl = animate(salesProgress, 1, {
        duration: 3.2,
        ease: [0.22, 1, 0.36, 1], // smooth ease-out-quart, no overshoot
        onUpdate: (v) => {
          if (cancelled) return;
          const now = performance.now();
          if (now - lastCommit > 90) {
            lastCommit = now;
            commit(v);
          }
        },
        onComplete: () => {
          if (!cancelled) {
            commit(1);
            setTimeout(loop, 1600);
          }
        },
      });
    };
    loop();
    return () => { cancelled = true; ctrl?.stop(); };
  }, [reduce, salesProgress]);
  const sales = salesDisplay.sales;
  const salesTrend = salesDisplay.trend;
  const salesChartWidth = useTransform(salesProgress, (p) => Math.max(0, Math.min(120, 120 * p)));
  const salesDotX = useTransform(salesProgress, (p) => getZigXY(p)[0]);
  const salesDotY = useTransform(salesProgress, (p) => getZigXY(p)[1]);
  const trail1X = useTransform(salesProgress, (p) => getZigXY(Math.max(0, p - 0.04))[0]);
  const trail1Y = useTransform(salesProgress, (p) => getZigXY(Math.max(0, p - 0.04))[1]);
  const trail2X = useTransform(salesProgress, (p) => getZigXY(Math.max(0, p - 0.08))[0]);
  const trail2Y = useTransform(salesProgress, (p) => getZigXY(Math.max(0, p - 0.08))[1]);
  const trail3X = useTransform(salesProgress, (p) => getZigXY(Math.max(0, p - 0.12))[0]);
  const trail3Y = useTransform(salesProgress, (p) => getZigXY(Math.max(0, p - 0.12))[1]);

  // Conversion: 0% → 18.4% with trend 0% → 92%; bar width tracks trend.
  const CONV_TO = 18.4;
  const CONV_TREND_TO = 92;
  const convProgress = useMotionValue(reduce ? 1 : 0);
  const [convDisplay, setConvDisplay] = useState({ conv: 0, trend: 0 });
  useEffect(() => {
    const commit = (p: number) => {
      setConvDisplay({ conv: CONV_TO * p, trend: Math.round(CONV_TREND_TO * p) });
    };
    if (reduce) {
      convProgress.set(1);
      commit(1);
      return;
    }
    let cancelled = false;
    let lastCommit = 0;
    let ctrl: ReturnType<typeof animate> | undefined;
    const loop = () => {
      convProgress.set(0);
      commit(0);
      ctrl = animate(convProgress, 1, {
        duration: 3.0,
        ease: [0.22, 1, 0.36, 1],
        onUpdate: (v) => {
          if (cancelled) return;
          const now = performance.now();
          if (now - lastCommit > 90) {
            lastCommit = now;
            commit(v);
          }
        },
        onComplete: () => {
          if (!cancelled) {
            commit(1);
            setTimeout(loop, 1600);
          }
        },
      });
    };
    loop();
    return () => { cancelled = true; ctrl?.stop(); };
  }, [reduce, convProgress]);
  const conv = convDisplay.conv;
  const convTrend = convDisplay.trend;
  // Bar fill is proportional to current trend value (max = CONV_TREND_TO%).
  const barWidth = useTransform(convProgress, (p) => `${Math.max(0, Math.min(CONV_TREND_TO, CONV_TREND_TO * p))}%`);

  // ---- Mouse tilt deltas, added on top of baseline tilt ----
  const tiltDX = useSpring(useTransform(my, (v) => (reduce ? 0 : v * -6)), { stiffness: 120, damping: 16 });
  const tiltDY = useSpring(useTransform(mx, (v) => (reduce ? 0 : v * 8)), { stiffness: 120, damping: 16 });

  // depth factors per card (some move more, some less → 3D layering)
  const tlX = useTransform(mx, (v) => (reduce ? 0 : v * 14));
  const tlY = useTransform(my, (v) => (reduce ? 0 : v * 10));
  const trX = useTransform(mx, (v) => (reduce ? 0 : v * -12));
  const trY = useTransform(my, (v) => (reduce ? 0 : v * 10));
  const blX = useTransform(mx, (v) => (reduce ? 0 : v * 10));
  const blY = useTransform(my, (v) => (reduce ? 0 : v * -12));
  const brX = useTransform(mx, (v) => (reduce ? 0 : v * -14));
  const brY = useTransform(my, (v) => (reduce ? 0 : v * -10));

  const cardBase =
    "pointer-events-none rounded-2xl border border-white/10 px-3 py-2.5 sm:px-4 sm:py-3 md:backdrop-blur-md shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] will-change-transform";
  const cardStyle = {
    background:
      "linear-gradient(135deg, hsl(0 0% 100% / 0.08), hsl(0 0% 100% / 0.02))",
  } as const;
  const accent = "hsl(75 95% 60%)"; // lime/yellow-green from refs

  const floatTransition = (d: number) => ({
    duration: 6 + d,
    repeat: Infinity,
    ease: "easeInOut" as const,
  });

  // Baseline tilt poses — cards already look "parallaxed" without mouse input
  const pose = {
    tl: { rx: 14, ry: -22, rz: -6 },
    tr: { rx: 14, ry: 22, rz: 6 },
    bl: { rx: -12, ry: -20, rz: -5 },
    br: { rx: -12, ry: 20, rz: 5 },
  };

  // Combined rotateX/Y MotionValues per card (baseline + mouse delta)
  const tlRX = useTransform(tiltDX, (v) => pose.tl.rx + v);
  const tlRY = useTransform(tiltDY, (v) => pose.tl.ry + v);
  const trRX = useTransform(tiltDX, (v) => pose.tr.rx + v);
  const trRY = useTransform(tiltDY, (v) => pose.tr.ry + v);
  const blRX = useTransform(tiltDX, (v) => pose.bl.rx + v);
  const blRY = useTransform(tiltDY, (v) => pose.bl.ry + v);
  const brRX = useTransform(tiltDX, (v) => pose.br.rx + v);
  const brRY = useTransform(tiltDY, (v) => pose.br.ry + v);

  return (
    <div aria-hidden className="absolute inset-0 z-[3] pointer-events-none">
      {/* TOP LEFT — TOTAL SALES */}
      <div className="absolute top-[10%] left-2 sm:left-3 lg:left-6 scale-[0.62] sm:scale-[0.6] md:scale-75 lg:scale-90 xl:scale-100 origin-top-left">
      <motion.div
        style={{ x: tlX, y: tlY }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        <motion.div
          animate={reduce ? {} : { y: [0, -10, 0], rotateZ: [pose.tl.rz, pose.tl.rz - 1.5, pose.tl.rz] }}
          transition={floatTransition(0)}
          style={{ perspective: 900 }}
        >
          <motion.div
            style={{
              ...cardStyle,
              rotateX: tlRX,
              rotateY: tlRY,
              transformStyle: "preserve-3d",
            }}
            whileHover={reduce ? {} : { scale: 1.04 }}
            className={`${cardBase} pointer-events-auto relative overflow-hidden w-[170px] sm:w-[190px] lg:w-[200px]`}
          >
            {/* subtle sheen */}
            <div
              aria-hidden
              className="absolute inset-0 opacity-40 mix-blend-overlay"
              style={{
                background:
                  "radial-gradient(120% 80% at 20% 0%, hsl(0 0% 100% / 0.18), transparent 60%)",
              }}
            />
            <div className="relative font-mono text-[9px] uppercase tracking-[0.22em] text-white/60 mb-1">
              Total Sales
            </div>
            <div className="relative flex items-baseline gap-1.5 sm:gap-2 flex-nowrap whitespace-nowrap">
              <span className="font-syne text-lg sm:text-2xl font-bold text-white tabular-nums">
                ${sales.toLocaleString("en-US")}
              </span>
              <span className="font-mono text-[9px] sm:text-[10px] flex items-center gap-0.5 shrink-0" style={{ color: accent }}>
                <TrendingUp size={9} /> {salesTrend}%
              </span>
            </div>
            {/* Rising sales chart — rebuilt as a contained left-to-right reveal (no scrolling overflow). */}
            <svg viewBox="0 4 120 36" className="relative mt-2 sm:mt-3 -mx-3 sm:-mx-4 w-[calc(100%+1.5rem)] sm:w-[calc(100%+2rem)] h-10 sm:h-12 block overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="salesArea" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={accent} stopOpacity="0.55" />
                  <stop offset="100%" stopColor={accent} stopOpacity="0" />
                </linearGradient>
                <linearGradient id="salesLine" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor={accent} stopOpacity="0.25" />
                  <stop offset="55%" stopColor={accent} stopOpacity="0.85" />
                  <stop offset="100%" stopColor={accent} stopOpacity="1" />
                </linearGradient>
                {/* Shimmer sweep — single animated gradient, zero JS cost */}
                <linearGradient id="salesShimmer" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor={accent} stopOpacity="0" />
                  <stop offset="50%" stopColor="#ffffff" stopOpacity="0.9" />
                  <stop offset="100%" stopColor={accent} stopOpacity="0" />
                  {!reduce && (
                    <animateTransform
                      attributeName="gradientTransform"
                      type="translate"
                      from="-1 0"
                      to="1 0"
                      dur="2.6s"
                      repeatCount="indefinite"
                    />
                  )}
                </linearGradient>
                <filter id="salesGlow" x="-20%" y="-60%" width="140%" height="220%">
                  <feGaussianBlur stdDeviation="1.6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <clipPath id="salesRevealClip">
                  <motion.rect
                    x="0"
                    y="0"
                    width={salesChartWidth}
                    height="44"
                  />
                </clipPath>
              </defs>
              {[12, 22, 32].map((y) => (
                <line key={y} x1="0" x2="120" y1={y} y2={y} stroke="hsl(0 0% 100% / 0.06)" strokeWidth="0.5" />
              ))}
              {/* Static milestone tick marks — zero runtime cost */}
              {[30, 60, 90].map((x) => (
                <line key={x} x1={x} x2={x} y1="2" y2="42" stroke="hsl(0 0% 100% / 0.07)" strokeWidth="0.5" strokeDasharray="1 2" />
              ))}
              <g clipPath="url(#salesRevealClip)">
                <motion.path
                  d={ZIG_AREA}
                  fill="url(#salesArea)"
                  initial={{ opacity: 0.45 }}
                  animate={reduce ? { opacity: 0.45 } : { opacity: [0.22, 0.48, 0.36] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                />
                <path
                  d={ZIG_PATH}
                  fill="none"
                  stroke="url(#salesLine)"
                  strokeWidth="2.2"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  filter="url(#salesGlow)"
                />
                {/* Shimmer overlay on the zigzag — same path, sweeping gradient */}
                <path
                  d={ZIG_PATH}
                  fill="none"
                  stroke="url(#salesShimmer)"
                  strokeWidth="2.4"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  opacity="0.7"
                />
                {/* Trail comet — 3 static circles behind the head dot, no extra animation */}
                <motion.circle cx={trail1X} cy={trail1Y} r="1.5" fill={accent} opacity="0.45" />
                <motion.circle cx={trail2X} cy={trail2Y} r="1.2" fill={accent} opacity="0.25" />
                <motion.circle cx={trail3X} cy={trail3Y} r="1" fill={accent} opacity="0.12" />
                {/* Static glow halo behind the head dot */}
                <motion.circle cx={salesDotX} cy={salesDotY} r="4" fill={accent} opacity="0.22" />
                <motion.circle
                  cx={salesDotX}
                  cy={salesDotY}
                  r="1.8"
                  fill={accent}
                  animate={reduce ? {} : { opacity: [0.75, 1, 0.75] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                  style={{ filter: `drop-shadow(0 0 6px ${accent})` }}
                />
              </g>
            </svg>
          </motion.div>
        </motion.div>
      </motion.div>
      </div>

      {/* TOP RIGHT — CONVERSION RATE */}
      <div className="absolute top-[10%] right-2 sm:right-3 lg:right-6 scale-[0.62] sm:scale-[0.6] md:scale-75 lg:scale-90 xl:scale-100 origin-top-right">
      <motion.div
        style={{ x: trX, y: trY }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.8 }}
      >
        <motion.div
          animate={reduce ? {} : { y: [0, 12, 0], rotateZ: [pose.tr.rz, pose.tr.rz + 1.5, pose.tr.rz] }}
          transition={floatTransition(1)}
          style={{ perspective: 900 }}
        >
          <motion.div
            className={`${cardBase} w-[170px] sm:w-[190px] lg:w-[200px]`}
            style={{ ...cardStyle, rotateX: trRX, rotateY: trRY, transformStyle: "preserve-3d" }}
            whileHover={reduce ? {} : { scale: 1.04 }}
          >
          <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/60 mb-1">
            Conversion Rate
          </div>
          <div className="flex items-baseline gap-1.5 sm:gap-2 mb-2 flex-wrap">
            <span className="font-syne text-xl sm:text-2xl font-bold text-white tabular-nums">{conv.toFixed(2)}%</span>
            <span className="font-mono text-[10px] flex items-center gap-0.5 shrink-0" style={{ color: accent }}>
              <TrendingUp size={10} /> {convTrend}%
            </span>
          </div>
          <div
            className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={CONV_TREND_TO}
            aria-valuenow={convTrend}
            aria-label="Conversion trend"
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                width: barWidth,
                background: `linear-gradient(90deg, ${accent}, hsl(45 100% 60%))`,
              }}
            />
          </div>
          </motion.div>
        </motion.div>
      </motion.div>
      </div>

      {/* BOTTOM LEFT — FULLY RESPONSIVE */}
      <div className="absolute bottom-[22%] sm:bottom-[28%] md:bottom-[26%] left-1 sm:left-3 lg:left-6 scale-[0.6] sm:scale-[0.75] md:scale-90 lg:scale-100 origin-bottom-left">
      <motion.div
        style={{ x: blX, y: blY }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <motion.div
          animate={reduce ? {} : { y: [0, -8, 0], rotateZ: [pose.bl.rz, pose.bl.rz - 1.5, pose.bl.rz] }}
          transition={floatTransition(0.5)}
          style={{ perspective: 900 }}
        >
          <motion.div
            className={`${cardBase} flex flex-row items-center gap-3`}
            style={{ ...cardStyle, rotateX: blRX, rotateY: blRY, transformStyle: "preserve-3d" }}
            whileHover={reduce ? {} : { scale: 1.04 }}
          >
          <div className="grid place-items-center w-10 h-10 rounded-lg border" style={{ borderColor: accent, color: accent }}>
            <Smartphone size={18} />
          </div>
          <div>
            <div className="font-syne text-sm font-bold uppercase text-white leading-none">Fully</div>
            <div className="font-syne text-sm font-bold uppercase text-white leading-tight">Responsive</div>
          </div>
          </motion.div>
        </motion.div>
      </motion.div>
      </div>

      {/* BOTTOM RIGHT — FAST LOADING SPEED */}
      <div className="absolute bottom-[22%] sm:bottom-[28%] md:bottom-[26%] right-1 sm:right-3 lg:right-6 scale-[0.6] sm:scale-[0.75] md:scale-90 lg:scale-100 origin-bottom-right">
      <motion.div
        style={{ x: brX, y: brY }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <motion.div
          animate={reduce ? {} : { y: [0, 10, 0], rotateZ: [pose.br.rz, pose.br.rz + 1.5, pose.br.rz] }}
          transition={floatTransition(1.5)}
          style={{ perspective: 900 }}
        >
          <motion.div
            className={`${cardBase} flex flex-col items-center text-center gap-2.5 w-[120px] sm:w-[130px]`}
            style={{ ...cardStyle, rotateX: brRX, rotateY: brRY, transformStyle: "preserve-3d" }}
            whileHover={reduce ? {} : { scale: 1.04 }}
          >
          <motion.div
            animate={reduce ? {} : { scale: [1, 1.15, 1], filter: ["drop-shadow(0 0 0px " + accent + ")", "drop-shadow(0 0 12px " + accent + ")", "drop-shadow(0 0 0px " + accent + ")"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="grid place-items-center w-10 h-10 rounded-lg border shrink-0"
            style={{ color: accent, borderColor: accent }}
          >
            <Zap size={18} fill={accent} />
          </motion.div>
          <div className="flex flex-col items-center">
            <div className="font-syne text-sm font-bold uppercase text-white leading-none">Fast Loading</div>
            <div className="font-syne text-sm font-bold uppercase text-white leading-tight mt-1">Speed</div>
          </div>
          </motion.div>
        </motion.div>
      </motion.div>
      </div>
    </div>
  );
};

export default HeroFloatingStats;