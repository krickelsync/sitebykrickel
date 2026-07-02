import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, ExternalLink, Check, Star, Shield, Zap, RefreshCw } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { SYNC_CART_IDS } from "@/components/Pricing";
import laptopShowcase from "@/assets/laptop-showcase.webp.asset.json";
import { typography, textSize } from "@/components/ui/typography";

const DEMO_URL = "https://d9001y-xc.myshopify.com/";

const GALLERY_ASPECT = "aspect-[4/5] md:aspect-[4/3]";

const HIGHLIGHTS = [
  "18 sections . 10+ templates . 397 settings",
  "Mobile-first, sub-second load times",
  "Drop countdown, lookbook, music player",
  "Lifetime license . free updates forever",
];

const BADGES = [
  { icon: Shield, label: "Lifetime license" },
  { icon: Zap, label: "Instant download" },
  { icon: RefreshCw, label: "Free updates" },
];

const ProductHero = () => {
  const { add, open, remove } = useCart();
  const [removeWatermark, setRemoveWatermark] = useState(false);
  const [installSetup, setInstallSetup] = useState(false);
  const price = 98 + (removeWatermark ? 50 : 0) + (installSetup ? 50 : 0);

  const handleAddToCart = () => {
    remove(SYNC_CART_IDS.theme);
    remove(SYNC_CART_IDS.removeWatermark);
    remove(SYNC_CART_IDS.installSetup);
    add({ id: SYNC_CART_IDS.theme, slug: "sync", title: "SYNC Theme", price: 98, image: null });
    if (removeWatermark) {
      add({ id: SYNC_CART_IDS.removeWatermark, slug: "sync-remove-watermark", title: "Remove Watermark add-on", price: 50, image: null });
    }
    if (installSetup) {
      add({ id: SYNC_CART_IDS.installSetup, slug: "sync-install-setup", title: "Install & Setup add-on", price: 50, image: null });
    }
    open();
  };

  return (
    <section className="relative pt-28 md:pt-36 pb-12 md:pb-20">
      <div
        aria-hidden="true"
        className="hero-prism-fallback absolute inset-0 opacity-50 pointer-events-none"
      />
      <div className="container mx-auto px-4 md:px-8 relative">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className={`${typography.eyebrow} text-muted-foreground mb-6 md:mb-8`}
        >
          <ol className="flex items-center gap-2 flex-wrap">
            <li><a href="/" className="hover:text-foreground transition-colors">Home</a></li>
            <li aria-hidden="true">/</li>
            <li><a href="/themes/sync" className="hover:text-foreground transition-colors">Themes</a></li>
            <li aria-hidden="true">/</li>
            <li className="text-foreground">SYNC</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start">
          {/* LEFT . Product image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:sticky lg:top-28"
          >
            <div className={`relative ${GALLERY_ASPECT} rounded-2xl overflow-hidden border border-foreground/10 bg-foreground/[0.03] group`}>
              <img
                src={laptopShowcase.url}
                alt="SYNC Shopify theme preview on a laptop"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                loading="eager"
                decoding="async"
              />
              {/* Corner tag */}
              <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-background/80 backdrop-blur-md border border-foreground/15 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-primary">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Live demo available
              </span>
              {/* Version tag */}
              <span className="absolute top-3 right-3 rounded-full bg-background/80 backdrop-blur-md border border-foreground/15 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                v1.0
              </span>
            </div>

            {/* Preview thumbnails / demo link */}
            <a
              href={DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-foreground/10 bg-foreground/[0.02] px-4 py-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              Open live storefront
            </a>
          </motion.div>

          {/* RIGHT . Product details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col"
          >
            <span className={`${typography.eyebrow} text-primary`}>
              Premium Shopify Theme
            </span>

            <h1 className="mt-3 font-syne font-extrabold uppercase text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.9] tracking-[-0.03em] text-foreground">
              SYNC
            </h1>

            {/* Rating */}
            <div className="mt-3 flex items-center gap-3">
              <div className="flex items-center gap-0.5" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" aria-hidden="true" />
                ))}
              </div>
              <span className={`${textSize.small} font-mono text-muted-foreground`}>
                4.9 . 128 reviews
              </span>
            </div>

            <p className={`${typography.bodyLg} mt-5 max-w-lg`}>
              Built for streetwear, dropshippers, and barbershops. Ship a
              premium looking store in minutes. No code, no monthly fees, no
              agency invoices.
            </p>

            {/* Price */}
            <div className="mt-6 flex items-baseline gap-3">
              <motion.span
                key={price}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-syne font-bold text-5xl md:text-6xl text-foreground tabular-nums"
              >
                ${price}
              </motion.span>
              <span className={`${textSize.small} font-mono text-muted-foreground line-through`}>
                $249
              </span>
              <span className="rounded-full bg-primary/15 text-primary border border-primary/30 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest">
                Launch price
              </span>
            </div>
            <p className={`${textSize.small} font-mono text-muted-foreground mt-1`}>
              One-time payment . Lifetime license
            </p>

            {/* Add-on toggles */}
            <div className="mt-6 space-y-2">
              <AddonToggle
                label="Remove watermark"
                sub="White-label your footer"
                price={50}
                checked={removeWatermark}
                onToggle={() => setRemoveWatermark((v) => !v)}
              />
              <AddonToggle
                label="Theme installation + setup"
                sub="We install and configure it for you"
                price={50}
                checked={installSetup}
                onToggle={() => setInstallSetup((v) => !v)}
              />
            </div>

            {/* CTAs */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-4 font-mono text-xs md:text-sm font-bold uppercase tracking-widest hover:glow-box transition-all"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart . ${price}
              </button>
              <a
                href={DEMO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-foreground/20 px-6 py-4 font-mono text-xs md:text-sm uppercase tracking-widest hover:bg-foreground/5 transition-colors"
              >
                Live Preview
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Highlights */}
            <ul className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {HIGHLIGHTS.map((h) => (
                <li
                  key={h}
                  className={`flex items-start gap-2 ${textSize.small} font-mono text-muted-foreground`}
                >
                  <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" aria-hidden="true" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>

            {/* Trust badges */}
            <div className="mt-6 pt-6 border-t border-foreground/10 grid grid-cols-3 gap-2">
              {BADGES.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1.5 text-center"
                >
                  <Icon className="w-4 h-4 text-primary" aria-hidden="true" />
                  <span className={`${textSize.small} font-mono text-muted-foreground uppercase tracking-widest text-[10px]`}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

function AddonToggle({
  label,
  sub,
  price,
  checked,
  onToggle,
}: {
  label: string;
  sub: string;
  price: number;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onToggle}
      className={`w-full flex items-center justify-between gap-4 rounded-xl border px-4 py-3 text-left transition-colors ${
        checked
          ? "border-primary/50 bg-primary/[0.06]"
          : "border-foreground/10 bg-foreground/[0.02] hover:border-foreground/20"
      }`}
    >
      <div className="flex flex-col min-w-0">
        <span className="font-mono text-xs uppercase tracking-widest text-foreground truncate">
          {label}
        </span>
        <span className="font-mono text-[10px] text-muted-foreground mt-0.5">
          {sub}
        </span>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="font-mono text-xs text-primary tabular-nums">
          +${price}
        </span>
        <span
          aria-hidden="true"
          className={`relative inline-flex h-5 w-9 rounded-full transition-colors ${
            checked ? "bg-primary" : "bg-foreground/20"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-background transition-transform ${
              checked ? "translate-x-4" : "translate-x-0"
            }`}
          />
        </span>
      </div>
    </button>
  );
}

export default ProductHero;