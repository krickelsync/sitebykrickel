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
      className="fixed top-3 left-0 right-0 z-50 overflow-visible px-3 sm:px-6"
    >
      <div className="container mx-auto overflow-visible relative">
        <div className="flex items-center justify-between gap-3 overflow-visible">
          {/* 3D Logo — pill capsule */}
          <Link
            to="/"
            className="navbar-pill flex items-center justify-center h-12 px-4 shrink-0"
            style={{ overflow: 'visible', ['--beam-delay' as any]: '-2.3s' }}
          >
            <Logo3D />
          </Link>

          {/* Desktop Navigation — pill capsule */}
          <div
            className="hidden md:flex items-center gap-1 navbar-pill h-12 px-2"
            style={{ ['--beam-delay' as any]: '-5.1s' }}
          >
            {navLinks.map(link => 
              link.href.includes('#') ? (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={cn(
                    "font-mono text-sm px-3 py-1.5 rounded-full transition-all duration-300 cursor-pointer",
                    isActive(link.href)
                      ? "bg-foreground text-background font-semibold"
                      : "text-muted-foreground hover:text-foreground"
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
                    "font-mono text-sm px-3 py-1.5 rounded-full transition-all duration-300",
                    isActive(link.href)
                      ? "bg-foreground text-background font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.name}
                </Link>
              )
            )}
          </div>

          {/* CTA Button + Theme Toggle — pill capsule */}
          <div
            className="hidden md:flex items-center gap-2 navbar-pill h-12 px-2"
            style={{ ['--beam-delay' as any]: '-7.4s' }}
          >
            <ThemeToggle />
            {onCtaClick ? (
              <button
                onClick={onCtaClick}
                className="cta-shiny rounded-full bg-foreground text-background px-5 py-2 font-mono text-sm hover:opacity-90 transition-all duration-300 cursor-pointer"
              >
                <span className="relative z-10">{finalCtaText}</span>
              </button>
            ) : (
              <a
                href={finalCtaHref}
                onClick={(e) => handleNavClick(e, finalCtaHref)}
                className="cta-shiny rounded-full bg-foreground text-background px-5 py-2 font-mono text-sm hover:opacity-90 transition-all duration-300 cursor-pointer"
              >
                <span className="relative z-10">{finalCtaText}</span>
              </a>
            )}
          </div>

          {/* Mobile Menu Button + Theme Toggle — pill capsule */}
          <div
            className="flex md:hidden items-center gap-1 navbar-pill h-12 px-2"
            style={{ ['--beam-delay' as any]: '-4s' }}
          >
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 min-h-10 min-w-10 inline-flex items-center justify-center rounded-full hover:bg-foreground/5 transition-colors"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-nav"
            >
              <HamburgerIcon isOpen={isOpen} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation — floating dropdown pill, anchored top-right */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="mobile-nav"
              initial={{ opacity: 0, scale: 0.92, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: "top right" }}
              className="md:hidden absolute right-0 top-14 w-56 navbar-pill !rounded-3xl p-2 shadow-2xl"
            >
              <div className="flex flex-col gap-1">
                {navLinks.map((link, index) => 
                  link.href.includes('#') ? (
                    <motion.a
                      key={link.name}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0, transition: { delay: 0.04 + index * 0.04 } }}
                      exit={{ opacity: 0 }}
                      href={link.href}
                      onClick={(e) => {
                        handleNavClick(e, link.href);
                        setIsOpen(false);
                      }}
                      className={cn(
                        "font-mono text-sm px-4 py-2.5 rounded-full transition-colors cursor-pointer",
                        isActive(link.href)
                          ? "bg-foreground text-background font-semibold"
                          : "text-foreground/80 hover:bg-foreground/5 hover:text-foreground"
                      )}
                    >
                      {link.name}
                    </motion.a>
                  ) : (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0, transition: { delay: 0.04 + index * 0.04 } }}
                      exit={{ opacity: 0 }}
                    >
                      <Link
                        to={link.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "font-mono text-sm px-4 py-2.5 rounded-full transition-colors block",
                          isActive(link.href)
                            ? "bg-foreground text-background font-semibold"
                            : "text-foreground/80 hover:bg-foreground/5 hover:text-foreground"
                        )}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  )
                )}
                {onCtaClick ? (
                  <motion.button
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.04 + navLinks.length * 0.04 } }}
                    exit={{ opacity: 0 }}
                    onClick={() => {
                      onCtaClick();
                      setIsOpen(false);
                    }}
                    className="cta-shiny rounded-full bg-foreground text-background px-4 py-2.5 font-mono text-sm text-center mt-1 cursor-pointer"
                  >
                    <span className="relative z-10">{finalCtaText}</span>
                  </motion.button>
                ) : (
                  <motion.a
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.04 + navLinks.length * 0.04 } }}
                    exit={{ opacity: 0 }}
                    href={finalCtaHref}
                    onClick={(e) => {
                      handleNavClick(e, finalCtaHref);
                      setIsOpen(false);
                    }}
                    className="cta-shiny rounded-full bg-foreground text-background px-4 py-2.5 font-mono text-sm text-center mt-1 cursor-pointer"
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
