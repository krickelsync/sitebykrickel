import { motion } from "framer-motion";
import { Film, Music, Box, Smartphone } from "lucide-react";

const features = [
  {
    icon: Film,
    title: "INTERACTIVE ENTER PAGE",
    description: "Intro with 3D Logo support. Make customer feel like they're entering an exclusive experience store.",
    accent: true,
    large: true,
  },
  {
    icon: Music,
    title: "MUSIC PLAYER",
    description: "Music player with glass UI. Set the vibe from landing to checkout.",
    accent: false,
    large: false,
  },
  {
    icon: Box,
    title: "3D LOGO INTERACTIVE",
    description: "Real-time .glb logo spinning.",
    accent: false,
    large: false,
  },
  {
    icon: Smartphone,
    title: "MOBILE RESPONSIVE",
    description: "Your store will look clean, and professional on every device - from mobile to desktop.",
    accent: true,
    large: true,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
};

const Features = () => {
  return (
    <section id="features" className="py-24 md:py-32">
      <div className="container px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 glass-card font-mono text-xs text-primary tracking-widest mb-6">
            KRICKEL EXCLUSIVES
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight">
            FEATURES THAT
            <br />
            <span className="text-primary glow-text">SET YOU APART</span>
          </h2>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-5xl mx-auto"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`group relative glass-card p-6 md:p-8 hover:border-primary/30 transition-all duration-500 ${
                  feature.large ? "md:col-span-1" : ""
                } ${feature.accent ? "premium-card" : ""}`}
              >
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-6 ${
                  feature.accent 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-foreground"
                }`}>
                  <Icon size={24} />
                </div>

                {/* Content */}
                <h3 className="font-display text-xl md:text-2xl font-bold uppercase tracking-tight mb-3 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="font-mono text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
