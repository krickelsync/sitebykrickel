import SectionHeader from "@/components/shared/SectionHeader";
import { motion } from "framer-motion";

const CustomizationSection = () => (
  <section className="py-14 md:py-32 border-t border-border">
    <div className="container px-4 max-w-4xl">
      <SectionHeader
        eyebrow="NO CODE NEEDED"
        title="FULL CREATIVE CONTROL,"
        accent="NO CODE REQUIRED."
      />
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="font-mono text-xs md:text-lg text-muted-foreground text-center leading-relaxed max-w-2xl mx-auto"
      >
        Change colors, typography, spacing, sections, product layouts, and homepage structure
        directly inside Shopify Customize.
      </motion.p>
    </div>
  </section>
);

export default CustomizationSection;