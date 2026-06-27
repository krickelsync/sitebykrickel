import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const FinalCTA = () => (
  <section className="py-24 md:py-32 border-t border-border">
    <div className="container px-4 max-w-4xl text-center">
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="font-syne font-extrabold uppercase text-3xl md:text-5xl lg:text-6xl leading-[0.95] tracking-tighter"
      >
        READY TO BUILD A STORE THAT
        <br />
        <span className="text-primary glow-text">ACTUALLY FEELS LIKE YOUR BRAND?</span>
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="font-mono text-base md:text-lg text-muted-foreground mt-6 max-w-2xl mx-auto"
      >
        Start with a premium Shopify theme built for speed, control, and creative freedom.
      </motion.p>
      <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href="/products"
          className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-mono text-sm uppercase tracking-widest hover:glow-box transition-all"
        >
          Browse Themes
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>
        <a
          href="https://kcklsite.myshopify.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-border hover:bg-foreground hover:text-background font-mono text-sm uppercase tracking-widest transition-all"
        >
          View Demo
        </a>
      </div>
    </div>
  </section>
);

export default FinalCTA;