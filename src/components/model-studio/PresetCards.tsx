import { motion } from "framer-motion";

// Import portfolio images
import campaignImg from "@/assets/portfolio/model-alley-streetwear.png";
import lifestyleImg from "@/assets/portfolio/model-rooftop-hoodie.png";
import lookbookImg from "@/assets/portfolio/model-studio-fisheye.png";
import editorialImg from "@/assets/portfolio/model-silver-basquiat.png";

const presets = [
  {
    image: campaignImg,
    name: "Clean Catalog",
    description: "studio white, classic look",
  },
  {
    image: lifestyleImg,
    name: "IG Lookbook",
    description: "lifestyle polish",
  },
  {
    image: lookbookImg,
    name: "Campaign Edge",
    description: "high-impact visuals",
  },
  {
    image: editorialImg,
    name: "Detail Focus",
    description: "fabric & cut highlight",
  },
];

const PresetCards = () => {
  return (
    <div className="space-y-6">
      {/* 2x2 Grid on Mobile, 4 columns on Desktop - No horizontal scroll */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {presets.map((preset, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            className="group relative rounded-xl overflow-hidden bg-card/40 border border-white/5 hover:border-primary/20 transition-colors duration-300"
          >
            {/* Image */}
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src={preset.image}
                alt={preset.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-3 md:p-5">
              <h3 className="text-sm md:text-lg font-display font-semibold text-white mb-0.5 md:mb-1">
                {preset.name}
              </h3>
              <p className="text-[10px] md:text-sm text-white/70 line-clamp-1">
                {preset.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer line */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="text-center text-xs md:text-sm text-muted-foreground"
      >
        Choose a preset → generate → upload.
      </motion.p>
    </div>
  );
};

export default PresetCards;
