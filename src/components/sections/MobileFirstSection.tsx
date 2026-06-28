import SectionHeader from "@/components/shared/SectionHeader";
import { motion } from "framer-motion";
import { useMemo } from "react";

const PLACEHOLDER_GRADIENTS = [
  "linear-gradient(135deg,#0f172a 0%,#1e293b 50%,#334155 100%)",
  "linear-gradient(135deg,#1e1b4b 0%,#312e81 60%,#60a5fa 100%)",
  "linear-gradient(135deg,#0c0a09 0%,#292524 50%,#78716c 100%)",
  "linear-gradient(135deg,#082f49 0%,#0c4a6e 60%,#e0f2fe 100%)",
  "linear-gradient(135deg,#1f2937 0%,#374151 60%,#9ca3af 100%)",
  "linear-gradient(135deg,#171717 0%,#262626 50%,#facc15 120%)",
  "linear-gradient(135deg,#020617 0%,#1e293b 50%,#3b82f6 100%)",
  "linear-gradient(135deg,#1c1917 0%,#44403c 50%,#e7e5e4 110%)",
];

const Phone = ({ idx }: { idx: number }) => {
  const bg = PLACEHOLDER_GRADIENTS[idx % PLACEHOLDER_GRADIENTS.length];
  return (
    <div className="phone-mock shrink-0 mx-2 md:mx-3" aria-hidden>
      <div className="phone-mock__frame">
        <span className="phone-mock__notch" />
        <div className="phone-mock__screen" style={{ background: bg }}>
          <div className="phone-mock__statusbar">
            <span>9:41</span>
            <span className="phone-mock__dot" />
          </div>
          <div className="phone-mock__hero" />
          <div className="phone-mock__grid">
            <span /><span /><span /><span />
          </div>
          <div className="phone-mock__bar" />
        </div>
        <span className="phone-mock__reflection" />
      </div>
    </div>
  );
};

const PhoneRow = ({
  count = 10,
  duration = 40,
  reverse = false,
  offset = 0,
}: {
  count?: number;
  duration?: number;
  reverse?: boolean;
  offset?: number;
}) => {
  const items = useMemo(
    () => Array.from({ length: count }, (_, i) => i + offset),
    [count, offset]
  );
  return (
    <div className="phone-row">
      <div
        className="phone-track"
        style={{
          animationDuration: `${duration}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {[...items, ...items].map((n, i) => (
          <Phone key={i} idx={n} />
        ))}
      </div>
    </div>
  );
};

const MobileFirstSection = () => (
  <section className="py-20 md:py-28 border-t border-border overflow-hidden">
    <div className="container mx-auto px-6 md:px-8 max-w-4xl">
      <SectionHeader
        eyebrow="MOBILE-FIRST"
        title="BUILT FOR THE WAY"
        accent="PEOPLE ACTUALLY SHOP."
      />
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="font-mono text-xs md:text-lg text-muted-foreground text-center leading-relaxed max-w-2xl mx-auto"
      >
        Your customers are discovering your brand from Instagram, TikTok, and mobile links.
        Every layout is designed to look sharp on small screens first.
      </motion.p>
    </div>

    <div className="phone-marquee mt-12 md:mt-16 space-y-4 md:space-y-6">
      <PhoneRow count={8} duration={50} />
      <PhoneRow count={8} duration={65} reverse offset={4} />
    </div>
  </section>
);

export default MobileFirstSection;