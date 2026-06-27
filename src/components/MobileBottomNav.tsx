import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Tag, Briefcase, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import { scrollToId } from "@/lib/scroll";
import { useMusicPlayer } from "@/contexts/MusicContext";

const items = [
  { name: "Home", href: "/", icon: Home },
  { name: "Themes", href: "/products", icon: Tag },
];

const MobileBottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);
  const { isPlaying, togglePlay } = useMusicPlayer();

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
    return location.pathname === href && !location.hash;
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
        "md:hidden fixed bottom-3 left-1/2 -translate-x-1/2 z-50 transition-transform duration-300",
        visible ? "translate-y-0" : "translate-y-[150%]"
      )}
    >
      <ul className="navbar-pill menu-rotating-glow flex items-center gap-1 py-1.5 px-2 shadow-lg">
        {items.map(({ name, href, icon: Icon }) => {
          const active = isActive(href);
          const content = (
            <div
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 px-2.5 py-1 rounded-full transition-colors",
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[9px] font-mono uppercase tracking-wider">{name}</span>
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
        <li>
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause music" : "Play music"}
            aria-pressed={isPlaying}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 px-2.5 py-1 rounded-full transition-colors",
              isPlaying ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span className="text-[9px] font-mono uppercase tracking-wider">
              {isPlaying ? "Pause" : "Music"}
            </span>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default MobileBottomNav;