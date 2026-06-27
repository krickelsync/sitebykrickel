import { motion } from "framer-motion";

export interface Review {
  name: string;
  initials?: string;
  rating?: number;
  content: string;
  avatarColor?: string;
}

interface Props {
  columns: Review[][];
}

const Column = ({ reviews, direction }: { reviews: Review[]; direction: "up" | "down" }) => {
  const distance = -100 * reviews.length;
  const animateY = direction === "up" ? [0, distance] : [distance, 0];
  return (
    <div
      className="relative h-[500px] overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
      }}
    >
      <motion.div
        className="flex flex-col gap-4"
        animate={{ y: animateY }}
        transition={{ duration: reviews.length * 8, repeat: Infinity, ease: "linear" }}
      >
        {[...reviews, ...reviews].map((r, i) => (
          <div key={i} className="glass-card p-2.5 md:p-5 shrink-0">
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
              <div className={`w-7 h-7 md:w-10 md:h-10 rounded-full ${r.avatarColor ?? "bg-primary"} flex items-center justify-center text-white text-[9px] md:text-xs font-bold`}>
                {r.initials ?? r.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-display font-bold text-[10px] md:text-sm truncate">{r.name}</p>
                {r.rating ? (
                  <p className="text-[9px] md:text-xs text-primary">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</p>
                ) : null}
              </div>
            </div>
            <p className="text-[10px] md:text-sm text-muted-foreground leading-relaxed">{r.content}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const ReviewsWall = ({ columns }: Props) => {
  if (!columns?.length) return null;
  const gridCls =
    columns.length === 1
      ? "grid-cols-1"
      : columns.length === 2
      ? "grid-cols-2"
      : "grid-cols-3";
  return (
    <div className={`grid ${gridCls} gap-2 md:gap-4 max-w-6xl mx-auto`}>
      {columns.map((col, i) => (
        <Column key={i} reviews={col} direction={i % 2 === 0 ? "up" : "down"} />
      ))}
    </div>
  );
};

export default ReviewsWall;