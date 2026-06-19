import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Tag, Briefcase, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { scrollToId } from "@/lib/scroll";

const items = [
  { name: "Home", href: "/", icon: Home },
  { name: "Pricing", href: "/#pricing", icon: Tag },
  { name: "Work", href: "/showcase", icon: Briefcase },
  { name: "Contact", href: "/about#contact", icon: Mail },
];

const MobileBottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 80) setVisible(true);
      else if (y > lastY.current + 8) setVisible(false);
      else if (y < lastY.current - 8) setVisible(true);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/" && !location.hash;
    if (href.includes("#")) {
      const [path, hash] = href.split("#");
      return location.pathname === (path || "/") && location.hash === `#${hash}`;
    }
    return location.pathname === href;
  };

  const handle = (e: React.MouseEvent, href: string) => {
    if (href.includes("#")) {
      e.preventDefault();
      const [path, hash] = href.split("#");
      const target = path || "/";
      if (location.pathname === target) scrollToId(hash);
      else navigate(`${target}#${hash}`);
    }
  };

  return (
    <nav
      aria-label="Mobile navigation"
      className={cn(
        "md:hidden fixed bottom-3 left-3 right-3 z-50 transition-transform duration-300",
        visible ? "translate-y-0" : "translate-y-[150%]"
      )}
    >
      <ul className="glass rounded-2xl border border-border flex items-center justify-around py-2 px-2 shadow-lg">
        {items.map(({ name, href, icon: Icon }) => {
          const active = isActive(href);
          const content = (
            <div
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-1.5 rounded-xl transition-colors min-w-14",
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-mono uppercase tracking-wider">{name}</span>
            </div>
          );
          return (
            <li key={name}>
              {href.includes("#") ? (
                <a href={href} onClick={(e) => handle(e, href)} aria-current={active ? "page" : undefined}>
                  {content}
                </a>
              ) : (
                <Link to={href} aria-current={active ? "page" : undefined}>
                  {content}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default MobileBottomNav;