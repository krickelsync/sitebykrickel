import { motion } from "framer-motion";
import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Logo3D from "./Logo3D";
import ThemeToggle from "./navbar/ThemeToggle";
import HamburgerIcon from "./navbar/HamburgerIcon";
import NavLink from "./navbar/NavLink";
import MobileMenu from "./navbar/MobileMenu";
import { scrollToId } from "@/lib/scroll";
import { PRIMARY_NAV, type NavLinkItem } from "@/lib/nav";
import { useHashScroll } from "@/hooks/useHashScroll";

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
    if (href === '/') {
      return location.pathname === '/' && !location.hash;
    }
    if (href.startsWith('#') && !href.includes('/')) {
      return location.hash === href;
    }
    if (href.includes('#')) {
      const [path, hash] = href.split('#');
      const targetPath = path === '' ? location.pathname : path;
      return location.pathname === targetPath && location.hash === `#${hash}`;
    }
    // Plain path (no hash) — only active when there's no hash in the URL.
    return location.pathname === href && !location.hash;
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
        navigate(`${targetPath}#${hash}`);
      }
      setIsOpen(false);
    }
  };

  // Auto-scroll on hash change (also handles cross-page navigation).
  useHashScroll();

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
          {/* Logo pill */}
          <Link
            to="/"
            className="navbar-pill flex items-center justify-center h-12 px-4 shrink-0"
            style={{ overflow: 'visible' }}
          >
            <Logo3D />
          </Link>

          {/* Desktop nav pill */}
          <div className="hidden lg:flex items-center gap-1 navbar-pill h-12 px-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                href={link.href}
                label={link.name}
                active={isActive(link.href)}
                variant="desktop"
                onAnchorClick={handleNavClick}
              />
            ))}
          </div>

          {/* CTA + theme pill */}
          <div className="hidden lg:flex items-center gap-2 navbar-pill h-12 px-2">
            <ThemeToggle />
            {onCtaClick ? (
              <button
                onClick={onCtaClick}
                className="cta-shiny rounded-full bg-foreground text-background px-5 py-2 font-mono text-sm whitespace-nowrap hover:opacity-90 transition-all duration-300 cursor-pointer"
              >
                <span className="relative z-10">{finalCtaText}</span>
              </button>
            ) : (
              <a
                href={finalCtaHref}
                onClick={(e) => handleNavClick(e, finalCtaHref)}
                className="cta-shiny rounded-full bg-foreground text-background px-5 py-2 font-mono text-sm whitespace-nowrap hover:opacity-90 transition-all duration-300 cursor-pointer"
              >
                <span className="relative z-10">{finalCtaText}</span>
              </a>
            )}
          </div>

          {/* Mobile / tablet trigger pill */}
          <div className="flex lg:hidden items-center gap-1 navbar-pill h-12 px-2">
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

        <MobileMenu
          isOpen={isOpen}
          links={navLinks}
          isActive={isActive}
          onAnchorClick={handleNavClick}
          onClose={() => setIsOpen(false)}
          ctaText={finalCtaText}
          ctaHref={finalCtaHref}
          onCtaClick={onCtaClick}
        />
      </div>
    </motion.nav>
  );
};

export default Navbar;
