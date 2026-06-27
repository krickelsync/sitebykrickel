import { motion } from "framer-motion";
import SectionHeader from "@/components/shared/SectionHeader";
import { Wrench, Settings, Rocket, ArrowRight } from "lucide-react";
import { useContactScroll } from "@/hooks/useContactScroll";

const services = [
  { icon: Wrench, name: "Quick Fix", desc: "Targeted tweaks, bug fixes, and small layout adjustments." },
  { icon: Settings, name: "Theme Setup", desc: "Full theme installation with your branding, fonts, and products." },
  { icon: Rocket, name: "Full Store Build", desc: "End-to-end store build: branding, pages, products, and launch." },
];

const ServicesAddon = () => {
  const onClick = useContactScroll();
  return (
    <section className="py-24 md:py-32 border-t border-border">
      <div className="container px-4">
        <SectionHeader
          eyebrow="SERVICES"
          title="NEED HELP"
          accent="LAUNCHING?"
        />
        <p className="font-mono text-sm md:text-base text-muted-foreground text-center max-w-2xl mx-auto -mt-8 mb-12">
          Buy the theme and let us set it up for you. Perfect for founders who want a launch-ready store
          without touching the backend.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass-card p-6 md:p-8 flex flex-col"
              >
                <Icon className="w-6 h-6 text-primary mb-4" aria-hidden />
                <h3 className="font-syne font-bold uppercase text-lg md:text-xl tracking-tight mb-2">
                  {s.name}
                </h3>
                <p className="font-mono text-xs md:text-sm text-muted-foreground leading-relaxed flex-1">
                  {s.desc}
                </p>
                <a
                  href="/about#contact"
                  onClick={onClick}
                  className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary hover:gap-3 transition-all"
                >
                  Get in touch <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesAddon;