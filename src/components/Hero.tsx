import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Eye } from "lucide-react";
import { lazy, Suspense, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { scrollToId } from "@/lib/scroll";
import { useMagnetic } from "@/hooks/useMagnetic";

// Lazy load heavy Prism component
const Prism = lazy(() => import("./Prism"));

const Hero = () => {
  const [prismScale, setPrismScale] = useState(typeof window !== 'undefined' && window.innerWidth < 768 ? 1.8 : 3);
  const magneticRef = useMagnetic<HTMLAnchorElement>(0.25);
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const headlineY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.6, 0]);
  const bgY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 80]);

  useEffect(() => {
    const handleResize = () => {
      setPrismScale(window.innerWidth < 768 ? 1.8 : 3);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <section ref={sectionRef} aria-labelledby="hero-heading" className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pt-20 pb-24">
      {/* Prism Background Effect - z-index 0 */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 z-0 pointer-events-none bg-background">
        <Suspense fallback={<div className="w-full h-full bg-gradient-to-br from-primary/10 via-background to-background" />}>
          <Prism 
            animationType="rotate"
            timeScale={0.5}
            height={4}
            baseWidth={5}
            scale={prismScale}
            hueShift={0}
            colorFrequency={1}
            noise={0}
            glow={1}
            bloom={1}
            offset={{ x: 0, y: 0 }}
            suspendWhenOffscreen={true}
          />
        </Suspense>
        {/* Fade overlay at the bottom */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-[1]" />
      </motion.div>

      {/* Dark Overlay for text readability - z-index 1 */}
      <div className="absolute inset-0 z-[1] bg-background/50 pointer-events-none" />

      {/* Kinetic grid overlay */}
      <div aria-hidden className="absolute inset-0 z-[2] pointer-events-none opacity-[0.08] hero-grid-overlay" />
      {/* Grain noise */}
      <div aria-hidden className="absolute inset-0 z-[2] pointer-events-none opacity-[0.06] hero-noise mix-blend-overlay" />
      {/* Vertical scroll label (desktop) */}
      <div aria-hidden className="hidden lg:flex absolute right-6 bottom-32 z-[3] flex-col items-end gap-2 pointer-events-none">
        <div className="h-24 w-px bg-gradient-to-b from-primary to-transparent" />
        <span className="font-mono text-primary text-[10px] tracking-widest uppercase" style={{ writingMode: "vertical-rl" }}>
          Scroll To Explore
        </span>
      </div>

      <motion.div style={{ y: headlineY, opacity: contentOpacity }} className="container relative z-10 px-4">
        <div className="max-w-5xl mx-auto text-center">
          {/* Eyebrow */}
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 glass-card font-mono text-xs text-primary tracking-widest">
              <svg viewBox="0 0 109 124" className="w-4 h-4 fill-current" aria-hidden="true" focusable="false">
                <path d="M95.02 24.56c-.06-.46-.45-.76-.85-.79-.4-.03-8.47-.16-8.47-.16s-5.6-5.44-6.22-6.03c-.62-.59-1.82-.42-2.29-.28-.01 0-.92.28-2.46.76-1.47-4.24-4.06-8.14-8.63-8.14-.13 0-.25 0-.38.01-.13-.17-.27-.33-.41-.49C63.37 7.21 60.74 6 58.53 6c-16.37.52-24.16 20.48-26.6 30.9-6.35 1.97-10.86 3.37-11.43 3.55-3.57 1.12-3.68 1.23-4.15 4.59C15.98 47.38 0 166.06 0 166.06l74.34 12.83 40.21-10s.01 0 .01-.01c.01 0 .01-.01.01-.01l-19.55-143.31zM67.72 19.74l-4.17 1.29c0-.11.01-.21.01-.32 0-3.28-.45-5.94-1.2-8.05 2.97.37 4.95 3.77 5.36 7.08zM57.2 11.31c.84 2.03 1.38 4.93 1.38 8.91 0 .23 0 .44-.01.66-4.04 1.25-8.45 2.62-12.87 3.99 2.48-9.47 7.13-14.04 11.5-13.56zm-3.81-3.4c.75 0 1.49.25 2.21.75-5.49 2.59-11.38 9.11-13.87 22.13-3.52 1.09-6.97 2.16-10.14 3.14 2.81-9.51 9.51-25.67 21.8-26.02z"/>
              </svg>
              SHOPIFY PARTNER
              <Check size={14} className="text-success" aria-hidden="true" />
            </span>
          </div>

          {/* Main Headline with floating accent */}
          <div className="relative inline-block">
            <span
              aria-hidden
              className="inline-block absolute -top-3 -right-2 md:-top-4 md:-right-6 z-20 font-mono text-primary bg-background/95 border border-primary/40 px-2 md:px-3 py-0.5 md:py-1 text-[9px] md:text-[10px] uppercase tracking-tighter md:backdrop-blur-md shadow-[0_0_20px_hsl(var(--primary)/0.3)]"
              style={{ transform: "rotate(12deg)" }}
            >
              Hyper-Fast
            </span>
          <h1 id="hero-heading" className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold uppercase leading-[0.9] tracking-tight mb-8">
            <span className="block hover-lift">
              DON'T JUST
            </span>
            <span className="block hover-lift">
              SELL PRODUCT.
            </span>
            <span className="block glow-text-luxury-mobile md:glow-text-luxury hover-glow-intense">
              SELL AN
            </span>
            <span className="block glow-text-luxury-mobile md:glow-text-luxury hover-glow-intense">
              EXPERIENCE.
            </span>
          </h1>
          </div>

          {/* Sub-headline */}
          <p className="font-mono text-sm md:text-base text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
            Premium Shopify Setup Service. 
            <br className="hidden sm:block" />
            We build your high-end store in <span className="text-primary">2 Days </span>.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              ref={magneticRef}
              href="#pricing"
              aria-label="View pricing packages"
              onClick={(e) => {
                e.preventDefault();
                scrollToId('pricing');
              }}
              className="group relative inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 font-mono text-sm font-bold uppercase tracking-wider overflow-hidden hover:glow-box cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background will-change-transform"
            >
              <span className="relative z-10">View Packages</span>
              <ArrowRight size={18} aria-hidden="true" className="relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-foreground translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </a>

            <Link to="/showcase" aria-label="View showcase" className="group inline-flex items-center gap-3 px-8 py-4 font-mono text-sm uppercase tracking-wider border border-muted hover:border-foreground transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background">
              <Eye size={18} aria-hidden="true" className="group-hover:scale-110 transition-transform" />
              <span>SHOWCASE</span>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Tilted bottom marquee ribbon — lifted above mobile bottom nav */}
      <div
        aria-hidden
        className="absolute bottom-28 md:bottom-20 left-0 right-0 z-[3] overflow-hidden border-y border-border/40 py-2 md:py-3 bg-background/70 md:bg-background/40 md:backdrop-blur-sm pointer-events-none"
        style={{ transform: "rotate(-1.5deg)" }}
      >
        <div className="flex whitespace-nowrap" style={{ animation: "hero-marquee 30s linear infinite" }}>
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex shrink-0 items-center gap-10 px-6 font-mono text-[11px] text-muted-foreground uppercase tracking-[0.4em]">
              <span>Premium Shopify Setup</span>
              <span className="text-primary">✦</span>
              <span>High Conversion Architecture</span>
              <span className="text-primary">✦</span>
              <span>2-Day Delivery</span>
              <span className="text-primary">✦</span>
              <span>Siteby Krickel Studio</span>
              <span className="text-primary">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* Corner brackets — mobile premium accent */}
      <div aria-hidden className="md:hidden absolute inset-4 z-[3] pointer-events-none">
        <span className="absolute top-0 left-0 w-5 h-5 border-t border-l border-primary/50" />
        <span className="absolute top-0 right-0 w-5 h-5 border-t border-r border-primary/50" />
        <span className="absolute bottom-0 left-0 w-5 h-5 border-b border-l border-primary/50" />
        <span className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-primary/50" />
      </div>

      {/* Animated radial pulse — mobile only */}
      <motion.div
        aria-hidden
        className="md:hidden absolute inset-0 z-[2] pointer-events-none"
        initial={{ opacity: 0.4 }}
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 35%, hsl(var(--primary) / 0.18), transparent 70%)",
        }}
      />

      {/* Scroll Indicator */}
      <div aria-hidden="true" className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <div className="flex flex-col items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground tracking-widest">SCROLL</span>
          <div className="w-px h-8 md:h-10 bg-gradient-to-b from-muted-foreground to-transparent" />
        </div>
      </div>
    </section>;
};
export default Hero;