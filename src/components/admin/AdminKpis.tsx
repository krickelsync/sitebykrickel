import { useMemo } from "react";
import { computeRevenue, fmtMoney } from "@/lib/revenue";

type Order = {
  amount: number;
  currency: string;
  refunded_amount?: number | null;
  processing_fee?: number | null;
  subtotal?: number | null;
  status: string;
  license_key: string | null;
  license_error: string | null;
  email_sent_at: string | null;
  created_at: string;
};

function pct(n: number, d: number) {
  if (!d) return "0%";
  return `${Math.round((n / d) * 100)}%`;
}

export function AdminKpis({ orders }: { orders: Order[] }) {
  const kpis = useMemo(() => {
    const total = orders.length;
    const rev = computeRevenue(orders);
    const issued = orders.filter((o) => !!o.license_key).length;
    const failed = orders.filter((o) => !!o.license_error && !o.license_key).length;
    const emailed = orders.filter((o) => !!o.email_sent_at).length;
    const since = Date.now() - 24 * 60 * 60 * 1000;
    const last24 = orders.filter((o) => new Date(o.created_at).getTime() > since).length;
    const refundCount = orders.filter((o) => Number(o.refunded_amount || 0) > 0).length;
    return { total, ...rev, issued, failed, emailed, last24, refundCount };
  }, [orders]);

  const money = [
    { label: "Gross revenue", value: fmtMoney(kpis.gross), sub: `${kpis.total} orders`, tone: "text-foreground" },
    { label: "PayPal fees", value: `. ${fmtMoney(kpis.fees)}`, sub: kpis.buyerPaidFees > 0 ? "paid by buyer" : "4.4% + $0.30", tone: "text-amber-400" },
    { label: "Refunds", value: `. ${fmtMoney(kpis.refunds)}`, sub: `${kpis.refundCount} refunded`, tone: "text-red-400" },
    { label: "Net revenue", value: fmtMoney(kpis.net), sub: "after fees & refunds", tone: "text-emerald-400" },
  ];

  const ops = [
    { label: "Orders 24h", value: kpis.last24, sub: `${kpis.total} lifetime` },
    { label: "License issued", value: pct(kpis.issued, kpis.total), sub: `${kpis.issued}/${kpis.total}` },
    { label: "Email delivered", value: pct(kpis.emailed, kpis.issued), sub: `${kpis.emailed}/${kpis.issued}` },
    { label: "Failures", value: kpis.failed, sub: kpis.failed ? "needs attention" : "all good" },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {money.map((c) => (
          <div key={c.label} className="glass-card p-4">
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              {c.label}
            </p>
            <p className={`font-display text-2xl font-bold mt-1 ${c.tone}`}>{c.value}</p>
            <p className="text-[11px] font-mono text-muted-foreground mt-1 truncate">{c.sub}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {ops.map((c) => (
          <div key={c.label} className="glass-card p-4">
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              {c.label}
            </p>
            <p className="font-display text-2xl font-bold mt-1">{c.value}</p>
            <p className="text-[11px] font-mono text-muted-foreground mt-1 truncate">{c.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}