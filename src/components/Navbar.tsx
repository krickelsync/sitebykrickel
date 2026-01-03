import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Logo3D from "./Logo3D";
import HamburgerIcon from "./HamburgerIcon";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navLinks = [{
    name: "Features",
    href: "/#features",
    external: false
  }, {
    name: "Pricing",
    href: "/#pricing",
    external: false
  }, {
    name: "Showcase",
    href: "/showcase",
    external: false
  }, {
    name: "Demo",
    href: "https://kcklsite.myshopify.com/",
    external: true
  }, {
    name: "About Me",
    href: "/about",
    external: false
  }];

  return (
    <motion.nav 
      initial={{ y: -100 }} 
      animate={{ y: 0 }} 
      transition={{ duration: 0.6, ease: "easeOut" }} 
      className="fixed top-0 left-0 right-0 z-50 glass overflow-visible"
    >
      <div className="container mx-auto px-4 overflow-visible">
        <div className="flex items-center justify-between h-20 overflow-visible">
          {/* 3D Logo */}
          <a href="/" className="flex items-center justify-center overflow-visible" style={{ overflow: 'visible' }}>
            <Logo3D />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <a 
                key={link.name} 
                href={link.href} 
                target={link.external ? "_blank" : undefined} 
                rel={link.external ? "noopener noreferrer" : undefined} 
                className="font-mono text-sm text-muted-foreground hover:text-foreground transition-all duration-400 ease-out hover-underline-reveal hover-lift"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <a 
              href="/#pricing" 
              className="btn-shiny glass-card px-6 py-2.5 font-mono text-sm hover:bg-primary/10 transition-all duration-300 hover:glow-border"
            >
              Get Started
            </a>
          </div>

          {/* Mobile Menu Button */}
          <HamburgerIcon isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: "auto" }} 
              exit={{ opacity: 0, height: 0 }} 
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="md:hidden pb-6 overflow-hidden"
            >
              <div className="flex flex-col gap-4">
                {navLinks.map((link, index) => (
                  <motion.a 
                    key={link.name} 
                    href={link.href} 
                    target={link.external ? "_blank" : undefined} 
                    rel={link.external ? "noopener noreferrer" : undefined} 
                    onClick={() => setIsOpen(false)} 
                    className="font-mono text-sm text-muted-foreground hover:text-foreground transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    {link.name}
                  </motion.a>
                ))}
                <motion.a 
                  href="/#pricing" 
                  onClick={() => setIsOpen(false)} 
                  className="btn-shiny glass-card px-6 py-2.5 font-mono text-sm text-center mt-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.05, duration: 0.3 }}
                >
                  Get Started
                </motion.a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
