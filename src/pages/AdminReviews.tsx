import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Trash2, EyeOff, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, useIsAdmin } from "@/hooks/useAuth";
import { toast } from "sonner";
import { getFriendlyError } from "@/lib/errors";

type Review = {
  id: string;
  product_slug: string;
  author_name: string;
  rating: number;
  title: string | null;
  content: string;
  approved: boolean;
  created_at: string;
};

type Filter = "pending" | "approved" | "all";

const AdminReviews = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const isAdmin = useIsAdmin(user?.id);
  const [rows, setRows] = useState<Review[]>([]);
  const [filter, setFilter] = useState<Filter>("pending");

  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/admin/login", { replace: true });
  }, [user, loading, navigate]);

  const load = async () => {
    const { data, error } = await supabase
      .from("product_reviews")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(getFriendlyError(error));
    setRows((data ?? []) as Review[]);
  };

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin]);

  if (loading || isAdmin === null)
    return (
      <div className="min-h-dvh bg-background flex items-center justify-center font-mono text-sm">
        Loading…
      </div>
    );
  if (!isAdmin) return null;

  const setApproval = async (id: string, approved: boolean) => {
    const { error } = await supabase
      .from("product_reviews")
      .update({ approved })
      .eq("id", id);
    if (error) return toast.error(getFriendlyError(error));
    toast.success(approved ? "Review approved" : "Review hidden");
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this review permanently?")) return;
    const { error } = await supabase.from("product_reviews").delete().eq("id", id);
    if (error) return toast.error(getFriendlyError(error));
    toast.success("Deleted");
    load();
  };

  const filtered = rows.filter((r) =>
    filter === "all" ? true : filter === "approved" ? r.approved : !r.approved,
  );
  const pendingCount = rows.filter((r) => !r.approved).length;

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 font-mono text-sm hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <h1 className="font-syne font-bold uppercase tracking-tight text-lg md:text-2xl">
            Reviews
          </h1>
          <div className="w-16" />
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-8 py-6 md:py-10 max-w-4xl">
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {(["pending", "approved", "all"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full font-mono text-xs uppercase tracking-widest border transition-colors ${
                filter === f
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border hover:bg-secondary"
              }`}
            >
              {f}
              {f === "pending" && pendingCount > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-gold text-background text-[10px]">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="font-mono text-sm text-muted-foreground text-center py-16">
            Nothing here.
          </p>
        ) : (
          <div className="space-y-3">
            {filtered.map((r) => (
              <article
                key={r.id}
                className="rounded-xl border border-border p-4 md:p-5 bg-card"
              >
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-syne font-bold">{r.author_name}</span>
                      <span className="font-mono text-[10px] uppercase text-muted-foreground">
                        {r.product_slug}
                      </span>
                      <span
                        className={`font-mono text-[10px] uppercase px-2 py-0.5 rounded-full ${
                          r.approved
                            ? "bg-primary/20 text-primary"
                            : "bg-gold/20 text-gold"
                        }`}
                      >
                        {r.approved ? "Live" : "Pending"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          size={12}
                          className={
                            n <= r.rating
                              ? "fill-gold text-gold"
                              : "fill-transparent text-muted-foreground/40"
                          }
                        />
                      ))}
                      <span className="ml-2 font-mono text-[10px] text-muted-foreground">
                        {new Date(r.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {r.approved ? (
                      <button
                        onClick={() => setApproval(r.id, false)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border font-mono text-xs hover:bg-secondary"
                      >
                        <EyeOff className="w-3.5 h-3.5" /> Hide
                      </button>
                    ) : (
                      <button
                        onClick={() => setApproval(r.id, true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-mono text-xs hover:opacity-90"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve
                      </button>
                    )}
                    <button
                      onClick={() => remove(r.id)}
                      className="p-2 rounded-lg border border-border hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                {r.title && (
                  <h3 className="font-syne font-bold mt-3">{r.title}</h3>
                )}
                <p className="mt-1.5 text-sm text-foreground/80 whitespace-pre-wrap">
                  {r.content}
                </p>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminReviews;