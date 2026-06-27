import { motion } from "framer-motion";

interface Props {
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  bgVariant?: "glow" | "grid" | "none";
}

const CtaBanner = ({ title, subtitle, ctaLabel, ctaHref, bgVariant = "glow" }: Props) => (
  <div className="relative overflow-hidden rounded-3xl border border-border glass-card p-10 md:p-16 text-center max-w-4xl mx-auto">
    {bgVariant === "glow" && (
      <>
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/30 rounded-full blur-3xl animate-pulse-glow" aria-hidden />
        <div className="absolute -bottom-20 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-pulse-glow" aria-hidden />
      </>
    )}
    {bgVariant === "grid" && <div className="absolute inset-0 hero-grid-overlay opacity-30" aria-hidden />}
    <motion.h3
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative font-display text-3xl md:text-5xl font-extrabold uppercase tracking-tight"
    >
      {title}
    </motion.h3>
    {subtitle && <p className="relative mt-4 text-muted-foreground font-mono">{subtitle}</p>}
    {ctaLabel && (
      <a href={ctaHref ?? "#"} className="relative inline-flex mt-8 px-8 py-4 rounded-full bg-primary text-primary-foreground font-display font-bold uppercase tracking-wider hover:opacity-90 transition">
        {ctaLabel}
      </a>
    )}
  </div>
);

export default CtaBanner;