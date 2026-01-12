import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface ProductFeaturesProps {
  features: string[];
}

const ProductFeatures = ({ features }: ProductFeaturesProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {features.map((feature, index) => (
        <motion.div
          key={feature}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="flex items-center gap-3 p-4 glass-card"
        >
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Check className="w-4 h-4 text-primary" />
          </div>
          <span className="text-sm font-mono">{feature}</span>
        </motion.div>
      ))}
    </div>
  );
};

export default ProductFeatures;
