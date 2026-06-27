import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Instagram, Mail, Plus } from "lucide-react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { scrollToId } from "@/lib/scroll";
import { FOOTER_QUICK_LINKS, type NavLinkItem } from "@/lib/nav";
const AnimatedBrandText = ({
  text,
  className,
  delay = 0
}: {
  text: string;
  className?: string;
  delay?: number;
}) => {
  const letters = text.split("");
  const container = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: delay
      }
    }
  };
  const letterVariant = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.6, -0.05, 0.01, 0.99] as const
      }
    }
  };
  return <motion.span className={className} variants={container} initial="hidden" whileInView="visible" viewport={{
    once: true
  }}>
      {letters.map((letter, index) => <motion.span key={index} variants={letterVariant} className="inline-block" whileHover={{
      y: -2,
      transition: {
        duration: 0.2
      }
    }}>
          {letter === " " ? "\u00A0" : letter}
        </motion.span>)}
    </motion.span>;
};
interface FooterProps {
  customQuickLinks?: NavLinkItem[];
}

const Footer = ({ customQuickLinks }: FooterProps = {}) => {
  const quickLinks = customQuickLinks ?? FOOTER_QUICK_LINKS;
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: wordmarkRef,
    offset: ["start end", "end end"],
  });
  const wordmarkY = useTransform(scrollYProgress, [0, 1], ["12%", "-4%"]);
  const wordmarkScale = useTransform(scrollYProgress, [0, 1], [0.96, 1.02]);
  const wordmarkBlurPx = useTransform(scrollYProgress, [0, 0.6, 1], [8, 0, 0]);
  const wordmarkFilter = useTransform(wordmarkBlurPx, (b) => `blur(${b}px)`);
  const [openSection, setOpenSection] = useState<"links" | "contact" | null>("links");
  const toggle = (key: "links" | "contact") =>
    setOpenSection((prev) => (prev === key ? null : key));

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const hash = href.substring(1);
      scrollToId(hash);
    }
  };
  return <footer className="relative overflow-hidden border-t border-muted pt-10 md:pt-12">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      <div aria-hidden className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-64 w-[80%] rounded-full bg-primary/10 blur-3xl" />
      <div className="container px-4 relative max-w-2xl">
        <div className="flex flex-col gap-6 mb-8">
          {/* Brand Column */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }} className="space-y-4">
            <h2 className="font-syne text-2xl md:text-3xl font-extrabold uppercase tracking-tight flex flex-col">
              <AnimatedBrandText text="SITE BY" className="text-foreground" />
              <AnimatedBrandText
                text="KRICKEL"
                className="text-[hsl(38_75%_38%)] dark:text-transparent dark:bg-gradient-to-r dark:from-amber-300 dark:via-yellow-400 dark:to-amber-300 dark:bg-clip-text"
                delay={0.4}
              />
            </h2>
            <p className="font-mono text-sm text-muted-foreground max-w-xs">
              Creative Agency. Graphic & Web Design for Clothing Brands & any business ready to stand out.
            </p>
          </motion.div>

          {/* Quick Links Column */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6,
          delay: 0.1
          }} className="border-y border-muted/50 py-3">
            <button
              type="button"
              onClick={() => toggle("links")}
              aria-expanded={openSection === "links"}
              aria-controls="footer-links-panel"
              className="flex w-full items-center justify-between min-h-[44px]"
            >
              <h3 className="font-mono text-xs uppercase tracking-widest text-primary">
                Quick Links
              </h3>
              <Plus
                size={18}
                aria-hidden="true"
                className={`text-muted-foreground transition-transform duration-300 ${openSection === "links" ? "rotate-45" : ""}`}
              />
            </button>
            <motion.ul
              id="footer-links-panel"
              initial={false}
              animate={{
                height: openSection === "links" ? "auto" : 0,
                opacity: openSection === "links" ? 1 : 0,
              }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-2 overflow-hidden mt-3"
            >
              {quickLinks.map(link => <li key={link.name}>
                  {link.href.startsWith("/") && !link.href.includes("#") ? (
                    <Link to={link.href} className="font-mono text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex min-h-[36px] items-center">
                      {link.name}
                    </Link>
                  ) : link.href.startsWith("#") ? (
                    <a
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className="font-mono text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer inline-flex min-h-[36px] items-center"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <a href={link.href} className="font-mono text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex min-h-[36px] items-center">
                      {link.name}
                    </a>
                  )}
                </li>)}
            </motion.ul>
          </motion.div>

          {/* Contact Column */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6,
          delay: 0.2
          }} className="border-b border-muted/50 pb-3">
            <button
              type="button"
              onClick={() => toggle("contact")}
              aria-expanded={openSection === "contact"}
              aria-controls="footer-contact-panel"
              className="flex w-full items-center justify-between min-h-[44px]"
            >
              <h3 className="font-mono text-xs uppercase tracking-widest text-primary">
                Get in Touch
              </h3>
              <Plus
                size={18}
                aria-hidden="true"
                className={`text-muted-foreground transition-transform duration-300 ${openSection === "contact" ? "rotate-45" : ""}`}
              />
            </button>
            <motion.div
              id="footer-contact-panel"
              initial={false}
              animate={{
                height: openSection === "contact" ? "auto" : 0,
                opacity: openSection === "contact" ? 1 : 0,
              }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-3 overflow-hidden mt-3"
            >
              <a href="mailto:contact@sitebykrickel.com" aria-label="Email contact@sitebykrickel.com" className="flex items-center gap-3 font-mono text-sm text-muted-foreground hover:text-foreground transition-colors group">
                <div className="w-10 h-10 glass-card rounded-full flex items-center justify-center group-hover:border-primary/50 transition-colors">
                  <Mail size={16} aria-hidden="true" />
                </div>
                <span>contact@sitebykrickel.com</span>
              </a>
              <a href="https://www.instagram.com/krickel.sync/" target="_blank" rel="noopener noreferrer" aria-label="Instagram @krickel.sync (opens in new tab)" className="flex items-center gap-3 font-mono text-sm text-muted-foreground hover:text-foreground transition-colors group">
                <div className="w-10 h-10 glass-card rounded-full flex items-center justify-center group-hover:border-primary/50 transition-colors">
                  <Instagram size={16} aria-hidden="true" />
                </div>
                <span>@krickel.sync</span>
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div initial={{
        opacity: 0
      }} whileInView={{
        opacity: 1
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.6,
        delay: 0.3
      }} className="pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 relative z-10">
          <p className="font-mono text-xs text-muted-foreground">
            © 2025 SITEBYKRICKEL. ALL RIGHTS RESERVED.
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60">
            Crafted in Indonesia · Built for Brands
          </p>
        </motion.div>
      </div>

      {/* Giant half-cut SYNC wordmark — scroll-reactive */}
      <div
        ref={wordmarkRef}
        aria-hidden
        className="relative mt-6 overflow-hidden select-none"
      >
        <motion.div
          style={
            prefersReducedMotion
              ? undefined
              : { y: wordmarkY, scale: wordmarkScale, filter: wordmarkFilter }
          }
          className="translate-y-[35%] md:translate-y-[40%] will-change-transform"
        >
          <h2
            className="font-syne font-extrabold uppercase tracking-tighter text-center leading-[0.8] text-transparent bg-clip-text bg-gradient-to-b from-foreground/90 via-foreground/40 to-transparent dark:from-amber-200 dark:via-amber-400/40 dark:to-transparent"
            style={{ fontSize: 'clamp(6rem, 32vw, 26rem)' }}
          >
            {"SYNC".split("").map((ch, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={{ y: "60%", opacity: 0, rotate: 6 }}
                whileInView={{ y: "0%", opacity: 1, rotate: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.9,
                  delay: i * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {ch}
              </motion.span>
            ))}
          </h2>
        </motion.div>
      </div>
    </footer>;
};
export default Footer;