import { Zap, DollarSign, Check, X } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";

const thirdPartyApps = [
  { name: "Page Builder app", price: 29 },
  { name: "Reviews app", price: 15 },
  { name: "Upsell / Bundles app", price: 24 },
  { name: "Sticky Cart app", price: 12 },
  { name: "Countdown / Urgency app", price: 10 },
  { name: "Custom Fonts & Animations", price: 9 },
];

const totalApps = thirdPartyApps.reduce((s, a) => s + a.price, 0);

const CostComparison = () => {
  return (
    <section className="relative py-20 md:py-28 px-4 md:px-8 border-t border-border/40">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Cost Breakdown"
          title="Better, faster & cheaper."
          subtitle="Every extra app eats speed and money. SYNC gives you everything in one streamlined, cost-saving solution."
        />

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mt-12">
          {/* Without SYNC */}
          <div className="relative rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                <X className="w-4 h-4 text-destructive" strokeWidth={2.5} />
              </div>
              <h3 className="font-syne text-lg md:text-xl font-bold uppercase tracking-wide">
                Without SYNC
              </h3>
            </div>

            <ul className="space-y-3 mb-6">
              {thirdPartyApps.map((app) => (
                <li
                  key={app.name}
                  className="flex items-center justify-between text-sm md:text-base py-2 border-b border-border/30 last:border-0"
                >
                  <span className="text-muted-foreground">{app.name}</span>
                  <span className="font-mono text-foreground/80">
                    ${app.price}<span className="text-xs text-muted-foreground">/mo</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between pt-4 border-t border-border/60">
              <span className="font-syne font-bold uppercase text-sm tracking-wider">
                Monthly cost
              </span>
              <span className="font-syne text-2xl md:text-3xl font-bold text-destructive">
                ${totalApps}<span className="text-sm text-muted-foreground font-normal">/mo</span>
              </span>
            </div>

            <p className="mt-4 text-xs text-muted-foreground flex items-center gap-2">
              <Zap className="w-3 h-3" /> Slower store · heavier code · recurring fees
            </p>
          </div>

          {/* With SYNC */}
          <div className="relative rounded-2xl border border-primary/40 bg-gradient-to-br from-primary/5 via-card/60 to-card/40 backdrop-blur-sm p-6 md:p-8 shadow-[0_0_60px_-20px_hsl(var(--primary)/0.4)]">
            <div className="absolute top-4 right-4 px-2 py-1 rounded-full bg-primary/15 border border-primary/30 text-[10px] font-syne font-bold uppercase tracking-wider text-primary">
              Recommended
            </div>

            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center">
                <Check className="w-4 h-4 text-primary" strokeWidth={2.5} />
              </div>
              <h3 className="font-syne text-lg md:text-xl font-bold uppercase tracking-wide">
                With SYNC
              </h3>
            </div>

            <ul className="space-y-3 mb-6">
              {thirdPartyApps.map((app) => (
                <li
                  key={app.name}
                  className="flex items-center justify-between text-sm md:text-base py-2 border-b border-border/30 last:border-0"
                >
                  <span className="text-foreground/80">{app.name}</span>
                  <span className="font-mono text-primary flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Included
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between pt-4 border-t border-primary/30">
              <span className="font-syne font-bold uppercase text-sm tracking-wider">
                One-time
              </span>
              <span className="font-syne text-2xl md:text-3xl font-bold text-primary">
                $98<span className="text-sm text-muted-foreground font-normal"> once</span>
              </span>
            </div>

            <p className="mt-4 text-xs text-primary/80 flex items-center gap-2">
              <DollarSign className="w-3 h-3" /> Save ${totalApps * 12}+ per year · faster store · own your code
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CostComparison;