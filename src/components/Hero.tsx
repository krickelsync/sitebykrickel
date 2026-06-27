import { motion, useScroll, useTransform, useReducedMotion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Eye } from "lucide-react";
import { lazy, Suspense, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { scrollToId } from "@/lib/scroll";
import { useMagnetic } from "@/hooks/useMagnetic";
import { fadeUpDelay } from "@/lib/motion";
import shopifyBadge from "@/assets/shopify-badge.png";

// Lazy load heavy Prism component
const Prism = lazy(() => import("./Prism"));

const Hero = () => {
  const [prismScale, setPrismScale] = useState(typeof window !== 'undefined' && window.innerWidth < 768 ? 1.8 : 3);
  const rotatingWords = ["CLOTHING BRAND", "STREETWEAR", "DROPSHIPPER", "BARBERSHOP"];
  const [wordIndex, setWordIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setWordIndex((i) => (i + 1) % rotatingWords.length), 2500);
    return () => clearInterval(id);
  }, []);
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
      <motion.div style={{ y: headlineY, opacity: contentOpacity }} className="container relative z-10 px-4">
        <div className="max-w-5xl mx-auto text-center">
          {/* Eyebrow */}
          <motion.div {...fadeUpDelay(0.2)} className="mb-8">
            <span
              className="badge-rotating-shine badge-shine-sweep relative inline-flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full font-mono text-[9.5px] md:text-[11px] text-foreground/90 tracking-[0.16em] uppercase overflow-hidden border border-white/10"
              style={{
                background: "linear-gradient(135deg, hsl(0 0% 100% / 0.08), hsl(0 0% 100% / 0.02))",
                backdropFilter: "blur(16px) saturate(160%)",
                WebkitBackdropFilter: "blur(16px) saturate(160%)",
              }}
            >
              <img src={shopifyBadge} alt="Shopify" className="relative z-[3] w-3.5 h-3.5 md:w-4 md:h-4 shrink-0 object-contain" />
              <span className="relative z-[3] whitespace-nowrap">
                Trusted by <span className="font-bold" style={{ color: "hsl(45 100% 60%)" }}>1,900+</span> Brands
              </span>
              <Check size={11} className="relative z-[3] shrink-0" style={{ color: "hsl(210 100% 70%)" }} aria-hidden="true" />
            </span>
          </motion.div>

          {/* Main Headline */}
          <div className="relative inline-block">
          <motion.h1
            {...fadeUpDelay(0.3, 0.8)}
            id="hero-heading"
            className="font-syne text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold uppercase leading-[0.9] sm:leading-[0.85] tracking-tighter mb-8"
          >
            <span className="block hover-lift">
              THEMES<span className="hidden sm:inline"> FOR</span>
              <span className="block sm:hidden">FOR</span>
            </span>
            <span className="block glow-text-luxury-mobile md:glow-text-luxury hover-glow-intense min-h-[1em] text-[1.65rem] sm:text-inherit break-words">
              <AnimatePresence mode="wait">
                <motion.span
                  key={rotatingWords[wordIndex]}
                  initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="inline-block"
                >
                  {rotatingWords[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.h1>
          </div>

          {/* Sub-headline */}
          <motion.p
            {...fadeUpDelay(0.5)}
            className="font-mono text-[11px] sm:text-sm md:text-base text-muted-foreground max-w-xs sm:max-w-xl md:max-w-2xl mx-auto mb-12 leading-relaxed md:leading-loose tracking-wide px-4 sm:px-0"
          >
            Build your store in <span className="text-primary">minutes</span> with a
            high-performance Shopify theme
            <br className="hidden md:block" />{" "}
            and infinite customization features.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            {...fadeUpDelay(0.7)}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
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
          </motion.div>
        </div>
      </motion.div>

      {/* Tilted bottom marquee ribbon — lifted above mobile bottom nav */}
      <div
        aria-hidden
        className="absolute bottom-28 md:bottom-20 left-0 right-0 z-[3] overflow-hidden border-y-0 md:border-y md:border-border/40 py-2 md:py-3 bg-background/70 md:bg-background/40 md:backdrop-blur-sm pointer-events-none"
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

    </section>;
};
export default Hero;