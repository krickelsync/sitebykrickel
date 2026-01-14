import { motion } from "framer-motion";
import { Instagram, Mail } from "lucide-react";
import { Link } from "react-router-dom";
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
  customQuickLinks?: Array<{
    name: string;
    href: string;
  }>;
}

const Footer = ({ customQuickLinks }: FooterProps = {}) => {
  const defaultQuickLinks = [{
    name: "Home",
    href: "/"
  }, {
    name: "About",
    href: "/about"
  }, {
    name: "Portofolio",
    href: "/showcase"
  }, {
    name: "Pricing",
    href: "/#pricing"
  }, {
    name: "Contact",
    href: "/about#contact"
  }];

  const quickLinks = customQuickLinks || defaultQuickLinks;
  return <footer className="py-16 md:py-24 border-t border-muted">
      <div className="container px-4">
        <div className="grid md:grid-cols-3 gap-12 md:gap-8 mb-12">
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
              <AnimatedBrandText text="KRICKEL" className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 bg-clip-text text-transparent" delay={0.4} />
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
        }} className="space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-widest text-primary">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map(link => <li key={link.name}>
                  {link.href.startsWith("/") && !link.href.includes("#") ? <Link to={link.href} className="font-mono text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.name}
                    </Link> : <a href={link.href} className="font-mono text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.name}
                    </a>}
                </li>)}
            </ul>
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
        }} className="space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-widest text-primary">
              Get in Touch
            </h3>
            <div className="space-y-3">
              <a href="mailto:contact@sitebykrickel.com" className="flex items-center gap-3 font-mono text-sm text-muted-foreground hover:text-foreground transition-colors group">
                <div className="w-10 h-10 glass-card rounded-full flex items-center justify-center group-hover:border-primary/50 transition-colors">
                  <Mail size={16} />
                </div>
                <span>contact@sitebykrickel.com</span>
              </a>
              <a href="https://www.instagram.com/krickel.sync/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 font-mono text-sm text-muted-foreground hover:text-foreground transition-colors group">
                <div className="w-10 h-10 glass-card rounded-full flex items-center justify-center group-hover:border-primary/50 transition-colors">
                  <Instagram size={16} />
                </div>
                <span>@krickel.sync</span>
              </a>
            </div>
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
      }} className="pt-8 border-t border-muted/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-muted-foreground">
            © 2025 SITEBYKRICKEL. ALL RIGHTS RESERVED.
          </p>
          
        </motion.div>
      </div>
    </footer>;
};
export default Footer;