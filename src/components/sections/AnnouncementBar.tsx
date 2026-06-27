import { Sparkles } from "lucide-react";

const AnnouncementBar = () => (
  <div className="w-full border-b border-border bg-background/80 backdrop-blur-sm">
    <div className="container px-4 py-2 flex items-center justify-center gap-2 text-center">
      <Sparkles className="w-3 h-3 text-primary shrink-0" aria-hidden />
      <p className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground">
        New Theme Release <span className="text-primary mx-1">•</span> Early Access Offer Available
      </p>
    </div>
  </div>
);

export default AnnouncementBar;