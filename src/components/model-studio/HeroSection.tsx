import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import aiModelStudioIcon from "@/assets/icons/ai-model-studio-icon.png";
import { Suspense, lazy, useState, useEffect } from "react";

const Prism = lazy(() => import("@/components/Prism"));

interface HeroSectionProps {
  onCtaClick: () => void;
}

const HeroSection = ({ onCtaClick }: HeroSectionProps) => {
  const [prismScale, setPrismScale] = useState(2);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setPrismScale(1.2);
      } else if (width < 1024) {
        setPrismScale(1.6);
      } else {
        setPrismScale(2);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scrollToNext = () => {
    const element = document.querySelector("#how-it-works");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-4 md:px-6"
    >
      {/* Prism Background */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-background">
        <Suspense
          fallback={
            <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
          }
        >
          <Prism
            animationType="rotate"
            timeScale={0.4}
            height={4}
            baseWidth={5}
            scale={prismScale}
            hueShift={20}
            glow={1}
            bloom={1}
          />
        </Suspense>
        <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-background to-transparent" />
      </div>
      <div className="absolute inset-0 z-[1] bg-background/50 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 text-center max-w-4xl mx-auto pt-20 pb-12"
      >
        {/* Premium Badge - Home Page Style */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 glass-card font-mono text-xs text-primary tracking-widest uppercase">
            <Sparkles className="w-4 h-4" />
            AI MODEL STUDIO
          </span>
        </motion.div>

        {/* App Icon with Shimmer Effect */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8 inline-block relative"
        >
          <div className="relative">
            <img
              src={aiModelStudioIcon}
              alt="AI Model Studio"
              className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-2xl shadow-2xl shadow-primary/30"
            />
            {/* Shimmer overlay */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </div>
            {/* Glow ring */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 blur-sm -z-10 animate-pulse" />
          </div>
        </motion.div>

        {/* Main Headline - Home Page Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold tracking-tight leading-[1.1] uppercase">
            <span className="glow-text-luxury-mobile md:glow-text-luxury block">
              A FASTER WAY
            </span>
            <span className="glow-text-luxury-mobile md:glow-text-luxury block">
              TO CREATE
            </span>
            <span className="glow-text-luxury-mobile md:glow-text-luxury block text-primary">
              PRODUCT PHOTOS
            </span>
          </h1>
        </motion.div>

        {/* CTA Buttons - Home Page Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-sm mx-auto sm:max-w-none px-2 sm:px-0"
        >
          <button
            onClick={onCtaClick}
            className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-3 bg-primary text-primary-foreground px-8 py-4 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--primary)/0.4)] cursor-pointer"
          >
            <span className="relative z-10">Get Instant Access</span>
            <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-foreground translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
          <button
            onClick={scrollToNext}
            className="w-full sm:w-auto group inline-flex items-center justify-center gap-3 px-8 py-4 font-mono text-xs sm:text-sm uppercase tracking-wider border border-muted hover:border-foreground transition-all duration-300 bg-transparent"
          >
            <span>See How It Works</span>
          </button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator - styled like Home */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={scrollToNext}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Scroll to learn more"
      >
        <span className="text-xs tracking-[0.3em] font-mono">SCROLL</span>
        <motion.div
          className="w-px h-8 bg-gradient-to-b from-muted-foreground to-transparent"
          animate={{ scaleY: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.button>
    </section>
  );
};

export default HeroSection;
