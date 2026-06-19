import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeUp } from "@/lib/motion";

interface SectionHeaderProps {
  eyebrow: string;
  title: React.ReactNode;
  accent?: React.ReactNode;
  accentTone?: "primary" | "gold";
  className?: string;
}

/**
 * Shared section header: eyebrow chip + display heading with an
 * optional second line rendered in the configured accent tone.
 */
const SectionHeader = ({
  eyebrow,
  title,
  accent,
  accentTone = "primary",
  className,
}: SectionHeaderProps) => {
  const accentClass =
    accentTone === "gold" ? "text-gold glow-text" : "text-primary glow-text";

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={cn("text-center mb-16", className)}
    >
      <span className="inline-block px-4 py-2 glass-card font-mono text-[10px] md:text-xs text-primary tracking-widest mb-6">
        {eyebrow}
      </span>
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight">
        {title}
        {accent && (
          <>
            <br />
            <span className={accentClass}>{accent}</span>
          </>
        )}
      </h2>
    </motion.div>
  );
};

export default SectionHeader;