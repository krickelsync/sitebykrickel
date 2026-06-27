import SectionHeader from "@/components/shared/SectionHeader";
import { motion } from "framer-motion";
import { X, Check } from "lucide-react";

const problems = [
  "Basic themes → your brand looks like everyone else",
  "Heavy templates → slow stores kill first impressions",
  "Building everything manually → time-consuming and hard to scale",
];

const ProblemSection = () => (
  <section className="py-24 md:py-32 border-t border-border">
    <div className="container px-4 max-w-4xl">
      <SectionHeader
        eyebrow="THE PROBLEM"
        title="MOST SHOPIFY STORES"
        accent="LOOK THE SAME."
      />
      <motion.ul
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto space-y-3"
      >
        {problems.map((p) => (
          <li
            key={p}
            className="flex items-start gap-3 p-4 rounded-lg border border-border/60 bg-background/40"
          >
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-destructive/15 text-destructive">
              <X className="w-3 h-3" strokeWidth={3} />
            </span>
            <span className="font-mono text-sm md:text-base text-muted-foreground">
              {p}
            </span>
          </li>
        ))}
        <li className="flex items-start gap-3 p-4 rounded-lg border border-primary/40 bg-primary/5 shiny-card">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
            <Check className="w-3 h-3" strokeWidth={3} />
          </span>
          <span className="font-mono text-sm md:text-base text-foreground">
            <span className="text-primary font-semibold">SitebyKrickel</span> → high-performance Shopify themes for clothing brands that refuse to look generic
          </span>
        </li>
      </motion.ul>
    </div>
  </section>
);

export default ProblemSection;