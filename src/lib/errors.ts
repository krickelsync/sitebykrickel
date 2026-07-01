// Central error utilities . map raw errors from Supabase, PayPal, edge fns,
// and unknown throws into short human-friendly strings for toasts / banners.

export interface KnownError {
  message: string;
  code?: string;
}

const FRIENDLY: Array<{ match: RegExp; message: string }> = [
  { match: /network|failed to fetch|load failed|typeerror: fetch/i, message: "Network hiccup. Check your connection and try again." },
  { match: /timeout|timed out/i, message: "Request took too long. Please retry." },
  { match: /unauthor|401|jwt/i, message: "Session expired. Please sign in again." },
  { match: /forbidden|403/i, message: "You don't have permission for that action." },
  { match: /not.?found|404/i, message: "Not found. It may have been removed." },
  { match: /rate limit|429/i, message: "Too many attempts. Wait a moment and try again." },
  { match: /paypal auth failed|missing paypal credentials/i, message: "Payment service is temporarily unavailable." },
  { match: /paypal order not found/i, message: "PayPal couldn't confirm your order. Try again or contact support." },
  { match: /order not completed/i, message: "Payment wasn't completed. Please retry checkout." },
  { match: /amount mismatch/i, message: "Payment amount didn't match your cart. Refresh and try again." },
  { match: /invalid or empty json body/i, message: "Something didn't send correctly. Please retry." },
  { match: /license dashboard rejected/i, message: "License service rejected the request. Contact support." },
  { match: /license dashboard.*route missing/i, message: "License service is misconfigured. Contact support." },
  { match: /theme slug not found/i, message: "This theme isn't available right now. Contact support." },
  { match: /duplicate key|unique constraint/i, message: "Looks like that was already submitted." },
  { match: /violates row-level security/i, message: "You don't have access to that." },
];

/** Best-effort extraction of a message from anything thrown. */
export function extractErrorMessage(err: unknown): string {
  if (!err) return "";
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message;
  if (typeof err === "object") {
    const anyErr = err as {
      message?: string;
      error?: string | { message?: string };
      context?: { message?: string };
    };
    if (typeof anyErr.message === "string") return anyErr.message;
    if (typeof anyErr.error === "string") return anyErr.error;
    if (anyErr.error && typeof anyErr.error === "object" && "message" in anyErr.error) {
      return String((anyErr.error as { message?: string }).message ?? "");
    }
    if (anyErr.context?.message) return anyErr.context.message;
  }
  return "";
}

/**
 * Convert any thrown value into a short, user-safe sentence.
 * Falls back to a generic message when the raw error is empty or looks like
 * a stack trace / internal identifier.
 */
export function getFriendlyError(err: unknown, fallback = "Something went wrong. Please try again."): string {
  const raw = extractErrorMessage(err).trim();
  if (!raw) return fallback;
  for (const rule of FRIENDLY) {
    if (rule.match.test(raw)) return rule.message;
  }
  // If the message is a full stack or > 160 chars, don't dump it to the user.
  if (raw.includes("\n") || raw.length > 160) return fallback;
  return raw;
}