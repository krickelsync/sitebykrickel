import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import Logo3D from "./Logo3D";
import { cn } from "@/lib/utils";

// Theme Toggle with smooth animation
const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-5 h-5" />;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 transition-colors hover:text-primary"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ scale: 0, rotate: -90, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={{ scale: 0, rotate: 90, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
          ) : (
            <Moon className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
};

// Custom Hamburger Icon with morphing animation
const HamburgerIcon = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <div className="w-6 h-6 flex flex-col justify-center items-center relative">
      <motion.span
        className="block w-5 h-0.5 bg-foreground absolute"
        animate={{
          rotate: isOpen ? 45 : 0,
          y: isOpen ? 0 : -6,
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.span
        className="block w-5 h-0.5 bg-foreground absolute"
        animate={{
          opacity: isOpen ? 0 : 1,
          scaleX: isOpen ? 0 : 1,
        }}
        transition={{ duration: 0.2 }}
      />
      <motion.span
        className="block w-5 h-0.5 bg-foreground absolute"
        animate={{
          rotate: isOpen ? -45 : 0,
          y: isOpen ? 0 : 6,
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (href: string) => {
    // Exact match untuk Home "/"
    if (href === '/') {
      return location.pathname === '/' && !location.hash;
    }
    
    // Link dengan hash (seperti /#pricing, /about#contact)
    if (href.includes('#')) {
      const [path, hash] = href.split('#');
      const targetPath = path === '' ? '/' : path;
      return location.pathname === targetPath && location.hash === `#${hash}`;
    }
    
    // Regular page links
    return location.pathname === href;
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.includes('#')) {
      const [path, hash] = href.split('#');
      const isCurrentPage = path === '' || path === '/' ? location.pathname === '/' : location.pathname === path;
      
      if (isCurrentPage && hash) {
        e.preventDefault();
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  };

  const navLinks = [{
    name: "Home",
    href: "/",
    external: false
  }, {
    name: "About",
    href: "/about",
    external: false
  }, {
    name: "Portofolio",
    href: "/showcase",
    external: false
  }, {
    name: "Pricing",
    href: "/#pricing",
    external: false
  }, {
    name: "Contact",
    href: "/about#contact",
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
                onClick={(e) => handleNavClick(e, link.href)}
                className={cn(
                  "font-mono text-sm transition-all duration-400 ease-out hover-lift relative",
                  isActive(link.href) 
                    ? "text-primary font-semibold after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-px after:bg-primary" 
                    : "text-muted-foreground hover:text-foreground hover-underline-reveal"
                )}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* CTA Button + Theme Toggle */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <a
              href="/about#contact"
              className="cta-shiny rounded-xl bg-background/5 border border-foreground/10 px-6 py-2.5 font-mono text-sm hover:bg-primary/10 transition-all duration-300 hover:glow-border animate-pulse-glow hover-scale-premium"
            >
              <span className="relative z-10">Get Started</span>
            </a>
          </div>

          {/* Mobile Menu Button + Theme Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2"
              aria-label="Toggle menu"
            >
              <HamburgerIcon isOpen={isOpen} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation with AnimatePresence */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{
                opacity: 1,
                height: "auto",
                y: 0,
                transition: {
                  height: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                  opacity: { duration: 0.3, delay: 0.1 },
                  y: { duration: 0.3, ease: "easeOut" }
                }
              }}
              exit={{
                opacity: 0,
                height: 0,
                y: -10,
                transition: {
                  height: { duration: 0.3 },
                  opacity: { duration: 0.2 },
                  y: { duration: 0.2 }
                }
              }}
              className="md:hidden pb-6 overflow-hidden"
            >
              <div className="flex flex-col gap-4">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      transition: { delay: 0.1 + index * 0.05 }
                    }}
                    exit={{ opacity: 0, x: -10 }}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    onClick={(e) => {
                      handleNavClick(e, link.href);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "font-mono text-sm transition-colors",
                      isActive(link.href) 
                        ? "text-primary font-semibold" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {link.name}
                  </motion.a>
                ))}
                <motion.a
                  initial={{ opacity: 0, x: -20 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    transition: { delay: 0.1 + navLinks.length * 0.05 }
                  }}
                  exit={{ opacity: 0, x: -10 }}
                  href="/about#contact"
                  onClick={() => setIsOpen(false)}
                  className="cta-shiny rounded-xl bg-background/5 border border-white/10 px-6 py-2.5 font-mono text-sm text-center mt-2"
                >
                  <span className="relative z-10">Get Started</span>
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
