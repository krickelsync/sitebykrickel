## Gallery White — Light Mode Premium Rebuild

Mengganti light mode dari "Paper Mode" jadi **Gallery White**: pure white background, near-black ink, electric blue accent, hairline borders + soft shadows. Neon yellow di-replace total di light mode (dipertahankan hanya di dark mode sebagai brand utama).

### Palette final

| Token | Light (Gallery White) | Dark (tetap) |
|---|---|---|
| background | `#FFFFFF` / `0 0% 100%` | `#050505` |
| surface (card) | `#FAFAFA` / `0 0% 98%` | `#0D0D0D` |
| foreground | `#0A0A0A` / `0 0% 4%` | `#FFFFFF` |
| muted-foreground | `#737373` / `0 0% 45%` | `#999999` |
| primary (accent) | `#0066FF` / `218 100% 50%` electric blue | neon yellow `74 100% 50%` |
| border | `#E5E5E5` / `0 0% 90%` | `0 0% 15%` |
| ring | electric blue | neon yellow |

### Visual rules untuk Gallery White

- **No glow halos.** Neon text-shadow diganti subtle drop-shadow `0 1px 2px rgb(0 0 0 / 0.04)`.
- **Hairline borders** `1px solid #E5E5E5` di semua card/glass, bukan blur tebal.
- **Cards**: solid `bg-card` + 1px border + `shadow-sm`, no backdrop-blur in light.
- **Buttons**: primary jadi solid blue dengan hover blue-700, secondary jadi ghost dengan border.
- **Gold luxury accent** tetep gold tapi di-tone-down jadi muted gold `#B8860B` di light biar gak silau.
- **Marquee/velocity text** jadi ink hitam dengan accent blue, no neon halo.

### Task breakdown (kerjain satu-satu)

```text
1. Tokens — rewrite .light di src/index.css (palette + glow disable)
2. Glass / glow utilities — pisah behavior light vs dark
3. Hero — verify CTA, luxury gold, scroll indicator
4. Marquee + VelocityText + CurvedLoop — accent blue, no neon
5. Pricing card — premium variant blue accent, badge tone-down
6. Features + FAQ + Footer — borders & muted tones cek
7. Screenshot verify per section, polish edge cases
```

### Catatan

- Dark mode TIDAK diubah sama sekali — brand utama tetap neon matrix.
- Memory project "Balenciaga meets Matrix" hanya berlaku untuk dark mode; light mode jadi alternate "gallery/SaaS premium" identity.
- Setiap task gw verifikasi via Playwright screenshot sebelum lanjut ke task berikutnya.
- Komponen sub-page (model-studio, products) di-skip dulu — fokus landing page (Hero→Footer) sesuai scope aktif.

Setelah lo approve plan, gw mulai dari Task 1.