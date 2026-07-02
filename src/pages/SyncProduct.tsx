import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, ShieldCheck, Zap, Clock } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import LivePreviewFrame from "@/components/products/sync/LivePreviewFrame";
import FeatureBento from "@/components/products/sync/FeatureBento";
import VelocityTextBlock from "@/components/products/landing/VelocityTextBlock";
import HomeReviewsWall from "@/components/sections/HomeReviewsWall";
import MobileFirstSection from "@/components/sections/MobileFirstSection";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import { STATS } from "@/components/Pricing";
import { typography, textSize } from "@/components/ui/typography";
import { scrollToId } from "@/lib/scroll";

const DEMO_URL = "https://kcklsite.myshopify.com";

const SyncProduct = () => {
  useEffect(() => {
    document.title = "SYNC . Premium Shopify Theme for Clothing Brands . SitebyKrickel";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "SYNC is a premium Shopify theme built for streetwear, dropshippers, and barbershops. 397 settings, no code, live preview.",
      );
    }
  }, []);

  return (
    <main className="relative overflow-hidden">
      {/* ============ CINEMATIC HERO ============ */}
      <section className="relative pt-32 md:pt-40 pb-16 md:pb-24">
        {/* Ambient prism + grid . matches homepage atmosphere */}
        <div
          aria-hidden="true"
          className="hero-prism-fallback absolute inset-0 opacity-70 pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--foreground)/0.6) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)/0.6) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="container mx-auto px-4 md:px-8 relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.span
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-block px-3 py-1.5 glass-card font-mono text-[11px] text-primary tracking-widest mb-5"
            >
              PREMIUM SHOPIFY THEME . V1.0
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="font-syne font-extrabold uppercase text-[clamp(3rem,12vw,9rem)] leading-[0.85] tracking-[-0.04em] text-foreground"
            >
              SYNC
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`${typography.bodyLg} mt-5 max-w-xl mx-auto`}
            >
              Built for streetwear, dropshippers, and barbershops. Ship a
              store that looks premium without touching code.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 flex flex-row items-center justify-center gap-3 flex-wrap"
            >
              <button
                type="button"
                onClick={() => scrollToId("pricing")}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 md:px-8 md:py-4 font-mono text-xs md:text-sm font-bold uppercase tracking-widest hover:glow-box transition-all"
              >
                Get SYNC . $98
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href={DEMO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-foreground/20 px-6 py-3 md:px-8 md:py-4 font-mono text-xs md:text-sm uppercase tracking-widest hover:bg-foreground/5 transition-colors"
              >
                Live Preview
                <ExternalLink className="w-4 h-4" />
              </a>
            </motion.div>

            {/* Trust row . mini stats */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 grid grid-cols-4 gap-px rounded-2xl border border-foreground/10 bg-foreground/10 overflow-hidden max-w-2xl mx-auto"
            >
              {STATS.map((s) => (
                <div key={s.label} className="bg-background/80 px-2 py-3 text-center">
                  <div className="font-syne font-bold text-foreground text-lg md:text-2xl leading-none tabular-nums">
                    {s.value}
                  </div>
                  <div className={`${typography.eyebrow} mt-1 text-[8px] md:text-[10px]`}>
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ LIVE PREVIEW FRAME ============ */}
      <section className="py-12 md:py-20 relative">
        <div className="container mx-auto px-4 md:px-8">
          <SectionHeader
            eyebrow="LIVE PREVIEW"
            title="CLICK. SCROLL."
            accent="FEEL IT YOURSELF."
          />
          <p className={`${typography.body} text-center max-w-xl mx-auto -mt-4 md:-mt-8 mb-8`}>
            This is a real Shopify store running SYNC. Poke around, add
            products, break things.
          </p>
          <LivePreviewFrame />
        </div>
      </section>

      {/* ============ VELOCITY MARQUEE ============ */}
      <VelocityTextBlock
        rows={[
          { text: "ENTER PAGE 3D ✦ DROP COUNTDOWN ✦ LOOKBOOK BENTO ✦ MUSIC PLAYER ✦ ANIMATED SHINE ✦ ", velocity: -0.6 },
          { text: "LIFETIME LICENSE ✦ VIP SUPPORT ✦ NO CODE ✦ SHIP IN MINUTES ✦ MOBILE FIRST ✦ ", velocity: 0.6, color: "#FACC15" },
        ]}
      />

      {/* ============ FEATURE BENTO ============ */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8">
          <SectionHeader
            eyebrow="WHAT'S INSIDE"
            title="EVERY FEATURE."
            accent="NO ADD-ON UPSELLS."
          />
          <FeatureBento />
        </div>
      </section>

      {/* ============ MOBILE-FIRST PHONES ============ */}
      <MobileFirstSection />

      {/* ============ TESTIMONIAL WALL ============ */}
      <HomeReviewsWall />

      {/* ============ PRICING (reuse Pricing card) ============ */}
      <Pricing />

      {/* ============ VALUE ROW ============ */}
      <section className="py-12 md:py-16 border-t border-border">
        <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl">
          {[
            { icon: ShieldCheck, title: "Lifetime license", desc: "Buy once, own it. Free updates forever." },
            { icon: Zap, title: "Ship in minutes", desc: "Upload theme, hit publish. No devs required." },
            { icon: Clock, title: "VIP support", desc: "Real human replies within 24 hours." },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-5 md:p-6"
            >
              <Icon className="w-6 h-6 text-primary mb-3" aria-hidden="true" />
              <h3 className={`${typography.h3} text-foreground mb-1`}>{title}</h3>
              <p className={typography.body}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <FAQ />

      {/* ============ FINAL CTA ============ */}
      <section className="relative py-20 md:py-28 border-t border-border">
        <div
          aria-hidden="true"
          className="hero-prism-fallback absolute inset-0 opacity-40 pointer-events-none"
        />
        <div className="container mx-auto px-4 md:px-8 max-w-3xl text-center relative">
          <h2 className="font-syne font-extrabold uppercase text-[clamp(2rem,7vw,5rem)] leading-[0.9] tracking-tight text-foreground">
            Ready to <span className="text-primary glow-text">ship?</span>
          </h2>
          <p className={`${typography.bodyLg} mt-4 max-w-xl mx-auto`}>
            One theme. Everything included. No dev fees, no monthly bills.
          </p>
          <div className="mt-8 flex flex-row items-center justify-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => scrollToId("pricing")}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 md:px-8 md:py-4 font-mono text-xs md:text-sm font-bold uppercase tracking-widest hover:glow-box transition-all"
            >
              Get SYNC . $98
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href={DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-foreground/20 px-6 py-3 md:px-8 md:py-4 font-mono text-xs md:text-sm uppercase tracking-widest hover:bg-foreground/5 transition-colors"
            >
              Live Preview
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      <Footer />

      {/* ============ MOBILE STICKY BUY BAR ============ */}
      <div className="md:hidden fixed bottom-20 left-3 right-3 z-40 pointer-events-none">
        <div className="pointer-events-auto flex items-center justify-between gap-3 rounded-full border border-foreground/15 bg-background/85 backdrop-blur-xl px-4 py-2.5 shadow-lg">
          <div className="flex flex-col leading-tight">
            <span className={`${textSize.small} font-mono text-muted-foreground uppercase tracking-widest`}>
              SYNC Theme
            </span>
            <span className="font-syne font-bold text-foreground text-lg leading-none">$98</span>
          </div>
          <button
            type="button"
            onClick={() => scrollToId("pricing")}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-widest"
          >
            Get Now
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </main>
  );
};

export default SyncProduct;