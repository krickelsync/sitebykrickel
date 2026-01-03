import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface ExpertiseCardProps {
  icon: LucideIcon;
  title: string;
  items: string[];
  delay?: number;
}

const ExpertiseCard = ({ icon: Icon, title, items, delay = 0 }: ExpertiseCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: delay * 0.15, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
      className="glass-card card-shiny-border p-6 group hover:border-primary/30 transition-all duration-500"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <h4 className="font-mono text-sm font-semibold text-foreground">
          {title}
        </h4>
      </div>
      
      <ul className="space-y-2">
        {items.map((item, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: (delay * 0.15) + (index * 0.1) }}
            viewport={{ once: true }}
            className="flex items-start gap-2"
          >
            <span className="text-primary mt-1.5 text-xs">▸</span>
            <span className="font-mono text-xs text-muted-foreground leading-relaxed">
              {item}
            </span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

export default ExpertiseCard;
