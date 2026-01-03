import { motion } from "framer-motion";
import { Instagram, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Showcase", href: "/showcase" },
    { name: "Pricing", href: "/#pricing" },
    { name: "Contact", href: "/about#contact" },
  ];

  return (
    <footer className="py-16 md:py-24 border-t border-muted">
      <div className="container px-4">
        <div className="grid md:grid-cols-3 gap-12 md:gap-8 mb-12">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h2 className="font-syne text-2xl md:text-3xl font-extrabold uppercase tracking-tight">
              <span className="text-foreground">SITE BY</span>{" "}
              <span
                className="text-yellow-400"
                style={{
                  filter:
                    "drop-shadow(0 0 8px rgba(250, 204, 21, 0.6)) drop-shadow(0 0 20px rgba(250, 204, 21, 0.4))",
                }}
              >
                KRICKEL
              </span>
            </h2>
            <p className="font-mono text-sm text-muted-foreground max-w-xs">
              Creative Agency. Graphic & Web Design for Clothing Brands & any business ready to stand out.
            </p>
          </motion.div>

          {/* Quick Links Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="font-mono text-xs uppercase tracking-widest text-primary">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  {link.href.startsWith("/") && !link.href.includes("#") ? (
                    <Link
                      to={link.href}
                      className="font-mono text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="font-mono text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="font-mono text-xs uppercase tracking-widest text-primary">
              Get in Touch
            </h3>
            <div className="space-y-3">
              <a
                href="mailto:contact@sitebykrickel.com"
                className="flex items-center gap-3 font-mono text-sm text-muted-foreground hover:text-foreground transition-colors group"
              >
                <div className="w-10 h-10 glass-card rounded-full flex items-center justify-center group-hover:border-primary/50 transition-colors">
                  <Mail size={16} />
                </div>
                <span>contact@sitebykrickel.com</span>
              </a>
              <a
                href="https://www.instagram.com/krickel.sync/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 font-mono text-sm text-muted-foreground hover:text-foreground transition-colors group"
              >
                <div className="w-10 h-10 glass-card rounded-full flex items-center justify-center group-hover:border-primary/50 transition-colors">
                  <Instagram size={16} />
                </div>
                <span>@krickel.sync</span>
              </a>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="pt-8 border-t border-muted/50 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="font-mono text-xs text-muted-foreground">
            © 2025 SITEBYKRICKEL. ALL RIGHTS RESERVED.
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            Made with ♥ in Indonesia
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
