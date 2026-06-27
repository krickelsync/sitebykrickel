import SectionHeader from "@/components/shared/SectionHeader";
import { motion } from "framer-motion";

const ProblemSection = () => (
  <section className="py-24 md:py-32 border-t border-border">
    <div className="container px-4 max-w-4xl">
      <SectionHeader
        eyebrow="THE PROBLEM"
        title="MOST SHOPIFY STORES"
        accent="LOOK THE SAME."
      />
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="font-mono text-base md:text-lg text-muted-foreground text-center leading-relaxed max-w-2xl mx-auto"
      >
        Generic templates make your brand feel forgettable. Custom development is expensive.
        Our themes give you the look of a custom store with the speed and control of a premium Shopify theme.
      </motion.p>
    </div>
  </section>
);

export default ProblemSection;