import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import type { ReactorFeature } from "./features";

interface Props {
  feature: ReactorFeature | null;
  isMobile: boolean;
  onClose: () => void;
}

const Body = ({ feature }: { feature: ReactorFeature }) => {
  const { Icon } = feature;
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/40 bg-primary/10">
          <Icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            {feature.label}
          </p>
          <h3 className="font-syne text-xl font-bold uppercase tracking-tight">
            {feature.title}
          </h3>
        </div>
      </div>
      <p className="font-mono text-sm leading-relaxed text-muted-foreground">
        {feature.copy}
      </p>
      <div className="flex items-center justify-between border-t border-white/10 pt-3">
        <span className="font-mono text-[11px] uppercase tracking-widest text-primary">
          {feature.metric}
        </span>
        <a
          href="#pricing"
          className="font-mono text-[11px] uppercase tracking-widest text-foreground underline-offset-4 hover:underline"
        >
          Learn more →
        </a>
      </div>
    </div>
  );
};

const FeatureCard = ({ feature, isMobile, onClose }: Props) => {
  if (isMobile) {
    return (
      <Sheet open={!!feature} onOpenChange={(o) => !o && onClose()}>
        <SheetContent side="bottom" className="rounded-t-2xl border-white/10 bg-background/95 backdrop-blur-xl">
          {feature && (
            <>
              <SheetHeader className="sr-only">
                <SheetTitle>{feature.title}</SheetTitle>
                <SheetDescription>{feature.copy}</SheetDescription>
              </SheetHeader>
              <Body feature={feature} />
            </>
          )}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <AnimatePresence>
      {feature && (
        <motion.div
          key={feature.key}
          initial={{ opacity: 0, y: 12, scale: 0.96, rotateX: -8 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-auto absolute left-1/2 top-full z-30 mt-6 w-[320px] -translate-x-1/2 rounded-2xl border border-white/10 bg-background/85 p-5 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.6)] backdrop-blur-xl"
          style={{ transformStyle: "preserve-3d" }}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute right-3 top-3 rounded-full p-1 text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          <Body feature={feature} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FeatureCard;