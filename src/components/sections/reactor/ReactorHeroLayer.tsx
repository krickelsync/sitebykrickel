import { motion, useAnimation, useMotionValue, useTransform, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
import chromeBag from "@/assets/chrome-bag.png.asset.json";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLowPower } from "@/hooks/useLowPower";
import { REACTOR_FEATURES, type ReactorFeature } from "./features";
import FeatureCard from "./FeatureCard";

type Stage = "idle" | "connect" | "transfer" | "activate" | "orbit";

interface Props {
  onStageChange?: (s: Stage) => void;
}

const ReactorHeroLayer = ({ onStageChange }: Props) => {
  const reduce = useReducedMotion();
  const lowPower = useLowPower();
  const isMobile = useIsMobile();
  const stageRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState<Stage>("idle");
  const [burst, setBurst] = useState(0);
  const [active, setActive] = useState<ReactorFeature | null>(null);
  const controls = useAnimation();

  useEffect(() => { onStageChange?.(stage); }, [stage, onStageChange]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotX = useTransform(my, [-1, 1], [8, -8]);
  const rotY = useTransform(mx, [-1, 1], [-10, 10]);
  const tx = useTransform(mx, [-1, 1], [-6, 6]);
  const ty = useTransform(my, [-1, 1], [-4, 4]);

  const onMove = useCallback((e: React.MouseEvent) => {
    if (isMobile || lowPower) return;
    const r = stageRef.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top) / r.height) * 2 - 1);
  }, [mx, my, isMobile, lowPower]);

  const onLeave = useCallback(() => { mx.set(0); my.set(0); }, [mx, my]);

  const runSequence = useCallback(() => {
    if (stage !== "idle") return;
    setStage("connect");
    const t1 = setTimeout(() => setStage("transfer"), 1100);
    const t2 = setTimeout(() => setStage("activate"), 2000);
    const t3 = setTimeout(() => setStage("orbit"), 2700);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [stage]);

  const [pulseTick, setPulseTick] = useState(0);
  useEffect(() => {
    if (stage !== "orbit" || reduce || lowPower) return;
    const id = setInterval(() => setPulseTick((n) => n + 1), 4200);
    return () => clearInterval(id);
  }, [stage, reduce, lowPower]);

  const activateReactor = useCallback(() => {
    setBurst((b) => b + 1);
    controls.start({ x: [0, -2, 2, -1, 0], transition: { duration: 0.4 } });
    if (stage === "idle") runSequence();
  }, [controls, runSequence, stage]);

  useEffect(() => {
    if (reduce || lowPower) setStage("orbit");
  }, [reduce, lowPower]);

  const onFeatureClick = (f: ReactorFeature) => {
    setActive((cur) => (cur?.key === f.key ? null : f));
  };

  if (lowPower) {
    return (
      <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-20">
        <img
          src={chromeBag.url}
          alt=""
          className="w-56 h-56 md:w-72 md:h-72 object-contain"
          loading="lazy"
          decoding="async"
        />
      </div>
    );
  }

  const stageScale = isMobile ? 0.6 : 0.85;

  return (
    <div className="pointer-events-none absolute inset-0 z-[4] flex items-center justify-center">
      <motion.div
        ref={stageRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        animate={controls}
        className="pointer-events-none relative h-[420px] sm:h-[500px] md:h-[600px] w-full max-w-5xl select-none"
        style={{ perspective: 1200, transform: `scale(${stageScale})`, opacity: 0.85 }}
      >
        {stage === "orbit" && (
          <>
            {[1, 1.35, 1.7].map((s, i) => (
              <motion.div
                key={i}
                aria-hidden
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 0.06, scale: s }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/40"
                style={{ width: 260, height: 260 }}
              />
            ))}
          </>
        )}

        <svg
          aria-hidden
          viewBox="0 0 1000 600"
          className="absolute inset-0 h-full w-full pointer-events-none"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="rhlCableStroke" x1="0" x2="1">
              <stop offset="0%" stopColor="hsl(140 80% 55%)" />
              <stop offset="50%" stopColor="hsl(45 100% 60%)" />
              <stop offset="100%" stopColor="hsl(45 100% 70%)" />
            </linearGradient>
            <filter id="rhlCableGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <motion.path
            d="M 200 300 C 350 200, 500 400, 650 300"
            stroke="hsl(0 0% 30%)"
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: stage === "idle" ? 0 : 1, opacity: stage === "idle" ? 0 : 0.45 }}
            transition={{ duration: 1.0, ease: "easeInOut" }}
          />
          <motion.path
            d="M 200 300 C 350 200, 500 400, 650 300"
            stroke="url(#rhlCableStroke)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            filter="url(#rhlCableGlow)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: stage === "idle" || stage === "connect" ? 0 : 1 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
          />
          {stage !== "idle" && (
            <>
              <motion.circle cx="200" cy="300" r="6" fill="hsl(140 80% 55%)" filter="url(#rhlCableGlow)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} />
              <motion.circle cx="650" cy="300" r="7" fill="hsl(45 100% 65%)" filter="url(#rhlCableGlow)"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: stage === "connect" ? 0 : 1, scale: stage === "connect" ? 0 : 1 }}
                transition={{ duration: 0.3, delay: 0.1 }} />
            </>
          )}
          {stage === "orbit" && (
            <motion.circle
              key={pulseTick}
              r="6"
              fill="hsl(45 100% 65%)"
              filter="url(#rhlCableGlow)"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
              style={{
                offsetPath: "path('M 200 300 C 350 200, 500 400, 650 300')",
                animation: "reactor-pulse-travel 1.4s ease-in-out",
              } as React.CSSProperties}
            />
          )}
        </svg>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute left-[8%] top-1/2 -translate-y-1/2 sm:left-[12%]"
        >
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-[hsl(140_60%_35%)]/40 bg-[#0b1f12]/60 shadow-[0_0_30px_hsl(140_80%_45%/0.25)] backdrop-blur sm:h-20 sm:w-20">
            <svg viewBox="0 0 109 124" className="h-7 w-7 sm:h-10 sm:w-10" aria-hidden>
              <path
                fill="#95BF47"
                d="M74.7 14.8c-.1-.5-.5-.8-.9-.8-.4 0-7.7-.6-7.7-.6s-5.1-5-5.6-5.6c-.6-.6-1.7-.4-2.1-.3-.1 0-1.1.4-2.9.9-1.7-4.9-4.6-9.4-9.9-9.4h-.5c-1.5-2-3.4-2.9-5-2.9C28.3.6 22.4 16 18.6 28L8.5 31.2c-3.1 1-3.2 1.1-3.6 4l-9.6 74.6 71.4 13.4 39-8.5C105.6 114.8 74.8 15.3 74.7 14.8z"
              />
            </svg>
            <motion.div
              aria-hidden
              className="absolute inset-0 rounded-full"
              style={{ boxShadow: "0 0 40px hsl(140 80% 50% / 0.6)" }}
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2.4, repeat: Infinity }}
            />
          </div>
        </motion.div>

        <motion.div
          style={isMobile ? undefined : { rotateX: rotX, rotateY: rotY, x: tx, y: ty, transformStyle: "preserve-3d" }}
          className="absolute left-[58%] top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 sm:left-[62%]"
        >
          <button
            type="button"
            onClick={activateReactor}
            aria-label="Activate theme reactor"
            className="pointer-events-auto relative block cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
            <div
              aria-hidden
              className="absolute -inset-8 rounded-full blur-2xl"
              style={{
                background:
                  stage === "orbit" || stage === "activate"
                    ? "radial-gradient(circle at 50% 70%, hsl(45 100% 55% / 0.55), transparent 60%)"
                    : "transparent",
                transition: "background .6s",
              }}
            />
            <motion.div
              animate={
                stage === "activate"
                  ? { scale: [1, 1.08, 1], y: 0 }
                  : stage === "idle"
                  ? { scale: 1, y: [0, -6, 0] }
                  : { scale: 1, y: 0 }
              }
              transition={
                stage === "idle"
                  ? { duration: 4, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 0.6 }
              }
              className="relative h-40 w-40 sm:h-56 sm:w-56 md:h-72 md:w-72"
            >
              <img
                src={chromeBag.url}
                alt="SitebyKrickel chrome shopping bag"
                className="h-full w-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
                loading="lazy"
                decoding="async"
              />
              <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
                <div className="reactor-shine absolute -inset-y-4 -left-1/2 w-1/2 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              </div>
            </motion.div>
          </button>

          {!isMobile && stage === "orbit" && REACTOR_FEATURES.map((item, i) => {
            const angle = (i / REACTOR_FEATURES.length) * 360;
            const radius = i % 2 === 0 ? 150 : 190;
            const duration = i % 2 === 0 ? 22 : 30;
            const { Icon } = item;
            const isActive = active?.key === item.key;
            return (
              <motion.div
                key={item.key}
                className="absolute left-1/2 top-1/2"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 + (burst ? 0.12 : 0) }}
                transition={{ delay: 0.12 * i, duration: 0.5 }}
                style={{ transformOrigin: "0 0" }}
              >
                <motion.div
                  animate={reduce ? undefined : { rotate: 360 }}
                  transition={{ duration, repeat: Infinity, ease: "linear" }}
                  style={{ transformOrigin: "0 0" }}
                >
                  <div style={{ transform: `rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg)` }}>
                    <button
                      type="button"
                      onClick={() => onFeatureClick(item)}
                      aria-label={`Show ${item.title}`}
                      className={`pointer-events-auto -translate-x-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border transition sm:h-12 sm:w-12 ${
                        isActive
                          ? "border-primary bg-primary/20"
                          : "border-white/10 bg-background/40 hover:border-primary/60 hover:bg-primary/10"
                      }`}
                      style={{ backdropFilter: "blur(8px)" }}
                    >
                      <Icon
                        className="h-5 w-5 text-primary sm:h-6 sm:w-6"
                        strokeWidth={1.25}
                        style={{ filter: "drop-shadow(0 0 6px hsl(45 100% 60% / 0.7))" }}
                      />
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>

      {isMobile && (
        <div className="pointer-events-auto absolute bottom-40 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3">
          {REACTOR_FEATURES.map((item) => {
            const { Icon } = item;
            const isActive = active?.key === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onFeatureClick(item)}
                aria-label={`Show ${item.title}`}
                className={`flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur transition ${
                  isActive
                    ? "border-primary bg-primary/20"
                    : "border-white/10 bg-background/60"
                }`}
              >
                <Icon className="h-4 w-4 text-primary" strokeWidth={1.25} />
              </button>
            );
          })}
        </div>
      )}

      <FeatureCard feature={active} isMobile={isMobile} onClose={() => setActive(null)} />
    </div>
  );
};

export default ReactorHeroLayer;