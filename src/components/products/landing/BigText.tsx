import { motion } from "framer-motion";

interface Props {
  lines: string[];
  emphasisColor?: string;
  align?: "left" | "center" | "right";
}

const BigText = ({ lines, emphasisColor, align = "center" }: Props) => {
  if (!lines?.length) return null;
  const alignCls = align === "left" ? "text-left" : align === "right" ? "text-right" : "text-center";
  return (
    <div className={`max-w-5xl mx-auto ${alignCls}`}>
      {lines.map((line, i) => (
        <motion.p
          key={i}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: i * 0.1, duration: 0.6 }}
          className="font-display text-3xl md:text-5xl lg:text-6xl font-black uppercase leading-[1.05] tracking-tight"
          style={emphasisColor && line.startsWith("*") ? { color: emphasisColor } : undefined}
        >
          {line.startsWith("*") ? line.slice(1) : line}
        </motion.p>
      ))}
    </div>
  );
};

export default BigText;