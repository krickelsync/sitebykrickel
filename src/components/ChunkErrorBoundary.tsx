import { Component, type ReactNode } from "react";

/**
 * Catches dynamic-import / chunk-load failures (common on iOS Safari first
 * visit when a lazy chunk races with the network) and auto-reloads ONCE so
 * the user doesn't see a blank screen. Subsequent loads hit the SW/HTTP cache.
 */
interface State { hasError: boolean }

class ChunkErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    const msg = (error as Error)?.message || "";
    const name = (error as Error)?.name || "";
    const isChunkErr =
      /Loading chunk|Loading CSS chunk|dynamically imported module|Importing a module script failed|Failed to fetch dynamically imported module|error loading dynamically imported module/i.test(
        msg
      ) || name === "ChunkLoadError";

    if (isChunkErr && typeof window !== "undefined") {
      const key = "__chunk_reload_attempt";
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, "1");
        window.location.reload();
        return;
      }
    }
    // eslint-disable-next-line no-console
    console.error(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[100svh] flex flex-col items-center justify-center gap-4 p-6 text-center">
          <p className="font-mono text-sm text-muted-foreground">
            Something went wrong loading the page.
          </p>
          <button
            onClick={() => {
              sessionStorage.removeItem("__chunk_reload_attempt");
              window.location.reload();
            }}
            className="px-4 py-2 rounded-full bg-foreground text-background font-mono text-xs uppercase tracking-wider"
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ChunkErrorBoundary;