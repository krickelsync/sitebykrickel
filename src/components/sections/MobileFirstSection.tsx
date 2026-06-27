import SectionHeader from "@/components/shared/SectionHeader";
import { motion } from "framer-motion";

const MobileFirstSection = () => (
  <section className="py-20 md:py-28 border-t border-border">
    <div className="container mx-auto px-6 md:px-8 max-w-4xl">
      <SectionHeader
        eyebrow="MOBILE-FIRST"
        title="BUILT FOR THE WAY"
        accent="PEOPLE ACTUALLY SHOP."
      />
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="font-mono text-xs md:text-lg text-muted-foreground text-center leading-relaxed max-w-2xl mx-auto"
      >
        Your customers are discovering your brand from Instagram, TikTok, and mobile links.
        Every layout is designed to look sharp on small screens first.
      </motion.p>
    </div>
  </section>
);

export default MobileFirstSection;