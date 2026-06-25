import { motion } from "framer-motion";

interface Props {
  items: { image: string; caption?: string }[];
  columns?: 2 | 3 | 4;
}

const ShowcaseGrid = ({ items, columns = 3 }: Props) => {
  if (!items?.length) return null;
  const cls = columns === 2 ? "md:grid-cols-2" : columns === 4 ? "md:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-2 lg:grid-cols-3";
  return (
    <div className={`grid grid-cols-1 ${cls} gap-4 max-w-6xl mx-auto`}>
      {items.map((it, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: i * 0.05, duration: 0.5 }}
          className="group relative aspect-[4/5] rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition"
        >
          <img src={it.image} alt={it.caption ?? ""} loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          {it.caption && (
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-xs font-mono text-white/90">{it.caption}</p>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default ShowcaseGrid;