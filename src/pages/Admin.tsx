import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, Eye, EyeOff, LogOut, Search, Copy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, useIsAdmin } from "@/hooks/useAuth";
import { useProducts } from "@/hooks/useProducts";
import { toast } from "sonner";
import { AdminKpis } from "@/components/admin/AdminKpis";
import {
  OrderDetailDrawer,
  type AdminOrder,
} from "@/components/admin/OrderDetailDrawer";
import { OrderStatusBadge, maskKey } from "@/components/admin/OrderStatusBadge";

type Filter = "all" | "issued" | "failed" | "pending";

const Admin = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const isAdmin = useIsAdmin(user?.id);
  const { products, loading } = useProducts({ includeUnpublished: true });
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [selected, setSelected] = useState<AdminOrder | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    if (authLoading) return;
    if (!user) navigate("/admin/login", { replace: true });
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200)
      .then(({ data }) => setOrders((data ?? []) as AdminOrder[]));

    const ch = supabase
      .channel("admin-orders")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          const row = payload.new as AdminOrder;
          setOrders((prev) => [row, ...prev.filter((o) => o.id !== row.id)]);
          if (row.license_error && !row.license_key) {
            toast.error(`License failed for ${row.buyer_email ?? "unknown"}`);
          } else if (row.license_key) {
            toast.success(`New order paid, license issued for ${row.buyer_email ?? "buyer"}`);
          } else {
            toast(`New order captured. $${Number(row.amount).toFixed(2)}`);
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders" },
        (payload) => {
          const row = payload.new as AdminOrder;
          setOrders((prev) => prev.map((o) => (o.id === row.id ? row : o)));
          setSelected((cur) => (cur && cur.id === row.id ? row : cur));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ch);
    };
  }, [isAdmin]);

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      if (filter === "issued" && !o.license_key) return false;
      if (filter === "failed" && (!o.license_error || o.license_key)) return false;
      if (filter === "pending" && (o.license_key || o.license_error)) return false;
      if (!q) return true;
      return (
        o.buyer_email?.toLowerCase().includes(q) ||
        o.buyer_name?.toLowerCase().includes(q) ||
        o.paypal_order_id?.toLowerCase().includes(q) ||
        o.license_key?.toLowerCase().includes(q) ||
        o.product_title?.toLowerCase().includes(q)
      );
    });
  }, [orders, search, filter]);

  if (authLoading || isAdmin === null) {
    return <div className="min-h-dvh bg-background flex items-center justify-center font-mono text-sm">Loading…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-dvh bg-background flex items-center justify-center p-6 text-center">
        <div className="glass-card p-8 max-w-md">
          <h1 className="font-display text-2xl font-bold mb-3">Access denied</h1>
          <p className="text-sm text-muted-foreground font-mono mb-4">
            Your account doesn't have admin privileges.
          </p>
          <button
            onClick={async () => { await supabase.auth.signOut(); navigate("/admin/login"); }}
            className="px-5 py-2 rounded-lg bg-primary text-primary-foreground font-mono text-sm"
          >Sign out</button>
        </div>
      </div>
    );
  }

  const togglePublish = async (id: string, val: boolean) => {
    const { error } = await supabase.from("products").update({ is_published: !val }).eq("id", id);
    if (error) toast.error(error.message);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast.error(error.message); else toast.success("Deleted");
  };

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "issued", label: "Issued" },
    { key: "pending", label: "Pending" },
    { key: "failed", label: "Failed" },
  ];

  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="font-display text-xl font-bold uppercase tracking-wider">Admin, Products</h1>
          <div className="flex items-center gap-3">
            <Link to="/admin/products/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-mono text-sm">
              <Plus className="w-4 h-4" /> New product
            </Link>
            <button
              onClick={async () => { await supabase.auth.signOut(); navigate("/admin/login"); }}
              className="p-2 rounded-lg hover:bg-secondary" aria-label="Sign out">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-12">
        <section>
          <h2 className="font-display text-sm uppercase tracking-wider text-muted-foreground mb-3">Overview</h2>
          <AdminKpis orders={orders} />
        </section>

        <section>
          <h2 className="font-display text-sm uppercase tracking-wider text-muted-foreground mb-3">Catalog</h2>
          {loading ? (
            <p className="font-mono text-sm">Loading…</p>
          ) : (
            <div className="glass-card divide-y divide-border">
              {products.length === 0 && (
                <p className="p-6 text-sm font-mono text-muted-foreground">No products yet.</p>
              )}
              {products.map((p) => (
                <div key={p.id} className="flex items-center gap-4 p-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-bold truncate">{p.title}</p>
                    <p className="text-xs font-mono text-muted-foreground truncate">/{p.slug}, ${p.price}</p>
                  </div>
                  <button onClick={() => togglePublish(p.id, p.is_published)}
                    className="p-2 rounded-lg hover:bg-secondary"
                    title={p.is_published ? "Published" : "Hidden"}>
                    {p.is_published ? <Eye className="w-4 h-4 text-primary" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
                  </button>
                  <Link to={`/admin/products/${p.id}`} className="p-2 rounded-lg hover:bg-secondary">
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button onClick={() => remove(p.id)} className="p-2 rounded-lg hover:bg-secondary">
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <h2 className="font-display text-sm uppercase tracking-wider text-muted-foreground">
              Orders ({filteredOrders.length})
            </h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search email, license, PayPal ID."
                  className="pl-8 pr-3 py-1.5 rounded-md bg-secondary/50 border border-border text-xs font-mono w-64 focus:outline-none focus:border-primary/60"
                />
              </div>
              <div className="flex rounded-md border border-border overflow-hidden">
                {filters.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    className={`px-3 py-1.5 text-[11px] font-mono uppercase transition-colors ${
                      filter === f.key
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-secondary"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-card overflow-x-auto">
            {filteredOrders.length === 0 ? (
              <p className="p-6 text-sm font-mono text-muted-foreground">No orders match.</p>
            ) : (
              <table className="w-full text-sm font-mono min-w-[720px]">
                <thead className="text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border">
                  <tr>
                    <th className="text-left px-4 py-3">Date</th>
                    <th className="text-left px-4 py-3">Buyer</th>
                    <th className="text-left px-4 py-3">Product</th>
                    <th className="text-left px-4 py-3">Amount</th>
                    <th className="text-left px-4 py-3">License</th>
                    <th className="text-left px-4 py-3">Email</th>
                    <th className="text-left px-4 py-3">Key</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredOrders.map((o) => (
                    <tr
                      key={o.id}
                      onClick={() => setSelected(o)}
                      className="cursor-pointer hover:bg-secondary/40 transition-colors"
                    >
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(o.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 max-w-[180px] truncate">
                        {o.buyer_email ?? "."}
                      </td>
                      <td className="px-4 py-3 max-w-[160px] truncate">{o.product_title}</td>
                      <td className="px-4 py-3 text-primary whitespace-nowrap">
                        ${Number(o.amount).toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <OrderStatusBadge kind="license" order={o} />
                      </td>
                      <td className="px-4 py-3">
                        <OrderStatusBadge kind="email" order={o} />
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (o.license_key) {
                              navigator.clipboard.writeText(o.license_key);
                              toast.success("License copied");
                            }
                          }}
                          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                          disabled={!o.license_key}
                        >
                          {maskKey(o.license_key)}
                          {o.license_key && <Copy className="w-3 h-3" />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>

      <OrderDetailDrawer order={selected} onClose={() => setSelected(null)} />
    </div>
  );
};

export default Admin;