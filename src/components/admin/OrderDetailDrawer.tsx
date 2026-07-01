import { useEffect, useState } from "react";
import { Copy, ExternalLink, Mail, X, Undo2, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { paypalFee, fmtMoney } from "@/lib/revenue";

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
  const [refundAmt, setRefundAmt] = useState("");
  const [note, setNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [refunding, setRefunding] = useState(false);

  useEffect(() => {
    setRefundAmt("");
    setNote(order?.admin_note ?? "");
  }, [order?.id]);

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

  const saveNote = async () => {
    setSavingNote(true);
    const { error } = await supabase
      .from("orders")
      .update({ admin_note: note || null })
      .eq("id", order.id);
    setSavingNote(false);
    if (error) toast.error(error.message);
    else toast.success("Note saved");
  };

  const recordRefund = async (fullRefund: boolean) => {
    const value = fullRefund ? Number(order.amount) : Number(refundAmt);
    if (!value || value <= 0) {
      toast.error("Enter refund amount");
      return;
    }
    if (value > Number(order.amount)) {
      toast.error("Refund cannot exceed order amount");
      return;
    }
    if (!confirm(`Record refund of ${fmtMoney(value)}? This does NOT trigger PayPal refund. Process the refund in PayPal separately.`)) return;
    setRefunding(true);
    const { error } = await supabase
      .from("orders")
      .update({
        refunded_amount: value,
        refunded_at: new Date().toISOString(),
        status: value >= Number(order.amount) ? "REFUNDED" : "PARTIAL_REFUND",
      })
      .eq("id", order.id);
    setRefunding(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Refund recorded");
      setRefundAmt("");
    }
  };

  const fee = paypalFee(Number(order.amount));
  const refunded = Number(order.refunded_amount || 0);
  const net = +(Number(order.amount) - fee - refunded).toFixed(2);

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
              {refunded > 0 && (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-red-500/10 text-red-400 border border-red-500/20 text-[11px] font-mono uppercase">
                  Refunded
                </span>
              )}
            </div>
            <p className="font-display text-2xl font-bold">
              ${Number(order.amount).toFixed(2)}{" "}
              <span className="text-xs font-mono text-muted-foreground">{order.currency}</span>
            </p>
            <p className="font-mono text-[11px] text-muted-foreground">{fmt(order.created_at)}</p>
          </section>

          <section className="space-y-2">
            <h3 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Revenue breakdown
            </h3>
            <div className="glass-card p-3 text-xs font-mono space-y-1.5">
              <div className="flex justify-between"><span className="text-muted-foreground">Gross</span><span>{fmtMoney(Number(order.amount))}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">PayPal fee</span><span className="text-amber-400">. {fmtMoney(fee)}</span></div>
              {refunded > 0 && (
                <div className="flex justify-between"><span className="text-muted-foreground">Refund</span><span className="text-red-400">. {fmtMoney(refunded)}</span></div>
              )}
              <div className="flex justify-between border-t border-border pt-1.5 mt-1.5">
                <span className="text-muted-foreground">Net</span>
                <span className="text-emerald-400 font-bold">{fmtMoney(net)}</span>
              </div>
            </div>
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
              {order.refunded_at && (
                <TimelineRow
                  label={`Refunded ${fmtMoney(refunded)}`}
                  at={order.refunded_at}
                  ok={true}
                />
              )}
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

          <section className="space-y-2">
            <h3 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Admin note
            </h3>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Internal note about this buyer or order."
              className="w-full glass-card p-3 text-xs font-mono bg-transparent resize-none focus:outline-none focus:ring-1 focus:ring-primary/40"
            />
            <button
              onClick={saveNote}
              disabled={savingNote}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-xs font-mono hover:bg-secondary disabled:opacity-60"
            >
              <Save className="w-3 h-3" /> {savingNote ? "Saving." : "Save note"}
            </button>
          </section>

          {refunded < Number(order.amount) && (
            <section className="space-y-2">
              <h3 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                Record refund
              </h3>
              <p className="text-[11px] font-mono text-muted-foreground">
                Manual bookkeeping only. Process the actual refund in PayPal first.
              </p>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max={order.amount}
                  value={refundAmt}
                  onChange={(e) => setRefundAmt(e.target.value)}
                  placeholder="Amount"
                  className="flex-1 glass-card px-3 py-2 text-xs font-mono bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/40"
                />
                <button
                  onClick={() => recordRefund(false)}
                  disabled={refunding}
                  className="px-3 py-2 rounded-md border border-border text-xs font-mono hover:bg-secondary disabled:opacity-60"
                >
                  Partial
                </button>
                <button
                  onClick={() => recordRefund(true)}
                  disabled={refunding}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-mono hover:bg-red-500/30 disabled:opacity-60"
                >
                  <Undo2 className="w-3 h-3" /> Full
                </button>
              </div>
            </section>
          )}

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