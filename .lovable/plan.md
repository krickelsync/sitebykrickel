## Refactoring & Optimization Plan — SitebyKrickel

Tujuan: bikin codebase lebih rapih, cepat, aman, dan gampang dirawat tanpa ngerubah desain/UX yang udah lo suka (Hero, Prism/Liquid Chrome, Pricing card, dll gak diutak-atik visualnya).

Urutan step disusun dari **paling low-risk & high-impact** ke yang lebih berat. Tiap step bisa gw kerjain terpisah biar gampang review.

---

### STEP 1 — Codebase hygiene (low risk, foundation)

**1.1 Dead code sweep**
- Scan file gak kepake: `Logo3D`, `DesignBentoGrid`, `Prism.tsx` (udah diganti Liquid Chrome), `ExpertiseCard`, `WhyChooseCard`, `SkillBar`, `AnnouncementBar`, `ContactForm` (kalau gak dipake), `CurvedLoop`.
- Hapus asset `.asset.json` orphan.
- Purge komentar debug & `console.log` di prod path.

**1.2 Import & alias audit**
- Enforce `@/` alias di semua import (ada beberapa relative import kepanjangan).
- Remove circular imports kalau ada.

**1.3 TypeScript strictness**
- Aktifin `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns` di `tsconfig.app.json`.
- Ganti `any` yang masih nyisa (terutama di edge functions & Supabase query results) pakai `Database` types.

---

### STEP 2 — Component architecture cleanup

**2.1 Folder restructure (co-location by feature)**
```text
src/
  features/
    cart/         (CartContext, CartDrawer, CartButton, paypal-fees)
    checkout/     (PayPal wrapper, checkout logic)
    admin/        (all admin/* + pages/Admin*)
    account/      (Account, OrderDetail, buyer auth)
    landing/      (Hero, Pricing, sections/*)
  components/ui/  (shadcn only, jangan campur)
  lib/            (utilities murni)
```

**2.2 Extract oversized components**
- `Pricing.tsx` (~500+ baris): pisah jadi `PricingHero`, `PricingFeatureGroups`, `PricingAddons`, `PricingCTA`. Data feature groups pindah ke `pricing-data.ts`.
- `CartDrawer.tsx`: split jadi `CartLineItem`, `CouponInput`, `CheckoutSummary`, `SuccessView`.
- `Admin.tsx`: pecah tab jadi routes atau sub-components.

**2.3 Reusable primitives**
- `<Money value={...} />` — konsisten format currency (skrg ada `.toFixed(2)` scattered).
- `<StatusBadge status="pending|paid|refunded" />` — sekarang duplicate di 3 tempat.
- `<CopyButton value={...} />` — copy-to-clipboard reusable.
- `<EmptyState />` untuk cart/orders/admin.

---

### STEP 3 — Performance optimization

**3.1 Bundle split**
- Route-level `React.lazy` untuk `Admin*` pages, `OrderDetail`, `Showcase`, `StyleGuide`, `ProductDetail`. Admin bundle jangan ke-load buat public visitor.
- Lazy load `@paypal/react-paypal-js` — cuma inject kalau cart terbuka (skrg loaded di root).
- Lazy load Recharts (dipake cuma di Admin RevenueCharts).

**3.2 Asset optimization**
- Verify semua phone screenshots pake WebP + `loading="lazy"` + explicit `width`/`height` (biar gak CLS).
- Preload cuma hero background + first phone image.
- Add `<link rel="preconnect">` buat Supabase & PayPal origins.

**3.3 Runtime perf**
- Wrap `HeroFloatingStats`, `HomeReviewsWall`, `DesktopShowcase`, `MobileFirstSection` di `React.memo` + observer-gated (udah ada polanya).
- Debounce Lenis scroll listener (ada di `useLowPower`).
- Kill duplicate re-renders di `CartContext` — pecah jadi `CartStateContext` + `CartActionsContext` biar consumer yg cuma butuh `open()` gak re-render tiap items berubah.

**3.4 Data fetching**
- Pastikan React Query dipake konsisten (skrg ada mix useState + supabase langsung di beberapa admin page).
- Add `staleTime` sensible defaults, prefetch `/account` orders on Navbar hover.

---

### STEP 4 — Edge functions refactor

**4.1 Shared modules**
Bikin `supabase/functions/_shared/`:
- `cors.ts` — sekarang di-duplicate di semua function.
- `paypal.ts` — `accessToken()`, `verifyOrder()`, `refund()` reusable.
- `resend.ts` — email wrapper + template loader.
- `license.ts` — issue/revoke license dashboard calls.
- `logging.ts` — structured logger dgn request ID.

**4.2 record-order slim-down**
Fungsi skrg ~350 baris. Setelah extract:
- Handler tinggal orchestrate: `validate → verifyPayPal → issueLicense → upsertOrder → redeemCoupon → sendEmail`.
- Setiap step return typed result, gampang di-test.

**4.3 Rate limiting**
Tabel `rate_limits(ip, endpoint, window_start, count)` + helper `checkRateLimit()`. Terapin ke `record-order`, `refund-order`, `resend-receipt`, `send-contact-email`.

**4.4 Idempotency table**
Selain unique constraint di `paypal_order_id`, tambah `idempotency_keys` table untuk endpoint non-order (refund retries, email resends).

---

### STEP 5 — Database & security

**5.1 Schema review**
- Audit `orders` table (27 kolom!) — pisah jadi `orders` + `order_licenses` + `order_addons` (normalized) ATAU tambahin proper indexes utk kolom yang sering di-query (`buyer_email`, `status`, `created_at`, `paypal_order_id`).
- Add composite index `(status, created_at DESC)` buat admin dashboard.
- Add index `(buyer_email, created_at DESC)` buat `/account`.

**5.2 RLS audit**
- Re-run security scanner setelah refactor.
- Pastikan `webhook_logs`, `email_logs` cuma readable oleh admin (`has_role`).
- Verify `coupons` `SELECT` policy gak leak `used_count` ke public.

**5.3 Migration hygiene**
Tambah rollback comments di migration baru, dokumentasi grants pattern di `.lovable/db-conventions.md`.

---

### STEP 6 — Accessibility & UX polish

- Audit tab-order di Cart, Admin drawers, Mobile bottom nav.
- Semua interactive element punya `aria-label` (icon-only buttons).
- Focus trap di `CartDrawer`, `OrderDetailDrawer`.
- Skip-to-content link di Navbar.
- Reduced-motion respect di semua animasi non-critical (banyak yg udah, tinggal audit).

---

### STEP 7 — Testing & CI safety net

**7.1 Critical path tests**
- Unit: `paypal-fees.ts`, `revenue.ts`, coupon calc, cart reducer.
- Integration (vitest + msw): `record-order` happy path + 3 failure modes (invalid body, amount mismatch, license 404).
- E2E (Playwright script yg gw jalanin): homepage → cart → sandbox checkout → account → order detail.

**7.2 Type-check gate**
`tsgo` run di pre-commit (via lightweight `simple-git-hooks`).

---

### STEP 8 — Observability

- Structured logs di semua edge functions (JSON dgn `request_id`, `paypal_order_id`, `buyer_email` hashed).
- Add `error_logs` table + `logError()` helper. Admin bisa liat error timeline.
- Sentry alternative: pipe browser errors ke edge function `track-error` → simpan di DB (opsional).

---

### STEP 9 — Documentation

- `README.md` rewrite: architecture overview, env vars, how to run, how to deploy edge function, PayPal sandbox setup.
- `.lovable/conventions.md`: naming, folder rules, styling tokens, RLS pattern.
- Inline JSDoc di edge functions + shared utils.

---

### Execution order (rekomendasi gw)

1. **Step 1 + 2** dulu (hygiene + component split) — no functional change, aman.
2. **Step 3** (perf) — measurable win, gak nyentuh business logic.
3. **Step 4** (edge fn refactor) — high value, gw test tiap function via curl setelah split.
4. **Step 5** (DB indexes + RLS audit) — quick win.
5. **Step 6** (a11y) — pass ke award submission.
6. **Step 7 + 8 + 9** — long-term maintenance.

---

### Yang **gak** akan gw sentuh
- Desain visual Hero (Liquid Chrome, floating stats, reactor layer).
- Copywriting yang udah lo approve.
- Pricing card look & feel.
- Font stack (Plus Jakarta Sans + Syne).
- Warna & tokens di `index.css`.

---

Approve semua, atau lo mau gw mulai dari step spesifik dulu (misal cuma Step 1+2, atau langsung Step 3 buat perf)?
