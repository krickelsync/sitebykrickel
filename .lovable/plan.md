
# Migrate Static Landings → Admin-Editable Blocks

Tujuan: dua halaman static (`ProductAIProductStudio`, `ProductAIModelStudio`) dipecah jadi block components yang lengkap dengan animasi & background efek, dan **semuanya bisa diatur dari `/admin/products/:id`**.

---

## 1. Block components baru (di `src/components/products/landing/`)

Tiap block = komponen React standalone yang baca data dari JSON, animasi & background tetap original.

| Block type | Isi (admin fields) | Visual |
|---|---|---|
| `animated_hero` | eyebrow, title, subtitle, badge, ctaLabel, bgVariant (grid/prism/noise) | Headline animasi word-rotate, grid drift bg, scroll parallax |
| `marquee` | items[], speed, direction | ProductMarquee infinite scroll |
| `velocity_text` | text, color | ProductVelocityText scroll-reactive |
| `showcase_grid` | items[{image, caption}] | Grid bento dengan hover lift + caption |
| `before_after` | beforeImage, afterImage, label | BeforeAfterSlider |
| `reviews_wall` | columns[][{name, initials, rating, content, avatarColor}] | 2-3 kolom auto-scroll vertikal, animasi loop |
| `stats_strip` | items[{value, label}] | Counter-up on scroll |
| `big_text` | lines[], emphasisColor | Huge display text masked, fade-in stagger |
| `cta_banner` | title, subtitle, ctaLabel, bgVariant | Glass card + glow pulse |

Block lama (hero/text/image/gallery/features/video/faq) tetap jalan.

## 2. Update `LandingBlocks.tsx`

Tambah switch case untuk tiap type baru, lazy-import komponen biar bundle gak gede. Wrap masing-masing dengan `motion.section` + `whileInView` (sudah ada).

## 3. Update `useProducts.ts`

Tambah type union untuk block baru di `LandingBlock`.

## 4. Update `AdminProductEdit.tsx`

- Tambah button "+ <type>" untuk tiap block baru
- `BlockEditor` switch case baru: form sederhana per type
  - Array items: tombol add/remove/reorder
  - Image fields: input URL + upload (reuse `handleUpload` logic, output ke `cover_image` storage)
- Default factory di `addBlock()` lengkap untuk tiap type

## 5. Migrasi data 2 produk existing

SQL update `landing_content` untuk `ai-product-studio` & `ai-model-studio` — translate semua section static jadi array block JSON yang setara visual.

## 6. Hapus override route

Hapus route specific `/products/ai-product-studio` & `/products/ai-model-studio` di `App.tsx` + delete file:
- `src/pages/ProductAIProductStudio.tsx`
- `src/pages/ProductAIModelStudio.tsx`

Semua produk sekarang lewat satu route dinamis `/products/:slug` → render via `LandingBlocks`.

## 7. Animasi & background global

Background effects (grid drift, noise, prism glow) jadi opsi `bgVariant` per block — toggle dari admin via dropdown. CSS keyframe sudah ada di `index.css`.

---

## Technical Details

- Lazy-load berat block (reviews_wall, marquee) via `React.lazy` di LandingBlocks
- `BlockEditor` di-split jadi file per type kalau >300 baris (`src/components/admin/blocks/*.tsx`)
- Asset existing (portfolio images) tetap dipake — admin tinggal paste URL hasil upload atau path storage
- Migrasi SQL via tool `supabase--insert` (UPDATE jsonb), bukan migration

## Yang lo dapet
- 2 halaman lama balik 100% visually + animasi
- Lo bisa ubah headline, gambar, reviews, marquee text, dst dari `/admin` realtime tanpa nyentuh code
- Produk baru cukup tambah block-block ini → instant landing premium

---

Approve buat gw mulai garap?
