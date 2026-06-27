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
      className={cn("text-center mb-10 md:mb-16", className)}
    >
      <span className="inline-block px-3 py-1.5 md:px-4 md:py-2 glass-card font-mono text-[9px] md:text-xs text-primary tracking-widest mb-4 md:mb-6">
        {eyebrow}
      </span>
      <h2 className="font-syne font-extrabold uppercase text-xl sm:text-2xl md:text-4xl lg:text-5xl leading-[0.95] tracking-tight md:tracking-tighter">
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