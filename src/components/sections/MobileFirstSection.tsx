import SectionHeader from "@/components/shared/SectionHeader";
import { motion } from "framer-motion";
import { useMemo } from "react";

import phone1 from "@/assets/phones/phone-1.webp.asset.json";
import phone2 from "@/assets/phones/phone-2.webp.asset.json";
import phone3 from "@/assets/phones/phone-3.webp.asset.json";
import phone4 from "@/assets/phones/phone-4.webp.asset.json";
import phone5 from "@/assets/phones/phone-5.webp.asset.json";
import phone6 from "@/assets/phones/phone-6.webp.asset.json";
import phone7 from "@/assets/phones/phone-7.webp.asset.json";
import phone8 from "@/assets/phones/phone-8.webp.asset.json";
import phone9 from "@/assets/phones/phone-9.webp.asset.json";
import phone10 from "@/assets/phones/phone-10.webp.asset.json";
import phone11 from "@/assets/phones/phone-11.webp.asset.json";
import phone12 from "@/assets/phones/phone-12.webp.asset.json";
import phone13 from "@/assets/phones/phone-13.webp.asset.json";

const PHONE_IMAGES = [
  phone1.url, phone2.url, phone3.url, phone4.url, phone5.url, phone6.url,
  phone7.url, phone8.url, phone9.url, phone10.url, phone11.url, phone12.url,
  phone13.url,
];

const Phone = ({ idx }: { idx: number }) => {
  const src = PHONE_IMAGES[idx % PHONE_IMAGES.length];
  return (
    <div className="phone-mock shrink-0 mx-2 md:mx-3" aria-hidden>
      <div className="phone-mock__frame">
        <span className="phone-mock__notch" />
        <div className="phone-mock__screen">
          <img
            src={src}
            alt=""
            loading="lazy"
            decoding="async"
            className="phone-mock__image"
          />
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