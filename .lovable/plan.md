# Build Plan — Garap Pelan-Pelan, Pastiin Smua Work

Garapan dibagi jadi **4 fase**. Tiap task selesai → verify via screenshot/console sebelum lanjut. Dark mode tetep matrix neon, light mode tetep Gallery White.

---

## FASE 1 — Countdown & Trust (½ hari)

**Task 1.1 — Countdown Timer**
- Komponen `<CountdownBanner />` di atas Hero atau di Pricing.
- Target: end of month (auto-reset tiap bulan). Format `DD : HH : MM : SS`.
- Copy: "PROMO BULAN INI BERAKHIR DALAM" + sub "Harga naik Rp500K setelah timer habis."
- Style: hairline border, mono digits (JetBrains), accent neon/blue per theme.

---

## FASE 2 — Wow Factor (1–2 hari)

**Task 2.1 — Custom Cursor**
- Dot + ring follower, blend-mode difference. Hover-grow di link/button. Disable di touch device.

**Task 2.2 — Page Transition (Matrix wipe)**
- Overlay full-screen waktu route change, karakter katakana jatuh 400ms, lalu fade out. Pakai `framer-motion` + `AnimatePresence` di `App.tsx`.

**Task 2.3 — Hero Video Background**
- Looping muted video (low-bitrate webm) di belakang Hero, overlay gelap 60%. Fallback ke Prism shader yg udah ada kalau `prefers-reduced-motion` atau mobile.

**Task 2.4 — Scroll-snap Pricing Showcase**
- Section baru: 3 paket sebagai full-viewport snap cards, scroll horizontal di desktop / vertical di mobile.

**Task 2.5 — Interactive 3D Product**
- `react-three-fiber` rotating model (re-use .glb logo or generated sneaker) di section "Apa yang kamu dapat". Drag to rotate.

---

## FASE 3 — Functional / Backend (2 hari)

**Task 3.1 — Contact Form → Lovable Cloud**
- Table `leads (id, name, email, whatsapp, package, message, created_at)` dgn RLS (insert public, select admin only) + GRANT.
- Form di `/contact` atau modal CTA. Validasi zod + react-hook-form. Toast sukses. Email notif lewat Resend (RESEND_API_KEY udah ada) via edge function `send-lead-notification`.

**Task 3.2 — Admin Dashboard `/admin`**
- Auth (Lovable Cloud, email+password + Google).
- `user_roles` table + `has_role()` (pattern wajib).
- Page list leads (table view), filter by status, mark as contacted.

**Task 3.3 — Stripe Checkout**
- Pakai `payments--recommend_payment_provider` dulu → enable Stripe seamless.
- Edge function `create-checkout` (per paket: STARTER/PRO/ULTRA) → redirect Stripe Checkout → success page.

---

## FASE 4 — Polish (½ hari)

**Task 4.1 — Mobile Bottom Nav**
- Fixed bottom bar mobile only (`md:hidden`): Home / Pricing / Work / Contact. Active state pakai accent color. Hide saat scroll down, show saat scroll up.

**Task 4.2 — UI Sounds**
- Subtle clicks (button), whoosh (page transition), success (form submit). File MP3 kecil di `/public/sfx/`.
- Toggle mute di navbar (persist localStorage). Respect `prefers-reduced-motion` → default mute.

---

## Execution Rules
- Satu task = satu batch edit + screenshot verify.
- Dark mode unchanged kecuali ada element baru.
- No hardcoded colors; pakai semantic tokens.
- Tiap fase selesai → lapor user, baru lanjut fase berikut.
- Total estimasi: ~4 hari kerja.

---

## Order of Work
1. Task 1.1 Countdown
2. Task 4.1 Mobile bottom nav (quick win, dipake di semua test berikutnya)
3. Task 2.1 → 2.2 → 2.3 → 2.4 → 2.5
4. Task 3.1 → 3.2 → 3.3
5. Task 4.2 Sound design (terakhir biar ga ganggu dev)

Approve plan → gw mulai dari Task 1.1.
