import VelocityText from "./VelocityText";
import SectionHeader from "./shared/SectionHeader";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Palette,
  Zap,
  ShoppingBag,
  Megaphone,
  FileText,
  Rocket,
  type LucideIcon,
} from "lucide-react";
import { fadeIn } from "@/lib/motion";
import { useContactScroll } from "@/hooks/useContactScroll";
import { useIsMobile } from "@/hooks/use-mobile";
import shopifyBadge from "@/assets/shopify-badge.png.asset.json";
import { typography, textSize } from "@/components/ui/typography";

type FeatureItem = { label: string; value?: string };
type FeatureGroup = {
  category: string;
  icon: LucideIcon;
  items: FeatureItem[];
};

const STATS: { label: string; value: string }[] = [
  { label: "Sections", value: "18" },
  { label: "Templates", value: "10+" },
  { label: "Snippets", value: "15" },
  { label: "Settings", value: "397" },
];

const FEATURE_GROUPS: FeatureGroup[] = [
  {
    category: "Total Customization",
    icon: Palette,
    items: [
      { label: "Color schemes", value: "20 presets" },
      { label: "Animated gradient BG", value: "3-color drift" },
      { label: "Background", value: "Solid / Image / GIF / MP4" },
      { label: "Custom fonts", value: "50+ Shopify & Google" },
      { label: "Custom cursor", value: "Your logo" },
      { label: "Custom icons", value: "Header / cart / account" },
      { label: "3D Logo .glb", value: "Header + Home" },
    ],
  },
  {
    category: "SYNC Features",
    icon: Zap,
    items: [
      { label: "Enter Page 3D", value: "Auto-rotate + skybox" },
      { label: "Image Slideshow FX", value: "Grain · CRT · Glitch" },
      { label: "Lookbook bento grid", value: "Auto asymmetric" },
      { label: "Drop Countdown", value: "Auto It's Live" },
      { label: "Product Slideshow", value: "Carousel + blueprint" },
      { label: "Live clock + timezone", value: "Hero overlay" },
    ],
  },
  {
    category: "Shopping & Conversion",
    icon: ShoppingBag,
    items: [
      { label: "Quick Add + Cart Drawer", value: "With notes" },
      { label: "Quick View Modal" },
      { label: "Wishlist", value: "Heart-pop" },
      { label: "Sticky Add-to-Cart", value: "Desktop + Mobile" },
      { label: "Hover image swap" },
      { label: "Size guide modal" },
      { label: "Preorder system", value: "Badge & status" },
    ],
  },
  {
    category: "Engagement & Marketing",
    icon: Megaphone,
    items: [
      { label: "Marketing popup", value: "Discount + email" },
      { label: "Page loader", value: "Custom GIF" },
      { label: "Music player", value: "Up to 3 tracks" },
      { label: "Announcement marquee" },
      { label: "Animated shine text" },
      { label: "Fullscreen search overlay" },
      { label: "Region / currency selector" },
    ],
  },
  {
    category: "Ready-to-use Pages",
    icon: FileText,
    items: [
      { label: "About · Contact · FAQ" },
      { label: "Shipping · Size Chart" },
      { label: "Lookbook · Preorder · Wishlist" },
      { label: "Experimental", value: "Drag-drop builder" },
      { label: "Password page", value: "Coming-soon + countdown" },
    ],
  },
  {
    category: "Performance & SEO",
    icon: Rocket,
    items: [
      { label: "Fully responsive" },
      { label: "Lazy loading" },
      { label: "Debounce / throttle + rAF" },
      { label: "Deferred scripts", value: "15× faster paint" },
      { label: "Glassmorphism", value: "31× backdrop-filter" },
      { label: "Reduced-motion aware" },
      { label: "Open Graph", value: "9 meta tags" },
    ],
  },
];

const Pricing = () => {
  const handleContactClick = useContactScroll();
  const isMobile = useIsMobile();
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

        <div className="max-w-xl mx-auto relative">
          {/* Ambient prism glow behind card . matches hero atmosphere */}
          <div
            aria-hidden="true"
            className="hero-prism-fallback absolute -inset-6 md:-inset-10 opacity-60 blur-2xl pointer-events-none"
          />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden menu-rotating-glow border border-foreground/15 bg-background/80 backdrop-blur-xl p-6 md:p-10 flex flex-col transition-colors duration-300 hover:border-primary/40"
          >
            {/* Corner brackets . hero-style */}
            <span aria-hidden className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary/70" />
            <span aria-hidden className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary/70" />
            <span aria-hidden className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-primary/70" />
            <span aria-hidden className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-primary/70" />

            {/* Watermark logo . bottom-right corner, very subtle */}
            <img
              src={shopifyBadge.url}
              alt=""
              aria-hidden="true"
              className="pointer-events-none select-none absolute bottom-6 right-6 h-20 md:h-24 w-auto opacity-[0.05]"
            />

            <div className="relative flex items-start justify-between gap-4 pb-6 mb-6 border-b border-foreground/10">
              <div>
                <h3 className={`font-syne font-bold text-foreground ${typography.h3}`}>
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

            {/* Inline add-on toggles . sharp edge, hero-aligned */}
            <div className="relative space-y-px mb-6 border border-foreground/10 overflow-hidden">
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
                  className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-left transition-colors border-b border-foreground/10 last:border-b-0 ${
                    t.value ? "bg-primary/[0.06]" : "hover:bg-foreground/[0.03]"
                  }`}
                >
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono font-medium text-foreground ${textSize.ui}`}>
                        {t.label}
                      </span>
                      <span className={`${typography.eyebrow} text-primary`}>
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
                      t.value ? "bg-primary" : "bg-muted"
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

            {/* Stats bar . by the numbers */}
            <div className="relative grid grid-cols-4 gap-px mb-3 border border-foreground/10 bg-foreground/10 overflow-hidden">
              {STATS.map((s) => (
                <div key={s.label} className="bg-background/80 px-2 py-3 text-center">
                  <div className="font-syne font-bold text-foreground text-lg md:text-2xl leading-none tabular-nums">
                    {s.value}
                  </div>
                  <div className={`${typography.eyebrow} mt-1 text-[9px] md:text-[10px]`}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
            <p className={`${typography.meta} text-center mb-6`}>
              397 customization options · no code required
            </p>

            {/* Feature groups . collapsible on mobile, always open on md+ */}
            <div className="relative flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-8">
              {FEATURE_GROUPS.map((group, idx) => {
                const Icon = group.icon;
                // Mobile: all open. Desktop: first row (left + right = idx 0 & 1) open.
                const defaultOpen = isMobile ? true : idx < 2;
                return (
                  <details
                    key={group.category}
                    open={defaultOpen}
                    className="group/details feature-group border border-foreground/10 bg-foreground/[0.02] open:bg-foreground/[0.04] transition-colors"
                  >
                    <summary className="flex items-center gap-2 px-3 py-2.5 cursor-pointer list-none [&::-webkit-details-marker]:hidden hover:bg-foreground/[0.03] transition-colors">
                      <Icon
                        aria-hidden="true"
                        className="w-5 h-5 text-primary shrink-0"
                      />
                      <span className={`flex-1 ${typography.eyebrow} text-foreground`}>
                        {group.category}
                      </span>
                      <span
                        aria-hidden="true"
                        className="font-mono text-base leading-none text-muted-foreground transition-transform duration-300 group-open/details:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <ul className="px-3 pb-3 pt-1 space-y-1">
                      {group.items.map((item) => (
                        <li
                          key={item.label}
                          className={`flex items-baseline gap-2 leading-snug ${textSize.ui}`}
                        >
                          <span
                            aria-hidden="true"
                            className="mt-1.5 w-1 h-1 rounded-full bg-primary/70 shrink-0"
                          />
                          <span className="font-mono text-muted-foreground">
                            {item.label}
                            {item.value && (
                              <span className="text-foreground"> . {item.value}</span>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </details>
                );
              })}
            </div>

            <a
              href="/about#contact"
              onClick={handleContactClick}
              className="group relative inline-flex items-center justify-center gap-2 sm:gap-3 bg-primary text-primary-foreground px-4 py-2.5 sm:px-8 sm:py-4 font-mono text-[clamp(0.6875rem,0.95vw,0.875rem)] font-bold uppercase tracking-wider overflow-hidden hover:glow-box cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background will-change-transform mt-2"
              aria-label={`Get SYNC for $${price}`}
            >
              <span className="relative z-10">Get SYNC . ${price}</span>
              <ArrowRight aria-hidden="true" className="relative z-10 group-hover:translate-x-1 transition-transform w-3.5 h-3.5 sm:w-[18px] sm:h-[18px]" />
              <div className="absolute inset-0 bg-foreground translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
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
