import { motion } from "framer-motion";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

const SectionHeader = ({ eyebrow, title, description, align = "center" }: SectionHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}
    >
      {eyebrow && (
        <span className="inline-block text-xs md:text-sm font-mono tracking-[0.2em] text-primary/80 mb-4">
          {eyebrow}
        </span>
      )}
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-foreground leading-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-4 md:mt-6 text-base md:text-lg text-muted-foreground leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  );
};

export default SectionHeader;
