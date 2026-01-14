import { motion } from "framer-motion";
import { Upload, Palette, Camera, Image } from "lucide-react";

const controlGroups = [
  {
    title: "Input",
    icon: Upload,
    items: [
      "Up to 4 product images",
      "Optional face references",
    ],
  },
  {
    title: "Styling",
    icon: Palette,
    items: [
      "Choose model gender & view",
      "Multiple garment cutting options",
    ],
  },
  {
    title: "Camera",
    icon: Camera,
    items: [
      "Lens presets + angle control",
      "Manual fine-tuning sliders",
    ],
  },
  {
    title: "Output",
    icon: Image,
    items: [
      "Background styles",
      "Output count & ratios",
    ],
  },
];

const previewCards = [
  {
    caption: "Upload Products & Face References",
    placeholder: "[IMAGE URL PLACEHOLDER]",
  },
  {
    caption: "Pose / Lens / Garment Cutting",
    placeholder: "[IMAGE URL PLACEHOLDER]",
  },
  {
    caption: "Background / Ratio / Output count",
    placeholder: "[IMAGE URL PLACEHOLDER]",
  },
];

const FeatureGrid = () => {
  return (
    <div className="space-y-12">
      {/* Control Groups Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {controlGroups.map((group, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            className="group relative p-5 md:p-6 rounded-xl bg-card/40 border border-white/5 backdrop-blur-sm hover:border-primary/20 hover:bg-card/60 transition-colors duration-300"
          >
            {/* Subtle glow on hover */}
            <div className="absolute inset-0 rounded-xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />

            <div className="relative">
              {/* Header with icon */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                  <group.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-base md:text-lg font-display font-semibold text-foreground">
                  {group.title}
                </h3>
              </div>

              {/* Items list */}
              <ul className="space-y-2">
                {group.items.map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    className="text-sm text-muted-foreground leading-relaxed pl-2 border-l-2 border-white/10"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>

      {/* App Controls Preview Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-4"
      >
        <h3 className="text-center text-sm font-mono tracking-wider text-primary/80 uppercase">
          App Controls Preview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {previewCards.map((card, index) => (
            <div
              key={index}
              className="rounded-xl overflow-hidden bg-card/40 border border-white/5"
            >
              {/* Image placeholder */}
              <div className="aspect-[4/3] bg-muted/20 flex items-center justify-center">
                <span className="text-xs text-muted-foreground/50 font-mono">
                  {card.placeholder}
                </span>
              </div>
              {/* Caption */}
              <div className="p-3 text-center border-t border-white/5">
                <p className="text-sm text-foreground/80">{card.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default FeatureGrid;
