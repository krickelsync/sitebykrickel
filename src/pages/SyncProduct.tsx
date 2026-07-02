import { useEffect } from "react";
import { ArrowRight, ExternalLink } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import ProductHero from "@/components/products/sync/ProductHero";
import LivePreviewFrame from "@/components/products/sync/LivePreviewFrame";
import VelocityTextBlock from "@/components/products/landing/VelocityTextBlock";
import HomeReviewsWall from "@/components/sections/HomeReviewsWall";
import MobileFirstSection from "@/components/sections/MobileFirstSection";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import { typography, textSize } from "@/components/ui/typography";
import { scrollToId } from "@/lib/scroll";

const DEMO_URL = "https://d9001y-xc.myshopify.com/";

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
      {/* ============ PRODUCT HERO ============ */}
      <ProductHero />

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

      {/* ============ MOBILE-FIRST PHONES ============ */}
      <MobileFirstSection />

      {/* ============ TESTIMONIAL WALL ============ */}
      <HomeReviewsWall />

      {/* ============ PRICING (reuse Pricing card) ============ */}
      <Pricing />


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