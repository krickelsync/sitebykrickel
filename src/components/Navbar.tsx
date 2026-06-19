import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import Logo3D from "./Logo3D";
import { cn } from "@/lib/utils";
import { scrollToId } from "@/lib/scroll";
import { PRIMARY_NAV, type NavLinkItem } from "@/lib/nav";

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

interface NavbarProps {
  customLinks?: NavLinkItem[];
  ctaText?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
}

const Navbar = ({ customLinks, ctaText, ctaHref, onCtaClick }: NavbarProps = {}) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (href: string) => {
    // Exact match untuk Home "/"
    if (href === '/') {
      return location.pathname === '/' && !location.hash;
    }
    
    // Anchor-only links (e.g., "#pricing") - untuk halaman saat ini
    if (href.startsWith('#') && !href.includes('/')) {
      return location.hash === href;
    }
    
    // Link dengan hash (seperti /#pricing, /about#contact)
    if (href.includes('#')) {
      const [path, hash] = href.split('#');
      const targetPath = path === '' ? location.pathname : path;
      return location.pathname === targetPath && location.hash === `#${hash}`;
    }
    
    // Regular page links
    return location.pathname === href;
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.includes('#')) {
      e.preventDefault();
      const [path, hash] = href.split('#');
      const targetPath = path === '' ? location.pathname : path;
      const isCurrentPage = location.pathname === targetPath;
      
      if (isCurrentPage && hash) {
        scrollToId(hash);
      } else {
        // Navigate dengan hash, biar useEffect auto-scroll setelah render
        navigate(`${targetPath}#${hash}`);
      }
      
      setIsOpen(false);
    }
  };

  // Auto-scroll saat location.hash berubah (termasuk saat navigate dari halaman lain)
  useEffect(() => {
    if (location.hash) {
      const hash = location.hash.slice(1);
      // Delay sedikit untuk memastikan DOM sudah render
      const timer = setTimeout(() => {
        scrollToId(hash);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, location.hash]);

  const navLinks = customLinks ?? PRIMARY_NAV;
  const finalCtaText = ctaText || "Get Started";
  const finalCtaHref = ctaHref || "/about#contact";
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
                  aria-current={isActive(link.href) ? "page" : undefined}
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
                  aria-current={isActive(link.href) ? "page" : undefined}
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
            {onCtaClick ? (
              <button
                onClick={onCtaClick}
                className="cta-shiny rounded-xl bg-background/5 border border-foreground/10 px-6 py-2.5 font-mono text-sm hover:bg-primary/10 transition-all duration-300 hover:glow-border animate-pulse-glow hover-scale-premium cursor-pointer"
              >
                <span className="relative z-10">{finalCtaText}</span>
              </button>
            ) : (
              <a
                href={finalCtaHref}
                onClick={(e) => handleNavClick(e, finalCtaHref)}
                className="cta-shiny rounded-xl bg-background/5 border border-foreground/10 px-6 py-2.5 font-mono text-sm hover:bg-primary/10 transition-all duration-300 hover:glow-border animate-pulse-glow hover-scale-premium cursor-pointer"
              >
                <span className="relative z-10">{finalCtaText}</span>
              </a>
            )}
          </div>

          {/* Mobile Menu Button + Theme Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 min-h-11 min-w-11 inline-flex items-center justify-center"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-nav"
            >
              <HamburgerIcon isOpen={isOpen} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation with AnimatePresence */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="mobile-nav"
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
                {onCtaClick ? (
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      transition: { delay: 0.1 + navLinks.length * 0.05 }
                    }}
                    exit={{ opacity: 0, x: -10 }}
                    onClick={() => {
                      onCtaClick();
                      setIsOpen(false);
                    }}
                    className="cta-shiny rounded-xl bg-background/5 border border-white/10 px-6 py-2.5 font-mono text-sm text-center mt-2 cursor-pointer"
                  >
                    <span className="relative z-10">{finalCtaText}</span>
                  </motion.button>
                ) : (
                  <motion.a
                    initial={{ opacity: 0, x: -20 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      transition: { delay: 0.1 + navLinks.length * 0.05 }
                    }}
                    exit={{ opacity: 0, x: -10 }}
                    href={finalCtaHref}
                    onClick={(e) => {
                      handleNavClick(e, finalCtaHref);
                      setIsOpen(false);
                    }}
                    className="cta-shiny rounded-xl bg-background/5 border border-white/10 px-6 py-2.5 font-mono text-sm text-center mt-2 cursor-pointer"
                  >
                    <span className="relative z-10">{finalCtaText}</span>
                  </motion.a>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
