import VelocityText from "./VelocityText";
import SectionHeader from "./shared/SectionHeader";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { fadeIn } from "@/lib/motion";
import { useContactScroll } from "@/hooks/useContactScroll";

const FEATURES = [
  "Shopify 2.0 Ready",
  "Mobile-first Responsive Layout",
  "Infinite Customization Options",
  "Product Page Builder",
  "Lookbook & Editorial Sections",
  "Drop Countdown & Sticky Cart",
  "Mega Menu Layouts",
  "Trust Badges Pack",
  "Unlimited Store License",
  "Lifetime Updates",
  "Priority Email Support",
];

const Pricing = () => {
  const handleContactClick = useContactScroll();
  const [removeWatermark, setRemoveWatermark] = useState(false);
  const price = removeWatermark ? 148 : 98;

  return (
    <section id="pricing" className="py-24 md:py-32">
      <div className="container px-4">
        <VelocityText />

        <SectionHeader
          eyebrow="PRICING"
          title={<span className="text-foreground">ONE THEME.</span>}
          accent="EVERYTHING INCLUDED."
          accentTone="gold"
        />

        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative glass-card shiny-card rounded-2xl p-6 md:p-8 flex flex-col hover:border-primary/40 transition-all duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 pointer-events-none rounded-2xl" />

            <div className="relative text-center pb-5 mb-5 border-b border-border/50">
              <span className="font-mono text-[10px] md:text-xs text-primary uppercase tracking-[0.2em]">
                SYNC Premium Theme
              </span>
              <div className="mt-2 flex items-baseline justify-center gap-1">
                <motion.span
                  key={price}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-syne font-bold text-5xl md:text-6xl text-primary glow-text"
                >
                  ${price}
                </motion.span>
                <span className="font-mono text-xs text-muted-foreground">
                  / one-time
                </span>
              </div>
              <p className="font-mono text-[10px] md:text-xs text-muted-foreground mt-2 uppercase tracking-widest">
                {removeWatermark ? "No Watermark" : "With Footer Watermark"}
              </p>
            </div>

            {/* Compact watermark toggle */}
            <div className="relative flex items-center justify-between gap-3 mb-5 px-3 py-2 rounded-lg border border-border/60 bg-background/40">
              <div className="flex flex-col">
                <span className="font-mono text-[11px] uppercase tracking-widest text-foreground">
                  Remove Watermark
                </span>
                <span className="font-mono text-[9px] text-muted-foreground">
                  +$50 white-label
                </span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={removeWatermark}
                aria-label="Toggle remove footer watermark"
                onClick={() => setRemoveWatermark((v) => !v)}
                className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors ${
                  removeWatermark ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-background shadow transition-transform ${
                    removeWatermark ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <ul className="relative flex-1 space-y-2.5 mb-6">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Check className="w-2.5 h-2.5" strokeWidth={3} />
                  </span>
                  <span className="font-mono text-xs md:text-sm text-muted-foreground">
                    {f}
                  </span>
                </li>
              ))}
            </ul>

            <a
              href="/about#contact"
              onClick={handleContactClick}
              className="relative group inline-flex items-center justify-center gap-2 h-12 px-6 rounded-lg bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest overflow-hidden hover:glow-box transition-all"
            >
              <span className="relative z-10 inline-flex items-center gap-2">
                Get SYNC — ${price}
                <ArrowRight className="w-4 h-4" />
              </span>
              <div className="absolute inset-0 bg-foreground translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </a>
          </motion.div>
        </div>

        <motion.p
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="font-mono text-xs text-muted-foreground text-center mt-8"
        >
          Secure payment • Setup starts within 24 hours
        </motion.p>
      </div>
    </section>
  );
};

export default Pricing;
