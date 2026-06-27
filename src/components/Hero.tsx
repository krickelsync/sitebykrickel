import { motion, useScroll, useTransform, useReducedMotion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Eye } from "lucide-react";
import { lazy, Suspense, useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { scrollToId } from "@/lib/scroll";
import { useMagnetic } from "@/hooks/useMagnetic";
import { useMouseParallax } from "@/hooks/useMouseParallax";
import { useLowPower } from "@/hooks/useLowPower";
import { fadeUpDelay } from "@/lib/motion";
import shopifyBadge from "@/assets/shopify-badge.png";

// Lazy-load floating stats so they never block first paint
const HeroFloatingStats = lazy(() => import("./HeroFloatingStats"));

const Hero = () => {
  const getIsMobile = () => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;
  const [isMobile, setIsMobile] = useState(getIsMobile);
  const rotatingWords = useMemo(() => ["CLOTHING BRAND", "STREETWEAR", "DROPSHIPPER", "BARBERSHOP"], []);
  const [wordIndex, setWordIndex] = useState(0);
  const [inView, setInView] = useState(true);
  const magneticRef = useMagnetic<HTMLAnchorElement>(0.25);
  const sectionRef = useRef<HTMLElement>(null);

  // Pause expensive work when hero scrolls out of view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Word rotator only ticks while hero is on-screen
  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => setWordIndex((i) => (i + 1) % rotatingWords.length), 2500);
    return () => clearInterval(id);
  }, [inView, rotatingWords.length]);

  const reduce = useReducedMotion();
  const lowPower = useLowPower();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const headlineY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.6, 0]);
  const bgY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 80]);

  // Interactive mouse parallax — only listens while hero is visible and not low-power
  const { x: mx, y: my } = useMouseParallax(sectionRef, inView && !lowPower);

  useEffect(() => {
    const handleResize = () => {
      const mobile = getIsMobile();
      setIsMobile(mobile);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <section ref={sectionRef} aria-labelledby="hero-heading" className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pt-20 pb-24">
      {/* Liquid Chrome Background - z-index 0 (pure CSS, zero GPU) */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 z-0 pointer-events-none bg-background">
        <div className="hero-prism-fallback h-full w-full overflow-hidden" />
        {/* Fade overlay at the bottom */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-[1]" />
      </motion.div>

      {/* Dark Overlay for text readability - z-index 1 */}
      <div className="absolute inset-0 z-[1] bg-background/25 pointer-events-none" />

      {/* Kinetic grid overlay — visible on all devices */}
      <div
        aria-hidden
        className="absolute inset-0 z-[2] pointer-events-none opacity-[0.18] md:opacity-[0.22] hero-grid-overlay"
      />
      {/* Grain noise — desktop only */}
      <div aria-hidden className="absolute inset-0 z-[2] pointer-events-none opacity-[0.06] hero-noise mix-blend-overlay hidden md:block" />

      {/* Static ambient glow */}
      <div aria-hidden className="absolute inset-0 z-[2] pointer-events-none hidden md:block">
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[900px] max-h-[900px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, hsl(45 100% 60% / 0.10) 0%, hsl(210 100% 65% / 0.06) 35%, transparent 65%)",
            filter: "blur(40px)",
          }}
        />
      </div>
      <motion.div style={{ y: headlineY, opacity: contentOpacity }} className="container relative z-10 px-5 sm:px-4">
        <div className="max-w-[min(92vw,74rem)] mx-auto text-center">
          {/* Eyebrow */}
          <motion.div {...fadeUpDelay(0.2)} className="mb-8">
            <span
              className="badge-rotating-shine badge-shine-sweep hero-trust-badge relative inline-flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full font-mono text-[9.5px] md:text-[11px] text-foreground/90 tracking-[0.16em] uppercase overflow-hidden border border-white/10"
            >
              <img src={shopifyBadge} alt="Shopify" className="relative z-[3] w-3.5 h-3.5 md:w-4 md:h-4 shrink-0 object-contain" />
              <span className="relative z-[3] whitespace-nowrap">
                Trusted by <span className="font-bold" style={{ color: "hsl(45 100% 60%)" }}>1,900+</span> Brands
              </span>
              <Check size={11} className="relative z-[3] shrink-0" style={{ color: "hsl(210 100% 70%)" }} aria-hidden="true" />
            </span>
          </motion.div>

          {/* Main Headline */}
          <div className="relative w-full text-center">
          <motion.h1
            {...fadeUpDelay(0.3, 0.8)}
            id="hero-heading"
            className="font-syne text-[clamp(1.55rem,7.2vw,4.9rem)] font-extrabold uppercase leading-[0.92] tracking-normal mb-7 text-center px-2 sm:px-0"
          >
            <span className="flex items-center justify-center whitespace-nowrap hover-lift text-center">
              THEMES<span className="hidden sm:inline"> FOR</span>
              <span className="sm:hidden ml-2">FOR</span>
            </span>
            <span
              className="flex items-center justify-center text-center glow-text-luxury-mobile md:glow-text-luxury hover-glow-intense text-[clamp(1.2rem,6vw,4.5rem)] leading-[1.05] break-words min-h-[1.15em] overflow-visible px-3 sm:px-0"
              style={{ color: "hsl(45 100% 58%)" }}
            >
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
            className="flex flex-row items-center justify-center gap-3 sm:gap-4"
          >
            <a
              ref={magneticRef}
              href="#pricing"
              aria-label="View pricing packages"
              onClick={(e) => {
                e.preventDefault();
                scrollToId('pricing');
              }}
              className="group relative inline-flex items-center justify-center gap-2 sm:gap-3 bg-primary text-primary-foreground px-4 py-2.5 sm:px-8 sm:py-4 font-mono text-[11px] sm:text-sm font-bold uppercase tracking-wider overflow-hidden hover:glow-box cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background will-change-transform"
            >
              <span className="relative z-10">View Packages</span>
              <ArrowRight aria-hidden="true" className="relative z-10 group-hover:translate-x-1 transition-transform w-3.5 h-3.5 sm:w-[18px] sm:h-[18px]" />
              <div className="absolute inset-0 bg-foreground translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </a>

            <Link to="/showcase" aria-label="View showcase" className="group inline-flex items-center justify-center gap-2 sm:gap-3 px-4 py-2.5 sm:px-8 sm:py-4 font-mono text-[11px] sm:text-sm uppercase tracking-wider border border-muted hover:border-foreground transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background">
              <Eye aria-hidden="true" className="group-hover:scale-110 transition-transform w-3.5 h-3.5 sm:w-[18px] sm:h-[18px]" />
              <span>SHOWCASE</span>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating glass stat cards — parallax-only assets */}
      <Suspense fallback={null}>
        <HeroFloatingStats mx={mx} my={my} />
      </Suspense>

      {/* Tilted bottom marquee ribbon — lifted above mobile bottom nav */}
      <div
        aria-hidden
        className="absolute bottom-28 md:bottom-20 left-0 right-0 z-[3] overflow-hidden border-y-0 md:border-y md:border-border/40 py-2 md:py-3 bg-background/70 md:bg-background/40 md:backdrop-blur-sm pointer-events-none"
        style={{ transform: "rotate(-1.5deg)" }}
      >
        <div
          className="flex whitespace-nowrap"
          style={{
            animation: "hero-marquee 30s linear infinite",
            animationPlayState: inView && !lowPower ? "running" : "paused",
          }}
        >
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

    </section>;
};
export default Hero;