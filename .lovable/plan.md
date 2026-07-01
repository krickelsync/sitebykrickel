## Plan: Full System Hardening & New Features

Urutan dari yang paling penting (bug fix) → nice-to-have. Semua bisa gw kerjain sekali jalan pas lo tidur, tapi gw pecah biar lo bisa cek satu-satu besok.

---

### PHASE 1 — Bug fix & audit (WAJIB)

**1.1 Fix `record-order` crash**
- Wrap `await req.json()` di try/catch → return 400 dengan message jelas, bukan 500.
- Tambah validasi Zod untuk seluruh body (items, buyer_email, paypal_order_id, dll).
- Log request ID biar gampang trace di edge function logs.

**1.2 End-to-end audit (gw run manual via Playwright)**
- Homepage load → cart → checkout → PayPal sandbox → success → license issued → email sent → order muncul di `/account` → order detail.
- Admin login Google → dashboard KPI → orders table → order detail drawer → install status toggle.
- Coupon apply → discount kalkulasi → PayPal charge match → `used_count` naik.
- Report semua bug yang ketemu di response akhir.

---

### PHASE 2 — Refund flow (HIGH VALUE)

**2.1 Edge function `refund-order`**
- Input: `order_id`, `reason`, optional `amount` (partial refund).
- Call PayPal Payments API v2 `/v2/payments/captures/{capture_id}/refund`.
- Call license dashboard API `POST /api/public/license/revoke` (butuh endpoint baru di project license lo — gw kasih prompt).
- Update `orders.status = 'refunded'` + `refunded_at`, `refund_amount`, `refund_reason`.
- Log ke `webhook_logs`.

**2.2 Admin UI**
- Tombol "Refund" di `OrderDetailDrawer` (dengan konfirmasi modal).
- Badge "Refunded" di orders table.
- Email otomatis ke buyer via Resend: "Your refund has been processed".

---

### PHASE 3 — Abandoned cart recovery

**3.1 Database**
- Tabel `abandoned_carts`: email, items (jsonb), subtotal, coupon_code, created_at, recovered_at, reminded_at.
- RLS: service_role only (admin bisa lihat).

**3.2 Capture logic**
- Di `CartDrawer` step checkout: begitu user isi email + belum bayar dalam 5 menit → insert row via edge function `capture-abandoned-cart`.
- Kalau order sukses → mark `recovered_at`.

**3.3 Reminder cron**
- Edge function `send-cart-reminders` (dijalankan manual via curl atau cron eksternal — Lovable Cloud gak ada pg_cron trigger otomatis, jadi gw kasih instruksi setup cron-job.org gratis).
- Kirim email Resend dengan link recovery `?recover=<token>` yang restore cart.

---

### PHASE 4 — Analytics dashboard di admin

**4.1 KPI baru**
- Conversion rate: `orders.count / cart_events.count` last 30d.
- Revenue chart (line chart 30d) — pake `recharts` yang udah ada.
- Top coupons: leaderboard by `used_count` & total discount given.
- Refund rate & MRR-ish (kalau ada repeat buyer).

**4.2 Cart tracking events**
- Tabel `cart_events` (view, add, checkout_start, purchase) — lightweight.
- Trigger dari frontend via edge function `track-event`.

---

### PHASE 5 — Resend receipt (QUICK WIN)

**5.1 Button "Resend receipt" di `/account/orders/:id`**
- Panggil edge function baru `resend-receipt` dengan `order_id`.
- Rate limit: max 3× per hari per order (simpen di `email_logs`).
- Reuse template email yang udah ada.

---

### PHASE 6 — Rate limiting & security polish

**6.1 Rate limit `record-order` & `redeem-coupon`**
- Simple in-memory Map per IP (edge function cold-start friendly) atau pake tabel `rate_limits` (ip, endpoint, count, window_start).
- 10 req/min per IP untuk `record-order`, 20/min untuk coupon validate.

**6.2 Coupon URL auto-apply**
- Di `Pricing` & `CartDrawer`: read `?code=XXX` dari URL → auto-apply saat cart dibuka.
- Tampilin toast "Coupon XXX applied — you saved $Y".

---

### PHASE 7 — Invoice PDF (OPSIONAL, kalau sempat)

- Edge function `generate-invoice` pake `jspdf` (via esm.sh).
- Include: order ID, buyer info, line items, tax breakdown, PayPal txn ID.
- Attach ke email receipt + downloadable dari `/account/orders/:id`.

---

### Yang gw SKIP (butuh keputusan lo)

- **Refund via license dashboard revoke**: butuh lo tambahin endpoint `POST /api/public/license/revoke` di project `nigggaaa`. Gw kasih prompt terpisah besok.
- **Abandoned cart cron**: Lovable Cloud gak punya scheduler built-in. Gw setup edge function-nya, tapi lo harus daftar cron-job.org (gratis) buat trigger tiap jam.
- **Invoice VAT**: kalau lo mau EU VAT compliant butuh info tax settings (registered country, VAT ID). Gw skip default → invoice tanpa tax.

---

### Delivery order (tonight)

Gw kerjain berurutan supaya kalau ada yang break, gampang trace:

1. Phase 1 (bug fix + audit) — pasti
2. Phase 5 (resend receipt) — cepet, low risk
3. Phase 6 (rate limit + coupon URL) — cepet
4. Phase 2 (refund) — medium, gw skip revoke license kalau endpoint external belum ada
5. Phase 4 (analytics) — medium
6. Phase 3 (abandoned cart) — capture-nya aja, cron setup lo kerjain
7. Phase 7 (invoice PDF) — kalau masih ada budget

Besok pagi lo dapet: list bug yang ketemu, semua fitur baru siap tes, prompt buat project license (revoke endpoint), instruksi setup cron gratis.

Approve? Atau ada yang mau di-skip/tambah dulu sebelum gw mulai?
