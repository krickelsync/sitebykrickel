import { motion, useInView, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface Stat { value: string; label: string }

const Counter = ({ value }: { value: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    const num = parseFloat(value.replace(/[^\d.]/g, ""));
    if (!inView || isNaN(num)) return;
    const suffix = value.replace(/[\d.,\s]/g, "");
    const prefix = value.match(/^[^\d]*/)?.[0] ?? "";
    const controls = animate(0, num, {
      duration: 1.5, ease: "easeOut",
      onUpdate: (v) => setDisplay(`${prefix}${Math.round(v).toLocaleString()}${suffix}`),
    });
    return () => controls.stop();
  }, [inView, value]);
  return <span ref={ref}>{display}</span>;
};

const StatsStrip = ({ items }: { items: Stat[] }) => {
  if (!items?.length) return null;
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto py-12 border-y border-border">
      {items.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="text-center"
        >
          <p className="font-display text-3xl md:text-5xl font-black text-primary"><Counter value={s.value} /></p>
          <p className="mt-2 text-xs font-mono uppercase tracking-widest text-muted-foreground">{s.label}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsStrip;