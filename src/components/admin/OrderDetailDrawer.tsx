import { useState } from "react";
import { Copy, ExternalLink, Mail, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { OrderStatusBadge } from "./OrderStatusBadge";

export type AdminOrder = {
  id: string;
  created_at: string;
  product_title: string;
  buyer_email: string | null;
  buyer_name: string | null;
  amount: number;
  currency: string;
  status: string;
  paypal_order_id: string | null;
  theme_slug: string | null;
  license_key: string | null;
  download_url: string | null;
  license_issued_at: string | null;
  license_error: string | null;
  email_sent_at: string | null;
  refunded_amount: number | null;
  refunded_at: string | null;
  admin_note: string | null;
};

function fmt(dt: string | null) {
  if (!dt) return null;
  return new Date(dt).toLocaleString();
}

function TimelineRow({
  label,
  at,
  ok,
  error,
}: {
  label: string;
  at: string | null;
  ok: boolean;
  error?: string | null;
}) {
  const dotColor = ok ? "bg-emerald-400" : error ? "bg-red-400" : "bg-muted-foreground/50";
  return (
    <div className="flex gap-3 items-start">
      <div className={`w-2.5 h-2.5 mt-1.5 rounded-full ${dotColor}`} />
      <div className="flex-1">
        <p className="font-mono text-xs uppercase tracking-wider text-foreground">{label}</p>
        <p className="font-mono text-[11px] text-muted-foreground">
          {at ? fmt(at) : ok ? "done" : error ? error : "pending"}
        </p>
      </div>
    </div>
  );
}

export function OrderDetailDrawer({
  order,
  onClose,
}: {
  order: AdminOrder | null;
  onClose: () => void;
}) {
  const [resending, setResending] = useState(false);

  if (!order) return null;

  const copy = (v: string | null | undefined, label: string) => {
    if (!v) return;
    navigator.clipboard.writeText(v).then(() => toast.success(`${label} copied`));
  };

  const resend = async () => {
    if (!order.paypal_order_id) return;
    setResending(true);
    try {
      const { error } = await supabase.functions.invoke("resend-receipt", {
        body: { paypal_order_id: order.paypal_order_id },
      });
      if (error) throw error;
      toast.success("Receipt email resent");
    } catch (e: any) {
      toast.error(e?.message ?? "Resend failed");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex" role="dialog" aria-modal="true">
      <button
        aria-label="Close"
        onClick={onClose}
        className="flex-1 bg-black/60 backdrop-blur-sm"
      />
      <aside className="w-full max-w-md bg-background border-l border-border overflow-y-auto">
        <header className="sticky top-0 bg-background/95 backdrop-blur border-b border-border p-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Order
            </p>
            <p className="font-display text-sm font-bold truncate">{order.product_title}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-secondary">
            <X className="w-4 h-4" />
          </button>
        </header>

        <div className="p-4 space-y-6">
          <section className="space-y-2">
            <div className="flex items-center gap-2">
              <OrderStatusBadge kind="license" order={order} />
              <OrderStatusBadge kind="email" order={order} />
            </div>
            <p className="font-display text-2xl font-bold">
              ${Number(order.amount).toFixed(2)}{" "}
              <span className="text-xs font-mono text-muted-foreground">{order.currency}</span>
            </p>
            <p className="font-mono text-[11px] text-muted-foreground">{fmt(order.created_at)}</p>
          </section>

          <section className="space-y-2">
            <h3 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Buyer
            </h3>
            <div className="glass-card p-3 space-y-1 text-sm font-mono">
              <p>{order.buyer_name ?? "."}</p>
              <p className="text-muted-foreground">{order.buyer_email ?? "."}</p>
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Timeline
            </h3>
            <div className="glass-card p-4 space-y-4">
              <TimelineRow label="PayPal captured" at={order.created_at} ok={order.status === "COMPLETED"} />
              <TimelineRow
                label="License issued"
                at={order.license_issued_at}
                ok={!!order.license_key}
                error={order.license_error}
              />
              <TimelineRow
                label="Email delivered"
                at={order.email_sent_at}
                ok={!!order.email_sent_at}
              />
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              License
            </h3>
            <div className="glass-card p-3 space-y-2">
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs font-mono break-all">
                  {order.license_key ?? "."}
                </code>
                {order.license_key && (
                  <button
                    onClick={() => copy(order.license_key, "License")}
                    className="p-1.5 rounded hover:bg-secondary"
                    aria-label="Copy license"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              {order.download_url && (
                <a
                  href={order.download_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-primary hover:underline"
                >
                  Download ZIP <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {order.license_error && !order.license_key && (
                <p className="text-[11px] font-mono text-red-400">{order.license_error}</p>
              )}
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              PayPal
            </h3>
            <div className="glass-card p-3 flex items-center gap-2">
              <code className="flex-1 text-xs font-mono break-all">
                {order.paypal_order_id ?? "."}
              </code>
              {order.paypal_order_id && (
                <button
                  onClick={() => copy(order.paypal_order_id, "PayPal ID")}
                  className="p-1.5 rounded hover:bg-secondary"
                  aria-label="Copy PayPal ID"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </section>

          {order.license_key && order.buyer_email && (
            <button
              onClick={resend}
              disabled={resending}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-mono text-sm disabled:opacity-60"
            >
              <Mail className="w-4 h-4" /> {resending ? "Sending." : "Resend receipt email"}
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}