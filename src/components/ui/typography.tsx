import { cn } from "@/lib/utils";
import type { ElementType, HTMLAttributes, ReactNode } from "react";

/**
 * Typography system . reusable tokens for consistent type scale
 * across desktop & mobile. Use these instead of ad-hoc font classes
 * so headings, taglines, body, and labels stay visually balanced.
 *
 * GLOBAL GUIDELINE (locked to the Pricing card scale the user approved):
 *   Display  → 32 → 56px   (hero headlines only)
 *   H1       → 24 → 44px   (section titles . "ONE THEME.")
 *   H2       → 20 → 32px   (card / block titles)
 *   H3       → 16 → 20px   (sub-blocks, "SYNC Theme")
 *   Body     → 13 → 14px   (feature lists, descriptions)
 *   BodyLg   → 14 → 15px   (lead paragraphs)
 *   UI label → 13 → 14px   (buttons, toggles)
 *   Meta     → 11 → 12px   (hints under labels)
 *   Eyebrow  → 10 → 11px   uppercase tracking 0.2em (chips, category labels)
 *   Micro    → 10px        (mono ticker labels)
 *   Price    → 36 → 48px   (numeric display)
 *
 * Mobile-first: every token uses clamp() so the mobile floor stays
 * tight & legible like the reference, and desktop scales up smoothly
 * without breakpoint jumps. Do NOT hand-tune `text-*` per component
 * . pull from `typography` / `textSize` so the whole site stays in
 * sync with this scale.
 */

type Props<T extends ElementType> = {
  as?: T;
  className?: string;
  children: ReactNode;
} & Omit<HTMLAttributes<HTMLElement>, "className" | "children">;

// Syne maxes at 800 . use font-extrabold (800) for display, font-bold (700) for headings.
const baseDisplay = "font-display font-extrabold uppercase break-words";
const baseHeading = "font-display font-bold uppercase";

export const typography = {
  display:
    "text-[clamp(2rem,5.5vw,3.5rem)] leading-[0.95] tracking-[-0.035em]",
  h1:
    "text-[clamp(1.5rem,3.6vw,2.75rem)] leading-[1] tracking-[-0.03em]",
  h2:
    "text-[clamp(1.25rem,2.4vw,2rem)] leading-[1.1] tracking-[-0.02em]",
  h3:
    "text-[clamp(1rem,1.4vw,1.25rem)] leading-tight tracking-tight",
  tagline:
    "font-sans italic font-medium text-[clamp(0.8125rem,1.1vw,1rem)] leading-snug text-primary/90",
  body:
    "font-sans text-[clamp(0.8125rem,0.95vw,0.875rem)] leading-[1.55] text-muted-foreground",
  bodyLg:
    "font-sans text-[clamp(0.875rem,1.05vw,0.9375rem)] leading-[1.6] text-muted-foreground",
  eyebrow:
    "font-mono uppercase text-[clamp(0.625rem,0.75vw,0.6875rem)] tracking-[0.2em] text-muted-foreground",
  meta:
    "font-mono text-[clamp(0.6875rem,0.8vw,0.75rem)] tracking-wide text-muted-foreground",
  price:
    "font-syne font-bold text-foreground text-[clamp(2.25rem,4vw,3rem)] leading-none tracking-[-0.02em]",
} as const;

/**
 * Responsive text-size tokens . one source of truth for mobile↔desktop sizing.
 * Use these on inline elements (badges, CTAs, micro labels) so every screen
 * stays visually balanced without hand-tuning per component.
 */
export const textSize = {
  /** Micro UI labels: pill badges, trust row, eyebrow chips. */
  micro: "text-[clamp(0.625rem,0.7vw,0.6875rem)]",
  /** Small UI text: rating count, line-through price, captions. */
  small: "text-[clamp(0.6875rem,0.8vw,0.75rem)]",
  /** Default UI text: button labels, secondary copy. */
  ui: "text-[clamp(0.8125rem,0.95vw,0.875rem)]",
  /** Prominent inline numerics / lead labels. */
  lead: "text-[clamp(0.875rem,1vw,0.9375rem)]",
} as const;

export function Display<T extends ElementType = "h1">({ as, className, children, ...rest }: Props<T>) {
  const Tag = (as ?? "h1") as ElementType;
  return <Tag className={cn(baseDisplay, typography.display, className)} {...rest}>{children}</Tag>;
}

export function H1<T extends ElementType = "h1">({ as, className, children, ...rest }: Props<T>) {
  const Tag = (as ?? "h1") as ElementType;
  return <Tag className={cn(baseDisplay, typography.h1, className)} {...rest}>{children}</Tag>;
}

export function H2<T extends ElementType = "h2">({ as, className, children, ...rest }: Props<T>) {
  const Tag = (as ?? "h2") as ElementType;
  return <Tag className={cn(baseHeading, typography.h2, className)} {...rest}>{children}</Tag>;
}

export function H3<T extends ElementType = "h3">({ as, className, children, ...rest }: Props<T>) {
  const Tag = (as ?? "h3") as ElementType;
  return <Tag className={cn(baseHeading, typography.h3, className)} {...rest}>{children}</Tag>;
}

export function Tagline<T extends ElementType = "p">({ as, className, children, ...rest }: Props<T>) {
  const Tag = (as ?? "p") as ElementType;
  return <Tag className={cn(typography.tagline, className)} {...rest}>{children}</Tag>;
}

export function Body<T extends ElementType = "p">({ as, className, children, ...rest }: Props<T>) {
  const Tag = (as ?? "p") as ElementType;
  return <Tag className={cn(typography.body, className)} {...rest}>{children}</Tag>;
}

export function BodyLg<T extends ElementType = "p">({ as, className, children, ...rest }: Props<T>) {
  const Tag = (as ?? "p") as ElementType;
  return <Tag className={cn(typography.bodyLg, className)} {...rest}>{children}</Tag>;
}

export function Eyebrow<T extends ElementType = "span">({ as, className, children, ...rest }: Props<T>) {
  const Tag = (as ?? "span") as ElementType;
  return <Tag className={cn(typography.eyebrow, className)} {...rest}>{children}</Tag>;
}

export function Meta<T extends ElementType = "span">({ as, className, children, ...rest }: Props<T>) {
  const Tag = (as ?? "span") as ElementType;
  return <Tag className={cn(typography.meta, className)} {...rest}>{children}</Tag>;
}

export function Price<T extends ElementType = "span">({ as, className, children, ...rest }: Props<T>) {
  const Tag = (as ?? "span") as ElementType;
  return <Tag className={cn(typography.price, className)} {...rest}>{children}</Tag>;
}

/**
 * Spacing system . consistent vertical rhythm across sections.
 * Use these instead of ad-hoc `mb-*` / `py-*` so mobile and desktop
 * stay balanced without feeling crowded.
 */
export const spacing = {
  /** Gap between major page sections (Hero → Related → Landing). */
  section: "mt-16 md:mt-24",
  /** Vertical padding for full-width sections. */
  sectionY: "py-12 md:py-20",
  /** Larger vertical padding for hero / editorial sections. */
  sectionYLg: "py-20 md:py-32",
  /** Gap between a section heading and its content. */
  headingGap: "mb-6 md:mb-8",
  /** Larger heading gap for hero blocks. */
  headingGapLg: "mb-12 md:mb-16",
  /** Gap between stacked blocks inside a section. */
  blockGap: "space-y-5 md:space-y-7",
  /** Tight gap (label → value, eyebrow → title). */
  tight: "space-y-2",
  /** Grid / flex gaps. */
  gridGap: "gap-5 md:gap-7",
} as const;