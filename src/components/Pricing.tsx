import VelocityText from "./VelocityText";
import SectionHeader from "./shared/SectionHeader";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { fadeIn } from "@/lib/motion";
import { useContactScroll } from "@/hooks/useContactScroll";
import shopifyBadge from "@/assets/shopify-badge.png.asset.json";

type FeatureItem = { label: string; value?: string };
type FeatureGroup = { category: string; items: FeatureItem[] };

const FEATURE_GROUPS: FeatureGroup[] = [
  {
    category: "EXPERIENCE & INTERACTIVITY",
    items: [
      { label: "Enter Page", value: "Video / Img / 3D" },
      { label: "3D Interactive Logo", value: "Spinning .glb" },
      { label: "Global Music Player", value: "Popup Equalizer" },
      { label: "Glassmorphism Header", value: "Glass Effect" },
      { label: "Custom Cursor", value: "SVG Logo" },
      { label: "Free Domain Include", value: "Included" },
      { label: "Free Email Domain", value: "Up to 10 @yourbrand.com" },
    ],
  },
  {
    category: "VISUAL & AESTHETICS",
    items: [
      { label: "Background Type", value: "Vid / Gif / Img" },
      { label: "Custom Font", value: "Upload Fonts" },
      { label: "Lookbook", value: "Hover Animation" },
      { label: "Running Marquee", value: "Animated" },
      { label: "Text Glow Effect", value: "Neon Vibe" },
      { label: "Page Preloader", value: "Custom Gif" },
    ],
  },
  {
    category: "CONVERSION BOOSTERS",
    items: [
      { label: "Sticky Add-to-Cart", value: "Floating Bar" },
      { label: "Quick Add Button", value: "Glassmorph" },
      { label: "Pre-Order System", value: "Badge & Status" },
      { label: "Size Chart Popup" },
      { label: "Stock Indicator", value: "Low Stock Alert" },
    ],
  },
  {
    category: "MARKETING",
    items: [
      { label: "Newsletter Popup", value: "Waitlist Email" },
      { label: "Social Icons", value: "More + Hover FX" },
      { label: "Shipping Status", value: "Password Page" },
      { label: "Countdown Timer" },
    ],
  },
  {
    category: "SUPPORT",
    items: [
      { label: "Revisions", value: "10× Major" },
      { label: "Turnaround", value: "2–3 Days" },
      { label: "Support", value: "VIP WhatsApp" },
      { label: "License", value: "Lifetime" },
    ],
  },
];

const Pricing = () => {
  const handleContactClick = useContactScroll();
  const [removeWatermark, setRemoveWatermark] = useState(false);
  const [installSetup, setInstallSetup] = useState(false);
  const price = 98 + (removeWatermark ? 50 : 0) + (installSetup ? 50 : 0);

  return (
    <section id="pricing" className="py-14 md:py-32">
      <div className="container px-4">
        <VelocityText />

        <SectionHeader
          eyebrow="PRICING"
          title={<span className="text-foreground">ONE THEME.</span>}
          accent="EVERYTHING INCLUDED."
          accentTone="gold"
        />

        <div className="max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-2xl border border-border/60 p-6 md:p-8 flex flex-col hover:border-primary/40 transition-colors duration-500 shadow-2xl"
          >
            {/* Background layers — softer, brighter, vignette */}
            <div className="absolute inset-0 -z-10 rounded-2xl pointer-events-none bg-[radial-gradient(140%_90%_at_50%_-10%,hsl(var(--primary)/0.28),transparent_55%),radial-gradient(100%_70%_at_100%_110%,hsl(var(--primary)/0.18),transparent_65%),linear-gradient(180deg,hsl(var(--background)/0.92),hsl(var(--background)/0.78))]" />
            <div className="absolute inset-0 -z-10 rounded-2xl pointer-events-none opacity-[0.05] bg-[linear-gradient(hsl(var(--foreground))_1px,transparent_1px),linear-gradient(90deg,hsl(var(--foreground))_1px,transparent_1px)] bg-[size:32px_32px]" />

            <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-primary-foreground font-mono text-[9px] md:text-[10px] uppercase tracking-[0.2em] shadow-lg">
              <Sparkles className="w-3 h-3" /> Most Popular
            </span>

            <div className="relative text-center pb-5 mb-5 border-b border-border/50">
              {/* Giant custom Shopify logo to the right of price */}
              <img
                src={shopifyBadge.url}
                alt=""
                aria-hidden="true"
                className="pointer-events-none select-none absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 h-36 md:h-52 w-auto opacity-[0.22] drop-shadow-[0_6px_22px_hsl(var(--primary)/0.55)]"
              />
              <span className="font-mono text-[10px] md:text-xs text-primary uppercase tracking-[0.2em]">
                SYNC Premium Theme
              </span>
              <div className="mt-2 flex items-baseline justify-center gap-1">
                <motion.span
                  key={price}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="font-syne font-bold text-5xl md:text-6xl bg-gradient-to-b from-foreground to-primary bg-clip-text text-transparent"
                >
                  ${price}
                </motion.span>
                <span className="font-mono text-xs text-muted-foreground">
                  / one-time
                </span>
              </div>
              <p className="font-mono text-[10px] md:text-xs text-muted-foreground mt-2 uppercase tracking-widest">
                Lifetime License • VIP Support
              </p>
            </div>

            {/* Compact watermark toggle */}
            <div className="relative space-y-2 mb-6">
              {[
                {
                  label: "Remove Watermark",
                  hint: "+$50 • Removes \"Powered by SitebyKrickel\" on footer",
                  value: removeWatermark,
                  set: setRemoveWatermark,
                  aria: "Toggle remove footer watermark",
                },
                {
                  label: "Install & Setup",
                  hint: "+$50 done-for-you",
                  value: installSetup,
                  set: setInstallSetup,
                  aria: "Toggle install and setup add-on",
                },
              ].map((t) => (
                <button
                  type="button"
                  key={t.label}
                  role="switch"
                  aria-checked={t.value}
                  aria-label={t.aria}
                  onClick={() => t.set((v) => !v)}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg border text-left transition-colors ${
                    t.value
                      ? "border-primary/50 bg-primary/5"
                      : "border-border/60 bg-background/40 hover:border-border"
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-mono text-[11px] uppercase tracking-widest text-foreground">
                      {t.label}
                    </span>
                    <span className="font-mono text-[9px] text-muted-foreground">
                      {t.hint}
                    </span>
                  </div>
                  <span
                    aria-hidden="true"
                    className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors ${
                      t.value ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-background shadow transition-transform ${
                        t.value ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </span>
                </button>
              ))}
            </div>

            <div className="relative flex-1 space-y-5 mb-6">
              {FEATURE_GROUPS.map((group) => (
                <div key={group.category}>
                  <h4 className="font-mono text-[10px] md:text-[11px] text-primary uppercase tracking-[0.2em] mb-2">
                    {group.category}
                  </h4>
                  <ul className="space-y-1.5">
                    {group.items.map((item) => (
                      <li key={item.label} className="flex items-start gap-2.5">
                        <Check className="mt-0.5 w-3.5 h-3.5 shrink-0 text-primary" strokeWidth={3} />
                        <span className="font-mono text-xs md:text-sm text-muted-foreground">
                          {item.label}
                          {item.value && (
                            <>
                              :{" "}
                              <span className="text-foreground font-semibold">
                                {item.value}
                              </span>
                            </>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

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
