# Product Store + Admin Panel Realtime

Tujuan: `/products` jadi katalog produk digital ala buildcleanslate. User klik produk → langsung halaman detail dengan tombol **Buy Now (PayPal)** di atas, landing page panjang di bawahnya. Lo (admin) bisa kelola produk realtime dari dashboard di web sendiri, tanpa edit code via Lovable.

---

## 1. Database (Lovable Cloud)

Tabel baru di backend:

**`products`**
- `id` (uuid), `slug` (unique), `title`, `tagline`, `description` (long text/markdown), `price`, `original_price`, `cover_image`, `gallery` (text[]), `features` (jsonb), `landing_content` (jsonb — blocks: hero, image, text, video, faq, dst), `is_published` (bool), `sort_order`, `created_at`, `updated_at`.

**`user_roles`** + enum `app_role('admin','user')` + function `has_role()` (pola standar, anti-recursive RLS).

**`orders`** (optional, recommended)
- `id`, `product_id`, `buyer_email`, `paypal_order_id`, `amount`, `status`, `created_at`.

**RLS**
- `products`: SELECT public untuk `is_published=true`; INSERT/UPDATE/DELETE hanya `has_role(auth.uid(),'admin')`.
- `user_roles`: SELECT untuk authenticated, write service_role saja.
- `orders`: insert via edge function service_role.

**Storage bucket** `product-images` (public read, admin write) untuk upload foto.

---

## 2. Auth

- Email+password + Google login.
- Lo daftar sekali → gw insert row `user_roles` (admin) untuk user_id lo via SQL.
- Tidak ada signup admin publik.

---

## 3. Halaman Frontend

```
/products              → grid katalog (dynamic dari DB)
/products/:slug        → halaman produk:
                          - Atas: gambar + harga + PayPal Buy Now (CheckoutModal existing)
                          - Bawah: landing page panjang di-render dari landing_content blocks
                            (hero, features, before/after, FAQ, testimonial, dst)
/admin/login           → login form
/admin                 → dashboard (protected, admin-only)
  - List produk + toggle publish, reorder
  - Create/Edit produk: form + block editor untuk landing_content
  - Upload gambar (drag-drop ke storage)
  - Orders log (read-only)
```

Realtime: pakai `supabase.channel().on('postgres_changes', ...)` di `/products` & `/products/:slug` supaya update di admin langsung muncul tanpa refresh.

---

## 4. Landing Page Block Renderer

`landing_content` disimpan sebagai array block JSON, contoh:
```json
[
  {"type":"hero","title":"...","image":"..."},
  {"type":"features","items":[...]},
  {"type":"gallery","images":[...]},
  {"type":"text","markdown":"..."},
  {"type":"faq","items":[...]}
]
```
Komponen `<LandingBlocks blocks={...} />` map tiap type ke komponen React. Admin tinggal add/remove/reorder block di dashboard — gak perlu touch code.

---

## 5. PayPal Flow (sudah ada)

`CheckoutModal` existing dipakai ulang, tinggal pass `productName` + `price` dari row DB. Setelah `onApprove`, edge function `record-order` insert ke `orders` + (opsional) kirim email lisensi via Resend.

---

## 6. Yang gw butuh dari lo

1. Konfirmasi mau gw mulai → gw bikin migration tabel + RLS + storage bucket + admin pages.
2. Email lo (buat di-set sebagai admin pertama).
3. Setelah backend jadi: lo set PayPal Client ID via secret (`VITE_PAYPAL_CLIENT_ID`).

---

## Catatan teknis (buat gw inget)

- Edit code di Lovable tetap dibutuhin sekali untuk bikin sistem. Setelah live, semua CRUD produk via `/admin` — gak nyentuh code lagi.
- Block editor versi pertama: form sederhana (tambah block, pilih type, isi field). Bukan WYSIWYG drag-drop full Webflow-style — itu scope gede; kalau mau ditingkatin nanti tinggal upgrade komponen editor.
- Realtime publication enable via `ALTER PUBLICATION supabase_realtime ADD TABLE public.products;`.
