import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, useIsAdmin } from "@/hooks/useAuth";
import { toast } from "sonner";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = useIsAdmin(user?.id);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Only auto-redirect admins. Non-admins stay here so they can sign out
    // and try a different account instead of bouncing in a loop.
    if (user && isAdmin) navigate("/admin", { replace: true });
  }, [user, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) toast.error(error.message);
    else navigate("/admin");
  };

  return (
    <div className="min-h-dvh bg-background flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="glass-card p-8 w-full max-w-md space-y-5">
        <div>
          <h1 className="font-display text-2xl font-bold">Admin sign in</h1>
          <p className="text-sm text-muted-foreground font-mono mt-1">
            Restricted area. Admins only.
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border focus:border-primary outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border focus:border-primary outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-display font-bold uppercase tracking-wider disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;