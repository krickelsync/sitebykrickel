import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown } from "lucide-react";
import aiModelStudioIcon from "@/assets/icons/ai-model-studio-icon.png";

interface HeroSectionProps {
  onCtaClick: () => void;
}

const HeroSection = ({ onCtaClick }: HeroSectionProps) => {
  const scrollToControls = () => {
    const element = document.querySelector("#controls");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToNext = () => {
    const element = document.querySelector("#how-it-works");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

const microCopyItems = [
    "1–6 outputs each generate",
    "Ready crop sizes: 1:1 · 4:5 · 3:4 · 9:16",
    "Works for Catalog & Campaign",
  ];

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-4 md:px-6 pt-20 pb-12"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative text-center max-w-4xl mx-auto"
      >
        {/* App Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-4"
        >
          <img
            src={aiModelStudioIcon}
            alt="AI Model Studio"
            className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-2xl shadow-lg shadow-primary/20"
          />
        </motion.div>

        {/* Eyebrow */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="inline-block text-xs md:text-sm font-mono tracking-[0.2em] text-primary/80 mb-6"
        >
          AI MODEL STUDIO
        </motion.span>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground leading-[1.15] mb-6">
          Pro-Grade Product Photos in Minutes —{" "}
          <span className="text-primary">No Photoshoots Needed.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
          Upload product images → choose pose, angle & background → generate ready-to-sell model photos.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 max-w-md mx-auto sm:max-w-none">
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

        {/* Microcopy bullets */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs md:text-sm text-muted-foreground"
        >
          {microCopyItems.map((item, index) => (
            <span key={index} className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-primary/60" />
              {item}
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        onClick={scrollToNext}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Scroll to learn more"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </motion.button>
    </section>
  );
};

export default HeroSection;
