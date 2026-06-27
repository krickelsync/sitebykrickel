# Shopify Reactor Hero — Integration Plan

Integrate the existing `ReactorHero` animation directly into the main `Hero` section as an interactive background layer, with tap-to-reveal feature cards.

## Scope
- Keep current Hero headline, rotating words, sub-headline, CTAs, trust badge, marquee, and floating stats **unchanged**.
- Add reactor animation as a layered visual behind/around the headline.
- Remove the standalone `ReactorHero` section from `Index.tsx` (no duplication).

## Layout

```text
Desktop:
┌─────────────────────────────────────────────┐
│  [Shopify icon] ─cable─ [Chrome bag]        │  ← reactor layer (z:3)
│                                             │
│            THEMES FOR                       │  ← existing headline (z:10)
│            CLOTHING BRAND                   │
│            sub-headline + CTAs              │
│                                             │
│   (orbit icons fly out on click)            │
└─────────────────────────────────────────────┘

Mobile:
- Reactor scaled 55%, positioned top-right corner
- Orbit disabled; icons appear as 5-dot static row below CTAs
- Tap icon → bottom sheet card
```

## Components

1. **`Hero.tsx`** — add reactor layer
   - Import `ReactorHeroLayer` (refactored from `ReactorHero`)
   - Place inside hero section at `z-[3]`, `pointer-events-auto` only on the chrome bag and icons
   - Headline gets `relative z-10` (already has it)
   - Slightly dim opacity (0.65) on headline when `stage === "orbit"` via shared state

2. **`ReactorHero.tsx`** → refactor into **`ReactorHeroLayer.tsx`**
   - Strip outer `<section>` wrapper, fixed height, and background — just the reactor canvas
   - Expose `onStageChange` callback so Hero can dim headline
   - Add `FeatureCard` reveal on icon click (only 1 active at a time)

3. **`FeatureCard.tsx`** (new) — `src/components/sections/reactor/FeatureCard.tsx`
   - Glass black-chrome card: title, benefit copy, metric, "Learn more" link
   - Desktop: positioned near clicked icon with `scale + fade + tilt 3D` entry
   - Mobile: `Sheet` from `@/components/ui/sheet` sliding from bottom
   - Auto-close on outside click or when another icon is tapped

4. **Feature data** — array of 5 items matching orbit icons:
   - Cart → "1-Click Checkout" / "+38% conversion"
   - Product → "Smart Product Pages" / "Built-in upsell"
   - Mobile → "Mobile-First" / "100/100 Lighthouse"
   - Speed → "Edge Performance" / "<1s LCP"
   - 3D → "3D & Video Showcase" / "Native support"

## Performance & A11y
- Reactor + cards skipped entirely when `useLowPower()` returns true → render static chrome bag PNG only
- `useReducedMotion` → orbit stays still, click still reveals card (no flying icons)
- Cards lazy-mount via `AnimatePresence`
- All interactive icons get `role="button"` + `aria-label` + keyboard support (`Enter`/`Space`)

## Files
- Edit: `src/components/Hero.tsx`
- Rename/refactor: `src/components/sections/ReactorHero.tsx` → `src/components/sections/reactor/ReactorHeroLayer.tsx`
- Create: `src/components/sections/reactor/FeatureCard.tsx`
- Create: `src/components/sections/reactor/features.ts` (data)
- Edit: `src/pages/Index.tsx` (remove standalone `<ReactorHero />` block + lazy import)

## Out of scope
- No changes to copy, fonts, colors, pricing, or other sections.
- No sound effects (can be added in a follow-up).
