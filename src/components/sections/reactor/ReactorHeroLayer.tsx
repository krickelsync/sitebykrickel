import { motion, useAnimation, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import chromeBag from "@/assets/chrome-bag.png.asset.json";
import { useLowPower } from "@/hooks/useLowPower";
import { REACTOR_FEATURES, type ReactorFeature } from "./features";
import FeatureCard from "./FeatureCard";

type Stage = "idle" | "connect" | "transfer" | "activate" | "orbit";

interface Props {
  onStageChange?: (s: Stage) => void;
}

// Compact widget geometry (viewBox 240 x 200).
// Bag = CENTER. Shopify icon sits ABOVE it, vertical cable connects them.
// After click → 5 orbit icons appear around the bag, each with its own cable.
const W = 240;
const H = 200;
const BAG = { x: W / 2, y: 112 };
const SHOP = { x: W / 2, y: 32 };

const ORBIT_RADIUS = 92;
const ORBIT_ANGLES_DEG = [205, 160, 90, 20, -25];
const ORBIT_POS = ORBIT_ANGLES_DEG.map((deg) => {
  const rad = (deg * Math.PI) / 180;
  return {
    x: BAG.x + Math.cos(rad) * ORBIT_RADIUS,
    y: BAG.y - Math.sin(rad) * ORBIT_RADIUS,
  };
});

const ReactorHeroLayer = ({ onStageChange }: Props) => {
  const reduce = useReducedMotion();
  const lowPower = useLowPower();
  const [stage, setStage] = useState<Stage>("idle");
  const [burst, setBurst] = useState(0);
  const [active, setActive] = useState<ReactorFeature | null>(null);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.matchMedia("(max-width: 767px)").matches : false,
  );
  const controls = useAnimation();
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const fn = () => setIsMobile(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  useEffect(() => {
    onStageChange?.(stage);
  }, [stage, onStageChange]);

  const runSequence = useCallback(() => {
    if (stage !== "idle") return;
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    setStage("connect");
    const speed = reduce || lowPower ? 0.55 : 1;
    const t1 = window.setTimeout(() => setStage("transfer"), 520 * speed);
    const t2 = window.setTimeout(() => setStage("activate"), 1050 * speed);
    const t3 = window.setTimeout(() => setStage("orbit"), 1450 * speed);
    timers.current = [t1, t2, t3];
  }, [stage, reduce, lowPower]);

  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  const activateReactor = useCallback(() => {
    setBurst((b) => b + 1);
    controls.start({ x: [0, -2, 2, -1, 0], transition: { duration: 0.4 } });
    if (stage === "idle") runSequence();
  }, [controls, runSequence, stage]);

  const cableActive = stage !== "idle";
  const showOrbit = stage === "orbit";

  return (
    <div className="relative z-20 mx-auto -mt-2 mb-1 flex w-full justify-center md:-mt-3 md:mb-2">
      <motion.div
        animate={controls}
        className="relative h-[170px] w-[220px] select-none sm:h-[190px] sm:w-[240px] md:h-[210px] md:w-[260px]"
        style={{ perspective: 900 }}
      >
        {/* SVG canvas — overflow visible so orbit cables can extend past the box. */}
        <svg
          aria-hidden
          viewBox={`0 0 ${W} ${H}`}
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        >
          <defs>
            <linearGradient id="rhlCableStroke" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="hsl(140 80% 55%)" />
              <stop offset="50%" stopColor="hsl(45 100% 60%)" />
              <stop offset="100%" stopColor="hsl(45 100% 70%)" />
            </linearGradient>
            <linearGradient id="rhlOrbitCable" x1="0" x2="1">
              <stop offset="0%" stopColor="hsl(45 100% 65%)" />
              <stop offset="100%" stopColor="hsl(210 100% 72%)" />
            </linearGradient>
            <filter id="rhlCableGlow" x="-40%" y="-80%" width="180%" height="260%">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Vertical cable Shopify → Bag (ghost rail always visible) */}
          <path
            d={`M ${SHOP.x} ${SHOP.y + 18} C ${SHOP.x} ${SHOP.y + 40}, ${BAG.x} ${BAG.y - 50}, ${BAG.x} ${BAG.y - 30}`}
            stroke="hsl(var(--foreground) / 0.16)"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
          <motion.path
            d={`M ${SHOP.x} ${SHOP.y + 18} C ${SHOP.x} ${SHOP.y + 40}, ${BAG.x} ${BAG.y - 50}, ${BAG.x} ${BAG.y - 30}`}
            stroke="url(#rhlCableStroke)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            filter="url(#rhlCableGlow)"
            initial={false}
            animate={{ pathLength: cableActive ? 1 : 0 }}
            transition={{ duration: reduce || lowPower ? 0.2 : 0.6, ease: "easeInOut" }}
          />

          {/* Orbit cables — bag → each orbit icon */}
          {showOrbit &&
            ORBIT_POS.map((p, i) => {
              const midX = (BAG.x + p.x) / 2;
              const midY = (BAG.y + p.y) / 2 - 14;
              return (
                <motion.path
                  key={`orbit-cable-${i}`}
                  d={`M ${BAG.x} ${BAG.y} Q ${midX} ${midY}, ${p.x} ${p.y}`}
                  stroke="url(#rhlOrbitCable)"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeDasharray="2.5 3"
                  fill="none"
                  filter="url(#rhlCableGlow)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.9 }}
                  transition={{ duration: reduce ? 0.2 : 0.55, delay: 0.08 * i, ease: "easeOut" }}
                />
              );
            })}

          {showOrbit && (
            <motion.circle
              cx={BAG.x}
              cy={BAG.y}
              r="3"
              fill="hsl(45 100% 65%)"
              filter="url(#rhlCableGlow)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: [0.6, 1, 0.6] }}
              transition={{ duration: reduce ? 0.25 : 1.6, repeat: reduce ? 0 : Infinity }}
            />
          )}
        </svg>

        {/* Shopify icon — ABOVE the bag, centered */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute left-1/2"
          style={{ top: SHOP.y - 18, transform: "translateX(-50%)" }}
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[hsl(140_60%_35%)]/45 bg-[hsl(140_45%_8%/0.76)] shadow-[0_0_24px_hsl(140_80%_45%/0.22)] backdrop-blur sm:h-11 sm:w-11">
            <svg viewBox="0 0 109 124" className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden>
              <path
                fill="#95BF47"
                d="M74.7 14.8c-.1-.5-.5-.8-.9-.8-.4 0-7.7-.6-7.7-.6s-5.1-5-5.6-5.6c-.6-.6-1.7-.4-2.1-.3-.1 0-1.1.4-2.9.9-1.7-4.9-4.6-9.4-9.9-9.4h-.5c-1.5-2-3.4-2.9-5-2.9C28.3.6 22.4 16 18.6 28L8.5 31.2c-3.1 1-3.2 1.1-3.6 4l-9.6 74.6 71.4 13.4 39-8.5C105.6 114.8 74.8 15.3 74.7 14.8z"
              />
            </svg>
            {cableActive && (
              <motion.div
                aria-hidden
                className="absolute inset-0 rounded-full"
                style={{ boxShadow: "0 0 34px hsl(140 80% 50% / 0.55)" }}
                animate={{ opacity: [0.35, 0.8, 0.35] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
            )}
          </div>
        </motion.div>

        {/* Chrome bag — CENTER */}
        <motion.div
          className="absolute left-1/2 z-20"
          style={{ top: BAG.y, transform: "translate(-50%, -50%)" }}
        >
          <button
            type="button"
            onClick={activateReactor}
            aria-label="Activate theme reactor"
            className="relative block cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {stage === "activate" && (
              <motion.div
                key={`shock-${burst}`}
                aria-hidden
                initial={{ scale: 0.4, opacity: 0.6 }}
                animate={{ scale: 2.4, opacity: 0 }}
                transition={{ duration: 1.1, ease: "easeOut" }}
                className="absolute inset-0 rounded-full border-2 border-primary/60"
              />
            )}
            {cableActive && (
              <div
                aria-hidden
                className="absolute -inset-5 rounded-full blur-xl"
                style={{
                  background:
                    "radial-gradient(circle at 50% 70%, hsl(45 100% 55% / 0.48), transparent 62%)",
                }}
              />
            )}
            <motion.div
              animate={stage === "activate" ? { scale: [1, 1.1, 1] } : { scale: 1 }}
              transition={{ duration: 0.45 }}
              className="relative h-[76px] w-[76px] sm:h-[86px] sm:w-[86px] md:h-[94px] md:w-[94px]"
            >
              <img
                src={chromeBag.url}
                alt="SitebyKrickel chrome shopping bag"
                className="h-full w-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
                loading="lazy"
                decoding="async"
              />
              {cableActive && (
                <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
                  <div className="reactor-shine absolute -inset-y-4 -left-1/2 w-1/2 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                </div>
              )}
            </motion.div>
          </button>
        </motion.div>

        {/* Orbiting feature icons — only render after orbit stage */}
        {showOrbit &&
          REACTOR_FEATURES.map((feat, i) => {
            const pos = ORBIT_POS[i];
            if (!pos) return null;
            const { Icon } = feat;
            const isActive = active?.key === feat.key;
            return (
              <motion.button
                key={feat.key}
                type="button"
                onClick={() => setActive(isActive ? null : feat)}
                aria-label={feat.title}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 220,
                  damping: 16,
                  delay: 0.18 + i * 0.07,
                }}
                whileHover={reduce ? {} : { scale: 1.12 }}
                whileTap={{ scale: 0.92 }}
                className={`absolute z-30 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border backdrop-blur-md transition-colors sm:h-10 sm:w-10 ${
                  isActive
                    ? "border-primary/70 bg-primary/15 shadow-[0_0_22px_hsl(45_100%_60%/0.55)]"
                    : "border-white/15 bg-background/55 hover:border-primary/50"
                }`}
                style={{
                  left: `${(pos.x / W) * 100}%`,
                  top: `${(pos.y / H) * 100}%`,
                }}
              >
                <Icon className="h-4 w-4 text-foreground/90 sm:h-[18px] sm:w-[18px]" strokeWidth={1.5} />
              </motion.button>
            );
          })}

        {/* Feature card reveal */}
        <FeatureCard feature={active} isMobile={isMobile} onClose={() => setActive(null)} />
      </motion.div>
    </div>
  );
};

export default ReactorHeroLayer;