import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-4 font-display text-6xl md:text-8xl font-bold text-primary glow-text">404</h1>
        <p className="mb-8 font-mono text-lg text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="inline-block px-8 py-4 font-mono text-sm uppercase tracking-wider bg-primary text-primary-foreground hover:glow-box transition-all duration-300">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
