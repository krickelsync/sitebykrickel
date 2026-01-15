import { motion } from "framer-motion";

// Import portfolio images
import cleanCatalogImg from "@/assets/portfolio/preset-clean-catalog.png";
import feedIgImg from "@/assets/portfolio/preset-feed-ig.png";
import camera360Img from "@/assets/portfolio/preset-360-camera.png";
import lookbookImg from "@/assets/portfolio/preset-lookbook.png";

const presets = [
  {
    image: cleanCatalogImg,
    name: "Clean Catalog",
    description: "studio white, classic look",
  },
  {
    image: feedIgImg,
    name: "Feed IG",
    description: "lifestyle polish",
  },
  {
    image: camera360Img,
    name: "360 Camera",
    description: "high-impact visuals",
  },
  {
    image: lookbookImg,
    name: "Lookbook",
    description: "fabric & cut highlight",
  },
];

const PresetCards = () => {
  return (
    <div className="space-y-6">
      <div className="overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 md:overflow-visible">
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 min-w-max md:min-w-0">
          {presets.map((preset, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="group relative w-64 md:w-auto flex-shrink-0 md:flex-shrink rounded-xl overflow-hidden bg-card/40 border border-white/5 hover:border-primary/20 transition-colors duration-300"
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
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                <h3 className="text-base md:text-lg font-display font-semibold text-white mb-1">
                  {preset.name}
                </h3>
                <p className="text-xs md:text-sm text-white/70">
                  {preset.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer line */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="text-center text-sm text-muted-foreground"
      >
        Choose a preset → generate → upload.
      </motion.p>
    </div>
  );
};

export default PresetCards;
