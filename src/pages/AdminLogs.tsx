import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, useIsAdmin } from "@/hooks/useAuth";

type WebhookLog = {
  id: string;
  created_at: string;
  source: string;
  event: string;
  status_code: number | null;
  request_snippet: string | null;
  response_snippet: string | null;
  order_id: string | null;
};

type EmailLog = {
  id: string;
  created_at: string;
  to_email: string;
  kind: string;
  status: string;
  resend_id: string | null;
  error: string | null;
};

const AdminLogs = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const isAdmin = useIsAdmin(user?.id);
  const [tab, setTab] = useState<"webhooks" | "emails">("webhooks");
  const [webhooks, setWebhooks] = useState<WebhookLog[]>([]);
  const [emails, setEmails] = useState<EmailLog[]>([]);

  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/admin/login", { replace: true });
  }, [user, loading, navigate]);

  const load = async () => {
    const [w, e] = await Promise.all([
      supabase.from("webhook_logs").select("*").order("created_at", { ascending: false }).limit(200),
      supabase.from("email_logs").select("*").order("created_at", { ascending: false }).limit(200),
    ]);
    setWebhooks((w.data ?? []) as WebhookLog[]);
    setEmails((e.data ?? []) as EmailLog[]);
  };

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin]);

  if (loading || isAdmin === null)
    return <div className="min-h-dvh bg-background flex items-center justify-center font-mono text-sm">Loading…</div>;
  if (!isAdmin) return null;

  const statusColor = (code: number | null) => {
    if (code == null) return "text-muted-foreground";
    if (code >= 500) return "text-red-400";
    if (code >= 400) return "text-amber-400";
    if (code >= 200) return "text-emerald-400";
    return "text-muted-foreground";
  };

  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Link to="/admin" className="p-2 rounded-lg hover:bg-secondary">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="font-display text-xl font-bold uppercase tracking-wider">Logs</h1>
          <div className="flex-1" />
          <button
            onClick={load}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-xs font-mono hover:bg-secondary"
          >
            <RefreshCw className="w-3 h-3" /> Refresh
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-4 max-w-6xl">
        <div className="flex items-center gap-4">
          {(["webhooks", "emails"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`font-display text-sm uppercase tracking-wider transition-colors ${
                tab === t ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t} ({t === "webhooks" ? webhooks.length : emails.length})
            </button>
          ))}
        </div>

        {tab === "webhooks" ? (
          <div className="glass-card overflow-x-auto">
            <table className="w-full text-xs font-mono min-w-[720px]">
              <thead className="text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3">Time</th>
                  <th className="text-left px-4 py-3">Source</th>
                  <th className="text-left px-4 py-3">Event</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Response</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {webhooks.length === 0 && (
                  <tr><td colSpan={5} className="p-6 text-muted-foreground">No webhook logs.</td></tr>
                )}
                {webhooks.map((w) => (
                  <tr key={w.id} className="hover:bg-secondary/40">
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {new Date(w.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">{w.source}</td>
                    <td className="px-4 py-3">{w.event}</td>
                    <td className={`px-4 py-3 ${statusColor(w.status_code)}`}>{w.status_code ?? "."}</td>
                    <td className="px-4 py-3 max-w-md truncate text-muted-foreground" title={w.response_snippet ?? ""}>
                      {w.response_snippet ?? "."}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="glass-card overflow-x-auto">
            <table className="w-full text-xs font-mono min-w-[720px]">
              <thead className="text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3">Time</th>
                  <th className="text-left px-4 py-3">To</th>
                  <th className="text-left px-4 py-3">Kind</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Error</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {emails.length === 0 && (
                  <tr><td colSpan={5} className="p-6 text-muted-foreground">No email logs.</td></tr>
                )}
                {emails.map((e) => (
                  <tr key={e.id} className="hover:bg-secondary/40">
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {new Date(e.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">{e.to_email}</td>
                    <td className="px-4 py-3">{e.kind}</td>
                    <td className={`px-4 py-3 ${e.status === "sent" ? "text-emerald-400" : "text-red-400"}`}>{e.status}</td>
                    <td className="px-4 py-3 max-w-md truncate text-red-400" title={e.error ?? ""}>
                      {e.error ?? "."}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminLogs;