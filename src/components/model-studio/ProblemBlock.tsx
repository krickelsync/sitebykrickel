import { motion } from "framer-motion";
import { ShoppingBag, Palette, X, Check } from "lucide-react";

interface ProblemCardProps {
  badge: string;
  icon: React.ReactNode;
  headlinePart1: string;
  headlinePart2: string;
  painPoints: string[];
  solution: string;
  delay?: number;
}

const ProblemCard = ({
  badge,
  icon,
  headlinePart1,
  headlinePart2,
  painPoints,
  solution,
  delay = 0,
}: ProblemCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay }}
      className="relative group"
    >
      {/* Gradient border effect on hover */}
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-orange-500/0 via-orange-500/0 to-orange-500/0 group-hover:from-orange-500/20 group-hover:via-orange-500/10 group-hover:to-transparent transition-all duration-500 opacity-0 group-hover:opacity-100" />
      
      <div className="relative h-full p-6 sm:p-8 rounded-2xl bg-card/40 backdrop-blur-sm border border-border/40 transition-all duration-300">
        {/* Badge with Icon */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20">
            <span className="text-orange-400">{icon}</span>
          </div>
          <span className="text-xs font-mono text-orange-400 tracking-wide uppercase">
            {badge}
          </span>
        </div>

        {/* Split Headline for Impact */}
        <div className="mb-6">
          <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground leading-tight">
            {headlinePart1}
          </h3>
          <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-muted-foreground leading-tight">
            {headlinePart2}
          </h3>
        </div>

        {/* Pain Points - Clean with X icons */}
        <div className="space-y-3 mb-6">
          {painPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: delay + 0.15 + index * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center">
                <X className="w-3 h-3 text-red-400" />
              </div>
              <p className="text-sm text-muted-foreground">
                {point}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Solution - Single line with checkmark */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.4 }}
          className="pt-5 border-t border-border/40"
        >
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
              <Check className="w-3 h-3 text-primary" />
            </div>
            <p className="text-sm font-medium text-primary">
              {solution}
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const ProblemBlock = () => {
  const problemCards = [
    {
      badge: "Brand Owners",
      icon: <ShoppingBag className="w-5 h-5" />,
      headlinePart1: "Product ready.",
      headlinePart2: "Photos aren't.",
      painPoints: [
        "Finding models is expensive",
        "Scheduling slows everything down",
      ],
      solution: "Generate photos whenever you need them.",
    },
    {
      badge: "Designers",
      icon: <Palette className="w-5 h-5" />,
      headlinePart1: "Designs done.",
      headlinePart2: "Mockups look flat.",
      painPoints: [
        "Clients can't visualize the result",
        "Paying $20–50 per mockup adds up",
      ],
      solution: "Create realistic mockups in minutes.",
    },
  ];

  return (
    <section className="mb-12 sm:mb-16 md:mb-24">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="text-center mb-8 sm:mb-10 md:mb-12"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
          <span className="text-xs font-mono text-orange-400 tracking-wide">
            THE PROBLEM
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground">
          Sound familiar?
        </h2>
      </motion.div>

      {/* Problem Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 md:gap-8 max-w-4xl mx-auto">
        {problemCards.map((card, index) => (
          <ProblemCard key={index} {...card} delay={index * 0.12} />
        ))}
      </div>
    </section>
  );
};

export default ProblemBlock;
