import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Instagram, Mail, ArrowUpRight } from "lucide-react";
import { useRef } from "react";
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

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const hash = href.substring(1);
      scrollToId(hash);
    }
  };
  return <footer className="relative overflow-hidden border-t border-muted pt-8 md:pt-10">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      <div aria-hidden className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-64 w-[80%] rounded-full bg-primary/10 blur-3xl" />
      <div className="container px-4 relative">
        {/* Bento Grid — 4 cells: 1 col mobile → 2x2 sm → 4 cols lg */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-5 md:mb-7">
          {/* Cell 1 — Brand */}
          <BentoCell delay={0}>
            <h2 className="font-syne text-2xl md:text-3xl font-extrabold uppercase tracking-tight flex flex-col leading-[0.95] mb-2">
              <AnimatedBrandText text="SITE BY" className="text-foreground" />
              <AnimatedBrandText
                text="KRICKEL"
                className="text-[hsl(38_75%_38%)] dark:text-transparent dark:bg-gradient-to-r dark:from-amber-300 dark:via-yellow-400 dark:to-amber-300 dark:bg-clip-text"
                delay={0.4}
              />
            </h2>
            <p className="font-mono text-[11px] md:text-xs text-muted-foreground leading-snug">
              Creative agency for clothing brands ready to stand out.
            </p>
          </BentoCell>

          {/* Cell 2 — Quick Links */}
          <BentoCell delay={0.05}>
            <h3 className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-primary mb-2">
              Quick Links
            </h3>
            <ul className="grid grid-cols-2 gap-x-2 gap-y-0.5">
              {quickLinks.map(link => (
                <li key={link.name}>
                  {link.href.startsWith("/") && !link.href.includes("#") ? (
                    <Link to={link.href} className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex min-h-[26px] items-center">
                      {link.name}
                    </Link>
                  ) : link.href.startsWith("#") ? (
                    <a href={link.href} onClick={(e) => handleNavClick(e, link.href)} className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer inline-flex min-h-[26px] items-center">
                      {link.name}
                    </a>
                  ) : (
                    <a href={link.href} className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex min-h-[26px] items-center">
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </BentoCell>

          {/* Cell 3 — Latest Project */}
          <BentoCell delay={0.1} asLink href="https://kcklsite.myshopify.com" external>
            <div className="absolute inset-0 -z-10 opacity-60 group-hover:opacity-90 transition-opacity"
              style={{
                background:
                  "radial-gradient(120% 80% at 20% 0%, hsl(var(--primary)/0.35), transparent 60%), radial-gradient(100% 80% at 100% 100%, hsl(38 75% 50% / 0.25), transparent 55%), linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--muted)/0.4) 100%)",
              }}
            />
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-primary">
                Latest Demo
              </h3>
              <ArrowUpRight size={14} className="text-foreground/60 group-hover:text-foreground group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="mt-auto pt-4">
              <p className="font-syne text-lg md:text-xl font-bold uppercase tracking-tight leading-tight">
                Clean Slate
              </p>
              <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
                Shopify · Streetwear theme
              </p>
            </div>
          </BentoCell>

          {/* Cell 4 — Contact */}
          <BentoCell delay={0.15}>
            <h3 className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-primary mb-2">
              Get in Touch
            </h3>
            <div className="space-y-1.5">
              <a href="mailto:contact@sitebykrickel.com" aria-label="Email contact@sitebykrickel.com" className="flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors group/c break-all">
                <span className="w-8 h-8 shrink-0 glass-card rounded-full flex items-center justify-center group-hover/c:border-primary/50 transition-colors">
                  <Mail size={13} aria-hidden="true" />
                </span>
                <span className="truncate">contact@sitebykrickel.com</span>
              </a>
              <a href="https://www.instagram.com/krickel.sync/" target="_blank" rel="noopener noreferrer" aria-label="Instagram @krickel.sync (opens in new tab)" className="flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors group/c">
                <span className="w-8 h-8 shrink-0 glass-card rounded-full flex items-center justify-center group-hover/c:border-primary/50 transition-colors">
                  <Instagram size={13} aria-hidden="true" />
                </span>
                <span>@krickel.sync</span>
              </a>
            </div>
          </BentoCell>
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
      }} className="pt-4 md:pt-5 border-t border-muted/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-1.5 relative z-10">
          <p className="font-mono text-[10px] md:text-xs text-muted-foreground">
            © 2025 SITEBYKRICKEL. ALL RIGHTS RESERVED.
          </p>
          <p className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60">
            Crafted in Indonesia · Built for Brands
          </p>
        </motion.div>
      </div>

      {/* Giant half-cut SYNC wordmark — scroll-reactive */}
      <div
        ref={wordmarkRef}
        aria-hidden
        className="relative mt-2 md:mt-3 overflow-hidden select-none px-4 max-h-[26vw] md:max-h-[12vw]"
      >
        <motion.div
          style={
            prefersReducedMotion
              ? undefined
              : { y: wordmarkY, scale: wordmarkScale, filter: wordmarkFilter }
          }
          className="translate-y-[22%] md:translate-y-[28%] will-change-transform"
        >
          <h2
            className="font-syne font-extrabold uppercase tracking-tighter text-center leading-[0.8] text-transparent bg-clip-text bg-gradient-to-b from-foreground/90 via-foreground/40 to-transparent dark:from-amber-200 dark:via-amber-400/40 dark:to-transparent"
            style={{ fontSize: 'clamp(3rem, 19vw, 18rem)', whiteSpace: 'nowrap' }}
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

// Bento cell wrapper — rotating conic outline (matches navbar pill aesthetic)
const BentoCell = ({
  children,
  delay = 0,
  asLink = false,
  href,
  external = false,
}: {
  children: React.ReactNode;
  delay?: number;
  asLink?: boolean;
  href?: string;
  external?: boolean;
}) => {
  const className =
    "menu-rotating-glow group relative overflow-hidden rounded-2xl border border-muted bg-background/30 backdrop-blur-md p-4 md:p-5 min-h-[140px] md:min-h-[160px] flex flex-col transition-colors hover:border-primary/40";
  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay }}
      className="relative z-10 flex flex-col flex-1"
    >
      {children}
    </motion.div>
  );
  if (asLink && href) {
    return (
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className={className}
      >
        {inner}
      </a>
    );
  }
  return <div className={className}>{inner}</div>;
};

export default Footer;