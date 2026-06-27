import { motion, useAnimation, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
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
  const [stage, setStage] = useState<Stage>("idle");
  const [burst, setBurst] = useState(0);
  const [active, setActive] = useState<ReactorFeature | null>(null);
  const controls = useAnimation();
  const timers = useRef<number[]>([]);

  useEffect(() => { onStageChange?.(stage); }, [stage, onStageChange]);

  const runSequence = useCallback(() => {
    if (stage !== "idle") return;
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    setStage("connect");
    const speed = reduce || lowPower ? 0.55 : 1;
    const t1 = window.setTimeout(() => setStage("transfer"), 520 * speed);
    const t2 = window.setTimeout(() => setStage("activate"), 1050 * speed);
    const t3 = window.setTimeout(() => {
      setStage("orbit");
      setActive(REACTOR_FEATURES[0]);
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

  const activateReactor = useCallback(() => {
    setBurst((b) => b + 1);
    controls.start({ x: [0, -2, 2, -1, 0], transition: { duration: 0.4 } });
    if (stage === "idle") runSequence();
  }, [controls, runSequence, stage]);

  const onFeatureClick = (f: ReactorFeature) => {
    if (stage !== "orbit") return;
    setActive((cur) => (cur?.key === f.key ? null : f));
  };

  return (
    <div className="relative z-20 mx-auto -mt-2 mb-1 flex w-full justify-center md:-mt-4 md:mb-2">
      <motion.div
        animate={controls}
        className="relative h-[78px] w-[240px] select-none sm:h-[88px] sm:w-[290px] md:h-[96px] md:w-[320px]"
        style={{ perspective: 900 }}
      >
        <svg
          aria-hidden
          viewBox="0 0 380 112"
          className="pointer-events-none absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
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
            d="M 88 56 C 128 36, 174 76, 214 56 C 238 44, 258 50, 278 56"
            stroke="hsl(var(--foreground) / 0.18)"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
            initial={false}
            animate={{ pathLength: stage === "idle" ? 0 : 1, opacity: stage === "idle" ? 0 : 0.75 }}
            transition={{ duration: reduce || lowPower ? 0.25 : 0.65, ease: "easeInOut" }}
          />
          <motion.path
            d="M 88 56 C 128 36, 174 76, 214 56 C 238 44, 258 50, 278 56"
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
              <motion.circle cx="88" cy="56" r="4" fill="hsl(140 80% 55%)" filter="url(#rhlCableGlow)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} />
              <motion.circle cx="278" cy="56" r="5" fill="hsl(45 100% 65%)" filter="url(#rhlCableGlow)"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: stage === "connect" ? 0 : 1, scale: stage === "connect" ? 0 : 1 }}
                transition={{ duration: 0.25 }} />
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
              transition={{ duration: 1.2, ease: "easeInOut" }}
              style={{
                offsetPath: "path('M 88 56 C 128 36, 174 76, 214 56 C 238 44, 258 50, 278 56')",
                animation: "reactor-pulse-travel 1.2s ease-in-out",
              } as React.CSSProperties}
            />
          )}
        </svg>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute left-[30px] top-1/2 -translate-y-1/2 sm:left-[36px] md:left-[38px]"
        >
          <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-[hsl(140_60%_35%)]/45 bg-[hsl(140_45%_8%/0.76)] shadow-[0_0_24px_hsl(140_80%_45%/0.22)] backdrop-blur sm:h-14 sm:w-14 md:h-15 md:w-15">
            <svg viewBox="0 0 109 124" className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden>
              <path
                fill="#95BF47"
                d="M74.7 14.8c-.1-.5-.5-.8-.9-.8-.4 0-7.7-.6-7.7-.6s-5.1-5-5.6-5.6c-.6-.6-1.7-.4-2.1-.3-.1 0-1.1.4-2.9.9-1.7-4.9-4.6-9.4-9.9-9.4h-.5c-1.5-2-3.4-2.9-5-2.9C28.3.6 22.4 16 18.6 28L8.5 31.2c-3.1 1-3.2 1.1-3.6 4l-9.6 74.6 71.4 13.4 39-8.5C105.6 114.8 74.8 15.3 74.7 14.8z"
              />
            </svg>
            {stage !== "idle" && (
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

        <motion.div
          className="absolute left-[278px] top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 sm:left-[278px] md:left-[278px]"
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
              className="relative h-[70px] w-[70px] sm:h-[82px] sm:w-[82px] md:h-[88px] md:w-[88px]"
            >
              <img
                src={chromeBag.url}
                alt="SitebyKrickel chrome shopping bag"
                className="h-full w-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
                loading="lazy"
                decoding="async"
              />
              {stage !== "idle" && (
                <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
                  <div className="reactor-shine absolute -inset-y-4 -left-1/2 w-1/2 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                </div>
              )}
            </motion.div>
          </button>

          {!isMobile && stage === "orbit" && REACTOR_FEATURES.map((item, i) => {
            const angle = (i / REACTOR_FEATURES.length) * 360;
            const radius = i % 2 === 0 ? 62 : 78;
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
                      className={`-translate-x-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border transition ${
                        isActive
                          ? "border-primary bg-primary/20"
                          : "border-white/10 bg-background/40 hover:border-primary/60 hover:bg-primary/10"
                      }`}
                      style={{ backdropFilter: "blur(8px)" }}
                    >
                      <Icon
                        className="h-4 w-4 text-primary"
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

      {isMobile && stage === "orbit" && (
        <div className="absolute left-1/2 top-full z-30 mt-2 flex -translate-x-1/2 items-center gap-2">
          {REACTOR_FEATURES.map((item) => {
            const { Icon } = item;
            const isActive = active?.key === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onFeatureClick(item)}
                aria-label={`Show ${item.title}`}
                className={`flex h-8 w-8 items-center justify-center rounded-full border backdrop-blur transition ${
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