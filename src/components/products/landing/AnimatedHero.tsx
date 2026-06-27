import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  badge?: string;
  ctaLabel?: string;
  ctaHref?: string;
  bgVariant?: "grid" | "prism" | "noise" | "none";
}

const AnimatedHero = ({ eyebrow, title, subtitle, badge, ctaLabel, ctaHref, bgVariant = "grid" }: Props) => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0, 1, 1, 0.3]);

  return (
    <section ref={ref} className="relative min-h-[70vh] flex items-center justify-center overflow-hidden rounded-3xl border border-border">
      {bgVariant === "grid" && <div className="absolute inset-0 hero-grid-overlay opacity-40" aria-hidden />}
      {bgVariant === "noise" && <div className="absolute inset-0 hero-noise opacity-30" aria-hidden />}
      {bgVariant === "prism" && (
        <>
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse-glow" aria-hidden />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-pulse-glow" aria-hidden />
        </>
      )}
      <motion.div style={{ y, opacity }} className="relative z-10 text-center max-w-4xl px-6 py-20">
        {badge && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-3 py-1 mb-6 text-[10px] font-mono uppercase tracking-widest bg-primary/10 text-primary border border-primary/30 rounded-full"
          >
            {badge}
          </motion.span>
        )}
        {eyebrow && (
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">{eyebrow}</p>
        )}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-display text-4xl md:text-6xl lg:text-7xl font-extrabold uppercase leading-[0.95] tracking-tight"
        >
          {title.split("\n").map((line, i) => (
            <span key={i} className="block">{line}</span>
          ))}
        </motion.h2>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-6 text-base md:text-lg text-muted-foreground font-mono max-w-2xl mx-auto"
          >
            {subtitle}
          </motion.p>
        )}
        {ctaLabel && (
          <motion.a
            href={ctaHref ?? "#"}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="inline-flex items-center mt-8 px-8 py-4 rounded-full bg-primary text-primary-foreground font-display font-bold uppercase tracking-wider hover:opacity-90 transition"
          >
            {ctaLabel}
          </motion.a>
        )}
      </motion.div>
    </section>
  );
};

export default AnimatedHero;