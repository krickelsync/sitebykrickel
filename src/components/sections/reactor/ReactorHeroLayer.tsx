import { motion, useAnimation, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import chromeBag from "@/assets/chrome-bag.png.asset.json";
import { useLowPower } from "@/hooks/useLowPower";
import { REACTOR_FEATURES } from "./features";

type Stage = "idle" | "connect" | "transfer" | "activate" | "orbit";

interface Props {
  onStageChange?: (s: Stage) => void;
}

const ReactorHeroLayer = ({ onStageChange }: Props) => {
  const reduce = useReducedMotion();
  const lowPower = useLowPower();
  const [stage, setStage] = useState<Stage>("idle");
  const [burst, setBurst] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const controls = useAnimation();
  const timers = useRef<number[]>([]);

  useEffect(() => { onStageChange?.(stage); }, [stage, onStageChange]);

  const runSequence = useCallback(() => {
    if (stage !== "idle") return;
    setHasInteracted(true);
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    setStage("connect");
    const speed = reduce || lowPower ? 0.55 : 1;
    const t1 = window.setTimeout(() => setStage("transfer"), 420 * speed);
    const t2 = window.setTimeout(() => setStage("activate"), 1050 * speed);
    const t3 = window.setTimeout(() => {
      setStage("orbit");
    }, 1450 * speed);
    timers.current = [t1, t2, t3];
  }, [stage]);

  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  const [pulseTick, setPulseTick] = useState(0);
  useEffect(() => {
    if (stage !== "orbit" || reduce || lowPower) return;
    const id = setInterval(() => setPulseTick((n) => n + 1), 4200);
    return () => clearInterval(id);
  }, [stage, reduce, lowPower]);

  useEffect(() => {
    if (stage !== "activate") return;
    setBurst((b) => b + 1);
    controls.start({ x: [0, -2, 2, -1, 0], transition: { duration: 0.4 } });
  }, [controls, stage]);

  return (
    <div className="relative z-20 mx-auto mb-0 flex w-full justify-center">
      <motion.div
        animate={controls}
        role="button"
        tabIndex={0}
        aria-label="Activate Shopify connection animation"
        onClick={runSequence}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            runSequence();
          }
        }}
        className="relative h-[80px] w-[280px] cursor-pointer select-none touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        style={{ perspective: 900 }}
      >
        <svg
          aria-hidden
          viewBox="0 0 280 80"
          className="pointer-events-none absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="rhlCableStroke" x1="0" x2="1">
              <stop offset="0%" stopColor="hsl(140 80% 55%)" />
              <stop offset="50%" stopColor="hsl(45 100% 60%)" />
              <stop offset="100%" stopColor="hsl(45 100% 70%)" />
            </linearGradient>
            <filter id="rhlCableGlow" x="-40%" y="-80%" width="180%" height="260%">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <motion.path
            d="M 86 40 C 122 24, 150 58, 174 40"
            stroke="hsl(var(--foreground) / 0.18)"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
            initial={false}
            animate={{ pathLength: stage === "idle" ? 0 : 1, opacity: stage === "idle" ? 0 : 0.75 }}
            transition={{ duration: reduce || lowPower ? 0.25 : 0.65, ease: "easeInOut" }}
          />
          <motion.path
            d="M 86 40 C 122 24, 150 58, 174 40"
            stroke="url(#rhlCableStroke)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            filter="url(#rhlCableGlow)"
            initial={false}
            animate={{ pathLength: stage === "idle" || stage === "connect" ? 0 : 1 }}
            transition={{ duration: reduce || lowPower ? 0.2 : 0.65, ease: "easeInOut" }}
          />
          {stage !== "idle" && (
            <>
              <motion.circle cx="86" cy="40" r="3" fill="hsl(140 80% 55%)" filter="url(#rhlCableGlow)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} />
              <motion.circle cx="174" cy="40" r="4.5" fill="hsl(45 100% 65%)" filter="url(#rhlCableGlow)"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: stage === "connect" ? 0 : 1, scale: stage === "connect" ? 0 : 1 }}
                transition={{ duration: 0.25 }} />
            </>
          )}
          {(stage === "transfer" || stage === "activate" || stage === "orbit") && !reduce && !lowPower && (
            <circle
              r="4.5"
              fill="hsl(45 100% 65%)"
              filter="url(#rhlCableGlow)"
              style={{
                offsetPath: "path('M 86 40 C 122 24, 150 58, 174 40')",
                animation: "reactor-pulse-travel 1.6s linear infinite",
              } as React.CSSProperties}
            />
          )}
        </svg>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute left-[48px] top-[24px] -translate-x-1/2 -translate-y-1/2"
        >
          <div className="relative flex h-10 w-10 items-center justify-center">
            <img
              src="https://cdn.simpleicons.org/shopify/95BF47"
              alt="Shopify"
              className="h-8 w-8 object-contain drop-shadow-[0_0_14px_hsl(140_80%_45%/0.45)]"
              loading="lazy"
              decoding="async"
            />
            {stage !== "idle" && (
              <motion.div
                aria-hidden
                className="absolute inset-0"
                style={{ filter: "drop-shadow(0 0 16px hsl(140 80% 50% / 0.7))" }}
                animate={{ opacity: [0.35, 0.8, 0.35] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
            )}
          </div>
        </motion.div>

        <motion.div
          className="absolute left-[204px] top-[40px] z-20 -translate-x-1/2 -translate-y-1/2"
        >
          <div
            aria-hidden="true"
            className="relative block"
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
            {stage !== "idle" && (
              <div
                aria-hidden
                className="absolute -inset-5 rounded-full blur-xl"
                style={{
                  background:
                    stage === "orbit" || stage === "activate"
                      ? "radial-gradient(circle at 50% 70%, hsl(45 100% 55% / 0.48), transparent 62%)"
                      : "transparent",
                  transition: "background .4s",
                }}
              />
            )}
            <motion.div
              animate={
                stage === "activate"
                  ? { scale: [1, 1.1, 1], y: 0 }
                  : { scale: 1, y: 0 }
              }
              transition={{ duration: 0.45 }}
              className="relative h-[60px] w-[60px]"
            >
              <img
                src={chromeBag.url}
                alt="SitebyKrickel chrome shopping bag"
                className="h-full w-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
                loading="lazy"
                decoding="async"
              />
              {/* shine effect removed per design */}
            </motion.div>
          </div>

          {hasInteracted && stage === "idle" && (
            <motion.span
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-8 font-mono text-[8px] uppercase tracking-[0.24em] text-primary/75"
              animate={reduce ? undefined : { opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            >
              Tap
            </motion.span>
          )}

          {stage === "orbit" && REACTOR_FEATURES.map((item, i) => {
            const angle = (i / REACTOR_FEATURES.length) * 360;
            const radius = i % 2 === 0 ? 52 : 66;
            const duration = i % 2 === 0 ? 22 : 30;
            const { Icon } = item;
            return (
              <motion.div
                key={item.key}
                className="pointer-events-none absolute left-1/2 top-1/2"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 + (burst ? 0.08 : 0) }}
                transition={{ delay: 0.12 * i, duration: 0.5 }}
                style={{ transformOrigin: "0 0" }}
              >
                <motion.div
                  animate={reduce ? undefined : { rotate: 360 }}
                  transition={{ duration, repeat: Infinity, ease: "linear" }}
                  style={{ transformOrigin: "0 0" }}
                >
                  <div style={{ transform: `rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg)` }}>
                    <Icon
                      aria-hidden="true"
                      className="h-[18px] w-[18px] -translate-x-1/2 -translate-y-1/2 text-primary"
                      strokeWidth={1.35}
                      style={{ filter: "drop-shadow(0 0 8px hsl(45 100% 60% / 0.75))" }}
                    />
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ReactorHeroLayer;