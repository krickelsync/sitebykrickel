import { motion } from "framer-motion";
import { ArrowRight, Check, Eye } from "lucide-react";
import { lazy, Suspense, useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Lazy load heavy Prism component
const Prism = lazy(() => import("./Prism"));

const Hero = () => {
  const [prismScale, setPrismScale] = useState(typeof window !== 'undefined' && window.innerWidth < 768 ? 1.8 : 3);

  useEffect(() => {
    const handleResize = () => {
      setPrismScale(window.innerWidth < 768 ? 1.8 : 3);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Prism Background Effect - z-index 0 */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-background">
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
      </div>

      {/* Dark Overlay for text readability - z-index 1 */}
      <div className="absolute inset-0 z-[1] bg-background/50 pointer-events-none" />

      <div className="container relative z-10 px-4">
        <div className="max-w-5xl mx-auto text-center">
          {/* Eyebrow */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.2
        }} className="mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 glass-card font-mono text-xs text-primary tracking-widest">
              <svg viewBox="0 0 109 124" className="w-4 h-4 fill-current">
                <path d="M95.02 24.56c-.06-.46-.45-.76-.85-.79-.4-.03-8.47-.16-8.47-.16s-5.6-5.44-6.22-6.03c-.62-.59-1.82-.42-2.29-.28-.01 0-.92.28-2.46.76-1.47-4.24-4.06-8.14-8.63-8.14-.13 0-.25 0-.38.01-.13-.17-.27-.33-.41-.49C63.37 7.21 60.74 6 58.53 6c-16.37.52-24.16 20.48-26.6 30.9-6.35 1.97-10.86 3.37-11.43 3.55-3.57 1.12-3.68 1.23-4.15 4.59C15.98 47.38 0 166.06 0 166.06l74.34 12.83 40.21-10s.01 0 .01-.01c.01 0 .01-.01.01-.01l-19.55-143.31zM67.72 19.74l-4.17 1.29c0-.11.01-.21.01-.32 0-3.28-.45-5.94-1.2-8.05 2.97.37 4.95 3.77 5.36 7.08zM57.2 11.31c.84 2.03 1.38 4.93 1.38 8.91 0 .23 0 .44-.01.66-4.04 1.25-8.45 2.62-12.87 3.99 2.48-9.47 7.13-14.04 11.5-13.56zm-3.81-3.4c.75 0 1.49.25 2.21.75-5.49 2.59-11.38 9.11-13.87 22.13-3.52 1.09-6.97 2.16-10.14 3.14 2.81-9.51 9.51-25.67 21.8-26.02z"/>
              </svg>
              SHOPIFY PARTNER
              <Check size={14} className="text-green-500" />
            </span>
          </motion.div>

          {/* Main Headline - Simplified on mobile */}
          <motion.h1 initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          delay: 0.3
        }} className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold uppercase leading-[0.9] tracking-tight mb-8">
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
          </motion.h1>

          {/* Sub-headline */}
          <motion.p initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.5
        }} className="font-mono text-sm md:text-base text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
            Premium Shopify Setup Service. 
            <br className="hidden sm:block" />
            We build your high-end store in <span className="text-primary">2 Days </span>.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.7
        }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#pricing" className="group relative inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 font-mono text-sm font-bold uppercase tracking-wider overflow-hidden transition-all duration-300 hover:glow-box">
              <span className="relative z-10">View Packages</span>
              <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-foreground translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </a>

            <Link to="/showcase" className="group inline-flex items-center gap-3 px-8 py-4 font-mono text-sm uppercase tracking-wider border border-muted hover:border-foreground transition-all duration-300">
              <Eye size={18} className="group-hover:scale-110 transition-transform" />
              <span>SHOWCASE</span>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator - more spacing on desktop */}
      <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      delay: 1.2
    }} className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-20 mt-8 md:mt-16">
        <div className="flex flex-col items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground tracking-widest">SCROLL</span>
          <div className="w-px h-8 md:h-10 bg-gradient-to-b from-muted-foreground to-transparent" />
        </div>
      </motion.div>
    </section>;
};
export default Hero;