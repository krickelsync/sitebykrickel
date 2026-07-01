import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface State {
  error: Error | null;
}

/**
 * Generic runtime error boundary. Renders a friendly fallback so a single
 * broken component never crashes the whole page. Chunk-load errors are still
 * handled by ChunkErrorBoundary (they auto-reload once).
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error("[ErrorBoundary]", error, info.componentStack);
    this.props.onError?.(error, info);
  }

  private reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    if (this.props.fallback) return this.props.fallback(error, this.reset);

    return (
      <div
        role="alert"
        className="min-h-[60svh] flex flex-col items-center justify-center gap-4 p-6 text-center"
      >
        <p className="font-syne uppercase tracking-tighter text-2xl">Something broke</p>
        <p className="font-mono text-xs text-muted-foreground max-w-md">
          A small part of the page crashed. You can retry, or reload the page if it keeps happening.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={this.reset}
            className="px-4 py-2 rounded-full bg-foreground text-background font-mono text-xs uppercase tracking-wider"
          >
            Retry
          </button>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-full border border-foreground/20 font-mono text-xs uppercase tracking-wider hover:bg-foreground/5"
          >
            Reload page
          </button>
        </div>
      </div>
    );
  }
}