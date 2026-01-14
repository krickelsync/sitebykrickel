import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
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

  const featurePoints = [
    "Lookbook- and catalog-ready visuals",
    "Upload your product or mockup",
    "Control pose, camera, and background",
    "Generate consistent model photos on demand",
  ];

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
        {/* App Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-6"
        >
          <img
            src={aiModelStudioIcon}
            alt="AI Model Studio"
            className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-2xl shadow-lg shadow-primary/20"
          />
        </motion.div>

        {/* Eyebrow Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-xs md:text-sm font-mono tracking-[0.2em] text-primary/90">
            AI MODEL STUDIO
          </span>
        </motion.div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight mb-8">
          <span className="block mb-2">A Faster Way to</span>
          <span className="block text-primary drop-shadow-[0_0_30px_hsl(var(--primary)/0.5)]">
            Create Product Photos
          </span>
        </h1>

        {/* Primary Subheadline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-xl mx-auto mb-8 space-y-2"
        >
          <p className="text-base sm:text-lg md:text-xl text-foreground/90 leading-relaxed font-medium">
            A game changer for clothing brand owners and designers.
          </p>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
            Save thousands on photoshoots by using one tool.
          </p>
        </motion.div>

        {/* Feature Points - Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-md mx-auto mb-10 p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
        >
          <div className="flex flex-col gap-3">
            {featurePoints.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-center gap-3 text-sm sm:text-base text-foreground/80"
              >
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary" />
                </span>
                <span className="text-left">{point}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 max-w-sm mx-auto sm:max-w-none px-2 sm:px-0">
          <Button
            onClick={onCtaClick}
            size="lg"
            className="w-full sm:w-auto px-8 py-6 text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 group"
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
        </div>

        {/* Microcopy */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-xs md:text-sm text-muted-foreground/70"
        >
          1–6 outputs each generate · Ready crop sizes: 1:1 · 4:5 · 3:4 · 9:16
        </motion.p>
      </motion.div>

      {/* Scroll indicator - styled like Home */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
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
