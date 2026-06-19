import { useNavigate, useLocation } from "react-router-dom";
import { scrollToId } from "@/lib/scroll";

/**
 * Returns a click handler that scrolls to the `#contact` section,
 * navigating to `/about` first if we're not already there.
 */
export const useContactScroll = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (location.pathname === "/about") {
      scrollToId("contact");
    } else {
      navigate("/about");
      // Wait for the route to mount before scrolling.
      setTimeout(() => scrollToId("contact"), 100);
    }
  };
};