import { CheckCircle2, Clock, XCircle } from "lucide-react";

type Kind = "license" | "email";

export function OrderStatusBadge({
  kind,
  order,
}: {
  kind: Kind;
  order: {
    license_key: string | null;
    license_error: string | null;
    email_sent_at: string | null;
  };
}) {
  if (kind === "license") {
    if (order.license_key) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-mono uppercase">
          <CheckCircle2 className="w-3 h-3" /> Issued
        </span>
      );
    }
    if (order.license_error) {
      return (
        <span
          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-red-500/10 text-red-400 border border-red-500/20 text-[11px] font-mono uppercase"
          title={order.license_error}
        >
          <XCircle className="w-3 h-3" /> Failed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] font-mono uppercase">
        <Clock className="w-3 h-3" /> Pending
      </span>
    );
  }

  if (order.email_sent_at) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-mono uppercase">
        <CheckCircle2 className="w-3 h-3" /> Sent
      </span>
    );
  }
  if (order.license_key) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] font-mono uppercase">
        <Clock className="w-3 h-3" /> Not sent
      </span>
    );
  }
  return <span className="text-[11px] font-mono text-muted-foreground">.</span>;
}

export function maskKey(key: string | null | undefined) {
  if (!key) return ".";
  if (key.length <= 8) return key;
  return `${key.slice(0, 4)}…${key.slice(-4)}`;
}