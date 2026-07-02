# Rombak Product Page SYNC — Editorial Landing Style

Product page saat ini terlalu generik. Kita bikin ulang jadi **landing page cinematic** yang meyakinkan orang beli tema, dengan bahasa visual yang sama seperti homepage (Prism glow, chrome accent, mono type, kinetic marquee).

## Struktur baru (top → bottom)

1. **Cinematic Hero**
   - Eyebrow: `PREMIUM SHOPIFY THEME . V1.0`
   - Headline besar: `SYNC` (Syne bold, fluid clamp) + tagline `Built for streetwear, dropshippers, barbershops.`
   - CTA ganda: `Get SYNC . $98` (primary) + `Live Preview` (ghost, buka demo di new tab)
   - Floating stats mini (Sections 18 / Templates 10+ / Settings 397) reuse `HeroFloatingStats` style
   - Background: `hero-prism-fallback` glow + grid samar (konsisten homepage)

2. **Live Preview Frame**
   - MacBook mockup dari `DesktopShowcase` di-reuse, tapi isinya `<iframe>` real demo `kcklsite.myshopify.com` (bukan gambar). Lazy-load, `loading="lazy"`, fallback screenshot kalau iframe blocked.
   - Row tombol device: Desktop / Tablet / Mobile — ubah width iframe (visual toy, nggak wajib fungsional penuh)
   - Caption: `Klik, scroll, rasain sendiri. Ini toko live yang jalan pakai SYNC.`

3. **Velocity Marquee** (reuse `HomeVelocityText`)
   - Row 1: fitur unggulan (`ENTER PAGE 3D ✦ DROP COUNTDOWN ✦ LOOKBOOK BENTO ✦ MUSIC PLAYER ✦`)
   - Row 2 reverse: value props (`LIFETIME LICENSE ✦ VIP SUPPORT ✦ NO CODE ✦ SHIP IN MINUTES ✦`)

4. **Feature Bento**
   - Grid 6 kartu asymmetric mengambil dari `FEATURE_GROUPS` di `Pricing.tsx` (Customization, SYNC FX, Shopping, Marketing, Pages, Perf/SEO)
   - Tiap kartu: icon lucide + judul + 3 highlight bullet + border rotating-glow pas hover

5. **Mobile-First Showcase** (reuse `MobileFirstSection`)
   - 13 phone screenshot jalan otomatis. Copy heading disesuain: `SYNC di layar kecil. Real screens, real speed.`

6. **Testimonial Wall Animated** (reuse `HomeReviewsWall` / `ReviewsWall`)
   - Marquee dua baris (kiri↔kanan) 8–10 review pendek + nama toko + avatar inisial
   - Semua copy nulis manusiawi (bukan AI-sounding), fokus hasil: conversion, load speed, kemudahan customization

7. **Pricing Card Terpisah**
   - Reuse component `Pricing` yang sudah ada (full disclosure + toggle add-on). Anchor `#pricing`.
   - Hero CTA dan sticky mobile bar scroll ke sini.

8. **FAQ Ringkas**
   - 5 pertanyaan paling penting: refund, install, lisensi, update, support. Reuse `FAQ` accordion.

9. **Final CTA**
   - Big text `Ready to Ship?` + tombol `Get SYNC . $98` + link Live Preview. Ambient prism glow.

10. **Mobile Sticky Buy Bar** (reuse pattern `LandingStickyCTA`)
    - Bawah layar: harga live (react ke toggle add-on), tombol `Add to Cart`.

## Perubahan kode

- **New file**: `src/pages/SyncProduct.tsx` — landing komplit di atas, disusun dari komponen existing + section baru khusus.
- **New file**: `src/components/products/sync/LivePreviewFrame.tsx` — MacBook chrome + iframe + device switcher.
- **New file**: `src/components/products/sync/FeatureBento.tsx` — grid bento pakai `FEATURE_GROUPS`.
- **Refactor**: pindahin konstanta `FEATURE_GROUPS` + `STATS` dari `Pricing.tsx` ke `src/components/products/sync/features.ts` biar dipake dua tempat.
- **Route**: tambahin `/themes/sync` di `App.tsx`. Update semua link `/products` / anchor pricing yang mengarah ke tema SYNC → arahkan ke `/themes/sync`.
- **Navbar / MobileBottomNav**: menu "Themes" arahkan ke `/themes/sync` (satu-satunya tema saat ini).
- **DB**: nggak nyentuh schema. Cart tetap pakai `SYNC_CART_IDS` yang sudah ada.

## Detail teknis

- Iframe demo di-`sandbox="allow-scripts allow-same-origin allow-popups"`, height dinamis via aspect-ratio wrapper. Ada tombol "Open in new tab" karena beberapa toko Shopify block iframe embed — kalau `onError` iframe fail, fallback ke screenshot statis + overlay play button.
- Semua animasi respect `useLowPower` (marquee & bento glow di-disable saat low battery / scroll).
- Copy tanpa em-dash, tanpa titik tengah `·`, tanpa buzzword agency ("kami hadir untuk", "solusi terbaik"). Nada langsung, streetwear, jujur.
- Typography pakai `typography` tokens yang sudah ada. Warna semua via CSS var (bg/foreground/primary), no hardcoded hex.

## Yang tidak diubah

- Homepage, checkout, admin, edge functions — semua utuh.
- Komponen `Pricing.tsx` tetap dipakai (di homepage & di halaman produk). Cuma konstanta yang dipindah.
