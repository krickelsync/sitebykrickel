import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import Logo3D from "./Logo3D";
import { cn } from "@/lib/utils";

// Theme Toggle with dramatic animation
const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-5 h-5" />;

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative p-2 transition-colors hover:text-primary overflow-hidden"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ 
            scale: 0, 
            rotate: -180,
            opacity: 0,
            y: 20
          }}
          animate={{ 
            scale: 1, 
            rotate: 0, 
            opacity: 1,
            y: 0
          }}
          exit={{ 
            scale: 0, 
            rotate: 180, 
            opacity: 0,
            y: -20
          }}
          transition={{ 
            type: "spring",
            stiffness: 200,
            damping: 15
          }}
          className="relative"
        >
          {isDark ? (
            <motion.div
              animate={{ 
                rotate: [0, 15, -15, 10, -10, 0],
              }}
              transition={{ 
                duration: 0.8,
                ease: "easeInOut"
              }}
            >
              <Sun className="w-5 h-5 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.6)]" />
            </motion.div>
          ) : (
            <motion.div
              animate={{ 
                rotate: [0, -15, 15, -10, 10, 0],
                scale: [1, 1.15, 1]
              }}
              transition={{ 
                duration: 0.8,
                ease: "easeInOut"
              }}
            >
              <Moon className="w-5 h-5 text-blue-300 drop-shadow-[0_0_10px_rgba(147,197,253,0.6)]" />
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
      
      {/* Background glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full -z-10"
        animate={{
          backgroundColor: isDark 
            ? "rgba(250, 204, 21, 0.15)" 
            : "rgba(147, 197, 253, 0.15)",
          scale: [1, 1.3, 1]
        }}
        transition={{ duration: 0.6 }}
      />
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
  const navigate = useNavigate();

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
      e.preventDefault();
      const [path, hash] = href.split('#');
      const targetPath = path === '' ? '/' : path;
      const isCurrentPage = location.pathname === targetPath;
      
      if (isCurrentPage && hash) {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        navigate(targetPath);
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
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
    name: "Products",
    href: "/products",
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
          <Link to="/" className="flex items-center justify-center overflow-visible" style={{ overflow: 'visible' }}>
            <Logo3D />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => 
              link.href.includes('#') ? (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={cn(
                    "font-mono text-sm transition-all duration-400 ease-out hover-lift relative cursor-pointer",
                    isActive(link.href) 
                      ? "text-primary font-semibold after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-px after:bg-primary" 
                      : "text-muted-foreground hover:text-foreground hover-underline-reveal"
                  )}
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    "font-mono text-sm transition-all duration-400 ease-out hover-lift relative",
                    isActive(link.href) 
                      ? "text-primary font-semibold after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-px after:bg-primary" 
                      : "text-muted-foreground hover:text-foreground hover-underline-reveal"
                  )}
                >
                  {link.name}
                </Link>
              )
            )}
          </div>

          {/* CTA Button + Theme Toggle */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <a
              href="/about#contact"
              onClick={(e) => handleNavClick(e, "/about#contact")}
              className="cta-shiny rounded-xl bg-background/5 border border-foreground/10 px-6 py-2.5 font-mono text-sm hover:bg-primary/10 transition-all duration-300 hover:glow-border animate-pulse-glow hover-scale-premium cursor-pointer"
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
                {navLinks.map((link, index) => 
                  link.href.includes('#') ? (
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
                      onClick={(e) => {
                        handleNavClick(e, link.href);
                        setIsOpen(false);
                      }}
                      className={cn(
                        "font-mono text-sm transition-colors cursor-pointer",
                        isActive(link.href) 
                          ? "text-primary font-semibold" 
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {link.name}
                    </motion.a>
                  ) : (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        transition: { delay: 0.1 + index * 0.05 }
                      }}
                      exit={{ opacity: 0, x: -10 }}
                    >
                      <Link
                        to={link.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "font-mono text-sm transition-colors block",
                          isActive(link.href) 
                            ? "text-primary font-semibold" 
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  )
                )}
                <motion.a
                  initial={{ opacity: 0, x: -20 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    transition: { delay: 0.1 + navLinks.length * 0.05 }
                  }}
                  exit={{ opacity: 0, x: -10 }}
                  href="/about#contact"
                  onClick={(e) => {
                    handleNavClick(e, "/about#contact");
                    setIsOpen(false);
                  }}
                  className="cta-shiny rounded-xl bg-background/5 border border-white/10 px-6 py-2.5 font-mono text-sm text-center mt-2 cursor-pointer"
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
