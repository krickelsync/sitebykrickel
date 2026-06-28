import SectionHeader from "@/components/shared/SectionHeader";
import { motion } from "framer-motion";

const SCREENS = [
  { tag: "HOMEPAGE", grad: "linear-gradient(160deg,#0b1220 0%,#1e293b 55%,#60a5fa 130%)" },
  { tag: "PRODUCT", grad: "linear-gradient(160deg,#0c0a09 0%,#292524 55%,#facc15 140%)" },
  { tag: "COLLECTION", grad: "linear-gradient(160deg,#082f49 0%,#0c4a6e 55%,#e0f2fe 130%)" },
  { tag: "CART", grad: "linear-gradient(160deg,#171717 0%,#262626 55%,#3b82f6 140%)" },
  { tag: "CHECKOUT", grad: "linear-gradient(160deg,#1c1917 0%,#44403c 55%,#e7e5e4 140%)" },
];

const ScreenSlide = ({ tag, grad }: { tag: string; grad: string }) => (
  <div className="macbook-slide" style={{ background: grad }}>
    <div className="macbook-slide__bar">
      <span /><span /><span />
      <span className="macbook-slide__url">sitebykrickel.com</span>
    </div>
    <div className="macbook-slide__hero">
      <span className="macbook-slide__eyebrow">{tag}</span>
      <span className="macbook-slide__title" />
      <span className="macbook-slide__sub" />
      <span className="macbook-slide__cta" />
    </div>
    <div className="macbook-slide__grid">
      <span /><span /><span /><span /><span /><span />
    </div>
    <div className="macbook-slide__row">
      <span /><span /><span />
    </div>
  </div>
);

const DesktopShowcase = () => (
  <section className="py-20 md:py-28 border-t border-border overflow-hidden">
    <div className="container mx-auto px-6 md:px-8 max-w-4xl">
      <SectionHeader
        eyebrow="DESKTOP PREVIEW"
        title="LIVE THEME, RUNNING"
        accent="ON A REAL MACHINE."
      />
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="font-mono text-xs md:text-lg text-muted-foreground text-center leading-relaxed max-w-2xl mx-auto"
      >
        A full walkthrough of homepage, product, collection, cart and checkout —
        scrolling continuously so you can feel the flow.
      </motion.p>
    </div>

    <div className="container mx-auto px-6 md:px-8 max-w-5xl mt-12 md:mt-16">
      <div className="macbook" aria-hidden>
        <div className="macbook__lid">
          <div className="macbook__bezel">
            <span className="macbook__camera" />
            <div className="macbook__screen">
              <div className="macbook__scroll">
                {[...SCREENS, ...SCREENS].map((s, i) => (
                  <ScreenSlide key={i} tag={s.tag} grad={s.grad} />
                ))}
              </div>
              <span className="macbook__glare" />
            </div>
          </div>
        </div>
        <div className="macbook__base">
          <span className="macbook__notch" />
        </div>
      </div>
    </div>
  </section>
);

export default DesktopShowcase;