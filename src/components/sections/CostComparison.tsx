import type { LucideIcon } from "lucide-react";
import {
  GalleryHorizontalEnd,
  Palette,
  LayoutTemplate,
  Menu,
  Blocks,
  TimerReset,
  Hourglass,
  Megaphone,
} from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";

type Row = {
  icon: LucideIcon;
  gradient: string;
  name: string;
  desc: string;
  price: string;
};

const rows: Row[] = [
  {
    icon: GalleryHorizontalEnd,
    gradient: "from-indigo-500 to-violet-600",
    name: "Image Sliders & Carousels",
    desc: "Create swipeable product, image, video & testimonial sliders",
    price: "$29.99",
  },
  {
    icon: Palette,
    gradient: "from-pink-500 via-orange-400 to-amber-300",
    name: "Product Color Swatch & Variants",
    desc: "Custom swatches for product variants",
    price: "$20",
  },
  {
    icon: LayoutTemplate,
    gradient: "from-sky-500 to-blue-600",
    name: "Expensive Page Builders",
    desc: "Stop spending monthly for expensive page builders",
    price: "$468/yr",
  },
  {
    icon: Menu,
    gradient: "from-rose-500 to-fuchsia-600",
    name: "Mega Menu & Navigation",
    desc: "Easily add a mega menu for better navigation",
    price: "$9.99",
  },
  {
    icon: Blocks,
    gradient: "from-emerald-500 to-green-600",
    name: "Reusable Sections & Blocks",
    desc: "Drag & drop blocks for your Shopify store",
    price: "$9.99",
  },
  {
    icon: TimerReset,
    gradient: "from-blue-400 to-cyan-500",
    name: "Countdown Timers",
    desc: "Create urgency on product pages & promotional sections",
    price: "$29.99",
  },
  {
    icon: Hourglass,
    gradient: "from-zinc-400 to-zinc-700",
    name: "Product Page Metadata Options",
    desc: "Branded badges & rich PDP information blocks",
    price: "$9.99",
  },
  {
    icon: Megaphone,
    gradient: "from-yellow-300 to-amber-500",
    name: "Announcement Bars & Pop-ups",
    desc: "High-converting announcements, pop-ups & cross-offers",
    price: "$14.99",
  },
];

const CostComparison = () => {
  return (
    <section className="relative py-20 md:py-28 px-4 md:px-8 border-t border-border/40">
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          eyebrow="Cost Breakdown"
          title="Better, faster"
          accent="& cheaper. Period."
        />
        <p className="text-center -mt-10 mb-12 max-w-2xl mx-auto text-sm md:text-base text-muted-foreground">
          Every extra app eats speed and money. SYNC gives you everything in
          one streamlined, cost-saving solution.
        </p>

        <div className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm overflow-hidden shadow-[0_0_60px_-30px_hsl(var(--primary)/0.3)]">
          <ul className="divide-y divide-border/40">
            {rows.map(({ icon: Icon, gradient, name, desc, price }) => (
              <li
                key={name}
                className="flex items-center gap-3 md:gap-4 px-4 md:px-6 py-4 md:py-5"
              >
                <div
                  className={`shrink-0 w-10 h-10 md:w-11 md:h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md`}
                >
                  <Icon className="w-5 h-5 text-white" strokeWidth={2.2} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-syne font-bold text-sm md:text-base leading-tight truncate">
                    {name}
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground truncate">
                    {desc}
                  </p>
                </div>
                <span className="shrink-0 font-mono text-sm md:text-base text-foreground/90 tabular-nums">
                  {price}
                </span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 md:px-6 py-5 border-t border-border/60 bg-background/30">
            <div className="text-xs md:text-sm text-muted-foreground">
              What you'd spend otherwise
              <div className="font-syne font-bold text-foreground text-sm md:text-base mt-0.5">
                Starting with SYNC
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-sm md:text-base text-destructive line-through decoration-2">
                $154.93 / month
              </div>
              <div className="font-syne font-bold text-lg md:text-xl">
                One Time <span className="text-primary glow-text">$98</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CostComparison;