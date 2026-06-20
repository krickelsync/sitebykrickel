import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  label: string;
  active: boolean;
  variant?: "desktop" | "mobile";
  onAnchorClick?: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
  onNavigate?: () => void;
}

/**
 * Single nav link — picks the right element (anchor for hashes, Link for routes)
 * and applies the active/inactive styling per variant.
 */
const NavLink = ({
  href,
  label,
  active,
  variant = "desktop",
  onAnchorClick,
  onNavigate,
}: NavLinkProps) => {
  const baseClass =
    variant === "desktop"
      ? "font-mono text-sm px-3 py-1.5 rounded-full transition-all duration-300"
      : "font-mono text-sm px-4 py-2.5 rounded-full transition-colors block";

  const activeClass =
    variant === "desktop"
      ? "bg-foreground/10 text-foreground font-semibold"
      : "bg-foreground/10 text-foreground font-semibold";
  const inactiveClass =
    variant === "desktop"
      ? "text-muted-foreground hover:text-foreground"
      : "text-foreground/80 hover:bg-foreground/5 hover:text-foreground";

  const className = cn(baseClass, active ? activeClass : inactiveClass, "cursor-pointer");

  if (href.includes("#")) {
    return (
      <a
        href={href}
        aria-current={active ? "page" : undefined}
        onClick={(e) => {
          onAnchorClick?.(e, href);
          onNavigate?.();
        }}
        className={className}
      >
        {label}
      </a>
    );
  }

  return (
    <Link
      to={href}
      aria-current={active ? "page" : undefined}
      onClick={onNavigate}
      className={className}
    >
      {label}
    </Link>
  );
};

export default NavLink;