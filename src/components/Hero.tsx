import { motion } from "framer-motion";
import { Play, ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Video Background Placeholder */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                            linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="container relative z-10 px-4">
        <div className="max-w-5xl mx-auto text-center">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <span className="inline-block px-4 py-2 glass-card font-mono text-xs text-primary tracking-widest">
              PREMIUM SHOPIFY AGENCY
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold uppercase leading-[0.9] tracking-tight mb-8"
          >
            <span className="block">DON'T JUST</span>
            <span className="block">SELL CLOTHES.</span>
            <span className="block text-primary glow-text">SELL AN</span>
            <span className="block text-primary glow-text">EXPERIENCE.</span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="font-mono text-sm md:text-base text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Premium Shopify Setup Service with Exclusive Krickel Modifications.
            <br className="hidden sm:block" />
            We build your high-end store in <span className="text-primary">48 hours</span>.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="#pricing"
              className="group relative inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 font-mono text-sm font-bold uppercase tracking-wider overflow-hidden transition-all duration-300 hover:glow-box"
            >
              <span className="relative z-10">View Packages</span>
              <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-foreground translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </a>

            <a
              href="#demo"
              id="demo"
              className="group inline-flex items-center gap-3 px-8 py-4 font-mono text-sm uppercase tracking-wider border border-muted hover:border-foreground transition-all duration-300"
            >
              <Play size={18} className="group-hover:scale-110 transition-transform" />
              <span>Live Demo</span>
            </a>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground tracking-widest">SCROLL</span>
          <div className="w-px h-12 bg-gradient-to-b from-muted-foreground to-transparent" />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
