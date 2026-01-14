import { motion } from "framer-motion";
import { Upload, Sliders, Sparkles } from "lucide-react";

interface StepBullet {
  text: string;
}

interface Step {
  number: string;
  icon: typeof Upload;
  title: string;
  description?: string;
  bullets?: StepBullet[];
}

const steps: Step[] = [
  {
    number: "01",
    icon: Upload,
    title: "Upload your assets",
    bullets: [
      { text: "Clothing Product (0/4) — upload up to 4 product images" },
      { text: "Face References (0/4) — upload up to 4 face references (optional)" },
    ],
  },
  {
    number: "02",
    icon: Sliders,
    title: "Choose style & shot",
    description:
      "Pick gender, front/back, cutting, pose, lens, angle, background, ratio, and output count.",
  },
  {
    number: "03",
    icon: Sparkles,
    title: "Generate",
    description:
      "Click generate and get photo variations based on your settings. Done.",
  },
];

const Steps = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
      {steps.map((step, index) => (
        <motion.div
          key={step.number}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: index * 0.15 }}
          className="relative group"
        >
          {/* Connection Line (Desktop) */}
          {index < steps.length - 1 && (
            <div className="hidden md:block absolute top-12 left-[60%] w-full h-px bg-gradient-to-r from-primary/30 to-transparent" />
          )}

          <div className="relative p-6 md:p-8 rounded-2xl bg-card/50 border border-white/5 backdrop-blur-sm transition-all duration-300 group-hover:border-primary/20 group-hover:bg-card/70">
            {/* Step Number */}
            <span className="absolute -top-3 -left-3 text-6xl md:text-7xl font-display font-bold text-primary/10 select-none">
              {step.number}
            </span>

            {/* Icon */}
            <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors duration-300">
              <step.icon className="w-6 h-6 md:w-7 md:h-7 text-primary" />
            </div>

            {/* Content */}
            <h3 className="text-lg md:text-xl font-display font-semibold text-foreground mb-3">
              {step.title}
            </h3>

            {/* Description or Bullets */}
            {step.description && (
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            )}

            {step.bullets && (
              <ul className="space-y-2">
                {step.bullets.map((bullet, bulletIndex) => (
                  <li
                    key={bulletIndex}
                    className="flex items-start gap-2 text-sm md:text-base text-muted-foreground"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-2 flex-shrink-0" />
                    <span>{bullet.text}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Steps;
