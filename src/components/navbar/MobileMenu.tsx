import { motion, AnimatePresence } from "framer-motion";
import NavLink from "./NavLink";
import type { NavLinkItem } from "@/lib/nav";

interface MobileMenuProps {
  isOpen: boolean;
  links: NavLinkItem[];
  isActive: (href: string) => boolean;
  onAnchorClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
  onClose: () => void;
  ctaText: string;
  ctaHref: string;
  onCtaClick?: () => void;
}

const itemAnim = (index: number) => ({
  initial: { opacity: 0, y: -6 },
  animate: { opacity: 1, y: 0, transition: { delay: 0.04 + index * 0.04 } },
  exit: { opacity: 0 },
});

const MobileMenu = ({
  isOpen,
  links,
  isActive,
  onAnchorClick,
  onClose,
  ctaText,
  ctaHref,
  onCtaClick,
}: MobileMenuProps) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        id="mobile-nav"
        initial={{ opacity: 0, scale: 0.92, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -8 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: "top right" }}
        className="md:hidden absolute right-2 top-14 w-44 navbar-pill menu-rotating-glow !rounded-2xl p-1.5 shadow-2xl text-right"
      >
        <div className="flex flex-col gap-0.5 items-stretch">
          {links.map((link, index) => (
            <motion.div key={link.name} {...itemAnim(index)} className="text-right">
              <NavLink
                href={link.href}
                label={link.name}
                active={isActive(link.href)}
                variant="mobile"
                onAnchorClick={onAnchorClick}
                onNavigate={onClose}
              />
            </motion.div>
          ))}

          {onCtaClick ? (
            <motion.button
              {...itemAnim(links.length)}
              onClick={() => {
                onCtaClick();
                onClose();
              }}
              className="cta-shiny rounded-full bg-foreground text-background px-3 py-2 font-mono text-xs text-center mt-1 cursor-pointer"
            >
              <span className="relative z-10">{ctaText}</span>
            </motion.button>
          ) : (
            <motion.a
              {...itemAnim(links.length)}
              href={ctaHref}
              onClick={(e) => {
                onAnchorClick(e, ctaHref);
                onClose();
              }}
              className="cta-shiny rounded-full bg-foreground text-background px-3 py-2 font-mono text-xs text-center mt-1 cursor-pointer"
            >
              <span className="relative z-10">{ctaText}</span>
            </motion.a>
          )}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default MobileMenu;