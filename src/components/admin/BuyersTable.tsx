import { useMemo } from "react";
import { fmtMoney } from "@/lib/revenue";
import type { AdminOrder } from "./OrderDetailDrawer";

type Buyer = {
  email: string;
  name: string | null;
  orders: number;
  spent: number;
  refunded: number;
  lastAt: string;
  lastOrder: AdminOrder;
};

export function BuyersTable({
  orders,
  onSelect,
}: {
  orders: AdminOrder[];
  onSelect: (order: AdminOrder) => void;
}) {
  const buyers = useMemo<Buyer[]>(() => {
    const map = new Map<string, Buyer>();
    for (const o of orders) {
      const email = o.buyer_email ?? "(no email)";
      const cur = map.get(email);
      if (!cur) {
        map.set(email, {
          email,
          name: o.buyer_name,
          orders: 1,
          spent: Number(o.amount || 0),
          refunded: Number(o.refunded_amount || 0),
          lastAt: o.created_at,
          lastOrder: o,
        });
      } else {
        cur.orders += 1;
        cur.spent += Number(o.amount || 0);
        cur.refunded += Number(o.refunded_amount || 0);
        if (new Date(o.created_at) > new Date(cur.lastAt)) {
          cur.lastAt = o.created_at;
          cur.lastOrder = o;
          cur.name = o.buyer_name ?? cur.name;
        }
      }
    }
    return Array.from(map.values()).sort((a, b) => b.spent - a.spent);
  }, [orders]);

  if (buyers.length === 0) {
    return (
      <div className="glass-card p-6">
        <p className="text-sm font-mono text-muted-foreground">No buyers yet.</p>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-x-auto">
      <table className="w-full text-sm font-mono min-w-[560px]">
        <thead className="text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border">
          <tr>
            <th className="text-left px-4 py-3">Buyer</th>
            <th className="text-left px-4 py-3">Orders</th>
            <th className="text-left px-4 py-3">LTV</th>
            <th className="text-left px-4 py-3">Refunded</th>
            <th className="text-left px-4 py-3">Last order</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {buyers.map((b) => (
            <tr
              key={b.email}
              onClick={() => onSelect(b.lastOrder)}
              className="cursor-pointer hover:bg-secondary/40 transition-colors"
            >
              <td className="px-4 py-3 max-w-[240px]">
                <p className="truncate">{b.email}</p>
                {b.name && (
                  <p className="text-[11px] text-muted-foreground truncate">{b.name}</p>
                )}
              </td>
              <td className="px-4 py-3">{b.orders}</td>
              <td className="px-4 py-3 text-primary">{fmtMoney(b.spent)}</td>
              <td className="px-4 py-3 text-red-400">
                {b.refunded > 0 ? fmtMoney(b.refunded) : "."}
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                {new Date(b.lastAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}