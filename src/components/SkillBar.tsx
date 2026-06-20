import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface SkillBarProps {
  name: string;
  percentage: number;
  description?: string;
  delay?: number;
}

const SkillBar = ({ name, percentage, description, delay = 0 }: SkillBarProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay * 100);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <motion.div
      initial={{ opacity: 1, x: 0 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.01 }}
      viewport={{ once: true }}
      className="group"
    >
      <div className="flex justify-between items-center mb-2">
        <span className="font-mono text-sm text-foreground group-hover:text-primary transition-colors duration-300">
          {name}
        </span>
        <span className="font-mono text-xs text-muted-foreground">
          {percentage}%
        </span>
      </div>
      
      <div className="relative h-2 bg-muted/30 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: `${percentage}%` }}
          whileInView={{ width: isVisible ? `${percentage}%` : 0 }}
          transition={{ duration: 1, delay: delay * 0.1, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/70 rounded-full"
          style={{
            boxShadow: "0 0 20px hsl(var(--primary) / 0.5)",
          }}
        />
      </div>
      
      {description && (
        <p className="font-mono text-xs text-muted-foreground mt-1.5">
          {description}
        </p>
      )}
    </motion.div>
  );
};

export default SkillBar;
