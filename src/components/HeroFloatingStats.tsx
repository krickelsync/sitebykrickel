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

  // ---- Looping animated counters ----
  const [sales, setSales] = useState(0);
  const salesRef = useRef(0);
  useEffect(() => {
    if (reduce) { setSales(28420); return; }
    let cancelled = false;
    let controls: ReturnType<typeof animate> | undefined;
    const loop = () => {
      const from = salesRef.current || 26000;
      const target = 27800 + Math.floor(Math.random() * 1800);
      controls = animate(from, target, {
        duration: 2.4,
        ease: "easeInOut",
        onUpdate: (v) => {
          salesRef.current = v;
          if (!cancelled) setSales(Math.round(v));
        },
        onComplete: () => { if (!cancelled) setTimeout(loop, 900); },
      });
    };
    loop();
    return () => { cancelled = true; controls?.stop(); };
  }, [reduce]);

  const [conv, setConv] = useState(3.68);
  const convRef = useRef(3.68);
  useEffect(() => {
    if (reduce) return;
    let cancelled = false;
    let controls: ReturnType<typeof animate> | undefined;
    const loop = () => {
      const target = 3.4 + Math.random() * 0.6;
      controls = animate(convRef.current, target, {
        duration: 2.2,
        ease: "easeInOut",
        onUpdate: (v) => {
          convRef.current = v;
          if (!cancelled) setConv(v);
        },
        onComplete: () => { if (!cancelled) setTimeout(loop, 700); },
      });
    };
    loop();
    return () => { cancelled = true; controls?.stop(); };
  }, [reduce]);

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
      <div className="absolute top-[12%] left-1 sm:left-3 lg:left-6 scale-[0.45] sm:scale-[0.6] md:scale-75 lg:scale-90 xl:scale-100 origin-top-left">
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
            className={`${cardBase} pointer-events-auto relative overflow-hidden w-[200px]`}
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
            <div className="relative flex items-baseline gap-2">
              <span className="font-syne text-2xl font-bold text-white tabular-nums">
                ${sales.toLocaleString("en-US")}
              </span>
              <span className="font-mono text-[10px] flex items-center gap-0.5" style={{ color: accent }}>
                <TrendingUp size={10} /> 24%
              </span>
            </div>
            {/* Continuously scrolling waveform (seamless loop) */}
            <svg viewBox="0 0 100 36" className="relative mt-2 w-full h-12" preserveAspectRatio="none">
              <defs>
                <linearGradient id="spark1" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={accent} stopOpacity="0.55" />
                  <stop offset="100%" stopColor={accent} stopOpacity="0" />
                </linearGradient>
                <linearGradient id="spark1Line" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor={accent} stopOpacity="0.4" />
                  <stop offset="100%" stopColor={accent} stopOpacity="1" />
                </linearGradient>
                <clipPath id="spark1Clip">
                  <rect x="0" y="0" width="100" height="36" />
                </clipPath>
              </defs>
              {[8, 18, 28].map((y) => (
                <line key={y} x1="0" x2="100" y1={y} y2={y} stroke="hsl(0 0% 100% / 0.06)" strokeWidth="0.4" />
              ))}
              {/* Two tiled copies that scroll seamlessly */}
              <motion.g
                clipPath="url(#spark1Clip)"
                animate={reduce ? {} : { x: [0, -100] }}
                transition={reduce ? {} : { duration: 6, repeat: Infinity, ease: "linear" }}
              >
                {[0, 100].map((dx) => (
                  <g key={dx} transform={`translate(${dx} 0)`}>
                    <path
                      d="M0,28 L12,22 L24,26 L36,14 L48,18 L60,10 L72,14 L84,6 L100,2 L100,36 L0,36 Z"
                      fill="url(#spark1)"
                    />
                    <path
                      d="M0,28 L12,22 L24,26 L36,14 L48,18 L60,10 L72,14 L84,6 L100,2"
                      fill="none"
                      stroke="url(#spark1Line)"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                ))}
              </motion.g>
              {/* Pulsing dot at the leading edge */}
              {!reduce && (
                <motion.circle
                  cx="100"
                  cy="2"
                  r="1.8"
                  fill={accent}
                  animate={{ r: [1.8, 2.6, 1.8], opacity: [1, 0.6, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                  style={{ filter: `drop-shadow(0 0 5px ${accent})` }}
                />
              )}
            </svg>
          </motion.div>
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
          animate={reduce ? {} : { y: [0, 12, 0], rotateZ: [pose.tr.rz, pose.tr.rz + 1.5, pose.tr.rz] }}
          transition={floatTransition(1)}
          style={{ perspective: 900 }}
        >
          <motion.div
            className={cardBase}
            style={{ ...cardStyle, rotateX: trRX, rotateY: trRY, transformStyle: "preserve-3d" }}
            whileHover={reduce ? {} : { scale: 1.04 }}
          >
          <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/60 mb-1">
            Conversion Rate
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="font-syne text-2xl font-bold text-white tabular-nums">{conv.toFixed(2)}%</span>
            <span className="font-mono text-[10px] flex items-center gap-0.5" style={{ color: accent }}>
              <TrendingUp size={10} /> 18%
            </span>
          </div>
          <div className="h-1.5 w-32 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              initial={{ width: "30%" }}
              animate={reduce ? { width: "72%" } : { width: ["30%", "85%", "55%", "78%", "30%"] }}
              transition={reduce ? { duration: 0 } : { duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${accent}, hsl(45 100% 60%))` }}
            />
          </div>
          </motion.div>
        </motion.div>
      </motion.div>
      </div>

      {/* BOTTOM LEFT — FULLY RESPONSIVE */}
      <div className="absolute bottom-[32%] sm:bottom-[28%] md:bottom-[26%] left-1 sm:left-3 lg:left-6 scale-[0.6] sm:scale-[0.75] md:scale-90 lg:scale-100 origin-bottom-left">
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
      <div className="absolute bottom-[32%] sm:bottom-[28%] md:bottom-[26%] right-1 sm:right-3 lg:right-6 scale-[0.6] sm:scale-[0.75] md:scale-90 lg:scale-100 origin-bottom-right">
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