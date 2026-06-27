import { motion } from "framer-motion";
import SectionHeader from "@/components/shared/SectionHeader";
import {
  Smartphone, Sliders, LayoutGrid, Image, FileText, Timer,
  Megaphone, Menu, ShoppingCart, ShieldCheck, Zap, Code2,
} from "lucide-react";

const features = [
  { icon: Smartphone, label: "Mobile-first layouts" },
  { icon: Sliders, label: "Infinite customization" },
  { icon: LayoutGrid, label: "Product page builder" },
  { icon: Image, label: "Lookbook sections" },
  { icon: FileText, label: "Editorial image blocks" },
  { icon: Timer, label: "Drop countdown sections" },
  { icon: Megaphone, label: "Announcement bars" },
  { icon: Menu, label: "Mega menu" },
  { icon: ShoppingCart, label: "Sticky add to cart" },
  { icon: ShieldCheck, label: "Trust badges" },
  { icon: Zap, label: "Fast loading performance" },
  { icon: Code2, label: "Shopify 2.0 compatible" },
];

const FeatureGrid = () => (
  <section id="features" className="py-24 md:py-32 border-t border-border">
    <div className="container px-4">
      <SectionHeader
        eyebrow="EVERYTHING INCLUDED"
        title="EVERYTHING YOU NEED TO"
        accent="LAUNCH, CUSTOMIZE, AND SELL."
      />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 max-w-5xl mx-auto">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.03 }}
              className="glass-card p-4 md:p-5 flex flex-col gap-2 hover:border-primary/30 transition-colors"
            >
              <Icon className="w-5 h-5 text-primary" aria-hidden />
              <span className="font-mono text-xs md:text-sm text-foreground">{f.label}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

export default FeatureGrid;