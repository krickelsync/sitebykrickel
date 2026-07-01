import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth, useIsAdmin } from "@/hooks/useAuth";
import { toast } from "sonner";
import { getFriendlyError } from "@/lib/errors";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = useIsAdmin(user?.id);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && isAdmin) navigate("/admin", { replace: true });
  }, [user, isAdmin, navigate]);

  const handleGoogle = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/admin/login",
    });
    if (result.error) {
      setLoading(false);
      toast.error(getFriendlyError(result.error, "Sign in failed"));
      return;
    }
    if (result.redirected) return;
    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
  };

  const signedInNotAdmin = user && !isAdmin;

  return (
    <div className="min-h-dvh bg-background flex items-center justify-center p-4">
      <div className="glass-card p-8 w-full max-w-md space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Admin sign in</h1>
          <p className="text-sm text-muted-foreground font-mono mt-1">
            Restricted area. Admins only.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={loading}
          className="w-full py-3 rounded-lg bg-foreground text-background font-display font-bold uppercase tracking-wider disabled:opacity-50 flex items-center justify-center gap-3"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
            <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.4 14.6 2.4 12 2.4 6.7 2.4 2.4 6.7 2.4 12S6.7 21.6 12 21.6c6.9 0 9.5-4.8 9.5-9.6 0-.6 0-1.2-.1-1.8H12z" />
          </svg>
          {loading ? "Signing in…" : "Continue with Google"}
        </button>

        {signedInNotAdmin && (
          <div className="text-xs font-mono text-muted-foreground border-t border-border pt-4 space-y-2">
            <p>
              Signed in as <span className="text-foreground">{user.email}</span> but this account is not an admin.
            </p>
            <button
              onClick={handleSignOut}
              className="underline hover:text-foreground"
            >
              Sign out and try another account
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
