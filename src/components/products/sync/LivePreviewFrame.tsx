import { useState } from "react";
import { Monitor, Tablet, Smartphone, ExternalLink } from "lucide-react";
import { typography } from "@/components/ui/typography";

const DEMO_URL = "https://kcklsite.myshopify.com";

type Device = "desktop" | "tablet" | "mobile";

const DEVICE_WIDTH: Record<Device, string> = {
  desktop: "100%",
  tablet: "820px",
  mobile: "390px",
};

const DEVICES: { id: Device; label: string; icon: typeof Monitor }[] = [
  { id: "desktop", label: "Desktop", icon: Monitor },
  { id: "tablet", label: "Tablet", icon: Tablet },
  { id: "mobile", label: "Mobile", icon: Smartphone },
];

/**
 * Live iframe preview of the SYNC demo store inside a MacBook chrome shell.
 * Includes a device switcher (visual width toggle) and an "Open in new tab"
 * fallback for stores that block iframe embedding.
 */
const LivePreviewFrame = () => {
  const [device, setDevice] = useState<Device>("desktop");
  const [failed, setFailed] = useState(false);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Device switcher */}
      <div
        role="tablist"
        aria-label="Preview device"
        className="flex justify-center mb-5"
      >
        <div className="inline-flex items-center gap-1 rounded-full border border-foreground/15 bg-background/60 backdrop-blur-md p-1">
          {DEVICES.map(({ id, label, icon: Icon }) => {
            const active = device === id;
            return (
              <button
                key={id}
                role="tab"
                aria-selected={active}
                onClick={() => setDevice(id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[11px] uppercase tracking-widest transition-colors ${
                  active
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            );
          })}
          <a
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[11px] uppercase tracking-widest text-primary hover:bg-foreground/5 transition-colors"
            aria-label="Open live demo in new tab"
          >
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">New tab</span>
          </a>
        </div>
      </div>

      {/* MacBook chrome + iframe */}
      <div className="laptop-showcase__device">
        <div className="laptop" data-laptop>
          <div className="laptop__lid">
            <span className="laptop__camera" aria-hidden />
            <div className="laptop__screen">
              <div className="laptop__chrome">
                <span className="laptop__chrome-dots">
                  <span className="laptop__chrome-dot laptop__chrome-dot--red" />
                  <span className="laptop__chrome-dot laptop__chrome-dot--yellow" />
                  <span className="laptop__chrome-dot laptop__chrome-dot--green" />
                </span>
                <span className="laptop__chrome-url">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  kcklsite.myshopify.com
                </span>
                <span className="laptop__chrome-spacer" />
              </div>
              <div className="laptop__display laptop__display--has-chrome">
                <div className="w-full h-full flex justify-center bg-background overflow-hidden">
                  {failed ? (
                    <div className="flex flex-col items-center justify-center gap-3 text-center px-6">
                      <p className={`${typography.body} max-w-sm`}>
                        Demo store blocked embedding. Open it in a new tab
                        for the full experience.
                      </p>
                      <a
                        href={DEMO_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2 font-mono text-xs uppercase tracking-widest"
                      >
                        Open Live Demo
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ) : (
                    <iframe
                      key={device}
                      src={DEMO_URL}
                      title="SYNC theme live preview"
                      loading="lazy"
                      sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                      onError={() => setFailed(true)}
                      style={{
                        width: DEVICE_WIDTH[device],
                        maxWidth: "100%",
                        height: "100%",
                        border: "0",
                        transition: "width 0.4s cubic-bezier(0.4,0,0.2,1)",
                      }}
                    />
                  )}
                </div>
              </div>
              <span className="laptop__reflection" aria-hidden />
            </div>
            <span className="laptop__led" aria-hidden />
          </div>
          <div className="laptop__hinge" aria-hidden />
          <div className="laptop__base" aria-hidden>
            <div className="laptop__keys" />
            <div className="laptop__trackpad" />
            <span className="laptop__notch" />
          </div>
          <span className="laptop__glow" aria-hidden />
          <span className="laptop__shadow" aria-hidden />
        </div>
      </div>
    </div>
  );
};

export default LivePreviewFrame;