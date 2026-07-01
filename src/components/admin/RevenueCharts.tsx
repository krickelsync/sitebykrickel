import { useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { paypalFee } from "@/lib/revenue";

type Order = {
  amount: number;
  refunded_amount: number | null;
  product_title: string;
  created_at: string;
};

const chartStyle = {
  fontFamily: "var(--font-mono, ui-monospace)",
  fontSize: 10,
};

export function RevenueCharts({ orders }: { orders: Order[] }) {
  const daily = useMemo(() => {
    const days = 30;
    const buckets = new Map<string, number>();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      buckets.set(d.toISOString().slice(0, 10), 0);
    }
    for (const o of orders) {
      const day = o.created_at.slice(0, 10);
      if (!buckets.has(day)) continue;
      const amt = Number(o.amount || 0);
      const net = amt - paypalFee(amt) - Number(o.refunded_amount || 0);
      buckets.set(day, (buckets.get(day) ?? 0) + net);
    }
    return Array.from(buckets.entries()).map(([day, net]) => ({
      day: day.slice(5),
      net: +net.toFixed(2),
    }));
  }, [orders]);

  const topThemes = useMemo(() => {
    const map = new Map<string, number>();
    for (const o of orders) {
      const amt = Number(o.amount || 0);
      const net = amt - paypalFee(amt) - Number(o.refunded_amount || 0);
      map.set(o.product_title, (map.get(o.product_title) ?? 0) + net);
    }
    return Array.from(map.entries())
      .map(([name, net]) => ({ name: name.length > 22 ? name.slice(0, 22) + "…" : name, net: +net.toFixed(2) }))
      .sort((a, b) => b.net - a.net)
      .slice(0, 5);
  }, [orders]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
      <div className="glass-card p-4 lg:col-span-2">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            Net revenue . last 30 days
          </p>
          <p className="text-[10px] font-mono text-muted-foreground">
            ${daily.reduce((s, d) => s + d.net, 0).toFixed(2)} total
          </p>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={daily} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="2 4" vertical={false} />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" style={chartStyle} tickLine={false} axisLine={false} interval={4} />
              <YAxis stroke="hsl(var(--muted-foreground))" style={chartStyle} tickLine={false} axisLine={false} width={48} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  fontFamily: "var(--font-mono, ui-monospace)",
                  fontSize: 11,
                }}
                formatter={(v: number) => [`$${v.toFixed(2)}`, "Net"]}
              />
              <Line
                type="monotone"
                dataKey="net"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card p-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
          Top themes by net
        </p>
        <div className="h-48">
          {topThemes.length === 0 ? (
            <p className="font-mono text-xs text-muted-foreground">No data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topThemes} layout="vertical" margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" style={chartStyle} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" style={chartStyle} width={100} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: "hsl(var(--secondary) / 0.4)" }}
                  contentStyle={{
                    background: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontFamily: "var(--font-mono, ui-monospace)",
                    fontSize: 11,
                  }}
                  formatter={(v: number) => [`$${v.toFixed(2)}`, "Net"]}
                />
                <Bar dataKey="net" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}