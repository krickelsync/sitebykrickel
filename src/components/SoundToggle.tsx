import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { isSoundEnabled, setSoundEnabled } from "@/lib/sound";

const SoundToggle = () => {
  const [on, setOn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setOn(isSoundEnabled());
    const handler = (e: Event) => setOn((e as CustomEvent<boolean>).detail);
    window.addEventListener("sbk-sound-change", handler);
    return () => window.removeEventListener("sbk-sound-change", handler);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => {
        const next = !on;
        setSoundEnabled(next);
        setOn(next);
      }}
      aria-label={on ? "Mute UI sounds" : "Unmute UI sounds"}
      aria-pressed={on}
      className="fixed bottom-24 md:bottom-6 right-4 z-40 p-2.5 rounded-full border border-border bg-card/80 backdrop-blur text-muted-foreground hover:text-primary transition-colors shadow-sm"
    >
      {on ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
    </button>
  );
};

export default SoundToggle;