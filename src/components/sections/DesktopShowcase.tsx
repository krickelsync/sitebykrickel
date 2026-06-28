import SectionHeader from "@/components/shared/SectionHeader";
import { motion } from "framer-motion";
import { Monitor } from "lucide-react";

const DesktopShowcase = () => (
  <section className="laptop-showcase" data-glow="cyan">
    <div className="laptop-showcase__inner">
      <div className="laptop-showcase__intro">
        <SectionHeader
          eyebrow="SEE IT IN MOTION"
          title="WATCH IT RUN."
          accent=""
        />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-mono text-xs md:text-lg text-muted-foreground text-center leading-relaxed max-w-2xl mx-auto mt-4"
        >
          Real interactions, real flow. Here's a recording of the theme running in the wild.
        </motion.p>
      </div>

      <div className="laptop-showcase__device">
        <div className="laptop" data-laptop>
          <div className="laptop__lid">
            <span className="laptop__camera" aria-hidden />
            <div className="laptop__screen">
              <div className="laptop__chrome">
                <span className="laptop__chrome-dots">
                  <span className="laptop__chrome-dot laptop__chrome-dot--red" />
                  <span className="laptop__chrome-dot laptop__chrome-dot--yellow" />
                  <span className="laptop__chrome-dot laptop__chrome-dot--green" />
                </span>
                <span className="laptop__chrome-url">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  sitebykrickel.com
                </span>
                <span className="laptop__chrome-spacer" />
              </div>
              <div className="laptop__display laptop__display--has-chrome">
                <div className="laptop__placeholder">
                  <Monitor />
                  <span>Live preview coming soon</span>
                </div>
              </div>
              <span className="laptop__reflection" aria-hidden />
            </div>
            <span className="laptop__led" aria-hidden />
          </div>
          <div className="laptop__hinge" aria-hidden />
          <div className="laptop__base" aria-hidden>
            <div className="laptop__keys" />
            <div className="laptop__trackpad" />
            <span className="laptop__notch" />
          </div>
          <span className="laptop__glow" aria-hidden />
          <span className="laptop__shadow" aria-hidden />
        </div>
      </div>
    </div>
  </section>
);

export default DesktopShowcase;
