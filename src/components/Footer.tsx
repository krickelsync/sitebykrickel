import { motion } from "framer-motion";
import { Instagram, Twitter, Disc } from "lucide-react";

const Footer = () => {
  const socialLinks = [
    { icon: Instagram, href: "https://www.instagram.com/krickel.sync/", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Disc, href: "#", label: "Discord" },
  ];

  return (
    <footer className="py-16 md:py-24 border-t border-muted">
      <div className="container px-4">
        <div className="flex flex-col items-center text-center">
          {/* Large Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight mb-8">
              KRICKEL
              <br />
              <span className="text-primary glow-text">STUDIO</span>
            </h2>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-6 mb-8"
          >
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-12 h-12 glass-card rounded-full flex items-center justify-center hover:border-primary/50 hover:text-primary transition-all duration-300 group"
                >
                  <Icon size={20} className="group-hover:scale-110 transition-transform" />
                </a>
              );
            })}
          </motion.div>

          {/* Copyright */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="font-mono text-xs text-muted-foreground"
          >
            © 2025 KRICKEL STUDIO. ALL RIGHTS RESERVED.
          </motion.p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
