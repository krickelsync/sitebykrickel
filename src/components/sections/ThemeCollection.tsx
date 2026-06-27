import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";

const FEATURES = [
  "Shopify 2.0 Ready",
  "Mobile-first Layout",
  "Infinite Customization",
  "Lookbook & Editorial Sections",
  "Drop Countdown & Sticky Cart",
  "Lifetime Updates",
];

const ThemeCollection = () => {
  const [removeWatermark, setRemoveWatermark] = useState(false);
  const price = removeWatermark ? 148 : 98;

  return (
    <section id="themes" className="py-24 md:py-32 border-t border-border">
      <div className="container px-4">
        <SectionHeader
          eyebrow="THE THEME"
          title="SYNC THEME"
          accent="BUILT FOR BRANDS."
        />
        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group glass-card shiny-card p-6 md:p-8 flex flex-col transition-all duration-500 hover:border-primary/40"
          >
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h3 className="font-syne font-bold uppercase text-2xl md:text-3xl tracking-tight">
                  SYNC Theme
                </h3>
                <p className="font-mono text-[10px] md:text-xs text-muted-foreground mt-1 uppercase tracking-widest">
                  1 License • {removeWatermark ? "No Watermark" : "With Footer Watermark"}
                </p>
              </div>
              <motion.span
                key={price}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-syne font-bold text-3xl md:text-4xl text-primary"
              >
                ${price}
              </motion.span>
            </div>

            {/* Watermark toggle */}
            <button
              type="button"
              role="switch"
              aria-checked={removeWatermark}
              onClick={() => setRemoveWatermark((v) => !v)}
              className="w-full flex items-center justify-between gap-4 p-4 mb-6 rounded-lg border border-border bg-background/40 hover:border-primary/40 transition-colors text-left"
            >
              <div className="flex flex-col">
                <span className="font-mono text-xs uppercase tracking-widest text-foreground">
                  Remove Footer Watermark
                </span>
                <span className="font-mono text-[10px] text-muted-foreground mt-0.5">
                  +$50 • White-label your store
                </span>
              </div>
              <span
                className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors ${
                  removeWatermark ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-background shadow transition-transform ${
                    removeWatermark ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </span>
            </button>

            <ul className="space-y-2 flex-1">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2 font-mono text-xs md:text-sm text-muted-foreground">
                  <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <a
              href="/products"
              className="mt-6 inline-flex items-center justify-center gap-2 h-12 px-6 rounded-lg bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest hover:opacity-90 transition-opacity"
            >
              Get SYNC — ${price}
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ThemeCollection;