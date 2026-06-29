import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Typography system — load once, use across the app via tailwind font tokens.
import "@fontsource/syne/600.css";
import "@fontsource/syne/700.css";
import "@fontsource/syne/800.css";
import "@fontsource/plus-jakarta-sans/400.css";
import "@fontsource/plus-jakarta-sans/500.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";

// Global guard: auto-reload once on dynamic chunk load failures across all
// browsers (iOS Safari, Android Chrome, desktop) so users never see blank.
if (typeof window !== "undefined") {
  const isChunkErr = (msg: string) =>
    /Loading chunk|Loading CSS chunk|dynamically imported module|Importing a module script failed|Failed to fetch dynamically imported module|error loading dynamically imported module/i.test(
      msg
    );
  const tryReload = () => {
    const key = "__chunk_reload_attempt";
    try {
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, "1");
        window.location.reload();
      }
    } catch {
      window.location.reload();
    }
  };
  window.addEventListener("error", (e) => {
    if (isChunkErr(e?.message || "")) tryReload();
  });
  window.addEventListener("unhandledrejection", (e) => {
    const reason: any = e?.reason;
    const msg = (reason && (reason.message || String(reason))) || "";
    if (isChunkErr(msg)) tryReload();
  });
  // Clear the reload flag once the app has hydrated successfully.
  window.addEventListener("load", () => {
    setTimeout(() => {
      try { sessionStorage.removeItem("__chunk_reload_attempt"); } catch {}
    }, 2000);
  });
}

createRoot(document.getElementById("root")!).render(<App />);
