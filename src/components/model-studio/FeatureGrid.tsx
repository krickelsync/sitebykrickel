import { motion } from "framer-motion";
import { Users, Image, Palette, Layers, Sparkles, Settings } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "[FEATURE 1 TITLE]",
    description: "[FEATURE 1 DESCRIPTION]",
  },
  {
    icon: Image,
    title: "[FEATURE 2 TITLE]",
    description: "[FEATURE 2 DESCRIPTION]",
  },
  {
    icon: Palette,
    title: "[FEATURE 3 TITLE]",
    description: "[FEATURE 3 DESCRIPTION]",
  },
  {
    icon: Layers,
    title: "[FEATURE 4 TITLE]",
    description: "[FEATURE 4 DESCRIPTION]",
  },
  {
    icon: Sparkles,
    title: "[FEATURE 5 TITLE]",
    description: "[FEATURE 5 DESCRIPTION]",
  },
  {
    icon: Settings,
    title: "[FEATURE 6 TITLE]",
    description: "[FEATURE 6 DESCRIPTION]",
  },
];

const FeatureGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="group relative p-5 md:p-6 rounded-xl bg-card/40 border border-white/5 backdrop-blur-sm hover:border-primary/20 hover:bg-card/60 transition-all duration-300"
        >
          {/* Subtle glow on hover */}
          <div className="absolute inset-0 rounded-xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />

          <div className="relative">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
              <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </div>

            <h3 className="text-base md:text-lg font-display font-semibold text-foreground mb-2">
              {feature.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {feature.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default FeatureGrid;
