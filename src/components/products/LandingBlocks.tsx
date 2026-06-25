import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import type { LandingBlock } from "@/hooks/useProducts";

const AnimatedHero = lazy(() => import("./landing/AnimatedHero"));
const MarqueeBlock = lazy(() => import("./landing/MarqueeBlock"));
const VelocityTextBlock = lazy(() => import("./landing/VelocityTextBlock"));
const ShowcaseGrid = lazy(() => import("./landing/ShowcaseGrid"));
const ReviewsWall = lazy(() => import("./landing/ReviewsWall"));
const StatsStrip = lazy(() => import("./landing/StatsStrip"));
const BigText = lazy(() => import("./landing/BigText"));
const BeforeAfterBlock = lazy(() => import("./landing/BeforeAfterBlock"));
const CtaBanner = lazy(() => import("./landing/CtaBanner"));

interface Props {
  blocks: LandingBlock[];
}

const LandingBlocks = ({ blocks }: Props) => {
  if (!blocks?.length) return null;
  return (
    <div className="space-y-20">
      {blocks.map((block, i) => (
        <motion.section
          key={i}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <Suspense fallback={<div className="h-32" />}>{renderBlock(block)}</Suspense>
        </motion.section>
      ))}
    </div>
  );
};

function renderBlock(block: LandingBlock) {
  switch (block.type) {
    case "hero":
      return (
        <div className="text-center max-w-3xl mx-auto">
          {block.image && (
            <img src={block.image} alt="" className="w-full rounded-2xl mb-8" loading="lazy" />
          )}
          {block.title && (
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">{block.title}</h2>
          )}
          {block.subtitle && (
            <p className="text-lg text-muted-foreground font-mono">{block.subtitle}</p>
          )}
        </div>
      );
    case "text":
      return (
        <div className="max-w-2xl mx-auto prose prose-invert">
          <p className="text-base md:text-lg leading-relaxed whitespace-pre-line text-foreground/90">
            {block.body}
          </p>
        </div>
      );
    case "image":
      return (
        <img
          src={block.src}
          alt={block.alt ?? ""}
          className="w-full max-w-4xl mx-auto rounded-2xl"
          loading="lazy"
        />
      );
    case "gallery":
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {block.images.map((src, idx) => (
            <img key={idx} src={src} alt="" className="w-full aspect-square object-cover rounded-xl" loading="lazy" />
          ))}
        </div>
      );
    case "features":
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {block.items.map((it, idx) => (
            <div key={idx} className="glass-card p-6">
              <h3 className="font-display font-bold text-lg mb-2">{it.title}</h3>
              {it.description && (
                <p className="text-sm text-muted-foreground">{it.description}</p>
              )}
            </div>
          ))}
        </div>
      );
    case "video":
      return (
        <div className="max-w-4xl mx-auto aspect-video rounded-2xl overflow-hidden">
          <iframe
            src={block.url}
            title="Video"
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    case "faq":
      return (
        <div className="max-w-2xl mx-auto space-y-3">
          {block.items.map((it, idx) => (
            <details key={idx} className="glass-card p-5 group">
              <summary className="cursor-pointer font-display font-bold list-none flex justify-between items-center">
                {it.q}
                <span className="text-primary group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground whitespace-pre-line">{it.a}</p>
            </details>
          ))}
        </div>
      );
    case "animated_hero":
      return <AnimatedHero {...block} />;
    case "marquee":
      return <MarqueeBlock {...block} />;
    case "velocity_text":
      return <VelocityTextBlock {...block} />;
    case "showcase_grid":
      return <ShowcaseGrid {...block} />;
    case "reviews_wall":
      return <ReviewsWall {...block} />;
    case "stats_strip":
      return <StatsStrip {...block} />;
    case "big_text":
      return <BigText {...block} />;
    case "before_after":
      return <BeforeAfterBlock {...block} />;
    case "cta_banner":
      return <CtaBanner {...block} />;
    default:
      return null;
  }
}

export default LandingBlocks;