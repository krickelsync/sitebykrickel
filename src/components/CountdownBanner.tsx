import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

function getTarget() {
  const now = new Date();
  // End of current month at 23:59:59
  return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).getTime();
}

function calc(diff: number) {
  const clamp = Math.max(0, diff);
  const days = Math.floor(clamp / 86400000);
  const hours = Math.floor((clamp / 3600000) % 24);
  const minutes = Math.floor((clamp / 60000) % 60);
  const seconds = Math.floor((clamp / 1000) % 60);
  return { days, hours, minutes, seconds };
}

const pad = (n: number) => n.toString().padStart(2, "0");

const Cell = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <div
      className="font-mono text-3xl md:text-5xl font-bold tabular-nums leading-none px-3 md:px-5 py-2 md:py-3 rounded-md border border-border bg-card text-primary"
      style={{ fontFamily: "'JetBrains Mono', 'Space Mono', monospace" }}
    >
      {pad(value)}
    </div>
    <span className="mt-2 text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground">
      {label}
    </span>
  </div>
);

const Sep = () => (
  <span className="font-mono text-2xl md:text-4xl text-muted-foreground/60 self-start mt-2 md:mt-3">
    :
  </span>
);

const CountdownBanner = () => {
  const [target, setTarget] = useState(getTarget);
  const [time, setTime] = useState(() => calc(target - Date.now()));
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [40, -40]);
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.3, 1, 1, 0.3]);

  useEffect(() => {
    const id = setInterval(() => {
      const diff = target - Date.now();
      if (diff <= 0) {
        const next = getTarget();
        setTarget(next);
        setTime(calc(next - Date.now()));
      } else {
        setTime(calc(diff));
      }
    }, 1000);
    return () => clearInterval(id);
  }, [target]);

  return (
    <motion.section
      ref={sectionRef}
      aria-label="Promo countdown"
      className="w-full py-10 md:py-14 border-y border-border bg-background"
    >
      <motion.div
        style={{ y, opacity }}
        className="container mx-auto px-4 flex flex-col items-center text-center gap-5"
      >
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
          <p className="text-xs md:text-sm uppercase tracking-[0.25em] text-muted-foreground">
            Promo Bulan Ini Berakhir Dalam
          </p>
        </div>

        <div className="flex items-start gap-2 md:gap-3">
          <Cell value={time.days} label="Days" />
          <Sep />
          <Cell value={time.hours} label="Hours" />
          <Sep />
          <Cell value={time.minutes} label="Minutes" />
          <Sep />
          <Cell value={time.seconds} label="Seconds" />
        </div>

        <p className="text-sm text-muted-foreground max-w-md">
          Harga naik <span className="text-foreground font-semibold">Rp500K</span> setelah timer habis.
        </p>
      </motion.div>
    </motion.section>
  );
};

export default CountdownBanner;