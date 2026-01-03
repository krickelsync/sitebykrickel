import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface WhyChooseCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

const WhyChooseCard = ({ icon: Icon, title, description, delay = 0 }: WhyChooseCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: delay * 0.1, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="glass-card p-6 text-center group hover:border-primary/30 transition-all duration-500"
    >
      <div className="inline-flex p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300 mb-4">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      
      <h4 className="font-mono text-base font-semibold text-foreground mb-2">
        {title}
      </h4>
      
      <p className="font-mono text-xs text-muted-foreground leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
};

export default WhyChooseCard;
