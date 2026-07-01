import { cn } from "@/lib/utils";

type Status =
  | "pending"
  | "processing"
  | "completed"
  | "paid"
  | "refunded"
  | "failed"
  | "cancelled"
  | string;

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const STYLES: Record<string, string> = {
  completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  paid: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  processing: "bg-sky-500/10 text-sky-400 border-sky-500/30",
  refunded: "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30",
  failed: "bg-red-500/10 text-red-400 border-red-500/30",
  cancelled: "bg-white/5 text-white/60 border-white/10",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const key = (status || "").toLowerCase();
  const style = STYLES[key] ?? "bg-white/5 text-white/70 border-white/10";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-[0.14em]",
        style,
        className
      )}
    >
      {status || "unknown"}
    </span>
  );
}