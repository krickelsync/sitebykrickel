import { cn } from "@/lib/utils";
import type { ElementType, HTMLAttributes, ReactNode } from "react";

/**
 * Typography system — reusable tokens for consistent type scale
 * across desktop & mobile. Use these instead of ad-hoc font classes
 * so headings, taglines, body, and labels stay visually balanced.
 *
 * Scale (modular 1.333):
 *   Display  → hero page titles
 *   H1       → section / product titles
 *   H2 / H3  → sub-sections
 *   Tagline  → editorial accent line under a title
 *   Body     → paragraph text (mono)
 *   Eyebrow  → small uppercase label / meta
 *   Price    → numeric display
 */

type Props<T extends ElementType> = {
  as?: T;
  className?: string;
  children: ReactNode;
} & Omit<HTMLAttributes<HTMLElement>, "className" | "children">;

// Syne maxes at 800 — use font-extrabold (800) for display, font-bold (700) for headings.
const baseDisplay = "font-display font-extrabold uppercase break-words";
const baseHeading = "font-display font-bold uppercase";

export const typography = {
  display:
    "text-[1.875rem] sm:text-4xl md:text-6xl lg:text-7xl leading-[0.95] tracking-[-0.035em]",
  h1:
    "text-[1.375rem] sm:text-2xl md:text-4xl lg:text-[2.75rem] leading-[1] tracking-[-0.03em]",
  h2: "text-lg sm:text-xl md:text-3xl lg:text-4xl leading-[1.1] tracking-[-0.02em]",
  h3: "text-base md:text-2xl leading-tight tracking-tight",
  tagline:
    "font-sans italic font-medium text-[12px] md:text-base leading-snug text-primary/90",
  body:
    "font-sans text-[13px] md:text-[15px] leading-[1.65] text-muted-foreground",
  bodyLg:
    "font-sans text-[14px] md:text-base leading-[1.65] text-muted-foreground",
  eyebrow:
    "font-mono font-semibold uppercase text-[9px] md:text-[11px] tracking-[0.2em] text-muted-foreground",
  meta:
    "font-mono text-[10px] md:text-xs tracking-wide text-muted-foreground",
  price: "font-mono font-bold text-primary text-base md:text-xl leading-none",
} as const;

/**
 * Responsive text-size tokens — one source of truth for mobile↔desktop sizing.
 * Use these on inline elements (badges, CTAs, micro labels) so every screen
 * stays visually balanced without hand-tuning per component.
 */
export const textSize = {
  /** Micro UI labels: pill badges, trust row, eyebrow chips. */
  micro: "text-[10px] md:text-[11px]",
  /** Small UI text: rating count, line-through price, captions. */
  small: "text-[11px] md:text-[12px]",
  /** Default UI text: button labels, secondary copy. */
  ui: "text-[12px] md:text-sm",
  /** Prominent inline numerics / lead labels. */
  lead: "text-[13px] md:text-base",
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
 * Spacing system — consistent vertical rhythm across sections.
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