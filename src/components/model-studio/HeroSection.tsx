import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import aiModelStudioIcon from "@/assets/icons/ai-model-studio-icon.png";
import { Suspense, lazy, useState, useEffect } from "react";

const Prism = lazy(() => import("@/components/Prism"));

interface HeroSectionProps {
  onCtaClick: () => void;
}

const HeroSection = ({ onCtaClick }: HeroSectionProps) => {
  const [prismScale, setPrismScale] = useState(2);
  const [roleIndex, setRoleIndex] = useState(0);
  const roles = ["Clothing Brand", "Owner"];

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

  // Rotating text animation
  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
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
        {/* Premium Badge - Small & Elegant */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary/10 backdrop-blur-sm border border-primary/20 text-[10px] md:text-xs font-mono tracking-widest text-primary uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            AI Model Studio
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

        {/* Main Headline with Rotating Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-6"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight">
            <span className="block mb-2">Game Changer for</span>
            <span className="relative inline-flex h-[1.2em] overflow-hidden align-bottom">
              <AnimatePresence mode="wait">
                <motion.span
                  key={roles[roleIndex]}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="text-primary"
                  style={{
                    textShadow: "0 0 40px hsl(var(--primary) / 0.5), 0 0 80px hsl(var(--primary) / 0.3)"
                  }}
                >
                  {roles[roleIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </h1>
        </motion.div>

        {/* Sub-headline with strikethrough */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="font-mono text-sm md:text-base text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Save <span className="line-through text-muted-foreground/60">$1000</span> on photoshoots by using one tool.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-sm mx-auto sm:max-w-none px-2 sm:px-0"
        >
          <Button
            onClick={onCtaClick}
            size="lg"
            className="w-full sm:w-auto px-8 py-6 text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 group shadow-lg shadow-primary/25 hover:shadow-primary/40"
          >
            Get Instant Access
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={scrollToNext}
            className="w-full sm:w-auto px-8 py-6 text-base border-white/10 hover:bg-white/5 transition-all duration-200"
          >
            See How It Works
          </Button>
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
