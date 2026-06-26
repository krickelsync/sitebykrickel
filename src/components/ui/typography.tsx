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

const baseDisplay = "font-display font-black uppercase break-words";
const baseHeading = "font-display font-bold uppercase";

export const typography = {
  display:
    "text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.92] tracking-[-0.035em]",
  h1:
    "text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] leading-[0.95] tracking-[-0.03em]",
  h2: "text-2xl md:text-3xl lg:text-4xl leading-[1.05] tracking-[-0.02em]",
  h3: "text-xl md:text-2xl leading-tight tracking-tight",
  tagline:
    "font-display italic text-sm md:text-base leading-snug text-primary/90",
  body:
    "font-mono text-[12px] md:text-[13px] leading-[1.75] tracking-wide text-muted-foreground",
  bodyLg:
    "font-mono text-[13px] md:text-sm leading-[1.7] tracking-wide text-muted-foreground",
  eyebrow:
    "font-mono font-semibold uppercase text-[10px] md:text-[11px] tracking-[0.2em] text-muted-foreground",
  meta:
    "font-mono text-[11px] md:text-xs tracking-wide text-muted-foreground",
  price: "font-mono font-bold text-primary text-lg md:text-xl leading-none",
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