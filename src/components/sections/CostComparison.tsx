import SectionHeader from "@/components/shared/SectionHeader";
import slider from "@/assets/cost-icons/slider.png.asset.json";
import swatch from "@/assets/cost-icons/swatch.png.asset.json";
import builder from "@/assets/cost-icons/builder.png.asset.json";
import megamenu from "@/assets/cost-icons/megamenu.png.asset.json";
import blocks from "@/assets/cost-icons/blocks.png.asset.json";
import countdown from "@/assets/cost-icons/countdown.png.asset.json";
import metadata from "@/assets/cost-icons/metadata.png.asset.json";
import announce from "@/assets/cost-icons/announce.png.asset.json";

type Row = {
  icon: string;
  name: string;
  desc: string;
  price: string;
};

const rows: Row[] = [
  { icon: slider.url, name: "Image Sliders & Carousels", desc: "Create swipeable product, image, video & testimonial sliders", price: "$29.99" },
  { icon: swatch.url, name: "Product Color Swatch & Variants", desc: "Custom swatches for product variants", price: "$20" },
  { icon: builder.url, name: "Expensive Page Builders", desc: "Stop spending monthly for expensive page builders", price: "$468/yr" },
  { icon: megamenu.url, name: "Mega Menu & Navigation", desc: "Easily add a mega menu for better navigation", price: "$9.99" },
  { icon: blocks.url, name: "Reusable Sections & Blocks", desc: "Drag & drop blocks for your Shopify store", price: "$9.99" },
  { icon: countdown.url, name: "Countdown Timers", desc: "Create urgency on product pages & promotional sections", price: "$29.99" },
  { icon: metadata.url, name: "Product Page Metadata Options", desc: "Branded badges & rich PDP information blocks", price: "$9.99" },
  { icon: announce.url, name: "Announcement Bars & Pop-ups", desc: "High-converting announcements, pop-ups & cross-offers", price: "$14.99" },
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
            {rows.map(({ icon, name, desc, price }) => (
              <li
                key={name}
                className="flex items-center gap-3 md:gap-4 px-4 md:px-6 py-4 md:py-5"
              >
                <img
                  src={icon}
                  alt={name}
                  loading="lazy"
                  className="shrink-0 w-10 h-10 md:w-11 md:h-11 rounded-xl object-cover shadow-md"
                />
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