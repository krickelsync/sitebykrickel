import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, Eye, EyeOff, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, useIsAdmin } from "@/hooks/useAuth";
import { useProducts } from "@/hooks/useProducts";
import { toast } from "sonner";

const Admin = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const isAdmin = useIsAdmin(user?.id);
  const { products, loading } = useProducts({ includeUnpublished: true });
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) navigate("/admin/login", { replace: true });
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(20)
        .then(({ data }) => setOrders(data ?? []));
    }
  }, [isAdmin]);

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
          <h2 className="font-display text-sm uppercase tracking-wider text-muted-foreground mb-3">Recent orders</h2>
          <div className="glass-card divide-y divide-border">
            {orders.length === 0 && (
              <p className="p-6 text-sm font-mono text-muted-foreground">No orders yet.</p>
            )}
            {orders.map((o) => (
              <div key={o.id} className="p-4 flex justify-between text-sm font-mono">
                <span className="truncate">{o.product_title}</span>
                <span className="text-muted-foreground">{o.buyer_email ?? "."}</span>
                <span className="text-primary">${o.amount}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Admin;