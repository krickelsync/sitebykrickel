import VelocityText from "./VelocityText";
import SectionHeader from "./shared/SectionHeader";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { fadeIn } from "@/lib/motion";
import { useContactScroll } from "@/hooks/useContactScroll";
import shopifyBadge from "@/assets/shopify-badge.png.asset.json";
import { typography, textSize } from "@/components/ui/typography";

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

        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-xl border border-border bg-card p-6 md:p-10 flex flex-col transition-colors duration-300 hover:border-foreground/30"
          >
            {/* Watermark logo — bottom-right corner, very subtle */}
            <img
              src={shopifyBadge.url}
              alt=""
              aria-hidden="true"
              className="pointer-events-none select-none absolute bottom-4 right-4 h-20 md:h-24 w-auto opacity-[0.06]"
            />

            {/* Header row — chip + price, flat HeroUI style */}
            <div className="relative flex items-start justify-between gap-4 pb-6 mb-6 border-b border-border">
              <div>
                <span className={`inline-block px-2 py-0.5 rounded-md border border-border ${typography.eyebrow}`}>
                  Premium
                </span>
                <h3 className={`mt-3 font-syne font-bold text-foreground ${typography.h3}`}>
                  SYNC Theme
                </h3>
                <p className={`${typography.meta} mt-1`}>
                  Lifetime license · VIP support
                </p>
              </div>
              <div className="text-right shrink-0">
                <motion.div
                  key={price}
                  initial={{ opacity: 0, y: -2 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={typography.price}
                >
                  ${price}
                </motion.div>
                <span className={`${typography.eyebrow} mt-1 inline-block`}>
                  one-time
                </span>
              </div>
            </div>

            {/* Inline add-on toggles — Stripe-style row */}
            <div className="relative space-y-px mb-6 border border-border rounded-lg overflow-hidden">
              {[
                {
                  label: "Remove Watermark",
                  hint: "Hide \"Powered by SitebyKrickel\" in footer",
                  price: "+$50",
                  value: removeWatermark,
                  set: setRemoveWatermark,
                  aria: "Toggle remove footer watermark",
                },
                {
                  label: "Install & Setup",
                  hint: "Done-for-you Shopify installation",
                  price: "+$50",
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
                  className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-left transition-colors border-b border-border last:border-b-0 ${
                    t.value ? "bg-foreground/[0.03]" : "hover:bg-foreground/[0.02]"
                  }`}
                >
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono font-medium text-foreground ${textSize.ui}`}>
                        {t.label}
                      </span>
                      <span className={typography.eyebrow}>
                        {t.price}
                      </span>
                    </div>
                    <span className={`${typography.meta} mt-0.5 truncate`}>
                      {t.hint}
                    </span>
                  </div>
                  <span
                    aria-hidden="true"
                    className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors ${
                      t.value ? "bg-foreground" : "bg-muted"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-background transition-transform ${
                        t.value ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </span>
                </button>
              ))}
            </div>

            {/* Feature groups — flat dash-prefixed list, 2-col on desktop */}
            <div className="relative flex-1 space-y-6 mb-8">
              {FEATURE_GROUPS.map((group) => (
                <div key={group.category}>
                  <h4 className={`${typography.eyebrow} mb-3`}>
                    — {group.category}
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
                    {group.items.map((item) => (
                      <li key={item.label} className={`flex items-baseline gap-2 leading-snug ${textSize.ui}`}>
                        <span className="text-muted-foreground/50 font-mono">·</span>
                        <span className="font-mono text-muted-foreground">
                          {item.label}
                          {item.value && (
                            <span className="text-foreground"> — {item.value}</span>
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
              className="prism-cta group relative inline-flex items-center justify-center w-full mt-2"
              aria-label={`Get SYNC for $${price}`}
            >
              <span aria-hidden="true" className="prism-cta__glow" />
              <span className={`prism-cta__inner ${textSize.ui}`}>
                Get SYNC — ${price}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </a>
          </motion.div>
        </div>

        <motion.p
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className={`${typography.meta} text-center mt-6`}
        >
          Secure payment · Setup starts within 24 hours
        </motion.p>
      </div>
    </section>
  );
};

export default Pricing;
