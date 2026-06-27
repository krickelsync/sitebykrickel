import { motion, useAnimation, useMotionValue, useTransform, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
import { ShoppingCart, Smartphone, Zap, Box, Package } from "lucide-react";
import chromeBag from "@/assets/chrome-bag.png.asset.json";

/**
 * ReactorHero — cinematic "Shopify → SitebyKrickel" energy connection
 * Drop-in section. Does NOT replace the main Hero.
 */
const ORBIT_ICONS = [
  { Icon: ShoppingCart, label: "Cart" },
  { Icon: Package, label: "Product" },
  { Icon: Smartphone, label: "Mobile" },
  { Icon: Zap, label: "Speed" },
  { Icon: Box, label: "3D" },
] as const;

const ReactorHero = () => {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState<"idle" | "connect" | "transfer" | "activate" | "orbit">("idle");
  const [burst, setBurst] = useState(0);
  const controls = useAnimation();

  // Mouse parallax for chrome bag
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotX = useTransform(my, [-1, 1], [10, -10]);
  const rotY = useTransform(mx, [-1, 1], [-12, 12]);
  const tx = useTransform(mx, [-1, 1], [-8, 8]);
  const ty = useTransform(my, [-1, 1], [-6, 6]);

  const onMove = useCallback((e: React.MouseEvent) => {
    const r = stageRef.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top) / r.height) * 2 - 1);
  }, [mx, my]);

  const onLeave = useCallback(() => { mx.set(0); my.set(0); }, [mx, my]);

  // Click-triggered sequence (no autoplay)
  const runSequence = useCallback(() => {
    if (stage !== "idle" && stage !== "orbit") return;
    setStage("connect");
    const t1 = setTimeout(() => setStage("transfer"), 1100);
    const t2 = setTimeout(() => setStage("activate"), 2000);
    const t3 = setTimeout(() => setStage("orbit"), 2700);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [stage]);

  // Subtle repeating pulse during orbit
  const [pulseTick, setPulseTick] = useState(0);
  useEffect(() => {
    if (stage !== "orbit" || reduce) return;
    const id = setInterval(() => setPulseTick((n) => n + 1), 4200);
    return () => clearInterval(id);
  }, [stage, reduce]);

  const onStageClick = () => {
    setBurst((b) => b + 1);
    controls.start({ x: [0, -3, 3, -2, 0], transition: { duration: 0.4 } });
    if (stage === "idle") runSequence();
  };

  useEffect(() => {
    if (reduce) setStage("orbit");
  }, [reduce]);

  return (
    <section
      ref={sectionRef}
      aria-label="SYNC reactor showcase"
      className="relative w-full overflow-hidden py-20 md:py-28 bg-background"
    >
      {/* Ambient glow only — grid removed for cleaner luxury feel */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(45 100% 55% / 0.08) 0%, transparent 65%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      <div className="container relative z-10 px-4">
        <div className="text-center mb-10 md:mb-14">
          <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
            Powered by Shopify · Engineered by SitebyKrickel
          </p>
          <h2 className="font-syne text-3xl sm:text-4xl md:text-6xl font-extrabold uppercase tracking-tight">
            One Plug. <span style={{ color: "hsl(45 100% 58%)" }}>Infinite Commerce.</span>
          </h2>
        </div>

        <motion.div
          ref={stageRef}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          onClick={onStageClick}
          animate={controls}
          className="relative mx-auto h-[420px] sm:h-[500px] md:h-[600px] w-full max-w-5xl select-none cursor-pointer"
          style={{ perspective: 1200 }}
        >
          {/* Orbit rings — only after activation */}
          {stage === "orbit" && (
            <>
              {[1, 1.35, 1.7].map((s, i) => (
                <motion.div
                  key={i}
                  aria-hidden
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 0.08, scale: s }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/40"
                  style={{ width: 260, height: 260 }}
                />
              ))}
            </>
          )}

          {/* Cable SVG (Shopify → Chrome bag) */}
          <svg
            aria-hidden
            viewBox="0 0 1000 600"
            className="absolute inset-0 w-full h-full pointer-events-none"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="cableStroke" x1="0" x2="1">
                <stop offset="0%" stopColor="hsl(140 80% 55%)" />
                <stop offset="50%" stopColor="hsl(45 100% 60%)" />
                <stop offset="100%" stopColor="hsl(45 100% 70%)" />
              </linearGradient>
              <filter id="cableGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            {/* Cable outer (chrome tube) */}
            <motion.path
              d="M 200 300 C 350 200, 500 400, 650 300"
              stroke="hsl(0 0% 30%)"
              strokeWidth="10"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: stage === "idle" ? 0 : 1,
                opacity: stage === "idle" ? 0 : 0.5,
              }}
              transition={{ duration: 1.0, ease: "easeInOut" }}
            />
            {/* Cable inner (neon energy) */}
            <motion.path
              d="M 200 300 C 350 200, 500 400, 650 300"
              stroke="url(#cableStroke)"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              filter="url(#cableGlow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: stage === "idle" || stage === "connect" ? 0 : 1 }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
            />
            {/* Connector nodes at both ends */}
            {stage !== "idle" && (
              <>
                <motion.circle cx="200" cy="300" r="6" fill="hsl(140 80% 55%)" filter="url(#cableGlow)"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} />
                <motion.circle cx="650" cy="300" r="7" fill="hsl(45 100% 65%)" filter="url(#cableGlow)"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: stage === "connect" ? 0 : 1, scale: stage === "connect" ? 0 : 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }} />
              </>
            )}
            {/* Repeating pulse traveling along cable */}
            {(stage === "orbit") && (
              <motion.circle
                key={pulseTick}
                r="6"
                fill="hsl(45 100% 65%)"
                filter="url(#cableGlow)"
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

          {/* Shopify icon (left) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute left-[8%] sm:left-[12%] top-1/2 -translate-y-1/2 z-10"
          >
            <div className="relative flex items-center justify-center w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-[#0b1f12]/60 backdrop-blur border border-[hsl(140_60%_35%)]/40 shadow-[0_0_30px_hsl(140_80%_45%/0.25)]">
              <svg viewBox="0 0 109 124" className="w-7 h-7 sm:w-10 sm:h-10" aria-hidden>
                <path
                  fill="#95BF47"
                  d="M74.7 14.8c-.1-.5-.5-.8-.9-.8-.4 0-7.7-.6-7.7-.6s-5.1-5-5.6-5.6c-.6-.6-1.7-.4-2.1-.3-.1 0-1.1.4-2.9.9-1.7-4.9-4.6-9.4-9.9-9.4h-.5c-1.5-2-3.4-2.9-5-2.9C28.3.6 22.4 16 18.6 28L8.5 31.2c-3.1 1-3.2 1.1-3.6 4l-9.6 74.6 71.4 13.4 39-8.5C105.6 114.8 74.8 15.3 74.7 14.8zM50.8 18.7l-4.7 1.5c0-.3 0-.7 0-1 0-3.1-.4-5.5-1.1-7.5 2.7.3 4.6 3.4 5.8 7zm-9.3-6.9c.8 2 1.3 4.9 1.3 8.8v.5l-9.7 3c1.9-7.2 5.4-10.6 8.4-12.3zm-3.7-3.5c.5 0 1.1.2 1.7.5-3.9 1.8-8.1 6.4-9.9 15.7l-7.7 2.4C25.1 19 30.9 8.3 37.8 8.3z"
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
            <p className="mt-2 text-center font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Shopify</p>
          </motion.div>

          {/* Chrome Bag (right/center) with 3D tilt */}
          <motion.div
            style={{ rotateX: rotX, rotateY: rotY, x: tx, y: ty, transformStyle: "preserve-3d" }}
            className="absolute left-[58%] sm:left-[62%] top-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
          >
            <div className="relative">
              {/* shockwave */}
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
              {/* bottom glow */}
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
                className="relative w-40 h-40 sm:w-56 sm:h-56 md:w-72 md:h-72"
              >
                <img
                  src={chromeBag.url}
                  alt="SitebyKrickel chrome shopping bag — S monogram"
                  className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
                  loading="lazy"
                  decoding="async"
                />
                {/* chrome shine sweep */}
                <div
                  aria-hidden
                  key={`shine-${stage}-${burst}`}
                  className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none"
                >
                  <div className="reactor-shine absolute -inset-y-4 -left-1/2 w-1/2 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/35 to-transparent" />
                </div>
              </motion.div>

              {/* Orbiting feature icons — clean line icons, no boxes */}
              {stage === "orbit" && ORBIT_ICONS.map((item, i) => {
                const angle = (i / ORBIT_ICONS.length) * 360;
                const radius = i % 2 === 0 ? 150 : 190;
                const duration = i % 2 === 0 ? 22 : 30;
                const { Icon } = item;
                return (
                  <motion.div
                    key={item.label}
                    aria-hidden
                    className="absolute left-1/2 top-1/2"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 + (burst ? 0.12 : 0) }}
                    transition={{ delay: 0.12 * i, duration: 0.5 }}
                    style={{ transformOrigin: "0 0" }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration, repeat: Infinity, ease: "linear" }}
                      style={{ transformOrigin: "0 0" }}
                    >
                      <div
                        style={{ transform: `rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg)` }}
                      >
                        <motion.div
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 3 + i * 0.2, repeat: Infinity, ease: "easeInOut" }}
                          className="-translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full"
                          style={{
                            background: "radial-gradient(circle, hsl(45 100% 55% / 0.08), transparent 70%)",
                          }}
                        >
                          <Icon
                            className="w-5 h-5 sm:w-6 sm:h-6 text-primary"
                            strokeWidth={1.25}
                            style={{ filter: "drop-shadow(0 0 6px hsl(45 100% 60% / 0.7))" }}
                          />
                        </motion.div>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>

        {stage === "idle" && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.6 }}
            className="text-center font-mono text-[9px] uppercase tracking-[0.35em] text-muted-foreground/60 mt-6"
          >
            Click to activate theme engine
          </motion.p>
        )}
      </div>
    </section>
  );
};

export default ReactorHero;